import {ReactiveVar} from 'meteor/reactive-var'

Template.course.onRendered(function () {
  let instance = this;
  // instance.autorun(function () {
  let studentGrade   = instance.data.finalescorenajaar1;
  let courseSemester = instance.data.Academischeperiode;
  let courseId = instance.data.OpleidingsonderdeelCode //instance.data.IDOPO;
  // if (courseSemester == undefined) courseSemester = 3;
  let data = Histogram.findOne({id: courseId});
  let grades = [
    {grade: 0,  count: data.g00},
    {grade: 1,  count: data.g01},
    {grade: 2,  count: data.g02},
    {grade: 3,  count: data.g03},
    {grade: 4,  count: data.g04},
    {grade: 5,  count: data.g05},
    {grade: 6,  count: data.g06},
    {grade: 7,  count: data.g07},
    {grade: 8,  count: data.g08},
    {grade: 9,  count: data.g09},
    {grade: 10, count: data.g10}];

    let total = 0;
    for (let i = 0; i < grades.length; i++) total += grades[i].count;
    let width  = 140;
    let height = 60;

    let svg = d3.select(instance.find("svg"));
    svg.attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0)
    .selectAll("rect")
    .data(function (d, i) {
      return [
        {grade: 0,  count: ((data.g00/total)*100)+1},
        {grade: 1,  count: ((data.g01/total)*100)+1},
        {grade: 2,  count: ((data.g02/total)*100)+1},
        {grade: 3,  count: ((data.g03/total)*100)+1},
        {grade: 4,  count: ((data.g04/total)*100)+1},
        {grade: 5,  count: ((data.g05/total)*100)+1},
        {grade: 6,  count: ((data.g06/total)*100)+1},
        {grade: 7,  count: ((data.g07/total)*100)+1},
        {grade: 8,  count: ((data.g08/total)*100)+1},
        {grade: 9,  count: ((data.g09/total)*100)+1},
        {grade: 10, count: ((data.g10/total)*100)+1}];
      })
      .enter()
      .append("rect")
      .attr("width", 6)
      .attr("height", function(d,i){
        return d.count;
      })
      .attr("x", function (d, i) {
        return d.grade * 13;
      })
      .attr("y", function (d, i) {
        return (height - d.count) - 5;
      })
      .attr("fill", function (d, i) {
        let color = "#c2cbce";
        if (d.grade == studentGrade) {
          if (d.grade < 6) color = "#ff8a80"; //failed
          else if (d.grade > 5) color = "#a5d6a7"; //passed
          // else if (d.grade >= 8 && d.grade <= 9) color = "#ffcc80"; //tolerable
          else color = "#c2cbce"; //failed
        }
        return color;
      });

      // 1 -> 7 pixels
      svg.selectAll(".redbars").data(function () {
        return d3.range(1);
      }) // 8
      .enter()
      .append("rect") // < 8 Failed
      .attr("fill", "#ff8a80")
      .attr("width", 70)
      .attr("height", 1)
      .attr("transform", function (d, i) {
        return "translate(0," + (height - 2)+ ")";  // Starts from 0, always.
      })
      .attr("class", "redbars");

      svg.selectAll(".greenbars").data(function () {
        return d3.range(1);
      }) // 12
      .enter()
      .append("rect") // > 9 Pass 45% of histogram width.
      .attr("fill", "#a5d6a7")
      .attr("width", 70)
      .attr("height", 1)
      .attr("transform", function (d, i) {
        return "translate(70," + (height - 2) + ")";  // Starts from 0, always.
      })
      .attr("class", "greenbars");
      // })
    });
