Template.future.onRendered(function(){

  var instance = this;
  var profileColor = "green"
  // append student's profile background color
  $("#profilebox").css("background",profileColor);


  /** 
  * @param {svg} svg you want to add the profilefield
  * @param {string} backgroundColor of the background
  * @param {[int]} integers representing percentage of students who did their bachelor in 3-4 & 5 years
  */
  function makeProfileField(svg, backgroundColor, data){
    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', backgroundColor)
      .attr('class', 'backgroundProfile')
    ;
    var width = 150;
    var height = 150;
    var margin = 3;
    var nb3 = data[0];
    var nb4 = data[1];
    var nb5 = data[2];
    var nbNot = 100 - nb3 - nb4 - nb5;
    // var data = Array.apply(null, Array(100)).map(function (_, i) {return i;});
    
    var x = d3.scale.linear()
      .domain([0,9])
      .range([0,width]);

    var y = d3.scale.linear()
      .domain([0,10])
      .range([0,height]);

    function calculateClass(x){
      var profileClass = 'unknown';
      if (x < nb3){
        profileClass = 'topstudentbox';
      }
      else if ( x < nb3 + nb4){
        profileClass = 'middlestudentbox';
      }
      else if ( x < nb3 + nb4 + nb5){
        profileClass = 'lowstudentbox';
      }
      else {
        profileClass = 'badstudentbox';
      }      
      return profileClass;
    }    
    svg.selectAll('rect.profilebox')
      .data(d3.range(100))
      .enter()
      .append('rect')
      .attr('class', function(d){
        return calculateClass(d);
      })
      .attr('x', function (d){
        return x(d % 10) + margin;
      })
      .attr('y', function(d){
        return y(Math.floor( d / 10)) + margin;
      })

  }

  var topsvg = d3.select('#best');
  var middlesvg = d3.select('#middle')
  var lowsvg = d3.select('#low')
  
  makeProfileField( topsvg, 'white', [20,30,40]);
  makeProfileField( middlesvg, 'grey' , [20,30,40]);
  makeProfileField( lowsvg, 'purple' , [20,30,40]);
  

  //server function needs this guy's grades.
  this.autorun(function(){

    // $("#bachelor").empty();
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
