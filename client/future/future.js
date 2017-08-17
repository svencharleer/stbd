Template.future.onRendered(function(){

  var instance = this;
  
  // append student's profile

  //server function needs this guy's grades.

  






  this.autorun(function(){

    $("#bachelor").empty();
    Meteor.call("getHistoricalData", Session.get("student"),function(err,data){

      var bachelor = {};
      var total = 0;
      bachelor = {"+0":0,"+1":0,"+2":0,"B":0,"D":0}
      data.forEach(function(d){
        bachelor[d._id] = d.Count;
        if(d._id != "") total+= d.Count;
      })
      //console.log(bachelor);

      var svg = d3.select("#bachelor");
      var height = 500;
      svg.attr("height",height);
      svg.attr("width", 100)

      svg.append("rect")
      .attr("fill","#b2daea")
      .attr("width",20 )
      .attr("height",height * bachelor["+0"]/total )
      .attr("transform","translate(0,0)");

      svg.append("text")
      .attr("fill","#b2daea")
      .attr("transform","translate(22,"+ (5 + height/2 * bachelor["+0"]/total) +")")
      .text("3J/" + Math.round(100* bachelor["+0"]/total) + "%");


      svg.append("rect")
      .attr("fill","#81a8b8")
      .attr("width",20)
      .attr("height",height * bachelor["+1"]/total )
      .attr("transform","translate(0,"+ height * bachelor["+0"]/total +")");

      svg.append("text")
      .attr("fill","#81a8b8")
      .attr("transform","translate(22,"+ (5+ height * (bachelor["+0"]/total+(bachelor["+1"]/total)/2))+")")
      .text("4J/" + Math.round(100* bachelor["+1"]/total) + "%");

      svg.append("rect")
      .attr("fill","#537988")
      .attr("width",20)
      .attr("height",height * bachelor["+2"]/total )
      .attr("transform","translate(0,"+ height * (bachelor["+0"]/total+bachelor["+1"]/total) +")");

      svg.append("text")
      .attr("fill","#537988")
      .attr("transform","translate(22,"+ (5 + height * (bachelor["+0"]/total+bachelor["+1"]/total+(bachelor["+2"]/total)/2))+")")
      .text("5J/" + Math.round(100* bachelor["+2"]/total) + "%");

      svg.append("rect")
      .attr("fill","black")
      .attr("width",20)
      .attr("height",height * (bachelor["B"]+bachelor["D"])/total )
      .attr("transform","translate(0,"+ height * (bachelor["+0"]/total+bachelor["+1"]/total+bachelor["+2"]/total) +")");

      svg.append("text")
      .attr("fill","black")
      .attr("transform","translate(22,"+ (5 + height * (bachelor["+0"]/total+bachelor["+1"]/total+bachelor["+2"]/total+((bachelor["B"]+bachelor["D"])/total)/2))+")")
      .text("NIET/" + Math.round(100* (bachelor["B"]+bachelor["D"])/total) + "%");

    });
  })





})
