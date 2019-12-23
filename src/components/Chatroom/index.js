import React from 'react';
import classes from './chatroom.module.css'
import { withFirebase } from '../Firebase';

class Chatroom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roomId: this.props.roomId,
            player: this.props.player,
            message: '',
            messages: []
        }
    }

    componentDidMount() {
        this.props.firebase.chat(this.state.roomId).on('value', snapshot => {
            let messages = [];
            console.log(snapshot.val());
            Object.keys(snapshot.val()).forEach((key) => {
                messages.push(snapshot.val()[key]);
            });
            this.setState({
                messages
            })
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
            message: ''
        })
    }

    render() {
        const { player, message, messages } = this.state;
        const messagesBox = [];

        for (const [index, value] of messages.entries()) {
            if (value.player == player) {
                messagesBox.push(
                    <li key={index} className={classes.rightMessage}>
                        {value.message}
                    </li>
                )
            } else {
                messagesBox.push(
                    <li key={index}>
                        {value.message}
                    </li>
                )
            }
        }


        return (
            <div className={`${classes.chatRoom}`}>
                <section className={`${classes.chatBox} ${classes.clearfix}`}>
                    <ul className={`${classes.messages} ${classes.clearfix}`}>
                        {messagesBox}
                    </ul>
                </section>
                <div>
                    <input type="text" value={message} name="message" onChange={this.handleChange} />
                    <button className={'btn btn-info'} onClick={this.sendMessage} disabled={!message}>Send</button>

                </div>
            </div>
        );
    }
}

export default withFirebase(Chatroom);