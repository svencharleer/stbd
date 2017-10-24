Template.column.helpers({
  /**
   * @returns [{id,name,grade,semester,credits}]
   */
  studentCourses() {
    //get semester from template (Given in body)
    let semester = this.semester;
    //array for output
    let results = [];
    let courses = undefined;
    switch(semester){
      case -2:
        courses = Courses.find({semester: semester}, {sort: {semester: 1, coursename: 1}});
        break;
      case -1:
        courses = Courses.find({semester: semester}, {sort: {semester: 1, coursename: 1}});
        break;
      case 1:
        courses = Courses.find({semester: semester}, {sort: {semester: 1, coursename: 1}});
        break;
      case 2:
        //semester = 0 needed for courses during the whole year
        courses = Courses.find({$or: [{semester: 0}, {semester: 2}]}, {sort: {semester: 1, coursename: 1}});
        break;
      case 3:
        courses = Session.get('FailedCourses');
        break;
      default:
        alert("Expected semester but found: " + semester)

    }
    //Test if there are grades
    var testStudent = Grades.findOne();
    if (testStudent == undefined || testStudent.studentid != Session.get("student")) {
      return results;
    }
    if (courses === undefined) return results;
    courses.forEach(function (j) {
      var result = Grades.findOne({courseid: j.courseid});
      if (result === undefined) {
        return;
      }
      var score = result.finalscore;
      if (score === "#") return;
      results.push({
        id: j.courseid,
        name: j.coursename,
        grade: score,
        semester: semester,
        credits: parseInt(j.credits)
      });

    });
    console.log(results)
    return results;

  },
  "cseAvailable":function() {
    return this.credits !== undefined
  },
  "getFailedCourses":function () {
    Meteor.call("getFailedCourses", Session.get("student"), function (err, data) {
      return data;
    })
  },
  "getStudentCourses":function () {
    let courses = []
    Meteor.call("getCourses", Session.get('student'), Session.get('semester'), function (err, coursesSemester) {
      console.log(courses)
      courses = coursesSemester
      return courses
    })
    console.log(courses)
    return courses
  }
});