import {Mongo} from 'meteor/mongo';
import '../imports/helpers/CSE.js';
import '../imports/helpers/courses.js';


rootRoute = Meteor.settings.public.rootroute == undefined ? "dev" : Meteor.settings.public.rootroute;

console.log("RouteRoot is " + rootRoute);

Router.route('/' + rootRoute + '/:_year/:_id', function () {
    let year    = parseInt(this.params._year);
    let student = parseInt(this.params._id);
    let yearString = year + "-" + (year + 1);
    Session.set("studentName", "");
    Session.set("student", student);
    Session.set("Year", yearString);
    Session.set("StartYear", year);
  }
);


Router.route('/' + rootRoute + '/:_year/', function () {
    let year = parseInt(this.params._year);
    let yearString = year + "-" + (year + 1);
    Session.set("studentName", "");
    Session.set("student", undefined);
    Session.set("Year", yearString);
    Session.set("StartYear", year);
    this.render("main")
    //reset();
  }
);

Boekingen = new Mongo.Collection('boekingen');
Resits = new Mongo.Collection("resits");
Meteor.subscribe('resits');
