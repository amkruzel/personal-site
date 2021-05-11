'use strict';

const tttSquares = document.querySelectorAll('.ttt-square');
const tttBtns = document.querySelector('.ttt-btns');
const tttDifficultyBtns = document.querySelector('.ttt-difficulty-btns');
const tttResetBtn = document.querySelector('.ttt-reset-btn');
const tttOptions = document.querySelector('.ttt-options-container');
const tttBoard = document.querySelector('.ttt-table');
const tttWinLoss = document.querySelector('.ttt-winloss-message');

class TTTGame {
  boardArr;
  boardObj;
  playerXorO;
  compXorO;
  isPlayerTurn;
  tttBoardIndex;
  whereXandO;
  turnCounter;
  isMaximumPlayer = true;
  bestMovesArr;
  difficulty = 'easy';

  constructor() {
    this._init();
    tttBtns.addEventListener('click', this._whichBtn.bind(this));
    tttDifficultyBtns.addEventListener(
      'click',
      this._changeDifficulty.bind(this)
    );
  }

  _init() {
    // clear each square
    tttSquares.forEach(function (sqr) {
      sqr.textContent = ' ';
    });

    // clear end game overlay
    tttWinLoss.textContent = '';

    //make sure all content is visible
    document
      .querySelectorAll('.ttt-xoro')
      .forEach(each => each.classList.remove('hidden'));
    document
      .querySelectorAll('.xoro-btn')
      .forEach(each => each.classList.remove('hidden'));
    document.querySelector('.ttt-reset-btn').classList.add('hidden');

    // initialize the board
    this.boardObj = {
      'top-left': '',
      'top-center': '',
      'top-right': '',
      'middle-left': '',
      'middle-center': '',
      'middle-right': '',
      'bottom-left': '',
      'bottom-center': '',
      'bottom-right': '',
    };

    // prettier-ignore
    this.boardArr = 
    ['','','',
    '','','',
    '','','',];

    // prettier-ignore
    this.tttBoardIndex = [
      'top-left', 'top-center', 'top-right',
      'middle-left', 'middle-center', 'middle-right',
      'bottom-left', 'bottom-center', 'bottom-right',
    ];

    this.whereXandO = {
      x: [],
      o: [],
    };

    // Clear playerXorO
    this.playerXorO = '';
    this.compXorO = '';
    this.turnCounter = 0;
    this.isPlayerTurn = false;
    return;
  }

  _changeDifficulty(e) {
    const btn = e.target;

    if (!e.target.classList.contains('ttt-btn')) return;
    if (this._isEmpty() !== 0) {
      alert('Cannot change difficulty in the middle of a game!');
      return;
    }

    if (btn.classList.contains('diff-selected')) return;

    if (!btn.classList.contains('diff-selected')) {
      if (this.difficulty === 'easy') {
        document.querySelector('.ttt-hard').classList.add('diff-selected');
        document.querySelector('.ttt-easy').classList.remove('diff-selected');
      }
      if (this.difficulty === 'hard') {
        document.querySelector('.ttt-easy').classList.add('diff-selected');
        document.querySelector('.ttt-hard').classList.remove('diff-selected');
      }
      this.difficulty = this.difficulty === 'easy' ? 'hard' : 'easy';
    }
  }

  _whichBtn(e) {
    const btn = e.target.value;

    if (!e.target.classList.contains('ttt-btn')) return;

    if (btn === 'ttt-reset') this._init();

    if (btn === 'x') {
      this._clearOptions();
      this._playerBegin();
    }

    if (btn === 'o') {
      this._clearOptions();
      this._compBegin();
    }
  }

  _playerBegin() {
    this.playerXorO = 'X';
    this.compXorO = 'O';

    // Register player turn
    this.isPlayerTurn = true;

    // Now it is the player's turn
    this._playerTurn();
  }

  _compBegin() {
    if (this._isEmpty() !== 0) return; // return if array is not empty

    this.playerXorO = 'O';
    this.compXorO = 'X';

    const index = this._randNum(8);
    const position = `${this.tttBoardIndex[index]}`;

    // Add to board object, array, screen
    this._addToBoardObj(position, 'X', index);

    // Register player turn
    this.isPlayerTurn = true;

    // Now it is the player's turn
    this._playerTurn();
  }

  _isEmpty() {
    let isEmpty = 0;
    tttSquares.forEach(sqr => {
      isEmpty += sqr.innerHTML === ' ' ? 0 : 1;
    });

    return isEmpty; // returns 0 if empty, 1 if not empty
  }

  _clearOptions() {
    document
      .querySelectorAll('.ttt-xoro')
      .forEach(each => each.classList.add('hidden'));
    document
      .querySelectorAll('.xoro-btn')
      .forEach(each => each.classList.add('hidden'));
    document.querySelector('.ttt-reset-btn').classList.remove('hidden');
  }

  _addToBoardObj(pos, letter, index) {
    // Add to internal data
    this.boardObj[pos] = letter;
    this.boardArr[index] = letter;
    // this.whereXandO[letter].push(pos);
    this.turnCounter++;

    // Add to visible board
    document.querySelector(`[data-sqr="${pos}"]`).textContent = letter;

    if (
      this._checkIfWinner(this.boardArr, this.compXorO) ||
      this.turnCounter === 9
    )
      setTimeout(this._gameOverPopup.bind(this), 500);
  }

  _randNum(n) {
    // Random num 0 - n, not including n
    return Math.floor(Math.random() * n);
  }

