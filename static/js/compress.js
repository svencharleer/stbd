$(document).ready(function () {
	$('.fa-compress').click(function (event) {
		event.stopPropagation();
		let column = $(this).parent().parent();
		column.find('.vertical-title').css('display', 'block');
		let top = column.find('.top')[0];
		let bottom = column.find('.bottom')[0];
		compress(top);
		compress(bottom);

		column.css('min-width', '40px');
		column.css('max-width', '40px');

	})

	$('.flex-column').click(function (event) {
		var classTarget = $(event.target).attr('class');
		if(event.target === event.currentTarget || classTarget === "vertical-title"  ){
			let column = $(this);
			column.find('.vertical-title').css('display', 'none');
			let top = column.find('.top')[0];
			let bottom = column.find('.bottom')[0];
			compress(top);
			compress(bottom);

			column.css('min-width', '180px');
			column.css('max-width', '180px');
		}

	})
	
	$('.hider').click(function () {
		$('.rowtraject').css('display', 'none');
		$(this).css('display', 'none');
		$('.show').css('display', 'inline-block')
	})

	$('.show').click(function () {
		$('.rowtraject').css('display', 'flex');
		$(this).css('display', 'none')
		$('.hider').css('display', 'inline-block')
	})


})

function compress(element) {
	if (element.style.display ==='none'){
		element.style.display = 'flex';
	}
	else{
		element.style.display = 'none';
	}
}