class Game {
  constructor() {
    this.livingCells = new Map();
    this.xMin = -1;
    this.xMax = 1;
    this.yMin = -1;
    this.yMax = 1;
  }

  addLivingCell(cell) {
    this.livingCells.set(cell.getKey(), cell);
  }

  fillRandom() {
    // while (this.livingCells.size < 20) {
    //
    //   const x = Math.floor(Math.random() * 100 - 50);
    //   const y = Math.floor(Math.random() * 100 - 50);
    //
    //   const cell = new Cell(x, y);
    //   if (!this.livingCells.has(cell.getKey()))
    //     this.addLivingCell(cell);
    // }


    // Blinker
    // (period 2)
    // this.addLivingCell(new Cell(0, 0));
    // this.addLivingCell(new Cell(1, 0));
    // this.addLivingCell(new Cell(2, 0));

    // Glider
    // this.addLivingCell(new Cell(10, 10));
    // this.addLivingCell(new Cell(12, 10));
    // this.addLivingCell(new Cell(11, 11));
    // this.addLivingCell(new Cell(12, 11));
    // this.addLivingCell(new Cell(11, 12));

    // Light-
    // weight
    // spaceship
    // (LWSS)
    // this.addLivingCell(new Cell(3 - 30, -30));
    // this.addLivingCell(new Cell(4 - 30, -30));
    // this.addLivingCell(new Cell(1 - 30, 1 - 30));
    // this.addLivingCell(new Cell(2 - 30, 1 - 30));
    // this.addLivingCell(new Cell(4 - 30, 1 - 30));
    // this.addLivingCell(new Cell(5 - 30, 1 - 30));
    // this.addLivingCell(new Cell(1 - 30, 2 - 30));
    // this.addLivingCell(new Cell(2 - 30, 2 - 30));
    // this.addLivingCell(new Cell(3 - 30, 2 - 30));
    // this.addLivingCell(new Cell(4 - 30, 2 - 30));
    // this.addLivingCell(new Cell(2 - 30, 3 - 30));
    // this.addLivingCell(new Cell(3 - 30, 3 - 30));

    // Acorn
    this.addLivingCell(new Cell(1, 0));
    this.addLivingCell(new Cell(3, 1));
    this.addLivingCell(new Cell(0, 2));
    this.addLivingCell(new Cell(1, 2));
    this.addLivingCell(new Cell(4, 2));
    this.addLivingCell(new Cell(5, 2));
    this.addLivingCell(new Cell(6, 2));

    this.calcMinMax();
  }

  calcMinMax() {
    const cells = [...this.livingCells.values()];
    this.xMin = Math.min(...cells.map(c => c.x));
    this.xMax = Math.max(...cells.map(c => c.x));
    this.yMin = Math.min(...cells.map(c => c.y));
    this.yMax = Math.max(...cells.map(c => c.y));
  }

  step() {
    const nextGenCells = [];

    const deadNeighborKeysOfSoFarLivingCells = new Set();

    for (const actCell of this.livingCells.values()) {
      const livingNeighbors = [];
      const deadNeighbors = [];

      const neighborKeys = actCell.getNeighborKeys();
      for (const neighborKey of neighborKeys) {
        if (this.livingCells.has(neighborKey))
          livingNeighbors.push(neighborKey);
        else
          deadNeighbors.push(neighborKey);
      }

      if (livingNeighbors.length === 2 || livingNeighbors.length === 3) {
        actCell.incAge();
        nextGenCells.push(actCell);
      }

      for (const deadNeighborKey of deadNeighbors) {
        deadNeighborKeysOfSoFarLivingCells.add(deadNeighborKey);
      }
    }

    // check if dead cells awake
    for (const key of deadNeighborKeysOfSoFarLivingCells) {
      const split = key.split(',');
      const deadCell = new Cell(parseInt(split[0]), parseInt(split[1]));
      let livingNeighbors = 0;
      for (const neighborKey of deadCell.getNeighborKeys()) {
        if (this.livingCells.has(neighborKey))
          livingNeighbors++;
        if (livingNeighbors > 3) break;
      }
      if (livingNeighbors === 3)
        nextGenCells.push(deadCell);
    }

    this.livingCells.clear();
    for (const nextGenCell of nextGenCells) {
      this.livingCells.set(nextGenCell.getKey(), nextGenCell);
    }

    this.calcMinMax();
  }

  draw(ctx) {
    for (const cell of this.livingCells.values()) {
      cell.draw(ctx);
    }
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.age = 1;
  }

  incAge() {
    this.age++;
  }

  getKey() {
    return this.x + ',' + this.y;
  }

  getNeighborKeys() {
    const ownKey = this.getKey();
    const neighbors = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        const key = (this.x + x) + ',' + (this.y + y);
        if (key !== ownKey)
          neighbors.push(key);
      }
    }
    return neighbors;
  }

  draw(ctx) {
    const r = 0.5;
    ctx.beginPath();
    // ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx.rect(this.x - r, this.y - r, 2 * r, 2 * r);
    ctx.fill();
  }
}

export {Game};