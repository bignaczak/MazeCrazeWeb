class Maze {
    constructor(rows, columns) {
        this.size = [rows, columns];
        this.solutionArray = [];
        this.deadEndArray = [];
    }
    getSize() {
        return 'Maze size is ' + this.size[0] + ' rows x ' + this.size[1] + ' columns';
    }
    getRowUpperBound() {
        return this.size[0];
    }
    getColumnUpperBound() {
        return this.size[1];
    }
    getSolutionArray() { return this.solutionArray; }
    addPositionToSolution(currentPosition) {
        //Must create a copy of the object
        this.solutionArray.push({ xPos: currentPosition.xPos, yPos: currentPosition.yPos });
    }
    isPositionInSolution(proposedPosition) {
        let inSolution = false;
        //console.log(JSON.stringify(this.solutionArray));
        for (let i = 0; i < this.solutionArray.length; i++) {
            let existingPosition = this.solutionArray[i];
            //console.log('For loop %d Checking proposed (%s, %s) against existing (%s, %s)',i, proposedPosition.xPos, proposedPosition.yPos, existingPosition.xPos, existingPosition.yPos);
            //if(existingPosition.xPos == proposedPosition.xPos && existingPosition.yPos == proposedPosition.yPos){
            if (JSON.stringify(existingPosition) == JSON.stringify(proposedPosition)) {
                inSolution = true;
                break;
            }
        }
        //console.log('inSolution result %s', inSolution);
        return inSolution;
    }
    getViableMoves(currentPosition) {
        let viableMoves = [];
        //Assign the increment variable for the move
        let proposedDirection;
        for (let i = 0; i < (Object.keys(MoveDirection).length / 2); i++) {
            let yInc = 0;
            let xInc = 0;
            if (i == MoveDirection.UP) {
                yInc--;
                proposedDirection = MoveDirection.UP;
            }
            else if (i == MoveDirection.DOWN) {
                yInc++;
                proposedDirection = MoveDirection.DOWN;
            }
            else if (i == MoveDirection.RIGHT) {
                xInc++;
                proposedDirection = MoveDirection.RIGHT;
            }
            else if (i == MoveDirection.LEFT) {
                xInc--;
                proposedDirection = MoveDirection.LEFT;
            }
            //Set the proposedPosition
            let proposedPosition = { xPos: currentPosition.xPos + xInc, yPos: currentPosition.yPos + yInc };
            console.log('Cur Pos %s and direction %s to proposed pos %s', JSON.stringify(currentPosition), MoveDirection[i], JSON.stringify(proposedPosition));
            //Verify position is on the maze grid
            let isProposedSolutionOnGrid = true;
            if (proposedPosition.xPos >= this.getRowUpperBound() || proposedPosition.xPos < 0)
                isProposedSolutionOnGrid = false;
            if (proposedPosition.yPos >= this.getColumnUpperBound() || proposedPosition.yPos < 0)
                isProposedSolutionOnGrid = false;
            //Verify that the solution doesn't already exist in the solution
            //console.log('About to check if position is already in solution');
            let isAlreadyInSolution = this.isPositionInSolution(proposedPosition);
            if (isProposedSolutionOnGrid && !isAlreadyInSolution) {
                //If on the grid and not already in the solution set
                viableMoves.push(proposedDirection);
            }
            else if (!isProposedSolutionOnGrid) {
                console.log('From position %s, moving %s is off grid', JSON.stringify(currentPosition), proposedDirection);
            }
            else if (isAlreadyInSolution) {
                console.log('From position %s, moving %s to proposed position of %s is already in solution', JSON.stringify(currentPosition), proposedDirection, JSON.stringify(proposedPosition));
            }
        }
        console.log('From position (%d, %d) there are %d possible directions: %s', currentPosition.xPos, currentPosition.yPos, viableMoves.length, JSON.stringify(viableMoves));
        return viableMoves;
    }
}
class TestClass {
    constructor(i, d) {
        this.i = i;
        this.d = d;
        this.index = i;
        this.direction = d;
    }
}
var MoveDirection;
(function (MoveDirection) {
    MoveDirection[MoveDirection["UP"] = 0] = "UP";
    MoveDirection[MoveDirection["RIGHT"] = 1] = "RIGHT";
    MoveDirection[MoveDirection["DOWN"] = 2] = "DOWN";
    MoveDirection[MoveDirection["LEFT"] = 3] = "LEFT";
})(MoveDirection || (MoveDirection = {}));
// ************************************************************
// ******   FUNCTIONS       ***********************************
// ************************************************************
function draw() {
    let canvas = document.getElementById('canvas');
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
    let mazeCanvas = document.getElementById("mazeCanvas");
    let squareSize = 25;
    let wallThickness = 2;
    let borderWidth = 10;
    let newMazeWidth = x * (squareSize + wallThickness) + (2 * borderWidth);
    let newMazeHeight = y * (squareSize + wallThickness) + (2 * borderWidth);
    mazeCanvas.width = newMazeWidth;
    mazeCanvas.height = newMazeHeight;
    drawMazeBorder(borderWidth);
    let currentDirection = "horizontal" /* "HORIZONTAL" */;
    drawMazeGridLines(currentDirection, y - 1, squareSize, wallThickness, borderWidth, mazeCanvas);
    currentDirection = "vertical" /* "VERTICAL" */;
    drawMazeGridLines(currentDirection, x - 1, squareSize, wallThickness, borderWidth, mazeCanvas);
}
function clearMazeCanvas() {
    let mazeCanvas = document.getElementById("mazeCanvas");
    let context2 = mazeCanvas.getContext('2d');
    context2.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
}
function drawMazeBorder(borderWidth) {
    let c = document.getElementById("mazeCanvas");
    let ctx = c.getContext("2d");
    ctx.strokeStyle = 'rgb(50,255,50)';
    ctx.lineWidth = borderWidth;
    console.log(c);
    //ctx.strokeStyle = "#FF0000";
    let mazeBorder = ctx.strokeRect(borderWidth / 2, borderWidth / 2, c.width - borderWidth, c.height - borderWidth);
    let startPos = [ctx.lineWidth, ctx.lineWidth];
    let endPos = [c.width - ctx.lineWidth, c.height - ctx.lineWidth];
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
    let logTag = "drawGridGridLines |" + direction.toString() + "|";
    console.log("Entering " + logTag);
    const ctx = mazeCanvas.getContext("2d");
    let initialX;
    let endX;
    let initialY;
    let endY;
    let incrementX;
    let incrementY;
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
    for (let i = 0; i < numLines; i++) {
        console.log(logTag + ": in for loop " + i);
        ctx.beginPath();
        //Adjust the begining coordinate
        let startX = initialX + (incrementX * i);
        let startY = initialY + (incrementY * i);
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
function generateSolution(gridSize) {
    let xMax, yMax;
    if (gridSize !== undefined) {
        xMax = gridSize[0];
        yMax = gridSize[1];
    }
    else {
        let xElement = document.getElementById("mazeWidth");
        xMax = xElement.valueAsNumber;
        let yElement = document.getElementById("mazeHeight");
        yMax = yElement.valueAsNumber;
        gridSize = [xMax, yMax];
    }
    //console.log("Maze Dimensions: (" + xMax + ", " + yMax + ")");
    let myMaze = new Maze(xMax, yMax);
    console.log('Maze created, size is ' + myMaze.getSize());
    //Assign the start position 
    let yStart = Math.floor(Math.random() * yMax);
    console.log("Starting y position: " + yStart);
    let currentPosition = { xPos: 0, yPos: yStart };
    myMaze.addPositionToSolution(currentPosition);
    //Prepare the loop for generating the solution
    let endReached = false;
    let i = 0;
    while (!endReached) {
        let viableMoves = myMaze.getViableMoves(currentPosition);
        let proposedMove = Math.floor(Math.random() * viableMoves.length);
        let myMove = viableMoves[proposedMove];
        console.log('Move %d used random number %d to select MoveDirection %d or %s', i, proposedMove, myMove, MoveDirection[myMove]);
        //console.log('Move {$i} is ${myMove}');
        isMoveValid(currentPosition, myMove, myMaze);
        console.log('Back in loop, Current position: (%d , %d)', currentPosition.xPos, currentPosition.yPos);
        i++;
        if (i >= 5)
            endReached = true;
    }
}
function testEnumValues() {
    console.log("About to print all the MoveDirection values");
    for (let k = 0; k < 4; k++) {
        console.log('Value for %d is %s', k, MoveDirection[k]);
    }
}
function testObjectDraw(c) {
    const ctx = c.getContext("2d");
    let myPath = new Path2D();
    myPath.moveTo(10, 10);
    myPath.lineTo(100, 140);
    ctx.stroke(myPath);
}
function logSlider(mySlider) {
    let slW = mySlider.valueAsNumber;
    document.getElementById("mazeWidth").valueAsNumber = slW;
}
function hSliderChange(slider) {
    let newHeight = slider.valueAsNumber;
    document.getElementById("mazeHeight").valueAsNumber = newHeight;
}
//Array<HTMLCanvasElement>(10);
function constructSolutionArray(rows, columns) {
    //console.log("Starting...");
    if (rows === undefined)
        rows = 5;
    if (columns === undefined)
        columns = 5;
    let solutionArray = [];
    for (let i = 0; i < rows; i++) {
        //console.log('Initializing row %d', i);
        solutionArray[i] = [];
        for (let j = 0; j < columns; j++) {
            //let logNote:String = ;
            //console.log('About to write row %d, column %d', i, j);
            solutionArray[i][j] = 0;
        }
    }
    let lastRow = solutionArray.length - 1;
    let lastColumn = solutionArray[0].length - 1;
    //console.log('first: %s and last: %s', solutionArray[0][0], solutionArray[lastRow][lastColumn]);
    return solutionArray;
}
function isMoveValid(currentPosition, proposedMove, maze) {
    let isValid = true;
    //Assign the increment variable for the move
    let yInc = 0;
    let xInc = 0;
    if (proposedMove === MoveDirection.UP)
        yInc--;
    else if (proposedMove === MoveDirection.DOWN)
        yInc++;
    else if (proposedMove === MoveDirection.RIGHT)
        xInc++;
    else if (proposedMove === MoveDirection.LEFT)
        xInc--;
    //Set the proposedPosition
    let proposedPosition = { xPos: currentPosition.xPos + xInc, yPos: currentPosition.yPos + yInc };
    //Verify position is on the maze grid
    let isProposedSolutionOnGrid = true;
    if (proposedPosition.xPos >= maze.getRowUpperBound() || proposedPosition.xPos < 0)
        isProposedSolutionOnGrid = false;
    if (proposedPosition.yPos >= maze.getColumnUpperBound() || proposedPosition.yPos < 0)
        isProposedSolutionOnGrid = false;
    //Verify that the solution doesn't already exist in the solution
    console.log('About to check if position is already in solution');
    let isAlreadyInSolution = maze.isPositionInSolution(proposedPosition);
    if (!isProposedSolutionOnGrid) {
        //Move is not on Grid
        console.log('Warning, Proposed position (%d , %d) is not on grid, Move Rejected!!', proposedPosition.xPos, proposedPosition.yPos);
        isValid = false;
        console.log();
    }
    else if (isAlreadyInSolution) {
        console.log('Position already in solution (%d, %d), move rejected!', proposedPosition.xPos, proposedPosition.yPos);
        isValid = false;
    }
    else {
        //Proposed move is on grid and not already existing in solution
        console.log('Proposed position (%d , %d) is A GO!!!!', proposedPosition.xPos, proposedPosition.yPos);
        currentPosition.xPos = proposedPosition.xPos;
        currentPosition.yPos = proposedPosition.yPos;
        //console.log('Current position now set to (%d , %d)', currentPosition.xPos, currentPosition.yPos);
        //Now add it to the solution array
        maze.addPositionToSolution(currentPosition);
        console.log('and added to solution array, which is now size %d', maze.getSolutionArray().length);
    }
    return isValid;
}
