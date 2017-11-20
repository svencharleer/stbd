Template.student.events = {
  'keypress input': function (event, template) {
    console.log(event)
    if (event.which === 13) {


      var studentNr = template.find("input").value;
      rootRoute = Meteor.settings.public.rootroute == undefined ? "dev" : Meteor.settings.public.rootroute;
      var year = Session.get("StartYear");
      //todo change this to 2017
      if (year == undefined) year = 2016;

      let view = Blaze.getView($(".dashboardcontainer")[0]);
      Blaze.remove(view);
      $(".register").fadeIn();
      Router.go("/" + rootRoute + "/" + year + "/" + studentNr);




      // document.location.reload(true);
    }
  }
};

Template.student.helpers({
  student: function () {
    return Session.get("student")
  },
  studentName: function () {
    return Session.get("studentName")
  },
  newStudent: function () {
    if (Session.get("new")){
      return ""
    }
    else{
      return "nio";
    }
  }
});
