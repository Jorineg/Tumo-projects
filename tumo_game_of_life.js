let size = 100;
let block_size=8;
let matrix = Array(size).fill().map(() => Array(size).fill(0));
let global_step = 0;

function rand_elem(items){
    return items[Math.floor(Math.random()*items.length)];
}

function setup() {
  createCanvas(size*block_size, size*block_size);
  
  let rand_fill = (x,y,_) => {
    if (Math.random()>0.7) matrix[x][y] = new Grass();
    else if (Math.random()>0.9) matrix[x][y] = new Grazer();
    else if (Math.random()>0.9) matrix[x][y] = new GreenGrass();
    else if (Math.random()>0.99) matrix[x][y] = new Tyrant();
    else if (Math.random()>0.98) matrix[x][y] = new Meat();
    else if (Math.random()>0.999) matrix[x][y] = new Hunter();
  }
  iter_matrix(rand_fill);
  matrix[int(size/2)][int(size/2)] = new Bulldozer();
  frameRate(30);
  
  // drawing the outline results in a huge performance drop
  //strokeWeight(.5)
  noStroke();
}


function draw() {
  
  let step_func=(x, y, o)=>{
    if (o instanceof GridObject && o.step_count==global_step)o.step(x, y);
  }
  iter_matrix(step_func);
  
  let draw_mat = (x, y, obj)=>{
    x = int(x)
    y = int(y)
    c = "white"
    if (obj instanceof Grass) c = "green";
    else if (obj instanceof GreenGrass) c = "lightgreen";
    else if (obj instanceof Grazer) c = "yellow";
    else if (obj instanceof Tyrant) c = "red";
    else if (obj instanceof Meat) c = "blue";
    else if (obj instanceof Hunter) c = "orange";
    else if (obj instanceof Bulldozer) c = "black";
    fill(c);
    if (!(obj instanceof Hunter)){
      rect(x*block_size, y*block_size, block_size, block_size);
    }else{
      circle((x+.5)*block_size, (y+.5)*block_size, block_size*3);
    }
    
  }
  iter_matrix(draw_mat)
  global_step++;
}


class GridObject{
  constructor(){
    this.age=0;
    this.step_count=global_step+1;
  }
  step(x, y){
    this.age++;
    let neighbours = get_neighbours(x,y);
    if (this instanceof Meat || this instanceof Hunter || this instanceof Bulldozer){
      n = get_neighbours_far(x,y);
    }
    let elems = neighbours.map((x) => [x, matrix[x[0]][x[1]]]);
    this.child_step(x, y, elems)
    this.step_count++;
  }
}

class Grass extends GridObject{
  child_step(x, y, elems){
    if (this.age >= 6){
      elems = elems.filter((x)=> x[1]===0 || x[1] instanceof GreenGrass);
      if (elems.length>0){
        c = rand_elem(elems)[0];
        matrix[c[0]][c[1]] = new Grass();
        this.age=0;
      }
    }
  }
}

class GreenGrass extends GridObject{
  child_step(x, y, elems){
    if (this.age >= 2){
      elems = elems.filter((x)=> x[1]===0);
      if (elems.length>0){
        c = rand_elem(elems)[0];
        matrix[c[0]][c[1]] = new GreenGrass();
        this.age=0;
      }
    }
  }
}

class Grazer extends GridObject{
  constructor(){
    super()
    this.food=5;
  }
  child_step(x, y, elems){
    let grass_elems = elems.filter((x)=> (x[1] instanceof Grass || x[1] instanceof GreenGrass));
    if (grass_elems.length>0){
      let g = rand_elem(grass_elems)[0];
      matrix[g[0]][g[1]] = this;
      matrix[x][y] = 0;
      x = g[0];
      y = g[1];
      this.food++;
    }else{
      this.food--;
    }
    
    if (this.food >= 10){
      let spawn_elems = elems.filter((x)=> (x[1] === 0) || (x[1] instanceof Grass)|| x[1] instanceof GreenGrass);
      if (spawn_elems.length>0){
        let c = rand_elem(spawn_elems)[0];
        matrix[c[0]][c[1]] = new Grazer();
        this.food-=5;
      }
    }else if (this.food<=0){
      matrix[x][y] = 0;
    }
  }
}

class Tyrant extends GridObject{
  constructor(){
    super()
    this.food=50;
  }
  child_step(x, y, elems){
    let grazer_elems = elems.filter((x)=> (x[1] instanceof Grazer || x[1] instanceof Meat));
    let other_elems = elems.filter((x)=> !(x[1] instanceof Tyrant || x[1] instanceof Bulldozer || x[1] instanceof Hunter));

    if (grazer_elems.length>0){
      let g = rand_elem(grazer_elems)[0];
      matrix[g[0]][g[1]] = this;
      matrix[x][y] = 0;
      x = g[0];
      y = g[1];
      this.food+=10;
    }else if(other_elems.length>0 && Math.random()<.1){
      let g = rand_elem(other_elems)[0];
      matrix[g[0]][g[1]] = this;
      matrix[x][y] = 0;
      x = g[0];
      y = g[1];
      this.food--;
    }else{
      this.food--;
    }
    
    if (this.food >= 100){
      let spawn_elems = elems.filter((x)=> !(x[1] instanceof Tyrant || x[1] instanceof Bulldozer));
      if (spawn_elems.length>0){
        let c = rand_elem(spawn_elems)[0];
        matrix[c[0]][c[1]] = new Tyrant();
        this.food-=50;
      }
    }else if (this.food<=0){
      matrix[x][y] = 0;
    }
  }
}

