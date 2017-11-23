Template.register.events({
    'click paper-button': function (event) {
      let token = $(".user-token").val();
      Session.set("token", token);
      setProgramSettings(token);

    },
    'keypress paper-input': function (event, template) {
      if (event.keyCode == 13) {
        let token = $(".user-token").val();
        Session.set("token", token);
        setProgramSettings(token);
      }
    }
  });

Template.register.onRendered(function () {
  let handler1 = Meteor.subscribe("own_boekingen", Session.get("program"), Session.get("student"));
  if (handler1.ready()){
    Meteor.subscribe("program_boekingen", Session.get("program"));
  }

});

let setProgramSettings = function (token) {
  Meteor.call("getTokenInfo", token, function (err, data) {
    console.log(data);
    let validToken =  data[0];
    if (validToken){
      let values = data[1];
      [program, cselimit1, cselimit2] = values;
      Session.set("program", program);
      Session.set("limit2", cselimit1);
      Session.set("limit1", cselimit2);
      $(".register").fadeOut(function(){
        Blaze.render(Template.dashboard, $('body')[0]);
      });
    }
    else{
      $("#input").val("This token was incorrect");
    }
  })
};

