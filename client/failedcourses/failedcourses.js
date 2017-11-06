import {ReactiveVar} from 'meteor/reactive-var'

Template.failedCourse.onCreated(function () {
  this.showTolerance = new ReactiveVar(false);
  this.checkFail = new ReactiveVar(true);
});


Template.failedCourse.helpers({
  color: function () {
    let color = "white"; //"#ef9a9a";
    if (this.grade < 8) color = "failed" //"#ff8a80"; //failed
    else if (this.grade > 9) color = "passed" //"#a5d6a7"; //passed
    else if (this.grade >= 8 && this.grade <= 9) color = "tolerable"; // "#ffcc80"; //tolerable
    else color = "failed"; // "#ff8a80"; //failed
    return color;
  },
  courseLabel: function () {
    let label = "NT";
    if ((this.try1 > 9) || (this.try2 > 9)) label = "G"; // Passed
    else if ((this.try1 >= 8 && this.try1 <= 9) || (this.try2 >= 8 && this.try2 <= 9)) label = "T";
    else label = "NT";
    return label;
  },
  try1: function () {
    let bold = "bold";
    if (grade(this.try1) < grade(this.try2)) bold = "notbold";
    return {"grade": this.try1, "bold": bold};
  },
  try2: function () {
    let bold = "bold";
    if (grade(this.try1) > grade(this.try2)) bold = "notbold";
    return {"grade": this.try2, "bold": bold};
  },
  /**
   * Check if current CSE >= 50
   * otherwise you cannot tolerate
   * @return {String} : "cannotTolerate" of "canTolerate"
   */
  canTolerate: function () {
    let semester = Session.get('semester');
    let CSE_september = Session.get('CSE_september');
    let CSE_juni = Session.get('CSE_juni');
    let CSE_januari = Session.get('CSE_januari');
    let CSE_list = [CSE_januari, CSE_juni, CSE_september];
    let currentCSE = CSE_list[semester - 1]
    if (currentCSE < 50) {
      return "cannotTolerate"
    }
    else {
      return "canTolerate";
    }
  }

});

var grade = function (grade) {
  if (typeof(grade) != 'number') {
    return 0
  }
  else {
    return grade
  }
}

