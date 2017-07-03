/*GetFailedCourses = function()
{
  var count = 0;
  var allCourses = Courses.find({fase:1});
  var failedCourses = [];


  allCourses.forEach(function(j){
    var search = {};
    var result = Grades.findOne({idopleidingsond:j._id, $lt:{scorenajuni:10}});

  })
  return {courses: failedCourses, count:count};
}*/

GetTotalCourseCSE = function()
{
  var total = 0;
  Courses.find().fetch().forEach(function(course){
    total += course.credits;
  });
  console.log(total);
  return total;

}
