"use strict";

if (!window.Worker) {
  throw new Error("WorkerAPI is not supported");
}

const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 800;
const GRID_SIZE_ROW = 80;
const GRID_SIZE_COL = 80;
const TILE_SIZE_WIDTH = STAGE_WIDTH / GRID_SIZE_ROW;
const TILE_SIZE_HEIGHT = STAGE_HEIGHT / GRID_SIZE_COL;
const TILES = [];
const STATE = [];
const PADDING = 2;

const GAME_STATE = {
  isRunning: true,
  changedTiles: [
    [5, 1, 1],
    [5, 2, 1],

    [6, 1, 1],
    [6, 2, 1],

    [5, 11, 1],
    [6, 11, 1],
    [7, 11, 1],

    [4, 12, 1],
    [8, 12, 1],

    [3, 13, 1],
    [9, 13, 1],

    [3, 14, 1],
    [9, 14, 1],

    [6, 15, 1],

    [4, 16, 1],
    [8, 16, 1],

    [5, 17, 1],
    [6, 17, 1],
    [7, 17, 1],

    [6, 18, 1],

    [3, 21, 1],
    [4, 21, 1],
    [5, 21, 1],

    [3, 22, 1],
    [4, 22, 1],
    [5, 22, 1],

    [2, 23, 1],
    [6, 23, 1],

    [1, 25, 1],
    [2, 25, 1],
    [6, 25, 1],
    [7, 25, 1],

    [3, 35, 1],
    [4, 35, 1],

    [3, 36, 1],
    [4, 36, 1],
  ]
}

setup(GAME_STATE);

// Animation loop
let start = null;
function step(timestamp) {
  if (!start) start = timestamp;
  let progress = timestamp - start;
  if (progress > 10) {
    if(GAME_STATE.isRunning) {
      GAME_STATE.changedTiles = stepSimulation(GAME_STATE.changedTiles);
    }
    start = timestamp;
  }
  window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);

function setup() {
  const stage = document.getElementById("stage");
  stage.innerHTML = "";

  const grid = createGrid();
  update(GAME_STATE.changedTiles);
  stage.appendChild(grid);

  const toggleButton = document.getElementById("toggle");
  toggleButton.addEventListener("mousedown", simulationControlHandler);
}

function toggleSimulationState() {
  GAME_STATE.isRunning = !GAME_STATE.isRunning;
}

function simulationControlHandler(event) {
  toggleSimulationState();

  const toggleButton = document.getElementById("toggle");
  if(GAME_STATE.isRunning) {
    toggleButton.innerText = "STOP";
  } else {
    toggleButton.innerText = "PLAY";
  }
}

function stepSimulation(oldDiff) {
  let newDiff = calculateDiff(oldDiff, STATE)
  update(newDiff);
  return newDiff;
}

function update(diff) {
  switchTiles(diff);
  updateState(diff);
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

      tile.addEventListener("mousedown", decorateTileClickEvent(i, j));

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

function decorateTileClickEvent(row, col) {
  function tileClick(event) {
    if(GAME_STATE.isRunning) return;

    if(STATE[row + PADDING][col + PADDING] === 1) {
      STATE[row + PADDING][col + PADDING] = 0;
      TILES[row][col].setAttribute("fill", "white");
      GAME_STATE.changedTiles.push([row, col, 0]);
    } else {
      STATE[row + PADDING][col + PADDING] = 1;
      TILES[row][col].setAttribute("fill", "black");
      GAME_STATE.changedTiles.push([row, col, 0]);
    }
  }

  return tileClick;
}

function switchTiles(diff) {
  for(let i = 0; i < diff.length; ++i) {
    let row = diff[i][0];
    let col = diff[i][1];
    if (row >= 0 && col > 0 && row < TILES.length && col < TILES[0].length){
      if(diff[i][2] === 1) {
        TILES[row][col].setAttribute("fill", "black");
      } else {
        TILES[row][col].setAttribute("fill", "white");
      }
    }
  }
}

function updateState(diff) {
  for(let i = 0; i < diff.length; ++i) {
    let row = diff[i][0] + PADDING;
    let col = diff[i][1] + PADDING;
    if (row >= 0 && col > 0 && row < STATE.length && col < STATE[0].length){
      if(diff[i][2] === 1) {
        STATE[row][col] = 1;
      } else {
        STATE[row][col] = 0;
      }
    }
  }
}

function calculateDiff(paintedTiles, state) {
  let changes = {};
  for(let i = 0; i < paintedTiles.length; ++i) {
    let row = paintedTiles[i][0] + PADDING;
    let col = paintedTiles[i][1] + PADDING;

    // top left
    applyRules(row - 1, col - 1, state, changes);
    // top center
    applyRules(row - 1, col, state, changes);
    // top right
    applyRules(row - 1, col + 1, state, changes);
    // mid left
    applyRules(row, col - 1, state, changes);
    // mid center
    applyRules(row, col, state, changes);
    // mid right
    applyRules(row, col + 1, state, changes);
    // bottom left
    applyRules(row + 1, col - 1, state, changes);
    // bottom center
    applyRules(row + 1, col, state, changes);
    // bottom right
    applyRules(row + 1, col + 1, state, changes);
  }

  return Object.values(changes);
}

function applyRules(i, j, state, changes) {
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
    if (numPainted < 2) changes[[i - PADDING, j - PADDING]] = [i - PADDING, j - PADDING, 0]
    else if (numPainted > 3) changes[[i - PADDING, j - PADDING]]= [i - PADDING, j - PADDING, 0];
  }
  else {
    if (numPainted === 3) changes[[i - PADDING, j - PADDING]] = [i - PADDING, j - PADDING, 1];
  }
}
