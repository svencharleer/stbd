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
  "click .top-bar": function(event,template){
    if(!template.show.get()) {
      template.$(".course-bottom").css("max-height", "48px");
      template.$(".top-bar").css("box-shadow", "1px 1px 5px gainsboro");
      template.show.set(true);
    } else {
      template.$(".course-bottom").css("max-height", "0px");
      template.$(".top-bar").css("box-shadow", "0px 0px 0px gainsboro");
      template.$(".course").css("transform", "scale(1)");
      template.$(".course").css("z-index", "0");
      template.show.set(false);
    }
  },
  "click .course-bottom": function(event, template) {
    if(!template.zoom.get()) {
      template.$(".course").css("transform", "scale(1.5)");
      template.$(".course").css("z-index", "1000");
      template.$(".course").css("box-shadow", "1px 1px 5px #a1a1a1");
      template.zoom.set(true);
    } else {
      template.$(".course").css("transform", "scale(1)");
      template.$(".course").css("z-index", "0");
      template.$(".course").css("box-shadow", "none");
      template.zoom.set(false);
    }
  }
});


Template.resultGraph.onRendered(function(){
  let width = 140; let height = 40;
  let courseID = Template.instance().firstNode.id;
  let svg = d3.select("#"+courseID).select(".histogram")
  .attr("class","histogram")
  .attr("width", width)
  .attr("height", height)
  .attr("x", 0)
  .attr("y", 0);

  svg.append("g").selectAll("rect")
  .data(function(){
    let sample = [];
    for(let i = 0;i <= 20; i++) sample.push({grade:i, count:0});
    sample.max = 20;
    return sample;
  })
  .enter().append("rect")
  .attr("width", 4)

  // 1 -> 7 pixels
  svg.append("rect") // < 8 Failed
  .attr("stroke","#ff8a80")
  .attr("width", width * .40) // < 8 is 40% of total width.
  .attr("height",1)
  .attr("transform", "translate(0,"+height+")"); // Starts from 0, always.

  svg.append("rect") // 8-9 Tolerated
  .attr("stroke","#ffcc80")
  .attr("width", width * .10) // between 8 and 9 is 10% of total width.
  .attr("height", 1)
  .attr("transform","translate("+ width * .40 + "," + height +")"); // < 8 is 40% of total width.

  svg.append("rect") // > 9 Pass 45% of histogram width.
  .attr("stroke","#a5d6a7")
  .attr("width", width * .5)
  .attr("height",1)
  .attr("transform","translate("+width * .5+","+height+")");

});
