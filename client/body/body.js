import { ReactiveVar } from 'meteor/reactive-var'



Template.body.events({
  "click .fa-compress" : function(event,template){
    let element = $(event.target).attr('class').split(' ')[1];
    let column  = element.replace(/.*-/,'');
    template.$("."+element).removeClass("fa-compress").addClass("fa-expand");
    template.$("."+column+" .vertical-title").fadeIn();
    template.$("."+column+" .bottom").css("visibility","hidden");
    template.$("."+column+" .top").css("border-bottom","0px dotted #ececec");
    template.$("."+column+" .top .column-title").css("visibility","hidden");
    template.$("."+column+" .top .CSE").css("visibility","hidden");
    template.$("."+column+" .top .tolerantiepunten").css("visibility","hidden");  
    template.$("."+column+" .top .creditsplanned").css("visibility","hidden");        
    template.$("."+column+" .top .periode").css("visibility","hidden");
    template.$("."+column+"").css("min-width","27px");
    template.$("."+column+"").css("max-width","27px");
    clicks.insert({'session': Session.get('Id'), 'studentid': Session.get('student') , 'element': element, 'time': Date.now() , 'action': 'hide_column'} )                                                  
    
  },
  "click .fa-expand" : function(event,template){
    let element = $(event.target).attr('class').split(' ')[1];
    let column  = element.replace(/.*-/,'');

    template.$("."+element).removeClass("fa-expand").addClass("fa-compress");
    template.$("."+column+" .vertical-title").fadeOut();
    template.$("."+column+" .bottom").css("visibility","visible");
    template.$("."+column+" .top").css("border-bottom","1px dotted #ececec");
    template.$("."+column+" .top .column-title").css("visibility","visible");
    template.$("."+column+" .top .CSE").css("visibility","visible");
    template.$("."+column+" .top .tolerantiepunten").css("visibility","visible");  
    template.$("."+column+" .top .creditsplanned").css("visibility","visible");            
    template.$("."+column+" .top .periode").css("visibility","visible");
    template.$("."+column+"").css("max-width","180px");
    template.$("."+column+"").css("min-width","180px");
    clicks.insert({'session': Session.get('Id'), 'studentid': Session.get('student') , 'element': element, 'time': Date.now() , 'action': 'show_column'} )                                                  
    
  },

  "click .button" : function(event, template){
    let started = template.started.get();
    if (started){
      event.target.value = "Start session";
      template.started.set(false);
      clicks.insert({'session': Session.get('Id'), 'studentid': Session.get('student') , 'element': "button", 'time': Date.now() , 'action': 'stop_session'} )                                                  
      
    }
    else{
      event.target.value = "Stop session";
      template.started.set(true);
      clicks.insert({'session': Session.get('Id'), 'studentid': Session.get('student') , 'element': "button", 'time': Date.now() , 'action': 'start_session'} )                                                        
    }
    
  },

  "mousemove .flex-container *" : function(event, template){
    if (Meteor.settings.public.logging){
      // console.log(event.clientX)
      // Session.get('mouseX')
      let currentX = Session.get('mouseX');
      let currentY = Session.get('mouseY');  
      let lastMove = Session.get('lastMove'); 
      let diffX =  Math.abs(event.clientX - currentX);
      let diffY =  Math.abs(event.clientY - currentY);
      let diffTime = Math.abs(Date.now()-lastMove)
      if ( (diffX > 20 || diffY > 20) && diffTime > 5000){
        Session.set('mouseX', event.clientX);
        Session.set('mouseY', event.clientY);
        heatmap.insert({'session': Session.get('Id'), "studentid" : Session.get('student'), "x": event.clientX, "y" : event.clientY, "time" : Date.now() })  
        Session.set('lastMove', Date.now())  
      }
      else if ( (diffX > 150 || diffY > 100)){
        Session.set('mouseX', event.clientX);
        Session.set('mouseY', event.clientY);
        heatmap.insert({'session': Session.get('Id'), "studentid" : Session.get('student'), "x": event.clientX, "y" : event.clientY, "time" : Date.now() })  
        Session.set('lastMove', Date.now())  
      }
    }
    
  }

});

