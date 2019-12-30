export {}

// ************************************************************
// ******   CUSTOM TYPES    ***********************************
// ************************************************************
type GridSize = [number, number];
type MazePosition={xPos:number, yPos:number};
type CanvasPosition={xCoord:number, yCoord:number}

class Maze{
  size:[number, number];  // [rows, columns]
  solutionArray:Array<MazePosition>;
  deadEndArray: Array<MazePosition>;
  overallWidth:number;
  overallHeight:number;
  
  //Static parameters
  public static squareSize:number = 25;
  public static wallThickness:number = 2;
  public static borderWidth:number = 10;
  public static theMaze:Maze; 


  constructor(xSize:number, ySize:number){
    this.size = [xSize, ySize];
    this.solutionArray = [];
    this.deadEndArray = [];
    this.overallWidth = this.size[0]*(Maze.squareSize+Maze.wallThickness) + (2*Maze.borderWidth);
    this.overallHeight = this.size[1]*(Maze.squareSize+Maze.wallThickness) + (2*Maze.borderWidth);
    Maze.theMaze = this;
  }

  public static getMaze():Maze{
    return Maze.theMaze;
  }
  public getSize():string {
    return 'Maze size is ' + this.size[0] +   ' rows x ' + this.size[1] + ' columns';
  }
  public getXUpperBound():number{
    return this.size[0];
  }
  public getYUpperBound():number{
    return this.size[1];
  }
  public getSolutionArray():Array<MazePosition>{return this.solutionArray;}

  public addPositionToSolution(currentPosition:MazePosition):void{
    //Must create a copy of the object
    this.solutionArray.push({xPos:currentPosition.xPos, yPos:currentPosition.yPos});
  }

  /*
  public isPositionInSolution(proposedPosition:MazePosition):boolean{
    let inSolution: boolean = false;
    //console.log(JSON.stringify(this.solutionArray));
    for(let i=0; i<this.solutionArray.length; i++){
      let existingPosition:MazePosition = this.solutionArray[i];
      //console.log('For loop %d Checking proposed (%s, %s) against existing (%s, %s)',i, proposedPosition.xPos, proposedPosition.yPos, existingPosition.xPos, existingPosition.yPos);
      //if(existingPosition.xPos == proposedPosition.xPos && existingPosition.yPos == proposedPosition.yPos){
      if(JSON.stringify(existingPosition) == JSON.stringify(proposedPosition)){
        inSolution = true;
        break;
      }
    }
    //console.log('inSolution result %s', inSolution);
    return inSolution;

  }
  */

  public isPositionInArray(proposedPosition:MazePosition, array:Array<MazePosition>):boolean{
    let inArray: boolean = false;
    //console.log(JSON.stringify(this.solutionArray));
    for(let i=0; i<array.length; i++){
      let existingPosition:MazePosition = array[i];
      //console.log('For loop %d Checking proposed (%s, %s) against existing (%s, %s)',i, proposedPosition.xPos, proposedPosition.yPos, existingPosition.xPos, existingPosition.yPos);
      //if(existingPosition.xPos == proposedPosition.xPos && existingPosition.yPos == proposedPosition.yPos){
      if(JSON.stringify(existingPosition) == JSON.stringify(proposedPosition)){
        inArray = true;
        break;
      }
    }
    //console.log('inSolution result %s', inSolution);
    return inArray;

  }

  public addPositionToDeadEnds(currentPosition:MazePosition):void{
    let deadEnd:MazePosition = {xPos: currentPosition.xPos, yPos: currentPosition.yPos};
    
    //See if the Position is contained in the solution array and erase it
    let isAlreadyInSolution:boolean = this.isPositionInArray(deadEnd, this.solutionArray);
    if (isAlreadyInSolution){
      let startSolutionLength:number = this.solutionArray.length;
      this.removePositionFromSolution(deadEnd);
      console.log ('Position %s was removed from solution which went from %d nodes to %d', JSON.stringify(deadEnd),startSolutionLength, this.solutionArray.length)
    }
    
    //Make sure the point isn't already in the deadend array
    let isAlreadyInDeadEndArray:boolean =this.isPositionInArray(deadEnd, this.deadEndArray);
    //If not, then add it
    if (!isAlreadyInDeadEndArray){
      this.deadEndArray.push(deadEnd);
      console.log('Position %s added to deadEndArray, now size %d', JSON.stringify(deadEnd), this.deadEndArray.length);
    } else{
      console.log('Position %s already identified as DeadEnd', JSON.stringify(deadEnd));
    }
  }

