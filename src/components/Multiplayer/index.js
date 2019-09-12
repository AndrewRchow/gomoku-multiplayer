import React, { Component } from 'react';
import Game from '../Game/onlineGame';

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
                    ? <Game roomId={roomId} player={player}/>
                    : <div></div>
                }

            </div>
        );
    }
}

export default Multiplayer;