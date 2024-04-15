let dir = "e"
let blockSize = 15;
let mapBlocksX = 30;
let mapBlocksY = 20;

let snake = [[mapBlocksX/2, mapBlocksY/2]]
let allSpots = []
let food;

function setup() {
  createCanvas(blockSize*mapBlocksX, blockSize*mapBlocksY);
  frameRate(6)
  for(let i=0; i<mapBlocksX; i++){
    for(let j=0; j<mapBlocksY; j++){
      allSpots.push([i,j]);
    }
  }
  spawnFood();
}

function draw() {
  background(220);
  
  fill(140, 200, 0);
  for(let snakePart in snake){
    let s = snake[snakePart];
    rect(s[0]*blockSize, s[1]*blockSize, blockSize, blockSize);
  }
  
  fill (255, 0, 150);
  rect(food[0]*blockSize, food[1]*blockSize, blockSize, blockSize);
  
  let f = snake[0];  
  if(dir == "r"){
    snake.unshift([f[0]+1, f[1]])
  }
    if(dir == "l"){
    snake.unshift([f[0]-1, f[1]])
  }
    if(dir == "u"){
    snake.unshift([f[0], f[1]-1])
  }
  if(dir == "d"){
    snake.unshift([f[0], f[1]+1])
  }
  if (dir != "e"){
    if (f[0] != food[0] || f[1] != food[1]){
      snake.pop(); 
    }else{
      spawnFood();
    }
  }
  
  if (!f || f[0] < 0 || f[0] >= mapBlocksX || f[1]<0 || f[1] >= mapBlocksY){
    dir = "e";
    textSize(50)
    text("Game Over", width/2-120, 100);
  }
}

function spawnFood(){
  let freeSpots = [...allSpots];
  for(let snakePart in snake){
    let s = snake[snakePart];
    let index = freeSpots.indexOf(s);
    if (index !== -1){
      freeSpots.splice(index, 1);
    }
  }
  food = freeSpots[int(random(0, freeSpots.length))];
}

function keyPressed(){
  if (keyCode == UP_ARROW && dir != "d")dir = "u";
  if (keyCode == DOWN_ARROW && dir != "u")dir = "d";
  if (keyCode == RIGHT_ARROW && dir != "l")dir = "r";
  if (keyCode == LEFT_ARROW && dir != "r")dir = "l";
  
}
