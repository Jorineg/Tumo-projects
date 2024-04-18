let pieces = Array.from({length: 3}, () => Array(3).fill(0));
let w;
let space = 20;
let isPlayerX = true;

function setup() {
  createCanvas(500, 500);
  noFill();
  strokeWeight(10);
  strokeCap(ROUND);
  w = width/3;
}

function draw() {
  background(220);
  drawGrid();
  for(let i=0;i<pieces.length;i++){
    for(let j=0;j<pieces[0].length;j++){
      drawPiece(j, i, pieces[i][j], false);
    }
  }
  drawPiece(Math.floor(mouseX/w), Math.floor(mouseY/w), isPlayerX?1:2, true);
}

function mousePressed(){
  pieces[Math.floor(mouseY/w)][Math.floor(mouseX/w)] = isPlayerX?1:2;
  isPlayerX = !isPlayerX;
}

function drawPiece(x, y, kind, isPreview){
  if(kind === 1){
    stroke(255, 100, 100, isPreview?100:255);
    line(w*x+space, w*y+space, w*(x+1)-space, w*(y+1)-space);
    line(w*x+space, w*(y+1)-space, w*(x+1)-space, w*y+space);
  }else if(kind === 2){
    stroke(100, 100, 255, isPreview?100:255);
    ellipse((x+0.5)*w, (y+0.5)*w, w-2*space, w-2*space);
  }
}

function drawGrid(){
  stroke(80)
  line(width/3, 10, width/3, height-10);
  line(width/3*2, 10, width/3*2, height-10);
  line(10, height/3, width-10, height/3);
  line(10, height/3*2, width-10, height/3*2);
}
