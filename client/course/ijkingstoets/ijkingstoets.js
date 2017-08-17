

Template.ijkingstoets.onCreated(function(){


  var instance = this;
  var bar = "#CBCBCB";
  var barSelect = "#020202";

  instance.autorun(function(){
    Session.get("student");

    var handler = instance.subscribe("generic_courses",function(){});
    var handler2 = instance.subscribe("generic_grades",Session.get("student"));;
    if(handler.ready() && handler2.ready()){
      var period  = instance.data.id;
      var studentGrade = instance.data.grade;
      var svg = d3.select("." + period + " svg");

      var graph = svg.select("g").selectAll("rect");
      var courseId = period;

      var height = 20;
      var totalHeight = 100;
      Meteor.call("getIjkingstoetsPointDistribution", [Session.get("StartYear")], function(err,data){

        if(courseId == "ijkingstoets_juli")
        data = data[0];
        else if(courseId == "ijkingstoets_september")
        data = data[1];
        else return;

        graph.data(data.numberPerGrades)
        graph.transition()
        .attr("height",function(d){
          //wider if it's a grade that past
          return d.count/(data.max- 0) * height;
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
