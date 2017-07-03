Template.planning.rendered = function(){
  var svg = d3.select(this.find("svg.circleGraph"));
  var height = 100;
  var width = 100;
  var padding = 10;


  Tracker.autorun(function(){
    var percent = Session.get("PlanningPercentage");
    if(percent == undefined) return;
    //console.log("percet", percent);
    svg.select("rect")
        .transition()
        .attr("height", (height+padding/2) * (1.0 - percent))
      ;
    svg.select("text")
      .transition()
      .attr("fill", function(){
        if(percent > .5)
          return "white";
        else return "#88B458";
      })
      .attr("y", function(){
        var diff = 0;
        if(percent > .5)
          diff = 20;
        if(percent > .9)
          diff = 25;
        return diff + (height+padding/2) * (1.0 - percent)-3;
      })
      .text(parseInt(100 * percent) + "%");
  });

  Tracker.autorun(function(){
    var selectedCourses = Session.get("selectedCourses");
    if(selectedCourses == undefined) return;
    var count = 0;

    //get the selected courses' ECTS
    Object.keys(selectedCourses).some(function(k){
      var c = selectedCourses[k];
      if(!c.checked)return;
      count++;
    })

    Meteor.call("getSeptemberSuccess", count, function(err, data){
      //$("#septemberSuccess").text((100* data.percentAllPassed) + "%");
      Session.set("PlanningPercentage",data.percentAllPassed);
      //console.log(data.percentAllPassed);
    });
  })


}

Template.planning.helpers({
  CSE() {
    var selectedCourses = Session.get("selectedCourses");
    var totalECTS = 0;
    var receivedPLUSplannedECTS = 0;
    if(selectedCourses == undefined) return;
    //get the selected courses' ECTS
    Object.keys(selectedCourses).some(function(k){
      var c = selectedCourses[k];

      var courseData = Courses.findOne({courseid:c.id});
      if(courseData == undefined) return;
      totalECTS += courseData.credits;
      if(!c.checked)return;
      //console.log(courseData.name, courseData.credits)
      receivedPLUSplannedECTS += courseData.credits;
    })

    //add all the courses they already passed
    var allCourses = Courses.find({fase:1});
    var passedCourses = [];
    allCourses.forEach(function(j){
      var myCourse = Grades.findOne({idopleidingsond:j._id});
      if(myCourse == undefined) return;
      if(myCourse.grade_try1 < 10 || myCourse.grade_try1 == "NA") return;
      //console.log(j.name, j.credits)
      receivedPLUSplannedECTS += j.credits;
      totalECTS += j.credits;
    })
    //console.log(totalECTS);
    return {percent: Math.ceil(100 * receivedPLUSplannedECTS/totalECTS)};

  },
  nrOfCourses(){
    var selectedCourses = Session.get("selectedCourses");
    var count = 0;
    if(selectedCourses == undefined) return 0;
    //get the selected courses' ECTS
    Object.keys(selectedCourses).some(function(k){
      var c = selectedCourses[k];
      if(!c.checked)return;
      count++;
    })
    return count;
  }


})
