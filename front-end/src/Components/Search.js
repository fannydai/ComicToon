import React, { Component } from 'react';
import NavigationBar from './NavigationBar';
import './styles/HomeContent.css';
import {withRouter} from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { connect } from 'react-redux'

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user
});

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            seriess: [],
            comics: []
        }
    }

    componentDidMount(){
       console.log(this.props.history.location.state.query);
       (async () => {
            const res = await fetch("http://localhost:8080/search", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    query: this.props.history.location.state.query
                })
            });
            let content = await res.json();
            console.log(content)
            this.setState({users: content.users, seriess: content.all_series, comics: content.all_comics})
        })();   
    }

    handleReport = (e) =>{
        e.preventDefault();
        alert("Reported!");
        //todo
    }

    renderUsers() {
        console.log(this.state.users)
        if(this.state.users.length !== 0){
            this.state.users.map(usr => {
                return (
                    <div>
                        <div>
                            <button name={usr.username} onClick={this.handleSubscribe}>Subscribe</button>
                            <button name={usr.username} onClick={this.handleUnSubscribe}>UnSubscribe</button>
                            <Button name={usr.username} onClick={this.handleReport} variant="danger">Report User</Button>
                        </div>
                        <div name={usr.username} onClick={this.handleSeeUserStuff}>
                            <h4>{usr.username}</h4>
                            <h4>Total Series: {usr.comicSeries.length} </h4>
                            <h4>Total Comics: {usr.comics.length} </h4>
                        </div>
                    </div>
                )
            });
        }
        else{
            return(
                <div>
                    <h3>NO USERS MATCHED!</h3>
                </div>
            )
        }  
    }

    renderSeries(){

    }

    renderComics(){

    }

    handleSeeUserStuff = (name) => {
        console.log(name);
        this.props.history.push({
            pathname: '/dashboard', 
            state: {
              username: name
            }
        })
    }

    handleSubscribe = (e) => {
        e.persist();
        console.log(e.target.name);
        if(e.target.name === this.props.CurrUser.username){
            alert("You can't subscribe to yourself...")
        }
        else{
            (async () => {
                const res = await fetch("http://localhost:8080/subscribe", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        username: localStorage.getItem("user"),
                        sub: e.target.name
                    })
                });
                let content = await res.json();
                console.log(content)
                if(content.result === "error") alert("YOU'RE ALREADY SUBSCRIBED TO THIS USER!")
                else alert(`You are now subscribed to ${e.target.name}!!`)
            })(); 
        }
    }

    handleUnSubscribe = (e) => {
        e.persist();
        console.log(e.target.name);
        if(e.target.name === this.props.CurrUser.username){
            alert("You can't unsubscribe from yourself since you can sub to yourself")
        }
        else{
            (async () => {
                const res = await fetch("http://localhost:8080/unsubscribe", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        username: localStorage.getItem("user"),
                        unSub: e.target.name
                    })
                });
                let content = await res.json();
                console.log(content)
                if(content.result === "error") alert("YOU'RE NOT EVEN SUBSCRIBED TO THIS USER!")
                else alert(`You are now unsubscribed to ${e.target.name}!!`)
            })(); 
        }
    }

    render() {
        /*variant="primary"*/
        const matchedUsers = this.state.users.length ? this.state.users.map(usr => {
            return (
                usr ?
                <Card key={usr.username}>
                    <Card.Body>
                        <Card.Title name={usr.username} onClick={() => {this.handleSeeUserStuff(usr.username)}}>User: {usr.username} (click here to see more details)</Card.Title>
                        <Card.Text>Total Series: {usr.comicSeries.length}</Card.Text>
                        <Card.Text>Total Comics: {usr.comics.length}</Card.Text>
                        <Button name={usr.username} onClick={this.handleSubscribe} variant="primary">Subscribe</Button>
                        <Button name={usr.username} onClick={this.handleUnSubscribe} variant="primary">UnSubscribe</Button>
                        <Button name={usr.username} onClick={this.handleReport} variant="danger">Report User</Button>
                    </Card.Body>
                </Card>
                : null
            )
        }) : <h3> NO USERS FOUND</h3>
        return (
            <div className="home-main-container">
                <NavigationBar history={this.props.history}/>
                <div className="search-results-container"> {/*add this to css */}
                    {matchedUsers}
                    {}
                    {}
                </div>
            </div>
        );
    }
}

export default connect(StateToProps, {})(withRouter(Search));