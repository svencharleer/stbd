var bachelorCreditsBar = document.getElementById("bachelorCreditsBar");
var bachelorCreditsValue = document.getElementById("bachelorCredits");

function changeBachelorCredits() {
  value = parseInt(slider1.value) + parseInt(slider2.value) + parseInt(slider3.value) + parseInt(slider4.value) + parseInt(slider5.value)
  if (value > 180){
    value = 180
  }
  widthBar = value * 120 / 180;
  $('#bachelorCreditsBar').width(widthBar);
  $('#bachelorCreditsValue').html(value);
  
}


//Slider 1
var slider1 = document.getElementById("plan1");
var output1 = document.getElementById("valueYear1");
output1.innerHTML = slider1.value;

slider1.oninput = function() {
  output1.innerHTML = this.value;
}

//Year 2
var slider2 = document.getElementById("plan2");
var output2 = document.getElementById("valueYear2");
output2.innerHTML = slider2.value;

slider2.oninput = function() {
  output2.innerHTML = this.value;
}

//Year 2 semester 1
var slider2sem1 = document.getElementById("plan2sem1");
var output2sem1 = document.getElementById("valueYear2sem1");
output2sem1.innerHTML = slider2sem1.value;

slider2sem1.oninput = function() {
  output2sem1.innerHTML = this.value;
  var totalYear2 = parseInt(slider2sem2.value) + parseInt(this.value);
  slider2.value = totalYear2;
  output2.innerHTML = totalYear2;
  changeBachelorCredits()
}

//Year 2 semester 2
var slider2sem2 = document.getElementById("plan2sem2");
var output2sem2 = document.getElementById("valueYear2sem2");
output2sem2.innerHTML = slider2sem2.value;

slider2sem2.oninput = function() {
  output2sem2.innerHTML = this.value;
  var totalYear2 = parseInt(slider2sem1.value) + parseInt(this.value);
  slider2.value = totalYear2;
  output2.innerHTML = totalYear2;
  changeBachelorCredits()
}

//Year 3
var slider3 = document.getElementById("plan3");
var output3 = document.getElementById("valueYear3");
output3.innerHTML = slider3.value;

slider3.oninput = function() {
  output3.innerHTML = this.value;
  changeBachelorCredits()
}

//Slider 4
var slider4 = document.getElementById("plan4");
var output4 = document.getElementById("valueYear4");
output4.innerHTML = slider4.value;

slider4.oninput = function() {
  output4.innerHTML = this.value;
  changeBachelorCredits()
}

//Year 5
var slider5 = document.getElementById("plan5");
var output5 = document.getElementById("valueYear5");
output5.innerHTML = slider5.value;

slider5.oninput = function() {
  output5.innerHTML = this.value;
  changeBachelorCredits()
}

slider1.value = 37;
output1.innerHTML = 37;
slider2.value = 0;
output2.innerHTML = 0;
slider2sem1.value = 0;
output2sem1.innerHTML = 0;
slider2sem2.value = 0;
output2sem2.innerHTML = 0;
slider3.value = 0;
slider3.innerHTML = 0;
slider4.value = 0;
slider4.innerHTML = 0;
slider5.value = 0;
slider5.innerHTML = 0;

