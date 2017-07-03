
Template.trajectoryperiod.onRendered(function(){
  var instance = this;
  instance.autorun(function(){
    var period = instance.data.period;
    var cse = Session.get("CSE_"+period);
    var svg = d3.select("#distribution_"+period+" svg.distribution");
    var params = [];

    if(period == "ijkingstoets")
    {
      params = ["getIjkingstoetsTotalDistribution", [Session.get("StartYear")]];
    }
    else if(period == "TTT")
      params = ["getTotalPointDistribution", [0, Session.get("Year")]];
    else {
      params = ["getSemesterDistribution", [period, Session.get("Year")]];
    }
    Meteor.call(params[0], params[1], function(err,data){
      //we calculate CSE for TTT on server (as all the logic is already there), so check whether we got that
      if(data.studentScore != undefined)
      {
        cse = data.studentScore;
        Session.set("CSE_"+period,cse);
        //console.log("this is student's TTT CSE " + cse);
      }
      //find max value and min value
      var min = Number.MAX_VALUE;
      var max = Number.MIN_VALUE;
      var count = 0;
      data.distribution.forEach(function(d){
        if(d.count > max)
          max = d.count;
        if(d.count < min)
          min = d.count;
        count += d.count;
      })
      var width = 195;
      var rects = svg.selectAll("rect")
                  .data(data.distribution);

      rects.transition()
        .delay(3000)
        .attr("fill",function(d){
          if(d.bucket == 9)
          {
            if(cse >= d.bucket * 10 && cse <= (d.bucket+1) * 10)
              return "black";
            else
              return "#CAE9FE";
          }
          if(cse >= d.bucket * 10 && cse < (d.bucket+1) * 10)
            return "black";
          else
            return "#CAE9FE";
        })
        .attr("x", function(d){
          return (-.5)*(d.count/(max-min)) * width/3;
        })
        .attr("width", function(d){
          //console.log(d.count, max, min);
          return (d.count/(max-min)) * width/3;
        });


    })
  })
})
