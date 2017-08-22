Template.body.events({
  /* To fix this we need to put the column in one template
     I don't know because <body> is harcoded to september and june dashboards.
     we need to check with Sven first.

     My guess is this code will be ok, to avoid searching upsidedown in the
     DOM for the target elements.
  */
  "click .fa-compress" : function(event,template){
    let element = $(event.target).attr('class').split(' ')[1];
    let column  = element.replace(/.*-/,'');

    template.$("."+element).removeClass("fa-compress").addClass("fa-expand");
    template.$("."+column+" .vertical-title").fadeIn();
    template.$("."+column+" .bottom").css("visibility","hidden");
    template.$("."+column+" .top").css("border-bottom","0px dotted #ececec");
    template.$("."+column+" .top .column-title").css("visibility","hidden");
    template.$("."+column+" .top .CSE").css("visibility","hidden");
    template.$("."+column+" .top .periode").css("visibility","hidden");
    template.$("."+column+"").css("min-width","27px");
    template.$("."+column+"").css("max-width","27px");
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
    template.$("."+column+" .top .periode").css("visibility","visible");
    template.$("."+column+"").css("max-width","180px");
    template.$("."+column+"").css("min-width","180px");
  }
});

Template.body.onCreated(function(){
  var instance = this;
  var handler = instance.subscribe("generic_courses",function(){});

  instance.autorun(function(){

    $(".nostudent").hide();
    if(!$(".loading-screen").is(":visible")) $(".loading-screen").show();

    Session.set("CSE_januari", 0);
    Session.set("CSE_juni", 0);
    Session.set("CSE_september", 0);
    Session.set("selectedCourses", undefined);
    Session.set("studentName","");
    //console.log("student now is " + Session.get("student"))
    var handler2 = instance.subscribe("generic_grades",Session.get("student"));
    var handler3 = instance.subscribe("ijkingstoets", Session.get("student"));
    var handler4 = instance.subscribe("generic_cse", Session.get("student"));
    var handler8 = instance.subscribe("generic_students");
    if(handler2.ready() && handler3.ready() && handler8.ready() && handler4.ready())
    {
      console.log(Session.get("student"));
      var studentID = Session.get("student");
      var studentName = Students.findOne({studentid: studentID});
      console.log(studentName);
      if(studentName == undefined) {

        if($(".loading-screen")) $(".loading-screen").hide();
        $(".nostudent").show();
        return;
      }
      //console.log("student now is " + studentName.voornaam + " " + studentName.familienaam)
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
      Session.set("CSE_januari", Helpers_GetCSE(studentID, 1, year));
      Session.set("CSE_juni", Helpers_GetCSE(studentID, 2,year));
      Session.set("CSE_september", Helpers_GetCSE(studentID, 3,year));

      Session.set("CSE_januari_pure", Helpers_CalculateCSE(1,year,true));
      Session.set("CSE_juni_pure", Helpers_CalculateCSE(2,year,true));
      Session.set("CSE_september_pure", Helpers_CalculateCSE(3,year,true));

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


      ///TTT
      /*var ECTS ={ TTT_analyse: 6,
      TTT_mechanica: 5,
      TTT_scheikunde: 7,
      TTT_algebra: 5
    };
    var totalECTS = 0;
    var totalTTTScore = 0
    var analyse = TTT_analyse.findOne();
    var TTTs = [];
    if(analyse != undefined && analyse.grade != "NA"){
    totalTTTScore += analyse.grade * 6;
    totalECTS+=6;
    TTTs.push("TTT_analyse");
  }
  var mechanica = TTT_mechanica.findOne();
  if(mechanica != undefined && mechanica.grade != "NA") {
  totalTTTScore += mechanica.grade * 5;
  totalECTS+=5;
  TTTs.push("TTT_mechanica")
}
var scheikunde = TTT_scheikunde.findOne();
if(scheikunde != undefined && scheikunde.grade != "NA") {
totalTTTScore +=  parseInt(scheikunde.grade/5) * 7;
totalECTS+=7;
TTTs.push("TTT_scheikunde")
}
var algebra = TTT_algebra.findOne();
if(algebra != undefined && algebra.grade != "NA") {
totalTTTScore += algebra.grade * 5;
totalECTS+=5;
TTTs.push("TTT_algebra")
}
Session.set("CSE_TTT",5*totalTTTScore/totalECTS);
Session.set("TTTs",TTTs);*/



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
}
})
})





Template.body.helpers({
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

  studentCourses(semester, failedOnly, gradetry)
  {

    var results = [];
    var searchTerm = {semester:semester};
    var courses = Courses.find(searchTerm, {sort:{semester:1, coursename:1}});
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
      return results;
    },

    ijkingstoetsen()
    {
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
    /*TTTs()
    {
    var results = [];
    var analyse = TTT_analyse.findOne();

    if(analyse != undefined)
    {
    if(analyse.student != Session.get("student")) return [];
    if(analyse.grade != "NA")
    results.push({id:"TTT_analyse", name:"Analyse Deel 1", grade: analyse.grade, realGrade: analyse.grade, method:"getTTT_AnalysePointDistribution"});
  }
  var mechanica = TTT_mechanica.findOne();
  if(mechanica != undefined)
  {
  if(mechanica.student != Session.get("student")) return [];
  if(mechanica.grade != "NA")
  results.push({id:"TTT_mechanica", name:"Toegepaste Mechanica Deel 1", grade: mechanica.grade, realGrade:mechanica.grade, method:"getTTT_MechanicaPointDistribution"});
}
var scheikunde = TTT_scheikunde.findOne();
if(scheikunde != undefined)
{
if(scheikunde.student != Session.get("student")) return [];
if(scheikunde.grade != "NA")
results.push({id:"TTT_scheikunde", name:"Algemene en Technische Scheikunde", grade: parseInt(scheikunde.grade/5), realGrade: scheikunde.grade, method:"getTTT_ScheikundePointDistribution"});
}
var algebra = TTT_algebra.findOne();
if(algebra != undefined)
{
if(algebra.student != Session.get("student")) return [];
if(algebra.grade != "NA")
results.push({id:"TTT_algebra", name:"Toegepaste Algebra", grade: parseInt(algebra.grade), realGrade: algebra.grade, method:"getTTT_AlgebraPointDistribution"});
}
return results;
},*/

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
  CSE_januari() { return {percent: Session.get("CSE_januari"), raw:  Session.get("CSE_januari_pure") } },
  CSE_juni() { return {percent: Session.get("CSE_juni"), raw:  Session.get("CSE_juni_pure")} },
  CSE_september() { return {percent: Session.get("CSE_september"), raw:  Session.get("CSE_september_pure")} },

  Fails() {
    //console.log("fail fetch of " + Session.get("Fails"))
    return Session.get("Fails");},
    ShowJuni(){
      return Meteor.settings.public.showSeptember != undefined ? Meteor.settings.public.showJuni : false;

    },
    ShowSeptember(){
      return Meteor.settings.public.showSeptember != undefined ? Meteor.settings.public.showSeptember : false;

    }



  });
