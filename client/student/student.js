Template.student.events = {
  'keypress input': function (event, template) {
    if (event.which == 13) {
      let studentNr = template.find("input").value;
      let rootRoute = Meteor.settings.public.rootroute == undefined ? "dev" : Meteor.settings.public.rootroute;
      let year = Session.get("StartYear");
      if (year == undefined) year = 2017;
      Router.go("/" + rootRoute + "/" + year + "/" + studentNr);
      document.location.reload(true); // Simple Solutions Solving Big Problems
    }
  }
};

Template.student.helpers({
  student: function () {
    return Session.get("student");
  },
  studentName: function () {
    return Session.get("studentName");
  },
  newStudent: function () {
    if (Session.get("new")){
      return "nio"
    }
    else{
      return "";
    }
  }
});
