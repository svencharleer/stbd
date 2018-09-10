Template.column.helpers({
  'studentCourses': function() {
    let semester = this.semester;
    let columnindex = this.columnindex;
    let ownboekingen = [];
    if ( this.semester === "Resits"){
    	//find all failed courses from januari
	    let ownboekingen1 = Boekingen.find(
	      {$and:[
	        {Academischeperiode: "Eerste Semester"},
          {Student: Session.get("student")},
          {$or: [{Scorejanuari: "NA"}, {Scorejanuari: {$lt: "10"}}]}
          ]}).fetch();
	    //find all failed coursis from june
	    let ownboekingen2 = Boekingen.find(
	      {$and:[{Academischeperiode: "Tweede Semester"},
          {Student: Session.get("student")},
          {$or: [{Scorejuni: "NA"}, {Scorejuni: {$lt: "10"}}]}]}).fetch();
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

	      ]}).fetch();
	    let academiejaar2 = Boekingen.find(
	      {$and:[{Academischeperiode: "Academiejaar"},
          {Student: Session.get("student")},
		      {Scorejanuari: "#"},
		      {$or: [{Scorejuni: "NA"}, {Scorejuni: {$lt: 10}}]}
		      ]}).fetch();

	    academiejaar = _.flatten([academiejaar1, academiejaar2]);
    }
		let flatten = _.flatten([ownboekingen,academiejaar]);
    flatten.forEach(function (course) {
	    course.columnindex = columnindex
    });
    return  flatten
  },
  "cseAvailable":function() {
    return this.credits !== undefined
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
