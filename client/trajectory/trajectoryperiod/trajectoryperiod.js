Template.trajectoryperiod.onRendered(function () {
  var instance = this;
  instance.autorun(function () {
    var period = instance.data.period;
    var semester = instance.data.semester;
    var cse = Session.get("CSE_" + period);
    var svg = d3.select("#distribution_" + period + " svg.distribution");
    var params = ['getDistribution', semester, Session.get("Year")];

    let data = getDistribution(semester, Session.get("Year"));
    //find max value and min value
    var min = Number.MAX_VALUE;
    var max = Number.MIN_VALUE;
    var count = 0;

    data.distribution.forEach(function (d) {
      if (d.count > max)
        max = d.count;
      if (d.count < min)
        min = d.count;
      count += d.count;
    });
    /*
    Visualisation of Square Plot (50);
    */
    let total = count;
    let width = 350;
    let container = svg.selectAll(".figures")
      .data(data.distribution).enter();

    container.append("rect") //Trace element
      .attr("class", function (d) {
        return "trace trace" + d.bucket;
      })
      .attr("fill", function (d) {
        let current = d.bucket * 10;
        let next = current + 11;
        let color = "white";
        if (cse === 0) cse = 1;
        if ((current < cse) && (cse < next)) color = "#E8F3F8";
        return color;
      })
      .attr("width", "100%")
      .on("mouseover", function (d) {
        svg.selectAll(".tooltip" + d.bucket).style("display", "inline");
        element = $(this).parent().parent().attr('id');
        clicks.insert({
          'session': Session.get('Id'),
          'studentid': Session.get('student'),
          'element': element + ' ' + d.bucket,
          'time': Date.now(),
          'action': 'hover_trajectory'
        })
      })
      .on("mouseout", function (d) {
        svg.selectAll(".tooltip" + d.bucket).style("display", "none");
        element = $(this).parent().parent().attr('id')
        clicks.insert({
          'session': Session.get('Id'),
          'studentid': Session.get('student'),
          'element': element + ' ' + d.bucket,
          'time': Date.now(),
          'action': 'leave_trajectory'
        })

      })
      .on('click', function (d) {
        element = $(this).parent().parent().attr('id');
        console.log(element)
        clicks.insert({
          'session': Session.get('Id'),
          'studentid': Session.get('student'),
          'element': element + ' ' + d.bucket,
          'time': Date.now(),
          'action': 'click_trajectory'
        })
      })
      .attr("height", 10)
      .attr("x", "0")
      .attr("y", function (d, i) {
        return 98 - ((d.bucket * 10) + 6);
      });

    let circles = container.append("g") // Dotplot Dots
      .attr("class", "row")
      .selectAll("circle")
      .data(function (d) {
        let dots = Math.round(((50 * d.count) / total));
        if (dots > 30) dots = 0;
        return d3.range(dots);
      })
      .enter()
      .append("circle")
      .on("mouseover", function (d) {
        svg.select(".tooltip" + d.bucket).style("display", "inline");
      })
      .on("mouseout", function (d) {
        svg.select(".tooltip" + d.bucket).style("display", "none");
      })
      .attr("fill", function (d) {
        if (_.isNaN(cse)) cse = 1;
        if (_.isUndefined(cse)) cse = 1;
        if (cse == 0) cse = 1;
        let pbucket = d3.select(this.parentNode).datum().bucket;
        let current = pbucket * 10;
        let next = current + 11;
        if ((current < cse) && (cse < next))
          return "#81A8B8"; else return "#C2CBCE";
      })
      .attr("stroke", "none")
      .attr("r", 3)
      .attr("cx", function (d) {
        return (width / 2);
      })
      .attr("cy", function (d, i) {
        return 98 - ((d3.select(this.parentNode).datum().bucket * 10) + 1.4);
      })
      .transition()
      .duration(1000)
      .ease("exp")
      .attr("cx", function (d, i) {
        let parent = d3.select(this.parentNode).datum().count;
        let start = (Math.round(((50 * parent) / total)) * 8) + 2;
        return ((width / 2) + (i * 8)) - start / 2;
      });

    /** Tooltip **/
    let text = container.append("text")
      .attr("class", function (d) {
        return "tooltip tooltip" + d.bucket;
      })
      .style("z-index", 1000)
      .attr("x", 350)
      .attr("text-anchor", "end")
      .attr("y", function (d, i) {
        return (100 - (d.bucket * 10));
      })
      .text(function (d) {
        return ((Math.round((50 * d.count) / total) * 2)) + "%";
      })
      .attr("width", 180)
      .attr("height", 4)
      .attr("font-size", 10);
  })
});


/**
 * Method that splits the calls for the distribution
 * into calls to csedistribution and scoredistribution
 * Called from trajectoryperiod
 * @param semester
 * @param year
 * @returns {undefined}
 */
let getDistribution = function (semester, year) {
  //Look whick score you want to use
  let distribution = undefined;
  switch (semester){
    case -2:
    case -1:
      distribution =  getScoreDistribution(semester, year);
      break;
    default:
      distribution =  getSemesterCSEDistribution(semester, year);
      break;
  }
  return distribution;

};



/**
 * Find the cse distribution in a semester
 * @param semester
 * @param year
 * @returns {{distribution: Array}}
 */
let getSemesterCSEDistribution =  function (semester, year) {
  let cses = AllCSEs.find({year: year});
  var buckets = {};
  for (var i = 0; i < 10; i++) {
    buckets[i] = 0;
  }
  //For each of the 10 categories count number of occurrences
  cses.forEach(function (s) {
    let bucketId = getBucketID(s, semester);
    if (bucketId === 10) bucketId = 9;
    buckets[bucketId]++;
  });

  let distribution = [];
  Object.keys(buckets).forEach(function (b) {
    distribution.push({bucket: parseInt(b), count: buckets[b]})
  });
  return {distribution: distribution};

};

/**
 * Make distribution of scores
 * Needed for tests before jan exams
 * @param semester
 * @param year
 * @returns {{distribution: Array}}
 */
let getScoreDistribution = function (semester, year) {
  let courses = Courses.find({semester:semester});
  let courseids = [];
  courses.forEach(function (course) {
    courseids.push(course.courseid)
  });
  let nbCourses = courseids.length;
  //Find all scores of this year without # or NA
  let scores = NewGrades.find({"$and": [{year: year}, {courseid: {$in: courseids}}, {finalscore: { "$gte": -1, "$lt": 21 } }] });


  var buckets = {};
  for (var i = 0; i < 10; i++) {
    buckets[i] = 0;
  }
  //For each of the 10 categories count number of occurrences
  scores.forEach(function (s) {
    var bucketId = parseInt(s.finalscore / 2);
    if (bucketId === 10) bucketId = 9;
    buckets[bucketId]++;
  });

  let distribution = [];
  Object.keys(buckets).forEach(function (b) {
    distribution.push({bucket: parseInt(b), count: buckets[b]})
  });
  return {distribution: distribution};
};

let getBucketID = function (s, semester) {
  if (semester === 1) {
    return parseInt(s.cse1 / 10);
  }
  else if (semester === 2) {
    return parseInt(s.cse2 / 10);
  }
  else {
    return parseInt(s.cse3 / 10);
  }
}
