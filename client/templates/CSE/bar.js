import {Template} from 'meteor/templating';


Template.CSE_bar.onRendered(function () {


})


Template.CSE_bar.helpers({
  "passedCredits":function () {
    let passed = Boekingen.find(
      {$and:[
        {Student:Session.get("student")},
        {Academischeperiode: this.semester},
        {Score: { $gt: 9 }}
      ]},
      {fields: {Studiepunten: 1}}
      );
    let creditsPassed = 0;
    passed.forEach(function (p) {
      creditsPassed += parseInt(p.Studiepunten);
    })
    return creditsPassed;
  },
  "credits":function () {
    let passed = Boekingen.find(
      {$and:[
        {Student:Session.get("student")},
        {Academischeperiode: this.semester},
      ]},
      {fields: {Studiepunten: 1}}
    );
    let creditsPassed = 0;
    passed.forEach(function (p) {
      creditsPassed += parseInt(p.Studiepunten);
    })
    return creditsPassed;
  },
});

