let noUiSlider = require('nouislider');

Template.CSETool.helpers({
  limit1: function () {
    return Math.round(Session.get('limit1'));
  },
  limit2: function () {
    return Math.round(Session.get('limit2'));
  },
  program: function(){
    return Session.get("program");
  }
});

Template.CSETool.onRendered(function () {
  let instance = this;
  let slider1  = document.getElementById('limit-slider1');
  let slider2  = document.getElementById('limit-slider2');
  var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  noUiSlider.create(slider1, { start: Session.get("limit1"), connect: "lower", range: {min: 0, max: 100}});
  noUiSlider.create(slider2, { start: Session.get("limit2"), connect: "lower", range: {min: 0, max: 100}});

  slider1.noUiSlider.on('update', function(value) {
    if (value < Session.get("limit2")) {
      $('#cse-limit1').css('color', "#e74c3c");
      $('#cse-limit2').css('color', "#e74c3c");
    } else {
      $('#cse-limit1').css('color', "#424242");
      $('#cse-limit2').css('color', "#424242");
    }
    Session.set("limit1",Math.round(value));
  });

  slider2.noUiSlider.on('update', function(value) {
    if (value > Session.get("limit1")) {
      $('#cse-limit1').css('color', "#e74c3c");
      $('#cse-limit2').css('color', "#e74c3c");
    } else {
      $('#cse-limit1').css('color', "#424242");
      $('#cse-limit2').css('color', "#424242");
    }
    Session.set("limit2",Math.round(value));
  });

  let data = Session.get("cse_data");
  let svg = d3.select("#cse-tool-d3")
  .append('svg')
  .attr('width',  800)
  .attr('height', 300);
  var pos_y1 = 0;
  var pos_y2 = 0;
  var pos_y3 = 0;
  var pos_y4 = 0;
  var pos_x1 = 0;

  let circles = svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("r", 3)
  .attr("class", function(d){
    let name;
    if(d.year == "NULL") name = "bad";
    if(d.year == 2)      name = "low";
    if(d.year == 1)      name = "mid";
    if(d.year <  1)      name = "top";
    return name;
  })
  .style("fill", function(d) {
    let color = "";
    if(d.year == "NULL") color = "rgba(255, 193, 227, 1)";
    if(d.year == 2)      color = "rgba(159, 168, 218, 1)";
    if(d.year == 1)      color = "rgba(128, 222, 234, 1)";
    if(d.year <  1)      color = "rgba(165, 214, 167, 1)";
    return color;
  });

  let group1 = svg.append("g");
  let group2 = svg.append("g");
  let group3 = svg.append("g");
  let tag1g1 = group1.append("g");
  let tag2g1 = group1.append("g");
  let tag3g1 = group1.append("g");
  let tag4g1 = group1.append("g");
  let tag1g2 = group2.append("g");
  let tag2g2 = group2.append("g");
  let tag3g2 = group2.append("g");
  let tag4g2 = group2.append("g");
  let tag1g3 = group3.append("g");
  let tag2g3 = group3.append("g");
  let tag3g3 = group3.append("g");
  let tag4g3 = group3.append("g");

  tag1g1.append("circle").attr("class", "sql-bad").attr("cy", 280);
  tag2g1.append("circle").attr("class", "sql-low").attr("cy", 260);
  tag3g1.append("circle").attr("class", "sql-mid").attr("cy", 240);
  tag4g1.append("circle").attr("class", "sql-top").attr("cy", 220);
  tag1g2.append("circle").attr("class", "sql-bad").attr("cy", 280);
  tag2g2.append("circle").attr("class", "sql-low").attr("cy", 260);
  tag3g2.append("circle").attr("class", "sql-mid").attr("cy", 240);
  tag4g2.append("circle").attr("class", "sql-top").attr("cy", 220);
  tag1g3.append("circle").attr("class", "sql-bad").attr("cy", 280);
  tag2g3.append("circle").attr("class", "sql-low").attr("cy", 260);
  tag3g3.append("circle").attr("class", "sql-mid").attr("cy", 240);
  tag4g3.append("circle").attr("class", "sql-top").attr("cy", 220);
  tag1g1.append("text").attr("y", 280 + 4);
  tag2g1.append("text").attr("y", 260 + 4);
  tag3g1.append("text").attr("y", 240 + 4);
  tag4g1.append("text").attr("y", 220 + 4);
  tag1g2.append("text").attr("y", 280 + 4);
  tag2g2.append("text").attr("y", 260 + 4);
  tag3g2.append("text").attr("y", 240 + 4);
  tag4g2.append("text").attr("y", 220 + 4);
  tag1g3.append("text").attr("y", 280 + 4);
  tag2g3.append("text").attr("y", 260 + 4);
  tag3g3.append("text").attr("y", 240 + 4);
  tag4g3.append("text").attr("y", 220 + 4);

  svg.append("text").attr("class", "titlegp title-gp1").attr("y", 38);
  svg.append("text").attr("class", "titlegp title-gp2").attr("y", 38);
  svg.append("text").attr("class", "titlegp title-gp3").attr("y", 38);

  this.autorun(function () {
    // Select all top, mid, low and bad
    // Filter them for Limit 1.
    var limit1 = Session.get("limit1");
    var limit2 = Session.get("limit2");
    var height = 200;
    let top_limit1 = svg.selectAll(".top").filter(function(d) { return d.cse > limit1; });
    let mid_limit1 = svg.selectAll(".mid").filter(function(d) { return d.cse > limit1; });
    let low_limit1 = svg.selectAll(".low").filter(function(d) { return d.cse > limit1; });
    let bad_limit1 = svg.selectAll(".bad").filter(function(d) { return d.cse > limit1; });

    let top_limit2 = svg.selectAll(".top").filter(function(d) { return (d.cse <= limit1) && (d.cse >= limit2); });
    let mid_limit2 = svg.selectAll(".mid").filter(function(d) { return (d.cse <= limit1) && (d.cse >= limit2); });
    let low_limit2 = svg.selectAll(".low").filter(function(d) { return (d.cse <= limit1) && (d.cse >= limit2); });
    let bad_limit2 = svg.selectAll(".bad").filter(function(d) { return (d.cse <= limit1) && (d.cse >= limit2); });

    let top_limit3 = svg.selectAll(".top").filter(function(d) { return d.cse < limit2; });
    let mid_limit3 = svg.selectAll(".mid").filter(function(d) { return d.cse < limit2; });
    let low_limit3 = svg.selectAll(".low").filter(function(d) { return d.cse < limit2; });
    let bad_limit3 = svg.selectAll(".bad").filter(function(d) { return d.cse < limit2; });

    var n_dots  = circles[0].length;
    var n_top_1 = top_limit1[0].length;
    var n_mid_1 = mid_limit1[0].length;
    var n_low_1 = low_limit1[0].length;
    var n_bad_1 = bad_limit1[0].length;
    var n_top_2 = top_limit2[0].length;
    var n_mid_2 = mid_limit2[0].length;
    var n_low_2 = low_limit2[0].length;
    var n_bad_2 = bad_limit2[0].length;
    var n_top_3 = top_limit3[0].length;
    var n_mid_3 = mid_limit3[0].length;
    var n_low_3 = low_limit3[0].length;
    var n_bad_3 = bad_limit3[0].length;

    var start1 = 0;
    var gp_all = 20;

    var c_top_1 = (Math.ceil(n_top_1 / gp_all) * gp_all)/2;
    var c_mid_1 = (Math.ceil(n_mid_1 / gp_all) * gp_all)/2;
    var c_low_1 = (Math.ceil(n_low_1 / gp_all) * gp_all)/2;
    var c_bad_1 = (Math.ceil(n_bad_1 / gp_all) * gp_all)/2;
    var c_top_2 = (Math.ceil(n_top_2 / gp_all) * gp_all)/2;
    var c_mid_2 = (Math.ceil(n_mid_2 / gp_all) * gp_all)/2;
    var c_low_2 = (Math.ceil(n_low_2 / gp_all) * gp_all)/2;
    var c_bad_2 = (Math.ceil(n_bad_2 / gp_all) * gp_all)/2;
    var c_top_3 = (Math.ceil(n_top_3 / gp_all) * gp_all)/2;
    var c_mid_3 = (Math.ceil(n_mid_3 / gp_all) * gp_all)/2;
    var c_low_3 = (Math.ceil(n_low_3 / gp_all) * gp_all)/2;
    var c_bad_3 = (Math.ceil(n_bad_3 / gp_all) * gp_all)/2;

    orderDots(top_limit1, gp_all, start1, height);
    orderDots(mid_limit1, gp_all, start1 + c_top_1, height);
    orderDots(low_limit1, gp_all, start1 + c_mid_1 + c_top_1, height);
    orderDots(bad_limit1, gp_all, start1 + c_low_1 + c_mid_1 + c_top_1, height);

    var start2 = (start1 + c_bad_1 + c_low_1 + c_mid_1 + c_top_1) + 120;
    orderDots(top_limit2, gp_all, start2, height);
    orderDots(mid_limit2, gp_all, start2 + c_top_2, height);
    orderDots(low_limit2, gp_all, start2 + c_mid_2 + c_top_2, height);
    orderDots(bad_limit2, gp_all, start2 + c_low_2 + c_mid_2 + c_top_2, height);

    var start3 = (start2 + c_bad_2 + c_low_2 + c_mid_2 + c_top_2) + 120;
    orderDots(top_limit3, gp_all, start3, height);
    orderDots(mid_limit3, gp_all, start3 + c_top_3, height);
    orderDots(low_limit3, gp_all, start3 + c_mid_3 + c_top_3, height);
    orderDots(bad_limit3, gp_all, start3 + c_low_3 + c_mid_3 + c_top_3, height);

    let n1 = n_top_1 + n_mid_1 + n_low_1 + n_bad_1;
    let n2 = n_top_2 + n_mid_2 + n_low_2 + n_bad_2;
    let n3 = n_top_3 + n_mid_3 + n_low_3 + n_bad_3;

    tag4g1.selectAll("text").attr("x",start1 + 20).text(n_top_1 + "  ("+ ((n_top_1/n1) * 100).toFixed(2) +"%)");
    tag3g1.selectAll("text").attr("x",start1 + 20).text(n_mid_1 + "  ("+ ((n_mid_1/n1) * 100).toFixed(2) +"%)");
    tag2g1.selectAll("text").attr("x",start1 + 20).text(n_low_1 + "  ("+ ((n_low_1/n1) * 100).toFixed(2) +"%)");
    tag1g1.selectAll("text").attr("x",start1 + 20).text(n_bad_1 + "  ("+ ((n_bad_1/n1) * 100).toFixed(2) +"%)");
    tag4g2.selectAll("text").attr("x",start2 + 20).text(n_top_2 + "  ("+ ((n_top_2/n2) * 100).toFixed(2) +"%)");
    tag3g2.selectAll("text").attr("x",start2 + 20).text(n_mid_2 + "  ("+ ((n_mid_2/n2) * 100).toFixed(2) +"%)");
    tag2g2.selectAll("text").attr("x",start2 + 20).text(n_low_2 + "  ("+ ((n_low_2/n2) * 100).toFixed(2) +"%)");
    tag1g2.selectAll("text").attr("x",start2 + 20).text(n_bad_2 + "  ("+ ((n_bad_2/n2) * 100).toFixed(2) +"%)");
    tag4g3.selectAll("text").attr("x",start3 + 20).text(n_top_3 + "  ("+ ((n_top_3/n3) * 100).toFixed(2) +"%)");
    tag3g3.selectAll("text").attr("x",start3 + 20).text(n_mid_3 + "  ("+ ((n_mid_3/n3) * 100).toFixed(2) +"%)");
    tag2g3.selectAll("text").attr("x",start3 + 20).text(n_low_3 + "  ("+ ((n_low_3/n3) * 100).toFixed(2) +"%)");
    tag1g3.selectAll("text").attr("x",start3 + 20).text(n_bad_3 + "  ("+ ((n_bad_3/n3) * 100).toFixed(2) +"%)");

    tag1g1.selectAll("circle").attr("cx",start1 + 10);
    tag2g1.selectAll("circle").attr("cx",start1 + 10);
    tag3g1.selectAll("circle").attr("cx",start1 + 10);
    tag4g1.selectAll("circle").attr("cx",start1 + 10);
    tag1g2.selectAll("circle").attr("cx",start2 + 10);
    tag2g2.selectAll("circle").attr("cx",start2 + 10);
    tag3g2.selectAll("circle").attr("cx",start2 + 10);
    tag4g2.selectAll("circle").attr("cx",start2 + 10);
    tag1g3.selectAll("circle").attr("cx",start3 + 10);
    tag2g3.selectAll("circle").attr("cx",start3 + 10);
    tag3g3.selectAll("circle").attr("cx",start3 + 10);
    tag4g3.selectAll("circle").attr("cx",start3 + 10);

    svg.selectAll(".title-gp1").attr("x", start1 + 5).text("CSE >   " + limit1);
    svg.selectAll(".title-gp2").attr("x", start2 + 5).text(limit2 + "≤ CSE ≥ " + limit1);
    svg.selectAll(".title-gp3").attr("x", start3 + 5).text("CSE <   " + limit2);

  });

  function orderDots(selection, group, posx, y) {
    var posy = 0;
    selection.attr("cx", function(d, i) {
      if((i % group) == 0) posx = posx + 10;
      return posx;
    })
    .attr("cy", function(d, i) {
      if((i % group) == 0) posy = 0;
      let pos = y - posy;
      posy = posy + 8;
      return pos;
    });
  }

});
