Template.trajectoryperiod.onRendered(function () {
  var instance = this;
  instance.autorun(function () {
    var period = instance.data.period;
    var semester = instance.data.semester;
    var cse = Session.get("CSE_" + period);
    var svg = d3.select("#distribution_" + period + " svg.distribution");
    Meteor.call("getDistribution", semester, Session.get("program"), function (err, data) {
      //find max value and min value
      var min = Number.MAX_VALUE;
      var max = Number.MIN_VALUE;
      var count = 0;
      data.distribution.forEach(function (d) {
        if (d.count > max)
          max = d.count;
        if (d.count < min)
          min = d.count;
        count += d.count;
      });

      let total = count;
      let width = 350;
      let container = svg.selectAll(".figures")
        .data(data.distribution).enter();

      container.append("rect") //Trace element
        .attr("class", function (d) {
          return "trace trace" + d.bucket;
        })
        .attr("fill", function (d) {
          let current = d.bucket * 10;
          let next = current + 11;
          let color = "white";
          if (cse === 0) cse = 1;
          if ((current < cse) && (cse < next)) color = "#E8F3F8";
          return color;
        })
        .attr("width", "100%")
        .on("mouseover", function (d) {
          svg.selectAll(".tooltip" + d.bucket).style("display", "inline");
          element = $(this).parent().parent().attr('id');
        })
        .on("mouseout", function (d) {
          svg.selectAll(".tooltip" + d.bucket).style("display", "none");
          element = $(this).parent().parent().attr('id')

        })
        .on('click', function (d) {
          element = $(this).parent().parent().attr('id');
        })
        .attr("height", 10)
        .attr("x", "0")
        .attr("y", function (d, i) {
          return 98 - ((d.bucket * 10) + 6);
        });

      let circles = container.append("g") // Dotplot Dots
        .attr("class", "row")
        .selectAll("circle")
        .data(function (d) {
          let dots = Math.round(((50 * d.count) / total));
          if (dots > 35) dots = 35;
          return d3.range(dots);
        })
        .enter()
        .append("circle")
        .on("mouseover", function (d) {
          svg.select(".tooltip" + d.bucket).style("display", "inline");
        })
        .on("mouseout", function (d) {
          svg.select(".tooltip" + d.bucket).style("display", "none");
        })
        .attr("fill", function (d) {
          if (_.isNaN(cse)) cse = 0;
          if (_.isUndefined(cse)) cse = 0;
          //if (cse == 0) cse = 1;
          let pbucket = d3.select(this.parentNode).datum().bucket;
          let current = pbucket * 10;
          let next = current + 11;
          if ((current < cse) && (cse < next))
            return "#81A8B8"; else return "#C2CBCE";
        })
        .attr("stroke", "none")
        .attr("r", 3)
        .attr("cx", function (d) {
          return (width / 2);
        })
        .attr("cy", function (d, i) {
          return 98 - ((d3.select(this.parentNode).datum().bucket * 10) + 1.4);
        })
        .transition()
        .duration(1000)
        .ease("exp")
        .attr("cx", function (d, i) {
          let parent = d3.select(this.parentNode).datum().count;
          let start = (Math.round(((50 * parent) / total)) * 8) + 2;
          return ((width / 2) + (i * 8)) - start / 2;
        });

      /** Tooltip **/
      let text = container.append("text")
        .attr("class", function (d) {
          return "tooltip tooltip" + d.bucket;
        })
        .style("z-index", 1000)
        .attr("x", 350)
        .attr("text-anchor", "end")
        .attr("y", function (d, i) {
          return (100 - (d.bucket * 10));
        })
        .text(function (d) {
          return ((Math.round((50 * d.count) / total) * 2)) + "%";
        })
        .attr("width", 180)
        .attr("height", 4)
        .attr("font-size", 10);
    })
    })
});
