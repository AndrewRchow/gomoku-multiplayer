import React, { Component } from 'react';
import OnlineGame from '../Game/onlineGame';
import Chatroom from '../Chatroom';

class Multiplayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roomId: this.props.location.state.roomId,
            player: this.props.location.state.player
        }
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

export default Multiplayer;