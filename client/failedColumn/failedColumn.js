Template.failedColumn.helpers({
  /**
  * @returns [{id,name,grade,semester,credits, columnindex}]
  */
  studentCourses() {
    let semester = this.semester
    let ownboekingen = Boekingen.find({$and:[{Academischeperiode: semester},{Student: Session.get("student")}]});
    return ownboekingen;
  },
  "cseAvailable":function() {
    return this.credits !== undefined
  },
  "failedCourses":function () {
    // Boekingen.find({$and:[{Student: Session.get("student")},{ $not: { $gt: 10 } },{Academiejaar: this.Academischeperiode }]});
    // Boekingen.find({$and:[{Student: Session.get("student")},{ $not: { $gt: 10 } }]});
    return Boekingen.find({$and:[{Student: Session.get("student")}, {Score: {$lt: 10}}]}).fetch();
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

/**
*
* @param semester
* @returns score_entry: fieldname of the db
*/
let getScoreEntry = function (semester) {
  var score_entry = 'Score';
  switch (semester) {
    case "Eerste Semester":
    score_entry = 'Scorejanuari';
    break;
    case "Tweede Semester":
    score_entry = 'Scorejuni';
    break;
    default:
    score_entry = 'Score';
  }
  return score_entry;
};
