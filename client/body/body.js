import {ReactiveVar} from 'meteor/reactive-var'

Template.dashboard.events({
  "click .fa-compress": function (event, template) {
    let element = $(event.target).attr('class').split(' ')[1];
    let column = element.replace(/.*-/, '');
    template.$("." + element).removeClass("fa-compress").addClass("fa-expand");
    template.$("." + column + " .vertical-title").fadeIn();
    template.$("." + column + " .top").css("border-bottom", "0px dotted #ececec");
    template.$("." + column + " .top .column-title").css("visibility", "hidden");
    template.$("." + column + " .top .CSE").css("visibility", "hidden");
    template.$("." + column + " .top .tolerantiepunten").css("visibility", "hidden");
    template.$("." + column + " .top .creditsplanned").css("visibility", "hidden");
    template.$("." + column + " .top .periode").css("visibility", "hidden");
    template.$("." + column + " .traject").fadeOut();
    template.$("." + column + " .middle").fadeOut();
    template.$("." + column + " .bottom").fadeOut();
    template.$("." + column + "").css("min-width", "27px");
    template.$("." + column + "").css("max-width", "27px");

  },
  "click .fa-expand": function (event, template) {
    let element = $(event.target).attr('class').split(' ')[1];
    let column = element.replace(/.*-/, '');
    template.$("." + element).removeClass("fa-expand").addClass("fa-compress");
    template.$("." + column + " .vertical-title").fadeOut();
    template.$("." + column + " .top").css("border-bottom", "1px dotted #ececec");
    template.$("." + column + " .top .column-title").css("visibility", "visible");
    template.$("." + column + " .top .CSE").css("visibility", "visible");
    template.$("." + column + " .top .tolerantiepunten").css("visibility", "visible");
    template.$("." + column + " .top .creditsplanned").css("visibility", "visible");
    template.$("." + column + " .top .periode").css("visibility", "visible");
    template.$("." + column + " .traject").fadeIn();
    template.$("." + column + " .middle").fadeIn();
    template.$("." + column + " .bottom").fadeIn();
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

  instance.autorun(function () {
    $(".nostudent").css("display", "none");
    Session.set('Id', Meteor.default_connection._lastSessionId);
    Session.set("CSE_ijkingstoets", 0);
    Session.set("CSE_TTT", 0);
    Session.set("CSE_januari", 0);
    Session.set("CSE_juni", 0);
    Session.set("CSE_september", 0);
    Session.set("selectedCourses", undefined);
    Session.set("studentName", "");
    Session.set("creditsTaken", 0);
    Session.set("toleranceCredits", 12);


    let studentID = Session.get("student");
    let studentBoeking = Boekingen.findOne({$and: [
        {Student: studentID},
        {"Student-Voornaam(Key)": {$ne: "Undefined"}},
        {"Academischeperiode": {$ne: "IJK"}},
        {"Academischeperiode": {$ne: "TTT"}}
	    ]});
    if (studentBoeking === undefined){
      console.log("studentboeking not defined");

      $(".flex-container").css("display", 'none');
      $(".nostudent").css("display", "flex");
      return;
    }
    let studentGivenName = studentBoeking["Student-Voornaam(Key)"];
    let studentSurName = studentBoeking["Student-Familienaam(Key)"];
    let nio = studentBoeking["Nieuwi/dopleiding"];

    Session.set("studentName", studentGivenName + " " + studentSurName);

    let currentSemester = 1;
    let semesterString = "Eerste Semester";
    if (Meteor.settings.public.showJuni) {
      currentSemester = 2;
      semesterString = "Tweede Semester";

    }
    if (Meteor.settings.public.showSeptember) {
      currentSemester = 3;
      semesterString = "Tweede Semester";

    }
    Session.set('semester', currentSemester);
    Session.set("semesterString", semesterString);

    //get the CSE for the student
    var year = Session.get("Year");
    //Helpers_GetCSE comes from imports/helpers/CSE.js
    Session.set("CSE_ijkingstoets", getCSETests(studentID, "IJK", year, Session.get("program")));
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

	'NewInProgram':function () {
		let studentID = Session.get("student");
		let studentBoeking = Boekingen.findOne({$and: [{Student: studentID},{"Student-Voornaam(Key)": {$ne: "Undefined"}} ]});
		let nio = studentBoeking["Nieuwi/dopleiding"];
		if (nio === "J"){
			Session.set("new", true);
			return true

		}
		else{
			Session.set("new", false);
			return false
		}
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
        semester: "IJK",
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
        semester: "Resits",
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
  }
});

let getCSETests = function(studentid, period, year, program){
  let boekingen = Boekingen.find({$and: [{Student: studentid}, {Academischeperiode: period},{ "Score": { $ne: "#" }}, {Opleiding:program}, {Academiejaar: year}]});
  let nb = 0;
  let score = 0;
  let cse = 0;
  boekingen.forEach(function (b) {
    if (b.Score === "NA"){
      nb ++
    }
    else if (b.Score >= 0){
      nb ++;
      score += parseInt(b.Score)
    }
    else{
      console.log(b.Score)
    }
  });
  let newCse = parseInt(5*score / nb);
  if (Number.isInteger(newCse)){
    cse = parseInt(5*score / nb);
  }
  return cse;
};
