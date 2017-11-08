Template.register.events({
  'submit form': function(event){
    event.preventDefault();
    var user = $('[name=username]').val();
    console.log(user)
    switch (user){
      case "admin":
        $(".flex-container").css("display", 'flex');
        $("#student").css("display", "flex");
        $(".register").hide();
        break;
      default:
        alert("Not a valid user")
    }

  }
});