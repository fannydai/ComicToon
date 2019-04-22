import React, { Component } from 'react';
import { Button, Card } from 'react-bootstrap';
import './styles/Admin.css';
import {withRouter} from 'react-router-dom'
import NavigationBar from './NavigationBar';
import Footer from './Footer';

class Admin extends Component {
    constructor(){
        super()
        this.state = {
            usersKeys: [],
            usersValues: [],
            comicsKeys: [],
            comicsValues: [],
            seriesKeys: [],
            seriesValues: [],
            commentsKeys: [],
            commentsValues: []
        }
    }

    componentDidMount(){
        //fill page with reported users, comics, series, and comments
        (async () => {
            const res = await fetch("http://localhost:8080/adminData", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                }
            });
            let content = await res.json();
            console.log(content)
            const k_users = Object.keys(content.users);  //user ids
            const v_users = Object.values(content.users); //frequency of reports
            const k_comics = Object.keys(content.comics); //comics ids
            const v_comics = Object.values(content.comics); //frequency of reports
            const k_series = Object.keys(content.series); //series ids
            const v_series = Object.values(content.series); //frequency of reports
            const k_comments = Object.keys(content.comments) //comments ids
            const v_comments = Object.values(content.comments) //frequency of reports
            this.setState({
                usersKeys: k_users,
                usersValues: v_users,
                comicsKeys: k_comics,
                comicsValues: v_comics,
                seriesKeys: k_series,
                seriesValues: v_series,
                commentsKeys: k_comments,
                commentsValues: v_comments
            });
        })();  
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleRequest = (e) => {
        e.preventDefault()
        console.log(this.state.toDeactivate)  
    }

    deactivateUser = (e) =>{
        (async () => {
            const res = await fetch("http://localhost:8080/deactivate", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    userID: e.target.name
                })
            });
            let content = await res.json();
            console.log(content)
            if(content.status === "success") {alert("DEACTIVATED!!");}
            this.componentDidMount();
        })();
        
    }

    deleteComic = (e) => {
        (async () => {
            const res = await fetch("http://localhost:8080/adminRemoveComic", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    id: e.target.name
                })
            });
            let content = await res.json();
            console.log(content)
            if(content.status === "success") {alert("DELETED COMIC!!");}
            else{alert("COMIC NOT FOUND");}
            this.componentDidMount();
        })();
    }

    deleteSeries = (e) => {
        
    }

    deleteComment = (e) => {
        alert("comment deleted!")
        //todo
    }

    render() {
        const badUsers = this.state.usersKeys.length ? this.state.usersKeys.map((item, i) => {
            return (
                item ?
                <Card key={item}>
                    <Card.Body>
                        <Card.Title>User ID: {item}</Card.Title>
                        <Card.Text>Number of Times Reported: {this.state.usersValues[i]}</Card.Text>
                        <Button name={item} onClick={this.deactivateUser} variant="danger">Deactivate User</Button>
                    </Card.Body>
                </Card>
                : null
            )
        }) : <h3> NO USERS FOUND</h3>
        const badComics = this.state.comicsKeys.length ? this.state.comicsKeys.map((item, i) => {
            return (
                item ?
                <Card key={item}>
                    <Card.Body>
                        <Card.Title>Comic ID: {item}</Card.Title>
                        <Card.Text>Number of Times Reported: {this.state.comicsValues[i]}</Card.Text>
                        <Button name={item} onClick={this.deleteComic} variant="danger">Delete Comic</Button>
                    </Card.Body>
                </Card>
                : null
            )
        }) : <h3> NO COMCICS FOUND</h3>
        const badSeries = this.state.seriesKeys.length ? this.state.seriesKeys.map((item, i) => {
            return (
                item ?
                <Card key={item}>
                    <Card.Body>
                        <Card.Title>Series ID: {item}</Card.Title>
                        <Card.Text>Number of Times Reported: {this.state.seriesValues[i]}</Card.Text>
                        <Button name={item} onClick={this.deleteSeries} variant="danger">Delete Series</Button>
                    </Card.Body>
                </Card>
                : null
            )
        }) : <h3> NO SERIES FOUND</h3>
        const badComments = this.state.commentsKeys.length ? this.state.commentsKeys.map((item, i) => {
            return (
                item ?
                <Card key={item}>
                    <Card.Body>
                        <Card.Title>Comment ID: {item}</Card.Title>
                        <Card.Text>Number of Times Reported: {this.state.commentsValues[i]}</Card.Text>
                        <Button name={item} onClick={this.deleteComment} variant="danger">Delete Comment</Button>
                    </Card.Body>
                </Card>
                : null
            )
        }) : <h3> NO COMMENTS FOUND</h3>
        return (
            <div>
                <NavigationBar />
                <h1> ADMIN WELCOME </h1>
                <div className="de-active">
                    <h3>Reported Users: </h3>
                    {badUsers}
                </div>
                <hr/>
                <div className="del-series">
                    <h3>Reported Series: </h3>
                    {badSeries}
                </div>
                <div className="del-comics">
                    <h3>Reported Comics: </h3>
                    {badComics}
                </div>
                <div className="del-comments">
                    <h3>Reported Comments: </h3>
                    {badComments}
                </div>
                <Footer />
            </div>
        );
    }
}

export default withRouter(Admin);