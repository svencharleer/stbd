
Template.failedCourse.helpers({
  color: function(){
    let color = "white"; //"#ef9a9a";
    if(this.grade < 8) color = "failed" //"#ff8a80"; //failed
    else if(this.grade > 9) color = "passed" //"#a5d6a7"; //passed
    else if(this.grade >= 8 && this.grade <= 9) color = "tolerable"; // "#ffcc80"; //tolerable
    else color = "failed"; // "#ff8a80"; //failed
    return color;
  },
  courseLabel: function(){
    let label  = "NT";
    if ((this.try1 > 9) || (this.try2 > 9)) label = "G"; // Passed
    else if ((this.try1 >= 8 && this.try1 <= 9) || (this.try2 >= 8 && this.try2 <= 9)) label =  "T";
    else label = "NT";
    return label;
  },
  try1: function(){
    let bold  = "bold";
    if(this.try1 < this.try2) bold = "notbold";
    return {"grade":this.try1, "bold": bold};
  },
  try2: function() {
    let bold  = "bold";
    if(this.try1 > this.try2) bold = "notbold";
    return {"grade":this.try2, "bold": bold};
  }
});

Template.failedCourse.onRendered(function(){
  // variables about data
  var instance = this;
  var data = this.data;
  var courseId = data.id;
  var courseName = data.name;
  var gradeTry1 = data.try1;
  var gradeTry2 = data.try2;
  
});
