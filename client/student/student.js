Template.student.events = {
  'keypress input': function (evt, template) {
    if (evt.which === 13) {
      var studentNr = template.find("input").value;

      rootRoute = Meteor.settings.public.rootroute == undefined ? "dev" : Meteor.settings.public.rootroute;
//      Meteor.subscribe("studentgrades",Session.get("student"));
//      Meteor.subscribe("ijkingstoets", Session.get("student"));
      var year = Session.get("StartYear");
      if(year == undefined) year = 2015;
      Router.go("/" + rootRoute + "/" + year + "/" + studentNr);


      //document.location.reload(true);
    }
  }
};

Template.student.helpers({
  student: function() {return Session.get("student")},
  studentName: function() {return Session.get("studentName")}
});
