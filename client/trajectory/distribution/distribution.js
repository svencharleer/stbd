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

  // var rects = svg.selectAll("rect")
  // .data(buckets)
  // .enter()
  // .append("g")
  // .attr("class","row")
  // .data(function(d){return d3.range(5)})
  // .enter()
  // .append("circle")
  // .attr("class","dot")
})
