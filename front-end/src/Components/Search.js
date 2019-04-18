import React, { Component } from 'react';
import NavigationBar from './NavigationBar';
import './styles/HomeContent.css';
import {withRouter} from 'react-router-dom';

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
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
            this.setState({user: content.user, seriess: content.all_series, comics: content.all_comics})
        })();   
    }

    renderUser() {
        console.log(this.state.user)
        return (
            <div>
                <button onClick={this.handleSubscribe}>Subscribe</button>
                <button onClick={this.handleUnSubscribe}>UnSubscribe</button>
                <div onClick={this.handleSeeUserStuff}>
                    <h4>{this.state.user.username}</h4>
                    <h4>Total Series: {this.state.user.comicSeries.length} </h4>
                    <h4>Total Comics: {this.state.user.comics.length} </h4>
                </div>
            </div>
        )
        
    }

    handleSeeUserStuff = () => {
        this.props.history.push({
            pathname: '/dashboard', 
            state: {
              username: this.state.user.username
            }
        })
    }

    handleSubscribe = () => {
        if(localStorage.getItem("user") === this.state.user.username)
            alert("YOU CAN'T SUBSCRIBE TO YOURSELF XD");
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
                        sub: this.state.user.username
                    })
                });
                let content = await res.json();
                console.log(content)
                if(content.result === "error") alert("YOU'RE ALREADY SUBSCRIBED TO THIS USER!")
                else alert(`You are now subscribed to ${this.state.user.username}!!`)
            })(); 
        }
    }

    handleUnSubscribe = () => {
        if(localStorage.getItem("user") === this.state.user.username)
            alert("YOU CAN'T UNSUBSCRIBE TO YOURSELF XD");
        else{
            console.log(this.state.user.username);
            (async () => {
                console.log(this.state.user.username);
                const res = await fetch("http://localhost:8080/unsubscribe", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        username: localStorage.getItem("user"),
                        unSub: this.state.user.username
                    })
                });
                let content = await res.json();
                console.log(content)
                if(content.result === "error") alert("YOU'RE NOT EVEN SUBSCRIBED TO THIS USER!")
                else alert(`You are now unsubscribed to ${this.state.user.username}!!`)
            })(); 
        }
    }

    render() {
        if(this.state.user !== null){
            return (
                <div className="home-main-container">
                    <NavigationBar history={this.props.history}/>
                    <div className="search-results-container"> {/*add this to css */}
                        {this.renderUser()}
                    </div>
                </div>
            );
        }
        else{
            return(
                <div className="home-main-container">
                    <NavigationBar history={this.props.history}/>
                    <h1>NO RESULTS!!</h1>
                </div>
            )
        }
    }
}

export default withRouter(Search);