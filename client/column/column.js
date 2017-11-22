Template.column.helpers({
  /**
   * @returns [{id,name,grade,semester,credits, columnindex}]
   */
  studentCourses() {
    return Boekingen.find()
  },
  "cseAvailable":function() {
    return this.credits !== undefined
  },
  "getFailedCourses":function () {
    Meteor.call("getFailedCourses", Session.get("student"), function (err, data) {
      return data;
    })
  },
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