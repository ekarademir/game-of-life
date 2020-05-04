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

setup();

function setup() {
  let stage = document.getElementById("stage");
  stage.innerHTML = "";

  let grid = createGrid();

  let state = [
    [2, 3],
    [5, 10],
  ];

  drawTiles(state, grid);

  stage.appendChild(grid);
}

function createGrid() {

  let grid = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  grid.setAttribute("width", STAGE_WIDTH);
  grid.setAttribute("height", STAGE_HEIGHT);

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

function drawTiles(state, grid) {
  for(let i = 0; i < state.length; ++i) {
    let tileY = state[i][0] * TILE_SIZE_HEIGHT;
    let tileX = state[i][1] * TILE_SIZE_WIDTH;
    let tile = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    tile.setAttribute("x", tileX);
    tile.setAttribute("y", tileY);
    tile.setAttribute("width", TILE_SIZE_WIDTH);
    tile.setAttribute("height", TILE_SIZE_HEIGHT);
    tile.setAttribute("fill", "black");

    grid.appendChild(tile);
  }
}
