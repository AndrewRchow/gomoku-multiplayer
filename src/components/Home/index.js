import React from 'react';
import './home.css';
import { BrowserRouter as Router, Route, HashRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/core';

import OfflineGame from '../Game/offlineGame'
import * as Routes from '../../constants/routes';
import table from '../../media/images/gomoku-table.png';

const newGame = {
    squares: Array(225).fill(''),
    xIsNext: true,
    lastClick: 226
};

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: '',
            roomId: '',
            roomInfo: {},
            player: '',
            name: ''
        }
    }

    componentDidMount() {
        console.log([{
            squares: Array(225).fill(null)
        }]);
    }

    componentDidUpdate() {
        if (this.state.roomInfo.playerO) {
            this.props.history.push({
                pathname: Routes.Multiplayer,
                state: {
                    roomId: this.state.roomId,
                    player: this.state.player
                }
            });
        }
    }

    componentWillUnmount() {
        // window.removeEventListener('beforeunload', this.test);
        this.props.firebase.room().off();
    }

    searchButton = () => {
        this.setState({
            loading: true
        }, () => {

            this.props.firebase
                .openRoom()
                .once('value').then((snapshot) => {
                    if (snapshot.val()) {
                        let isOpen = snapshot.val().isOpen;
                        let roomId = snapshot.val().roomId;
                        if (!isOpen) {
                            this.props.firebase.rooms()
                                .push({
                                    gameState: newGame,
                                    chat: '',
                                    playerX: true,
                                    playerO: false,
                                    playerXName: this.state.name,
                                    playerOName: '',
                                    completed: false,
                                    playerDisconnect: false
                                })
                                .then((snap) => {
                                    const newRoomId = snap.key;
                                    this.props.firebase.openRoom()
                                        .update({
                                            roomId: newRoomId,
                                            isOpen: true
                                        }).then(() => {
                                            this.setState({
                                                roomId: newRoomId,
                                                player: 'playerX'
                                            }, () => {
                                                this.props.firebase.room().off();
                                                this.props.firebase.room(newRoomId).on('value', snapshot => {
                                                    this.setState({
                                                        roomInfo: snapshot.val(),
                                                    })
                                                    window.addEventListener('beforeunload', this.playerDisconnect);
                                                })
                                            });
                                        });
                                })
                        } else if (isOpen) {
                            this.props.firebase.room(roomId)
                                .update({
                                    playerO: true,
                                    playerOName: this.state.name,
                                })
                                .then(() => {
                                    this.props.firebase.openRoom()
                                        .update({
                                            isOpen: false
                                        }).then(() => {
                                            this.setState({
                                                roomId: roomId,
                                                player: 'playerO'
                                            }, () => {
                                                this.props.firebase.room().off();
                                                this.props.firebase.room(roomId).on('value', snapshot => {
                                                    this.setState({
                                                        roomInfo: snapshot.val(),
                                                    })
                                                })
                                            });
                                        });
                                });
                        }

                        // this.props.firebase.room(roomId).on('value', snapshot => {
                        //   console.log(snapshot.val());
                        //   if (napshot.val()) {
                        //     const roomInfo = Object.keys(snapshot.val()).map(key => ({
                        //       bobaShop: key,
                        //       userid,
                        //       ...myReviewsObject[key],
                        //     }))
                        //     this.sortReviews(myReviewsList)
                        //   } else {
                        //     this.setState({ reviews: [], loading: false });
                        //   }
                        // });
                    }
                })



        })
    }

    cancelSearchButton = () => {
        if (this.state.player == 'playerX') {
            this.playerDisconnect();
        }
        this.props.firebase.room().off();
        this.setState({
            loading: false
        });
    }

    playerDisconnect = () => {
        this.props.firebase.openRoom()
            .update({
                isOpen: false
            })
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };


    render() {
        const { loading, name, roomInfo, roomId } = this.state;

        const override = css`
            marginRight: 30px`;

        return (
            <div>
                <div className="titleBlock">
                    <h1>Online Gomoku</h1>

                    <div>
                        <img src={table} />
                    </div>

                </div>

                <div className="well searchBox">
                    <label>
                        User name:
                      <input type="text" value={name} name="name" onChange={this.handleChange} style={{marginLeft:'6px'}}/>
                    </label>
                    <div className="searchButton">
                    {loading
                        ? <button style={{ display: "inline" }} onClick={this.cancelSearchButton}>Cancel</button>
                        : <button
                        className={'btn btn-info'} style={{ display: 'inline' }}
                        onClick={this.searchButton} disabled={loading || !name}>Search for room</button>
                    }
                        
                        <div className='sweet-loading' style={{ display: 'block', marginTop:"20px" }}>
                            <ClipLoader
                                sizeUnit={"px"}
                                css={override}
                                size={30}
                                color={'#61aceb'}
                                loading={loading}
                            />
                        </div>
                    </div>


                  


                </div>



                {/* <OfflineGame /> */}

            </div>

        );
    }
}


export default withFirebase(Home);
