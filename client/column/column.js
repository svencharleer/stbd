Template.column.helpers({
  /**
  * @returns [{id,name,grade,semester,credits, columnindex}]
  */
  studentCourses() {
    let semester = this.semester;
    let ownboekingen = [];
    if ( this.semester === "Resits"){
	    let ownboekingen1 = Boekingen.find(
	      {$and:[
	        {Academischeperiode: "Eerste Semester"},
          {Student: Session.get("student")},
          {$or: [{Score: "NA"}, {Score: {$lt: 10}}]}
          ]}).fetch();
	    let ownboekingen2 = Boekingen.find(
	      {$and:[{Academischeperiode: "Tweede Semester"},
          {Student: Session.get("student")},
          {$or: [{Score: "NA"}, {Score: {$lt: 10}}]}]}).fetch();
	    ownboekingen = _.flatten([ownboekingen1,ownboekingen2]);
    }
    else{
	    ownboekingen = Boekingen.find({$and:[{Academischeperiode: semester},{Student: Session.get("student")}]}).fetch();
    }


    let academiejaar = [];
    if(this.semester === "Eerste Semester") {
      academiejaar = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},{Student: Session.get("student")}, {Scorejuni: "#"}]}).fetch();
    }

    if(this.semester === "Tweede Semester") {
      academiejaar = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},{Student: Session.get("student")}, {Scorejanuari: "#"}]}).fetch();
    }

    if(this.semester === "Resits"){
	    let academiejaar1 = Boekingen.find(
	      {$and:[
	        {Academischeperiode: "Academiejaar"},
          {Student: Session.get("student")},
          {Scorejuni: "#"},
          {$or: [{Scorejanuari: "NA"}, {Scorejanuari: {$lt: 10}}]},
		      {$or: [{Scoreseptember: "NA"}, {Scoreseptember: {$lt: 10}}]}

	      ]}).fetch();
	    let academiejaar2 = Boekingen.find(
	      {$and:[{Academischeperiode: "Academiejaar"},
          {Student: Session.get("student")},
		      {Scorejanuari: "#"},
		      {$or: [{Scorejuni: "NA"}, {Scorejuni: {$lt: 10}}]},
		      {$or: [{Scoreseptember: "NA"}, {Scoreseptember: {$lt: 10}}]}
	      ]}).fetch();

	    academiejaar = _.flatten([academiejaar1, academiejaar2]);
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
