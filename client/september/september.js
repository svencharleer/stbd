Template.september.rendered = function(){
  var svg = d3.select(this.find("svg.circleGraph"));
  var height = 100;
  var width = 100;
  var padding = 10;

  Tracker.autorun(function(){
    if(Session.get("selectedCourses") == undefined) return;
    var count = Object.keys(Session.get("selectedCourses")).length;
    Meteor.call("getSeptemberSuccess", count, function(err, data){
      //$("#septemberSuccess").text((100* data.percentAllPassed) + "%");
      if(data == undefined || data.percentAllPassed == undefined) return;
      svg.select("rect")
          .transition()
          .attr("height", (height+padding/2) * (1.0 - data.percentAllPassed))
        ;

      svg.select("text")
        .transition()
        .attr("fill", function(){
          if(data.percentAllPassed > .5)
            return "white";
          else return "#88B458";
        })
        .attr("y", function(){
          var diff = 0;
          if(data.percentAllPassed > .5)
            diff = 20;
          if(data.percentAllPassed > .9)
            diff = 25;
          return diff + (height+padding/2) * (1.0 - data.percentAllPassed)-3;
        })
        .text(parseInt(100 * data.percentAllPassed) + "%");

    });
  });

}

Template.september.helpers({
  nrOfCourses(){
    var selectedCourses = Session.get("selectedCourses");
    if(selectedCourses == undefined) return 0;
    return Object.keys(selectedCourses).length;
  }
});
