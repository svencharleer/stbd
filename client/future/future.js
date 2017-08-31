Template.future.helpers({
  limit1: function(){
    return Session.get('limit1');
  }  ,

  limit2: function(){
    return Session.get('limit2');
  }

});



Template.future.onRendered(function(){

  var instance = this;
  var highProfile = false;
  var middleProfile = false;
  var lowProfile = false;

  /**
  * @param {svg} svg where you want to add the profilefield
  * @param {[int]} data representing percentage of students who did their bachelor in 3-4 & 5 years
  * @param {boolean} border true if it is the profile of the current student
  */
  function makeProfileField(svg, data, border){
    var width  = 150;
    var height = 150;
    var margin = 0;
    var nb3 = data[0];
    var nb4 = data[1];
    var nb5 = data[2];
    var nbNot = 100 - nb3 - nb4 - nb5;
    // var data = Array.apply(null, Array(100)).map(function (_, i) {return i;});
    var data = d3.range(100)
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

    function histogramTooltip(){
      var svg = tooltipLayer.append('svg'),
      margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = width - margin.left - margin.right,
      height = height - margin.top - margin.bottom;
      let xTooltip = d3.scale.linear().rangeRound([0,5]);
      let yTooltip = d3.scale.linear().rangeRound([height, 0]);
      let data = {'3': 10,'4': 11,'5': 20,'N': 19 }
      xTooltip.domain([0,5]);
      yTooltip.domain([0, d3.max(data, function(d) { return data[d]; })]);



    }

    function calculateTooltip(x){
      var text = ' ';
      if (x < nb3){
        text = nb3 + '%';
      }
      else if ( x < nb3 + nb4){
        text = nb4 + '%';
      }
      else if ( x < nb3 + nb4 + nb5){
        text = nb5 + '%';
      }
      else {
        text = nbNot + '%';
      }
      return text;
    }

    svg.attr("width",  width).attr("height", height)
      .on('mouseover', function(){
        console.log('svg mouseover');
        histogramTooltip()
      })
  
    if (border){
      svg.attr('class', 'fieldborder');
    }
    else(
      svg.attr('opacity', 0.6)
    )

    svg.selectAll('rect.profilebox')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', function(d){
      return calculateClass(d);
    })
    .attr('x', function (d){
      return x(d % 10);
    })
    .attr('y', function(d){
      return y(Math.floor( d / 10));
    })
    .attr('id', function(d){return d})
    .on('mouseover', function(d){
      var text = calculateTooltip(d);
      var cssClass = calculateClass(d) ;
      var tooltipColor = $("."+ cssClass).css('fill')
      // Highlight all
      svg.selectAll('.'+ cssClass)
      .attr('class', function(){
        var instance = d3.select(this);
        var currentClass = instance.attr('class');
        currentClass += ' selected';
        return currentClass;
      });
      //add tooltip
      tooltipLayer.transition()
      .duration(100)
      .style("opacity", .9);
      tooltipLayer.html(text)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px")
      .style('background-color', tooltipColor)
      ;
    })
    .on("mouseout", function(d) {
      var cssClass = calculateClass(d) ;
      var color = $('.'+cssClass).css('fill');
      var tooltipColor = $('.' + cssClass).css('fill')

      svg.selectAll('.'+ cssClass + '.selected')
      .attr('class', cssClass);

      tooltipLayer.transition()
      .duration(300)
      .style("opacity", 0);
    });
  };


  let legendsvg = d3.select('#profile');
  let topsvg = d3.select('#best');
  let middlesvg = d3.select('#middle')
  let lowsvg = d3.select('#low')
  // Define the div for the tooltip
  let tooltipLayer = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);



  //server function needs this guy's grades.
  this.autorun(function(){
    Meteor.call("getCSEProfile", Session.get('student'), Session.get('semester'), function(err, profile){
      [highProfile, middleProfile, lowProfile] = profile;
    }),

    Meteor.call("getCSEDistribution", Session.get('semester'), function(err,listDicts){
      [topDict, middleDict, lowDict] = listDicts;
      topCSEDistribution = [topDict['+0'], topDict['+1'], topDict['+2']]
      middleCSEDistribution = [middleDict['+0'], middleDict['+1'], middleDict['+2']]
      lowCSEDistribution = [lowDict['+0'], lowDict['+1'], lowDict['+2']]

      makeProfileField( topsvg,  topCSEDistribution, highProfile);
      makeProfileField( middlesvg,  middleCSEDistribution, middleProfile);
      makeProfileField( lowsvg,  lowCSEDistribution, lowProfile);
    }),


    // $("#bachelor").empty();
    Meteor.call("getHistoricalData", Session.get("student"),function(err,data){

      var bachelor = {};
      var total = 0;
      bachelor = {"+0":0,"+1":0,"+2":0,"B":0,"D":0}
      data.forEach(function(d){
        bachelor[d._id] = d.Count;
        if(d._id != "") total+= d.Count;
      })
    });
  })





})
