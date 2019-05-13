

let x_positions = {
	1: [90],
	2: [85,95],
	3: [80,90,100],
	4: [75,85,95,105],
	5: [70,80,90,100,110],
	6: [65,75,85,95,105,115],
	7: [60,70,80,90,100,110,120],
	8: [55,65,75,85,95,105,115,125],
	9: [50,60,70,80,90,100,110,120,130],
	10:[45,55,65,75,85,95,105,115,125,135],
	11:[40,50,60,70,80,90,100,110,120,130,140],
	12:[35,45,55,65,75,85,95,105,115,125,135,145],
	13:[30,40,50,60,70,80,90,100,110,120,130,140,150],
	14:[25,35,45,55,65,75,85,95,105,115,125,135,145,155],
	15:[20,30,40,50,60,70,80,90,100,110,120,130,140,150,160],
	16:[15,25,35,45,55,65,75,85,95,105,115,125,135,145,155,165],



};

let dataCircles1 = generateData([3,4,10,11,16,3,1,1,0,0]);
let dataCircles2 = generateData([2,1,5,8,9,7,2,4,2,1]);
let dataCircles3 = generateData([7,6,2 ,7 ,2 ,7,4,5,8,3]);
let dataCircles4 = generateData([5,4,4,4,5,5,5,4,5,4]);
let dataCircles5 = generateData([12,5,4,4,4,4,2,3,5,3]);




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
		.attr('cx', function(d,i) {

			return d.x
		})
		.attr('cy', function(d) {return (d.y * 10) - 2})
		.attr('r', 3.5)
		.attr('fill','#C2CBCE')
}

distributions.forEach(function (distribution) {
	appendDistribution(distribution.name, distribution.data)
})

function generateData(distribution) {
	let data = [];
	for (let i = 0; i < 11 ; i++){
		nb = distribution[i];
		let x_list = x_positions[nb];
		for (let j = 0; j < nb; j++){
			let x = x_list[j];
			data.push({x:x , y: i +1 })
		}
	}
	return data

}



