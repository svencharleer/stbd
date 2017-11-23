Template.column.helpers({
  /**
   * @returns [{id,name,grade,semester,credits, columnindex}]
   */
  studentCourses() {
    let ownboekingen = Boekingen.find({$and:[{Academischeperiode: this.semester},{Student: Session.get("student")}]});
    return ownboekingen;
  },
  "cseAvailable":function() {
    return this.credits !== undefined
  },
  // "getFailedCourses":function () {
  //   Meteor.call("getFailedCourses", Session.get("student"), function (err, data) {
  //     return data;
  //   })
  // },
  "trajectInfo":function () {
    let semester = this.semester;
    let columnindex = this.columnindex;
    let period = this.period;
    return {
      semester: semester,
      columnindex: columnindex,
      period: period
    }
  }
});