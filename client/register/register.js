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
  },
  'click a': function (event) {
    let token = $(".user-token").val();
    Session.set("token", token);
    setCSEToolSettings(token);
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
      $(".token-error").fadeIn();
      var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      $(".user-token").addClass('animated shake').one(animationEnd, function() {
        $(this).removeClass('animated shake');
        $(".token-error").fadeOut(2500);
      });
    }
  })
};

let setCSEToolSettings = function (token) {
  Meteor.call("getTokenInfo", token, function (err, data) {
    let validToken =  data[0];
    if (validToken){
      let values = data[1];
      [program, cselimit1, cselimit2] = values;
      Session.set("program", program);
      Session.set("limit2", cselimit1);
      Session.set("limit1", cselimit2);
      loadCSETool();
    }
    else{
      $(".token-error").fadeIn();
      var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      $(".user-token").addClass('animated shake').one(animationEnd, function() {
        $(this).removeClass('animated shake');
        $(".token-error").fadeOut(2500);
      });
    }
  })
};

let loadCSETool = function () {
  $(".register").fadeOut(function(){
    $(".loading-csetool").css("display", "flex");
    Meteor.call("getCSETool", Session.get('program'), function (err, data) {
      Session.set("cse_data", data);
      Blaze.render(Template.CSETool, $('body')[0]);
      $(".loading-csetool").fadeOut();
    });
  });
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
