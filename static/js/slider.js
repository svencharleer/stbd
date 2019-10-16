var slider = document.getElementById("plan1");
var output = document.getElementById("valueYear1");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}