Template.trajectoryperiod.onRendered(function(){
  var instance = this;
  instance.autorun(function(){
    var period = instance.data.period;
    var cse = Session.get("CSE_"+period);
    var svg = d3.select("#distribution_"+period+" svg.distribution");
    var params = [];
    if(period == "ijkingstoets") {
      params = ["getIjkingstoetsTotalDistribution", [Session.get("StartYear")]];
    }
    else if(period == "TTT")
    params = ["getTotalPointDistribution", [0, Session.get("Year")]];
    else {
      params = ["getSemesterDistribution", [period, Session.get("Year")]];
    }

    Meteor.call(params[0], params[1], function(err,data){
      //we calculate CSE for TTT on server (as all the logic is already there), so check whether we got that
      if(data.studentScore != undefined) {
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
      });
      /*
      Visualisation of Square Plot (50);
      */
      let total = count;
      let width = 190;
      let container = svg.selectAll(".figures")
      .data(data.distribution).enter();

      let trace = container.append("rect")
      .attr("class",function(d){
        return "trace trace" + d.bucket;
      })
      .attr("fill", function(d){
        //console.log(d.bucket +"---" + cse + "---" + period);
        let current = d.bucket * 10;
        let next  = current + 11;
        let color = "white";
        // if(_.isNaN(cse)) color = "white";
        // if(_.isUndefined(cse)) color = "white";
        if(cse == 0) cse = 1;
        if((current < cse) && (cse < next)) color = "#E8F3F8";
        return color;
      })
      .attr("width", "100%")
      .attr("height",8)
      .attr("x", "0")
      .attr("y", function(d,i){
        return 98 - ((d.bucket *10) + 6);
      });

      let circles = container.append("g")
      .attr("class","row")
      .selectAll("circle")
      .data(function(d){return d3.range(Math.round(((50 * d.count)/total)))})
      .enter()
      .append("circle")
      .attr("fill", function(d){
        if(_.isNaN(cse)) cse = 1;
        if(_.isUndefined(cse)) cse = 1;
        if(cse == 0) cse = 1;
        let pbucket = d3.select(this.parentNode).datum().bucket;
        let current = pbucket * 10;
        let next = current + 11;
        if((current < cse) && (cse < next))
        return "#81A8B8"; else return "#C2CBCE";
      })
      .attr("stroke","none")
      .attr("r", 3)
      .attr("cx", function(d){
        return (width/2);
      })
      .attr("cy", function(d,i){
        return 98 - ((d3.select(this.parentNode).datum().bucket *10) + 3);
      })
      .transition()
      .duration(1000)
      .ease("exp")
      .attr("cx", function(d,i){
        let parent = d3.select(this.parentNode).datum().count;
        let start  = (Math.round(((50 * parent)/total)) * 10) + 4;
        return ((width/2) + (i*10)) - start/2;
      });


      // svg.selectAll("rect").data(data.distribution)
      // .transition()
      // .delay(500)
      // .attr("fill",function(d){
      //   if(d.bucket == 9) {
      //     if(cse >= d.bucket * 10 && cse <= (d.bucket+1) * 10)
      //     return "#212121"; // Dark Color
      //     else
      //     return "#b3e5fc";
      //   }
      //   if(cse >= d.bucket * 10 && cse < (d.bucket+1) * 10)
      //   return "#212121"; // Dark Color
      //   else
      //   return "#b3e5fc";
      // })
      // .attr("x", function(d){
      //   return (-.5)*(d.count/(max-min)) * width/3;
      // })
      // .attr("width", function(d){
      //   return (d.count/(max-min)) * width/3;
      // });

    })
  })
});
