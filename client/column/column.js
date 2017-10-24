Template.column.helpers({
  /**
   * @returns [{id,name,grade,semester,credits}]
   */
  studentCourses() {
    //get semester from template (Given in body)
    let semester = this.semester;
    let studentid = Session.get('student');
    let studentCourses = Grades.find({
      '$and':
        [
          {studentid: studentid },
          {finalscore: {'$not': '#'} }
        ]

    });

    courseIds = [];
    //Check if he passes course or not
    studentCourses.forEach(function(c){
      courseIds.push(c.courseid);
    });
    //array for output
    let courses = [];
    // console.log(courseIds)
    // console.log(semester)
    switch(semester){
      case -2:
      case -1:
      case 1:
        courses = Courses.find({'$and' :[{courseid:{$in : courseIds}}, {semester:semester}]});
        break;
      case 2:
        //semester = 0 needed for courses during the whole year
        courses = Courses.find({'$and' :[{courseid:{$in : courseIds}}, {$or: [{semester: 0}, {semester: 2}]}]});
        break;
      case 3:
        courses = Session.get('failedCourses');
        break;
      default:
        alert("Expected semester but found: " + semester)

    }

    //Put coursename, courseid, score and semester in result
    let result = [];

    courses.forEach(function (c) {
      let studentCourses = Grades.findOne(
        {
          $and : [
            {studentid:studentid},
            {courseid: c.courseid}
          ]
        },
        {finalscore:1}
      );
      result.push(
        {
          grade: studentCourses.finalscore,
          studentid: studentid,
          id: c.courseid,
          semester: c.semester,
          name: c.coursename,
          credits: parseInt(c.credits)
        })
    });
    return result;

  },
  "cseAvailable":function() {
    return this.credits !== undefined
  },
  "getFailedCourses":function () {
    Meteor.call("getFailedCourses", Session.get("student"), function (err, data) {
      return data;
    })
  },
});