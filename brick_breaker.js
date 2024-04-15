let bricks = []
let brickWidth = 60
let brickHeight = 30
let brickSpace = 20
let paddelWidth = 150
let paddelY;

let ballX;
let ballY;
let ballSpeedX=0
let ballSpeedY=0;
let ballRadius=10;

let isGameOver=false;

function setup() {
  createCanvas(730, 550);
  ballX = width/2;
  ballY = height-100;
  paddelY = height-50;
  for (let i=brickSpace; i<width; i+= brickWidth+brickSpace){
    for (let j = brickSpace+brickHeight; j<height/2; j+=brickHeight+brickSpace){
      bricks.push([i,j]);
    }
  }
  textSize(50);
}

function draw() {
  if (ballSpeedX===0 && ballSpeedY===0 && mouseX !== 0){
    ballSpeedX = 4;
    ballSpeedY = -6;
  }
  
  background(0);
  fill(180, 0, 0);
  circle(ballX, ballY, ballRadius*2);
  if (!isGameOver){
    ballX+=ballSpeedX;
    ballY+=ballSpeedY;
  }
  if(ballX+ballRadius>=width){
    ballX = width-ballRadius;
    ballSpeedX*=-1;
  }
 if(ballX-ballRadius<=0){
      ballX = ballRadius;
      ballSpeedX*=-1;
  }

  if(ballY-ballRadius<=0){
      ballY = ballRadius;
      ballSpeedY*=-1;
  }
  
  if(ballX>=mouseX-paddelWidth/2 && ballX<=mouseX+paddelWidth/2 && ballY+ballRadius>=paddelY && ballY+ballRadius <= paddelY+ballSpeedY){
    ballSpeedY*=-1;
    ballY=paddelY-ballRadius;
  }
  
  fill(120, 180, 255);
  for (let brick=0; brick<bricks.length; brick++){
    let b = bricks[brick]
    rect(b[0], b[1], brickWidth, brickHeight);
    if (ballX-ballRadius <= b[0]+brickWidth && ballX+ballRadius>=b[0] && ballY+ballRadius >= b[1] && ballY-ballRadius <= b[1]+brickHeight){
      bricks.splice(brick, 1);
      if (ballX+ballRadius>=b[0] && ballX-ballRadius<=b[0]+brickWidth){
        ballSpeedY *= -1;
      } else if (ballY+ballRadius>=b[1] && ballY-ballRadius<=b[1]+brickHeight){
        ballSpeedX *= -1;
      }
      brick--;
    }
  }
  fill(0, 180, 0);
  rect(mouseX-paddelWidth/2, paddelY, paddelWidth, 20);
  
  if(bricks.length == 0){
    isGameOver = true;
    text("You won!", width/2-120, 100);
  }
  if(ballY+ballRadius>=height){
    isGameOver = true;
    fill(180, 0, 0)
    text("Game Over!", width/2-120, 100);
  }
  
}
