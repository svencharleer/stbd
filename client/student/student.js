Template.student.events = {
  'keypress input': function (event, template) {
    console.log("keypress")
    if (event.which === 13) {
      //todo official way to unsubscribe?
      Boekingen._collection.find({}).forEach(report => {
        Boekingen._collection.remove(report._id)
      });
      var studentNr = template.find("input").value;
      console.log(studentNr)
      rootRoute = Meteor.settings.public.rootroute == undefined ? "dev" : Meteor.settings.public.rootroute;
      var year = Session.get("StartYear");
      //todo change this to 2017
      if (year == undefined) year = 2017;

      let view = Blaze.getView($(".dashboardcontainer")[0]);
      let view2 = Blaze.getView($(".nostudent")[0]);
      Blaze.remove(view);
      Blaze.remove(view2);
      Session.set("alive", false);
      Router.go("/" + rootRoute + "/" + year + "/" + studentNr);
      $(".register").fadeIn();

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
      return "nio"
    }
    else{
      return "";
    }
  }
});