class Meat extends GridObject{
  constructor(){
    super()
    this.food=40;
  }
  child_step(x, y, elems){
    let grazer_elems = elems.filter((x)=> (x[1] instanceof Grazer));
    let other_elems = elems.filter((x)=> (x[1] instanceof GreenGrass || x[1] == 0));

    if (grazer_elems.length>0){
      let g = rand_elem(grazer_elems)[0];
      matrix[g[0]][g[1]] = this;
      matrix[x][y] = 0;
      x = g[0];
      y = g[1];
      this.food+=5;
    }else if (other_elems.length>0){
      let g = rand_elem(other_elems)[0];
      matrix[g[0]][g[1]] = this;
      matrix[x][y] = 0;
      x = g[0];
      y = g[1];
      this.food--;
    }else{
      this.food--;
    }
    
    if (this.food >= 60){
      let spawn_elems = elems.filter((x)=> !(x[1] instanceof Tyrant || x[1] instanceof Bulldozer));
      if (spawn_elems.length>0){
        let c = rand_elem(spawn_elems)[0];
        matrix[c[0]][c[1]] = new Meat();
        this.food-=20;
      }
    }else if (this.food<=0){
      matrix[x][y] = 0;
    }
  }
}

class Hunter extends GridObject{
  constructor(){
    super()
    this.food=200;
  }
  child_step(x, y, elems){
    let grazer_elems = elems.filter((x)=> (x[1] instanceof Tyrant || x[1] instanceof Meat || x[1] instanceof Hunter));
    let other_elems = elems.filter((x)=> !(x[1] instanceof Hunter || x[1] instanceof Bulldozer));

    if (grazer_elems.length>0){
      let g = rand_elem(grazer_elems)[0];
      matrix[g[0]][g[1]] = this;
      matrix[x][y] = 0;
      x = g[0];
      y = g[1];
      this.food+=30;
    }else if(other_elems.length>0){
      let g = rand_elem(other_elems)[0];
      matrix[g[0]][g[1]] = this;
      matrix[x][y] = 0;
      x = g[0];
      y = g[1];
      this.food--;
    }else{
      this.food--;
    }
    
    if (this.food >= 600){
      let spawn_elems = elems.filter((x)=> !(x[1] instanceof Tyrant || x[1] instanceof Bulldozer));
      if (spawn_elems.length>0){
        let c = rand_elem(spawn_elems)[0];
        matrix[c[0]][c[1]] = new Hunter();
        this.food-=400;
      }
    }else if (this.food<=0){
      matrix[x][y] = 0;
    }
  }
}

class Bulldozer extends GridObject{
  constructor(){
    super()
    this.food=400;
    this.setSpeed();
  }
  
  setSpeed(){
    this.xspeed=int(Math.random()*4-2)
    this.yspeed=int(Math.random()*4-2)
    if (this.xspeed==0 && this.yspeed==0)this.setSpeed();
  }
  
  child_step(x, y, elems){
    x = int(x)
    y = int(y)
    this.food-=2;
    for (let elem of elems){
      let e = elem[0];
      if (matrix[e[0]][e[1]]!=0){
        this.food+=1;
      }
      matrix[e[0]][e[1]] = 0;
    }
    if (Math.random()>.99)this.setSpeed();
    
    if (Math.random()>.4){
      let new_x = x + this.xspeed;
      let new_y = y + this.yspeed;
      if (new_x<0) {
        new_x=1;
        this.xspeed *=-1;
      }
      if (new_x >= size){
        new_x=size-2;
        this.xspeed *=-1;
      }
      if (new_y<0) {
        new_y=1;
        this.yspeed *=-1;
      }
      if (new_y >= size){
        new_y=size-2;
        this.yspeed *=-1;
      }
      matrix[new_x][new_y] = this;
      matrix[x][y] = 0;
      x = new_x;
      y = new_y;
    }  
    
    
    if (this.food >= 1000){
      if (elems.length>0){
        let c = rand_elem(elems)[0];
        matrix[c[0]][c[1]] = new Bulldozer();
        this.food-=600;
      }
    }else if (this.food<=0){
      //matrix[x][y] = 0;
    }
  }
  
}



function iter_matrix(func){
  for (let row in matrix){
    for (let col in matrix[row]){
      let obj = matrix[row][col];
      func(row, col, obj);
    }
  }
}

function get_neighbours(x,y){
  x = parseInt(x);
  y = parseInt(y);
  let l = [[x-1,y-1], [x, y-1], [x+1, y-1], [x+1, y], [x+1, y+1], [x, y+1], [x-1, y+1], [x-1, y]]
  l = l.filter((c)=>c[0]>=0&&c[1]>=0&&c[0]<size&&c[1]<size);
  return l
}

function get_neighbours_far(x,y){
  x = parseInt(x);
  y = parseInt(y);
  let l = [[x-1,y-1], [x,y-1], [x+1,y-1], [x+1,y], [x+1,y+1], [x,y+1], [x-1,y+1], [x-1,y],[x-2,y-1], [x-2,y], [x-2,y+1], [x-1,y-2], [x-1,y+2], [x,y-2], [x,y+2], [x+1,y-2], [x+1,y+2], [x+2,y-1], [x+2,y], [x+2,y+1], [x-2,y-2], [x+2,y-2], [x+2,y+2], [x-2,y+2]] 
  l = l.filter((c)=>c[0]>=0&&c[1]>=0&&c[0]<size&&c[1]<size);
  return l
}

