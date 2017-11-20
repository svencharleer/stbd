import {Meteor} from 'meteor/meteor';

var Courses = new Meteor.Collection('generic_courses');
const Grades = new Meteor.Collection('generic_grades');
var CSEs = new Meteor.Collection('generic_cse');
var Students = new Mongo.Collection('generic_students');
var Historical = new Meteor.Collection('generic_history_sept');
var Exams = new Meteor.Collection('generic_examsuccess');
var heatmap = new Meteor.Collection('heatmap');
var clicks = new Meteor.Collection('clicks');
let AllGrades = new Meteor.Collection("all_grades");
let AllCSEs = new Meteor.Collection("all_cse");
let NewGrades = new Meteor.Collection("new_grades");



//Publish all collections
//todo check if duplication all/new/generic_grades and all_cses can be removed
Meteor.publish('generic_grades', function (program, who) {
  return Grades.find({$and: [{studentid: who}, {program: program}]});
});

Meteor.publish('all_grades', function (program) {
  return AllGrades.find({program: program}, {fields: {studentid:0}});
});

/**
 * Warning: only grades of new students
 * Used for Distributions
 */
Meteor.publish('new_grades', function (program) {
  let newGrades = NewGrades.find({$and:[{program: program},{generatiestudent: "J"}]}, {fields: {studentid:0}});
  return newGrades
});

Meteor.publish('generic_courses', function (program) {
  return Courses.find({
    program:   program
  });
});

Meteor.publish('generic_students', function (program) {
  return Students.find({
    program:   program
  });
});


Meteor.publish("generic_cse", function (program, who) {
  return CSEs.find({$and: [{program: program},{studentid: who}]});
});

/**
 * Warning: only cses of new students
 * Used for Distributions
 */
//todo fix that this only consist of cses of student nio
Meteor.publish("all_cse", function () {
  let newStudents = Students.find(
    {generatiestudent: "J"}
  );
  let studentIds = []
  newStudents.forEach(function (student) {
    studentIds.push(student.studentid)
  });
  return AllCSEs.find({studentid: {$in: studentIds}}, {fields: {studentid:0}});
});

Meteor.publish("clicks", function () {
  return clicks.find({});
});


Meteor.methods({

  getTokenInfo: function (token) {
    let dict = {
      a : ["ABA biochemie en biotechnologie (Leuv)",50,90], //ignoreLine
      b : ["ABA biologie (Leuv)",50,90], //ignoreLine
      c : ["ABA chemie (Leuv)",50,90], //ignoreLine
      d : ["ABA fysica (Leuv)",50,90], //ignoreLine
      e : ["ABA geografie (Leuv)",50,90],
      f : ["ABA geologie (Leuv)",50,90],
      g : ["ABA informatica (Leuv)",50,90],
      h : ["ABA wiskunde (Leuv)",50,90],
      i : ["ABA bio-ingenieurswetenschappen (Leuv)",50,90],
      j : ["ABA ingenieurswetenschappen (Leuv)",50,90],
      k : ["ABA ingenieurswetenschappen:architectuur (Leuv)",50,90],
      l : ["ABA biowetenschappen (Geel)",50,90],
      m : ["ABA industriele wetenschappen (Geel)",50,90],
      n : ["ABA industriele wetenschappen (Aalst)",50,90],
      o : ["ABA industriele wetenschappen (Diepenbeek)",50,90],
      p : ["ABA industriele wetenschappen (Leuven)",50,90],
      q : ["ABA industriele wetenschappen (Brugge)",50,90],
      r : ["ABA industriele wetenschappen (Sint-Katelijne-Waver)",50,90],
      s : ["ABA industriele wetenschappen (Gent)",50,90],
      t : ["SMA biowetenschappen (Geel)",50,90],
      u : ["SMA industriele wetenschappen (Geel)",50,90],
      v : ["SMA industriele wetenschappen (Aalst)",50,90],
      w : ["SMA industriele wetenschappen (Diepenbeek)",50,90],
      x : ["SMA industriele wetenschappen (Leuven)",50,90],
      y : ["SMA industriele wetenschappen (Brugge)",50,90],
      z : ["SMA industriele wetenschappen (Sint-Katelijne-Waver)",50,90],
      A : ["ABA architectuur (Gent)",50,90],
      B : ["ABA achitectuur (Brussel)",50,90],
      C : ["ABA interieurarchitectuur (Gent)",50,90],
      D : ["ABA interieurarchitectuur (Brussel)",50,90],
      E : ["ABA Geneeskunde (Leuv)",50,90],
      F : ["ABA tandheelkunde (Leuv)",50,90],
      G : ["ABA biomedische wetenschappen",50,90],
      H : ["ABA logopedische en audiologische wetenschappen",50,90],
      I : ["ABA farmaceutische wetenschappen",50,90],
      J : ["ABA TEW:handelsingenieur (Leuv)",50,90],
      K : ["ABA geschiedenis (Leuv)",50,90],
      L : ["ABA taal- en letterkunde (Leuv)",50,90]
    };
    let keys = Object.keys(dict);
    let result = [false, [undefined, undefined, undefined]];
    keys.forEach(function (key) {
      if (key == token){
        let values = dict[key];
        result = [true, values]
      }
    });
    return result;
  },
  /**
   * Calculate gradefield and call GetDistribution
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
    // console.log("CSE limits: " + limit1 + ' ' + limit2);
    // console.log('score student: ' + CSE_score + ' in semester: ' + semester)
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







