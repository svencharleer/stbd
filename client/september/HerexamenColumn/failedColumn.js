import { ReactiveVar } from 'meteor/reactive-var'

Template.failedColumn.created = function() {
  this.failed   = new ReactiveVar(0);
  this.selected = new ReactiveVar(0);
  let courses = Boekingen.find({$and:[{Student: Session.get("student")}, {Score: {$lt: 10}}]});
  //Checkboxes start all checked at max number of failed courses.
  this.selected.set(courses.count());
  // CSE bar needs percentage
  let credits = 0;
  courses.fetch().forEach(function (p) {
      credits += parseInt(p.Studiepunten);
  });
  Session.set("checkedCSE",credits);
  Session.set("numChecked",courses.count());
};

Template.failedColumn.helpers({
  "eersteCourses":function () {
    return Boekingen.find({$and:[{Academischeperiode: "Eerste Semester"},{Student: Session.get("student")}, {Score: {$lt: 10}}]}).fetch();
  },
  "tweedeCourses":function () {
    return Boekingen.find({$and:[{Academischeperiode: "Tweede Semester"},{Student: Session.get("student")}, {Score: {$lt: 10}}]}).fetch();
  },
  "checked": function () {
    return Template.instance().selected.get();
  },
  "failed": function () {
    return Boekingen.find({$and:[{Student: Session.get("student")}, {Score: {$lt: 10}}]}).count();
  },
  "percent": function() {
    let cPassFirst  = creditsPassed("Eerste Semester");
    let cPassSecond = creditsPassed("Tweede Semester");
    let cFirst  = credits("Eerste Semester");
    let cSecond = credits("Tweede Semester");
    let checkedCSE = Session.get("checkedCSE");
    return Math.round(((cPassFirst+cPassSecond+checkedCSE)/(cFirst + cSecond)) * 100);
  },
  "csecheck":function() {
    let cPassFirst  = creditsPassed("Eerste Semester");
    let cPassSecond = creditsPassed("Tweede Semester");
    let checkedCSE = Session.get("checkedCSE");
    return cPassFirst+cPassSecond+checkedCSE;
  },
  "csesum":function() {
    let cFirst  = credits("Eerste Semester");
    let cSecond = credits("Tweede Semester");
    return cFirst + cSecond;
  }
});

Template.failedColumn.events({
  'click paper-checkbox': function(e, template) {
    template.selected.set(document.querySelectorAll('paper-checkbox[checked]').length);
    Session.set("numChecked",document.querySelectorAll('paper-checkbox[checked]').length);
    // Extract the CSE from the HTML.
    let stpTotal = 0;
    $(".failbox").each(function(index) {
      let stp = parseInt($(this).find(".credits").text().replace(/\D/g,''));
      let isT = $(this).has('paper-checkbox[checked]').length;
      if(isT > 0) stpTotal += stp;
    });
    Session.set("checkedCSE",stpTotal);
  }
});

let credits = function (semester) {
  let all = Boekingen.find(
    {$and:[
      {Student:Session.get("student")},
      {Academischeperiode: semester},
    ]},
    {fields: {Studiepunten: 1}}
  );
  let creditsPassed = 0;
  all.forEach(function (p) {
    creditsPassed += parseInt(p.Studiepunten);
  });
  return creditsPassed;
};

let creditsPassed = function (semester) {
  let scorefield = getScoreEntry(semester);
  let all = Boekingen.find(
    {$and:[
      {Student:Session.get("student")},
      {Academischeperiode: semester},
    ]}
  );
  let creditsPassed = 0;
  all.forEach(function (p) {
    if (p[scorefield] > 9 || p[scorefield] == "G"){
      creditsPassed += parseInt(p.Studiepunten);
    }
  });
  return creditsPassed;
};

/**
 *
 * @param semester
 * @returns cse_entry: fieldname of the db
 */
let getCSEEntry = function (semester) {
  var cse_entry = 'CSE';
  switch (semester) {
    case "Eerste Semester":
      cse_entry = 'CSEJanuari';
      break;
    case "Tweede Semester":
      cse_entry = 'CSEJuni';
      break;
    default:
      cse_entry = 'CSESeptember';
  }
  return cse_entry;

};

/**
 *
 * @param semester
 * @returns cse_entry: fieldname of the db
 */
let getScoreEntry = function (semester) {
  var cse_entry = 'Score';
  switch (semester) {
    case "Eerste Semester":
      cse_entry = 'Scorejanuari';
      break;
    case "Tweede Semester":
      cse_entry = 'Scorejuni';
      break;
    default:
      cse_entry = 'Scoreseptember';
  }
  return cse_entry;

};
