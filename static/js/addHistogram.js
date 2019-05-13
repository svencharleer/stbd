
$(document).ready(function(){
	$(".top-bar").click(function () {
		event.stopPropagation();

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



	courses = [
		'ijkingstoets_juli_', 'ijkingstoets_september_',
		'TTTScheik_0','TTTAlg_0',
		'H01A8A_1', 'H01A0B_1', 'H01B9A_1', 'H01A4A_1',  'H01B0A_1', 'H01C4B_1',
		'H01B2B_2', 'H01A2A_2', 'H01Z2A_2', 'H01D0A_2', 'H01B6B_2', 'H01C2A_2', 'H01B4B_2',
		'H01A8A_3', 'H01A0B_3', 'H01B0A_3', 'H01C4B_3', 'H01B2B_3', 'H01A2A_3', 'H01Z2A_3', 'H01D0A_3', 'H01B4B_3'
	];
	histograms = {
		'ijkingstoets_juli_': [1,2,5,6,5,8,2,0,3,2,5,6,9,8,5,4,2,3,1,1],
		'ijkingstoets_september_': [0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'TTTScheik_0': [0,2,3,2,5,6,2,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'TTTAlg_0': [0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01A8A_1': [0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01A0B_1': [0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01B9A_1': [0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01A4A_1': [0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01B0A_1': [0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01C4B_1': [0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01B2B_2':[0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01A2A_2': [0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01Z2A_2':[0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01D0A_2':[0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01B6B_2':[0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01C2A_2':[0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01B4B_2':[0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01A8A_3':[0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01A0B_3':[0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01B0A_3':[0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01C4B_3':[0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01B2B_3':[0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01A2A_3':[0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01Z2A_3':[0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01D0A_3':[0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1],
		'H01B4B_3':[0,2,3,2,5,1,5,6,4,5,6,5,8,9,8,7,5,6,2,3,1]

	};

	ownScores = {
		'ijkingstoets_juli_': 11,
		'ijkingstoets_september_': 1,
		'TTTScheik_0': 5,
		'TTTAlg_0': 8,
		'H01A8A_1': 7, 'H01A0B_1': 7, 'H01B9A_1': 12, 'H01A4A_1':11,  'H01B0A_1':3, 'H01C4B_1':6,
		'H01B2B_2':6, 'H01A2A_2':2, 'H01Z2A_2':7, 'H01D0A_2':6, 'H01B6B_2':12, 'H01C2A_2':12, 'H01B4B_2':5,
		'H01A8A_3':12, 'H01A0B_3':12, 'H01B0A_3':'NA', 'H01C4B_3':12, 'H01B2B_3':11, 'H01A2A_3':4, 'H01Z2A_3':14, 'H01D0A_3':4, 'H01B4B_3':8


	};


	courses.forEach(function (course) {
		let histogramData = histograms[course];
		let ownScore = ownScores[course];
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
				if (ownScore < 8) color = "#ff8a80"; //failed
				else if (ownScore > 9) color = "#a5d6a7"; //passed
				else if (ownScore >= 8 && ownScore <= 9) color = "#ffcc80"; //tolerable
				else color = "#ff8a80"; //failed
			}
			return color;
		});

}

