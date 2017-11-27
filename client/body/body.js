import {ReactiveVar} from 'meteor/reactive-var'

Template.dashboard.events({
  "click .fa-compress": function (event, template) {
    let element = $(event.target).attr('class').split(' ')[1];
    let column = element.replace(/.*-/, '');
    template.$("." + element).removeClass("fa-compress").addClass("fa-expand");
    template.$("." + column + " .vertical-title").fadeIn();
    template.$("." + column + " .traject").css("visibility", "hidden");
    template.$("." + column + " .bottom").css("visibility", "hidden");
    template.$("." + column + " .top").css("border-bottom", "0px dotted #ececec");
    template.$("." + column + " .top .column-title").css("visibility", "hidden");
    template.$("." + column + " .top .CSE").css("visibility", "hidden");
    template.$("." + column + " .top .tolerantiepunten").css("visibility", "hidden");
    template.$("." + column + " .top .creditsplanned").css("visibility", "hidden");
    template.$("." + column + " .top .periode").css("visibility", "hidden");
    template.$("." + column + "").css("min-width", "27px");
    template.$("." + column + "").css("max-width", "27px");

  },
  "click .fa-expand": function (event, template) {
    let element = $(event.target).attr('class').split(' ')[1];
    let column = element.replace(/.*-/, '');

    template.$("." + element).removeClass("fa-expand").addClass("fa-compress");
    template.$("." + column + " .vertical-title").fadeOut();
    template.$("." + column + " .traject").css("visibility", "visible");
    template.$("." + column + " .bottom").css("visibility", "visible");
    template.$("." + column + " .top").css("border-bottom", "1px dotted #ececec");
    template.$("." + column + " .top .column-title").css("visibility", "visible");
    template.$("." + column + " .top .CSE").css("visibility", "visible");
    template.$("." + column + " .top .tolerantiepunten").css("visibility", "visible");
    template.$("." + column + " .top .creditsplanned").css("visibility", "visible");
    template.$("." + column + " .top .periode").css("visibility", "visible");
    template.$("." + column + "").css("max-width", "var(--ColumnWidth)");
    template.$("." + column + "").css("min-width", "var(--ColumnWidth)");

  },

  "click .button": function (event, template) {
    let started = template.started.get();
    if (started) {
      event.target.value = "Start session";
      template.started.set(false);

    }
    else {
      event.target.value = "Stop session";
      template.started.set(true);
    }

  }
});

Template.dashboard.onCreated(function () {

  this.started = new ReactiveVar(false);
  var instance = this;


  if (Meteor.settings.public.logging) {
    $(".button").css("display", 'flex');
    Session.set('mouseX', 0);
    Session.set('mouseY', 0);
    Session.set('lastMove', Date.now())
  }

  instance.autorun(function () {
    $(".nostudent").css("display", "none")
    Session.set('Id', Meteor.default_connection._lastSessionId);
    Session.set("CSE_januari", 0);
    Session.set("CSE_juni", 0);
    Session.set("CSE_september", 0);
    Session.set("selectedCourses", undefined);
    Session.set("studentName", "");
    Session.set("creditsTaken", 0);
    Session.set("toleranceCredits", 12);


    let studentID = Session.get("student");
    let studentBoeking = Boekingen.findOne({Student: studentID});
    let studentGivenName = studentBoeking["Student-Voornaam(Key)"];
    let studentSurName = studentBoeking["Student-Familienaam(Key)"];
    let nio = studentGivenName["Nieuwi/dopleiding"];
    if (studentSurName == undefined) {
      // $(".nostudent").show();
      $(".nostudent").css("display", "flex");

      $(".flex-container").css("display", 'none');
      return;
    }
    Session.set("studentName", studentGivenName + " " + studentSurName);
    if (nio == "J"){
      Session.set("new", true);
    }
    else{
      Session.set("new", false);
    }

    let currentSemester = 1;
    if (Meteor.settings.public.showJuni) {
      currentSemester = 2;
    }
    if (Meteor.settings.public.showSeptember) {
      currentSemester = 3;
    }
    Session.set('semester', currentSemester);



    //get the CSE for the student
    var year = Session.get("Year");
    //Helpers_GetCSE comes from imports/helpers/CSE.js
    // Session.set("CSE_ijkingstoets", Helpers_GetCSE(studentID, -2, year));
    // Session.set("CSE_TTT", Helpers_GetCSE(studentID, -1, year));
    Session.set("CSE_januari", studentBoeking.CSEJanuari);
    Session.set("CSE_juni", studentBoeking.CSEJuni);
    Session.set("CSE_september", studentBoeking.CSESeptember);

    // Session.set("CSE_januari_pure", Helpers_CalculateCSE(1, year, true));
    // Session.set("CSE_juni_pure", Helpers_CalculateCSE(2, year, true));
    // Session.set("CSE_september_pure", Helpers_CalculateCSE(3, year, true));
    Session.set("CSE_Planning", Helpers_CalculateStartValues(Session.get('CSE_september_pure')));



    //get failed courses
    /**
     * Sven //todo
     */
    // Meteor.call("getFailedCourses", Session.get("student"), function (err, data) {
    //   //set them up for selection
    //   var selectedCourses = {};
    //   data.forEach(function (f) {
    //     selectedCourses[f.courseid] = {id: f.courseid, course: f, checked: true};
    //   })
    //   Session.set("failedCourses", selectedCourses);
    //   Session.set("Fails", data.length > 0 ? true : false);
    //   //console.log("fails set to " + Session.get("Fails"));
    //
    //   if ($(".loading-screen")) $(".loading-screen").hide();
    // });
    // Session.set("selectedCourses", Boekingen.find({Student: studentID}))


    Meteor.call("getCreditsTaken", Session.get('student'), 1, function (err, credits) {
      Session.set('creditsTaken', credits)
    });

  })
})


