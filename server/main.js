import {Meteor} from 'meteor/meteor';

var Courses = new Meteor.Collection('generic_courses');
const Grades = new Meteor.Collection('generic_grades');
export default Grades

var CSEs = new Meteor.Collection('generic_cse');
var Students = new Mongo.Collection('generic_students');
var Historical = new Meteor.Collection('generic_history_sept');
var Ijkingstoets = new Meteor.Collection('ijkingstoets');
var Exams = new Meteor.Collection('generic_examsuccess');
var heatmap = new Meteor.Collection('heatmap');
var clicks = new Meteor.Collection('clicks');


//Publish all collections
Meteor.publish('generic_grades', function (who) {
  return Grades.find({studentid: who});
});

Meteor.publish('generic_courses', function () {
  return Courses.find();
});

Meteor.publish('generic_students', function (who) {
  return Students.find();
});

Meteor.publish("ijkingstoets", function (who) {

  return Ijkingstoets.find({student: who});
});

Meteor.publish("generic_cse", function (who) {
  return CSEs.find({studentid: who});
});

Meteor.publish("clicks", function () {
  return clicks.find({});
});


Meteor.methods({

  getDistribution: function (semester, year) {
    //Look whick score you want to use
    let distribution = undefined;
    switch (semester){
      case -2:
      case -1:
        distribution =  getScoreDistribution(semester, year);
        break;
      default:
        distribution =  getSemesterCSEDistribution(semester, year);
        break;
    }
    return distribution;

  },

  getIjkingstoetsTotalDistribution: function (year) {
    var scores = Grades.find(
      {'$and': [
        {jaar: year} ,
        {courseid: { $regex : /^"Ijkingstoets"/ }}
        ]
      });
    var buckets = {};
    for (var i = 0; i < 10; i++) {
      buckets[i] = 0;
    }
    //for each of the categories count
    scores.forEach(function (s) {
      if (s.juli == "#") {
        if (s.september == "#") {
          return;
        }
        else score = s.september;
      }
      else if (s.september == "#") {
        score = s.juli;
      }
      else {
        score = s.juli > s.september ? s.juli : s.september;
      }
      var bucketId = parseInt(score / 2);
      if (bucketId == 10) bucketId = 9; //think about this. it's because we only have 10 buckets, not 11, which would include 20 as seperate

      buckets[bucketId]++;

    })
    var distribution = [];
    Object.keys(buckets).forEach(function (b) {
      distribution.push({bucket: parseInt(b), count: buckets[b]})
    })
    return {distribution: distribution};
  },

  getTotalPointDistribution: function (args) { //this function is like semester, but not CSE, focused on scores alone
    var courses = Courses.find({semester: args[0]}).fetch();
    var courseIds = [];
    courses.forEach(function (c) {
      courseIds.push(c.courseid);
    });

    var search = {};
    var distribution = [];
    var cse = "finalscore";

    search["courseid"] = {"$in": courseIds};
    search["year"] = args[1];
    search["$and"] = [];
    var and1 = {};
    var and2 = {};
    for (var i = 0; i < 10; i++) {

      and1[cse] = {$lt: (2 + i * 2)};
      and2[cse] = {$gte: 0 + i * 2};
      if (i == 9)
        and1[cse] = {$lte: (2 + i * 2)};
      search["$and"] = [and1, and2];
      //console.log(JSON.stringify(search));

      var count = Grades.distinct("studentid", search).length
      distribution.push({bucket: i, count: count});
    }
    console.log(JSON.stringify(search));
    return {distribution: distribution};
  },
  getIjkingstoetsPointDistribution: function (args) {
    var numberPerGrades_juli = {};
    var numberPerGrades_september = {};
    console.log("ijk", args);
    //get all grades of this year
    var studentGrades = Ijkingstoets.find({jaar: args[0]});
    if (studentGrades == undefined) return null;

    studentGrades.forEach(function (student) {
      //get correct grade
      var grade = 0;
      if (student.juli != "#") {
        if (numberPerGrades_juli[student.juli] == undefined)
          numberPerGrades_juli[student.juli] = {grade: student.juli, count: 0};
        numberPerGrades_juli[student.juli].count++;
      }
      if (student.september != "#") {
        if (numberPerGrades_september[student.september] == undefined)
          numberPerGrades_september[student.september] = {grade: student.september, count: 0};
        numberPerGrades_september[student.september].count++;
      }

    });
    var min_june = Number.MAX_VALUE;
    var min_september = Number.MAX_VALUE;
    var max_june = Number.MIN_VALUE;
    var max_september = Number.MIN_VALUE;
    Object.keys(numberPerGrades_juli).forEach(function (score) {
      if (min_june > numberPerGrades_juli[score].count)
        min_june = numberPerGrades_juli[score].count;
      if (max_june < numberPerGrades_juli[score].count)
        max_june = numberPerGrades_juli[score].count;
    });
    Object.keys(numberPerGrades_september).forEach(function (score) {
      if (min_september > numberPerGrades_september[score].count)
        min_september = numberPerGrades_september[score].count;
      if (max_september < numberPerGrades_september[score].count)
        max_september = numberPerGrades_september[score].count;
    });


    numberPerGrades_juli = Object.keys(numberPerGrades_juli).map(function (key) {
      return numberPerGrades_juli[key];
    });
    numberPerGrades_september = Object.keys(numberPerGrades_september).map(function (key) {
      return numberPerGrades_september[key];
    });
    return [
      {numberPerGrades: numberPerGrades_juli, min: min_june, max: max_june},
      {numberPerGrades: numberPerGrades_september, min: min_september, max: max_september},
    ];
  }
  ,
  /**
   *
   * @param courseid
   * @param year
   * @param semester: -2,-1,0,1,2
   * @returns {{numberPerGrades, min, max, total}}
   */
  getCoursePointDistribution: function (courseid, year, semester) {
    var gradeField = "grade_try1";
    if (semester == 3) gradeField = "grade_try2";
    return helper_GetDistribution({courseid: courseid, year: year}, Grades, gradeField);
  },
  /**
   * @return {boolean} dynamic: true if dashboard is dynamic
   *
   */
  getDynamicSetting: function () {
    var dynamic = true;
    if (Meteor.settings.public.dynamic != undefined) {
      dynamic = Meteor.settings.public.dynamic;
    }
    return dynamic;
  },

  /**
   * @param {studentid} who : studentid
   * @param {integer} semester : 1-2 or default 3
   */
  getCSEProfile: function (who, semester) {
    var CSE_student = CSEs.findOne({studentid: who});
    var CSE_entry = helper_getCSEEntry(semester);
    var CSE_score = CSE_student[CSE_entry]

    var limit1 = 90;
    var limit2 = 50;
    if (Meteor.settings.public.cselimit1 != undefined && Meteor.settings.public.cselimit2 != undefined) {
      limit1 = Meteor.settings.public.cselimit1;
      limit2 = Meteor.settings.public.cselimit2;
    }
    console.log("CSE limits: " + limit1 + ' ' + limit2);
    console.log('score student: ' + CSE_score + ' in semester: ' + semester)
    var top = false;
    var middle = false;
    var low = false;

    if (CSE_score > limit1) {
      status = "green";
      top = true;
    }
    else if (CSE_score <= limit1 && CSE_score >= limit2) {
      status = "orange";
      middle = true;
    }
    else {
      status = "red";
      low = true;
    }
    // return status;
    return [top, middle, low]

  },

  //todo check if this is correct
  /**
   * @param {integer} semester : 1 - 2  or default 3
   */
  getCSEDistribution: function (semester) {
    var CSE_entry = helper_getCSEEntryStudent(semester);
    var students = Historical.find({})
    var topDict = {"+0": 0, "+1": 0, "+2": 0, "B": 0, "D": 0};
    var middleDict = {"+0": 0, "+1": 0, "+2": 0, "B": 0, "D": 0};
    var lowDict = {"+0": 0, "+1": 0, "+2": 0, "B": 0, "D": 0};

    students.forEach(function (student) {
      var cseStudent = student[CSE_entry];
      var trajectStudent = student["traject"];

      var limit1 = 90;
      var limit2 = 50;
      if (Meteor.settings.public.cselimit1 != undefined && Meteor.settings.public.cselimit2 != undefined) {
        limit1 = Meteor.settings.public.cselimit1;
        limit2 = Meteor.settings.public.cselimit2;
      }
      if (cseStudent >= limit1) {
        topDict[trajectStudent] += 1;
      }
      else if (cseStudent < limit1 && cseStudent >= limit2) {
        middleDict[trajectStudent] += 1;
      }
      else {
        lowDict[trajectStudent] += 1;
      }

    });
    topDict = helper_relativateDict(topDict);
    middleDict = helper_relativateDict(middleDict);
    lowDict = helper_relativateDict(lowDict);
    return [topDict, middleDict, lowDict];


  },

  getCreditsTaken: function (who) {
    let creditsFirst = helper_GetCreditsTakenSemester(who, 1);
    let creditsSecond = helper_GetCreditsTakenSemester(who, 2);
    return [creditsFirst, creditsSecond];


  },

  //number of courses passed, and % chance to pass all courses
  getSeptemberSuccess(nrOfCourses) {

    var result = {averageCoursesPassed: 0, percentAllPassed: 0};
    if (nrOfCourses == 0) return {averageCoursesPassed: 0, percentAllPassed: 1};
    ;
    //find all students that took courses in september, and get the number of courses they took
    var total = Exams.aggregate([
      {$match: {grade_try2: {$gte: 0}}}, {$group: {_id: "$studentid", "c": {$sum: 1}}}
    ]);
    //console.log("in sept", total);
    //find all students that took courses in september, passed them, and how many
    var passed = Exams.aggregate([
      {$match: {grade_try2: {$gte: 10}}}, {$group: {_id: "$studentid", "c": {$sum: 1}}}
    ]);
    //get all students that took exactly the same number of courses as nrOfCourses
    var studentsThatMatch = {};
    total.forEach(function (t) {
      if (t.c != nrOfCourses) return;
      studentsThatMatch[t._id] = {"t": t.c};
    })
    //console.log("studentsmatch",nrOfCourses, studentsThatMatch);
    //see how many of these students passed all their exams
    var nrPassed = 0;
    passed.forEach(function (p) {
      if (studentsThatMatch[p._id] == undefined) return; //only students with exact amount of nrOfCourses
      if (p.c != nrOfCourses) return;

      nrPassed++;
    })
    console.log("match", Object.keys(studentsThatMatch).length);
    console.log("passed", nrPassed);
    if (Object.keys(studentsThatMatch).length == 0)
      result.percentAllPassed = 0;
    else
      result.percentAllPassed = nrPassed / Object.keys(studentsThatMatch).length;
    return result;
  },
  /**
   * Find all the courses the student failed
   * @param who: studentid
   * @returns {Array}
   */
  getFailedCourses(who) {
    //find all courses the student takes
    let studentCourses = Grades.find({
      studentid: who
    }).fetch();
    courseIds = [];
    //Check if he passes course or not
    studentCourses.forEach(function (c) {
      if (c.finalscore > 9) return;
      courseIds.push(c.courseid);
    });

    //Find all failed courses
    let failedCourses = Courses.find({courseid: {$in: courseIds}}).fetch();

    //Put coursename, courseid, score and semester in result
    let result = []

    failedCourses.forEach(function (c) {
      var studentFailedCourses = Grades.findOne(
        {
          $and: [
            {studentid: who},
            {courseid: c.courseid}
          ]
        },
        {finalscore: 1}
      );
      result.push(
        {
          finalscore: studentFailedCourses.finalscore,
          studentid: who,
          courseid: c.courseid,
          semester: c.semester,
          coursename: studentFailedCourses.coursename,
          credits: c.credits
        })
    });
    return result;
  },
  /**
   * Find all the courses of the student
   * @param who
   * @returns {finalscore, studentid, courseid, semester, coursename, credits}
   */
  getStudentCourses(who) {
    //find all courses the student takes
    let studentCourses = Grades.find({
      studentid: who
    }).fetch();
    courseIds = [];
    //Check if he passes course or not
    studentCourses.forEach(function (c) {
      courseIds.push(c.courseid);
    });

    //Find all selected courses
    let courses = Courses.find({courseid: {$in: courseIds}}).fetch();

    //Put coursename, courseid, score and semester in result
    let result = []

    courses.forEach(function (c) {
      var studentFailedCourses = Grades.findOne(
        {
          $and: [
            {studentid: who},
            {courseid: c.courseid}
          ]
        },
        {finalscore: 1}
      );
      result.push(
        {
          finalscore: studentFailedCourses.finalscore,
          studentid: who,
          courseid: c.courseid,
          semester: c.semester,
          coursename: studentFailedCourses.coursename,
          credits: c.credits
        })
    });
    return result;
  },
  getRootRoute() {
    if (process.env.ROOTROUTE != undefined) {
      console.log(process.env.ROOTROUTE);
      return process.env.ROOTROUTE;
    }
    else {
      return "dev";
    }
  },


});

