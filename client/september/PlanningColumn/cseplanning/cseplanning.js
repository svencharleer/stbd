import { ReactiveVar } from 'meteor/reactive-var'
let noUiSlider = require('nouislider');
// Note: Dropping d3 slider in favor of nouislider since it's a lot better.

Template.cseplanning.onCreated(function () {

  let cPassResit = creditsPassed("Resits");
  //Setup Reactive Vars for the data.
  this.cse1  = new ReactiveVar(0);
  this.cse2a = new ReactiveVar(0);
  this.cse2b = new ReactiveVar(0);
  this.cse3  = new ReactiveVar(0);
  this.cse4  = new ReactiveVar(0);
  this.cse5  = new ReactiveVar(0);

  this.cse1.set(cPassResit);
});

Template.cseplanning.helpers({
  'totalCSE': function () {
    let cse   = 0;
    let ins   =  Template.instance();
    cse = ins.cse1.get() + ins.cse2a.get() + ins.cse2b.get() + ins.cse3.get() + ins.cse4.get() + ins.cse5.get();
    Session.set("csesum", cse);
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
  let self = Template.instance();
  let cseslider1  = document.getElementById('cseslider1');
  let cseslider2  = document.getElementById('cseslider2');
  let cseslider2a = document.getElementById('cseslider2a');
  let cseslider2b = document.getElementById('cseslider2b');
  let cseslider3  = document.getElementById('cseslider3');
  let cseslider4  = document.getElementById('cseslider4');
  let cseslider5  = document.getElementById('cseslider5');
  let cse2 = self.cse2a.get() +  self.cse2b.get();
  noUiSlider.create(cseslider1 , {start: self.cse1.get(),  connect: [true,false],format: wNumb({decimals: 0}), range: {'min': 0,'max': 72}});
  noUiSlider.create(cseslider2 , {start: cse2            , connect: [true,false],format: wNumb({decimals: 0}), range: {'min': 0,'max': 72}});
  noUiSlider.create(cseslider2a, {start: self.cse2a.get(), connect: [true,false],format: wNumb({decimals: 0}), range: {'min': 0,'max': 40}});
  noUiSlider.create(cseslider2b, {start: self.cse2b.get(), connect: [true,false],format: wNumb({decimals: 0}), range: {'min': 0,'max': 40}});
  noUiSlider.create(cseslider3 , {start: self.cse3.get(),  connect: [true,false],format: wNumb({decimals: 0}), range: {'min': 0,'max': 72}});
  noUiSlider.create(cseslider4 , {start: self.cse4.get(),  connect: [true,false],format: wNumb({decimals: 0}), range: {'min': 0,'max': 72}});
  noUiSlider.create(cseslider5 , {start: self.cse5.get(),  connect: [true,false],format: wNumb({decimals: 0}), range: {'min': 0,'max': 72}});

  cseslider1.setAttribute('disabled', true);
  cseslider2.setAttribute('disabled', true);

  // Define behavior for each slider:

  cseslider2a.noUiSlider.on('update', function(val) {
    let current = self.cse2a.get();
    if(Session.get("csesum") >= 180) {
      if (val > current) cseslider2a.noUiSlider.set(current);
      if (val < current) self.cse2a.set(Math.round(val));
    } else {
      self.cse2a.set(Math.round(val));
      cseslider2.noUiSlider.set(Math.round(val) + self.cse2b.get());
    }
  });

  cseslider2b.noUiSlider.on('update', function(val) {
    let current = self.cse2b.get();
    if(Session.get("csesum") >= 180) {
      if (val > current) cseslider2b.noUiSlider.set(current);
      if (val < current) self.cse2b.set(Math.round(val));
    } else {
      self.cse2b.set(Math.round(val));
      cseslider2.noUiSlider.set(Math.round(val) + self.cse2a.get());
    }

  });

  cseslider3.noUiSlider.on('update', function(val) {
    let current = self.cse3.get();
    if(Session.get("csesum") >= 180) {
      if (val > current) cseslider3.noUiSlider.set(current);
      if (val < current) self.cse3.set(Math.round(val));
    } else {
      self.cse3.set(Math.round(val));
    }
  });

  cseslider4.noUiSlider.on('update', function(val) {
    let current = self.cse4.get();
    if(Session.get("csesum") >= 180) {
      if (val > current) cseslider4.noUiSlider.set(current);
      if (val < current) self.cse4.set(Math.round(val));
    } else {
      self.cse4.set(Math.round(val));
    }
  });

  cseslider5.noUiSlider.on('update', function(val) {
    let current = self.cse5.get();
    if(Session.get("csesum") >= 180) {
      if (val > current) cseslider5.noUiSlider.set(current);
      if (val < current) self.cse5.set(Math.round(val));
    } else {
      self.cse5.set(Math.round(val));
    }
  });

  cseslider2a.noUiSlider.on('end', function(val) {
    let extra = Session.get("csesum") - 180;
    if(extra > 0) self.cse2a.set(Math.round(val - extra));
  });

  cseslider2b.noUiSlider.on('end', function(val) {
    let extra = Session.get("csesum") - 180;
    if(extra > 0) self.cse2b.set(Math.round(val - extra));
  });

  cseslider3.noUiSlider.on('end', function(val) {
    let extra = Session.get("csesum") - 180;
    if(extra > 0) self.cse3.set(Math.round(val - extra));
  });

  cseslider4.noUiSlider.on('end', function(val) {
    let extra = Session.get("csesum") - 180;
    if(extra > 0) self.cse4.set(Math.round(val - extra));
  });

  cseslider5.noUiSlider.on('end', function(val) {
    let extra = Session.get("csesum") - 180;
    if(extra > 0) self.cse5.set(Math.round(val - extra));
  });

});

let creditsPassed = function (semester) {
	if( semester === "Eerste Semester"){
		let academiejaar = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},   {Student: Session.get("student")}, {Scorejuni: "#"}, {$or: [{Score: "G"}, {Score: {$gte: 10}}]}]}).fetch();
		let ownboekingen = Boekingen.find({$and:[{Academischeperiode: "Eerste Semester"},{Student: Session.get("student")}, {$or: [{Scorejanuari: "G"}, {Scorejanuari: {$gte: 10}}]}]}).fetch()
		all = _.flatten([ownboekingen,academiejaar]);
	}
	else if(semester === "Tweede Semester"){
		let academiejaar = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},   {Student: Session.get("student")}, {Scorejanuari: "#"}, {$or: [{Score: "G"}, {Score: {$gte: 10}}]}]}).fetch();
		let ownboekingen = Boekingen.find({$and:[{Academischeperiode: "Tweede Semester"},{Student: Session.get("student")}, {$or: [{Scorejuni: "G"}, {Scorejuni: {$gte: "10"}}]}]}).fetch();
		all=  _.flatten([ownboekingen,academiejaar]);
	}
	else if(semester === "Resits"){
		//find all passed
		let academiejaar1 = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},   {Student: Session.get("student")}, {Scorejuni: "#"}, {$or: [{Score: "G"}, {Score: {$gte: 10}}]}]}).fetch();
		let ownboekingen1 = Boekingen.find({$and:[{Academischeperiode: "Eerste Semester"},{Student: Session.get("student")}, {$or: [{Score: "G"}, {Score: {$gte: 10}}]}]}).fetch()
		let academiejaar2 = Boekingen.find({$and:[{Academischeperiode: "Academiejaar"},   {Student: Session.get("student")}, {Scorejanuari: "#"}, {$or: [{Score: "G"}, {Score: {$gte: 10}}]}]}).fetch();
		let ownboekingen2 = Boekingen.find({$and:[{Academischeperiode: "Tweede Semester"},{Student: Session.get("student")}, {$or: [{Score: "G"}, {Score: {$gte: 10}}]}]}).fetch();
		all=  _.flatten([ownboekingen1, ownboekingen2, academiejaar1, academiejaar2]);

	}
	else{
		console.log("default ")
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
