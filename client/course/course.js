Template.course.onRendered(function () {
  let instance = this;


  instance.autorun(function () {
    //Session.get("student")
    let handler1 = instance.subscribe("generic_courses", function () {});
    let handler2 = instance.subscribe("generic_grades", Session.get("student"));
    // let handler3 = instance.subscribe("ijkingstoets", Session.get("student"));

    if (handler1.ready() && handler2.ready()) {
      let studentGrade = instance.data.grade;
      let semester = instance.data.semester;
      let svg = d3.select(instance.find("svg"));
      let courseId = instance.data.id;
      let method = "getCoursePointDistribution";
      if (semester == undefined) semester = 2;

      //ugly hack: if semester 3, is 2e zit. we want to show histogram depending on the period
      //you received the highest grade. 3 means you'll show grade_try2, so
      //if they got a higher score in try1, we force it to semester=2 (or 1, doesn't matter)
      //Normally not needed anymore but stays here for safety
      if (semester === 3 && instance.data.try1 !== undefined) {
        if (instance.data.try1 >= instance.data.try2 || instance.data.try2 === "NA")
          semester = 2;
      }

      Meteor.call(method, courseId, Session.get("Year"), semester, function (err, data) {
        console.log(courseId)
        console.log(data)
        let grades = data.numberPerGrades;
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
          .attr("class", "yellowbars")

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

      });
    }
  })
})
