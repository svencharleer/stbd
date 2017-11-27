import {Meteor} from 'meteor/meteor';

let currentAcademiejaar = "2016-2017";
let Boekingen = new Mongo.Collection('boekingen');
let Historic = new Mongo.Collection("doorloop");

//Publish all collections
Meteor.publish('own_boekingen', function (program, studentid) {
  let own = Boekingen.find({$and: [{Student: studentid}, {Opleiding: program}, {Academiejaar: currentAcademiejaar }]});
  return own;
});


// Meteor.publish('program_boekingen', function (program) {
//   return Boekingen.find( {$and:[{Opleiding: program},{Academiejaar: currentAcademiejaar }]}, {fields:{Student:0, Aanlognummer:0, "Student-Familienaam(Key)":0}});
// });




Meteor.methods({
  /**
   *
   * @param token: password for each program
   * @returns {[boolean,[program,cselimit1, cselimit2]]}: boolean indicates if token is in dict or not
   */
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
   * Method that splits the calls for the distribution
   * into calls to csedistribution and scoredistribution
   * Called from trajectoryperiod, needed to be in server
   * because you need studentids + a lot of entries
   * @param semester
   * @param program
   * @returns {undefined}
   */
  getDistribution : function (semester, program) {
    //Look whick score you want to use
    let distribution = undefined;
    switch (semester){
      case -2: //ijkingstoets
      case "TTT": ///a TTT test
        distribution =  getScoreDistribution(semester, program);
        break;
      default:
        distribution =  getSemesterCSEDistribution(semester, program);
        break;
    }
    return distribution;

  },
  /**
   * Calculate gradefield and call GetDistribution
   * @param courseid
   * @param year
   * @param semester: -2,-1,0,1,2,3: for which semester you want the distribution
   * @returns {{numberPerGrades, min, max, total}}
   */
  getCoursePointDistribution : function (courseid, semester) {
    let gradeField = "Score";
    if (semester === 3){ //only in resits you need the score of that specific period
      gradeField = "ScoreSeptember";
    }
    return getCoursePointDistributionSemester(courseid, gradeField);
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
  getCSEProfile: function (who, semester, limit1, limit2) {
    var studentBoeking = Boekingen.findOne({$and:[{Student: who},{Academiejaar: currentAcademiejaar }]});
    var CSE_entry = helper_getCSEEntry(semester);
    var CSE_score = studentBoeking[CSE_entry];


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
  getHistoricDistribution: function (program, semester, limit1, limit2) {
    let CSE_entry = "Jaar X: CSE";
    // var CSE_entry = helper_getCSEEntryStudent(semester);
    var students = Historic.find({$and: [{"Generatiestudent ?": "J" },{"Jaar X: Opleiding": program}]} );
    var topDict = {0:0, 1:0, 2:0, NULL: 0, "-1":0};
    var middleDict = {0:0, 1:0, 2:0, NULL: 0, "-1":0};
    var lowDict = {0:0, 1:0, 2:0, NULL: 0, "-1":0};

    students.forEach(function (student) {
      let cseStudent = student[CSE_entry];
      let trajectStudent = student["Doorloop: Studieduur"];

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
    let creditsFirst = helper_GetCreditsTakenSemester(who, "Eerste Semester");
    let creditsSecond = helper_GetCreditsTakenSemester(who, "Tweede Semester");
    return [creditsFirst, creditsSecond];


  },

  /**
   * Sven
   * @param nrOfCourses
   * @returns {{averageCoursesPassed: number, percentAllPassed: number}}
   */
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
    if (Object.keys(studentsThatMatch).length == 0)
      result.percentAllPassed = 0;
    else
      result.percentAllPassed = nrPassed / Object.keys(studentsThatMatch).length;
    return result;
  },

  /**
   * Find all the courses the student failed
   * @param studentid: studentid
   * @returns {Array}
   */
  getFailedCourses(studentid) {
    let failedCourses = Boekingen.find(
      {$and:
        [
          {Student: studentid},
          { $not: { $gt: 10 } },
          {Academiejaar: currentAcademiejaar }
        ]
      });
    return failedCourses;
  },
  /**
   * Find all the courses of the student
   * @param studentid
   * @returns
   */
  getStudentCourses(studentid) {
    return Boekingen.find({$and:[{Student: studentid},{Academiejaar: currentAcademiejaar }]})
  },
  /*
  Sven
   */
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

/**
 * Sven
 */
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
 * @param semester
 * @returns cse_entry: fieldname of the db
 */
let helper_getCSEEntry = function (semester) {
  var cse_entry = 'CSE';
  switch (semester) {
    case 1:
      cse_entry = 'CSEJanuari';
      break;
    case 2:
      cse_entry = 'CSEJuni';
      break;
    default:
      cse_entry = 'CSESeptember';
  }
return cse_entry;

};

//todo remove?
let helper_getCSEEntryStudent = function (semester) {
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

/**
 * Transform dict from absolute to relative values
 * @param dict
 * @returns {*}
 */
var helper_relativateDict = function (dict) {
  var sum = helper_sumDict(dict);
  for (var key in dict) {
    var counter = dict[key];
    dict[key] = Math.round((counter / sum ) * 100)
  }
  return dict;
}

/**
 * Get the total number of students
 * sum of all values
 * @param obj
 * @returns {number}
 */
let helper_sumDict = function (obj) {
  var sum = 0;
  for (var el in obj) {
    if (obj.hasOwnProperty(el)) {
      sum += parseFloat(obj[el]);
    }
  }
  return sum;
};


/**
 * Calculate number of credits taken
 * @param who
 * @param semester
 * @returns {number}
 */
var helper_GetCreditsTakenSemester = function (who, semester) {
  let credits = 0;
  // get all courseIds of student
  var studentBoekingen = Boekingen.find({$and: [{studentid: who}, {Academischeperiode: semester},{Academiejaar: currentAcademiejaar }]});
  studentBoekingen.forEach(function (b) {
    credits += parseInt(b.Studiepunten)
  });

  //ugly fix for courses of semester Academiejaar that we show in semester 2
  if (semester === "Tweede Semester"){
    var jaarBoekingen = Boekingen.find({$and: [{studentid: who}, {Academischeperiode: "Academiejaar"},{Academiejaar: currentAcademiejaar }]});
    jaarBoekingen.forEach(function (b) {
      credits += parseInt(b.Studiepunten)
    });
  }
  return credits;


};

//
//FUNCTIONS NEEDED FOR DISTRIBUTION
//Called from getDistribution
//Template Trajectory
//
/**
 * Find the cse distribution in a semester
 * @param semester
 * @returns {{distribution: Array}}
 */
let getSemesterCSEDistribution =  function (semester, program) {
  // let studentIDs = distinct(Boekingen, "Student", program);
  let cses = getCSEs(semester, program);

  //initialise dict of buckets
  var buckets = {};
  for (var i = 0; i < 10; i++) {
    buckets[i] = 0;
  }
  //For each of the 10 categories count number of occurrences
  cses.forEach(function (cse) {
    if (cse != "NULL"){
      console.log(cse)
      let bucketId = parseInt(cse / 10);
      if (bucketId === 10) bucketId = 9;
      buckets[bucketId]++;
    }
  });
  let distribution = [];
  Object.keys(buckets).forEach(function (b) {
    distribution.push({bucket: parseInt(b), count: buckets[b]})
  });
  return {distribution: distribution};

};

/**
 * Make distribution of scores
 * Needed for tests before jan exams
 * @param semester
 * @param year
 * @returns {{distribution: Array}}
 */
let getScoreDistribution = function (semester, program) {
  let scores = Boekingen.find({$and:[{Academiejaar: currentAcademiejaar},{Opleiding: program},{Score: { "$gte": -1, "$lt": 21 } }]},{fields:{Score:1}});

  var buckets = {};
  for (var i = 0; i < 10; i++) {
    buckets[i] = 0;
  }
  //For each of the 10 categories count number of occurrences
  scores.forEach(function (s) {
    var bucketId = parseInt(s.Score / 2);
    if (bucketId === 10) bucketId = 9;
    buckets[bucketId]++;
  });

  let distribution = [];
  Object.keys(buckets).forEach(function (b) {
    distribution.push({bucket: parseInt(b), count: buckets[b]})
  });
  return {distribution: distribution};
};


let getCSEs = function (semester, program) {
  // let boeking = Boekingen.findOne({$and: [{Student: {$in: studentids}},{"Nieuwi/dopleiding": "J"} ,{Academiejaar:currentAcademiejaar}]});
  let boekingen = Boekingen.find({$and: [{Opleiding: program},{"Nieuwi/dopleiding": "J"} ,{Academiejaar:currentAcademiejaar}]});
  let cses = [];
  switch (semester) {
    case "Eerste semester":
      boekingen.forEach(function (b) {
        let cse = b.CSEJanuari;
        if (cse != undefined & cse > 0){
          cses.push(cse)
        }

      });
      break;
    case "Tweede semester":
      boekingen.forEach(function (b) {
        let cse = b.CSEJuni;
        if (cse != undefined & cse > 0){
          cses.push(cse)
        }
      });
      break;
    default:
      boekingen.forEach(function (b) {
        let cse = b.CSEJanuari;
        if (cse != undefined & cse > 0){
          cses.push(cse)
        }
      });
      break;
  }
  return cses;
};

let distinct = function(collection, field, program) {
  return _.uniq(
    collection.find(
      {$and: [
        {"Nieuwi/dopleiding" : "J"},
        {Academiejaar: currentAcademiejaar},
        {Opleiding: program}
      ]}
      ,
      {sort: {[field]: 1}}
    )
      .fetch()
      .map(x => x[field])
    , true);
};


//
//FUNCTIONS NEEDED FOR COURSEDISTRIBUTION
//


/**
 * Return the distribution of the course
 * @param courseid
 * @param year
 * @param gradeField
 * @returns {{numberPerGrades: {}, min: Number, max: Number, total: number}}
 */
let getCoursePointDistributionSemester = function (courseid, gradeField) {
  var numberPerGrades = {};
  var total = 0;
  let allGrades  = Boekingen.find({IDOPO : courseid});
  var min = Number.MAX_VALUE;
  var max = Number.MIN_VALUE;
  allGrades.forEach(function (student) {
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







