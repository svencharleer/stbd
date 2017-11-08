Template.register.events({
  'click paper-button': function(event){
    let token = $(".user-token").val();
    Session.set("token", token);

    if (token == "abc") {
        $(".register").fadeOut(function(){
          Blaze.render(Template.dashboard, $('body')[0]);
        });
    }
  }
});