  public moveToPreviousPositionInSolution():MazePosition{
    let previousIndex:number = this.solutionArray.length-1;
    let referencePosition = this.solutionArray[previousIndex];
    let returnPosition:MazePosition = {xPos:referencePosition.xPos, yPos:referencePosition.yPos};
    return returnPosition;
  }

  public removePositionFromSolution(deadEnd:MazePosition):void{
    for (let i=0; i<this.solutionArray.length; i++){
      if(JSON.stringify(deadEnd) == JSON.stringify(this.solutionArray[i])){
        this.solutionArray.splice(i,1);
      }
    }
  }
  
  public getViableMoves(currentPosition:MazePosition):Array<MoveDirection>{
    let viableMoves:Array<MoveDirection> = [];

    //Assign the increment variable for the move
    let proposedDirection:MoveDirection;
    for (let i=0; i<(Object.keys(MoveDirection).length / 2);i++){
      let yInc = 0;
      let xInc = 0;
      if (i == MoveDirection.UP) {yInc--; proposedDirection = MoveDirection.UP;}
      else if (i == MoveDirection.DOWN) {yInc++; proposedDirection = MoveDirection.DOWN;}
      else if (i == MoveDirection.RIGHT) {xInc++; proposedDirection = MoveDirection.RIGHT;}
      else if (i == MoveDirection.LEFT) {xInc--; proposedDirection= MoveDirection.LEFT;}
      //Set the proposedPosition
      let proposedPosition:MazePosition = {xPos: currentPosition.xPos + xInc, yPos:currentPosition.yPos + yInc};
      
      console.log('Cur Pos %s and direction %s to proposed pos %s', JSON.stringify(currentPosition), MoveDirection[i], JSON.stringify(proposedPosition));
      //Verify position is on the maze grid
      let isProposedSolutionOnGrid: Boolean = true;
      if (proposedPosition.xPos > this.getXUpperBound() || proposedPosition.xPos < 0) isProposedSolutionOnGrid = false;
      if (proposedPosition.yPos >= this.getYUpperBound() || proposedPosition.yPos < 0) isProposedSolutionOnGrid = false;

      //Verify that the proposed position doesn't already exist in the solution
      let isAlreadyInSolution:boolean = this.isPositionInArray(proposedPosition, this.solutionArray);
      
      //Verify that the proposed position doesn't already exist in the deadEndArray
      let isAlreadyInDeadEnds:boolean = this.isPositionInArray(proposedPosition, this.deadEndArray);

      if (isProposedSolutionOnGrid && !isAlreadyInSolution && !isAlreadyInDeadEnds){
        //If on the grid and not already in the solution set
        viableMoves.push(proposedDirection);
      } else if (!isProposedSolutionOnGrid){
        console.log('From position %s, moving %s is off grid', JSON.stringify(currentPosition), proposedDirection);
      } else if (isAlreadyInSolution){
        console.log('From position %s, moving %s to proposed position of %s is already in solution', JSON.stringify(currentPosition), proposedDirection, JSON.stringify(proposedPosition));
      } else if (isAlreadyInDeadEnds){
        console.log('From position %s, moving %s to proposed position of %s is already in deadEndArray', JSON.stringify(currentPosition), proposedDirection, JSON.stringify(proposedPosition));
      }
    }
    console.log('From position (%d, %d) there are %d possible directions: %s', currentPosition.xPos, currentPosition.yPos, viableMoves.length, JSON.stringify(viableMoves));
    return viableMoves;
  }

