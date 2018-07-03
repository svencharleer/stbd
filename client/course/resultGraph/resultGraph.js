import {ReactiveVar} from 'meteor/reactive-var'

Template.resultGraph.onCreated(function () {
  this.show = new ReactiveVar(false);
  this.zoom = new ReactiveVar(false);
});

Template.resultGraph.helpers({
  color: function () {
    let color = "white"; //"#ef9a9a";
    //todo fix this for resits
    let courseSemester = this.Academischeperiode;
    let scoreEntry = getScoreEntry(courseSemester);
    let score = this[scoreEntry];
    if (score < 8) color = "failed"; //"#ff8a80"; //failed
    else if (score > 9 || score === "G") color = "passed"; //"#a5d6a7"; //passed
    else if (score >= 8 && score <= 9) color = "tolerable"; // "#ffcc80"; //tolerable
    else if (score == "NA") color = "failed"; // "#ffcc80"; //tolerable
    else color = "error"; // "#ff8a80"; //failed
    return color;
  },
  getStrippedCourseID: function () {
    let courseId = this.IDOPO;
    courseId = courseId.replace(/ /g,'');
    courseId = courseId.replace(/,/g,'');
    courseId = courseId.replace(/:/g,'');
    return courseId
  },
  validCredits: function () {
    let credits = this.Studiepunten;
    return credits > 0;
  },
  Score: function () {
    let courseSemester = this.Academischeperiode;
    let scoreEntry = getScoreEntry(courseSemester);
    let score = this[scoreEntry];
    // Check if its a number, otherwise parseInt;
    if(!isNaN(parseInt(score))) score = parseInt(score);
    return score;
  }
});

Template.resultGraph.events({
  "click .course-top": function (event, template) {
    if (!template.show.get()) {
      template.$(".course-bottom").css("max-height", "60px");
      template.$(".top-bar").css("box-shadow", "1px 1px 5px gainsboro");
      template.show.set(true);

    } else {
      template.$(".course-bottom").css("max-height", "0px");
      template.$(".top-bar").css("box-shadow", "0px 0px 0px gainsboro");
      template.$(".course").css("box-shadow", "0px 0px 0px gainsboro");
      template.$(".course").css("transform", "scale(1)");
      template.$(".course").css("z-index", "0");
      template.show.set(false);

    }
  },
  "click .course-bottom": function (event, template) {
    if (!template.zoom.get()) {
      template.$(".course").css("transform", "scale(1.5)");
      template.$(".course").css("z-index", "1000");
      template.$(".course").css("box-shadow", "1px 1px 5px gainsboro");
      template.zoom.set(true);

    } else {
      template.$(".course").css("transform", "scale(1)");
      template.$(".course").css("z-index", "0");
      template.$(".course").css("box-shadow", "0px 0px 0px gainsboro");
      template.zoom.set(false);
    }

  }
});


Template.resultGraph.onRendered(function () {
  let width = 140;
  let height = 60;
  let courseID = Template.instance().firstNode.id;
  let svg = d3.select("#" + courseID).select(".histogram")
    .attr("class", "histogram")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);

  let template = Template.instance();

  svg.append("g") // Add the dots to the graph!
    .attr("class", "main-container")
    .selectAll(".dots-container")
    .data(function () {
      let sample = [];
      for (let i = 0; i <= 20; i++) sample.push({grade: i, count: 0});
      sample.max = 20;
      return sample;
    })
    .enter()
    .append("g")
    .attr("class", "dots-container");

  Meteor.call("getDynamicSetting", function (err, dynamic) {
    if (!dynamic) {
      template.$(".course-bottom").css("max-height", "60px");
      template.$(".top-bar").css("box-shadow", "1px 1px 5px gainsboro");
      template.show.set(true);
    }
  })

});

/**
 *
 * @param semester
 * @returns score_entry: fieldname of the db
 */
let getScoreEntry = function (semester) {
  var score_entry = 'Score';
  switch (semester) {
    case "Eerste Semester":
      score_entry = 'Scorejanuari';
      break;
    case "Tweede Semester":
      score_entry = 'Scorejuni';
      break;
    default:
      score_entry = 'Score';
  }
  return score_entry;

};
