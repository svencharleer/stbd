import {ReactiveVar} from 'meteor/reactive-var'

Template.failedCourse.onCreated(function () {
  this.showTolerance = new ReactiveVar(false);
  this.checkFail = new ReactiveVar(true);
});


Template.failedCourse.helpers({
  color: function () {
    let color = "white"; //"#ef9a9a";
    if (this.Score < 8) color = "failed" //"#ff8a80"; //failed
    else if (this.Score > 9) color = "passed" //"#a5d6a7"; //passed
    else if (this.Score >= 8 && this.Score <= 9) color = "tolerable"; // "#ffcc80"; //tolerable
    else color = "failed"; // "#ff8a80"; //failed
    return color;
  },
  try1: function () {
    if ( this.Academischeperiode === "Eerste Semester"){
      return parseInt(this.Scorejanuari)
    }
    else if ( this.Academischeperiode === "Tweede Semester"){
	    return parseInt(this.Scorejuni)
    }
    else if (this.Academischeperiode === "Academiejaar"){
      if (this.Scorejanuari === "#"){
        return parseInt(this.Scorejuni)
      }
      else{
        return parseInt(this.Scorejanuari)
      }
    }
  },
  try2: function () {
    return this.Scoreseptember
  },

  bold: function (try1, try2) {
    let bold = "bold";
    if (try1 < try2) bold = "notbold";
    return {"grade": try1, "bold": bold};
  },
  /**
   * Check if current CSE >= 50
   * otherwise you cannot tolerate
   * @return {String} : "cannotTolerate" of "canTolerate"
   */
  canTolerate: function () {
    if (this.CSE < 50) {
      return "cannotTolerate"
    }
    else {
      return "canTolerate";
    }
  }

});



Template.failedCourse.events({
  "click .course-top.tolerable.canTolerate": function (event, template) {
    if (!template.showTolerance.get()) {
      template.$(".course-bottom").css("max-height", "48px");
      template.$(".top-bar").css("box-shadow", "1px 1px 5px gainsboro");
      template.showTolerance.set(true);

    } else {
      template.$(".course-bottom").css("max-height", "0px");
      template.$(".top-bar").css("box-shadow", "0px 0px 0px gainsboro");
      template.$(".course").css("box-shadow", "0px 0px 0px gainsboro");
      template.$(".course").css("transform", "scale(1)");
      template.$(".course").css("z-index", "0");
      template.showTolerance.set(false);


    }
  },

  "click .course-top.tolerable.cannotTolerate": function (event, template) {
    $('#CSE_sept').css("animation-play-state", "running");
    let x = document.getElementById('CSE_sept');
    x.addEventListener("webkitAnimationIteration", function () {
      $('#CSE_sept').css("animation-play-state", "paused");
    });

  },

  "click .course-top.failed": function (event, template) {

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
      let creditsLeft = Session.get('toleranceCredits');
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

      }
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
      let afterToleration = creditsLeft - this.Studiepunten;
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


      }
      else {
        $('#tolerantiepunten').css("animation-play-state", "running");
        let x = document.getElementById('tolerantiepunten');
        x.addEventListener("webkitAnimationIteration", function () {
          $('#tolerantiepunten').css("animation-play-state", "paused");
        });


      }


    }
    else {


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
