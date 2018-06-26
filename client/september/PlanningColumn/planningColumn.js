import { ReactiveVar } from 'meteor/reactive-var'

Template.planningColumn.created = function() {
};

Template.planningColumn.helpers({
  "csesum":function () {
    return Session.get("cse1");
  }
});
