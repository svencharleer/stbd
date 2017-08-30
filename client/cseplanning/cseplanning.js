var slider1 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0).cssClass('yearOne');
var slider2 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0).cssClass('yearTwo');
var slider3 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0).cssClass('yearThree');
var slider4 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0).cssClass('yearFour');
var slider5 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0).cssClass('yearFive');



Template.cseplanning.onRendered(function(){
  $('#creditsplanned').find("paper-progress").css('width', '75%');
  Session.set('slider', slider1);
  //Bind sliders to div
  d3.select("#cseslider_y1").call(slider1);  
  d3.select("#cseslider_y2").call(slider2);
  d3.select("#cseslider_y3").call(slider3);
  d3.select("#cseslider_y4").call(slider4);
  d3.select("#cseslider_y5").call(slider5);

  //You only show the planning in september
  //You need the raw/pure credits
  var cse = Session.get("CSE_september_pure");  
  if(cse == undefined) return;

  function totalCSE() {
    let cse  = Session.get("cse1") + Session.get("cse2") + Session.get("cse3") + Session.get("cse4") + Session.get("cse5");
    if (cse > 180) cse = 180;
    return cse;
  }

  function calculateStartValues(cse1){
    let cse_remaining = 180 - cse1;
    let cse2 = Math.floor(cse_remaining/4);
    let cse3 = Math.floor(cse_remaining/3);
    let cse4 = cse_remaining - cse3 - cse2;
    var cse5 = 0;
    if(cse4 > 60) {
      cse5 = cse4 - 60;
      cse4 = 60;
    }
    return [cse1, cse2, cse3, cse4, cse5]
  }
  //Define the default starting values
  [cse1, cse2, cse3, cse4, cse5] = calculateStartValues(cse);
  //Put them in the sessions as a dict as final values
  Session.set("CSE_Planning", {"cse1": cse1, "cse2": cse2, "cse3": cse3, "cse4":cse4, "cse5":cse5})
  //Initialize the sliders
  slider1.setValue(Math.floor(cse1));
  slider2.setValue(Math.floor(cse2));
  slider3.setValue(Math.floor(cse3));
  slider4.setValue(Math.floor(cse4));
  slider5.setValue(Math.floor(cse5));
  //Put each of them separated in the sessions
  //These are temporary global variables
  //Needed to check which one is updated 
  Session.set("cse1",Math.floor(cse1));
  Session.set("cse2",Math.floor(cse2));
  Session.set("cse3",Math.floor(cse3));
  Session.set("cse4",Math.floor(cse4));
  Session.set("cse5",Math.floor(cse5));


  /**
   * automatically rerun templates and other computations whenever Session variables, database queries, and other data sources change.
   */
  Tracker.autorun(function(){
    let cses = Session.get("CSE_Planning")
    if(cses == undefined) return;
    slide_update();
    
  });

  // Set slider callback function
  //They change the temporary variables in session (cse1-5)
  slider1.callback(function(slider) {})
  slider2.callback(function(slider) {Session.set("cse2",Math.floor(slider.value()));})
  slider3.callback(function(slider) {Session.set("cse3",Math.floor(slider.value()));})
  slider4.callback(function(slider) {Session.set("cse4",Math.floor(slider.value()));})
  slider5.callback(function(slider) {Session.set("cse5",Math.floor(slider.value()));})
})

/**
 * Update sliders
 * Check if values are 
 */
function slide_update(){
  //get the 'old' values
  var cses = Session.get("CSE_Planning");
  if(cses == undefined) return;

  //find updated slider (only one can be updated at a time)
  // store id, slider, old value, values of the other sliders
  var updatedSlider = undefined;
  updatedSlider = cses.cse1 != Math.round(slider1.value()) ? {id:1, s:slider1, v:cses.cse1, r: [cses.cse2,cses.cse3,cses.cse4,cses.cse5]} : updatedSlider;
  updatedSlider = cses.cse2 != Math.floor(slider2.value()) ? {id:2, s:slider2, v:cses.cse2, r: [cses.cse1,cses.cse3,cses.cse4,cses.cse5]} : updatedSlider;
  updatedSlider = cses.cse3 != Math.floor(slider3.value()) ? {id:3, s:slider3, v:cses.cse3, r: [cses.cse1,cses.cse2,cses.cse4,cses.cse5]} : updatedSlider;
  updatedSlider = cses.cse4 != Math.floor(slider4.value()) ? {id:4, s:slider4, v:cses.cse4, r: [cses.cse1,cses.cse2,cses.cse3,cses.cse5]} : updatedSlider;
  updatedSlider = cses.cse5 != Math.floor(slider5.value()) ? {id:5, s:slider5, v:cses.cse5, r: [cses.cse1,cses.cse2,cses.cse3,cses.cse4]} : updatedSlider;
  values = [cses.cse1, cses.cse2, cses.cse3, cses.cse4, cses.cse5];
  //nr 1 is fixed
  if(updatedSlider != undefined && updatedSlider.id == 1){
    updatedSlider.s.setValue(cses.cse1);
  }
  //else update, and check that we don't go above 180 credits
  else if(updatedSlider != undefined) {
    let list = [Math.round(slider1.value()), Math.floor(slider2.value()),Math.floor(slider3.value()),Math.floor(slider4.value()),Math.floor(slider5.value())]
    //BCalculate number of credits planned without updated slider
    var rest = 0;
    for(var i=0;i<4;i++){
      rest += updatedSlider.r[i];
    } 

    //Calculate total number of credits and difference with 180
    let newValue = Math.round(updatedSlider.s.value());
    let totalCredits = newValue + rest;
    let diff =  180 - totalCredits;
    //If you planned too much credits
    if(diff < 0) {      
      values[updatedSlider.id-1] = newValue;
      let nbCredits = Math.abs(diff);
      values = removeLatestCredits(values, nbCredits);
      updateSliders(values);
        
    }
    else{
      values[updatedSlider.id-1] = newValue;  
    }    
    Session.set("CSE_Planning", {"cse1": cses.cse1, "cse2": values[1], "cse3": values[2], "cse4": values[3], "cse5": values[4]})
  }  
}

/**
 * All are needed because you can leave slider in 2 ways
 * click
 * or leeave the area
 */
Template.cseplanning.events({
  'click .slideflex' (event, template) {
    slide_update()
  },
  'mouseout .slideflex' (event,template) {
    slide_update();
  },
  'mouseout .bottom' (event,template) {
    slide_update();
  }
});

Template.cseplanning.helpers({
  'totalCSE': function() {
    let cse = 0;
    if (Session.get("CSE_Planning") != undefined){
      cse  = Session.get("CSE_Planning").cse1 + Session.get("cse2") + Session.get("cse3") + Session.get("cse4") + Session.get("cse5");
      if (cse > 180) cse = 180;
    }
    return cse;
  },
  'jaar1': function(){
    var cses = Session.get("CSE_Planning");
    if(cses == undefined) return;
    return cses.cse1;
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

function removeLatestCredits(values, nbCredits){
  // console.log('Before ' + values + ' ' + nbCredits);
  
  if (values[4] >= nbCredits){
    values[4] -= nbCredits;
  }
  else if ((values[3] + values[4]) > nbCredits){
    values[3] -= (nbCredits - values[4]);    
    values[4] = 0;
  }
  // console.log('After '+ values);
  return values;
}

function updateSliders(values){
  slider2.setValue(values[1]);
  slider3.setValue(values[2] );
  slider4.setValue(values[3] );
  slider5.setValue(values[4] );
}

