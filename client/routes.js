import {Mongo} from 'meteor/mongo';
import '../imports/helpers/CSE.js';
import '../imports/helpers/courses.js';

rootRoute = Meteor.settings.public.rootroute == undefined ? "dev" : Meteor.settings.public.rootroute;

Router.route('/:_id',
  function () {
    let year = parseInt(Router.current().params._year);
    let yearString = year + "-" + (year + 1);
    Session.set("studentName", "");
    Session.set("student", parseInt(Router.current().params._id));
    Session.set("Year", yearString);
    Session.set("StartYear", year);
  }
);


Router.route('/' + rootRoute + '/:_year/',
  function () {
    let year = parseInt(Router.current().params._year);
    let yearString = year + "-" + (year + 1);
    Session.set("studentName", "");
    Session.set("student", undefined);
    Session.set("Year", yearString);
    Session.set("StartYear", year);
    //this.render("main")
    //reset();
  }
);

Boekingen  = new Mongo.Collection('boekingen');
Histogram  = new Mongo.Collection('histograms');
Meteor.subscribe('histograms');
