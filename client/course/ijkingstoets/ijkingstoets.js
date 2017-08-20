

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
          return d.count/(data.max) * 40;
        })
        .attr("fill", function(d){
          if(d.grade == studentGrade)
          return barSelect;
          else
          return bar;
        })
        .attr("transform",function(d,i){
          var spacing = 10;
          return "translate(" + ((d.grade / 20.0) * spacing +   (d.grade / 20.0) * totalHeight).toString() + ","+ (1.0 - d.count/(data.max- 0)) * height+ ")";

        });


      });
    }
  })


});