Template.body.onCreated(function(){
  this.started = new ReactiveVar(false);
  var instance = this;

  console.log(Meteor.settings.public.logging)

  var handler = instance.subscribe("generic_courses",function(){});
  Meteor.subscribe("clicks");
  
  if (Meteor.settings.public.logging){
    $(".button").css("display", 'flex');        
    Session.set('mouseX', 0);
    Session.set('mouseY', 0);
    Session.set('lastMove', Date.now())
    Meteor.subscribe("heatmap");
  }
  

  

  
  instance.autorun(function(){
    $(".flex-container").css("display", 'flex');    
    $(".nostudent").hide();
    if(!$(".loading-screen").is(":visible")) $(".loading-screen").show();
    Session.set('Id' , Meteor.default_connection._lastSessionId)
    Session.set("CSE_januari", 0);
    Session.set("CSE_juni", 0);
    Session.set("CSE_september", 0);
    Session.set("selectedCourses", undefined);
    Session.set("studentName","");
    Session.set("creditsTaken", 0)
    Session.set("toleranceCredits", 12)
    
    var handler2 = instance.subscribe("generic_grades",Session.get("student"));
    var handler3 = instance.subscribe("ijkingstoets", Session.get("student"));
    var handler4 = instance.subscribe("generic_cse", Session.get("student"));
    var handler8 = instance.subscribe("generic_students");
    if(handler2.ready() && handler3.ready() && handler8.ready() && handler4.ready())
    {
      var studentID = Session.get("student");
      var studentName = Students.findOne({studentid: studentID});
      if(studentName == undefined) {
        if($(".loading-screen")) $(".loading-screen").hide();
        $(".nostudent").show();
        $(".flex-container").css("display", 'none');
        
        return;
      }
      Session.set("studentName",studentName.givenname + " " + studentName.surname );
      var semester = 1;
      if (Meteor.settings.public.showJuni){
        semester = 2;
      }
      if (Meteor.settings.public.showSeptember){
        semester = 3;
      }
      Session.set('semester', semester);
      Session.set('limit1', Meteor.settings.public.cselimit1);
      Session.set('limit2', Meteor.settings.public.cselimit2);



      //get the CSE for the student
      var year = Session.get("Year");
      //Helpers_GetCSE comes from imports/helpers/CSE.js
      Session.set("CSE_januari", Helpers_GetCSE(studentID, 1, year));
      Session.set("CSE_juni", Helpers_GetCSE(studentID, 2,year));
      Session.set("CSE_september", Helpers_GetCSE(studentID, 3,year));

      Session.set("CSE_januari_pure", Helpers_CalculateCSE(1,year,true));
      Session.set("CSE_juni_pure", Helpers_CalculateCSE(2,year,true));
      Session.set("CSE_september_pure", Helpers_CalculateCSE(3,year,true));
      Session.set("CSE_Planning", Helpers_CalculateStartValues(Session.get('CSE_september_pure')));
      Session.set("CSE_TTT", Helpers_GetTotalPointForPeriod(0,year));
      var score = Ijkingstoets.findOne();
      var iscore = 0;
      if(score != undefined){
        if(score.juli == "#" || score.september == "#")
        {
          if(score.juli == score.september) iscore = 0;
          else if(score.juli == "#") iscore = score.september;
          else iscore = score.juli;
        }
        else iscore = score.juli > score.september ? score.juli : score.september;
        //iscore = iscore == 20 ? 9 : parseInt(iscore/2);
        iscore = iscore *5;
      }
      Session.set("CSE_ijkingstoets", iscore);


      



      //get failed courses

      ////console.log(failedCourses);
      Meteor.call("getFailedCourses", Session.get("student"), function(err, data){
        Session.set("FailedCourses", data);
        //set them up for selection
        var selectedCourses = {};
        data.forEach(function(f){
          selectedCourses[f.courseid] = {id:f.courseid, course:f, checked:true};
        })
        Session.set("selectedCourses", selectedCourses);
        Session.set("Fails", data.length > 0 ? true:false);
        //console.log("fails set to " + Session.get("Fails"));

        if($(".loading-screen")) $(".loading-screen").hide();
      });

      Meteor.call("getCreditsTaken", Session.get('student'), 1, function(err, credits){
        Session.set('creditsTaken', credits)
      });
    }
  })
})





