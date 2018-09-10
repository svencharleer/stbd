Template.tolerateColumn.helpers({

	toleranceCredits(){
		return Session.get('toleranceCredits');
	},

	failedCourses() {
		//find all failed courses from first semester
		let ownboekingen1 = Boekingen.find(
			{$and:[
				{Academischeperiode: "Eerste Semester"},
				{Student: Session.get("student")},
				{$or: [{Score: "NA"}, {Score: {$lt: 10}}]}
			]}).fetch();
		//find all failed courses from second semester
		let ownboekingen2 = Boekingen.find(
			{$and:[{Academischeperiode: "Tweede Semester"},
				{Student: Session.get("student")},
				{$or: [{Score: "NA"}, {Score: {$lt: 10}}]}]}).fetch();
		let ownboekingen = _.flatten([ownboekingen1,ownboekingen2]);


		//find all failed courses "academiejaar"
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

		let academiejaar = _.flatten([academiejaar1, academiejaar2]);
		let flatten = _.flatten([ownboekingen,academiejaar]); //http://www.flatmapthatshit.com/ ;)
		return flatten
	}


});