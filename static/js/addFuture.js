
$(document).ready(function(){
	addUnitCharts()
})




function addUnitCharts() {
	var highProfile = false;
	var middleProfile = true;
	var lowProfile = false;
	let topsvg = d3.select('#best');
	let middlesvg = d3.select('#middle');
	let lowsvg = d3.select('#low');


	//Make list of dictionary
	topCSEDistribution = [91,3,1];
	middleCSEDistribution = [65,19,4];
	lowCSEDistribution = [7,11,5];
	//make the fields
	makeProfileField(topsvg, topCSEDistribution, highProfile);
	makeProfileField(middlesvg, middleCSEDistribution, middleProfile);
	makeProfileField(lowsvg, lowCSEDistribution, lowProfile);

}


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
		.attr('width', '8px')
		.attr('height', '8px')
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


