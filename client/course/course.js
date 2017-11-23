Template.course.onRendered(function () {
  let instance = this;

  instance.autorun(function () {
    let studentGrade = instance.data.grade;
    let semester = instance.data.semester;
    let svg = d3.select(instance.find("svg"));
    let courseId = instance.data.id;
    if (semester == undefined) semester = 3;



    data = getCoursePointDistribution(courseId, semester);
    let grades = data.numberPerGrades;
    console.log(grades)
    let total = 0;
    for (let i = 0; i < grades.length; i++) total += grades[i].count;

    let width = 140;
    let height = 60;

    let graph = svg.selectAll(".dots-container");
    graph.selectAll(".dot")
      .data(function (d, i) {
        let count = 0;
        let grade = 0;

        if (grades[i] != undefined) count = grades[i].count;
        if (grades[i] != undefined) grade = grades[i].grade;

        let dots = Math.round(((50 * count) / total));
        //if(dots > 10) dots = 9;
        let list = [];
        for (let a = 0; a <= dots; a++) {
          list.push({"grade": grade});
        }
        return list;
      })
      .enter()
      .append("rect")
      .attr("class", "dot")
      .attr("width", 4)
      .attr("height", 4)
      .attr("x", function (d, i) {
        return d.grade * 7;
      })
      .attr("y", function (d, i) {
        return (height - 5) - (i * 3);
      })
      .attr("fill", function (d, i) {
        let color = "#c2cbce";
        if (d.grade == studentGrade) {
          if (d.grade < 8) color = "#ff8a80"; //failed
          else if (d.grade > 9) color = "#a5d6a7"; //passed
          else if (d.grade >= 8 && d.grade <= 9) color = "#ffcc80"; //tolerable
          else color = "#ff8a80"; //failed
        }
        return color;
      });

    // 1 -> 7 pixels
    svg.selectAll(".redbars").data(function () {
      return d3.range(1);
    }) // 8
      .enter()
      .append("rect") // < 8 Failed
      .attr("fill", "#ff8a80")
      .attr("width", 6 * 10)
      .attr("height", 2)
      .attr("transform", function (d, i) {
        return "translate(" + ((i * 7) - 2) + "," + height + ")";  // Starts from 0, always.
      })
      .attr("class", "redbars");

    svg.selectAll(".yellowbars").data(function () {
      return d3.range(1);
    }) // 2
      .enter()
      .append("rect") // 8-9 Tolerated
      .attr("stroke", "#ffcc80")
      .attr("fill", "#ffcc80")
      .attr("width", 6 * 3) // between 8 and 9 is 10% of total width.
      .attr("height", 2)
      .attr("transform", function (d, i) {
        return "translate(" + (((8 + i) * 7) - 2) + "," + height + ")";  // Starts from 0, always.
      })
      .attr("class", "yellowbars");

    svg.selectAll(".greenbars").data(function () {
      return d3.range(1);
    }) // 12
      .enter()
      .append("rect") // > 9 Pass 45% of histogram width.
      .attr("stroke", "#a5d6a7")
      .attr("fill", "#a5d6a7")
      .attr("width", 6 * 13)
      .attr("height", 2)
      .attr("transform", function (d, i) {
        return "translate(" + (((i + 10) * 7) - 2) + "," + height + ")";  // Starts from 0, always.
      })
      .attr("class", "greenbars");
    })
});

/**
 * Calculate gradefield and call GetDistribution
 * @param courseid
 * @param year
 * @param semester: -2,-1,0,1,2,3: for which semester you want the distribution
 * @returns {{numberPerGrades, min, max, total}}
 */
let getCoursePointDistribution =  function (courseid, year, semester) {
  let gradeField = "Score";
  if (semester === 3){ //only in resits you need the score of that specific period
    gradeField = "ScoreSeptember";
  }
  return getCoursePointDistributionSemester(courseid, year, gradeField);
}

/**
 * Return the distribution of the course
 * @param courseid
 * @param year
 * @param gradeField
 * @returns {{numberPerGrades: {}, min: Number, max: Number, total: number}}
 */
let getCoursePointDistributionSemester = function (courseid, gradeField) {
  var numberPerGrades = {};
  var total = 0;
  let allGrades  = Boekingen.find({"IDOPO" : courseid});
  var min = Number.MAX_VALUE;
  var max = Number.MIN_VALUE;
  allGrades.forEach(function (student) {
    //get correct grade
    var grade = 0;
    if (student[gradeField] == "NA" || student[gradeField] == "#" || student[gradeField] == "GR") return;
    grade = parseInt(student[gradeField]);
    //Initialise the count on 0 if the first with this score
    if (numberPerGrades[grade] === undefined)
      numberPerGrades[grade] = {grade: grade, count: 0};
    numberPerGrades[grade].count++;
  });

  Object.keys(numberPerGrades).forEach(function (score) {
    if (min > numberPerGrades[score].count)
      min = numberPerGrades[score].count;
    if (max < numberPerGrades[score].count)
      max = numberPerGrades[score].count;
  });


  numberPerGrades = Object.keys(numberPerGrades).map(function (key) {
    return numberPerGrades[key];
  });
  return {numberPerGrades: numberPerGrades, min: min, max: max, total: total};
};
