import React, { Component } from 'react';
import OnlineGame from '../Game/onlineGame';
import Chatroom from '../Chatroom';
import { withFirebase } from '../Firebase';
import * as Routes from '../../constants/routes';


const newGame = {
    squares: Array(225).fill(''),
    xIsNext: true,
    lastClick: 226
};

class Multiplayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roomId: this.props.location.state != null ? this.props.location.state.roomId : '',
            player: this.props.location.state != null ? this.props.location.state.player : ''
        }
    }

    componentWillMount() {
        if(Routes.DEVELOP && this.props.location.state == null){
            this.testRoom();
        }
    }

    testRoom = () => {
       
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
                                    playerO: true,
                                    playerXName: 'test1',
                                    playerOName: 'test2',
                                    completed: false,
                                    playerDisconnect: false
                                })
                                .then((snap) => {
                                    const newRoomId = snap.key;
                                    this.props.firebase.openRoom()
                                        .update({
                                            roomId: newRoomId,
                                            isOpen: false
                                        }).then(() => {
                                            this.setState({
                                                roomId: newRoomId,
                                                player: 'playerX'
                                            });
                                        });
                                })
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

    }


    render() {
        const { roomId, player } = this.state

        return (
            <div>
                <h5>Multi</h5>
                {roomId
                    ? <div>
                        <Chatroom roomId={roomId} player={player} />
                        <OnlineGame roomId={roomId} player={player} />
                    </div>
                    : <div></div>
                }

            </div>
        );
    }
}

export default withFirebase(Multiplayer);