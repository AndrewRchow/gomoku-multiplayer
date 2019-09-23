import React from 'react';
import ReactDOM from 'react-dom';
import './offlineGame.css';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'



class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(225).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      isDraw: false
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      isDraw: history.length === 225 ? true : false
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      isDraw: false
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const isDraw = this.state.isDraw;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Move ' + move :
        // 'Go to move #' + move :
        'Restart';
      // 'Go to game start';

      if(move){
        return (
          <li key={move}>
            <button className="btn btn-info" onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
      }else {
        return (
          <li key={move}>
            <button className="btn btn-primary" onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
      }

      return (
        <li key={move}>
        <button onClick={() => this.jumpTo(move)}>{desc}</button>
      </li>
      )

    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner.player;
    } else if (isDraw) {
      status = 'Draw';
    }
    else {
      status = 'Next: ' + (this.state.xIsNext ? 'X' : 'O');
      // status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <h3 className="title">Single</h3>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winSeq={winner.sequence} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


class Board extends React.Component {
  renderSquare(i) {
    return <Square
      key={i} keyProp={i}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      winSeq={this.props.winSeq} />;
  }

  render() {
    var boardSquares = [];
    var boardSquaresRow = [];
    for (var i = 0; i < 225; i++) {
      if (i % 15 == 0 && i != 0) {
        boardSquares.push(<div className="board-row" key={i}>{boardSquaresRow}</div>);
        boardSquaresRow = [];
      }
      boardSquaresRow.push(this.renderSquare(i));

      // if(i == 224){
      //   boardSquares.push(<div className="board-row" key={i}>{boardSquaresRow}</div>);
      // }
    }
    return (
      <div>
        {boardSquares}
      </div>
    );
  }
}



class Square extends React.Component {
  render() {
    let isWinningSquare = false;
    if (this.props.winSeq) {
      isWinningSquare = elementInArray(this.props.keyProp, this.props.winSeq);
    }

    return (
      <button
        className={'square ' + (isWinningSquare ? 'winningSquare' : '')}
        onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}



export default Game


// ========================================



function calculateWinner(squares) {
  var squaresArray = [];
  var squaresRow = [];
  var winner;
  for (var i = 0; i < squares.length; i++) {
    if (i % 15 == 0 && i != 0) {
      squaresArray.push(squaresRow);
      squaresRow = [];
    }
    squaresRow.push(squares[i]);

    // if(i == 224){
    //   squaresArray.push(squaresRow);
    // }
  }
  console.log(squaresArray);

  for (var i = 0; i < squaresArray.length; i++) {
    for (var j = 0; j < squaresArray[i].length; j++) {
      if (squaresArray[i][j]) {
        winner = findFiveInARow(squaresArray, i, j);
        if (winner) {
          console.log(winner);
          return winner;
        }

      }
    }
  }
  return "";
}

function findFiveInARow(matrix, row, column) {
  var mLength = matrix.length+1;
  var selected = matrix[row][column];
  var sequence = [];
  var win;
//Horizontal right
  for (var i = 0; i < 5; i++) {
    if (0>column-4 || selected != matrix[row][column-i]) {
      sequence = [];
      win = false;
      break;
    }
    sequence.push((row*mLength) + (column-i));
    win = true;
  }
//Vertical 
  if (!win) {
    for (var i = 0; i < 5; i++) {
      if (0 > row-4 || selected != matrix[row-i][column]) {
        sequence = [];
        win = false;
        break;
      }
      sequence.push(((row-i)*mLength) + (column));
      win = true;
    }
  }
//Diagonal Q13
  if (!win) {
    for (var i = 0; i < 5; i++) {
      if (0 > column-4 || matrix.length<row+4 || selected != matrix[row+i][column-i]) {
        sequence = [];
        win = false;
        break;
      }
      sequence.push(((row+i)*mLength) + (column-i));
      win = true;
    }
  }
//Diagonal Q24
  if (!win) {
    for (var i = 0; i < 5; i++) {
      if (0 > column-4 || 0>row-4 || selected != matrix[row-i][column-i]) {
        sequence = [];
        win = false;
        break;
      }
      sequence.push(((row-i)*mLength) + (column-i));
      win = true;
    }
  }


  if (win) {
    return {
      player: selected,
      sequence: sequence
          };
  } else {
    return "";
  }
}

function elementInArray(index, array) {
  if (array.includes(index)) {
    return true;
  } else {
    return false;
  }
}