Meteor.startup(() => {
  if (process.env.KEY != undefined) {//console.log(process.env.KEY)
    console.log("SSL activated ", process.env.ROOTROUTE, process.env.KEY, process.env.CERT);
    SSLProxy({
      port: process.env.SSL_PORT, //or 443 (normal port/requires sudo)
      ssl: {
        key: Assets.getText(process.env.KEY),
        cert: Assets.getText(process.env.CERT),

        //Optional CA
        //Assets.getText("ca.pem")
      }

    });
  }
  else {
    console.log("process.env.KEY/CERT is not set, running without certificate/ssl");
  }


});

/**
 *
 * @param search
 * @param collection
 * @param gradeField
 * @returns {{numberPerGrades: {}, min: Number, max: Number, total: number}}
 */
var helper_GetDistribution = function (search, collection, gradeField) {
  var numberPerGrades = {};
  var total = 0;
  //get all grades of this year
  var studentGrades = collection.find(search);

  var min = Number.MAX_VALUE;
  var max = Number.MIN_VALUE;
  //console.log(studentGrades);
  studentGrades.forEach(function (student) {
    //get correct grade
    var grade = 0;
    if (student[gradeField] == "NA" || student[gradeField] == "#" || student[gradeField] == "GR") return;
    grade = parseInt(student[gradeField]);
    //Initialise the count on 0 if the first with this score
    if (numberPerGrades[grade] === undefined)
      numberPerGrades[grade] = {grade: grade, count: 0};
    numberPerGrades[grade].count++;
  });

  Object.keys(numberPerGrades).forEach(function (score) {
    if (min > numberPerGrades[score].count)
      min = numberPerGrades[score].count;
    if (max < numberPerGrades[score].count)
      max = numberPerGrades[score].count;
  });


  numberPerGrades = Object.keys(numberPerGrades).map(function (key) {
    return numberPerGrades[key];
  });
  return {numberPerGrades: numberPerGrades, min: min, max: max, total: total};
};

