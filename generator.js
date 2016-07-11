console.log("generator script");

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    windowWidth = w.innerWidth || e.clientWidth || g.clientWidth,
    windowHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;

var navbarFixedTop = document.getElementById("navbar-fixed-top");
var canvasContainer = document.getElementById("canvas-container");

canvas.width = canvasContainer.offsetWidth;
canvas.height = windowHeight - navbarFixedTop.offsetHeight;
	
var X = 500, Y = 200;

function random(min, max) {
	return Math.random() * (max - min) + min;
}

var width = random(canvas.width / 10, canvas.width / 2);
var height = random(canvas.height / 8, canvas.height / 3);

var X = canvas.width / 2 - 0.5 * width;
var Y = canvas.height / 2 - 0.75 * height;

var border = random(0, 1);

var face = random(Math.max(Math.floor(width / 10), 3 * 5 + 2 * 10), Math.floor(width / 3));
var back = random(Math.floor(width / 10), Math.floor(width / 3));

var stripesNum = random(2, (width - face - back) / 10);
var stripesWidth = (width - face - back) / stripesNum;

var eyePadding = random(5, Math.max((face - 2 * 10) / 3, 5));
var eyeOuterSize = random(10, Math.max((face - 3 * eyePadding) / 2, 10));
var eyeInnerSize = random(5, eyeOuterSize / 2);
var eyeY = random(Y, Y + height * 0.7);

var mouthX = random(X, X + 20);
var mouthWidth = random(10, X + face - mouthX);
var mouthHeight = random(3, 15);
var mouthY = random(eyeY + eyeOuterSize + 5, Y + height - mouthHeight - 5);

var wingX = Math.min(random(X + face, X + width - back), X + width / 2);
var wingWidth = random(Math.max(face, back), width);
var wingHeight = random(height / 7, height / 2);
var wingY = Y - wingHeight;

var wingStripesWidth = random(20, wingWidth - 10);
var wingStripesHeight = random(20, wingHeight - 10);
var wingStripesX = random(wingX + 10, wingX + wingWidth - wingStripesWidth - 10);
var wingStripesY = random(wingY + 10, wingY + wingHeight - wingStripesHeight - 10);

var legsWidth = random(3, 10);
var legsHeight = random(10, height / 4);
var legsPadding = ((width - face - back - 6 * legsWidth) / 6);

var i;


context.fillStyle = "#000";
context.fillRect(X, Y, width, height);

context.fillStyle = "#eee";
context.fillRect(X + width - back, Y, back, height);

context.fillStyle = "#111";
context.fillRect(X, Y, face, height);

context.fillStyle = "yellow";
for (i = 0; i < stripesNum; i += 2) {
	context.fillRect(X + face + i * stripesWidth, Y, stripesWidth, height);
}

context.fillStyle = "blue";
context.fillRect(X + eyePadding, eyeY, eyeOuterSize, eyeOuterSize);
context.fillRect(X + 2 * eyePadding + eyeOuterSize, eyeY, eyeOuterSize, eyeOuterSize);

context.fillStyle = "#fff";
context.fillRect(X + eyePadding + eyeOuterSize / 4, eyeY + eyeOuterSize / 4, eyeInnerSize, eyeInnerSize);
context.fillRect(X + 2 * eyePadding + eyeOuterSize / 4 + eyeOuterSize, eyeY + eyeOuterSize / 4, eyeInnerSize, eyeInnerSize);

context.fillStyle = "#fff";
context.fillRect(mouthX, mouthY, mouthWidth, mouthHeight);

context.fillStyle = "#fff";
context.fillRect(wingX, wingY, wingWidth, wingHeight);

context.fillStyle = "lightblue";
context.fillRect(wingStripesX, wingStripesY + wingStripesHeight / 3, wingStripesWidth, 3);
context.fillRect(wingStripesX, wingStripesY + 2 * wingStripesHeight / 3, wingStripesWidth, 3);
context.fillRect(wingStripesX + wingStripesWidth / 3, wingStripesY, 3, wingStripesHeight);
context.fillRect(wingStripesX + 2 * wingStripesWidth / 3, wingStripesY, 3, wingStripesHeight);

context.fillStyle = "#000";
for (i = 1; i <= 6; ++i) {
	context.fillRect(X + face + i * legsPadding, height + Y, legsWidth, legsHeight);
}