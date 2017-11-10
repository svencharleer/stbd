Template.register.events({
  'click paper-button': function(event){
    let token = $(".user-token").val();
    Session.set("token", token);
    setProgramSettings(token);

  },
  'click paper-input': function(event){
    let token = $(".user-token").val();
    if (token === "This token was incorrect"){
      $(".user-token").val("");
    }


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
