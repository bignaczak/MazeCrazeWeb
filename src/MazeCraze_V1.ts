export {}

// ************************************************************
// ******   CUSTOM TYPES    ***********************************
// ************************************************************
type GridSize = [number, number];
type MazePosition={xPos:number, yPos:number};
type CanvasPosition={xCoord:number, yCoord:number};
type RectangleCoord={canvasPosition:CanvasPosition, width:number, height:number};

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
  public static cellInterval:number = Maze.squareSize + Maze.wallThickness;
  public static theMaze:Maze; 


  constructor(xSize:number, ySize:number){
    this.size = [xSize, ySize];
    this.solutionArray = [];
    this.deadEndArray = [];
    this.overallWidth = this.size[0]*(Maze.cellInterval) + (2*Maze.borderWidth) - Maze.wallThickness;
    this.overallHeight = this.size[1]*(Maze.cellInterval) + (2*Maze.borderWidth) - Maze.wallThickness;
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

  public indexOfPositionInArray(proposedPosition:MazePosition, array:Array<MazePosition>):number{
    let debugOn = false;
    let indexOfPosition: number = -1;
    //console.log(JSON.stringify(this.solutionArray));
    for(let i=0; i<array.length; i++){
      let existingPosition:MazePosition = array[i];
      //console.log('For loop %d Checking proposed (%s, %s) against existing (%s, %s)',i, proposedPosition.xPos, proposedPosition.yPos, existingPosition.xPos, existingPosition.yPos);
      //if(existingPosition.xPos == proposedPosition.xPos && existingPosition.yPos == proposedPosition.yPos){
      if(JSON.stringify(existingPosition) == JSON.stringify(proposedPosition)){
        indexOfPosition = i;
        break;
      }
    }
    if (debugOn) console.log('Looking up position (%d, %d) and found at index %d in %s', proposedPosition.xPos, proposedPosition.yPos, indexOfPosition, JSON.stringify(array));
    //console.log('inSolution result %s', inSolution);
    return indexOfPosition;
  }


  public addPositionToDeadEnds(currentPosition:MazePosition, removeFromSolutionArray?:boolean):void{
    if(removeFromSolutionArray === undefined) removeFromSolutionArray = true;
    let deadEnd:MazePosition = {xPos: currentPosition.xPos, yPos: currentPosition.yPos};
    
    //See if the Position is contained in the solution array and erase it
    let isAlreadyInSolution:boolean = this.isPositionInArray(deadEnd, this.solutionArray);
    if (removeFromSolutionArray && isAlreadyInSolution){
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

  public moveToPreviousPositionInArray(currentIndex:number, positionArray:Array<MazePosition>):MazePosition{
    let debugOn = false;
    if(debugOn) console.log('Preparing to move from current index: %d in array %s',currentIndex, JSON.stringify(positionArray));
    let previousIndex:number = (currentIndex-1);
    let referencePosition = positionArray[previousIndex];
    let returnPosition:MazePosition = {xPos:referencePosition.xPos, yPos:referencePosition.yPos};
    if(debugOn) console.log('Previous index: %d returned (%d, %d)',previousIndex, returnPosition.xPos, returnPosition.yPos);
    return returnPosition;
  }

  private makeMove(currentPosition:MazePosition, proposedMove:MoveDirection):void{
    //Assign the increment variable for the move
    let yInc = 0;
    let xInc = 0;
    if (proposedMove === MoveDirection.UP) yInc--;
    else if (proposedMove === MoveDirection.DOWN) yInc++;
    else if (proposedMove === MoveDirection.RIGHT) xInc++;
    else if (proposedMove === MoveDirection.LEFT) xInc--;

    //Set the proposedPosition
    let proposedPosition:MazePosition = {xPos: currentPosition.xPos + xInc, yPos:currentPosition.yPos + yInc};    
    currentPosition.xPos = proposedPosition.xPos;
    currentPosition.yPos = proposedPosition.yPos;
  }

  public selectMoveFromViableMoves(viableMoves:Array<MoveDirection>):MoveDirection{
    let debugOn = false;
    //Choose random direction from viable options
    let selectedMove:MoveDirection;
    let proposedMove = Math.floor(Math.random() * viableMoves.length);
    selectedMove = viableMoves[proposedMove];
    if (debugOn) console.log('Move used random number %d to select MoveDirection %d or %s', proposedMove, selectedMove, MoveDirection[selectedMove]);

    return selectedMove;
  }

  public removePositionFromSolution(deadEnd:MazePosition):void{
    for (let i=0; i<this.solutionArray.length; i++){
      if(JSON.stringify(deadEnd) == JSON.stringify(this.solutionArray[i])){
        this.solutionArray.splice(i,1);
      }
    }
  }

  public calculateSolution(){
    let debugOn = false;
    if(debugOn) console.log ('Maze created, size is ' + this.getSize());
    let xMax:number, yMax:number;
    let maxIterations = 2*(xMax*yMax);
    
    xMax = this.getXUpperBound();
    yMax = this.getYUpperBound();
   
    //Assign the start position 
    let yStart = Math.floor(Math.random() * yMax);
    if (debugOn) console.log("Starting y position: " + yStart);
    let currentPosition:MazePosition = {xPos:0, yPos:yStart};
    this.addPositionToSolution(currentPosition);
    
    //Prepare the loop for generating the solution
    let endReached = false;
    let i = 0;
    while (!endReached){
      let viableMoves:Array<MoveDirection> = this.getViableMoves(currentPosition);
      if (viableMoves.length ==0){
        if (debugOn) console.log('No moves possible from %s, adding to deadEnds', JSON.stringify(currentPosition));
        this.addPositionToDeadEnds(currentPosition);
        currentPosition = this.moveToPreviousPositionInSolution();
      } else {
        //Choose random direction from viable options
        let myMove = this.selectMoveFromViableMoves(viableMoves);
        
        //Perform the move  NOTE:  current position is updated with the move
        this.makeMove(currentPosition, myMove);
        this.addPositionToSolution(currentPosition);
        if (debugOn) console.log('and added to solution array, which is now size %d', this.getSolutionArray().length);
      }

      //Check Exit conditions
      i++;
      if (currentPosition.xPos == this.getXUpperBound()){
        endReached = true;
        console.log ('Solution has been achieved, exit point %s', JSON.stringify(currentPosition));
      } else if (i>=maxIterations) {
        endReached = true;
        console.log ('Timed out after %d iterations', i);
      }
    }
    this.removeWallsForPath();
    this.calculateDeadEnds();
    this.drawSolution();
  }

  public calculateDeadEnds(){
    let debugOn=false
    if(debugOn) console.log('Entering calculateDeadEnds');
    //clear the original dead end array
    this.deadEndArray.length = 0;

    //copy the solutions array.  This will be used as a branching off point for the deadEndsArray
    let deadEndStartPoints:Array<MazePosition> = this.solutionArray.slice();
    if(debugOn) console.log('deadEndStartPoints length = %d', deadEndStartPoints.length);
    let i = 0;
    //while (deadEndStartPoints.length && i<10){
    while (deadEndStartPoints.length){
      //Now pick a random number along the solution array
      //This picks a number in the first half of maze solution
      let index=Math.floor(Math.random()*deadEndStartPoints.length/2);
      //for odd iterations, start the deadendpath at the back end of the maze
      if (i%2==1) {
        index=deadEndStartPoints.length - 1 - index;
        if (index> (deadEndStartPoints.length-1)){
          index = deadEndStartPoints.length-1;
        }
      }
      let referencePosition:MazePosition = deadEndStartPoints[index];
      let currentPosition:MazePosition = {xPos:referencePosition.xPos, yPos:referencePosition.yPos};
      this.createDeadEndPath(currentPosition);
      deadEndStartPoints.splice(index,1);
      if(debugOn) console.log('Index %d removed, now have %d startpoints remaining', index, deadEndStartPoints.length);
      i++;
    }
  }
  
  //TODO:  This logic needs to be cleaned
  //Each path must have individual backtracking capability
  public createDeadEndPath(currentPosition:MazePosition){
    let exitLoop = false;
    let i:number=0;
    let ctx = this.getCanvasContext();

    //while(!exitLoop && i<200 ){
    while(!exitLoop){
      let viableMoves:Array<MoveDirection> = this.getViableMoves(currentPosition, false);
      //If there are any viable moves from starting point
      if (viableMoves.length){
        //proceed with the move and remove the wall in the process
        console.log('Making deadEnd move from position(%d, %d)', currentPosition.xPos, currentPosition.yPos);
        let nextMove = this.selectMoveFromViableMoves(viableMoves);
        let nextPosition:MazePosition = {xPos:currentPosition.xPos, yPos:currentPosition.yPos};
        this.makeMove(nextPosition, nextMove);
        this.removeWall(currentPosition, nextPosition, ctx);
        this.makeMove(currentPosition,nextMove);
        this.addPositionToDeadEnds(currentPosition,false);
      } else {
        //No moves to be made, so backup until a move can be made
        console.log('No move available from position (%d, %d)', currentPosition.xPos, currentPosition.yPos);
        let backAtStart:boolean = this.isPositionInArray(currentPosition,this.solutionArray);
        if(backAtStart) {
          exitLoop=true;
          console.log('Back on solution, preparing to exit...');
        } else {
          //move back a spot
          let currentIndex=this.indexOfPositionInArray(currentPosition,this.deadEndArray);
          if(currentIndex<=0) {
            exitLoop=true;
          } else{
            currentPosition = this.moveToPreviousPositionInArray(currentIndex, this.deadEndArray);
            console.log('moved back to (%d, %d)', currentPosition.xPos, currentPosition.yPos)
          }
        }
      }
      //Now recalculate viable moves for the currentPosition
      i++;
    }
    console.log('Exited deadEnd loop after %d iterations', i);

  }

  public getViableMoves(currentPosition:MazePosition, allowExit?:boolean):Array<MoveDirection>{
    let debugOn=false;
    if(allowExit === undefined){
      allowExit=true;
    }
    
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
      
      if (debugOn) console.log('Cur Pos %s and direction %s to proposed pos %s', JSON.stringify(currentPosition), MoveDirection[i], JSON.stringify(proposedPosition));
      //Verify position is on the maze grid.  If allowExit is true, allow for X to equal upper bound
      let isProposedSolutionOnGrid: Boolean = true;
      let xLimit = this.getXUpperBound();
      if(!allowExit) xLimit = this.getXUpperBound()-1;

      if (proposedPosition.xPos > xLimit || proposedPosition.xPos < 0) isProposedSolutionOnGrid = false;
      if (proposedPosition.yPos >= this.getYUpperBound() || proposedPosition.yPos < 0) isProposedSolutionOnGrid = false;

      //Verify that the proposed position doesn't already exist in the solution
      let isAlreadyInSolution:boolean = this.isPositionInArray(proposedPosition, this.solutionArray);
      
      //Verify that the proposed position doesn't already exist in the deadEndArray
      let isAlreadyInDeadEnds:boolean = this.isPositionInArray(proposedPosition, this.deadEndArray);

      if (isProposedSolutionOnGrid && !isAlreadyInSolution && !isAlreadyInDeadEnds){
        //If on the grid and not already in the solution set
        viableMoves.push(proposedDirection);
      } else if (!isProposedSolutionOnGrid){
        if (debugOn) console.log('From position %s, moving %s is off grid', JSON.stringify(currentPosition), proposedDirection);
      } else if (isAlreadyInSolution){
        if (debugOn) console.log('From position %s, moving %s to proposed position of %s is already in solution', JSON.stringify(currentPosition), proposedDirection, JSON.stringify(proposedPosition));
      } else if (isAlreadyInDeadEnds){
        if (debugOn) console.log('From position %s, moving %s to proposed position of %s is already in deadEndArray', JSON.stringify(currentPosition), proposedDirection, JSON.stringify(proposedPosition));
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

  public removeWallsForPath(){
    //Loop through the cells in the solution set and cover up the green walls with background color
    
    //Setup the maze canvas and set the background color
    let ctx = this.getCanvasContext("mazeCanvas");;
    
    //The final entry in the solution array is outside of the maze so ignore it
    let lastEntryIndex = (this.solutionArray.length - 1);
    console.log('Final entry in sollution array is X: %d', this.solutionArray[this.solutionArray.length-1].xPos);
    
    for(let i=0; i<lastEntryIndex; i++){
    //for(let i=0; i<5; i++){
      let currentPosition:MazePosition = this.solutionArray[i];
      let top:number, left:number, width:number, height:number;

      if(i==0 || i==lastEntryIndex){
        //First, remove the left wall for the start position
        top = Maze.borderWidth + (currentPosition.yPos*Maze.cellInterval);
        
        if (i==0){
          left=0;
        } else {
          left=Maze.borderWidth + currentPosition.yPos*Maze.cellInterval + Maze.squareSize;
        }

        width = Maze.borderWidth;
        height = Maze.squareSize;
        ctx.fillRect(left, top, width, height);
      }

      //Don't process for the last cell in the solution array
      if(i < lastEntryIndex){
        let nextPosition = this.solutionArray[i+1];
        this.removeWall(currentPosition, nextPosition, ctx);
      }
    }
  }

  private getCanvasContext(elementID?:string):CanvasRenderingContext2D{
    //Setup the maze canvas and set the background color
    if(elementID===undefined) elementID="mazeCanvas";
    let mazeCanvas = document.getElementById(elementID) as HTMLCanvasElement;
    let ctx = mazeCanvas.getContext('2d');
    let backgroundStyle = getComputedStyle(mazeCanvas);
    ctx.strokeStyle = backgroundStyle.getPropertyValue('background-color');
    ctx.fillStyle = backgroundStyle.getPropertyValue('background-color')
    return ctx;
  }
  private removeWall(currentPosition:MazePosition, nextPosition:MazePosition, ctx:CanvasRenderingContext2D):void{
    //Stroke a rectangle over the existing gridline to remove the wall
    let dir:MoveDirection = this.getMoveDirection(currentPosition, nextPosition);
    console.log ('Move is %d or %s', dir, MoveDirection[dir]);
    console.log('Current Position (%d, %d) --> (%d, %d)', currentPosition.xPos, currentPosition.yPos, nextPosition.xPos, nextPosition.yPos);
    let rectCoord:RectangleCoord = this.getRectangle(currentPosition, dir);
    ctx.fillRect(rectCoord.canvasPosition.xCoord, rectCoord.canvasPosition.yCoord, rectCoord.width, rectCoord.height);
  }

  private getMoveDirection(currentPosition:MazePosition, nextPosition:MazePosition):MoveDirection{
    //Determine the move direction so the wall between them can be elimiated
    let dir:MoveDirection;
    if (nextPosition.xPos > currentPosition.xPos) {
      dir = MoveDirection.RIGHT;
    }else if(nextPosition.xPos < currentPosition.xPos) {
      dir = MoveDirection.LEFT;
    }else if(nextPosition.yPos>currentPosition.yPos) {
      dir = MoveDirection.DOWN;
    }else {
      dir = MoveDirection.UP;
    }
    return dir;
  }

  private getRectangle(mazePosition:MazePosition, moveDir:MoveDirection):RectangleCoord{
    //Return the coordiantes for a rectangle meant to cover the gridline of the maze
    //Effectively removing the border (but actually just drawing over it)
    let top:number, left:number, width:number, height:number;

    if (moveDir === MoveDirection.RIGHT) {
      top = Maze.borderWidth + (mazePosition.yPos*Maze.cellInterval);
      left = (Maze.borderWidth + Maze.squareSize) + (mazePosition.xPos * Maze.cellInterval);
      width = Maze.borderWidth;
      height = Maze.squareSize;
    }else if(moveDir === MoveDirection.LEFT) {
      top = Maze.borderWidth + (mazePosition.yPos*Maze.cellInterval);
      left = (Maze.borderWidth + Maze.squareSize) + ((mazePosition.xPos - 1) * Maze.cellInterval);
      width = Maze.borderWidth;
      height = Maze.squareSize;
    }else if(moveDir === MoveDirection.DOWN) {
      top = Maze.borderWidth+Maze.squareSize + (mazePosition.yPos * Maze.cellInterval);
      left = (Maze.borderWidth) + (mazePosition.xPos * Maze.cellInterval);
      width = Maze.squareSize;
      height = Maze.wallThickness;
    }else {  
      //moveDir is UP
      top = Maze.borderWidth+Maze.squareSize + ((mazePosition.yPos - 1) * Maze.cellInterval);
      left = (Maze.borderWidth) + (mazePosition.xPos * Maze.cellInterval);
      width = Maze.squareSize;
      height = Maze.wallThickness;
    }
    
    let topLeft:CanvasPosition = {xCoord:left, yCoord: top};
    let returnRect:RectangleCoord = {canvasPosition:topLeft, width: width, height:height};
    return returnRect;


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
      drawMazeBorder();
      
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

  
  function drawMazeBorder(){
    let c = document.getElementById("mazeCanvas") as HTMLCanvasElement;
    let ctx = c.getContext("2d");
    ctx.strokeStyle = 'rgb(50,255,50)';
    let borderWidth = Maze.borderWidth;
    ctx.lineWidth = borderWidth;
    console.log(c);
    //ctx.strokeStyle = "#FF0000";
    let mazeBorder = ctx.strokeRect(borderWidth/2, borderWidth/2, c.width-borderWidth, c.height-borderWidth);

    /*  This is the diagnol line that was used as an early test
    let startPos:number[] = [ctx.lineWidth, ctx.lineWidth];
    let endPos:number[] = [c.width-ctx.lineWidth, c.height-ctx.lineWidth];
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.beginPath();
    ctx.moveTo(startPos[0], startPos[1]);
    ctx.lineTo(endPos[0], endPos[1]);
    ctx.stroke();
    */
  }

  function drawMazeGridLines(direction: GridDirection, numLines: number, squareSize: number,
    wallThickness: number, borderWidth:number, mazeCanvas: HTMLCanvasElement){
     /**
      * Draws the horizontal and vertical grid lines
      */
     let debugOn = false;
     let logTag = "drawGridGridLines |" + direction.toString() + "|";
     if (debugOn) console.log("Entering " + logTag);
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
       if (debugOn) console.log(logTag + ": in for loop " + i);
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

     if (debugOn) console.log(logTag + ": Outside for loop");
 }

 function generateSolution(gridSize?:GridSize){
  let myMaze:Maze = Maze.getMaze();
  myMaze.calculateSolution();  
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
      

    }
    return isValid;
  }

