// MINESWEEPER

//constants --> im Moment noch hardcoded, aber wäre gut das noch als User Abfrage einzubauen... 
// Problem wäre dann die Größe... -- perspektivisch eigene Seite mit mehr games(snake, space invaders)?
// Oder Pop-Up
// oh the things to do....
const ROWS = 16;
const COLS = 30;
const MINES = 99;
const colors = ['', 'blue', 'green', 'red', 'darkblue', 'darkred', 'teal', 'black', 'gray'];

//den grundsätzlichen  grid erstellen
function createGrid() {
  let grid = [];

  for (let r = 0; r < ROWS; r++) {
    let row = [];
    for (let c = 0; c < COLS; c++) {
      row.push({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighbourCount: 0
      });
    }
    grid.push(row);
  }
  return grid;
}
//die Minen darin random platzieren
function placeMines(grid) {
  let minesPlaced = 0;

  while (minesPlaced < MINES) {
    let r = Math.floor(Math.random() * ROWS);
    let c = Math.floor(Math.random() * COLS);

    if (grid[r][c].isMine === false) {
      grid[r][c].isMine = true;
      minesPlaced++;
    }
  }
  return grid;
}
//die angrenzenden Minen errechnen
function calculateNeighbours(grid) {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1], //oben links, oben, oben rechts
    [0, -1], [0, 1], //links, rechts
    [1, -1], [1, 0], [1, 1], //unten links, unten, unten rechts
  ];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c].isMine) continue; // Minen werden übersprungen

      let count = 0;
      directions.forEach(([dr, dc]) => {
        let nr = r + dr;
        let nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          if (grid[nr][nc].isMine) count++;
        }
      });
      grid[r][c].neighbourCount = count;
    }
  }
  return grid;
}
//jetzt das optische grid
function renderGrid(grid) {
  const container = document.getElementById('minesweeper');
  container.innerHTML = '';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';

  grid.forEach((row, r) => {
    const rowDiv = document.createElement('div');
    rowDiv.style.display = 'flex';

    row.forEach((cell, c) => {
      const cellDiv = document.createElement('div');
      cellDiv.style.width = '20px';
      cellDiv.style.height = '20px';
      cellDiv.style.border = '2px outset #888';
      cellDiv.style.background = '#c0c0c0';
      cellDiv.style.cursor = 'pointer';
      cellDiv.style.fontSize = '11px';
      cellDiv.style.color = colors[grid[r][c].neighbourCount] || '#000';
      cellDiv.style.textAlign = 'center';
      cellDiv.style.lineHeight = '20px';
      cellDiv.id = `cell-${r}-${c}`;
      cellDiv.onclick = function () {
        handleClick(r, c);
      };
      cellDiv.oncontextmenu = function (e) {
        e.preventDefault();
        handleRightClick(r, c);
      };

      rowDiv.appendChild(cellDiv);
    });
    container.appendChild(rowDiv);
  });
}
//Spiel Startet
  let grid = createGrid();
  grid = placeMines(grid);
  grid = calculateNeighbours(grid);
  renderGrid(grid);

// functions für clicks, und gewinnen?
function handleClick(r, c) {
  if (grid[r][c].isRevealed) return;
  if (grid[r][c].isFlagged) return;
  const cellDiv = document.getElementById(`cell-${r}-${c}`);
  if (grid[r][c].isMine === true) {
    for(let r = 0; r < ROWS; r++){
      for(let c = 0; c < COLS; c++){
        if(grid[r][c].isMine === true){
          const mineDiv = document.getElementById(`cell-${r}-${c}`);
          mineDiv.textContent = '💣';
        }
      }
    }
    resetGame();
    alert('game over! (╯°□°)╯︵ ┻━┻');
  }
  else {
    grid[r][c].isRevealed = true;
    cellDiv.textContent = grid[r][c].neighbourCount || '';
    cellDiv.style.background = '#888';
    cellDiv.style.border = '2px inset #666';

    if (grid[r][c].neighbourCount === 0) {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1],
      ];
      directions.forEach(([dr, dc]) => {
        let nr = r + dr;
        let nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          if (!grid[nr][nc].isRevealed) {
            handleClick(nr, nc);
          }
        }
      });
    } 

    if (checkWin(grid)) {
      resetGame();
      alert('Du hast gewonnen, wuhu (ง ͡ʘ ͜ʖ ͡ʘ)ง')
    };
  }
}

function handleRightClick(r, c) {
  if (grid[r][c].isRevealed) return;
  const cellDiv = document.getElementById(`cell-${r}-${c}`);
  if (grid[r][c].isFlagged) {
    grid[r][c].isFlagged = false;
    cellDiv.textContent = '';
  } else {
    grid[r][c].isFlagged = true;
    cellDiv.textContent = '🚩';
  }
}
function checkWin(grid) {
  let counter = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c].isRevealed) {
        counter++;
      }
    }
  }
  if (counter == ROWS * COLS - MINES) {
    return true;
  }
}
function resetGame() {
  grid = createGrid();
  grid = placeMines(grid);
  grid = calculateNeighbours(grid);
  renderGrid(grid);
}