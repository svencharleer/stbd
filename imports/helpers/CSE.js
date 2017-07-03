//get CSE per semester
Helpers_GetCSE = function(semester,year) //1 2 3 (sept) 0 = tTT
{
  var courses;
  if(semester == 1)
    courses = Courses.find({semester:semester}).fetch();
  else
    courses = Courses.find({$or:[{semester:1},{semester:2}]}).fetch(); //don't get TTTs
  var cse = 0;
  var totalcse = 0;
  var cse_forprint = "";
  courses.some(function(j){

    var result = Grades.findOne({courseid: j.courseid, year: year});
    if(result != undefined)
    {
      var score = "#";
      if(semester == 3)
        score = result.finalscore;
      else
        score = result.grade_try1;

      if(score != "NA" && score != "#")
      {
          cse += score >= 10 ? parseInt(j.credits) : 0;
          cse_forprint += " " + cse;
      }
      totalcse += parseInt(j.credits);

    }
  });
  console.log("apart_cse" + cse_forprint)
  console.log("total_cse" +totalcse)
  if(totalcse>0)
    return Math.round(cse/totalcse*100);
  else {
    return 0;
  }

}

Helpers_GetTotalPointForPeriod = function(semester,year) //1 2 3 (sept) 0 = tTT
{
  var courses = Courses.find({semester:semester}).fetch();
  var count = 0;
  var totalscore = 0;
  courses.some(function(j){
    var result = Grades.findOne({courseid: j.courseid, year: year});
    if(result != undefined)
    {
      var score = result.finalscore;
      if(score != "NA" && score != "#")
        totalscore += parseInt(score);
      if(score != "#")
        if(!(score == "NA" && semester == 0))
          count++;

    }
  });
  return 5*totalscore/count;

}
