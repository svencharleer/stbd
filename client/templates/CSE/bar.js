import {Template} from 'meteor/templating';


Template.CSE_bar.onRendered(function () {


})


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


let credits = function (semester) {
  let all = Boekingen.find(
    {$and:[
      {Student:Session.get("student")},
      {Academischeperiode: semester},
    ]},
    {fields: {Studiepunten: 1}}
  );
  let creditsPassed = 0;
  all.forEach(function (p) {
    creditsPassed += parseInt(p.Studiepunten);
  });
  return creditsPassed;
};

let creditsPassed = function (semester) {
  let scorefield = getScoreEntry(semester);
  let all = Boekingen.find(
    {$and:[
      {Student:Session.get("student")},
      {Academischeperiode: semester},
    ]}
  );
  let creditsPassed = 0;
  all.forEach(function (p) {
    if (p[scorefield] > 9){
      creditsPassed += parseInt(p.Studiepunten);
    }
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