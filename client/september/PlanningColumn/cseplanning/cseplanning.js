import { ReactiveVar } from 'meteor/reactive-var'
let noUiSlider = require('nouislider');
// Note: Dropping d3 slider in favor of nouislider since it's a lot better.

Template.cseplanning.onCreated(function () {
  let cPassFirst  = creditsPassed("Eerste Semester");
  let cPassSecond = creditsPassed("Tweede Semester");
  //Setup Reactive Vars for the data.
  this.cse1  = new ReactiveVar(0);
  this.cse2a = new ReactiveVar(0);
  this.cse2b = new ReactiveVar(0);
  this.cse3  = new ReactiveVar(0);
  this.cse4  = new ReactiveVar(0);
  this.cse5  = new ReactiveVar(0);

  this.cse1.set(cPassFirst+cPassSecond);
});

Template.cseplanning.helpers({
  'totalCSE': function () {
    let cse = 0;
    cse = Session.get("cse1") + Session.get("cse2") + Session.get("cse3") + Session.get("cse4") + Session.get("cse5")
    if (cse > 180) cse = 180;
    return cse;
  },
  'jaar1': function () {
    return Template.instance().cse1.get();
  },
  'jaar2': function () {
    return Template.instance().cse2a.get() + Template.instance().cse2b.get();;
  },
  'jaar2a': function () {
    return Template.instance().cse2a.get();;
  },
  'jaar2b': function () {
    return Template.instance().cse2b.get();
  },
  'jaar3': function () {
    return Template.instance().cse3.get();
  },
  'jaar4': function () {
    return Template.instance().cse4.get();
  },
  'jaar5': function () {
    return Template.instance().cse5.get();
  }
});

Template.cseplanning.onRendered(function () {
  // let cseslider1  = document.getElementById('cseslider1');
  // let cseslider2  = document.getElementById('cseslider2');
  // let cseslider2a = document.getElementById('cseslider2a');
  // let cseslider2b = document.getElementById('cseslider2b');
  // let cseslider3  = document.getElementById('cseslider3');
  // let cseslider4  = document.getElementById('cseslider4');
  // let cseslider5  = document.getElementById('cseslider5');
  //
  // noUiSlider.create(cseslider1 , {start: [0, 72],connect: true,range: {'min': 0,'max': 100}});
  // noUiSlider.create(cseslider2 , {start: [0, 72],connect: true,range: {'min': 0,'max': 100}});
  // noUiSlider.create(cseslider2a, {start: [0, 40],connect: true,range: {'min': 0,'max': 100}});
  // noUiSlider.create(cseslider2b, {start: [0, 40],connect: true,range: {'min': 0,'max': 100}});
  // noUiSlider.create(cseslider3 , {start: [0, 72],connect: true,range: {'min': 0,'max': 100}});
  // noUiSlider.create(cseslider4 , {start: [0, 72],connect: true,range: {'min': 0,'max': 100}});
  // noUiSlider.create(cseslider5 , {start: [0, 72],connect: true,range: {'min': 0,'max': 100}});

});

// Other queries...
let creditsPassed = function (semester) {
  let scorefield = getScoreEntry(semester);
  let all = Boekingen.find({$and:[{Student:Session.get("student")},{Academischeperiode: semester}]});
  let creditsPassed = 0;
  all.forEach(function (p) {
    if (p[scorefield] > 9 || p[scorefield] == "G"){
      creditsPassed += parseInt(p.Studiepunten);
    }
  });
  return creditsPassed;
};

let getScoreEntry = function (semester) {
  let cse_entry = 'Score';
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
