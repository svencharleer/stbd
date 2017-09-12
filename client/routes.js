import { Mongo } from 'meteor/mongo';
import '../imports/helpers/CSE.js';
import '../imports/helpers/courses.js';

rootRoute = Meteor.settings.public.rootroute == undefined ? "dev" : Meteor.settings.public.rootroute;

console.log("RouteRoot is " +rootRoute);
Router.route('/' + rootRoute + '/:_year/:_id',
function(){

      var year = parseInt(Router.current().params._year);
      var yearString = year +"-"+ (year+1);
      //console.log(yearString);
      Session.set("studentName", "");
      Session.set("student", parseInt(Router.current().params._id));
      Session.set("Year", yearString);
      Session.set("StartYear",year)
      //reset();
    }
);

Router.route('/' + rootRoute + '/:_year/:_id',
 function(){
      Session.set("studentName", undefined);
      Session.set("student", undefined);
      Session.set("Year","2016-2017");
      this.render("main")
      //reset();
    }
);

Grades = new Meteor.Collection('generic_grades');
Ijkingstoets = new Meteor.Collection('ijkingstoets');
Courses = new Meteor.Collection('generic_courses');
Students = new Meteor.Collection('generic_students');
CSEs = new Meteor.Collection('generic_cse');
heatmap = new Meteor.Collection('heatmap');
clicks = new Meteor.Collection('clicks');
