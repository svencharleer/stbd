import { ReactiveVar } from 'meteor/reactive-var'

Template.failedColumn.created = function() {
  this.failed   = new ReactiveVar(0);
  this.selected = new ReactiveVar(0);

  //Checkboxes start all checked at max number of failed courses.
  this.selected.set(Boekingen.find({$and:[{Student: Session.get("student")}, {Score: {$lt: 10}}]}).count());
};

Template.failedColumn.helpers({
  /**
  * @returns [{id,name,grade,semester,credits, columnindex}]
  */
  studentCourses() {
    let semester = this.semester
    let ownboekingen = Boekingen.find({$and:[{Academischeperiode: semester},{Student: Session.get("student")}]});
    return ownboekingen;
  },
  "cseAvailable":function() {
    return this.credits !== undefined
  },
  "eersteCourses":function () {
    // Boekingen.find({$and:[{Student: Session.get("student")},{ $not: { $gt: 10 } },{Academiejaar: this.Academischeperiode }]});
    // Boekingen.find({$and:[{Student: Session.get("student")},{ $not: { $gt: 10 } }]});
    return Boekingen.find({$and:[{Academischeperiode: "Eerste Semester"},{Student: Session.get("student")}, {Score: {$lt: 10}}]}).fetch();
  },
  "tweedeCourses":function () {
    // Boekingen.find({$and:[{Student: Session.get("student")},{ $not: { $gt: 10 } },{Academiejaar: this.Academischeperiode }]});
    // Boekingen.find({$and:[{Student: Session.get("student")},{ $not: { $gt: 10 } }]});
    return Boekingen.find({$and:[{Academischeperiode: "Tweede Semester"},{Student: Session.get("student")}, {Score: {$lt: 10}}]}).fetch();
  },
  "trajectInfo":function () {
    let semester = this.semester;
    let columnindex = this.columnindex;
    let period = this.period;
    return {
      semester: semester,
      columnindex: columnindex,
      period: period
    }
  },
  "checked": function () {
    return Template.instance().selected.get();
  },
  "failed": function () {
    return Boekingen.find({$and:[{Student: Session.get("student")}, {Score: {$lt: 10}}]}).count();
  }
});

Template.failedColumn.events({
  'click paper-checkbox': function(e, template) {
    template.selected.set(document.querySelectorAll('paper-checkbox[checked]').length);
  }
});

/**
*
* @param semester
* @returns score_entry: fieldname of the db
*/
let getScoreEntry = function (semester) {
  var score_entry = 'Score';
  switch (semester) {
    case "Eerste Semester":
    score_entry = 'Scorejanuari';
    break;
    case "Tweede Semester":
    score_entry = 'Scorejuni';
    break;
    default:
    score_entry = 'Score';
  }
  return score_entry;
};
