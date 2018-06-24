Template.circleGraph.rendered = function () {

  var svg = d3.select(this.find("svg.circleGraph"));
  var height = 100;
  var width = 100;
  var padding = 10;

  svg.attr("width", 100 + padding);
  svg.attr("height", 100 + padding);
  svg.append("circle")
  .attr("cx", (padding + width) / 2)
  .attr("cy", (padding + height) / 2)
  .attr("r", width / 2)
  .attr("fill", "#E8F3F8");
  svg.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", width + padding)

  .attr("fill", "white");
  svg.append("text")
  .attr("x", (padding + width) / 2)

  .attr("fill", "#88B458")
  .attr("text-anchor", "middle")
  .text("");

  svg.append("circle")
  .attr("cx", (padding + width) / 2)
  .attr("cy", (padding + height) / 2)
  .attr("r", width / 2 + 3)
  .attr("fill", "none")
  .attr("stroke", "#C2CBCE");
}
