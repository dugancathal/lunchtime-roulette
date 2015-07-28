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

function RouletteWheel(restaurants) {
  return {
    restaurants: restaurants,
    spinTimeout: null,
    spinArcStart: 10,
    spinTime: 0,
    spinTimeTotal: 0,
    startAngle: 0,
    arc: function() {
      return (2*Math.PI) / this.restaurants.length;
    }
  };
}

var ctx;
var wheel = new RouletteWheel(restaurants);
function drawRouletteWheel() {
  var canvas = document.getElementById("wheelcanvas");
  wheel.restaurants = restaurants;

  if (canvas.getContext) {
    var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 125;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 500, 500);


    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.font = 'bold 12px sans-serif';

    for (var i = 0; i < wheel.restaurants.length; i++) {
      var angle = wheel.startAngle + i * wheel.arc();
      ctx.fillStyle = colors[i];

      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + wheel.arc(), false);
      ctx.arc(250, 250, insideRadius, angle + wheel.arc(), angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      ctx.translate(250 + Math.cos(angle + wheel.arc() / 2) * textRadius, 250 + Math.sin(angle + wheel.arc() / 2) * textRadius);
      ctx.rotate(angle + wheel.arc() / 2 + Math.PI / 2);
      ctx.fillStyle = 'white';
      var text = i + 1;
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }

    //Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
    ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.fill();
  }
}

function spin(wheel) {
  wheel.spinAngleStart = Math.random() * 10 + 10;
  wheel.spinTime = 0;
  wheel.spinTimeTotal = Math.random() * 3 + 4 * 1000;
  rotateWheel(wheel);
}

function rotateWheel(wheel) {
  wheel.spinTime += 30;
  if (wheel.spinTime >= wheel.spinTimeTotal) {
    stopRotateWheel(wheel);
    return;
  }
  var spinAngle = wheel.spinAngleStart - easeOut(wheel.spinTime, 0, wheel.spinAngleStart, wheel.spinTimeTotal);
  wheel.startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  wheel.spinTimeout = setTimeout(function() { rotateWheel(wheel) }, 30);
}

function stopRotateWheel(wheel) {
  clearTimeout(wheel.spinTimeout);
  var degrees = wheel.startAngle * 180 / Math.PI + 90;
  var arcd = wheel.arc() * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 30px sans-serif';
  var text = wheel.restaurants[index].name;
  var topLeftOfTextX = 250 - ctx.measureText(text).width / 2;
  var topLeftOfTextY = 250 + 10;
  ctx.fillText(text, topLeftOfTextX, topLeftOfTextY);
  ctx.restore();
  ctx.rect(topLeftOfTextX, topLeftOfTextY, topLeftOfTextX + ctx.measureText(text).width, 250-10);

}

function easeOut(t, b, c, d) {
  var ts = (t /= d) * t;
  var tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}
