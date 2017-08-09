Template.resultGraph.helpers({
  status(grade) {

    if(grade < 8)
    {
      return "failed";
    }
    else if(grade > 9)
    {
      return "passed";
    }
    else if(grade >= 8 && grade <= 9){
      return "tolerable";
    }
    else {
      return "failed";
    }
  },
  formattedCredits(credits){
    if(credits != 0)
      return "["+credits +"stp]";
    return "";
  }
})

Template.resultGraph.onRendered(function(){
  // TODO: let width depend on screen
  var totalCourseWidth = 150;
  var totalCourseHeight = 50;
  var gradeWidth = totalCourseWidth / 4.5;
  var gradeHeight = totalCourseHeight;
  var detailsWidth = totalCourseWidth - gradeWidth;
  var detailsHeight = totalCourseHeight;
  var border = 1;

  var instance = this;
  var data = this.data;
  var courseId = data.id;
  var courseName = data.name;
  var courseGrade = data.grade;
  var realGrade = data.realGrade;
  var semesterCourse = data.semester;
  var courseCredits  = data.credits;
  var gradeStatus = status(courseGrade);
  var courseColor = colorStatus(gradeStatus);
   
  var container = d3.select("#"+courseId).append("svg");
  var bottomLayer = container.append("svg");
  var topLayer = container.append("svg");

  function status(grade) {

    if(grade < 8)
    {
      return "failed";
    }
    else if(grade > 9)
    {
      return "passed";
    }
    else if(grade >= 8 && grade <= 9){
      return "tolerable";
    }
    else {
      return "failed";
    }
  };

  function colorStatus(status){
    switch(status){
      case "failed":
        color = "#FD6869";
        break;
      case "tolerable":
        color = "#E1B32";
        break;
      case "passed":
        color = "#A5DC89";
        break;
      default:
        color = "#777777";
    }
    return color;
  }

  function formattedCredits(credits){
    if(credits != 0)
      return "["+credits +"stp]";
    return "";
  }

  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")) || 0,
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

  bottomLayer
    .attr("class", "bottomLayer")
    .attr("width", totalCourseWidth)
    .attr("height", totalCourseHeight);

  

  

  topLayer
    .attr("class", "topLayer")
    .attr("width", totalCourseWidth)
    .attr("height", totalCourseHeight)
    .attr("x", 0)
    .attr("y", 0)
    ;

var borderPath = topLayer.append("rect")
       			.attr("x", 0)
       			.attr("y", 0)
       			.attr("height", totalCourseHeight)
       			.attr("width", totalCourseWidth)
       			.style("stroke", courseColor)
       			.style("fill", "none")
       			.style("stroke-width", border);

  
  

  var svgCourseGrade = bottomLayer.append("svg");
  svgCourseGrade
    .attr("class" , "grade")
    .attr("width", gradeWidth)
    .attr("height", gradeHeight)
    .append("rect")
      .attr("width", gradeWidth)
      .attr("height", gradeHeight)
      .attr("fill", courseColor)
    ;

  svgCourseGrade
    .append("text")
    .text(realGrade)
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .attr("transform", "translate("+ gradeWidth/2.0 +","+ gradeHeight/2.0 + ")")
    ;

  var svgCourseDetails = bottomLayer.append("svg");
  svgCourseDetails
    .attr("class" , "details")
    .attr("width", detailsWidth)
    .attr("height", detailsHeight)
    .attr("x", gradeWidth)
    ;

  svgCourseDetails
    .append("text")
    .text(courseName + " " + formattedCredits(courseCredits))
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("color", "#777777")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .attr("transform", "translate("+ detailsWidth/2.0 +","+ 10 + ")")
      .call(wrap, detailsWidth)
    ;
  
  

  var svgHistogram = svgCourseDetails.append("svg");
  svgHistogram
    .attr("class" , "histogram")
    .attr("width", detailsWidth)
    .attr("height", detailsHeight/2.0)
    .attr("y", detailsHeight/2.0)
    ;

  

  

  // svgCourseDetails.append("text")
  //   .text(courseName +" "+ formattedCredits(creditsCourse)); 
  
  //get data from template (passed by parent)


  var cPass = "#3BFD40";
  var cTolerable= "#E1B32D";
  var cFailed = "#FD686A";
  var bar = "#CBCBCB";
  var barSelect = "#020202";
  var colorScale = chroma.scale(["#0099FF","#F566FF"]);
  var height = 20;
  var totalHeight = 100;





  //create basic graph without data
  var tempMax = 20; var tempMin = 0;
  var svg = svgHistogram;
  var startValues = [];
  for(var i = 0;i <= 20; i++)
  {
    startValues.push({grade:i, count:0});
  }
  startValues.max = 20;
  var g = svg.append("g");
  var graph = g.selectAll("rect")
                      .data(startValues);
  svg

          .append("rect")
          .attr("stroke",cFailed)
          .attr("width",totalHeight *.4 + 10 *.4)
          .attr("height",1)
          .attr("transform", "translate(0, " + (height + 2) +")")
          ;
  svg

          .append("rect")
          .attr("stroke",cTolerable)
          .attr("width",totalHeight *.1 + 10 *.1)
          .attr("height",1)
          .attr("transform","translate("+ (totalHeight *.4 + 10 *.4) + "," + (height + 2) +")")
  ;
  svg

          .append("rect")
          .attr("stroke",cPass)
          .attr("width",totalHeight *.55 + 10 *.55)
          .attr("height",1)
          .attr("transform","translate("+ (totalHeight *.5 + 10 *.5) +  "," + (height + 2) +")")
  ;
  graph.enter().append("rect")
                    .attr("height",function(d){
                        //wider if it's a grade that past
                        return d.count/(startValues.max- 0) * height;
                    })
                    .attr("width",function(d){
                        return .05 * totalHeight;
                    })
                    .attr("fill", function(d){

                            return bar;
                    })
                    .attr("transform",function(d,i){
                        var spacing = 10.0;
                        return "translate(" + ((d.grade / 20.0) * spacing +   (d.grade / 20.0) * totalHeight).toString() + ","+ (1.0 - d.count/(startValues.max- 0)) * height+ ")";

                    });

});
