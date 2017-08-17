Template.resultGraph.helpers({
  color: function(){
    let color = "#ef9a9a";
    if(this.grade < 8) color = "#ff8a80"; //failed
    else if(this.grade > 9) color = "#a5d6a7"; //passed
    else if(this.grade >= 8 && this.grade <= 9) color = "#ffcc80"; //tolerable
    else color = "#ff8a80"; //failed
    return color;
  }
});

// container.on("click", function(){
//   zoom(d3.select(this), 1.5, true);
// });
// container.on("dblclick", function(){
//   zoom(d3.select(this), 2, true)
// });
// container.on("mouseover", function(){
//   if (clicked === false){
//     zoom(d3.select(this), 1.5, false);
//   }
// });
// container.on("mouseout", function(){
//   if (clicked === false){
//     zoom(d3.select(this), 1, false);
//   }
// });

Template.resultGraph.onRendered(function(){
  // TODO: let width depend on screen
  /*
  ++++++++++++++++++++++++++++++++
  +     Name             + stp   +
  + ++++++++++++++++++++++++++++++
  +  Grade +     histogram       +
  +        +                     +
  ++++++++++++++++++++++++++++++++
  Info = name + stp
  Name = 0.8 of width and 0.3 of height
  Grade = 0.25 of width
  */

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !! all these variables are alse defined in course.js!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //let totalCourseWidth   = window.innerWidth / 8.5; // Don't do this.
  let totalCourseWidth   = window.innerWidth / 8.5;
  let totalCourseHeight  = 75;
  let fractionNameWidth  = 0.8;
  let fractionNameHeight = 0.4;
  let fractionGradeWidth = 0.25;

  let courseInfoWidth    = totalCourseWidth ;
  let courseInfoHeight   = fractionNameHeight * totalCourseHeight;
  let courseNameWidth    = fractionNameWidth * courseInfoWidth;
  let courseNameHeight   = courseInfoHeight;
  let courseCreditsWidth = (1-fractionNameWidth) * courseInfoWidth;
  let courseCreditsHeight = courseInfoHeight;
  let gradeWidth  = fractionGradeWidth * totalCourseWidth ;
  let gradeHeight = (1-fractionNameHeight) * totalCourseHeight;
  let svgHistogramWidth  = (1-fractionGradeWidth) * totalCourseWidth;
  let svgHistogramHeight = gradeHeight;

  let border = 2;
  let radius = 3;

  let clicked = false;
  let instance = this;

  let data = this.data;
  let courseId = data.id;
  let courseName = data.name;
  let courseGrade = data.grade;
  let realGrade = data.realGrade;
  let semesterCourse = data.semester;
  let courseCredits  = data.credits;

  let gradeStatus = status(realGrade);
  let courseColor = colorStatus(gradeStatus);

  let container = d3.select("#"+courseId +"_"+semesterCourse);
  let svgHistogram = container.select(".histogram")
  .attr("class","histogram")
  .attr("width", 160)
  .attr("height", 40)
  .attr("x", 0)
  .attr("y", 0)

  // var svgHistogram = appendSvg(container, "histogram", 100, 75, 0, 0);

  // function appendSvg(parent, svgClass, width, height, x, y ){
  //   var svg = parent.append("svg")
  //   svg
  //   .attr("class", svgClass)
  //   .attr("width", width)
  //   .attr("height", height)
  //   .attr("x", x)
  //   .attr("y", y)
  //   ;
  //   return svg;
  // }

  function status(grade) {
    if(grade < 8){
      return "failed";
    }
    else if(grade > 9) {
      return "passed";
    }
    else if(grade >= 8 && grade <= 9){
      return "tolerable";
    }
    else {
      return "failed";
    }
  }

  function colorStatus(status){
    switch(status){
      case "failed":
      color = "#FD6869";
      break;
      case "tolerable":
      color = "#E1B32D";
      break;
      case "passed":
      color = "#A5DC89";
      break;
      default:
      color = "#777777";
    }
    return color;
  }

  // function formattedCredits(credits){
  //   if(credits != 0)
  //   return "["+credits +"stp]";
  //   return "";
  // }
  //
  // function wrapCourseName() {
  //   var self = d3.select(this),
  //   textLength = self.node().getComputedTextLength(),
  //   text = self.text();
  //   while (textLength > (0.9 * courseNameWidth) && text.length > 0) {
  //     text = text.slice(0, -1);
  //     self.text(text + '...');
  //     textLength = self.node().getComputedTextLength();
  //   }
  // }

  // function wrap(text, width) {
  //   text.each(function() {
  //     var text = d3.select(this),
  //     words = text.text().split(/\s+/).reverse(),
  //     word,
  //     line = [],
  //     lineNumber = 0, //<-- 0!
  //     lineHeight = 1.2, // ems
  //     x = text.attr("x"), //<-- include the x!
  //     y = text.attr("y"),
  //     dy = text.attr("dy") ? text.attr("dy") : 0; //<-- null check
  //     tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
  //     while (word = words.pop()) {
  //       line.push(word);
  //       tspan.text(line.join(" "));
  //       if (tspan.node().getComputedTextLength() > width) {
  //         line.pop();
  //         tspan.text(line.join(" "));
  //         line = [word];
  //         tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
  //       }
  //     }
  //   });
  // }

  // function leftbottomRoundedRect(x, y, width, height, radius) {
  //   return "M" + x + "," + y
  //   + "h" + width
  //   + "v" + height
  //   + "h" + (radius - width)
  //   + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + -radius
  //   + "z";
  // }

  // function appendSvg(parent, svgClass, width, height, x, y ){
  //   var svg = parent.append("svg")
  //   svg
  //   .attr("class", svgClass)
  //   .attr("width", width)
  //   .attr("height", height)
  //   .attr("x", x)
  //   .attr("y", y);
  //   return svg;
  // }

  // Make all svg's
  //var bottomLayer = appendSvg(container, "bottomlayer", totalCourseWidth, totalCourseHeight, 0,0);
  //var topLayer = appendSvg(container, "toplayer", totalCourseWidth, totalCourseHeight, 0,0);
  //var svgCourseInfo = appendSvg(bottomLayer, "courseinfo", courseInfoWidth, courseInfoHeight,0,0);
  //var svgCourseName = appendSvg(svgCourseInfo, "coursename", courseNameWidth, courseNameHeight,0,0);
  //var svgCourseCredits = appendSvg(svgCourseInfo, "coursecredits", courseCreditsWidth, courseCreditsHeight,courseNameWidth,0);
  //var svgCourseGrade = appendSvg(bottomLayer, "coursegrade", gradeWidth, gradeHeight,0,courseInfoHeight);

  // A rounded border around everything
  // var borderPath = topLayer.append("rect")
  // .attr("x", 0)
  // .attr("y", 0)
  // .attr("rx", radius)
  // .attr("height", totalCourseHeight)
  // .attr("width", totalCourseWidth)
  // .style("stroke", courseColor)
  // .style("fill", "none")
  // .style("stroke-width", border);

  //A line under the name
  // var separator = topLayer.append("line")
  // .attr("x1", 0)
  // .attr("x2", totalCourseWidth)
  // .attr("y1", courseInfoHeight)
  // .attr("y2", courseInfoHeight)
  // .style("stroke", courseColor);

  // The rectangle where we place the grade
  // svgCourseGrade
  // .append("path")
  // .attr("d", leftbottomRoundedRect(0,0,gradeWidth, gradeHeight, radius))
  // .attr("fill", courseColor);

  // The grade
  // svgCourseGrade
  // .append("text")
  // .text(realGrade)
  // .attr("font-family", "sans-serif")
  // .attr("font-size", "20px")
  // .attr("fill", "white")
  // .attr("text-anchor", "middle")
  // .attr("alignment-baseline", "central")
  // .attr("transform", "translate("+ gradeWidth/2.0 +","+ gradeHeight/2.0 + ")");

  // The course name
  // svgCourseName
  // .append("text")
  // .append('tspan')
  // .text(courseName)
  // .attr("font-family", "sans-serif")
  // .attr("font-size", function(){
  //   return "8px"
  // })
  // .attr("color", "#777777")
  // .attr("x", 0.5 * courseInfoWidth)
  // .attr("y", courseNameHeight/2)
  // .attr("alignment-baseline", "central")
  // .attr("text-anchor", "middle")
  // // .each(wrapCourseName)
  // .call(wrap, 0.6 * courseInfoWidth);

  // The credits of the course
  // svgCourseCredits
  // .append("text")
  // .text(formattedCredits(courseCredits))
  // .attr("font-family", "sans-serif")
  // .attr("font-size", "8px")
  // .attr("color", "#777777")
  // .attr("text-anchor", "end")
  // .attr("alignment-baseline", "central")
  // .attr("transform", "translate("+ 0.9*courseCreditsWidth +","+ 0.5 * courseCreditsHeight + ")")
  // .call(wrap, 0.9 * courseCreditsWidth);

  // function createHistogramDict(min, max){
  //   /**
  //   * Create dict from min to max (included)
  //   * count for every score to zero
  //   */
  //   return startValues;
  // };

  function createLegend(svg, legendWidth, histogramHeight){
    // let margin = 10;
    // let barWidth = (0.9*legendWidth) / 21;
    // let space = 0.05 * legendWidth;
    // 1 -> 7.6 pixels
    svg.append("rect") // < 8 Failed
    .attr("stroke","#ff8a80")
    .attr("width", 60.8)
    .attr("height",1)
    .attr("transform", "translate(0,40)");

    svg.append("rect") // 8-9 Tolerated
    .attr("stroke","#ffcc80")
    .attr("width", 15.2)
    .attr("height", 1)
    .attr("transform","translate(60.8,40)"); // 40% of histogram width.

    svg.append("rect") // > 9 Pass 45% of histogram width.
    .attr("stroke","#a5d6a7")
    .attr("width", 84)
    .attr("height",1)
    .attr("transform","translate(76,40)");
  }

  function createHistogram(svg, totalWidth, totalHeight){
    /* Create a histogram
    @param svg: svg you want to fill width the histogram + legend
    @param totalwidth: totalWidth of the svg = width of histogram
    @param totalHeight: totalHeigth of the svg = height of histogram */

    // let barSelect = "#020202";
    // let colorScale = chroma.scale(["#0099FF","#F566FF"]);
    // let margin  = 0.05 * totalWidth;
    // let widthEachScore = 0.9 * totalWidth / 21;
    // let barFraction = 0.95
    // let barWidth = barFraction  * widthEachScore;
    // let spaceWidth = (1- barFraction) * widthEachScore;
    let legendFraction = 0.2
    let histogramHeight = (1- legendFraction ) * totalHeight;
    // create basic graph without data
    // real data inputted in course.js
    // Create dict to count nb occurences each score
    let startValues = [];
    for(let i = 0;i <= 20; i++) startValues.push({grade:i, count:0});
    startValues.max = 20;
    // Create bars for every score
    svg.append("g").selectAll("rect")
    .data(startValues)
    .enter().append("rect")
    .attr("width", 4) // Not overwritten
    .attr("fill", "white");
    // .attr("height", function(d){ // overwritten in course.js
    //   return d.count * 0.01 * startValues.max * histogramHeight; // max = 100% * histHeight => unitHeight
    // })
    // .attr("fill", "#CBCBCB") // overwritten in course.js, fill the bars
    // .attr("transform", function(d,i){
    //   // overwritten in course.js
    //   return "translate(" + (d.grade * widthEachScore) + ","+ (1.0 - d.count/(startValues.max- 0)) * totalHeight+ ")";
    // });
    // if all of this gets overwritted then why bother???
    createLegend(svg, 160, 40);
  }

  createHistogram(svgHistogram, svgHistogramWidth, svgHistogramHeight);

  function zoom(instance, scale, click){
    if (clicked || scale === 1){
      instance
      .style("transform" , "scale(1,1)")
      .style("background", "none")
      .style("z-index",    "auto")
      .style("box-shadow", "none");
      if (click){
        clicked = false;
      }
    }
    else{
      instance
      .style("transform" , "scale(" + scale + "," + scale )
      .style("background", "white")
      .style("z-index", Number.MAX_SAFE_INTEGER)
      .style("box-shadow", "1px 1px 8px #828282");
      if (click){
        clicked = true;
      }
    }
  }

  container.on("click", function(){
    zoom(d3.select(this), 1.5, true);
  });
  container.on("dblclick", function(){
    zoom(d3.select(this), 2, true)
  });
  container.on("mouseover", function(){
    if (clicked === false){
      zoom(d3.select(this), 1.5, false);
    }
  });
  container.on("mouseout", function(){
    if (clicked === false){
      zoom(d3.select(this), 1, false);
    }
  });



});
