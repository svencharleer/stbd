Template.future.helpers({
  limit1: function () {
    return Math.round(Session.get('limit1'));
  },

  limit2: function () {
    return Math.round(Session.get('limit2'));
  }

});


Template.future.onRendered(function () {

  var instance = this;
  var highProfile = false;
  var middleProfile = false;
  var lowProfile = false;

  /**
   * @param {svg} svg where you want to add the profilefield
   * @param {[int]} numbers representing percentage of students who did their bachelor in 3-4 & 5 years
   * @param {boolean} border true if it is the profile of the current student
   */
  function makeProfileField(svg, numbers, border) {
    var width = 150;
    var height = 150;
    var margin = 3;
    var nb3 = numbers[0];
    var nb4 = numbers[1];
    var nb5 = numbers[2];
    var nbNot = 100 - nb3 - nb4 - nb5;
    let yValues = [nb3, nb4, nb5, nbNot];
    var data = d3.range(100);
    var x = d3.scale.linear()
      .domain([0, 10])
      .range([0, width]);

    var y = d3.scale.linear()
      .domain([0, 10])
      .range([0, height]);

    function calculateClass(x) {
      var profileClass = 'unknown';
      if (x < nb3) {
        profileClass = 'topstudent box';
      }
      else if (x < nb3 + nb4) {
        profileClass = 'middlestudent box';
      }
      else if (x < nb3 + nb4 + nb5) {
        profileClass = 'lowstudent box';
      }
      else {
        profileClass = 'badstudent box';
      }
      return profileClass;
    }

    function calculateBarClass(i) {
      var tooltipClass = 'unknown';
      if (i == 0) {
        tooltipClass = "topstudent bar";
      }
      else if (i == 1) {
        tooltipClass = "middlestudent bar";
      }
      else if (i == 2) {
        tooltipClass = "lowstudent bar";
      }
      else if (i == 3) {
        tooltipClass = "badstudent bar";
      }
      return tooltipClass;
    }

    function barchartProfiles(svg, yValues) {
      let xValues = ['3 jaar', '4 jaar', '5 jaar', 'Niet']
      // svg.style('opacity', 0)
      let y = d3.scale.linear()
        .range([height, 0]);

      let chart = svg.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'tooltipHistogram')
        .attr('id', 'tooltipHistogram')
        .style('opacity', 1)
      ;
      y.domain([0, 100]);
      var barWidth = width / 4;
      let xPosition = 0;

      let bar = chart.selectAll("g")
        .data(function () {
          let sample = [];
          for (let i = 0; i <= 3; i++) sample.push({bachelor: xValues[i], value: yValues[i]});
          return sample;
        })
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
          return "translate(" + i * barWidth + ",0)";
        });

      bar.append("rect")
        .attr('class', function (d, i) {
          return calculateBarClass(i)
        })
        .attr("y", function (d) {
          return y(d.value);
        })
        .attr("height", function (d) {
          return height - y(d.value);
        })
        .attr("width", barWidth - 1);

      bar.append("text")
        .attr("x", barWidth / 2)
        .attr("y", function (d) {
          return y(d.value) - 10;
        })
        .attr("dy", ".75em")
        .attr('class', 'tooltipText')
        .text(function (d) {
          return d.value + '%';
        });
    }



    svg.attr("width", width)
      .attr("height", height)
      .on('mouseenter', function () {
        svg.selectAll(".box").style('opacity', 0)
        barchartProfiles(svg, yValues)

      })
      .on('mouseleave', function () {
        svg.selectAll(".box").style('opacity', 1)
        svg.selectAll('.tooltipHistogram').remove();


      })
      .on('click', function () {

      })

    if (border) {
      svg.attr('class', 'fieldborder');
    }
    else (
      svg.attr('opacity', 0.6)
    )

    svg.selectAll('rect.profilebox')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', function (d) {
        return calculateClass(d);
      })
      .attr('x', function (d) {
        return x(d % 10) + margin;
      })
      .attr('y', function (d) {
        return y(Math.floor(d / 10)) + margin;
      })
      .attr('id', function (d) {
        return d
      })
  };


  let topsvg = d3.select('#best');
  let middlesvg = d3.select('#middle');
  let lowsvg = d3.select('#low');


  //server function needs this guy's grades.
  this.autorun(function () {
    if (Session.get('student') == undefined || Session.get('semesterString') == undefined) {
      return;
    }
    /**
     * Get the profile of the student
     * [{boolean}]
     */
    Meteor.call("getCSEProfile", Session.get('student'), Session.get('semester'), Session.get('limit1'), Session.get('limit2'), function (err, profile) {
      [highProfile, middleProfile, lowProfile] = profile;
    });

    /**
     * Get for each profile the number of students in each of the categories
     * e.g. {+0: 85, +1: 6, +2: 2, B: 1, D: 6}
     */
    Meteor.call("getHistoricDistribution", Session.get('program'), Session.get("semesterString"), Session.get('limit1'), Session.get('limit2'), function (err, listDicts) {
      [topDict, middleDict, lowDict] = listDicts;
      console.log(listDicts)
      //Make list of dictionary
      topCSEDistribution = [topDict['0'], topDict['1'], topDict['2']];
      middleCSEDistribution = [middleDict['0'], middleDict['1'], middleDict['2']];
      lowCSEDistribution = [lowDict['0'], lowDict['1'], lowDict['2']];
      //make the fields
      makeProfileField(topsvg, topCSEDistribution, highProfile);
      makeProfileField(middlesvg, middleCSEDistribution, middleProfile);
      makeProfileField(lowsvg, lowCSEDistribution, lowProfile);
    });

  })


})
