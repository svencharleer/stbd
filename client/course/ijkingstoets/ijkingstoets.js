

Template.ijkingstoets.onCreated(function(){
  let instance = this;
  let bar = "#CBCBCB";
  let barSelect = "#020202";
  instance.autorun(function(){
    Session.get("student");
    let handler = instance.subscribe("generic_courses",function(){});
    let handler2 = instance.subscribe("generic_grades",Session.get("student"));;
    if(handler.ready() && handler2.ready()){
      let period  = instance.data.id;
      let studentGrade = instance.data.grade;
      let svg = d3.select("#"+period+"_");
      let graph = svg.select("g").selectAll("rect");
      let courseId = period;
      Meteor.call("getIjkingstoetsPointDistribution", [Session.get("StartYear")], function(err,data){
        if(courseId == "ijkingstoets_juli")
        data = data[0];
        else if(courseId == "ijkingstoets_september")
        data = data[1];
        else return;

        let svg = d3.select(instance.find("svg"));
        let grades = data.numberPerGrades;
        let total = 0;
        for(let i = 0; i < grades.length; i++)  total += grades[i].count;

        let width = 140;
        let height = 60;

        let graph = svg.selectAll(".dots-container");

        graph.selectAll(".dot")
        .data(function(d,i){
          let count = 0;
          let grade = 0;

          if (grades[i] != undefined) count = grades[i].count;
          if (grades[i] != undefined) grade = grades[i].grade;

          let dots = Math.round(((50 * count)/total));
          if(dots > 10) dots = 0;
          let list = [];
          for (let a = 0; a<=dots; a++) {
            list.push({"grade": grade});
          }
          return list;
        })
        .enter()
        .append("circle")
        .attr("class","dot")
        .attr("r", 2)
        .attr("cx",function(d,i){
          return d.grade * 7;
        })
        .attr("cy",function(d,i){
          return (height-3) - (i*5);
        })
        .attr("fill", function(d,i){
            let color = "#c2cbce";
            if(d.grade == studentGrade) {
              if(d.grade < 8) color = "#81a8b8"; //failed
              else if(d.grade > 9) color = "#81a8b8"; //passed
              else if(d.grade >= 8 && d.grade <= 9) color = "#81a8b8"; //tolerable
              else color = "#81a8b8"; //failed
            }
            return color;
        });

        // 1 -> 7 pixels
        svg.selectAll(".redbars").data(function(){
          return d3.range(8);
        })
        .enter()
        .append("rect") // < 8 Failed
        .attr("stroke","#ff8a80")
        .attr("fill","#ff8a80")
        .attr("width",4)
        .attr("height",1)
        .attr("transform", function(d,i){
          return "translate("+((i*7)-2)+","+height+")";  // Starts from 0, always.
        })
        .attr("class","redbars");

        svg.selectAll(".yellowbars").data(function(){
            return d3.range(2);
        })
        .enter()
        .append("rect") // 8-9 Tolerated
        .attr("stroke","#ffcc80")
        .attr("fill","#ffcc80")
        .attr("width", 4) // between 8 and 9 is 10% of total width.
        .attr("height", 1)
        .attr("transform", function(d,i){
          return "translate("+(((7+i)*7)-2)+","+height+")";  // Starts from 0, always.
        })
        .attr("class","yellowbars")

        svg.selectAll(".greenbars").data(function(){
            return d3.range(12);
        })
        .enter()
        .append("rect") // > 9 Pass 45% of histogram width.
        .attr("stroke","#a5d6a7")
        .attr("fill","#a5d6a7")
        .attr("width", 4)
        .attr("height",1)
        .attr("transform", function(d,i){
          return "translate("+(((i+9)*7)-2)+","+height+")";  // Starts from 0, always.
        })
        .attr("class","greenbars");

      });
    }
  })
});
