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
        console.log(this.props.comic);
        this.state = {
            isLoading: true,
            visible: true
        }
    }

    componentDidMount() {
        if(this.props.history.location.state.username === this.props.CurrUser.username){
            this.setState({visible: true})
        }
        else{
            this.setState({visible: false})
        }

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
            if (content.result === "tokenerror") {
                localStorage.removeItem("state");
                this.props.history.push("/");
            } else if (content.comicSeries) {
                this.props.getUserSeries(content.comicSeries);
                this.setState({ isLoading: false });
            }
        })(); 
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
        }) : <h2>NO SERIES FOR THIS USER YET</h2>;
        if (this.state.isLoading) {
            return <LoadingScreen />
        }
        return (
            <div className="view-series-container">
                <NavigationBar />
                <div className="view-series-top">
                    <h1>User Series</h1>
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