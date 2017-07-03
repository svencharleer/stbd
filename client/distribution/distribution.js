//general class for distribution graph.
Template.distribution.onRendered(function(){

  var svg = d3.select(this.find(".distribution"));
  var height = 100;
  var width = 190;
  var padding = 5;


  svg.attr("width", width );
  svg.attr("height",height );

  //temp data
  var buckets = [];
  for(var i=0;i<10;i++)
    buckets.push({bucket:i, count:10})

  var rects = svg.selectAll("rect")
              .data(buckets);
  rects.enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", function(d){
      return height - (d.bucket * 10 + padding);
    })
    .attr("width", function(d){
      return 2;
    })
    .attr("height",4)
    .attr("fill", "#CAE9FE")
    .attr("transform", "translate(" + (width/2) + ", 0)");
})
