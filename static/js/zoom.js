$(document).ready(function () {
	$('.course').click(function () {
		course = $(this);
		if (course.hasClass('zoomed')){
			course.removeClass('zoomed')
			course.css("transform","scale(1)")
			course.css("z-index","1")

		}
		else{
			course.addClass('zoomed')
			course.css("transform","scale(1.5)");
			course.css("z-index","1000")
		}

	})
	
})