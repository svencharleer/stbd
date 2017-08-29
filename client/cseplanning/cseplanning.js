var slider1 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0).cssClass('yearOne');
var slider2 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0).cssClass('yearTwo');
var slider3 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0).cssClass('yearThree');
var slider4 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0).cssClass('yearFour');
var slider5 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0).cssClass('yearFive');

Template.cseplanning.onRendered(function(){
  $('#creditsplanned').find("paper-progress").css('width', '75%');
  
  //Bind sliders to div
  d3.select("#cseslider_y1").call(slider1);
  d3.select("#cseslider_y2").call(slider2);
  d3.select("#cseslider_y3").call(slider3);
  d3.select("#cseslider_y4").call(slider4);
  d3.select("#cseslider_y5").call(slider5);

  //You only show the planning in september
  //You need the raw/pure credits
  var cse = Session.get("CSE_september_pure");
  // updateProgressBar(cse)
  
  if(cse == undefined) return;

  function totalCSE() {
    let cse  = Session.get("cse1") + Session.get("cse2") + Session.get("cse3") + Session.get("cse4") + Session.get("cse5");
    if (cse > 180) cse = 180;
    return cse;
  }

  function calculateStartValues(cse){
    var cse_remaining = 180 - cse;
    var cse2 = Math.floor(cse_remaining/4);
    var cse3 = Math.floor(cse_remaining/3);
    // var cse4 = cse_remaining - cse3 - cse2;
    let cse4 = 0;
    var cse5 = 0;
    // if(cse4 > 60) {
    //   cse5 = cse4 - 60;
    //   cse4 = 60;
    // }
    return [cse, cse2, cse3, cse4, cse5]
  }
  //Define the default starting values
  [cse, cse2, cse3, cse4, cse5] = calculateStartValues(cse);
  //Put them in the sessions as a dict
  Session.set("CSE_Planning", {"cse1": cse, "cse2": cse2, "cse3": cse3, "cse4":cse4, "cse5":cse5})
  

  var cses = Session.get("CSE_Planning");
  slider1.setValue(Math.floor(cses.cse1));
  slider2.setValue(Math.floor(cses.cse2));
  slider3.setValue(Math.floor(cses.cse3));
  slider4.setValue(Math.floor(cses.cse4));
  slider5.setValue(Math.floor(cses.cse5));
  //Put each of them separated in the sessions
  //TODO: why?
  Session.set("cse1",Math.floor(cses.cse1));
  Session.set("cse2",Math.floor(cses.cse2));
  Session.set("cse3",Math.floor(cses.cse3));
  Session.set("cse4",Math.floor(cses.cse4));
  Session.set("cse5",Math.floor(cses.cse5));


  /**
   * automatically rerun templates and other computations whenever Session variables, database queries, and other data sources change.
   */
  Tracker.autorun(function(){

    var cse = Session.get("CSE_september_pure");
    if(cse == undefined) return;
    var cse_remaining = 180 - cse;
    var cse2 = Math.floor(cse_remaining/4);
    var cse3 = Math.floor(cse_remaining/3);
    var cse4 = cse_remaining - cse3 - cse2;
    var cse5 = 0;
    if(cse4 > 60)
    {
      cse5 = cse4 - 60;
      cse4 = 60;

    }
    Session.set("CSE_Planning", {"cse1": cse, "cse2": cse2, "cse3": cse3, "cse4":cse4, "cse5":cse5})
    slider1.setValue(Math.floor(cses.cse1));
    slider2.setValue(Math.floor(cses.cse2));
    slider3.setValue(Math.floor(cses.cse3));
    slider4.setValue(Math.floor(cses.cse4));
    slider5.setValue(Math.floor(cses.cse5));

    Session.set("cse1",Math.floor(cses.cse1));
    Session.set("cse2",Math.floor(cses.cse2));
    Session.set("cse3",Math.floor(cses.cse3));
    Session.set("cse4",Math.floor(cses.cse4));
    Session.set("cse5",Math.floor(cses.cse5));
  });

  // Set slider callback function
  slider1.callback(function(slider) {Session.set("cse1",Math.floor(slider.value()));})
  slider2.callback(function(slider) {Session.set("cse2",Math.floor(slider.value()));})
  slider3.callback(function(slider) {Session.set("cse3",Math.floor(slider.value()));})
  slider4.callback(function(slider) {Session.set("cse4",Math.floor(slider.value()));})
  slider5.callback(function(slider) {Session.set("cse5",Math.floor(slider.value()));})
})

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

  //nr 1 is fixed
  if(updatedSlider != undefined && updatedSlider.id == 1){
    updatedSlider.s.setValue(Session.get("CSE_september_pure"));
  }
  //else update, and check that we don't go above 180 credits
  else if(updatedSlider != undefined) {
    var rest = 0;
    for(var i=0;i<4;i++) rest += updatedSlider.r[i];
    //console.log(rest,updatedSlider.s.value())
    if(Math.floor(updatedSlider.s.value()) + rest > 180) {
      updatedSlider.v =180 - rest;
      updatedSlider.s.setValue(updatedSlider.v);
    }
    Session.set("CSE_Planning", {"cse1": Math.floor(slider1.value()), "cse2": Math.floor(slider2.value()),
    "cse3": Math.floor(slider3.value()), "cse4":Math.floor(slider4.value()), "cse5":Math.floor(slider5.value())})
  }
  // updateProgressBar(totalCSE());
  
}

Template.cseplanning.events({
  'click' (event, template) {
    slide_update()
  },
  'mouseleave' (event,template) {
    slide_update();
  }
});

Template.cseplanning.helpers({
  'totalCSE': function() {
    let cse  = Session.get("cse1") + Session.get("cse2") + Session.get("cse3") + Session.get("cse4") + Session.get("cse5");
    if (cse > 180) cse = 180;
    return cse;
  },
  'jaar1': function(){
    return Session.get("cse1");
  },
  'jaar2': function(){
    return Session.get("cse2");
  },
  'jaar3': function(){
    return Session.get("cse3");
  },
  'jaar4': function(){
    return Session.get("cse4");
  },
  'jaar5': function(){
    return Session.get("cse5");
  }
});
