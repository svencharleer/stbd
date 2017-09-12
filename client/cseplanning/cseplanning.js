var slider1 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0).cssClass('yearOne');
var slider2 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0).cssClass('yearTwo');
var slider2a = d3.slider().min(0).max(40).ticks(0).showRange(true).value(0).cssClass('yearTwoa');
var slider2b = d3.slider().min(0).max(40).ticks(0).showRange(true).value(0).cssClass('yearTwob');
var slider3 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0).cssClass('yearThree');
var slider4 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0).cssClass('yearFour');
var slider5 = d3.slider().min(0).max(72).ticks(0).showRange(true).value(0).cssClass('yearFive');

Template.cseplanning.csePlanning = function(){return Session.get("CSE_Planning");}

Template.cseplanning.onCreated(function(){


})

Template.cseplanning.onRendered(function(){
  $('#creditsplanned').find("paper-progress").css('width', '75%');
  //Bind sliders to div
  d3.select("#cseslider_y1").call(slider1);  
  d3.select("#cseslider_y2").call(slider2);
  d3.select("#cseslider_y2a").call(slider2a);
  d3.select("#cseslider_y2b").call(slider2b);
  d3.select("#cseslider_y3").call(slider3);
  d3.select("#cseslider_y4").call(slider4);
  d3.select("#cseslider_y5").call(slider5);  

  // function totalCSE() {
  //   let cse  = Session.get("cse1") + Session.get("cse2") + Session.get("cse3") + Session.get("cse4") + Session.get("cse5");
  //   if (cse > 180) cse = 180;
  //   return cse;
  // }

  
  //Set sliders to initial values
  let cses = Template.cseplanning.csePlanning();
  if (cses == undefined){return;}
  slider1.setValue(Math.floor(cses.cse1));
  slider2.setValue(Math.floor(cses.cse2));
  slider2a.setValue(Math.floor(cses.cse2a));
  slider2b.setValue(Math.floor(cses.cse2b));
  slider3.setValue(Math.floor(cses.cse3));
  slider4.setValue(Math.floor(cses.cse4));
  slider5.setValue(Math.floor(cses.cse5));
  //Put each of them separated in the sessions
  //These are temporary global variables
  //Needed to check which one is updated 
  Session.set("cse1",Math.floor(cses.cse1));
  Session.set("cse2",Math.floor(cses.cse2));
  Session.set("cse2a",Math.floor(cses.cse2a));
  Session.set("cse2b",Math.floor(cses.cse2b));  
  Session.set("cse3",Math.floor(cses.cse3));
  Session.set("cse4",Math.floor(cses.cse4));
  Session.set("cse5",Math.floor(cses.cse5));


  /**
   * automatically rerun templates and other computations whenever Session variables, database queries, and other data sources change.
   */
  Tracker.autorun(function(){
    let cses = Template.cseplanning.csePlanning();
    if(cses == undefined) return;
    Session.set("CSE_Planning", {"cse1": cses.cse1, "cse2": cses.cse2, "cse2a": cses.cse2a, "cse2b": cses.cse2b, "cse3": cses.cse3, "cse4": cses.cse4, "cse5":cses.cse5})    
    slide_update();
    
  });

  // Set slider callback function
  //They change the temporary variables in session (cse1-5)
  slider1.callback(function(slider) {})
  slider2.callback(function(slider) {Session.set("cse2",Math.floor(slider.value()));})
  slider2a.callback(function(slider) {
    //get the old values
    let cse2aOld = Session.get('cse2a');
    let cse2bOld = Session.get('cse2b');
    let cse2Old = Session.get('cse2');
    //calculate the new value
    let cse2aNew = Math.floor(slider.value());
    let cse2New = Math.floor(cse2aNew + cse2bOld);
    if (cse2New > 72) {
      slider.setValue(cse2aOld);
    }
    else{
      Session.set("cse2a", cse2aNew);
      slider2.setValue(cse2New);
    }
  })
  slider2b.callback(function(slider) {
    //get the old values
    let cse2aOld = Session.get('cse2a');
    let cse2bOld = Session.get('cse2b');
    let cse2Old = Session.get('cse2');
    //calculate the new value
    let cse2bNew = Math.floor(slider.value());
    let cse2New = Math.floor(cse2bNew + cse2aOld);
    if (cse2New > 72) {
      slider.setValue(cse2bOld);
    }
    else{
      Session.set("cse2b", cse2bNew);
      slider2.setValue(cse2New);
    }
  }) 
  slider3.callback(function(slider) {Session.set("cse3",Math.floor(slider.value()));})
  slider4.callback(function(slider) {Session.set("cse4",Math.floor(slider.value()));})
  slider5.callback(function(slider) {Session.set("cse5",Math.floor(slider.value()));})
})

