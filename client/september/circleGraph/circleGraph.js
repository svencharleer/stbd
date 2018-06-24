Template.circleGraph.helpers({
  "checked":function () {
    return 60;
  },
  "all":function () {
    return 20;
  }
});

// Deprecated ->>>
// Template.circleGraph.rendered = function () {
//
//   let svg = d3.select(this.find(".circleGraph"));
//   let height = 100;
//   let width  = 100;
//
//   svg.attr("width",  width);
//   svg.attr("height", height);
//
//   svg.append("circle")
//   .attr("cx", (width)  / 2)
//   .attr("cy", (height) / 2)
//   .attr("r", width / 2)
//   .attr("fill", "#E8F3F8");
//
//   svg.append("rect")
//   .attr("x", 0)
//   .attr("y", 0)
//   .attr("width", width)
//   .attr("fill", "white");
//
//   svg.append("text")
//   .attr("x", (width) / 2)
//   .attr("fill", "#88B458")
//   .attr("text-anchor", "middle")
//   .text("");
//
//   svg.append("circle")
//   .attr("cx", (width) / 2)
//   .attr("cy", (height) / 2)
//   .attr("r", width / 2 + 3)
//   .attr("fill", "none")
//   .attr("stroke", "#C2CBCE");
// }
