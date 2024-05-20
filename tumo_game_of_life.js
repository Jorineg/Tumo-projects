class Empty { }

// Grass starts with a random energy between 0 and 2.
// It gains 1 energy every frame.
// When it reaches 7 energy, it creates a new grass object
// in an empty neighbour cell and resets its energy to 0.
class Grass {
    constructor() {
        this.stepCount = frameCount + 1;
        this.color = "green";
        this.energy = int(random(0, 3));
    }

    step() {
        this.stepCount++;
        this.energy++;
        if (this.energy >= 7) {
            this.multiply();
            this.energy = 0;
        }
    }

    multiply() {
        let emptyFields = findNeighbourPositions(this.row, this.col, 1, Empty);
        if (emptyFields.length > 0) {
            let randomEmptyField = random(emptyFields);
            let row = randomEmptyField[0];
            let col = randomEmptyField[1];
            matrix[row][col] = new Grass();
        }
    }
}

// GrassEater looks for grass in its neighbour cells.
// If it finds grass, it moves to that cell, eats the grass and gains 1 energy.
// If it doesn't find grass, it moves to a random empty neighbour cell and loses 1 energy.
// If it has 10 energy, it creates a new grass eater object in an empty neighbour cell
// and loses 5 energy.
// If it has 0 energy, it dies and becomes an empty cell.
class GrassEater {
    constructor() {
        this.stepCount = frameCount + 1;
        this.color = "yellow";
        this.energy = 5;
    }

    eat() {
        let grassFields = findNeighbourPositions(this.row, this.col, 1, Grass);
        if (grassFields.length > 0) {
            let randomGrassField = random(grassFields);
            updateCreaturePosition(this, randomGrassField);
            this.energy++;
        } else {
            let emptyFields = findNeighbourPositions(this.row, this.col, 1, Empty);
            if (emptyFields.length > 0) {
                let randomEmptyField = random(emptyFields);
                updateCreaturePosition(this, randomEmptyField);
            }
            this.energy--;
        }
    }

    multiply() {
        let freeFields = findNeighbourPositions(this.row, this.col, 1, Empty);
        if (freeFields.length > 0) {
            let randomFreeField = random(freeFields);
            let row = randomFreeField[0];
            let col = randomFreeField[1];
            matrix[row][col] = new GrassEater();
        }
    }

    step() {
        this.stepCount++;
        this.eat();
        if (this.energy >= 10) {
            this.multiply();
            this.energy -= 5;
        } else if (this.energy <= 0) {
            matrix[this.row][this.col] = new Empty();
        }
    }
}

// MeatEater looks for grass eater in its neighbour cells.
// If it finds grass eater, it moves to that cell, eats the grass eater and gains 10 energy.
// If it doesn't find grass eater, it loses 1 energy.
// If it has 120 energy, it creates a new meat eater object in an empty neighbour cell
// and loses 100 energy.
class MeatEater {
    constructor() {
        this.stepCount = frameCount + 1;
        this.color = "red";
        this.energy = 100;
    }

    eat() {
        let grassEaterFields = findNeighbourPositions(this.row, this.col, 1, GrassEater);
        if (grassEaterFields.length > 0) {
            let randomGrassEaterField = random(grassEaterFields);
            updateCreaturePosition(this, randomGrassEaterField);
            this.energy += 10;
        } else {
            this.energy--;
        }
    }

    multiply() {
        let emptyFields = findNeighbourPositions(this.row, this.col, 1, Empty);
        if (emptyFields.length > 0) {
            let randomEmptyField = random(emptyFields);
            let row = randomEmptyField[0];
            let col = randomEmptyField[1];
            matrix[row][col] = new MeatEater();
        }
    }

    step() {
        this.stepCount++;
        this.eat()
        if (this.energy >= 120) {
            this.multiply();
            this.energy -= 100;
        } else if (this.energy <= 0) {
            matrix[this.row][this.col] = new Empty();
        }
    }
}

// list of lists. Contains all creatures.
let matrix = [];
// size of the matrix, how many cells in width and height
let size = 50;
// display size in pixels of each cell
let blockSize = 15;

// What probability each creature has to be created
let creatureAmounts = [
    [Grass, 0.25],
    [GrassEater, 0.05],
    [MeatEater, 0.02],
];

// Choose a random creature based on the probabilities
function getRandomCreature() {
    let rand = random();
    let sum = 0;
    for (let [creatureCLass, propability] of creatureAmounts) {
        sum += propability;
        if (rand < sum) {
            return creatureCLass;
        }
    }
    return Empty;
}

// randomly fill the matrix with creatures based on the probabilities
function fillRandomMatrix() {
    for (let row = 0; row < size; row++) {
        matrix.push([]);
        for (let col = 0; col < size; col++) {
            let creatureCLass = getRandomCreature();
            matrix[row][col] = new creatureCLass();
        }
    }
}


// update the position of a creature in the matrix
// Creates a new empty object in the old position
function updateCreaturePosition(creature, newPos) {
    let [newRow, newCol] = newPos;
    matrix[newRow][newCol] = creature;
    matrix[creature.row][creature.col] = new Empty();
    creature.row = newRow;
    creature.col = newCol;
}


// for a given position, find all neighbour positions contain a certain
// creature type and are within a certain distance
// returns a list of [row, col] positions
// example: findNeighbourPositions(10, 10, 1, Empty) will return all empty cells
// around position 10, 10 within a distance of 1. If all cells are empty, it will return
// [[9, 9], [9, 10], [9, 11], [10, 9], [10, 11], [11, 9], [11, 10], [11, 11]]
function findNeighbourPositions(row, col, distance, creatureType) {
    let positions = [];
    for (let nCol = col - distance; nCol <= col + distance; nCol++) {
        for (let nRow = row - distance; nRow <= row + distance; nRow++) {
            if (nCol >= 0 && nCol < size && nRow >= 0 && nRow < size && matrix[nRow][nCol] instanceof creatureType) {
                positions.push([nRow, nCol]);
            }
        }
    }
    return positions;
}

// setup the canvas and fill the matrix with creatures
// Will be called once at the start
function setup() {
    createCanvas(size * blockSize, size * blockSize);
    fillRandomMatrix();
    noStroke();
    frameRate(30);
}

// game loop. This will be called every frame
// It will draw the matrix and update the creatures
function draw() {
    background(200)
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            let obj = matrix[row][col];

            // skip empty cells
            if (obj instanceof Empty) continue;

            // set the row and col of the creature
            obj.row = row;
            obj.col = col;

            // draw the creature
            fill(obj.color);
            rect(blockSize * obj.col, blockSize * obj.row, blockSize, blockSize);

            // this prevents newly created creatures from being updated in the same step
            // and creatures that move from being updated multiple times in one frame
            if (obj.stepCount === frameCount) {
                obj.step();
            }
        }
    }
}