  private getPositionCenterPoint(mazePosition:MazePosition, canvasPosition:CanvasPosition):void{
    let x:number = (Maze.borderWidth + Maze.squareSize/2) + mazePosition.xPos * (Maze.squareSize + Maze.wallThickness);
    let y:number = (Maze.borderWidth + Maze.squareSize/2) + mazePosition.yPos * (Maze.squareSize + Maze.wallThickness);
    canvasPosition.xCoord = x;
    canvasPosition.yCoord = y;
  }
  public async drawSolution(){
    let mazeCanvas = document.getElementById("mazeCanvas") as HTMLCanvasElement;
    let ctx = mazeCanvas.getContext('2d');
    ctx.lineWidth=6;
    ctx.strokeStyle = 'rgb(200,38,38)';
    
    console.log('Preparing to draw final solution: %s', JSON.stringify(this.solutionArray));
    let path:Path2D;
    let canvasPosition:CanvasPosition = {xCoord:0, yCoord:0};
    if (this.solutionArray.length>0){
    }
    for (let i=0; i<this.solutionArray.length;i++){
      let currentPosition = this.solutionArray[i];
      
      //The function getPositionCenterPoint sets the centerpoint coordinates for canvasPosition variable
      this.getPositionCenterPoint(currentPosition,canvasPosition);
      //***Note, the function above set the values for canvasPosition */

      if (i==0){
        path =new Path2D();
        path.moveTo(0, canvasPosition.yCoord);
      }
      path.lineTo(canvasPosition.xCoord, canvasPosition.yCoord);
      ctx.stroke(path);
      path =new Path2D();
      path.moveTo(canvasPosition.xCoord, canvasPosition.yCoord);
      await sleep(50);;
    }
  }
}


class TestClass {
  index: number;
  direction: string;

  constructor(public i:number, public d:string){
    this.index = i;
    this.direction = d;
  }

}
// ************************************************************
// ******   ENUMERATIONS    ***********************************
// ************************************************************
const enum GridDirection{
  HORIZONTAL = 'horizontal'
  , VERTICAL = 'vertical'
}

enum MoveDirection{
  UP
  , RIGHT
  , DOWN
  , LEFT
}


// ************************************************************
// ******   FUNCTIONS       ***********************************
// ************************************************************

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two seconds later, showing sleep in a loop...');

  // Sleep in loop
  for (let i = 0; i < 5; i++) {
    if (i === 3)
      await sleep(2000);
    console.log(i);
  }
}


