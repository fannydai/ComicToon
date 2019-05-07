import React, { Component } from 'react';

import './styles/Messages.css';
import {withRouter} from 'react-router-dom';
import { connect } from 'react-redux'
import NavigationBar from './NavigationBar';
import io from 'socket.io-client';
let socket;


const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user
});


class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: null
        }
        socket = io('http://localhost:4000', { transports: ['websocket'] }); //connect to web socket
    }

    componentWillMount() { //load all of user's messages
        // (async () => {
        //     const res = await fetch("http://localhost:4000/allMessages", {
        //         method: "POST",
        //         credentials: "include",
        //         headers: {
        //             Accept: "application/json",
        //             "Content-Type": "application/json; charset=utf-8"
        //         },
        //         body: JSON.stringify({
        //             token: this.props.CurrUser.token,
        //             sender: this.props.CurrUser.username
        //         })
        //     });
        //     let content = await res.json();
        //     console.log(content)
        //     //populate component with messages
        // })();
    }

    handleSendMessage = () => {
        socket.on("saveMessage", (this.props.CurrUser.token, this.props.CurrUser.username, "placeholder for reciever's username", Date.now()));
    }

    componentWillUnmount() {
        socket.off("saveMessage"); //avoid multiple listeners
    }

    render() {
        return (
            <div>
                <NavigationBar history={this.props.history}/>
                <h1>Messages</h1>
            </div>
        );
    }
}

export default connect(StateToProps, { })(withRouter(Messages));;