Template.failedCourse.events({
  "click .course-top.tolerable.canTolerate": function (event, template) {
    if (!template.showTolerance.get()) {
      template.$(".course-bottom").css("max-height", "48px");
      template.$(".top-bar").css("box-shadow", "1px 1px 5px gainsboro");
      template.showTolerance.set(true);
      clicks.insert({
        'session': Session.get('Id'),
        'studentid': Session.get('student'),
        'element': 'course-top_' + this.id,
        'time': Date.now(),
        'action': 'visible'
      })
    } else {
      template.$(".course-bottom").css("max-height", "0px");
      template.$(".top-bar").css("box-shadow", "0px 0px 0px gainsboro");
      template.$(".course").css("box-shadow", "0px 0px 0px gainsboro");
      template.$(".course").css("transform", "scale(1)");
      template.$(".course").css("z-index", "0");
      template.showTolerance.set(false);
      clicks.insert({
        'session': Session.get('Id'),
        'studentid': Session.get('student'),
        'element': 'course-top_' + this.id,
        'time': Date.now(),
        'action': 'hide'
      })

    }
  },

  "click .course-top.tolerable.cannotTolerate": function (event, template) {
    $('#CSE_sept').css("animation-play-state", "running");
    let x = document.getElementById('CSE_sept');
    x.addEventListener("webkitAnimationIteration", function () {
      $('#CSE_sept').css("animation-play-state", "paused");
    });
    clicks.insert({
      'session': Session.get('Id'),
      'studentid': Session.get('student'),
      'element': 'course-top_' + this.id,
      'time': Date.now(),
      'action': 'cannotTolerate'
    })
  },

  "click .course-top.failed": function (event, template) {
    clicks.insert({
      'session': Session.get('Id'),
      'studentid': Session.get('student'),
      'element': 'course-top_' + this.id,
      'time': Date.now(),
      'action': 'failed'
    })
  },


  "click .stay-failed": function (event, template) {
    /**
     * if failed is checked
     * then do nothing
     * else
     *  check if you don't create more then 12 credits (Should be impossible)
     *  update layout ( click checked, uncheck tolerate, fade out, grey, topbar)
     *  give credits back
     *  update boolean checkFail
     */

    if (!template.checkFail.get()) {
      let creditsLeft = Session.get('toleranceCredits')
      let cancelToleration = parseInt(creditsLeft) + parseInt(this.credits);
      if (cancelToleration <= 12) {
        Session.set('toleranceCredits', cancelToleration)
        // $('#tolerantiepunten').find("paper-progress").attr('value', cancelToleration);
        // $('#tolerantiepunten').find("span").text(cancelToleration);
        template.$(".check-fail").css("color", "white");
        template.$(".check-fail").css("background-color", "#ffcc80")
        template.$(".stay-failed").css("opacity", "1");
        template.$(".check-tolerate").css("color", "transparent")
        template.$(".tolerate-course").css("opacity", "0.5");
        template.$(".top-bar").css("background-color", "#ffcc80");
        template.$(".course").css("border-color", "#ffcc80");
        template.$(".getolereerd").css("display", "none");
        template.$(".try").css("display", "flex");
        updateSession(false, this.credits)
        template.checkFail.set(true);
        clicks.insert({
          'session': Session.get('Id'),
          'studentid': Session.get('student'),
          'element': 'stay-failed ' + this.id,
          'time': Date.now(),
          'action': 'reset_tolerate'
        })
      }
    }
    else {
      clicks.insert({
        'session': Session.get('Id'),
        'studentid': Session.get('student'),
        'element': 'stay-failed ' + this.id,
        'time': Date.now(),
        'action': 'already_failed'
      })
    }
  },

  "click .tolerate-course": function (event, template) {
    /**
     * if tolerated is checked
     * then do nothing
     * else
     *  check if you have enough credits
     *  update layout ( click tolerate, uncheck failed)
     *  take credits
     *  update boolean checkFail
     */
    if (template.checkFail.get()) {


      let creditsLeft = Session.get('toleranceCredits')
      let afterToleration = creditsLeft - this.credits;
      if (afterToleration >= 0) {
        template.$(".check-fail").css("color", "transparent");
        template.$(".stay-failed").css("opacity", "0.5");
        template.$(".check-tolerate").css("color", "white");
        template.$(".check-tolerate").css("background-color", "#81A8B8");
        template.$(".tolerate-course").css("opacity", "1");
        Session.set('toleranceCredits', afterToleration)
        // $('#tolerantiepunten').find("paper-progress").attr('value', afterToleration);
        // $('#tolerantiepunten').find("span").text(afterToleration);
        template.$(".top-bar").css("background-color", "#81A8B8");
        template.$(".course").css("border-color", "#81A8B8");
        template.$(".course").css("order", -1);
        template.$(".getolereerd").css("display", "flex");
        template.$(".try").css("display", "none");
        template.checkFail.set(false);
        updateSession(true, this.credits);
        clicks.insert({
          'session': Session.get('Id'),
          'studentid': Session.get('student'),
          'element': 'tolerate-course_' + this.id,
          'time': Date.now(),
          'action': 'tolerate'
        })

      }
      else {
        $('#tolerantiepunten').css("animation-play-state", "running");
        let x = document.getElementById('tolerantiepunten');
        x.addEventListener("webkitAnimationIteration", function () {
          $('#tolerantiepunten').css("animation-play-state", "paused");
        });
        clicks.insert({
          'session': Session.get('Id'),
          'studentid': Session.get('student'),
          'element': 'tolerate-course_' + this.id,
          'time': Date.now(),
          'action': 'no_credits'
        })

      }


    }
    else {
      clicks.insert({
        'session': Session.get('Id'),
        'studentid': Session.get('student'),
        'element': 'tolerate-course_' + this.id,
        'time': Date.now(),
        'action': 'already_tolerated'
      })

    }
  }
});

function updateSession(tolerate, credits) {
  let cses = Session.get('CSE_Planning');
  let currentCSE = cses.cse1;
  if (tolerate) {
    currentCSE += credits;
  }
  else {
    currentCSE -= credits;
  }
  //update cse-planning
  Session.set("CSE_Planning", {
    "cse1": currentCSE, "cse2": cses.cse2,
    "cse3": cses.cse3, "cse4": cses.cse4, "cse5": cses.cse5
  })
}

Template.failedCourse.onRendered(function () {
  $('#tolerantiepunten').find("paper-progress").css('width', '80%');
});