function draw() {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas.getContext) {
      var context = canvas.getContext('2d');
  
      context.fillRect(20,20,100,100);
      context.clearRect(40,40,60,60);
      context.strokeRect(45,45,50,50);
    }
  }

  function clickCanvas(){
      console.log("Canvas Clicked");
  }

  function logMousePosition(e){
      console.log(e);
  }

  function trackMouse(e){
        console.log("(" + e.x + ", " + e.y + ")");
  }

  function drawRectangle(e){
      clearMazeCanvas();
      //var rectCanvas = document.getElementById("rectCanvas");
      //var context2 = rectCanvas.getContext('2d');
      //context2.fillRect(100,100,150,150);
  } 


  function initMaze(x?:number, y?:number):void {
      if (x === undefined) {
        let xInput:HTMLInputElement = document.getElementById("mazeWidth") as HTMLInputElement;
        x=xInput.valueAsNumber;
      }

      if(y===undefined){
        let yInput:HTMLInputElement = document.getElementById("mazeHeight") as HTMLInputElement;
        y=yInput.valueAsNumber;
      }

      clearMazeCanvas();
      let mazeCanvas = document.getElementById("mazeCanvas") as HTMLCanvasElement;
      let squareSize:number = Maze.squareSize;
      let wallThickness:number = Maze.wallThickness;
      let borderWidth:number = Maze.borderWidth;
      let myMaze = new Maze(x,y);
      let newMazeWidth:number = myMaze.overallWidth;
      let newMazeHeight:number = myMaze.overallHeight;
      mazeCanvas.width = newMazeWidth;
      mazeCanvas.height = newMazeHeight;
      drawMazeBorder(borderWidth);
      
      let currentDirection:GridDirection = GridDirection["HORIZONTAL"];
      drawMazeGridLines(currentDirection, y-1, squareSize, wallThickness, borderWidth, mazeCanvas)
      
      currentDirection = GridDirection["VERTICAL"];
      drawMazeGridLines(currentDirection, x-1, squareSize, wallThickness, borderWidth, mazeCanvas)
}
  function clearMazeCanvas(){
    let mazeCanvas = document.getElementById("mazeCanvas") as HTMLCanvasElement;
    let context2 = mazeCanvas.getContext('2d');
    context2.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
  }

  
  function drawMazeBorder(borderWidth:number){
    let c = document.getElementById("mazeCanvas") as HTMLCanvasElement;
    let ctx = c.getContext("2d");
    ctx.strokeStyle = 'rgb(50,255,50)';
    ctx.lineWidth = borderWidth;
    console.log(c);
    //ctx.strokeStyle = "#FF0000";
    let mazeBorder = ctx.strokeRect(borderWidth/2, borderWidth/2, c.width-borderWidth, c.height-borderWidth);

    let startPos:number[] = [ctx.lineWidth, ctx.lineWidth];
    let endPos:number[] = [c.width-ctx.lineWidth, c.height-ctx.lineWidth];
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.beginPath();
    ctx.moveTo(startPos[0], startPos[1]);
    ctx.lineTo(endPos[0], endPos[1]);
    ctx.stroke();
  }

  function drawMazeGridLines(direction: GridDirection, numLines: number, squareSize: number,
    wallThickness: number, borderWidth:number, mazeCanvas: HTMLCanvasElement){
     /**
      * Draws the horizontal and vertical grid lines
      */
     let logTag = "drawGridGridLines |" + direction.toString() + "|";
     console.log("Entering " + logTag);
     const ctx:CanvasRenderingContext2D = mazeCanvas.getContext("2d");
     let initialX:number;
     let endX:number;
     let initialY:number;
     let endY:number;
     let incrementX:number;
     let incrementY:number;
     
     ctx.lineWidth = wallThickness;
     ctx.strokeStyle = 'rgb(50,255,50)';

     if(direction === GridDirection["HORIZONTAL"]){
        initialX = borderWidth;
        endX = mazeCanvas.width - borderWidth;  //constant length
        incrementX = 0;

        initialY = borderWidth + squareSize + wallThickness/2;
        incrementY = squareSize + wallThickness;
     } else{
        initialX = borderWidth + squareSize +wallThickness/2;
        incrementX = squareSize + wallThickness;

        initialY = borderWidth;
        endY = mazeCanvas.height - borderWidth; //constant length
        incrementY = 0;
     }

     for(let i=0; i<numLines; i++){
       console.log(logTag + ": in for loop " + i);
       ctx.beginPath();
       //Adjust the begining coordinate
       let startX = initialX + (incrementX * i);
       let startY = initialY + (incrementY * i);
       
       if(direction === GridDirection["HORIZONTAL"]){
         endY = startY;   //Horizontal line, no change in Y
       } else {
         endX = startX;   //Vertical line, no change in X
       }

       ctx.moveTo(startX, startY);
       ctx.lineTo(endX, endY);
       ctx.stroke();
     }

     console.log(logTag + ": Outside for loop");
 }

 function generateSolution(gridSize?:GridSize){
    let xMax:number, yMax:number;
    let maxIterations = 2*(xMax*yMax);
    
    if (gridSize !== undefined){
      xMax=gridSize[0];
      yMax=gridSize[1];
    } else{
      let xElement  = document.getElementById("mazeWidth") as HTMLInputElement;
      xMax = xElement.valueAsNumber;
      let yElement  = document.getElementById("mazeHeight") as HTMLInputElement;
      yMax = yElement.valueAsNumber;
      gridSize = [xMax, yMax];
    }

    //console.log("Maze Dimensions: (" + xMax + ", " + yMax + ")");
    let myMaze:Maze = Maze.getMaze();
    console.log ('Maze created, size is ' + myMaze.getSize());

    //Assign the start position 
    let yStart = Math.floor(Math.random() * yMax);
    console.log("Starting y position: " + yStart);
    let currentPosition:MazePosition = {xPos:0, yPos:yStart};
    myMaze.addPositionToSolution(currentPosition);
    
    //Prepare the loop for generating the solution
    let endReached = false;
    let i = 0;
    while (!endReached){
      let viableMoves:Array<MoveDirection> = myMaze.getViableMoves(currentPosition);
      if (viableMoves.length ==0){
        console.log('No moves possible from %s, adding to deadEnds', JSON.stringify(currentPosition));
        myMaze.addPositionToDeadEnds(currentPosition);
        currentPosition = myMaze.moveToPreviousPositionInSolution();
      } else {

        let proposedMove = Math.floor(Math.random() * viableMoves.length);
        let myMove = viableMoves[proposedMove];
        console.log('Move %d used random number %d to select MoveDirection %d or %s', i,proposedMove, myMove, MoveDirection[myMove]);
        //console.log('Move {$i} is ${myMove}');
        isMoveValid(currentPosition, myMove, myMaze);
        console.log('Back in loop, Current position: (%d , %d)', currentPosition.xPos, currentPosition.yPos);
      }

      //Check Exit conditions
      i++;
      if (currentPosition.xPos == myMaze.getXUpperBound()){
        endReached = true;
        console.log ('Solution has been achieved, exit point %s', JSON.stringify(currentPosition));
      } else if (i>=maxIterations) {
        endReached = true;
        console.log ('Timed out after %d iterations', i);
      }
    }
    myMaze.drawSolution();
  }

 function testEnumValues(){
  console.log ("About to print all the MoveDirection values");
  for(let k=0; k<4; k++){
    console.log('Value for %d is %s', k, MoveDirection[k]);
  }
 }

 function testObjectDraw(c:HTMLCanvasElement){
  const ctx:CanvasRenderingContext2D = c.getContext("2d");
  let myPath = new Path2D();
  myPath.moveTo(10,10);
  myPath.lineTo(100,140);
  ctx.stroke(myPath);

  

 }

  function logSlider(mySlider:HTMLInputElement){
    let slW:number=mySlider.valueAsNumber;
    (<HTMLInputElement> document.getElementById("mazeWidth")).valueAsNumber=slW;
    initMaze();
  }

  function hSliderChange(slider:HTMLInputElement){
    let newHeight:number = slider.valueAsNumber;
    (<HTMLInputElement> document.getElementById("mazeHeight")).valueAsNumber=newHeight;
    initMaze();
  }

  //Array<HTMLCanvasElement>(10);
  
  function constructSolutionArray(rows?:number, columns?:number):any{
    //console.log("Starting...");
    if (rows === undefined) rows=5;
    if (columns === undefined) columns = 5;
    let solutionArray=[];
    for(let i=0; i<rows; i++){
      //console.log('Initializing row %d', i);
      solutionArray[i] = [];
      for(let j=0; j<columns; j++){
        //let logNote:String = ;
        //console.log('About to write row %d, column %d', i, j);
        solutionArray[i][j] = 0;
      }
    }
    let lastRow = solutionArray.length-1;
    let lastColumn = solutionArray[0].length-1;
    //console.log('first: %s and last: %s', solutionArray[0][0], solutionArray[lastRow][lastColumn]);
    return solutionArray;
  }
  
  function isMoveValid(currentPosition:MazePosition, proposedMove:MoveDirection, maze:Maze):boolean{
    let isValid = true;

    //Assign the increment variable for the move
    let yInc = 0;
    let xInc = 0;
    if (proposedMove === MoveDirection.UP) yInc--;
    else if (proposedMove === MoveDirection.DOWN) yInc++;
    else if (proposedMove === MoveDirection.RIGHT) xInc++;
    else if (proposedMove === MoveDirection.LEFT) xInc--;

    //Set the proposedPosition
    let proposedPosition:MazePosition = {xPos: currentPosition.xPos + xInc, yPos:currentPosition.yPos + yInc};
    
    //Verify position is on the maze grid
    let isProposedSolutionOnGrid: Boolean = true;
    if (proposedPosition.xPos > maze.getXUpperBound() || proposedPosition.xPos < 0) isProposedSolutionOnGrid = false;
    if (proposedPosition.yPos >= maze.getYUpperBound() || proposedPosition.yPos < 0) isProposedSolutionOnGrid = false;

    //Verify that the solution doesn't already exist in the solution
    console.log('About to check if position is already in solution');
    let isAlreadyInSolution:boolean = maze.isPositionInArray(proposedPosition, maze.getSolutionArray());
    

    if (!isProposedSolutionOnGrid) {
      //Move is not on Grid
      console.log('Warning, Proposed position (%d , %d) is not on grid, Move Rejected!!', proposedPosition.xPos, proposedPosition.yPos);
      isValid = false;
      console.log();
    } else if(isAlreadyInSolution){
      console.log('Position already in solution (%d, %d), move rejected!', proposedPosition.xPos, proposedPosition.yPos);
      isValid = false;
    
    } else{
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

