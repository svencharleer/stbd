/**
 * Calculate the pure CSE of a student
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
    courses = Courses.find({$or:[{semester:0},{semester:1},{semester:2}]}).fetch(); //don't get TTTs
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
  if(pure) return cse;
  if(totalcse>0)
    return Math.round(cse/totalcse*100);
  else {
    return 0;
  }

}

// Helpers_GetTotalPointForPeriod = function(semester,year) //1 2 3 (sept) 0 = tTT
// {
//   console.log("gettotalpointforperiod")
//   var count = 0;
//   var totalscore = 0;
//   courses.some(function(j){
//     var result = Grades.findOne({courseid: j.courseid, year: year});
//     if(result != undefined)
//     {
//       var score = result.finalscore;
//       if(score != "NA" && score != "#")
//         totalscore += parseInt(score);
//       if(score != "#")
//         if(!(score == "NA" && semester == 0))
//           count++;
//
//     }
//   });
//   return 5*totalscore/count;
//
// };

/**
 * Get the total number of points
 * Needed for the tests before januari
 * @param studentID
 * @param semester
 * @param year
 * @returns {number}
 * @constructor
 */
Helpers_GetCSETests = function (studentID, semester, year) {
  let courses = Courses.find({semester:semester}).fetch();
  let totalPoints = 0;
  courses.forEach(function (course) {
    let grade = Grades.findOne({$and: [{studentid: studentID},{courseid: course.courseid}, {year:year}]});
    if (grade != undefined && grade.finalscore > 0){
      totalPoints += grade.finalscore;
    }
  });
  return totalPoints;
};

/**
 * Calculate the CSE of a student
 * Normally only called once from body
 * @param {ObjectId} studentID :
 * @param {Integer} semester : -2 = IJK; -1 = TTT; 1 = januari; 2 = june; 3 = august
 * @param {String} year :   eg. 2016-2017
 * @returns {Int32} : integer between 0 and 100
 */
Helpers_GetCSE = function(studentID, semester, year)
{
  console.log("Helpers_getCSE" + semester)
  var cse = CSEs.findOne({studentid: studentID, year: year});
  var result = -1;
  if(cse != undefined)
    {
      switch(semester) {
        case -2:
        case -1:
          result = Helpers_GetCSETests(studentID, semester, year);
          break;
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

/**
 * Initialize the cse planning
 * needed in the body-autorun to update when a new student is inputted
 * @param {integer} cse1 nb of credits earned september
 */
Helpers_CalculateStartValues = function(cse1){
  let cse_remaining = 180 - cse1;
  let cse2 = Math.floor(cse_remaining/4);
  let cse2a = Math.floor(cse2 /2);
  let cse2b = cse2 - cse2a;
  let cse3 = Math.floor(cse_remaining/3);
  let cse4 = cse_remaining - cse3 - cse2;
  var cse5 = 0;
  if(cse4 > 60) {
    cse5 = cse4 - 60;
    cse4 = 60;
  }
  return {"cse1": cse1, "cse2": cse2, "cse2a" : cse2a, "cse2b": cse2b,  "cse3": cse3, "cse4":cse4, "cse5":cse5}
}


