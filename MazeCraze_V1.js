"use strict";
exports.__esModule = true;
function myFunc() {
    document.getElementById("outputField").innerHTML = "jojo was here";
    console.log(22);
}
;
function draw() {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        context.fillRect(20, 20, 100, 100);
        context.clearRect(40, 40, 60, 60);
        context.strokeRect(45, 45, 50, 50);
    }
}
function clickCanvas() {
    console.log("Canvas Clicked");
}
function logMousePosition(e) {
    console.log(e);
}
function trackMouse(e) {
    console.log("(" + e.x + ", " + e.y + ")");
}
function drawRectangle(e) {
    clearMazeCanvas();
    //var rectCanvas = document.getElementById("rectCanvas");
    //var context2 = rectCanvas.getContext('2d');
    //context2.fillRect(100,100,150,150);
}
function initMaze(x, y) {
    clearMazeCanvas();
    var mazeCanvas = document.getElementById("mazeCanvas");
    var squareSize = 25;
    var wallThickness = 2;
    var borderWidth = 10;
    var newMazeWidth = x * (squareSize + wallThickness) + (2 * borderWidth);
    var newMazeHeight = y * (squareSize + wallThickness) + (2 * borderWidth);
    mazeCanvas.width = newMazeWidth;
    mazeCanvas.height = newMazeHeight;
    drawMazeBorder(borderWidth);
    var currentDirection = "horizontal" /* "HORIZONTAL" */;
    drawMazeGridLines(currentDirection, y - 1, squareSize, wallThickness, borderWidth, mazeCanvas);
    currentDirection = "vertical" /* "VERTICAL" */;
    drawMazeGridLines(currentDirection, x - 1, squareSize, wallThickness, borderWidth, mazeCanvas);
}
function clearMazeCanvas() {
    var mazeCanvas = document.getElementById("mazeCanvas");
    var context2 = mazeCanvas.getContext('2d');
    context2.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
}
function drawMazeBorder(borderWidth) {
    var c = document.getElementById("mazeCanvas");
    var ctx = c.getContext("2d");
    ctx.strokeStyle = 'rgb(50,255,50)';
    ctx.lineWidth = borderWidth;
    console.log(c);
    //ctx.strokeStyle = "#FF0000";
    var mazeBorder = ctx.strokeRect(borderWidth / 2, borderWidth / 2, c.width - borderWidth, c.height - borderWidth);
    var startPos = [ctx.lineWidth, ctx.lineWidth];
    var endPos = [c.width - ctx.lineWidth, c.height - ctx.lineWidth];
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.beginPath();
    ctx.moveTo(startPos[0], startPos[1]);
    ctx.lineTo(endPos[0], endPos[1]);
    ctx.stroke();
}
function drawMazeGridLines(direction, numLines, squareSize, wallThickness, borderWidth, mazeCanvas) {
    /**
     * Draws the horizontal and vertical grid lines
     */
    var logTag = "drawGridGridLines |" + direction.toString() + "|";
    console.log("Entering " + logTag);
    var ctx = mazeCanvas.getContext("2d");
    var initialX;
    var endX;
    var initialY;
    var endY;
    var incrementX;
    var incrementY;
    ctx.lineWidth = wallThickness;
    ctx.strokeStyle = 'rgb(50,255,50)';
    if (direction === "horizontal" /* "HORIZONTAL" */) {
        initialX = borderWidth;
        endX = mazeCanvas.width - borderWidth; //constant length
        incrementX = 0;
        initialY = borderWidth + squareSize + wallThickness / 2;
        incrementY = squareSize + wallThickness;
    }
    else {
        initialX = borderWidth + squareSize + wallThickness / 2;
        incrementX = squareSize + wallThickness;
        initialY = borderWidth;
        endY = mazeCanvas.height - borderWidth; //constant length
        incrementY = 0;
    }
    for (var i = 0; i < numLines; i++) {
        console.log(logTag + ": in for loop " + i);
        ctx.beginPath();
        //Adjust the begining coordinate
        var startX = initialX + (incrementX * i);
        var startY = initialY + (incrementY * i);
        if (direction === "horizontal" /* "HORIZONTAL" */) {
            endY = startY; //Horizontal line, no change in Y
        }
        else {
            endX = startX; //Vertical line, no change in X
        }
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
    console.log(logTag + ": Outside for loop");
}
function logSlider(mySlider) {
    var slW = mySlider.valueAsNumber;
    document.getElementById("mazeWidth").valueAsNumber = slW;
}
function hSliderChange(slider) {
    var newHeight = slider.valueAsNumber;
    document.getElementById("mazeHeight").valueAsNumber = newHeight;
}
//Array<HTMLCanvasElement>(10);
var c = document.getElementById("mazeCanvas");
var ctx = c.getContext("2d");
var lines = c.getElementsByClassName('vLine');
console.log("RedRabbit");
