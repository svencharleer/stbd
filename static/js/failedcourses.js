function changeToleranceCredits(value) {
  currentValue = parseInt($('#tolerantiepuntenValue').html());
  newValue = currentValue + value;
  console.log(value)
  console.log(currentValue)
  console.log(newValue)
  widthBar = newValue * 120 / 12;
  $('#tolerantiepuntenBar').width(widthBar);
  $('#tolerantiepuntenValue').html(newValue);
  
}

$(document).ready(function () {
  $('.tolerate-course').click(function () {
    var courseId = this.id.split('_')[1];
    var courseDiv = $('#' + courseId + '_failed');
    courseDiv.find('.check-tolerate').css('color', 'white');
    courseDiv.find('.check-fail').css('color', 'transparent');
    courseDiv.find('.tolerate-course').css('opacity', 1);
    courseDiv.find('.stay-failed').css('opacity', 0.3);
    var topBar = courseDiv.find('.top-bar');
    topBar.removeClass('tolerable');
    topBar.addClass('tolerated');
    courseDiv.removeClass('tolerable');
    courseDiv.addClass('tolerated');
    //  change credits
    currentCredits = parseInt(slider1.value);
    if (courseId == "H01B2B"){
      slider1.value = currentCredits + 6;
      output1.innerHTML = currentCredits + 6;
      changeToleranceCredits(-6)
  
    }
    else{
      slider1.value = currentCredits + 4;
      output1.innerHTML = currentCredits + 4;
      changeToleranceCredits(-4)
  
    }
    changeBachelorCredits()
    
  
  })
  
  $('.stay-failed').click(function () {
    var courseId = this.id.split('_')[1];
    var courseDiv = $('#' + courseId + '_failed');
    courseDiv.find('.check-tolerate').css('color', 'transparent');
    courseDiv.find('.check-fail').css('color', 'white');
    courseDiv.find('.tolerate-course').css('opacity', 0.5);
    courseDiv.find('.stay-failed').css('opacity', 1);
    var topBar = courseDiv.find('.top-bar');
    topBar.addClass('tolerable');
    topBar.removeClass('tolerated');
    courseDiv.addClass('tolerable');
    courseDiv.removeClass('tolerated');
    //  change credits
    currentCredits = parseInt(slider1.value);
    if (courseId == "H01B2B"){
      slider1.value = currentCredits - 6;
      output1.innerHTML = currentCredits - 6;
      changeToleranceCredits(6)
    }
    else{
      slider1.value = currentCredits - 4;
      output1.innerHTML = currentCredits - 4;
      changeToleranceCredits(4)
    }
    changeBachelorCredits()
  })
  
});