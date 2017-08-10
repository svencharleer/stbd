
Template.course.onRendered(function(){
  var instance = this;
  

  var bar = "#CBCBCB";
  var barSelect = "#020202";

  instance.autorun(function(){
    //Session.get("student")
    var handler = instance.subscribe("generic_courses",function(){});
    var handler2 = instance.subscribe("generic_grades",Session.get("student"));
    var handler3 = instance.subscribe("ijkingstoets", Session.get("student"));

    if(handler.ready() && handler2.ready() && handler3.ready())
    {

      var studentGrade = instance.data.grade;

      var method = instance.data.method;
      var semester = instance.data.semester;
      var svg = d3.select(instance.find("svg"));

      var graph = svg.select("g").selectAll("rect");
      var courseId = instance.data.id;

      var height = 20.0;
      var totalHeight = 100.0;
      if(method == undefined) method = "getCoursePointDistribution";
      if(semester == undefined) semester = 2;
      //ugly hack: if 3, is 2e zit. we want to show histogram depending on the period
      //you received the highest grade. 3 means you'll show grade_try2, so
      //if they got a higher score in try1, we force it to semester=2 (or 1, doesn't matter)

      if(semester == 3 && instance.data.try1 != undefined)
      {
        if(instance.data.try1 >= instance.data.try2 || instance.data.try2 == "NA")
          semester = 2;
      }

      Meteor.call(method, [courseId, Session.get("Year"), semester], function(err,data){
        //if(courseId == "H01A4A") console.log(courseId, studentGrade, Session.get("student"));
        //console.log("getCoursePointDistribution");

        graph.data(data.numberPerGrades)
        graph.transition()
                          .attr("height",function(d){
                              //wider if it's a grade that past
                              //if(d.count == 0) console.log(d.count)
                              return d.count/(data.max) * height;
                          })
                          .attr("fill", function(d){
                              if(d.grade == studentGrade)
                                  return barSelect;
                              else
                                  return bar;
                          })
                          .attr("transform",function(d,i){
                              var spacing = 10.0;


                              return "translate(" + ((d.grade / 20.0) * spacing +   (d.grade / 20.0) * totalHeight).toString() + ","+ (1.0 - d.count/(data.max- 0)) * height+ ")";

                          });


      });
    }
  })
})
