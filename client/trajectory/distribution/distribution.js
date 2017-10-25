//general class for distribution graph.
Template.distribution.onRendered(function () {
  var svg = d3.select(this.find(".distribution"));
  var height = 100;
  var width = 180;
  var padding = 5;

  svg.attr("width", width);
  svg.attr("height", height);

  //temp data
  var buckets = [];
  for (var i = 0; i < 10; i++)
    buckets.push({bucket: i, count: 10})

});
