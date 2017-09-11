import { ReactiveVar } from 'meteor/reactive-var'

Template.resultGraph.onCreated(function(){
  this.show = new ReactiveVar(false);
  this.zoom = new ReactiveVar(false);
});

Template.resultGraph.helpers({
  color: function(){
    let color = "white"; //"#ef9a9a";
    if(this.grade < 8) color = "failed" //"#ff8a80"; //failed
    else if(this.grade > 9) color = "passed" //"#a5d6a7"; //passed
    else if(this.grade >= 8 && this.grade <= 9) color = "tolerable"; // "#ffcc80"; //tolerable
    else color = "failed"; // "#ff8a80"; //failed
    return color;
  }
});

Template.resultGraph.events({
  "click .course-top": function(event,template){
    if(!template.show.get()) {
      template.$(".course-bottom").css("max-height", "60px");
      template.$(".top-bar").css("box-shadow", "1px 1px 5px gainsboro");
      template.show.set(true);
      clicks.insert({'session': Session.get('Id'), 'studentid': Session.get('student') , 'element': 'course-top_' + this.id , 'time': Date.now() , 'action': 'visible'} )
    } else {
      template.$(".course-bottom").css("max-height", "0px");
      template.$(".top-bar").css("box-shadow", "0px 0px 0px gainsboro");
      template.$(".course").css("box-shadow", "0px 0px 0px gainsboro");
      template.$(".course").css("transform", "scale(1)");
      template.$(".course").css("z-index", "0");
      template.show.set(false);
      clicks.insert({'session': Session.get('Id') , 'studentid': Session.get('student') , 'element': 'course-top_' + this.id , 'time': Date.now() , 'action': 'hide'} )
      
    }
  },
  "click .course-bottom": function(event, template) {
    if(!template.zoom.get()) {
      template.$(".course").css("transform", "scale(1.5)"); 
      template.$(".course").css("z-index", "1000");
      template.$(".course").css("box-shadow", "1px 1px 5px gainsboro");
      template.zoom.set(true);
      clicks.insert({'session': Session.get('Id'), 'studentid': Session.get('student') , 'element': 'course-top_' + this.id , 'time': Date.now() , 'action': 'zoom'} )
    } else {
      template.$(".course").css("transform", "scale(1)");
      template.$(".course").css("z-index", "0");
      template.$(".course").css("box-shadow", "0px 0px 0px gainsboro");
      template.zoom.set(false);
      clicks.insert({'session': Session.get('Id'), 'studentid': Session.get('student') , 'element': 'course-top_' + this.id , 'time': Date.now() , 'action': 'reset_zoom'} )
    }
    
  }
});


Template.resultGraph.onRendered(function(){
  let width = 140; let height = 60;
  let courseID = Template.instance().firstNode.id;
  let svg = d3.select("#"+courseID).select(".histogram")
  .attr("class","histogram")
  .attr("width", width)
  .attr("height", height)
  .attr("x", 0)
  .attr("y", 0);

  let template = Template.instance();

  svg.append("g") // Add the dots to the graph!
  .attr("class", "main-container")
  .selectAll(".dots-container")
  .data(function(){
    let sample = [];
    for(let i = 0;i <= 20; i++) sample.push({grade:i, count:0});
    sample.max = 20;
    return sample;
  })
  .enter()
  .append("g")
  .attr("class", "dots-container");

  Meteor.call("getDynamicSetting", function(err, dynamic){
    console.log(template);
    if (!dynamic){
      template.$(".course-bottom").css("max-height", "60px");
      template.$(".top-bar").css("box-shadow", "1px 1px 5px gainsboro");
      template.show.set(true);
    }
  })

});

