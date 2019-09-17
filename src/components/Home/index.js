import React from 'react';
import { BrowserRouter as Router, Route, HashRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/core';

import Game from '../Game/offlineGame'
import * as Routes from '../../constants/routes';

const newGame = {
    squares: Array(225).fill(''),
    xIsNext: true,
};

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: '',
            roomId: '',
            roomInfo: {},
            player: ''
        }
    }

    componentDidMount() {
        console.log([{
            squares: Array(225).fill(null)
        }]);
    }

    componentDidUpdate() {
        console.log('blrh', this.state.roomInfo);

        if (this.state.roomInfo.playerO) {
            console.log('blrh', this.state.roomInfo);
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
                                    playerX: true,
                                    playerO: false,
                                    completed: false,
                                    playerDisconnect:false
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
                                                })
                                            });
                                        });
                                })
                        } else if (isOpen) {
                            this.props.firebase.room(roomId)
                                .update({
                                    playerO: true,
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




    render() {
        const { roomInfo, roomId } = this.state;
        console.log('tsfest', roomInfo);

        const override = css`
            display: block;
            margin: 30px`;

        return (
            <div>
                <div>
                    <button className={'form-control'} onClick={this.searchButton}>Ssearch</button>
                    <div className='sweet-loading'>
                        <ClipLoader
                            sizeUnit={"px"}
                            css={override}
                            size={30}
                            color={'#61aceb'}
                            loading={this.state.loading}
                        />
                    </div>
                </div>
                <Game />

            </div>

        );
    }
}


export default withFirebase(Home);