  _playerTurn() {
    tttBoard.addEventListener(
      'click',
      function (e) {
        if (!this.isPlayerTurn) return; // return if not player turn
        if (!e.target.classList.contains('ttt-square')) return; // return if not a square
        // tttResetBtn.addEventListener(
        //   'click',
        //   function () {
        //     this._init();
        //     return;
        //   }.bind(this)
        // );

        const position = e.target.dataset.sqr;

        if (this.boardObj[position] === 'X' || this.boardObj[position] === 'O')
          return; // return is not an empty square

        // put correct letter in square
        document.querySelector(
          `[data-sqr="${position}"]`
        ).textContent = this.playerXorO;

        // add to board object
        this._addToBoardObj(
          position,
          this.playerXorO.toUpperCase(),
          this.tttBoardIndex.indexOf(position)
        );

        this.isPlayerTurn = false;
        this._compTurn();
      }.bind(this)
    );
  }

  _compTurn() {
    if (this._emptyIndices(this.boardArr).length === 0) {
      setTimeout(this._gameOverPopup.bind(this), 500);
      return;
    }

    if (this._checkIfWinner(this.boardArr, this.playerXorO)) {
      setTimeout(this._gameOverPopup.bind(this), 500);
      return;
    }

    // if on easy mode
    if (this.difficulty === 'easy') {
      let emptySpaces = this._emptyIndices(this.boardArr);

      const index = this._randNum(emptySpaces.length);
      const position = `${this.tttBoardIndex[emptySpaces[index]]}`;

      // Add to board object, array, screen
      this._addToBoardObj(
        position,
        this.compXorO.toUpperCase(),
        emptySpaces[index]
      );
    }

    // if on hard mode
    if (this.difficulty === 'hard') {
      const [currMoves, bestScore] = this._minimax(
        this.boardArr,
        this.compXorO,
        9 - this.turnCounter
      );

      let bestMoves = currMoves.filter(cur => {
        return cur.score === bestScore.score;
      });

      let nextMoveInd = bestMoves[this._randNum(bestMoves.length)].index;

      this._addToBoardObj(
        this.tttBoardIndex[nextMoveInd],
        this.compXorO,
        nextMoveInd
      );
    }

    // Register player turn
    this.isPlayerTurn = true;

    // Now it is the player's turn
    this._playerTurn();
  }

  _minimax(board, xoro, openSquares) {
    // array of numbers, length of current empty squares
    let emptySpaces = this._emptyIndices(board);

    // check if there is a winner or a tie
    if (this._checkIfWinner(board, this.compXorO)) return { score: 1 };
    if (this._checkIfWinner(board, this.playerXorO)) return { score: -1 };
    if (emptySpaces.length === 0) return { score: 0 };

    let moves = [];

    for (let i = 0; i < emptySpaces.length; i++) {
      let move = {};
      move.index = emptySpaces[i];

      board[emptySpaces[i]] = xoro;

      if (xoro === this.compXorO) {
        let result = this._minimax(board, this.playerXorO);
        move.score = result.score;
      } else {
        let result = this._minimax(board, this.compXorO);
        move.score = result.score;
      }

      board[emptySpaces[i]] = '';
      moves.push(move);
    }
    let bestMove;
    if (xoro === this.compXorO) {
      let bestScore = -10;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    if (moves.length === openSquares) return [moves, moves[bestMove]];
    return moves[bestMove];
  }

  _emptyIndices(board) {
    let ret = [];
    board.forEach((cur, i) => {
      if (cur === '') ret.push(i);
    });
    return ret;
  }

  _checkIfWinner(currBdSt, currMark) {
    // prettier-ignore
    if (
        (currBdSt[0] === currMark && currBdSt[1] === currMark && currBdSt[2] === currMark) ||
        (currBdSt[3] === currMark && currBdSt[4] === currMark && currBdSt[5] === currMark) ||
        (currBdSt[6] === currMark && currBdSt[7] === currMark && currBdSt[8] === currMark) ||
        (currBdSt[0] === currMark && currBdSt[3] === currMark && currBdSt[6] === currMark) ||
        (currBdSt[1] === currMark && currBdSt[4] === currMark && currBdSt[7] === currMark) ||
        (currBdSt[2] === currMark && currBdSt[5] === currMark && currBdSt[8] === currMark) ||
        (currBdSt[0] === currMark && currBdSt[4] === currMark && currBdSt[8] === currMark) ||
        (currBdSt[2] === currMark && currBdSt[4] === currMark && currBdSt[6] === currMark)
    )    return true;
    else {
        return false;
    }
  }

  _gameOverPopup() {
    if (this._checkIfWinner(this.boardArr, this.compXorO))
      tttWinLoss.textContent = 'DEFEAT';
    else if (this._checkIfWinner(this.boardArr, this.playerXorO))
      tttWinLoss.textContent = 'VICTORY';
    else tttWinLoss.textContent = 'DRAW';

    modal.classList.remove('modal-hidden');
    overlay.classList.remove('modal-hidden');

    overlay.addEventListener(
      'click',
      function () {
        closeModal();
        this._init();
      }.bind(this)
    );
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
    document.querySelector('.btn--close-modal').addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        closeModal();
        this._init();
      }.bind(this)
    );
    document.querySelector('.tryagain-btn').addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        closeModal();
        this._init();
      }.bind(this)
    );
  }
}

const ticTacToeGame = new TTTGame();
