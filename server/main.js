import {Meteor} from 'meteor/meteor';

let currentAcademiejaar = "2016-2017";
let Boekingen = new Mongo.Collection('boekingen');

//Publish all collections
Meteor.publish('own_boekingen', function (program, studentid) {
  let own = Boekingen.find({$and: [{Student: studentid}, {Opleiding: program}, {Academiejaar: currentAcademiejaar }]});
  return own;
});

Meteor.publish('program_boekingen', function (program) {
  return Boekingen.find( {$and:[{Opleiding: program},{Academiejaar: currentAcademiejaar }]}, {fields: {"Student-Familienaam(Key)":0}});
});




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
   * Called from trajectoryperiod
   * @param semester
   * @param year
   * @returns {undefined}
   */
  getDistribution : function (semester, program) {
    //Look whick score you want to use
    let distribution = undefined;
    switch (semester){
      case -2:
      case "TTT":
        distribution =  getScoreDistribution(semester, program);
        break;
      default:
        distribution =  getSemesterCSEDistribution(semester, program);
        break;
    }
    return distribution;

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
  //todo
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

//todo
var helper_relativateDict = function (dict) {
  var resultDict = {"+0": 0, "+1": 0, "+2": 0, "N": 0};
  var sum = helper_sumDict(dict);
  for (var key in dict) {
    var counter = dict[key];
    dict[key] = Math.round((counter / sum ) * 100)
  }
  return dict;
}

//todo
var helper_sumDict = function (obj) {
  var sum = 0;
  for (var el in obj) {
    if (obj.hasOwnProperty(el)) {
      sum += parseFloat(obj[el]);
    }
  }
  return sum;
}


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

/**
 * Find the cse distribution in a semester
 * @param semester
 * @returns {{distribution: Array}}
 */
let getSemesterCSEDistribution =  function (semester, program) {
  let studentIDs = distinct(Boekingen, "Student", program);
  let cses = getCSEs(semester, studentIDs);

  //initialise dict of buckets
  var buckets = {};
  for (var i = 0; i < 10; i++) {
    buckets[i] = 0;
  }
  //For each of the 10 categories count number of occurrences
  cses.forEach(function (cse) {
    if (cse != "NULL"){
      let bucketId = parseInt(cse / 10);
      if (bucketId === 10) bucketId = 9;
      buckets[bucketId]++;
    }
  });
  console.log(buckets)
  let distribution = [];
  Object.keys(buckets).forEach(function (b) {
    distribution.push({bucket: parseInt(b), count: buckets[b]})
  });
  console.log(distribution);
  return {distribution: distribution};

};

/**
 * Make distribution of scores
 * Needed for tests before jan exams
 * @param semester
 * @param year
 * @returns {{distribution: Array}}
 */
let getScoreDistribution = function (semester, year) {
  let courses = Courses.find({semester:semester});
  let courseids = [];
  courses.forEach(function (course) {
    courseids.push(course.courseid)
  });
  let nbCourses = courseids.length;
  //Find all scores of this year without # or NA
  let scores = NewGrades.find({"$and": [{year: year}, {courseid: {$in: courseids}}, {finalscore: { "$gte": -1, "$lt": 21 } }] });


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
};
let getCSEs = function (semester, studentids) {
  let boekingen = Boekingen.find({$and: [{Student: {$in: studentids}}, {Academiejaar: currentAcademiejaar}]});
  let cses = [];
  switch (semester) {
    case "Eerste semester":
      boekingen.forEach(function (b) {
        cses.push(b.CSEJanuari)
      });
      break;
    case 2:
      boekingen.forEach(function (b) {
        cses.push(b.CSEJuni)
      })
      break;
    default:
      boekingen.forEach(function (b) {
        cses.push(b.CSESeptember)
      })
  }
  return cses;
}
/**
 * Return the CSE field based on semester
 * @param semester
 * @returns {string}
 */
let getCSE = function (semester, id) {
  let cse;
  switch (semester) {
    case "Eerste semester":
      cse = Boekingen.findOne({$and: [{Student: id }, {Academiejaar: currentAcademiejaar}]});
      cse = cse.CSEJanuari;
      break;
    case 2:
      cse = Boekingen.findOne({$and: [{Student: id }, {Academiejaar: currentAcademiejaar}]});
      cse = cse.CSEJuni;
      break;
    default:
      cse = Boekingen.findOne({$and: [{Student: id }, {Academiejaar: currentAcademiejaar}]});
      cse = cse.CSESeptember;
  }
  return cse;
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
}







