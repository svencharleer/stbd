import { ReactiveVar } from 'meteor/reactive-var'

Template.failedColumn.created = function() {
  this.failed   = new ReactiveVar(0);
  this.selected = new ReactiveVar(0);
  //Checkboxes start all checked at max number of failed courses.
  this.selected.set(Boekingen.find({$and:[{Student: Session.get("student")}, {Score: {$lt: 10}}]}).count());
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
  }
});

Template.failedColumn.events({
  'click paper-checkbox': function(e, template) {
    template.selected.set(document.querySelectorAll('paper-checkbox[checked]').length);
  }
});
