Template.trajectory.helpers({
  periods() {
    var r =  [{period:"ijkingstoets"},{period:"TTT"},{period:"januari"}];
    if(Meteor.settings.public.showJuni== true)  {
      r.push({period:"juni"})
    }
    if(Meteor.settings.public.showSeptember== true)  {
      r.push({period:"september"})
    }
    return r;
  },
  update() {
    //console.log("updating");
    var background = $("#trajectory-bg");
    var ijkingstoets = $("#distribution_ijkingstoets")
    var tussentijdsetoets = $("#distribution_TTT");
    var januari = $("#distribution_januari");
    var juni = $("#distribution_juni");
    var september = $("#distribution_september");
    var periods = [ijkingstoets,tussentijdsetoets,januari];
    if(Meteor.settings.public.showJuni== true)  {
      periods.push(juni)
    }
    if(Meteor.settings.public.showSeptember== true)  {
      periods.push(september)
    }
    if(Meteor.settings.public.showJuni== true)  {
      periods.push(juni)
    }
    if(Meteor.settings.public.showSeptember== true)  {
      periods.push(september)
    }
    var canvas = $("#trajectory-overlay")
    .attr("width", background.width())
    .attr("height", background.height());

    var cses = [Session.get("CSE_ijkingstoets"),Session.get("CSE_TTT"),Session.get("CSE_januari"), Session.get("CSE_juni"),Session.get("CSE_september")];
    if(canvas.get()[0] == undefined) return;

    var buckets = [0,1,2,3,4,5,6,7,8,9];

    var csebuckets = [0,0,0,0];
    cses.some(function(c,i){
      buckets.some(function(b){
        if(b == 9)
        {
          if(c >= b * 10 && c <= (b+1) * 10)
          csebuckets[i] = b;
        }
        else if(c >= b * 10 && c < (b+1) * 10)
        csebuckets[i] = b;
      })
    })
/*
    var context = canvas.get()[0].getContext("2d");
    context.lineWidth = 5;
    //context.setLineDash([5,5]);
    periods.forEach(function(p,i){
      if(p == undefined || p == "") return;
      if(i >= periods.length-1) return; //we don't have to draw anymore
      context.beginPath();
      var x = p.position().left + p.width()/2;
      var y = p.position().top+ (100 - (csebuckets[i] * 10 + 3)); //calculate height, based on the fact we have a 5px padding (and it's 100px height) and - 2 for width of line
      context.moveTo(x,y);
      //context.moveTo(januari.position().left ,januari.position().top);
      var toX = periods[i+1].position().left + periods[i+1].width()/2;
      var toY = periods[i+1].position().top+(100 - (csebuckets[i+1] * 10 + 3));
      context.bezierCurveTo(x+p.width()/2,y,x+p.width()/2,y,x+p.width()/2,y+(toY-y)/2);
      context.bezierCurveTo(x+p.width()/2,toY,x+p.width()/2,toY,toX,toY);
      //context.bezierCurveTo(toX,y,x,toY,toX,toY);
      context.strokeStyle ="#B3E5FC";
      context.stroke();
    })*/
  }
});

Template.trajectory.events({
  'click h2': function(event, template) {
    if(template.$(".hider").hasClass("fa-chevron-up")){
      template.$(".rowtraject").css("min-height", "0px");
      template.$(".rowtraject").css("max-height", "0px");
      template.$(".hider").removeClass("fa-chevron-up").addClass("fa-chevron-down");
      clicks.insert({'session': Session.get('Id'), 'studentid': Session.get('student') , 'element': 'h2', 'time': Date.now() , 'action': 'hide_trajectory'} )                                          
      
    } else if(template.$(".hider").hasClass("fa-chevron-down")){
      template.$(".rowtraject").css("max-height", "104px");
      template.$(".rowtraject").css("min-height", "104px");
      template.$(".hider").removeClass("fa-chevron-down").addClass("fa-chevron-up");
      clicks.insert({'session': Session.get('Id'), 'studentid': Session.get('student') , 'element': 'h2', 'time': Date.now() , 'action': 'show_trajectory'} )                                          
      
    }
  },
});
