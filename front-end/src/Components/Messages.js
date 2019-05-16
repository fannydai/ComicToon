import React, { Component } from 'react';
import './styles/Messages.css';
import {withRouter} from 'react-router-dom';
import { connect } from 'react-redux'
import NavigationBar from './NavigationBar';
import io from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from "moment";
import Footer from './Footer';
let socket;

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user
});

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conversations: [], //index 0 is reciever's username & index 1 is array of ordered messages between the two users
            currCon: [],
            str: "",
            selectedUser: "",
            talking: ""
        }
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

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    componentDidMount() { //load all of user's messages
        socket = io('http://localhost:4000', { transports: ['websocket'] }); //connect to web socket
        socket.emit('init', this.props.CurrUser.username);
        socket.on('recieveMessage', (data) => {
            let isFound = false;
            const BreakException = {};
            this.state.conversations.forEach((item, i) => {
                if(item[0] === data.username){ //already has a convo with them
                    try{
                        isFound = true;
                        let res = item[1];
                        res.push({date: Date.now(),
                            message: data.message,
                            reciever: this.props.CurrUser.username,
                            sender:  this.state.talking,
                            token: "",
                            __v: 0,
                            _id: ""})
                        if(this.state.talking === "") this.setState({currCon: res, talking: data.username});
                        else {
                            let temp = this.state.conversations;
                            temp.splice(i, 1, [item[0], res])
                            this.setState({conversations: temp});
                        }
                        
                        throw BreakException;
                    }
                    catch(e){
                        if (e !== BreakException) throw e;
                    }
                }
            });
            if(!isFound){ // from new user
                let tempArr = this.state.conversations;
                tempArr.push([data.username, [{date: Date.now(), message: data.message, reciever: this.props.CurrUser.username, sender: data.username, token: this.props.CurrUser.token}]]);
                if(this.state.talking !== "") this.setState({conversations: tempArr});
                else this.setState({conversations: tempArr, currCon: tempArr[tempArr.length-1][1], talking: data.username});
            }
            this.scrollToBottom();
        });
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
                        console.log(data);
                    });
                    console.log(data);
                    if(data.has(this.props.CurrUser.username)){
                        let temp = data.get(this.props.CurrUser.username); 
                        data.delete(this.props.CurrUser.username);
                        temp.forEach((item) => {
                            console.log(item.sender);
                            if(data.get(item.sender)) data.get(item.sender).unshift(item); //and other end to each conversation
                            else data.set(item.sender, [item]);
                        });
                    }
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

    scrollToBottom = () => {document.getElementById("top").scrollTop = document.getElementById("top").scrollHeight;}

    handleSendMessage = (e) => {
        if(this.state.talking === "") alert("Search for a user to talk to or select a conversation to continue talking")
        else if(this.state.str !== ""){
            socket.emit("saveMessage", {token: this.props.CurrUser.token, sender: this.props.CurrUser.username, reciever: this.state.talking, message: this.state.str, date: Date.now()});
            this.setState({str: ""});
            socket.on("result", (data) => {
                console.log(data);
                let tempArr = this.state.currCon;
                tempArr.push({date: Date.now(),
                    message: data,
                    reciever: this.state.talking,
                    sender: this.props.CurrUser.username,
                    token: "",
                    __v: 0,
                    _id: ""})
                this.setState({currCon: tempArr});
                document.getElementById("toClear").value = "";
                socket.off("result"); //avoid multiple listeners
                this.scrollToBottom();
            });
            socket.on("error", function(data){
                alert(data);
                socket.off("error"); //avoid multiple listeners
            });  
        }
        else alert("Type something to send!!")
    }

    componentWillUnmount() {
        socket.emit('remove', this.props.CurrUser.username);   
        socket.disconnect();
    }

    handleSearchUser = (e) => {
        (async () => {
            const res = await fetch("http://localhost:4000/search", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    token: this.props.CurrUser.token,
                    username: this.props.CurrUser.username,
                    toFind: this.state.selectedUser.trim()
                })
            });

            let content = await res.json();
            console.log(content)
            if(content.status === "success"){
                const BreakException = {};
                let flag = false;
                if(content.username === this.props.CurrUser.username) alert("make some friends and message someone else lol");
                else{
                    this.state.conversations.forEach((item) => {
                        if(item[0] === content.username){ //aready has a conversation with them
                            try{
                                this.setState({currCon: item[1], talking: content.username});
                                flag = true;
                                throw BreakException;
                            }
                            catch(e){
                                if (e !== BreakException) throw e;
                            }
                        }
                    });
                    if(!flag){
                        let tempArr = this.state.conversations;
                        tempArr.push([content.username, [{date: Date.now(), message: "", reciever: content.username, sender: this.props.CurrUser.username, token: this.props.CurrUser.token}]]);
                        this.setState({conversations: tempArr, currCon: tempArr[tempArr.length-1][1], talking: content.username});
                        
                    }
                }
                document.getElementById("toClear2").value = "";
            }
            else alert(`${content.status}`)
        })();
    }

    handleOpenConversation = (e) => {
        this.state.conversations.forEach((item) => {
            if(item[0] === e.target.getAttribute('name')) this.setState({currCon: item[1], talking: e.target.getAttribute('name')}, () => {this.scrollToBottom();});
        });
    }

    render() {
        const cons = this.state.conversations.length ? this.state.conversations.map((item) => {
            return (
                item ?
                <div onClick={this.handleOpenConversation} name={item[0]} className="chat_list active_chat" key={item[0]}>
                    <div name={item[0]} className="chat_people">
                         <div name={item[0]} className="chat_ib">
                            <h5 name={item[0]} >{item[0]} <span name={item[0]} className="chat_date">{moment(item[1][item[1].length-1].date).format('MMMM Do YYYY h:mm a')}</span></h5>
                            <p name={item[0]}> {item[1][item[1].length-1].sender}: {item[1][item[1].length-1].message}</p>
                        </div>
                    </div>
                </div>
                : null
            ) 
        }) : null

        const currCon = this.state.currCon.length ? this.state.currCon.map((item, i) => {
            if(item !==null && item.sender === this.props.CurrUser.username && item.message !== ""){ //your own
                return (
                    <div key={i} className="outgoing_msg">
                        <div className="sent_msg">
                            <p>{item.message}</p>
                            <span className="time_date">{item.sender}  |   {moment(item.date).format('MMMM Do YYYY h:mm a')}</span> 
                        </div>
                    </div>
                )
            }
            else if(item !== null && item.message !== ""){
                return(
                    <div key={i} className="incoming_msg">
                        <div className="received_msg">
                            <div className="received_withd_msg">
                                <p>{item.message}</p>
                                <span className="time_date">{item.sender}  |   {moment(item.date).format('MMMM Do YYYY h:mm a')}</span>
                            </div>
                        </div>
                    </div>
                )
            }
        }): null
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
                                            <input id="toClear2" type="text" className="search-bar" placeholder="Enter a user to start messaging" name="selectedUser" onChange={this.handleChange}/>
                                            <span className="input-group-addon">
                                                <button type="button" name="selectedUser" onClick={this.handleSearchUser}> <i className="fa fa-search" aria-hidden="true"></i> </button>
                                            </span> 
                                        </div>
                                    </div>
                                </div>
                                <div className="inbox_chat">
                                    {cons}
                                </div>
                            </div>
                            <div className="mesgs">
                                <div id="top" className="msg_history">
                                    {currCon}
                                </div>
                                <div className="type_msg">
                                    <div className="input_msg_write">
                                        <input id="toClear" type="text" className="write_msg" name="str" placeholder="Type a message" onChange={this.handleChange}/>
                                        <button className="msg_send_btn" type="button" onClick={this.handleSendMessage.bind(this)}><i className="fa fa-paper-plane-o" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default connect(StateToProps, { })(withRouter(Messages));;