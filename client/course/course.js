
Template.course.onRendered(function(){
  let instance = this;

  

  instance.autorun(function(){
    //Session.get("student")
    let handler  = instance.subscribe("generic_courses",function(){});
    let handler2 = instance.subscribe("generic_grades",Session.get("student"));
    let handler3 = instance.subscribe("ijkingstoets", Session.get("student"));

    if(handler.ready() && handler2.ready() && handler3.ready()) {
      let studentGrade = instance.data.grade;
      let method = instance.data.method;
      let semester = instance.data.semester;
      let svg = d3.select(instance.find("svg"));
      let courseId = instance.data.id;
      // var height = 20.0;
      // var totalHeight = 100.0;
      if(method == undefined) method = "getCoursePointDistribution";
      if(semester == undefined) semester = 2;
      //ugly hack: if 3, is 2e zit. we want to show histogram depending on the period
      //you received the highest grade. 3 means you'll show grade_try2, so
      //if they got a higher score in try1, we force it to semester=2 (or 1, doesn't matter)

      if(semester == 3 && instance.data.try1 != undefined) {
        if(instance.data.try1 >= instance.data.try2 || instance.data.try2 == "NA")
        semester = 2;
      }

      Meteor.call(method, [courseId, Session.get("Year"), semester], function(err,data){
        let graph = svg.select("g").selectAll("rect");
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
})
