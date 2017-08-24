/**
 * Calculate the CSE of a student
 * @param {Integer} semester //0 1 2
 * @param {?} year //2016-2017
 * @param {Integer} pure : return fraction or not
 */
Helpers_CalculateCSE = function(semester,year, pure) //1 2 3 (sept) 0 = TTT
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
  // console.log("apart_cse" + cse_forprint)
  // console.log("total_cse" +totalcse)
  if(pure) return cse;
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

/**
 * Calculate the CSE of a student
 * @param {ObjectId} studentID :
 * @param {Integer} semester : 0 = TTT; 1 = januari; 2 = june; 3 = august
 * @param {String} year :   eg. 2016-2017
 * @returns {Int32} : integer between 0 and 100
 */
Helpers_GetCSE = function(studentID, semester, year)
{  
  var cse = CSEs.findOne({studentid: studentID, year: year});
  var result = -1;
  if(cse != undefined)
    {
      switch(semester) { 
        case 0:
          result = Helpers_CalculateCSE(semester, year, 0);
        case 1:
          result = cse.cse1;
          break;
        case 2:
          result = cse.cse2;
          break;
        case 3:
          result = cse.cse3;
          break;
        default:
          result = -1;
      }

    }
  
  if(result>0)
    return result;
  else {
    return 0;
  }
}