/**
 * Update sliders
 * Check if values are withing 180
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


  if (updatedSlider != undefined){   
    values = [cses.cse1, cses.cse2, cses.cse2a, cses.cse2b, cses.cse3, cses.cse4, cses.cse5];    
    var rest = 0;
    for(var i=0;i<4;i++){
      rest += updatedSlider.r[i];
    } 
    //The first slider cannot be moved
    //unless you tolerate
    if(updatedSlider.id == 1){
      let cse1 = Session.get('cse1');
      let diff = cses.cse1 - cse1;
      let totalCredits = cses.cse1 + rest;
      if (diff > 0 && totalCredits > 180){
        values = removeLatestCredits(values, diff);
        updateSliders(values);
      }
      updatedSlider.s.setValue(cses.cse1);
      Session.set('cse1' , cses.cse1);
    }
    //else update, and check that we don't go above 180 credits
    else if(updatedSlider != undefined) {
      //Calculate total number of credits and difference with 180
      let newValue = Math.round(updatedSlider.s.value());
      let totalCredits = newValue + rest;
      let diff =  180 - totalCredits;
      let index = calculateIndex(updatedSlider.id)
      //If you planned too much credits
      if(diff < 0) {      
        values[index] = newValue;
        let nbCredits = Math.abs(diff);
        values = removeLatestCredits(values, nbCredits);  
      }
      else{
        values[index] = newValue;  
      }   
      updateSliders(values); 
      Session.set("CSE_Planning", {"cse1": cses.cse1, "cse2": values[1], "cse2a": values[2],"cse2b": values[3],"cse3": values[4], "cse4": values[5], "cse5": values[6]})
    }  
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
    let value = d3.select(event.currentTarget).select('.value').select('span').text()
    clicks.insert({'session': Session.get('Id'), 'studentid': Session.get('student') , 'element': 'slideflex_' + event.currentTarget.lastElementChild.id  , 'time': Date.now() , 'action': 'slide_' + value.substring(0,2)})
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
    return Session.get("cse2a") +  Session.get("cse2b");
  },
  'jaar2a': function(){
    return Session.get("cse2a");
  },
  'jaar2b': function(){
    return Session.get("cse2b");
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

/**
 * 
 * @param {[int]} values list of values of all sliders 1,2,2a,2b,3,4,5
 * @param {int} nbCredits nb of credits above 180
 */
function removeLatestCredits(values, nbCredits){
  if (values[6] >= nbCredits){
    values[6] -= nbCredits;
  }
  else if ((values[6] + values[5]) > nbCredits){
    values[5] -= (nbCredits - values[6]);    
    values[6] = 0;
  }
  else if ((values[4] + values[5] + values[6] > nbCredits)){
    values[4] -= (nbCredits - values[5] - values[6]);    
    values[5] = 0;    
    values[6] = 0;
  }
  return values;
}

function updateSliders(values){
  slider3.setValue(values[4] );
  slider4.setValue(values[5] );
  slider5.setValue(values[6] );
}

function calculateIndex(id){
  if (id == 2){
    return 1;
  }
  else{
    return id+1;
  }
}

