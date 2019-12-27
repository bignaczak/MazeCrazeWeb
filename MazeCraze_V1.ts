export {}

function myFunc(){
    document.getElementById("outputField").innerHTML = "jojo was here"
    console.log(22);
};


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

  const enum GridDirection{
    HORIZONTAL = 'horizontal'
    , VERTICAL = 'vertical'
  }


  function initMaze(x:number, y:number):void {
      clearMazeCanvas();
      let mazeCanvas = document.getElementById("mazeCanvas") as HTMLCanvasElement;
      let squareSize:number = 25;
      let wallThickness:number = 2;
      let borderWidth:number = 10;
      let newMazeWidth:number = x*(squareSize+wallThickness) + (2*borderWidth);
      let newMazeHeight:number = y*(squareSize+wallThickness) + (2*borderWidth);
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

  function logSlider(mySlider:HTMLInputElement){
    let slW:number=mySlider.valueAsNumber;
    (<HTMLInputElement> document.getElementById("mazeWidth")).valueAsNumber=slW;
  }

  function hSliderChange(slider:HTMLInputElement){
    let newHeight:number = slider.valueAsNumber;
    (<HTMLInputElement> document.getElementById("mazeHeight")).valueAsNumber=newHeight;
  }

  //Array<HTMLCanvasElement>(10);
  let c = document.getElementById("mazeCanvas") as HTMLCanvasElement;
  const ctx:CanvasRenderingContext2D = c.getContext("2d");

  let lines = c.getElementsByClassName('vLine');
  console.log("RedRabbit");
  
