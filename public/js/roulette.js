var colors = ["#2a8251", "#dc0927", "#414243", "#dc0927", "#2E2C75",
  "#dc0927", "#414243", "#dc0927", "#2E2C75",
  "#dc0927", "#414243", "#dc0927", "#2E2C75",
  "#dc0927", "#414243", "#dc0927", "#2E2C75",
  "#dc0927", "#414243", "#dc0927", "#2E2C75",
  "#dc0927", "#414243", "#dc0927", "#2E2C75",
  "#dc0927", "#414243", "#dc0927", "#2E2C75",
  "#dc0927", "#414243", "#dc0927", "#2E2C75",
  "#dc0927", "#414243", "#dc0927", "#2E2C75"];
var restaurants = [
  {"name": "The Corner Office Restaurant + Martini Bar"},
  {"name": "Coral Room"},
  {"name": "Three Dogs Tavern"},
  {"name": "Jonesy's EatBar"}
];

function RouletteWheelCanvas(canvas, restaurants) {
  this.restaurants = restaurants;
  this.canvas = canvas;

  this.spinTimeout = null;
  this.spinArcStart = 10;
  this.spinTime = 0;
  this.spinTimeTotal = 0;
  this.startAngle = 0;

  this.canvasSideLength = this.canvas.width;
  this.canvas.height = this.canvas.width;
  this.centerX = this.canvasSideLength / 2;
  this.centerY = this.canvasSideLength / 2;
  this.outsideRadius = 0.4 * this.canvasSideLength;
  this.textAlignmentRadiusInsideWedge = (this.canvasSideLength - 200) / 2;
  this.insideRadius = (this.canvasSideLength - 250) / 2;
}

RouletteWheelCanvas.prototype.arc = function arc() {
  return (2 * Math.PI) / this.restaurants.length;
};

RouletteWheelCanvas.prototype.drawRouletteWedge = function drawRouletteWedge(index) {
  var angle = this.startAngle + index * this.arc();
  var text = index + 1;
  this.ctx.fillStyle = colors[index];

  this.ctx.beginPath();
  this.ctx.arc(this.centerX, this.centerY, this.outsideRadius, angle, angle + this.arc(), false);
  this.ctx.arc(this.centerX, this.centerY, this.insideRadius, angle + this.arc(), angle, true);
  this.ctx.stroke();
  this.ctx.fill();

  this.ctx.save();
  this.ctx.shadowOffsetX = -1;
  this.ctx.shadowOffsetY = -1;
  this.ctx.shadowBlur = 0;
  this.ctx.shadowColor = "rgb(220,220,220)";
  this.ctx.fillStyle = "black";
  this.ctx.translate(this.centerX + Math.cos(angle + this.arc() / 2) * this.textAlignmentRadiusInsideWedge, this.centerY + Math.sin(angle + this.arc() / 2) * this.textAlignmentRadiusInsideWedge);
  this.ctx.rotate(angle + this.arc() / 2 + Math.PI / 2);
  this.ctx.fillStyle = 'white';
  this.ctx.fillText(text, -this.ctx.measureText(text).width / 2, 0);
  this.ctx.restore();
};

RouletteWheelCanvas.prototype.initContext = function initCanvas() {
  var ctx = this.canvas.getContext("2d");
  ctx.clearRect(0, 0, this.canvasSideLength, this.canvasSideLength);

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.font = 'bold 12px sans-serif';
  this.ctx = ctx;
};

RouletteWheelCanvas.prototype.draw = function draw() {
  this.initContext();
  for (var i = 0; i < this.restaurants.length; i++) {
    this.drawRouletteWedge(i);
  }

  this.drawArrow();
};

RouletteWheelCanvas.prototype.drawArrow = function drawArrow() {
  this.ctx.fillStyle = "black";
  this.ctx.beginPath();
  this.ctx.moveTo(this.centerX - 4, this.centerY - (this.outsideRadius + 5));
  this.ctx.lineTo(this.centerX + 4, this.centerY - (this.outsideRadius + 5));
  this.ctx.lineTo(this.centerX + 4, this.centerY - (this.outsideRadius - 5));
  this.ctx.lineTo(this.centerX + 9, this.centerY - (this.outsideRadius - 5));
  this.ctx.lineTo(this.centerX + 0, this.centerY - (this.outsideRadius - 13));
  this.ctx.lineTo(this.centerX - 9, this.centerY - (this.outsideRadius - 5));
  this.ctx.lineTo(this.centerX - 4, this.centerY - (this.outsideRadius - 5));
  this.ctx.lineTo(this.centerX - 4, this.centerY - (this.outsideRadius + 5));
  this.ctx.fill();
};

RouletteWheelCanvas.prototype.getWinnerByIndex = function getWinnerByIndex(index) {
  return this.restaurants[index].name;
};

RouletteWheelCanvas.prototype.pickWinner = function pickWinner(onWinnerSelected) {
  this.spinAngleStart = Math.random() * 10 + 10;
  this.spinTime = 0;
  this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
  this.countdownAndThen(function () {
    this._rotate(onWinnerSelected);
  }.bind(this));
};

RouletteWheelCanvas.prototype.countdownAndThen = function countdownAndThen(andThen) {
  var _this = this;
  _this.setCenterText(3);
  setTimeout(function () {
    _this.setCenterText(2);
    setTimeout(function () {
      _this.setCenterText(1);
      setTimeout(function () {
        andThen();
      }, 1000)
    }, 1000)
  }, 1000)
};

RouletteWheelCanvas.prototype.setCenterText = function setCenterText(text) {
  this.draw();
  this.ctx.save();
  this.ctx.font = 'bold 30px sans-serif';
  var topLeftOfTextX = this.centerX - this.ctx.measureText(text).width / 2;
  var topLeftOfTextY = this.centerY + 10;
  this.ctx.fillText(text, topLeftOfTextX, topLeftOfTextY);
  this.ctx.restore();
};

RouletteWheelCanvas.prototype._rotate = function _rotate(onFinishedRotating) {
  this.spinTime += 30;
  if (this.spinTime >= this.spinTimeTotal) {
    this._finishRotation(onFinishedRotating);
    return;
  }
  var spinAngle = this.spinAngleStart - easeOut(this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal);
  this.startAngle += (spinAngle * Math.PI / 180);
  this.draw();
  this.spinTimeout = setTimeout(function () {
    this._rotate(onFinishedRotating);
  }.bind(this), 30);
};

RouletteWheelCanvas.prototype._finishRotation = function _finishRotation(finishedCallback) {
  clearTimeout(this.spinTimeout);
  var degrees = this.startAngle * 180 / Math.PI + 90;
  var arcd = this.arc() * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  return finishedCallback(this.getWinnerByIndex(index));
};

function easeOut(t, b, c, d) {
  var ts = (t /= d) * t;
  var tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}