Template.body.helpers({
  toleranceCredits(){
    return Session.get('toleranceCredits');
  },
  courses() {
    return Courses.find({});
  },
  ttt(){
    return Courses.find({semester:0})
  },
  january() {
    return Courses.find({semester:1})
  },
  june() {
    return Courses.find({semester:2})
  },

  studentGrade(who, what) {
    return Grades.find({studentid:who, courseid:what})
  },

  studentCourses(semester, failedOnly, gradetry)  {

    var results = [];
    var searchTerm = {semester:semester};
    var courses = Courses.find(searchTerm, {sort:{semester:1, coursename:1}});
    if (semester == 2){
      courses = Courses.find({$or:[{semester:0},{semester:2}]},{sort:{semester:1, coursename:1}});
    }
    var testStudent = Grades.findOne();
    if(testStudent == undefined || testStudent.studentid != Session.get("student"))
    {
      //console.log(testStudent.student, Session.get("student"));
      return results;
    }
    courses.forEach(function(j){
      var search = {};
      var result = Grades.findOne({courseid:j.courseid});
      if(result == undefined) return;
      var score = gradetry != 2 ? result.grade_try1 : result.grade_try2;

      //console.log("in the courses" + result.student);
      if(failedOnly == true && score >= 10) return;
      if(score == "#") return;
      //hack for TTT
      if(score == "NA" && semester == 0) return;
      results.push({
        id: j.courseid,
        name: j.coursename,
        grade: score,
        realGrade: score,
        semester: gradetry != 2 ? semester : 3,
        credits:parseInt(j.credits)});

      })
      return results;

  },

  coursesLeft(sem){
    var results = [];
    var courses = Courses.find({semester:sem},{sort:{semester:1, coursename:1}});
    if (sem == 2){
      courses = Courses.find({$or:[{semester:0},{semester:2}]},{sort:{semester:1, coursename:1}});
    }
    var testStudent = Grades.findOne();
    if(testStudent == undefined || testStudent.studentid != Session.get("student"))
    {
      //console.log(testStudent.student, Session.get("student"));
      return results;
    }
    courses.forEach(function(j){
      // console.log(j)
      var search = {};
      var result = Grades.findOne({courseid:j.courseid});
      if(result == undefined) return;
      var score = "#";
      score = result.finalscore;
      var try1 = result.grade_try1;
      var try2 = result.grade_try2;


      //console.log("in the courses" + result.student);
      if(score >= 10) return;
      //if(score == "#") return;
      results.push({
        id: j.courseid,
        name: j.coursename,
        grade: score,
        realGrade: score,
        semester:2,
        try1: try1,
        try2: try2,
        credits:parseInt(j.credits)}
      );

    })
    // console.log('results')
    // console.log(results)
    return results;
  },

  ijkingstoetsen(){
    var ijkingstoetsen = Ijkingstoets.findOne();
    if(ijkingstoetsen == undefined) return;
    if(ijkingstoetsen.student != Session.get("student"))
    {
      return [];
    }
    var juli =
    {
      id: "ijkingstoets_juli",
      name: "IJkingstoets juli",
      grade: ijkingstoetsen.juli,
      realGrade: ijkingstoetsen.juli,
      credits:0
    };
    var september =
    {
      id: "ijkingstoets_september",
      name: "IJkingstoets september",
      grade: ijkingstoetsen.september,
      realGrade: ijkingstoetsen.september,
      credits:0
    };
    var results= [];
    var nrOfIjk = 0;
    if(Meteor.settings.public.ijkingstoets_juli == true)
    {
      results.push(juli);
      nrOfIjk++;
    }
    if(Meteor.settings.public.ijkingstoets_september == true)
    {
      results.push(september);
      nrOfIjk++;
    }
    if(nrOfIjk == 1)
    results[0].name = "Ijkingstoets";


    return results;
  },
  totalCSE() {
    let cse = 0;
    if (Session.get("CSE_Planning") != undefined){
      cse  = Session.get("CSE_Planning").cse1 + Session.get("cse2") + Session.get("cse3") + Session.get("cse4") + Session.get("cse5");
      if (cse > 180) cse = 180;
    }
    return cse;
  },
    

  failedCourses() {
    var courses = [];
    var selectedCourses = Session.get("selectedCourses");
    if(selectedCourses == undefined) return courses;
    Object.keys(selectedCourses).forEach(function(i){

      courses.push({
        id: selectedCourses[i].course.idopleidingsond,
        name: Courses.findOne({_id:selectedCourses[i].course.idopleidingsond}).name,
        grade: selectedCourses[i].course.scorenajuni,
        realGrade: selectedCourses[i].course.scorenajuni});
      })

      return courses;
  },
  CSE_januari() { return {percent: Session.get("CSE_januari"), raw:  Session.get("CSE_januari_pure") , credits: Session.get("creditsTaken")[0]} },
  CSE_juni() { return {percent: Session.get("CSE_juni"), raw:  Session.get("CSE_juni_pure")  , credits: Session.get("creditsTaken")[0] + Session.get("creditsTaken")[1]} },
  CSE_september() { return {percent: Session.get("CSE_september"), raw:  Session.get("CSE_september_pure"), credits: Session.get("creditsTaken")[0] + Session.get("creditsTaken")[1]} },

  Fails() {
    return Session.get("Fails");
  },

  ShowJuni(){
    return Meteor.settings.public.showSeptember != undefined ? Meteor.settings.public.showJuni : false;

  },
  ShowSeptember(){
    return Meteor.settings.public.showSeptember != undefined ? Meteor.settings.public.showSeptember : false;

  },
  
  


});


