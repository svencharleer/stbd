
Template.course.onRendered(function(){
  let instance = this;

  let totalCourseWidth = window.innerWidth / 8.5;
  let totalCourseHeight = 75;

  let fractionNameWidth  = 0.8;
  let fractionNameHeight = 0.4;
  let fractionGradeWidth = 0.25;
  let courseInfoWidth = totalCourseWidth ;
  let courseInfoHeight = fractionNameHeight * totalCourseHeight;
  let courseNameWidth = fractionNameWidth * courseInfoWidth;
  let courseNameHeight = courseInfoHeight;
  let courseCreditsWidth = (1-fractionNameWidth) * courseInfoWidth;
  let courseCreditsHeight = courseInfoHeight;

  let gradeWidth = fractionGradeWidth * totalCourseWidth ;
  let gradeHeight = (1-fractionNameHeight) * totalCourseHeight;
  let svgHistogramWidth = (1-fractionGradeWidth) * totalCourseWidth;
  let svgHistogramHeight = gradeHeight;

  let totalWidth = svgHistogramWidth;
  let totalHeight = svgHistogramHeight;
  let bar = "#CBCBCB";
  let barSelect = "#020202";
  let colorScale = chroma.scale(["#0099FF","#F566FF"]);
  let margin  = 0.05 * totalWidth;
  let widthEachScore = 0.9 * totalWidth / 21;
  let barFraction = 0.95
  let barWidth = barFraction  * widthEachScore;
  let spaceWidth = (1- barFraction) * widthEachScore;
  let legendFraction = 0.2
  let histogramHeight = (1- legendFraction ) * totalHeight;

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
        //if(courseId == "H01A4A") console.log(courseId, studentGrade, Session.get("student"));
        //console.log("getCoursePointDistribution");
        //console.log(instance.data.name);
        //console.log(data);
        let graph = svg.select("g").selectAll("rect");
        graph.data(data.numberPerGrades)
        graph.transition()
        .attr("height",function(d){
          //wider if it's a grade that past
          //if(d.count == 0) console.log(d.count)
          // return d.count/(data.max) * height;
          let heightUnit = (1.0/ data.max) * 0.9 * histogramHeight;
          //return d.count * heightUnit;
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
          // let space = 0.1 * histogramHeight;
          // let maxBarHeight = 0.9 * histogramHeight;
          // let heightUnit = (1.0/ data.max) * maxBarHeight ;
          return "translate(" + (d.grade * 7.8) + ","+ (40 - ((d.count * 40)/data.max))  +  ")";
          // var spacing = 10.0;
          // return "translate(" + ((d.grade / 20.0) * spacing +   (d.grade / 20.0) * totalHeight).toString() + ","+ (1.0 - d.count/(data.max- 0)) * height+ ")";
        });


      });
    }
  })
})
