import {Template} from 'meteor/templating';

Template.CSE_bar.helpers({
  "passedCredits":function () {
    return creditsPassed(this.semester);
  },
  "credits":function () {
    return credits(this.semester);
  },
  "percent":function () {
    let boeking = Boekingen.findOne(
      {$and:[
        {Student:Session.get("student")},
        {"Student-Voornaam(Key)": {$ne: "Undefined"}}
      ]},
    );
    csefield = getCSEEntry(this.semester);
    return boeking[csefield];
  }
});


// let credits = function (semester) {
//   let all = []
//   if( semester == "Eerste Semester"){
// 	  let academiejaar = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},   {Student: Session.get("student")}, {Scorejuni: "#"}]}).fetch();
// 	  let ownboekingen = Boekingen.find({$and:[{Academischeperiode: "Eerste Semester"},{Student: Session.get("student")}]}).fetch()
//     all = _.flatten([ownboekingen,academiejaar]);
//   }
//   else{
// 	  let academiejaar = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},   {Student: Session.get("student")}, {Scorejanuari: "#"}]}).fetch();
// 	  let ownboekingen = Boekingen.find({$and:[{Academischeperiode: "Tweede Semester"},{Student: Session.get("student")}]}).fetch();
// 	  all=  _.flatten([ownboekingen,academiejaar]);
//   }
//   let credits = 0;
//   all.forEach(function (p) {
//     credits += parseInt(p.Studiepunten);
//   });
//   return credits;
// };
//
// let creditsPassed = function (semester) {
// 	if( semester == "Eerste Semester"){
// 		let academiejaar = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},   {Student: Session.get("student")}, {Scorejuni: "#"}]}).fetch();
// 		let ownboekingen = Boekingen.find({$and:[{Academischeperiode: "Eerste Semester"},{Student: Session.get("student")}, {$or: [{Score: "G"}, {Score: {$gte: 10}}]}]}).fetch()
// 		all = _.flatten([ownboekingen,academiejaar]);
// 	}
// 	else{
// 		let academiejaar = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},   {Student: Session.get("student")}, {Scorejanuari: "#"}]}).fetch();
// 		let ownboekingen = Boekingen.find({$and:[{Academischeperiode: "Tweede Semester"},{Student: Session.get("student")},{$or: [{Score: "G"}, {Score: {$gte: 10}}]}]}).fetch();
// 		all=  _.flatten([ownboekingen,academiejaar]);
// 	}
// 	let creditsPassed = 0;
// 	all.forEach(function (p) {
// 		creditsPassed += parseInt(p.Studiepunten);
// 	});
// 	return creditsPassed;
// };


let credits = function (semester) {
	let all = []
	if( semester === "Eerste Semester"){
		let academiejaar = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},   {Student: Session.get("student")}, {Scorejuni: "#"}]}).fetch();
		let ownboekingen = Boekingen.find({$and:[{Academischeperiode: "Eerste Semester"},{Student: Session.get("student")}]}).fetch()
		all = _.flatten([ownboekingen,academiejaar]);
	}
	else if(semester === "Tweede Semester"){
		let academiejaar = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},   {Student: Session.get("student")}, {Scorejanuari: "#"}]}).fetch();
		let ownboekingen = Boekingen.find({$and:[{Academischeperiode: "Tweede Semester"},{Student: Session.get("student")}]}).fetch();
		all =  _.flatten([ownboekingen,academiejaar]);
	}
	else if(semester === "Resits") {
		let academiejaar1 = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},   {Student: Session.get("student")}, {Scorejuni: "#"}]}).fetch();
		let ownboekingen1 = Boekingen.find({$and:[{Academischeperiode: "Eerste Semester"},{Student: Session.get("student")}]}).fetch()
		let academiejaar2 = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},   {Student: Session.get("student")}, {Scorejanuari: "#"}]}).fetch();
		let ownboekingen2 = Boekingen.find({$and:[{Academischeperiode: "Tweede Semester"},{Student: Session.get("student")}]}).fetch();
		all =  _.flatten([ownboekingen1,academiejaar1,ownboekingen2,academiejaar2]);
	}
	let credits = 0;
	all.forEach(function (p) {
		credits += parseInt(p.Studiepunten);
	});
	return credits;
};

let creditsPassed = function (semester) {
	if( semester === "Eerste Semester"){
		let academiejaar = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},   {Student: Session.get("student")}, {Scorejuni: "#"}, {$or: [{Score: "G"}, {Score: {$gte: 10}}]}]}).fetch();
		let ownboekingen = Boekingen.find({$and:[{Academischeperiode: "Eerste Semester"},{Student: Session.get("student")}, {$or: [{Score: "G"}, {Score: {$gte: 10}}]}]}).fetch()
		all = _.flatten([ownboekingen,academiejaar]);
	}
	if(semester === "Tweede Semester"){
		let academiejaar = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},   {Student: Session.get("student")}, {Scorejanuari: "#"}, {$or: [{Score: "G"}, {Score: {$gte: 10}}]}]}).fetch();
		let ownboekingen = Boekingen.find({$and:[{Academischeperiode: "Tweede Semester"},{Student: Session.get("student")}, {$or: [{Score: "G"}, {Score: {$gte: 10}}]}]}).fetch();
		all=  _.flatten([ownboekingen,academiejaar]);
	}
	else{
		let academiejaar1 = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},   {Student: Session.get("student")}, {Scorejuni: "#"}, {$or: [{Score: "G"}, {Score: {$gte: 10}}]}]}).fetch();
		let ownboekingen1 = Boekingen.find({$and:[{Academischeperiode: "Eerste Semester"},{Student: Session.get("student")}, {$or: [{Score: "G"}, {Score: {$gte: 10}}]}]}).fetch()
		let academiejaar2 = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},   {Student: Session.get("student")}, {Scorejanuari: "#"}, {$or: [{Score: "G"}, {Score: {$gte: 10}}]}]}).fetch();
		let ownboekingen2 = Boekingen.find({$and:[{Academischeperiode: "Tweede Semester"},{Student: Session.get("student")}, {$or: [{Score: "G"}, {Score: {$gte: 10}}]}]}).fetch();
		all=  _.flatten([ownboekingen1, ownboekingen2, academiejaar1, academiejaar2]);

	}
	let creditsPassed = 0;
	all.forEach(function (p) {
		creditsPassed += parseInt(p.Studiepunten);
	});
	return creditsPassed;
};

/**
 *
 * @param semester
 * @returns cse_entry: fieldname of the db
 */
let getCSEEntry = function (semester) {
  var cse_entry = 'CSE';
  switch (semester) {
    case "Eerste Semester":
      cse_entry = 'CSEJanuari';
      break;
    case "Tweede Semester":
      cse_entry = 'CSEJuni';
      break;
    default:
      cse_entry = 'CSESeptember';
  }
  return cse_entry;

};

/**
 *
 * @param semester
 * @returns cse_entry: fieldname of the db
 */
let getScoreEntry = function (semester) {
  var cse_entry = 'Score';
  switch (semester) {
    case "Eerste Semester":
      cse_entry = 'Scorejanuari';
      break;
    case "Tweede Semester":
      cse_entry = 'Scorejuni';
      break;
    default:
      cse_entry = 'Scoreseptember';
  }
  return cse_entry;

};
