Template.register.events({
    'click paper-button': function (event) {
      let token = $(".user-token").val();
      Session.set("token", token);
      setProgramSettings(token);

    },
    'keypress paper-input': function (event, template) {
      if (event.keyCode === 13) {
        let token = $(".user-token").val();
        Session.set("token", token);
        setProgramSettings(token);
      }
    }
  });

/**
 * Check token and load dashboard
 * @param token
 */
let setProgramSettings = function (token) {
  Meteor.call("getTokenInfo", token, function (err, data) {
    let validToken =  data[0];
    if (validToken){
      let values = data[1];
      [program, cselimit1, cselimit2] = values;
      Session.set("program", program);
      Session.set("limit2", cselimit1);
      Session.set("limit1", cselimit2);
      loadDashboard();
    }
    else{
      $("#input").val("This token was incorrect");
    }
  })
};

let loadDashboard = function () {
  $(".register").fadeOut(function(){
    $(".loading-screen").css("display", "flex");
    subscribe();
  });
};

let subscribe = function () {
  Meteor.subscribe("own_boekingen", Session.get("program"), Session.get("student"),{
    onReady: function () {
      $(".loading-screen").hide();
      if (Boekingen.findOne() != undefined){
        Blaze.render(Template.dashboard, $('body')[0]);
      }
      else{
        Blaze.render(Template.nostudent, $('body')[0]);
      }
    },
    onError: function () {
      Blaze.render(Template.nostudent, $('body')[0]);
    }
  });
};

