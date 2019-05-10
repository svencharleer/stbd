
let dataCircles1 = [
	{x:90 , y: 1},
	{x:90 , y: 2},
	{x:80 , y: 3},	{x:90 , y: 3},{x:100 , y: 3},
	{x:90 , y: 4},
	{x:90 , y: 5},
	{x:90 , y: 6},
	{x:80 , y: 6}, {x:90 , y: 6},{x: 100 , y: 6},
	{x:90 , y: 7},
	{x:90 , y: 8},
	{x:90 , y: 9},
]
let dataCircles2 = [
	{x:90 , y: 1},
	{x:90 , y: 2},
	{x:80 , y: 3},	{x:90 , y: 3},{x:100 , y: 3},
	{x:90 , y: 4},
	{x:90 , y: 5},
	{x:90 , y: 6},
	{x:80 , y: 6}, {x:90 , y: 6},{x: 100 , y: 6},
	{x:90 , y: 7},
	{x:90 , y: 8},
	{x:90 , y: 9},
]
let dataCircles3 = [
	{x:90 , y: 1},
	{x:90 , y: 2},
	{x:80 , y: 3},	{x:90 , y: 3},{x:100 , y: 3},
	{x:90 , y: 4},
	{x:90 , y: 5},
	{x:90 , y: 6},
	{x:80 , y: 6}, {x:90 , y: 6},{x: 100 , y: 6},
	{x:90 , y: 7},
	{x:90 , y: 8},
	{x:90 , y: 9},
]
let dataCircles4 = [
	{x:90 , y: 1},
	{x:90 , y: 2},
	{x:80 , y: 3},	{x:90 , y: 3},{x:100 , y: 3},
	{x:90 , y: 4},
	{x:90 , y: 5},
	{x:90 , y: 6},
	{x:80 , y: 6}, {x:90 , y: 6},{x: 100 , y: 6},
	{x:90 , y: 7},
	{x:90 , y: 8},
	{x:90 , y: 9},
]
let dataCircles5 = [
	{x:90 , y: 1},
	{x:90 , y: 2},
	{x:80 , y: 3},	{x:90 , y: 3},{x:100 , y: 3},
	{x:90 , y: 4},
	{x:90 , y: 5},
	{x:90 , y: 6},
	{x:80 , y: 6}, {x:90 , y: 6},{x: 100 , y: 6},
	{x:90 , y: 7},
	{x:90 , y: 8},
	{x:90 , y: 9},
]

let distributions = [
	{name:'distribution_ijkingstoets', data: dataCircles1},
	{name:'distribution_TTT', data: dataCircles2},
	{name:'distribution_januari', data: dataCircles3},
	{name:'distribution_juni', data: dataCircles4},
	{name:'distribution_september', data : dataCircles5}
];

function appendDistribution(id, data) {
	let svg = d3.select('#' + id + '_svg');
	let circles = svg.selectAll('circle')
		.data(data)
		.enter()
		.append('circle');

	circles
		.attr('cx', function(d) {return d.x})
		.attr('cy', function(d) {return (d.y * 10) - 2})
		.attr('r', 4)
		.attr('fill','#C2CBCE')
}

distributions.forEach(function (distribution) {
	appendDistribution(distribution.name, distribution.data)
})

