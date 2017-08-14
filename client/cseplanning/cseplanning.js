var slider1 = d3.slider().min(0).max(60).ticks(0).showRange(true).value(0);
var slider2 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0);
var slider3 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0);
var slider4 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0);
var slider5 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0);

Template.cseplanning.rendered = function(){

  d3.select("#cseslider_y1").call(slider1);
  d3.select("#cseslider_y2").call(slider2);
  d3.select("#cseslider_y3").call(slider3);
  d3.select("#cseslider_y4").call(slider4);
  d3.select("#cseslider_y5").call(slider5);
  var cse = Session.get("CSE_september_pure");
  if(cse == undefined) return;
  var cse_remainig = 180 - cse;
  var cse2 = Math.floor(cse_remainig/4);
  var cse3 = Math.floor(cse_remainig/3);
  var cse4 = cse_remainig - cse3 - cse2;
  var cse5 = 0;
  if(cse4 > 60)
  {
    cse5 = cse4 - 60;
    cse4 = 60;

  }
  Session.set("CSE_Planning", {"cse1": cse, "cse2": cse2, "cse3": cse3, "cse4":cse4, "cse5":cse5})

  var cses = Session.get("CSE_Planning");
  slider1.setValue(cses.cse1);
  slider2.setValue(cses.cse2);
  slider3.setValue(cses.cse3);
  slider4.setValue(cses.cse4);
  slider5.setValue(cses.cse5);


  Tracker.autorun(function(){

    var cse = Session.get("CSE_september_pure");
    if(cse == undefined) return;
    var cse_remainig = 180 - cse;
    var cse2 = Math.floor(cse_remainig/4);
    var cse3 = Math.floor(cse_remainig/3);
    var cse4 = cse_remainig - cse3 - cse2;
    var cse5 = 0;
    if(cse4 > 60)
    {
      cse5 = cse4 - 60;
      cse4 = 60;

    }
    Session.set("CSE_Planning", {"cse1": cse, "cse2": cse2, "cse3": cse3, "cse4":cse4, "cse5":cse5})
    slider1.setValue(cses.cse1);
    slider2.setValue(cses.cse2);
    slider3.setValue(cses.cse3);
    slider4.setValue(cses.cse4);
    slider5.setValue(cses.cse5);
  });
}

function slide_update(){
  var cses = Session.get("CSE_Planning");
  if(cses == undefined) return;
  //find updated slider (only one can be updated at a time)
  var updatedSlider = undefined;
  updatedSlider = cses.cse1 != Math.floor(slider1.value()) ? {id:1, s:slider1,v:cses.cse1, r: [cses.cse2,cses.cse3,cses.cse4,cses.cse5]} : updatedSlider;
  updatedSlider = cses.cse2 != Math.floor(slider2.value()) ? {id:2,s:slider2,v:cses.cse2, r: [cses.cse1,cses.cse3,cses.cse4,cses.cse5]} : updatedSlider;
  updatedSlider = cses.cse3 != Math.floor(slider3.value()) ? {id:3,s:slider3,v:cses.cse3, r: [cses.cse1,cses.cse2,cses.cse4,cses.cse5]} : updatedSlider;
  updatedSlider = cses.cse4 != Math.floor(slider4.value()) ? {id:4,s:slider4,v:cses.cse4, r: [cses.cse1,cses.cse2,cses.cse3,cses.cse5]} : updatedSlider;
  updatedSlider = cses.cse5 != Math.floor(slider5.value()) ? {id:5,s:slider5,v:cses.cse5, r: [cses.cse1,cses.cse2,cses.cse3,cses.cse4]} : updatedSlider;

  //nr 1 can not go below original CSE
  if(updatedSlider != undefined && updatedSlider.id == 1 && Math.floor(updatedSlider.s.value()) < Session.get("CSE_september_pure"))
  {
    updatedSlider.s.setValue(Session.get("CSE_september_pure"));
  }
  //else update, and check that we don't go above 180 credits
  else if(updatedSlider != undefined)
  {
    var rest = 0;
    for(var i=0;i<4;i++) rest += updatedSlider.r[i];
    console.log(rest,updatedSlider.s.value())
    if(Math.floor(updatedSlider.s.value()) + rest > 180)
    {
      updatedSlider.v =180 - rest;
      updatedSlider.s.setValue(updatedSlider.v);
    }
    Session.set("CSE_Planning", {"cse1": Math.floor(slider1.value()), "cse2": Math.floor(slider2.value()),
     "cse3": Math.floor(slider3.value()), "cse4":Math.floor(slider4.value()), "cse5":Math.floor(slider5.value())})

  }
}

Template.cseplanning.events({
  'click': function(event, template)
  {

    slide_update()

  },
  'mouseleave': function(event,template)
  {
    slide_update();
  }
});

Template.cseplanning.helpers(
  {
    'totalCSE': function()
    {
      var cses = Session.get("CSE_Planning");
      if(cses != undefined)
        return cses.cse1 + cses.cse2 + cses.cse3 + cses.cse4 + cses.cse5;
      return 0;
    }
  }
)
