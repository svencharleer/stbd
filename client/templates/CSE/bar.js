import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.CSE_bar.onCreated(function(){
  this.credits = new ReactiveVar(0);
  this.zoom = new ReactiveVar(false);
});

Template.CSE_bar.onRendered(function(){
  Meteor.call("getCreditsTaken", Session.get('student'), 1, function(err, credits){
    console.log('credits' + credits);
  });



})
  



Template.CSE_bar.helpers({
  creditsTaken: function(){
    var creditsTaken = 0;
    Meteor.call("getCreditsTaken", Session.get('student'), 1, function(err, credits){
      console.log('credits' + credits);
    });
    return creditsTaken;
  },
});

