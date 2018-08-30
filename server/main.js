import {Meteor} from 'meteor/meteor';
let _ = require('lodash');

console.log("Note: Dossi Server runs [Node 4.9.1] We are stuck in [Meteor 1.5] until we get Docker.")
console.log("We should consider everything in Mongo as a String and convert them as needed in the client.")
let currentAcademiejaar = "2017-2018";
let Boekingen = new Mongo.Collection('boekingen');
let Historic = new Mongo.Collection("doorloop");
let Tokens = new Mongo.Collection("tokens");
let Resits = new Mongo.Collection("resits");

//Publish all collections
Meteor.publish('own_boekingen', function (program, studentid) {
  let own = Boekingen.find({$and: [{Student: studentid}, {Opleiding:  program}, {Academiejaar: currentAcademiejaar }]});
  return own;
});

Meteor.publish('resits', function(){
  return Resits.find({});
});

Meteor.methods({
  /**
  *
  * @param token: password for each program
  * @returns {[boolean,[program,cselimit2, cselimit1]]}: boolean indicates if token is in dict or not
   * limit 2 is lower than limit1
  */
  getTokenInfo: function (token) {
    let tokeninfo =  Tokens.findOne({token: token})
    let result = [false, [undefined, undefined, undefined]];
    if ( tokeninfo != undefined ){
      result = [ true , [tokeninfo.Opleiding, tokeninfo.limit2, tokeninfo.limit1]]
    }
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
      case "IJK": //ijkingstoets
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
  * Get the profile (low,middle,high) based on current cse and limits
  * @param {studentid} who : studentid
  * @param {integer} semester : 1-2 or default 3
  */
  getCSEProfile: function (who, semester, limit1, limit2) {
    var studentBoeking = Boekingen.findOne({$and:[{Student: who},{Academiejaar: currentAcademiejaar },{Studiepunten: {$ne: 0}}]});
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
   *
   * @param program
   * @param semester
   * @param limit1
   * @param limit2
   * @returns {[null,null,null]}
   */
  getHistoricDistribution: function (program, semester, limit1, limit2) {
    var topDict    = {0:0, 1:0, 2:0, 99:0, NULL: 0, "-1":0, "-2":0};
    var middleDict = {0:0, 1:0, 2:0, 99:0, NULL: 0, "-1":0, "-2":0};
    var lowDict    = {0:0, 1:0, 2:0, 99:0, NULL: 0, "-1":0, "-2":0};
    let top;
    let middle;
    let low;
    [top, middle, low] = getStudentIds(program, limit1, limit2, semester);
    let topdoorloop    = Historic.find({Student: {$in: top}});
    let middledoorloop = Historic.find({Student: {$in: middle}});
    let lowdoorloop    = Historic.find({Student: {$in: low}});
    if (typeof topdoorloop.forEach == "function"){
      topdoorloop.forEach(function (student) {
        let trajectStudent = student["Doorloop:Studieduur"];
        //98 means we have no data, but he has not quited
        if (trajectStudent === 98){
	        topDict[2] += 1;
        }
        else if (trajectStudent < 0){
	        topDict[0] += 1;
        }
        else{
	        topDict[trajectStudent] += 1;
        }

      });
    }
    if (typeof middledoorloop.forEach == "function"){
      middledoorloop.forEach(function (student) {
        let trajectStudent = student["Doorloop:Studieduur"];
	      //98 means we have no data, but he has not quited
	      if (trajectStudent === 98){
		      middleDict[2] += 1;
	      }
	      else if (trajectStudent < 0){
		      middleDict[0] += 1;
	      }
	      else{
		      middleDict[trajectStudent] += 1;
	      }
      });
    }
    if (typeof lowdoorloop.forEach == "function"){
      lowdoorloop.forEach(function (student) {
        let trajectStudent = student["Doorloop:Studieduur"];
	      //98 means we have no data, but he has not quited
	      if (trajectStudent === 98){
		      lowDict[2] += 1;
	      }
	      else if (trajectStudent < 0){
		      lowDict[0] += 1;
	      }
	      else{
		      lowDict[trajectStudent] += 1;
	      }
      });
    }

    topDict    = helper_relativateDict(topDict);
    middleDict = helper_relativateDict(middleDict);
    lowDict    = helper_relativateDict(lowDict);
    return [topDict, middleDict, lowDict];
  },
  /**
  * Frank CSE Tool
  * @String: program. The selected program to filter everything.
  */
  getCSETool: function (program, cse) {
    let students = Boekingen.find({$and:[{Opleiding: program}, {"Nieuwi/dopleiding": "J"}, {Academiejaar: {$in: ["2009-2010", "2010-2011", "2011-2012", "2012-2013", "2013-2014"]}}]}).fetch();
    //let students = Boekingen.find({$and:[{Opleiding: program},{Academiejaar: {$in: ["2009-2010", "2010-2011", "2011-2012", "2012-2013"]}}]}).fetch();
    students = _.uniqBy(students, 'Student');
    //get all the students, only once.
    let studentList = [];
    let studentCSE  = [];
    let historic    = [];
    //push student's data to array.
    students.forEach(function(b){
      let cse_opt = null;
      //console.log(cse);
      if(cse == "cse1") cse_opt =  b.CSEJanuari;
      if(cse == "cse2") cse_opt =  b.CSEJuni;
      if(cse == "cse3") cse_opt =  b.CSESeptember;
      studentList.push(b.Student);
      studentCSE.push({student: b.Student, cse: cse_opt});
    });
    //push historic data to array.
    Historic.find({Student: {$in: studentList}}).forEach(function (s) {
      historic.push({student: s["Student"], year: s["Doorloop:Studieduur"]});
    });
    //merge both collections.
    let data   = _.map(historic, function(obj) {
      return _.assign(obj, _.find(studentCSE, {student: obj.student}));
    });
    //anonimize data just before sending.
    data.forEach(function(v){ delete v.student });
    return data;
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
        //console.log(process.env.ROOTROUTE);
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
      //console.log("SSL activated ", process.env.ROOTROUTE, process.env.KEY, process.env.CERT);
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
      //console.log("process.env.KEY/CERT is not set, running without certificate/ssl");
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

  let helper_getCSEEntryStudent = function (semester) {
    var cse_entry = 'CSESeptember';
    switch (semester) {
      case 1:
      cse_entry = 'CSEJanuari';
      break;
      case 2:
      cse_entry = 'CSEJuni';
      break;
      default:
      cse_entry = 'CSEJanuari';
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
    if (sum != 0){
      for (var key in dict) {
        var counter = dict[key];
        dict[key] = Math.round((counter / sum ) * 100)
      }
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
        let float = parseFloat(obj[el]);
        if (!isNaN(float)){
          sum += float ;
        }

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
  	//returns cses as a list
    let cses = getCSEs(semester, program);
    //initialise dict of buckets
    var buckets = {};
    for (var i = 0; i < 10; i++) {
      buckets[i] = 0;
    }
    //For each of the 10 categories count number of occurrences
    cses.forEach(function (cse) {
      if (cse !== "NULL" && cse > 0){
        let bucketId = parseInt((cse-1) / 10);
        if (bucketId === 10) bucketId = 9;
        buckets[bucketId]++;
      }
      else{
      	buckets[0]++;
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
  * @param program
  * @returns {{distribution: Array}}
  */
  let getScoreDistribution = function (semester, program) {
    let scores = Boekingen.find({$and:[{Academiejaar: currentAcademiejaar},{Academischeperiode:semester},{Opleiding: program},{ "Score": { $ne: "#" }}]},{fields:{Score:1}});
    var buckets = {};
    for (var i = 0; i < 10; i++) {
      buckets[i] = 0;
    }
    //For each of the 10 categories count number of occurrences
    scores.forEach(function (s) {
      if (s.Score === "NA"){
	      buckets[0]++;
      }
      else{
	      let bucketId = parseInt(s.Score / 2);
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
 * Find all cses of students of a given program in a given semester
 * @param semester Eerste semester or Tweede semester
 * @param program
 * @returns {Array}
 */
let getCSEs = function (semester, program) {
    //Find all boekingen of this year in this program that are new in the program and not a TTT or IJK (ne undefined)
    let boekingen = Boekingen.find({$and: [{Opleiding: program},{"Nieuwi/dopleiding": "J"} ,{Academiejaar:currentAcademiejaar}, {"Student-Voornaam(Key)": {$ne: "Undefined"}}]});
    let cses = [];
    switch (semester) {
      case "Eerste Semester":
        boekingen.forEach(function (b) {
          let cse = b.CSEJanuari;
          cses.push(cse)
        });
        break;
      case "Tweede Semester":
        boekingen.forEach(function (b) {
          let cse = b.CSEJuni;
          cses.push(cse)
        });
        break;
      case "Resits":
        boekingen.forEach(function (b) {
          let cse = b.CSE
          cses.push(cse)
        })
      default:
        boekingen.forEach(function (b) {
          let cse = b.CSEJanuari;
          cses.push(cse)
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
      //console.log(courseid, gradeField)
      var numberPerGrades = {};
      var total = 0;
      let allGrades  = Boekingen.find({$and:[{IDOPO : courseid},{Academiejaar: currentAcademiejaar}]});
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

    let getStudentIds = function(program, limit1, limit2, semester) {
      let years = ["2009-2010", "2010-2011", "2011-2012", "2012-2013", "2013-2014"];
      switch (semester){
        case "Eerste Semester":
          // console.log('eerste semester', program)
	        var top    = Boekingen.find({$and:[{Opleiding: program},{Academiejaar: {$in: years}},{"Nieuwi/dopleiding": "J"}, {CSEJanuari: {$gt: limit1} }]}).fetch();
          var middle = Boekingen.find({$and:[{Opleiding: program},{Academiejaar: {$in: years}},{"Nieuwi/dopleiding": "J"}, {CSEJanuari: { $gte: limit2, $lte: limit1 } }]}).fetch();
          var low    = Boekingen.find({$and:
            [{Opleiding: program},
              {Academiejaar: {$in: years}},
              {CSEJanuari: {$lt: limit2}},
              {"Nieuwi/dopleiding": "J"}
            ]}).fetch();
          break;
        default:
          var top    = Boekingen.find({$and:[{Opleiding: program},{Academiejaar: {$in: years}}, {CSEJuni: {$gt: limit1} }]});
          var middle = Boekingen.find({$and:[{Opleiding: program},{Academiejaar: {$in: years}}, {CSEJuni: { $gte: limit2, $lte: limit1 } }]});
          var low    = Boekingen.find({$and:
            [{Opleiding: program},
              {Academiejaar: {$in: years}},
              {CSEJanuari: {$lt: limit2}},
            ]});
            break;
        }
        let toplist = [];
        let midlist = [];
        let lowlist = [];
      if (typeof top.forEach == "function") {
        top.forEach(function (boeking) {
          toplist.push(boeking.Student)
        });
      }
      if (typeof middle.forEach == "function") {
        middle.forEach(function (boeking) {
          midlist.push(boeking.Student)
        });
      }
      if (typeof low.forEach == "function") {
        low.forEach(function (boeking) {
          lowlist.push(boeking.Student)
        });
      }
      return [toplist, midlist, lowlist]
      }
