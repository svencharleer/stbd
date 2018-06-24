import { ReactiveVar } from 'meteor/reactive-var'

Template.circleGraph.created = function() {

  this.failed = new ReactiveVar(0);
  let courses = Boekingen.find({$and:[{Student: Session.get("student")}, {Score: {$lt: 10}}]});
  this.failed.set(courses.count());

  let program = [];
  this.program = new ReactiveVar([]);
  program = JSON.parse(Resits.find({program: Session.get("program")}).fetch()[0][courses.count()]);
  this.program.set(program);
};

Template.circleGraph.helpers({
  "checked":function () {
    let program = Template.instance().program.get()
    return program[Session.get("numChecked")];
  },
  "all":function () {
    let program = Template.instance().program.get()
    return program[Template.instance().failed.get()];
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
