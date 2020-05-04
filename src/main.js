"use strict";

if (!window.Worker) {
  throw new Error("WorkerAPI is not supported");
}

const STAGE_WIDTH = 400;
const STAGE_HEIGHT = 400;
const GRID_SIZE_ROW = 20;
const GRID_SIZE_COL = 20;
const TILE_SIZE_WIDTH = STAGE_WIDTH / GRID_SIZE_ROW;
const TILE_SIZE_HEIGHT = STAGE_HEIGHT / GRID_SIZE_COL;
const TILES = [];
const STATE = [];
const PADDING = 2;

setup();

function setup() {
  let stage = document.getElementById("stage");
  stage.innerHTML = "";

  let grid = createGrid();

  let diff = [
    [5, 9, 1],
    [5, 10, 1],
    [5, 11, 1],
  ];

  drawTiles(diff);
  diff = calculateDiff(diff, STATE)
  drawTiles(diff);

  stage.appendChild(grid);
}

function loop() {

}

function createGrid() {

  let grid = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  grid.setAttribute("width", STAGE_WIDTH);
  grid.setAttribute("height", STAGE_HEIGHT);

  // State
  for (let i = 0; i < GRID_SIZE_ROW + PADDING * 2; ++i) {
    let stateRow = [];
    for (let j = 0; j < GRID_SIZE_COL + PADDING * 2; ++j) {
      stateRow.push(0);
    }
    STATE.push(stateRow);
  }

  // Tiles
  for (let i = 0; i < GRID_SIZE_ROW; ++i) {
    let tileRow = [];
    for (let j = 0; j < GRID_SIZE_COL; ++j) {
      let tileY = i * TILE_SIZE_HEIGHT;
      let tileX = j * TILE_SIZE_WIDTH;
      let tile = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      tile.setAttribute("x", tileX);
      tile.setAttribute("y", tileY);
      tile.setAttribute("width", TILE_SIZE_WIDTH);
      tile.setAttribute("height", TILE_SIZE_HEIGHT);
      tile.setAttribute("fill", "white");
      grid.appendChild(tile);
      tileRow.push(tile);
    }
    TILES.push(tileRow);
  }

  // Horizontal grid lines
  for (let i = 0; i < GRID_SIZE_ROW; ++i) {
    let gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    gridLine.setAttribute("x1", 0);
    gridLine.setAttribute("y1", i * TILE_SIZE_HEIGHT);
    gridLine.setAttribute("x2", STAGE_WIDTH);
    gridLine.setAttribute("y2",  i * TILE_SIZE_HEIGHT);
    gridLine.setAttribute("stroke", "#eee");
    grid.appendChild(gridLine);
  }

  // Vertical grid lines
  for (let i = 0; i < GRID_SIZE_COL; ++i) {
    let gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    gridLine.setAttribute("x1", i * TILE_SIZE_WIDTH);
    gridLine.setAttribute("y1", 0);
    gridLine.setAttribute("x2",  i * TILE_SIZE_WIDTH);
    gridLine.setAttribute("y2", STAGE_HEIGHT);
    gridLine.setAttribute("stroke", "#eee");
    grid.appendChild(gridLine);
  }

  return grid;
}

function drawTiles(diff) {
  for(let i = 0; i < diff.length; ++i) {
    let row = diff[i][0];
    let col = diff[i][1];
    if(diff[i][2] === 1) {
      TILES[row][col].setAttribute("fill", "black");
      STATE[row + PADDING][col + PADDING] = 1;
    } else {
      TILES[row][col].setAttribute("fill", "white");
      STATE[row + PADDING][col + PADDING] = 0;
    }
  }
}

function calculateDiff(paintedTiles, state) {
  let diff = [];
  for(let i = 0; i < paintedTiles.length; ++i) {
    let row = paintedTiles[i][0] + PADDING;
    let col = paintedTiles[i][1] + PADDING;

    // top left
    checkNeighbors(row - 1, col - 1, state, diff);
    // top center
    checkNeighbors(row - 1, col, state, diff);
    // top right
    checkNeighbors(row - 1, col + 1, state, diff);
    // mid left
    checkNeighbors(row, col - 1, state, diff);
    // mid right
    checkNeighbors(row, col + 1, state, diff);
    // bottom left
    checkNeighbors(row + 1, col - 1, state, diff);
    // bottom center
    checkNeighbors(row + 1, col, state, diff);
    // bottom right
    checkNeighbors(row + 1, col + 1, state, diff);
  }

  return diff;
}

function checkNeighbors(i, j, state, diff) {
  if (i < 0 || j < 0 || i >= state.length || j >= state[0].length) return;
  let numPainted = 0;
  // top left
  if (i - 1 >= 0 && j - 1 >= 0 && state[i - 1][j - 1] == 1) numPainted++;
  // top center
  if (i - 1 >= 0 && state[i - 1][j] == 1) numPainted++;
  // top right
  if (i - 1 >= 0 && j + 1 < state[0].length && state[i - 1][j + 1] == 1) numPainted++;
  // mid left
  if (j - 1 >= 0 && state[i][j - 1] == 1) numPainted++;
  // mid right
  if (j + 1 < state[0].length && state[i][j + 1] == 1) numPainted++;
  // bottom left
  if (i + 1 < state.length && j - 1 >= 0 && state[i + 1][j - 1] == 1) numPainted++;
  // bottom center
  if (i + 1 < state.length && state[i + 1][j] == 1) numPainted++;
  // bottom right
  if (i + 1 < state.length && j + 1 < state[0].length && state[i + 1][j + 1] == 1) numPainted++;

  if (state[i][j] == 1) {
    if (numPainted < 2) diff.push([i - PADDING, j - PADDING, 0]);
    else if (numPainted > 3) diff.push([i - PADDING, j - PADDING, 0]);
  }
  else {
    if (numPainted === 3) diff.push([i - PADDING, j - PADDING, 1]);
  }
}
