import React from 'react';
import { BrowserRouter as Router, Route, HashRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/core';

import Game from '../Game/offlineGame'
import * as Routes from '../../constants/routes';

const newGame = {
    history: [{
        squares: Array(225).fill(null)
    }],
    stepNumber: 0,
    xIsNext: true,
    isDraw: false
};

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: '',
            roomId: '',
            roomInfo: {}
        }
    }

    // componentDidMount() {
    // }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.test);
    }

    test = () => {
        // this.props.firebase.room(this.state.roomId)
        //   .update({
        //     test: 'yeet'
        //   })

        // this.props.firebase.openRoom()
        //   .update({
        //     test: 'yeet'
        //   })

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
                                    player1: true,
                                    player2: false,
                                    completed: false,
                                    test: ''
                                })
                                .then((snap) => {
                                    const newRoomId = snap.key;
                                    this.props.firebase.openRoom()
                                        .update({
                                            roomId: newRoomId,
                                            isOpen: true
                                        }).then(() => {
                                            this.setState({
                                                loading: false,
                                                roomId: newRoomId
                                            }, () => {
                                                this.props.firebase.room().off();
                                                this.props.firebase.room(newRoomId).on('value', snapshot => {
                                                    this.setState({
                                                        roomInfo: snapshot.val(),
                                                    })
                                                })
                                                window.addEventListener('beforeunload', this.test);
                                            });
                                        });
                                })
                        } else if (isOpen) {
                            this.props.firebase.room(roomId)
                                .update({
                                    player2: true,
                                })
                                .then(() => {
                                    this.props.firebase.openRoom()
                                        .update({
                                            isOpen: false
                                        }).then(() => {
                                            this.setState({
                                                loading: false,
                                                roomId: roomId
                                            }, () => {
                                                this.props.firebase.room().off();
                                                this.props.firebase.room(roomId).on('value', snapshot => {
                                                    this.setState({
                                                        roomInfo: snapshot.val(),
                                                    })
                                                })
                                                window.addEventListener('beforeunload', this.test);
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
        const { roomInfo } = this.state;
        console.log('tsfest', roomInfo);

        const override = css`
            display: block;
            margin: 30px`;

        if (roomInfo) {
            console.log(roomInfo.test);
        }
        if (roomInfo.test == 'bleh') {
            console.log('bleh');
            this.props.history.push(Routes.Multiplayer);
        }


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