Template.dashboard.helpers({
  toleranceCredits() {
    return Session.get('toleranceCredits');
  },
  // courses() {
  //   return Boekingen.find({fields: {OPOID: 1}})
  // },
  // ttt() {
  //   return Boekingen.find({Academischeperiode: "TTT"},{fields: {OPOID: 1}})
  // },
  // january() {
  //   return Boekingen.find({Academischeperiode: "Eerste Semester"},{fields: {OPOID: 1}})
  // },
  // june() {
  //   return Boekingen.find({Academischeperiode: "Tweede Semester"},{fields: {OPOID: 1}})
  // },
  //
  // studentGrade(studentid, courseid) {
  //   return Boekingen.find({OPOID: courseid},{fields: {Score: 1}})
  // },
  //
  // studentCourses(semester, failedOnly, gradetry) {
  //
  //   var results = [];
  //   var searchTerm = {semester: semester};
  //   var courses = Courses.find(searchTerm, {sort: {semester: 1, coursename: 1}});
  //   if (semester == 2) {
  //     courses = Courses.find({$or: [{semester: 0}, {semester: 2}]}, {sort: {semester: 1, coursename: 1}});
  //   }
  //   var testStudent = Grades.findOne();
  //   if (testStudent == undefined || testStudent.studentid != Session.get("student")) {
  //     //console.log(testStudent.student, Session.get("student"));
  //     return results;
  //   }
  //   courses.forEach(function (j) {
  //     var search = {};
  //     var result = Grades.findOne({courseid: j.courseid});
  //     if (result == undefined) return;
  //     var score = gradetry != 2 ? result.grade_try1 : result.grade_try2;
  //
  //     //console.log("in the courses" + result.student);
  //     if (failedOnly == true && score >= 10) return;
  //     if (score == "#") return;
  //     //hack for TTT
  //     if (score == "NA" && semester == 0) return;
  //     results.push({
  //       id: j.courseid,
  //       name: j.coursename,
  //       grade: score,
  //       realGrade: score,
  //       semester: gradetry != 2 ? semester : 3,
  //       credits: parseInt(j.credits)
  //     });
  //
  //   })
  //   return results;
  //
  // },
  //
  // coursesLeft(sem) {
  //   var results = [];
  //   var courses = Courses.find({semester: sem}, {sort: {semester: 1, coursename: 1}});
  //   if (sem == 2) {
  //     courses = Courses.find({$or: [{semester: 0}, {semester: 2}]}, {sort: {semester: 1, coursename: 1}});
  //   }
  //   var testStudent = Grades.findOne();
  //   if (testStudent == undefined || testStudent.studentid != Session.get("student")) {
  //     //console.log(testStudent.student, Session.get("student"));
  //     return results;
  //   }
  //   courses.forEach(function (j) {
  //     // console.log(j)
  //     var search = {};
  //     var result = Grades.findOne({courseid: j.courseid});
  //     if (result == undefined) return;
  //     var score = "#";
  //     score = result.finalscore;
  //     var try1 = result.grade_try1;
  //     var try2 = result.grade_try2;
  //
  //
  //     //console.log("in the courses" + result.student);
  //     if (score >= 10) return;
  //     //if(score == "#") return;
  //     results.push({
  //         id: j.courseid,
  //         name: j.coursename,
  //         grade: score,
  //         realGrade: score,
  //         semester: 2,
  //         try1: try1,
  //         try2: try2,
  //         credits: parseInt(j.credits)
  //       }
  //     );
  //
  //   })
  //   // console.log('results')
  //   // console.log(results)
  //   return results;
  // },

  // ijkingstoetsen() {
  //   console.log('ijkingstoetsen')
  //   var ijkingstoetsen = Ijkingstoets.findOne();
  //   if (ijkingstoetsen == undefined) return;
  //   if (ijkingstoetsen.student != Session.get("student")) {
  //     return [];
  //   }
  //   var juli =
  //     {
  //       id: "ijkingstoets_juli",
  //       name: "IJkingstoets juli",
  //       grade: ijkingstoetsen.juli,
  //       realGrade: ijkingstoetsen.juli,
  //       credits: 0
  //     };
  //   var september =
  //     {
  //       id: "ijkingstoets_september",
  //       name: "IJkingstoets september",
  //       grade: ijkingstoetsen.september,
  //       realGrade: ijkingstoetsen.september,
  //       credits: 0
  //     };
  //   var results = [];
  //   var nrOfIjk = 0;
  //   if (Meteor.settings.public.ijkingstoets_juli == true) {
  //     results.push(juli);
  //     nrOfIjk++;
  //   }
  //   if (Meteor.settings.public.ijkingstoets_september == true) {
  //     results.push(september);
  //     nrOfIjk++;
  //   }
  //   if (nrOfIjk == 1)
  //     results[0].name = "Ijkingstoets";
  //
  //
  //   return results;
  // },

  totalCSE() {
    let cse = 0;
    if (Session.get("CSE_Planning") != undefined) {
      cse = Session.get("CSE_Planning").cse1 + Session.get("cse2") + Session.get("cse3") + Session.get("cse4") + Session.get("cse5");
      if (cse > 180) cse = 180;
    }
    return cse;
  },


  // failedCourses() {
  //   var courses = [];
  //   var selectedCourses = Session.get("selectedCourses");
  //   if (selectedCourses == undefined) return courses;
  //   Object.keys(selectedCourses).forEach(function (i) {
  //
  //     courses.push({
  //       id: selectedCourses[i].course.idopleidingsond,
  //       name: Courses.findOne({_id: selectedCourses[i].course.idopleidingsond}).name,
  //       grade: selectedCourses[i].course.scorenajuni,
  //       realGrade: selectedCourses[i].course.scorenajuni
  //     });
  //   })
  //
  //   return courses;
  // },
  //
  // Fails() {
  //   return Session.get("Fails");
  // },

  ShowJuni() {
    return Meteor.settings.public.showSeptember != undefined ? Meteor.settings.public.showJuni : false;

  },
  ShowSeptember() {
    return Meteor.settings.public.showSeptember != undefined ? Meteor.settings.public.showSeptember : false;

  },
  'GetPeriod':function(number){
    var r = [{period: "ijkingstoets"}, {period: "TTT"}, {period: "januari"}, {period: "juni"}, {period: "september"}];
    return r[number]
  },

  /**
   *
   * @param number: Indicates the index of the column
   * @returns {{class, period, percent, raw, credits, title, subTitle, columnindex}|*}
   * @constructor
   */
  'GetColumnInfo':function (number) {
    var r = [
      {
        title: "Ijkingstoets",
        semester: -2,
        class: "column-odd",
        period: "ijkingstoets",
        percent: undefined,
        raw: undefined,
        credits: undefined,
        subTitle: undefined,
        columnindex: 0
      },
      {
        title: "Tussentijdse testen",
        semester: "TTT",
        class: "column-even col1",
        period: "TTT",
        percent: undefined,
        raw: undefined,
        credits: undefined,
        subTitle: undefined,
        columnindex: 1
      },
      {
        title: "Januari",
        semester: "Eerste Semester",
        class: "column-odd col2",
        period: "januari",
        percent: Session.get("CSE_januari"),
        raw: Session.get("CSE_januari_pure"),
        credits: Session.get("creditsTaken")[0],
        subTitle: "Eerste examenperiode",
        columnindex: 2
      },
      {
        title: "Juni",
        semester: "Tweede Semester",
        class: "column-even",
        period: "juni",
        percent: Session.get("CSE_juni"),
        raw: Session.get("CSE_juni_pure"),
        credits: Session.get("creditsTaken")[0] + Session.get("creditsTaken")[1],
        subTitle: "Tweede examenperiode",
        columnindex: 3
      },
      {
        title: "September",
        semester: 3,
        class: "column-odd",
        period: "september",
        percent: Session.get("CSE_september"),
        raw: Session.get("CSE_september_pure"),
        credits: Session.get("creditsTaken")[0] + Session.get("creditsTaken")[1],
        title: "September",
        subTitle: "Derde examenperiode",
        columnindex: 4
      },
    ];
    return r[number]
  },




});


