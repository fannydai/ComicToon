import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import { Card, Button } from 'react-bootstrap';

import './styles/ViewAllSeries.css';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

import { getUserSeries } from './../Actions/ComicActions';
import LoadingScreen from './LoadingScreen';

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user,
    comic: state.comic
});
class UserDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            visible: true
        }
    }

    componentWillMount() {
        if(this.props.CurrUser.username === "" || this.props.CurrUser.token === "" || this.props.CurrUser.email === "" || this.props.CurrUser.isValidated === false){
            localStorage.removeItem("state");
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        if(this.props.history.location.state && this.props.history.location.state.username === this.props.CurrUser.username){
            this.setState({visible: true});
            (async () => {
                const res = await fetch("http://localhost:8080/view/series-viewable", {
                    method: "POST",
                    headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        token: this.props.CurrUser.token,
                        username: this.props.history.location.state.username
                    })
                });
                let content = await res.json();
                console.log(content);
                if (content.result === "tokenerror") {
                    localStorage.removeItem("state");
                    this.props.history.push("/");
                } else if (content.comicSeries) {
                    this.props.getUserSeries(content.comicSeries);
                    this.setState({ isLoading: false });
                }
            })(); 
        } else if (this.props.history.location.state) {
            console.log(this.props.history.location.state);
            (async () => {
                const res = await fetch("http://localhost:8080/view/series-viewable", {
                    method: "POST",
                    headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        token: this.props.CurrUser.token,
                        username: this.props.history.location.state.username
                    })
                });
                let content = await res.json();
                console.log(content);
                if (content.result === "tokenerror") {
                    localStorage.removeItem("state");
                    this.props.history.push("/");
                } else if (content.comicSeries) {
                    this.props.getUserSeries(content.comicSeries);
                    //this.setState({ isLoading: false });
                    this.setState({visible: false, isLoading: false})
                }
            })(); 
        } else{
            this.props.history.goBack();
            //this.setState({visible: false, isLoading: false})
        }
        
    }

    handleClick = (series) => {
        this.props.history.push(`/view/series/${this.props.history.location.state.username}/${series.name}`);
    }

    handleUpdate = (series) => {
        this.props.history.push(`/update/series/${this.props.history.location.state.username}/${series.name}`);
    }

    handleReport = (e, reportedID, reportingID, type) => {
        if(e.target.name === "admin"){
            alert("You can't report an admin")
        }
        else{
            this.props.history.push({
                pathname: '/report', 
                state: {
                  reportingID: reportingID,
                  reportedID: reportedID,
                  type: type
                }
            }) 
        }
    }
    
    render() {
        const seriesCards = this.props.comic.userSeries.length ? this.props.comic.userSeries.map((series, i) => {
            const BtnComp = () => {
                return (
                    <Card.Text><button className="btn-block" onClick={(e) => this.handleUpdate(series, e)}>Update</button></Card.Text>
                )
            }
            return (
                series ? 
                <Card key={i} className="view-series-card">
                    <Card.Body>
                        <Card.Title className="view-series-card-title" onClick={(e) => this.handleClick(series, e)}>{series.name}</Card.Title>
                        <Card.Text>Artist: {this.props.history.location.state.username}</Card.Text>
                        {this.state.visible ? <BtnComp /> : null}
                        {!this.state.visible ? 
                        <Button name={this.props.history.location.state.username} onClick={(e) =>{this.handleReport(e,series.id,this.props.CurrUser.id, "series")}} variant="danger">Report Series</Button>
                        : null}
                    </Card.Body>
                </Card>
                : null
            )
        }) : !this.props.history.location.state ? <h2>FIND INFO ON A USER THROUGH THE SEARCH BAR</h2> : <h2>{this.props.history.location.state.username} HAS NOT POSTED A SERIES YET</h2>;
        if (this.state.isLoading) {
            return <LoadingScreen />
        }
        return (
            <div className="view-series-container">
                <NavigationBar />
                <div className="view-series-top">
                    <h1 className="dashboard-h1">{this.props.history.location.state.username}'s Series</h1>
                </div>
                <div className="view-series-bottom">
                    {seriesCards}
                </div>
                <Footer />
            </div>
        );
    }
}

export default connect(StateToProps, { getUserSeries })(withRouter(UserDashboard));