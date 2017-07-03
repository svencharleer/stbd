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



/*Router.route('/:student',
 function(){

      Session.set("studentName", "");
      Session.set("student", parseInt(Router.current().params.student));
      Session.set("Year","2014-2015");
      this.render("main")
      //reset();
    }
);*/

Grades = new Meteor.Collection('generic_grades');
Ijkingstoets = new Meteor.Collection('ijkingstoets');
Courses = new Meteor.Collection('generic_courses');
Students = new Meteor.Collection('generic_students');
