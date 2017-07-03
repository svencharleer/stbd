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

  var instance = this;

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
  var svg = d3.select(this.find("svg"));
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
          .attr("transform","translate(0, " + (height + 2) +")")
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
