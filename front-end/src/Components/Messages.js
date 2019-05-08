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
            conversations: [] //index 0 is reciever's username & index 1 is array of ordered messages between the two users
        }
        socket = io('http://localhost:4000', { transports: ['websocket'] }); //connect to web socket
    }

    componentWillMount(){
        if(!this.props.CurrUser.active || this.props.CurrUser.username === "" || this.props.CurrUser.token === "" || this.props.CurrUser.email === "") {
            localStorage.removeItem("state");
            this.props.history.push('/');
            return false;
        }
        else if (!this.props.CurrUser.isValidated) {
            this.props.history.push('/verify');
            return false;
        }
    }

    componentDidMount() { //load all of user's messages
        (async () => {
            const res = await fetch("http://localhost:4000/allMessages", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    token: this.props.CurrUser.token,
                    sender: this.props.CurrUser.username
                })
            });
            let content = await res.json();
            console.log(content)
            //populate component with messages
            let data = new Map();
            if(content.status === "success"){
                if(content.messages.length !== 0){
                    content.messages.forEach(item => { 
                        if(data.has(item.reciever)) data.get(item.reciever).unshift(item);
                        else data.set(item.reciever, [item]);
                    });
                    let temp = data.get(this.props.CurrUser.username); 
                    data.delete(this.props.CurrUser.username);
                    temp.forEach((item) => {
                        data.get(item.sender).unshift(item) //and other end to each conversation
                    });
                    data.forEach((item) => {
                        item.sort(function(a,b){return a.date - b.date}) //sort each msg in conversation
                    });
                    console.log(data);
                    let conversations = [];
                    let it = data[Symbol.iterator]();
                    for(let temp of it) conversations.push(temp);
                    this.setState({conversations: conversations});
                }
                else console.log("YOU GOT NO MESSAGES:((")
            }
            else alert("ERROR!")
        })();
    }

    handleSendMessage = () => {
        socket.emit("saveMessage", {token: this.props.CurrUser.token, sender: this.props.CurrUser.username, reciever: "placeholder", message: "testing 123", date: Date.now()});
        socket.on("result", function(data){
            console.log(data);
        });
        socket.on("error", function(data){
            console.log(data);
        });
    }

    componentWillUnmount() {
        socket.off("result"); //avoid multiple listeners
        socket.off("error");
    }

    render() {
        return (
            <div>
                <NavigationBar history={this.props.history}/>
                <div className="container">
                    <h3 className= "text-center" style= {{color: 'white'}}> Your Messages</h3>
                    <div className="messaging">
                        <div className="inbox_msg">
                            <div className="inbox_people">
                                <div className="headind_srch">
                                    <div className="recent_heading">
                                    <h4>Recent</h4>
                                    </div>
                                    <div className="srch_bar">
                                        <div className="stylish-input-group">
                                            <input type="text" className="search-bar"  placeholder="Search" />
                                            <span className="input-group-addon">
                                                <button type="button"> <i className="fa fa-search" aria-hidden="true"></i> </button>
                                            </span> 
                                        </div>
                                    </div>
                                </div>
                                <div className="inbox_chat">
                                    <div className="chat_list active_chat">
                                        <div className="chat_people">
                                            <div className="chat_ib">
                                                <h5>Joel George <span className="chat_date">Dec 25</span></h5>
                                                <p>Testing</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="chat_list active_chat">
                                        <div className="chat_people">
                                            <div className="chat_ib">
                                                <h5>Meow <span className="chat_date">Dec 26</span></h5>
                                                <p>Testing again</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mesgs">
                                <div className="msg_history">
                                    <div className="incoming_msg">
                                        <div className="received_msg">
                                            <div className="received_withd_msg">
                                                <p>Testing</p>
                                                <span className="time_date"> 11:01 AM    |    June 9</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="outgoing_msg">
                                        <div className="sent_msg">
                                            <p>Testing</p>
                                            <span className="time_date"> 11:02 AM    |    June 9</span> 
                                        </div>
                                    </div>
                                    <div className="incoming_msg">
                                        <div className="received_msg">
                                            <div className="received_withd_msg">
                                                <p>heyyyy;)</p>
                                                <span className="time_date"> 11:03 AM    |    June 9</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="outgoing_msg">
                                        <div className="sent_msg">
                                            <p>bye</p>
                                            <span className="time_date"> 11:04 AM    |    June 9</span> 
                                        </div>
                                    </div>
                                </div>
                                <div className="type_msg">
                                    <div className="input_msg_write">
                                        <input type="text" className="write_msg" placeholder="Type a message" />
                                        <button className="msg_send_btn" type="button"><i className="fa fa-paper-plane-o" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(StateToProps, { })(withRouter(Messages));;