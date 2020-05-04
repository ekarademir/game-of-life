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

setup();

function setup() {
  let stage = document.getElementById("stage");
  stage.innerHTML = "";

  let grid = createGrid();

  let state = [
    [2, 3, 1],
    [5, 10, 1],
  ];

  drawTiles(state);

  stage.appendChild(grid);
}

function createGrid() {

  let grid = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  grid.setAttribute("width", STAGE_WIDTH);
  grid.setAttribute("height", STAGE_HEIGHT);

  // Tiles
  for (let i = 0; i < GRID_SIZE_ROW; ++i) {
    let tileRow = [];
    let stateRow = [];
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
      stateRow.push(0);
    }
    TILES.push(tileRow);
    STATE.push(stateRow);
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
      STATE[row][col] = 1;
    } else {
      TILES[row][col].setAttribute("fill", "white");
      STATE[row][col] = 0;
    }
  }
}

function calculateDiff(state) {
  let diff = [];


}
