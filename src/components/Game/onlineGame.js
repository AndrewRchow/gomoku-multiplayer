import React from 'react';
import ReactDOM from 'react-dom';
import './onlineGame.css';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { withFirebase } from '../Firebase';
import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/core';
import * as Routes from '../../constants/routes';
import { Link } from 'react-router-dom';


class Square extends React.Component {
  render() {
    let isWinningSquare = false;
    let isLastClickedSquare = false;
    if (this.props.winSeq) {
      isWinningSquare = elementInArray(this.props.keyProp, this.props.winSeq);
    }
    if(this.props.lastClick == this.props.keyProp){
      isLastClickedSquare = true;
    }

    return (
      <button
        className={'square ' + (isWinningSquare ? 'winningSquare' : '') + (isLastClickedSquare ? 'lastClick' : '')}
        onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      key={i} keyProp={i}
      lastClick={this.props.lastClick}
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
    }
    return (
      <div>
        {boardSquares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      squares: Array(225).fill(''),
      xIsNext: true,
      lastClick:'',
      roomId: this.props.roomId,
      player: this.props.player,
      playerDisconnect: false,
      myName: '',
      opponentName:''
    }
  }

  componentDidMount() {
    console.log('bear');

    window.addEventListener('beforeunload', this.playerDisconnect);

    this.props.firebase.room(this.state.roomId).on('value', snapshot => {
      let squares = [];
      Object.keys(snapshot.val().gameState.squares).forEach((key) => {
        squares.push(snapshot.val().gameState.squares[key]);
      });

      this.setState({
        squares,
        xIsNext: snapshot.val().gameState.xIsNext,
        lastClick: snapshot.val().gameState.lastClick,
        playerDisconnect: snapshot.val().playerDisconnect,
        myName: this.state.player == 'playerX' ? snapshot.val().playerXName : snapshot.val().playerOName,
        opponentName: this.state.player == 'playerX' ? snapshot.val().playerOName : snapshot.val().playerXName
      })
    })
  }

  componentWillUnmount() {
    this.props.firebase.room().off();
  }

  playerDisconnect = () => {
    this.props.firebase.room(this.state.roomId)
      .update({
        playerDisconnect: true
      });

    this.props.firebase.openRoom()
      .update({
        isOpen: false
      });
  }
  handleClick(i, myTurn) {
    if (!myTurn)
      return;

    const squares = this.state.squares;

    if (calculateWinner(squares) || squares[i])
      return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.props.firebase.gameState(this.state.roomId)
      .update({
        squares: squares,
        xIsNext: !this.state.xIsNext,
        lastClick: i
      });
  }

  render() {
    const { squares, xIsNext, lastClick, player, playerDisconnect, myName, opponentName } = this.state;
    const winner = calculateWinner(squares);

    const override = css`
    display: inline-block;`;

    let status = '';
    let myTurn = false;
    if (xIsNext && player == 'playerX') {
      myTurn = true;
      status = 'Your turn (X)';
    } else if (!xIsNext && player == 'playerO') {
      myTurn = true;
      status = 'Your turn (O)';
    } else if (xIsNext && player == 'playerO') {
      myTurn = false;
      status = 'Other turn (X)';
    } else if (!xIsNext && player == 'playerX') {
      myTurn = false;
      status = 'Other turn (O)';
    }

    if (winner && !myTurn) {
      status = 'You Win';
    } else if (winner && myTurn) {
      status = 'You Lose';
    }

    if (playerDisconnect) {
      status = 'Opponent disconnected'
    }

    return (
      <div className="game">
        <div className="game-board">
          <h3 className="title">test</h3>
          <div>{myName}</div>
          <div>{opponentName}</div>

          {!winner
            ?
            <div className={(myTurn ? 'myTurn' : 'opponentTurn')}>
              {status}
              <div className='sweet-loading'>
                <ClipLoader
                  sizeUnit={"px"}
                  css={override}
                  size={30}
                  color={'#61aceb'}
                  loading={!myTurn}
                />
              </div>
            </div>
            :
            <div className={(myTurn ? 'winner' : 'loser')}>
              {status}
            </div>
          }
          {playerDisconnect
            ? <div>
              <button className="btn btn-info returnButton">
                <Link to={Routes.Home}>Return</Link>
              </button>
            </div>
            : <div></div>
          }

          <div style={{ height: '400px' }}>
            sdf
          </div>
          <Board
            squares={squares}
            lastClick={lastClick}
            onClick={(i) => this.handleClick(i, myTurn)}
            winSeq={winner.sequence} />
        </div>
        {/* <div className="game-info">
          <div>{status}</div>
        </div> */}
      </div >
    );
  }
}



export default withFirebase(Game)

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
  }

  for (var i = 0; i < squaresArray.length; i++) {
    for (var j = 0; j < squaresArray[i].length; j++) {
      if (squaresArray[i][j]) {
        winner = findFiveInARow(squaresArray, i, j);
        if (winner) {
          return winner;
        }

      }
    }
  }
  return "";
}

function findFiveInARow(matrix, row, column) {
  var mLength = matrix.length + 1;
  var selected = matrix[row][column];
  var sequence = [];
  var win;
  //Horizontal right
  for (var i = 0; i < 5; i++) {
    if (0 > column - 4 || selected != matrix[row][column - i]) {
      sequence = [];
      win = false;
      break;
    }
    sequence.push((row * mLength) + (column - i));
    win = true;
  }
  //Vertical 
  if (!win) {
    for (var i = 0; i < 5; i++) {
      if (0 > row - 4 || selected != matrix[row - i][column]) {
        sequence = [];
        win = false;
        break;
      }
      sequence.push(((row - i) * mLength) + (column));
      win = true;
    }
  }
  //Diagonal Q13
  if (!win) {
    for (var i = 0; i < 5; i++) {
      if (0 > column - 4 || matrix.length < row + 4 || selected != matrix[row + i][column - i]) {
        sequence = [];
        win = false;
        break;
      }
      sequence.push(((row + i) * mLength) + (column - i));
      win = true;
    }
  }
  //Diagonal Q24
  if (!win) {
    for (var i = 0; i < 5; i++) {
      if (0 > column - 4 || 0 > row - 4 || selected != matrix[row - i][column - i]) {
        sequence = [];
        win = false;
        break;
      }
      sequence.push(((row - i) * mLength) + (column - i));
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
