draw = function () {
  background(173, 173, 173);
  fill(69, 158, 100);
  textSize(65);
  text("Beds are..", 48, 76);
  textSize(10);
  var xPosline = 341;
  var xPosline2 = 243;
  strokeWeight(14);
  stroke(10, 10, 10);
  line(xPosline, 165, xPosline, 300); //upperRightBedPost
  line(xPosline2, 147, xPosline2, 276); //upperLeftPost
  noStroke();
  quad(5, 244, 97, 275, 342, 220, 243, 200); //mainMattressRectangle
  quad(97, 298, 97, 275, 342, 220, 342, 240); //longMattressRect
  quad(5, 244, 97, 275, 96, 298, 5, 265); //shortMattressRect
  strokeWeight(14);
  stroke(10, 10, 10);
  line(98, 265, 98, 347); //bottomRightPost
  line(7, 236, 7, 325); //bottomLeftPost
  noStroke();
  fill(79, 68, 176);
  ellipse(283, 213, 75, 47);  //Pillow
  text("So soft....DON'T GO TO SLEEP WITHOUT ONE!", 72, 108);
}
