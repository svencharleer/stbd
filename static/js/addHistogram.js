
$(document).ready(function(){
	console.log('ready')
	$(".top-bar").click(function () {
		let course = $(this).parent().parent();
		let courseBottomQuery = $('.course-bottom');
		let courseBottom = course.find(courseBottomQuery);
		if (courseBottom.hasClass('open')){
			courseBottom.removeClass('open')
		}
		else{
			courseBottom.addClass('open')
		}
	})



	courses = ['ijkingstoets_juli_', 'ijkingstoets_september_'];
	histograms = {
		'ijkingstoets_juli_': [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
		'ijkingstoets_september_': [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
	}

	ownScores = {
		'ijkingstoets_juli_': 5,
		'ijkingstoets_september_': 9
	}


	courses.forEach(function (course) {
		let histogramData = histograms[course];
		let ownScore = ownScores[course]
		addHistogram(ownScore, histogramData, course)
	})




});

function addHistogram(ownScore, histogramData, course) {
	let height = 60;
// 	let courseElement = d3.select('#' + course);
// 	let svgQuery = $('.histogram')
// 	let svg = courseElement.find(svgQuery);
	let graph = d3.select('#' + course).selectAll(".dots-container");
	graph.selectAll(".dot")
		.data(histogramData)
		.enter()
		.append("rect")
		.attr("class", "dot")
		.attr("width", 4)
		.attr("height", function (d) {
			return d * 2
		})
		.attr("x", function (d, i) {
			return i * 7;
		})
		.attr("y", function (d, i) {
			return height - (d*2);
		})
		.attr("fill", function (d, i) {
			let color = "#c2cbce";
			if (i == ownScore) {
				if (d < 8) color = "#ff8a80"; //failed
				else if (d > 9) color = "#a5d6a7"; //passed
				else if (d >= 8 && d <= 9) color = "#ffcc80"; //tolerable
				else color = "#ff8a80"; //failed
			}
			return color;
		});

}

