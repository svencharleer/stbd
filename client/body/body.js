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
    Session.set("CSE_ijkingstoets", getCSETests(studentID, -2, year, Session.get("program")));
    Session.set("CSE_TTT", getCSETests(studentID, "TTT", year, Session.get("program")));
    Session.set("CSE_januari", studentBoeking.CSEJanuari);
    Session.set("CSE_juni", studentBoeking.CSEJuni);
    Session.set("CSE_september", studentBoeking.CSESeptember);

    // Session.set("CSE_januari_pure", Helpers_CalculateCSE(1, year, true));
    // Session.set("CSE_juni_pure", Helpers_CalculateCSE(2, year, true));
    // Session.set("CSE_september_pure", Helpers_CalculateCSE(3, year, true));
    Session.set("CSE_Planning", Helpers_CalculateStartValues(Session.get('CSE_september_pure')));






    Meteor.call("getCreditsTaken", Session.get('student'), 1, function (err, credits) {
      Session.set('creditsTaken', credits)
    });

  })
})


Template.dashboard.helpers({
  toleranceCredits() {
    return Session.get('toleranceCredits');
  },


  totalCSE() {
    let cse = 0;
    if (Session.get("CSE_Planning") != undefined) {
      cse = Session.get("CSE_Planning").cse1 + Session.get("cse2") + Session.get("cse3") + Session.get("cse4") + Session.get("cse5");
      if (cse > 180) cse = 180;
    }
    return cse;
  },

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

let getCSETests = function(studentid, period, year, program){
  let boekingen = Boekingen.find({$and: [{Student: studentid}, {Academischeperiode: period}, {Opleiding:program}, {Academiejaar: year}]});
  let nb = 0;
  let score = 0;
  boekingen.forEach(function (b) {
    if (b.Score >= 0){
      nb ++;
      score += b.Score
    }
  });
  let cse = parseInt(5*score / nb);
  console.log(cse, score, nb)
  return cse;
};

