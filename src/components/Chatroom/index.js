import React from 'react';
import classes from './chatroom.module.css'
import { withFirebase } from '../Firebase';

class Chatroom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roomId: this.props.roomId,
            player: this.props.player,
            message: ''
        }
    }

    componentDidMount() {
        this.props.firebase.chat(this.state.roomId).on('value', snapshot => {
            let messages = [];
            console.log(snapshot.val());
            Object.keys(snapshot.val()).forEach((key) => {
                messages.push(snapshot.val()[key]);
            });
            console.log(messages);

        })
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    sendMessage = () => {
        this.props.firebase.chat(this.state.roomId)
            .push({
                message: this.state.message,
                player: this.state.player
            });
        this.setState({
            message:''
        })
    }

    render() {
        const { message } = this.state;

        return (
            <div>
                <input type="text" value={message} name="message" onChange={this.handleChange} />
                <button className={'btn btn-info'} onClick={this.sendMessage} disabled={!message}>Send</button>
            </div>
        );
    }
}

export default withFirebase(Chatroom);