Template.trajectory.helpers({
  periods() {
    return [{
      period: this.period,
      semester: this.semester
    }];
  },
  update() {
    //console.log("updating");
    var background = $("#trajectory-bg");
    var ijkingstoets = $("#distribution_ijkingstoets")
    var tussentijdsetoets = $("#distribution_TTT");
    var januari = $("#distribution_januari");
    var juni = $("#distribution_juni");
    var september = $("#distribution_september");
    var periods = [ijkingstoets, tussentijdsetoets, januari];
    if (Meteor.settings.public.showJuni == true) {
      periods.push(juni)
    }
    if (Meteor.settings.public.showSeptember == true) {
      periods.push(september)
    }
    if (Meteor.settings.public.showJuni == true) {
      periods.push(juni)
    }
    if (Meteor.settings.public.showSeptember == true) {
      periods.push(september)
    }
    var canvas = $("#trajectory-overlay")
      .attr("width", background.width())
      .attr("height", background.height());

    var cses = [Session.get("CSE_ijkingstoets"), Session.get("CSE_TTT"), Session.get("CSE_januari"), Session.get("CSE_juni"), Session.get("CSE_september")];
    if (canvas.get()[0] == undefined) return;

    var buckets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    var csebuckets = [0, 0, 0, 0];
    cses.some(function (c, i) {
      buckets.some(function (b) {
        if (b == 9) {
          if (c >= b * 10 && c <= (b + 1) * 10)
            csebuckets[i] = b;
        }
        else if (c >= b * 10 && c < (b + 1) * 10)
          csebuckets[i] = b;
      })
    })
  }
});

Template.trajectory.events({
  'click h2': function (event, template) {
    if (template.$(".hider").hasClass("fa-chevron-up")) {
      template.$(".rowtraject").css("min-height", "0px");
      template.$(".rowtraject").css("max-height", "0px");
      template.$(".hider").removeClass("fa-chevron-up").addClass("fa-chevron-down");


    } else if (template.$(".hider").hasClass("fa-chevron-down")) {
      template.$(".rowtraject").css("max-height", "104px");
      template.$(".rowtraject").css("min-height", "104px");
      template.$(".hider").removeClass("fa-chevron-down").addClass("fa-chevron-up");


    }
  },
});
