import { useState } from 'react';
import './styles.scss';
import Board from './components/Board';
import StatusMessage from './components/StatusMessage';
import { calculateWinner } from './components/winner';
import History from './components/History';

const NEW_GAME = [{ squares: Array(9).fill(null), isXNext: false }];

function App() {
  const [history, setHistory] = useState(NEW_GAME);

  const [currentMove, setCurrentMove] = useState(0);

  const gamingBoard = history[currentMove];
  const noMovesLeft = gamingBoard.squares.every(
    squareValue => squareValue !== null
  );

  const { winner, winningSquares } = calculateWinner(gamingBoard.squares);

  const handleSquareClick = clickedPosition => {
    if (gamingBoard.squares[clickedPosition] || winner) {
      return;
    }

    setHistory(currentHistory => {
      const isTraversing = currentMove + 1 !== currentHistory.length;

      const lastGamingState = isTraversing
        ? currentHistory[currentMove]
        : currentHistory[currentHistory.length - 1];

      const nextSquaresState = lastGamingState.squares.map(
        (squareValue, position) => {
          if (clickedPosition === position) {
            return lastGamingState.isXNext ? 'X' : 'O';
          }
          return squareValue;
        }
      );

      const base = isTraversing
        ? currentHistory.slice(0, currentHistory.indexOf(lastGamingState) + 1)
        : currentHistory;

      return base.concat({
        squares: nextSquaresState,
        isXNext: !lastGamingState.isXNext,
      });
    });
    setCurrentMove(move => move + 1);
  };

  const moveTo = move => {
    setCurrentMove(move);
  };

  const onNewGameStart = () => {
    setHistory(NEW_GAME);
    setCurrentMove(0);
  };

  return (
    <div className="app">
      <h1>
        TIC
        <span className="text-orange"> TAC </span>TOE
      </h1>

      <StatusMessage
        winner={winner}
        gamingBoard={gamingBoard}
        noMovesLeft={noMovesLeft}
      />
      <Board
        squares={gamingBoard.squares}
        handleSquareClick={handleSquareClick}
        winningSquares={winningSquares}
      />

      <button
        type="button"
        className={`btn-reset ${winner || noMovesLeft ? 'active' : ''} `}
        onClick={onNewGameStart}
      >
        Start New Game
      </button>

      <h2>Current Game History</h2>
      <History history={history} moveTo={moveTo} currentMove={currentMove} />
      <div className="bg-balls" />
    </div>
  );
}

export default App;
