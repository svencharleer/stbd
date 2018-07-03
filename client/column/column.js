Template.column.helpers({
  /**
  * @returns [{id,name,grade,semester,credits, columnindex}]
  */
  studentCourses() {
    let semester = this.semester
    let ownboekingen = Boekingen.find({$and:[{Academischeperiode: semester},{Student: Session.get("student")}]}).fetch();

    let academiejaar = [];
    if(this.semester == "Eerste Semester") {
      academiejaar = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},{Student: Session.get("student")}, {Scorejuni: "#"}]}).fetch();
    }

    if(this.semester == "Tweede Semester") {
      academiejaar = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},{Student: Session.get("student")}, {Scorejanuari: "#"}]}).fetch();
    }
    return _.flatten([ownboekingen,academiejaar]); //http://www.flatmapthatshit.com/ ;)
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