var helper_getCSEEntry = function (semester) {
  var cse_entry = 'cse3';
  switch (semester) {
    case 1:
      cse_entry = 'cse1';
      break;
    case 2:
      cse_entry = 'cse2';
      break;
    default:
      cse_entry = 'cse3';
  }
  return cse_entry;

};

var helper_getCSEEntryStudent = function (semester) {
  var cse_entry = 'cse_sep';
  switch (semester) {
    case 1:
      cse_entry = 'cse_jan';
      break;
    case 2:
      cse_entry = 'cse_jun';
      break;
    default:
      cse_entry = 'cse_jun';
  }
  return cse_entry;

};

var helper_relativateDict = function (dict) {
  var resultDict = {"+0": 0, "+1": 0, "+2": 0, "N": 0};
  var sum = helper_sumDict(dict);
  for (var key in dict) {
    var counter = dict[key];
    dict[key] = Math.round((counter / sum ) * 100)
  }
  return dict;
}

var helper_sumDict = function (obj) {
  var sum = 0;
  for (var el in obj) {
    if (obj.hasOwnProperty(el)) {
      sum += parseFloat(obj[el]);
    }
  }
  return sum;
}

var helper_GetDistributionFrom100 = function (search, collection, gradeField) {
  var numberPerGrades = {};
  var total = 0;
  //get all grades of this year
  var studentGrades = collection.find(search);

  var min = Number.MAX_VALUE;
  var max = Number.MIN_VALUE;
  studentGrades.forEach(function (student) {
    //get correct grade
    var grade = 0;


    if (student[gradeField] == "NA" || student[gradeField] == "#" || student[gradeField] == "GR") return;
    grade = parseInt(student[gradeField] / 5);


    //filter out the weird numbers, check later what they mean


    if (numberPerGrades[grade] == undefined)
      numberPerGrades[grade] = {grade: grade, count: 0};
    numberPerGrades[grade].count++;
  });
  Object.keys(numberPerGrades).forEach(function (score) {
    if (min > numberPerGrades[score].count)
      min = numberPerGrades[score].count;
    if (max < numberPerGrades[score].count)
      max = numberPerGrades[score].count;
  });


  numberPerGrades = Object.keys(numberPerGrades).map(function (key) {

    return numberPerGrades[key];
  });
  return {numberPerGrades: numberPerGrades, min: min, max: max, total: total};
}

