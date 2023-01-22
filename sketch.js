/*
Code created by Sofia Taipa
Last Update: 14/11/2022

Inspired by the Connections paintings by Nuno Barreto
*/

const NUM_SPRINKLES = 80;
const NUM_GRID = 4;
const NUM_VERTEX = 5;

let spc;

let colorPallete;
let angles = [0, 90, 180, 270];

let sprinkles = [];
let doors = [];

function setup() {
  createCanvas(800, 800);
  
  angleMode(DEGREES);
  strokeCap(SQUARE);
  rectMode(CENTER);
   
  // Creation of the color pallete
  let purplish = color(95, 15, 64);
  let bluish = color(25, 96, 162);
  let reddish = color(204, 3, 30);
  let yellowish = color(251, 189, 36);
  let greenish = color(20, 138, 92);

  colorPallete = [purplish, bluish, yellowish, reddish, greenish];

  // Spacing of each square of the grid
  spc = width / NUM_GRID;

  // Creation of all the arrays of "sprinkles"
  for(let row = 0; row < NUM_GRID; row++) {
    sprinkles[row] = [];
    for(let col = 0; col < NUM_GRID; col++) {
      let xCenter = spc*row + spc/2;
      let yCenter = spc*col + spc/2;

      createSprinkles(xCenter, yCenter, row, col);
    }
  }

  // reset all the doors to true (== door is visible)
  resetDoors();
}

function draw() {
  background(75, 41, 42);
  
  // DRAW STATIC NOISE
  stroke(100);
  strokeWeight(0.65);
  for(let i = 0 ; i < 2000; i++){
    point(random(width), random(height));
  }

  // DRAW BACK RECTANGLES (RED)
  noStroke();
  fill(217, 71, 72);
  for(let row = 0; row < NUM_GRID; row++) {
    for(let col = 0; col < NUM_GRID; col++) {
      let xCenter = spc*row + spc/2;
      let yCenter = spc*col + spc/2;
      
      rect(xCenter, yCenter, spc * 0.825, spc * 0.825);
    }
  }

  // DRAW SPRINKLES
  for(let row = 0; row < NUM_GRID; row++) {
    for(let col = 0; col < NUM_GRID; col++) {
      drawSprinkles(row, col); 
    }
  }

  // DRAW FRONT RECTANGLES (DOORS)
  fill(30);
  noStroke();
  for(let row = 0; row < NUM_GRID; row++) {
    for(let col = 0; col < NUM_GRID; col++) {
      let xCenter = spc*row + spc/2;
      let yCenter = spc*col + spc/2;
      if(doors[row][col])
        rect(xCenter, yCenter, spc * 0.625, spc * 0.625);
    }
  }

  // check if mouse is over door
  checkMouseOver();
}

/**
 * Checks if the mouse is over the doors and turn the boolean to false,
 * False == invisible
 * True == Visible
 */
function checkMouseOver() {
  for(let row = 0; row < NUM_GRID; row++) {
    
    for(let col = 0; col < NUM_GRID; col++) {
      
      if( mouseX >= spc*col && mouseX <= spc*(col+1) &&
          mouseY >= spc*row && mouseY <= spc*(row+1)) {
            resetDoors();
            doors[col][row] = false;
          }       
    }
  }
}

/**
 * Resets all the doors to true
 */
function resetDoors() {
  for(let row = 0; row < NUM_GRID; row++) {
    doors[row] = [];
    for(let col = 0; col < NUM_GRID; col++) {
      doors[row][col] = true;
    }
  }
}


/**
 * Creates the instances of the sprinkles and saves the x and y coordinates,
 * as well as the row and column on the grid
 */
function createSprinkles(xCenter, yCenter, row, col) {
  let auxSprinkles = [];
  for(let i = 0; i < NUM_SPRINKLES; i++) {
    auxSprinkles.push(new Sprinkle(NUM_VERTEX, xCenter, yCenter, i, row, col));
  }
  sprinkles[row][col] = auxSprinkles;  
}

/**
 * Updates and draws the sprinkles on the canvas
 */
function drawSprinkles(row, col) {
  for(let i = 0; i < NUM_SPRINKLES; i++) {
    sprinkles[row][col][i].update();
  }

  for(let i = 0; i < NUM_SPRINKLES; i++) {
    sprinkles[row][col][i].draw();
  }
}

/**
 * Class for a Sprinkle (one wavy line)
 */
class Sprinkle {
  constructor(numVertex, xCenter, yCenter, index, row, col) {
    // number of vertexes on the line
    this.numVertex = numVertex;
    // array of vertexes
    this.vertexes = [];

    // x and y coordinates
    this.xCenter = xCenter;
    this.yCenter = yCenter;
    
    // index on the array, and row and column on the grid
    this.index = index;
    this.row = row;
    this.col = col;
    
    // color and angle
    this.color = colorPallete[(int)(random(0,5))];
    this.angle = angles[(int)(random(0,4))];
    
    // x and y coordinates for the vertexes
    this.init_x = 0;
    this.init_y = 0;
    let x = this.init_x;
    let y = this.init_y;

    // creation of the array of vertexes 
    //(saves the position to be updated/animated after)
    this.vertexes.push([x, y]);  // show first vertex
    for(let i = 0; i < this.numVertex; i++) {
      // add each vertex to the array
      this.vertexes.push([x, y]);
      
      // update x and y
      if(i == (this.numVertex-1))
        x = this.init_x;
      else
        x += noise((this.index+1) * (i+1), this.col) * spc*0.375 - spc*0.375/2;

      y += noise((this.index+1) * (i+1) + 1000, this.row) * spc*0.125 + spc*0.08;
    }
  }

  /**
   * Updates the position of each vertex on the line (by changing the x coordinate)
   */
  update() {
    for(let i = 2; i < this.vertexes.length; i++) {
      let x = this.vertexes[i][0]; 
      
      x += map(noise(i /frameCount, this.index / (NUM_GRID - this.col)), 0, 1, -0.2, 0.2);

      this.vertexes[i][0] = x;
    }
  }

  /**
   * Draws the line on the canvas
   */
  draw() {
    noFill();
    strokeWeight(2.5);
    stroke(this.color);

    push();
    translate(this.xCenter, this.yCenter);
    rotate(this.angle);
   
    beginShape();
    
    for(let i = 0; i < this.vertexes.length; i++) {
      curveVertex(this.vertexes[i][0], this.vertexes[i][1]); 
    }

    endShape();
    pop();
  }
}