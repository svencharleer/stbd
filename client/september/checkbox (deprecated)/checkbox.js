Template.checkbox.helpers({
  isChecked(id) {
    var checked = false;
    var selectedCourses = Session.get("selectedCourses");
    if (selectedCourses == undefined) return;
    return selectedCourses[id].checked
  }
});

Template.checkbox.events({
  'click': function (event, template) {
    var currentState = template.$(".checkbox").attr("c");
    template.$(".checkbox").attr("c", !currentState);
    var selectedCourses = Session.get("selectedCourses");
    if (selectedCourses == undefined) return;
    selectedCourses[template.$(".checkbox").attr("course")].checked = !currentState;
    Session.set("selectedCourses", selectedCourses);
    return;
  }
});