var helper_GetCreditsTakenSemester = function (who, semester) {
  let credits = 0;
  // get all courseIds of student
  var studentGrades = Grades.find({studentid: who});
  var studentCourseIds = [];
  studentGrades.forEach(function (g) {
    studentCourseIds.push(g.courseid);
  })

  // Find all courses of the student
  var coursesStudent = Courses.find({
    courseid: {$in: studentCourseIds},
    semester: semester
  }).fetch();

  //Find all courses that taking a year
  var yearcoursesStudent = Courses.find({
    courseid: {$in: studentCourseIds},
    semester: 0
  }).fetch();

  coursesStudent.forEach(function (c) {
    credits += c.credits
  });
  if (semester == 2) {
    yearcoursesStudent.forEach(function (c) {
      credits += c.credits
    });
  }

  return credits;


};
/**
 * Make distribution of scores
 * @param semester
 * @param year
 * @returns {{distribution: Array}}
 */
let getScoreDistribution = function (semester, year) {
  console.log('getScoreDistribution');
  let regex = {$regex: /(Ijkingstoets|Positioneringstest|Voorkennistest)/};
  if (semester === -2) {
    regex = {$regex: /Ijkingstoets/};
  }
  else {
    regex = {$regex: /TTT/};
  }

  //Find all scores of this year without # or NA
  let scores = Grades.find({"$and": [{year: year}, {courseid: regex}, {finalscore: { "$gte": -1, "$lt": 21 } }] });


  var buckets = {};
  for (var i = 0; i < 10; i++) {
    buckets[i] = 0;
  }
  //For each of the 10 categories count number of occurrences
  scores.forEach(function (s) {
    var bucketId = parseInt(s.finalscore / 2);
    if (bucketId === 10) bucketId = 9;
    buckets[bucketId]++;
  });

  let distribution = [];
  Object.keys(buckets).forEach(function (b) {
    distribution.push({bucket: parseInt(b), count: buckets[b]})
  });
  return {distribution: distribution};
};

/**
 * Find the cse distribution in a semester
 * @param semester
 * @param year
 * @returns {{distribution: Array}}
 */
let getSemesterCSEDistribution =  function (semester, year) {
  console.log('getSemesterDistribution');
  let cse = 1;


  //Find all cses of this year without # or NA
  let cses = CSEs.find({year: year});
  var buckets = {};
  for (var i = 0; i < 10; i++) {
    buckets[i] = 0;
  }
  //For each of the 10 categories count number of occurrences
  cses.forEach(function (s) {
    let bucketId = getBucketID(s, semester);
    if (bucketId === 10) bucketId = 9;
    buckets[bucketId]++;
  });

  let distribution = [];
  Object.keys(buckets).forEach(function (b) {
    distribution.push({bucket: parseInt(b), count: buckets[b]})
  });
  return {distribution: distribution};

};

let getBucketID = function (s, semester) {
  if (semester === 1) {
    return parseInt(s.cse1 / 10);
  }
  else if (semester === 2) {
    return parseInt(s.cse2 / 10);
  }
  else {
    return parseInt(s.cse3 / 10);
  }
}


