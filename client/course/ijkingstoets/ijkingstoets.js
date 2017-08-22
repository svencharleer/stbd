

Template.ijkingstoets.onCreated(function(){
  let instance = this;
  let bar = "#CBCBCB";
  let barSelect = "#020202";
  instance.autorun(function(){
    Session.get("student");
    let handler = instance.subscribe("generic_courses",function(){});
    let handler2 = instance.subscribe("generic_grades",Session.get("student"));;
    if(handler.ready() && handler2.ready()){
      let period  = instance.data.id;
      let studentGrade = instance.data.grade;
      let svg = d3.select("#"+period+"_");
      let graph = svg.select("g").selectAll("rect");
      let courseId = period;
      Meteor.call("getIjkingstoetsPointDistribution", [Session.get("StartYear")], function(err,data){
        if(courseId == "ijkingstoets_juli")
        data = data[0];
        else if(courseId == "ijkingstoets_september")
        data = data[1];
        else return;
        graph.data(data.numberPerGrades)
        graph.transition()
        .attr("height",function(d){
          return (d.count * 40)/data.max;
        })
        .attr("fill", function(d){
          let color = "#e1e1e1";
          if(d.grade == studentGrade) {
            if(d.grade < 8) color = "#ff8a80"; //failed
            else if(d.grade > 9) color = "#a5d6a7"; //passed
            else if(d.grade >= 8 && d.grade <= 9) color = "#ffcc80"; //tolerable
            else color = "#ff8a80"; //failed
          }
          return color;
        })
        .attr("transform",function(d,i){
          return "translate(" + (d.grade * 6.8) + ","+ (40 - ((d.count * 40)/data.max))  +  ")";
        });
      });
    }
  })
});
