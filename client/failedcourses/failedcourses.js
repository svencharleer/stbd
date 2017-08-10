

Template.failedCourse.onRendered(function(){
  // variables about data
  var instance = this;  
  var data = this.data;
  var courseId = data.id;
  var courseName = data.name;
  var gradeTry1 = data.try1;
  var gradeTry2 = data.try2;
  var courseCredits  = data.credits;
  var gradeStatusTry1 = status(gradeTry1);
  var gradeStatusTry2 = status(gradeTry2);
  var colorTry1 = colorStatus(gradeStatusTry1);
  var colorTry2 = colorStatus(gradeStatusTry2);
  var courseColor = colorCourse(gradeStatusTry1, gradeStatusTry2);


  // layout variables
  var totalWidth = 150;
  var totalHeight = 50;

  var nameWidthFraction = 1;
  var infoHeightFraction = 0.45;
  var tryWidthFraction = 0.3

  var infoWidth = totalWidth;
  var infoHeight = infoHeightFraction * totalHeight;

  var nameWidth = nameWidthFraction * totalWidth;
  var nameHeight = infoHeight;

  var gradeWidth = totalWidth;
  var gradeHeight = (1-infoHeightFraction) * totalHeight;

  var try1Width = tryWidthFraction * gradeWidth;
  var try1Height = gradeHeight;

  var try2Width = tryWidthFraction * gradeWidth;
  var try2Height = gradeHeight;

  var creditsWidth = (1-(2*tryWidthFraction)) * gradeWidth;  
  var creditsHeight = gradeHeight;  
  
  var radius = 0;
  var border = 2;

  // svg variables
  var container = d3.select("#"+courseId +"_failed").append("svg");
  container
    .attr("width",totalWidth)
    .attr("height", totalHeight)
    .style("position", "relative")
    ;
  var bottomLayer = appendSvg(container, "bottomlayer", totalWidth, totalHeight, 0,0);
  var topLayer = appendSvg(container, "toplayer", totalWidth, totalHeight, 0,0);

  var svgInfo = appendSvg(bottomLayer, "info", infoWidth, infoHeight, 0,0);
  var svgName = appendSvg(svgInfo, "name", nameWidth, nameHeight, 0,0);
  
  var svgGrade = appendSvg(bottomLayer, "grade", gradeWidth, gradeHeight, 0, infoHeight);
  var svgGradeTry1 = appendSvg(svgGrade, "try1", try1Width, try1Height,0, 0);
  var svgGradeTry2 = appendSvg(svgGrade, "try2", try2Width, try2Height,try1Width, 0 );
  var svgCredits = appendSvg(svgGrade, "credits", creditsWidth, creditsHeight, (try1Width + try2Width) ,0);

  // A rounded border around everything
  var borderPath = topLayer.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("rx", radius)
    .attr("height", totalHeight)
    .attr("width", totalWidth)
    .style("stroke", courseColor)
    .style("fill", "none")
    .style("stroke-width", border);

  // The course name
  svgName
    .append("text")
    .text(courseName)
      .attr("font-family", "sans-serif")
      .attr("font-size", function(){
          return "9px"
      })
      .attr("color", "#777777")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "central")
      .attr("transform", "translate("+ 0.1*creditsWidth +","+ 10 + ")")
      .call(wrap, nameWidth)
    ;

    
             
  //A line under the name
  var separator = topLayer.append("line")
    .attr("x1", 0)
    .attr("x2", totalWidth)
    .attr("y1", nameHeight)
    .attr("y2", nameHeight)
    .style("stroke", courseColor)
    ;

  // The rectangle where we place the grade
  svgGradeTry1
    .append("path")
      .attr("d", leftbottomRoundedRect(0,0,try1Width, try1Height, radius))
      .attr("fill", colorTry1)
    ;
  svgGradeTry2
    .append("path")
      .attr("d", rightbottomRoundedRect(0,0,try2Width, try2Height, radius))
      .attr("fill", colorTry2)
    ;
  
  svgCredits
    .append("path")
      .attr("d", rightbottomRoundedRect(0,0,creditsWidth, creditsHeight, radius))
      .attr("fill", courseColor)
    ;

  // The grade
  svgGradeTry1
    .append("text")
    .text(gradeTry1)
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .attr("transform", "translate("+ try1Width/2.0 +","+ try1Height/2.0 + ")")
    ;

  svgGradeTry2
    .append("text")
    .text(gradeTry2)
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .attr("transform", "translate("+ try1Width/2.0 +","+ try1Height/2.00 + ")")
    ;

    // The credits of the course
  svgCredits
    .append("text")
    .text(formattedCredits(courseCredits))
      .attr("font-family", "sans-serif")
      .attr("font-size", "15px")
      .style("fill", "#ffffff")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .attr("transform", "translate("+ creditsWidth/2.0 +","+ creditsHeight/2.0 + ")")
  
  
  
  

  function status(grade){
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

  function formattedCredits(credits){
    if(credits != 0)
      return "["+credits +"stp]";
    return "";
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

  function colorCourse(status1, status2){
    var color = "#777777";
    if (status1 === "passed" || status2 === "passed"){
      color = "#A5DC89";
    }
    else if (status1 === "tolerable" || status2 === "tolerable"){
      color =  "#E1B32D";
    }
    else{
      color = "#FD6869";
    }

    return color;
  }

  function leftbottomRoundedRect(x, y, width, height, radius) {
    return "M" + x + "," + y
       + "h" + width
       + "v" + height
       + "h" + (radius - width)
       + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + -radius
       + "z";
  }

  function rightbottomRoundedRect(x, y, width, height, radius) {
    return "M" + x + "," + y
       + "h" + width
       + "v" + (height-radius)
       + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
       + "h" + (radius - width)
       + "z";
  }

  function appendSvg(parent, svgClass, width, height, x, y ){
    var svg = parent.append("svg")
    svg
      .attr("class", svgClass)
      .attr("width", width)
      .attr("height", height)
      .attr("x", x)
      .attr("y", y)
      ;
    return svg;
  }



});
