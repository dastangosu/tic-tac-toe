const GameBoard = (() => {

  //Array for gameboard
  let gameboard = [['', '', ''], ['', '', ''], ['', '', '']];

  //Put player's marker in array
  const putMarker = (row, col, player) => {
    if (gameboard[row][col] === '') {
      gameboard[row][col] = player.getMarker();
    }
    else {
      return 'taken';
    }
  };

  //Display marker on the page
  function displayCellMarker(cell) {
    const row = +cell.dataset.row;
    const col = +cell.dataset.col;
    cell.textContent = gameboard[row][col];
  }
  //Display the gameboard on the page
  function displayGameBoard(cells) {
    cells.forEach((cell) => {
      displayCellMarker(cell);
    })
  }

  //Clear the gameboard array
  function clearGameBoard() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        gameboard[i][j] = '';
      }
    }
  }

  function isGameWon(marker) {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (gameboard[i][0] === marker &&
        gameboard[i][1] === marker &&
        gameboard[i][2] === marker) {
        return true;
      }
    }

    // Check columns
    for (let j = 0; j < 3; j++) {
      if (gameboard[0][j] === marker &&
        gameboard[1][j] === marker &&
        gameboard[2][j] === marker) {
        return true;
      }
    }

    // Check diagonals
    if (gameboard[0][0] === marker &&
      gameboard[1][1] === marker &&
      gameboard[2][2] === marker) {
      return true;
    }

    if (gameboard[0][2] === marker &&
      gameboard[1][1] === marker &&
      gameboard[2][0] === marker) {
      return true;
    }

    // No win condition met
    return false;
  }

  function isDraw() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (gameboard[i][j] === '') {
          // There is an empty space, game is not a draw
          return false;
        }
      }
    }
    // All spaces are filled, game is a draw
    return true;
  }
  return { putMarker, displayCellMarker,displayGameBoard, isGameWon, isDraw,clearGameBoard };
})();

//Factory function for Player
function Player(name, marker) {
  const getName = () => name;
  const getMarker = () => marker;

  return { getMarker, getName };
}

//Module for Game Controller
const GameController = (() => {
  const announcement = document.querySelector('#announcement > h2');
  const restartButton = document.querySelector('.restart-btn');
  const cells = document.querySelectorAll('.cell');
  const player1 = Player('Player 1', 'x');
  const player2 = Player('Player 2', 'o');
  let currentTurnPlayer = player1;

  function changeTurn() {
    if (currentTurnPlayer === player1) {
      currentTurnPlayer = player2;
    }
    else {
      currentTurnPlayer = player1;
    }
    announceTurn(currentTurnPlayer);
  }

  function announceTurn(player) {
    announcement.textContent = player.getName() + "'s turn";
  }
  
  //Handle move made by a player
  function makeMove(cell, row, col) {
    if (GameBoard.putMarker(row, col, currentTurnPlayer) !== 'taken') {
      GameBoard.displayCellMarker(cell);
      if (GameBoard.isGameWon(currentTurnPlayer.getMarker())) {
        console.log(currentTurnPlayer.getName() + " wins");
        stopGame();
        return;
      }
      else if(GameBoard.isDraw()) {
        console.log("Draw");
        stopGame();
        return;
      }
      changeTurn();
    }

  }

  function handleCellClick(e) {
    const row = +e.target.dataset.row;
    const col = +e.target.dataset.col;
    makeMove(e.target,row,col);
  }
  function stopGame() {
    cells.forEach((cell) => {
      cell.removeEventListener('click',handleCellClick);
      announcement.textContent = currentTurnPlayer.getName() + " wins!";
    })
  }

  function restartGame() {
    GameBoard.clearGameBoard();
    GameBoard.displayGameBoard(cells);
    currentTurnPlayer = player1;
    announceTurn(player1);
    startGame();
  }

  function startGame () {
    cells.forEach((cell) => {
      cell.addEventListener('click', handleCellClick);
    })
  }
  function playGame() {
    restartButton.addEventListener('click',restartGame);
    startGame();
  }

  return { playGame };

})();

 GameController.playGame();