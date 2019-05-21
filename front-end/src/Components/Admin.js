import React, { Component } from 'react';
import { Button, Card } from 'react-bootstrap';
import './styles/Admin.css';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import LoadingScreen from './LoadingScreen';

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user
});
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
            commentsValues: [],
            users: [],
            comics: [],
            series: [],
            comments: [],
            owners: [],
            comicSeriesNames: [],
            isLoading: true
        }
    }

    componentDidMount(){
        //fill page with reported users, comics, series, and comments
        (async () => {
            const res = await fetch("http://localhost:8080/adminData", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    token: this.props.CurrUser.token,
                    username: this.props.CurrUser.username
                })
            });
            let content = await res.json();
            console.log(content)
            if (content.result === "success") {
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
                    commentsValues: v_comments,
                    users: content.userContent,
                    comics: content.comicConent,
                    series: content.seriesContent,
                    comments: content.commentContent,
                    owners: content.seriesOwners,
                    isLoading: false
                });
            } else {
                localStorage.removeItem("state");
                this.props.history.push("/");
            }
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
        console.log(e.target);
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

    deleteSeries = (e) => { //adminRemoveSeries
        (async () => {
            const res = await fetch("http://localhost:8080/adminRemoveSeries", {
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
            if(content.status === "success") {alert("DELETED SERIES AND ITS COMICS!!");}
            else{alert("SERIES NOT FOUND");}
            this.componentDidMount();
        })(); 
    }

    deleteComment = (e) => {
        (async () => {
            const res = await fetch("http://localhost:8080/adminRemoveComment", {
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
            if(content.status === "success") {alert("DELETED COMMENT!!");}
            else{alert("COMMENT NOT FOUND");}
            this.componentDidMount();
        })();
    }

    handleSeeUser = (name) => {
        console.log(name)
        this.props.history.push({
            pathname: '/dashboard', 
            state: {
            username: name
            }
        })
    }

    handleSeeSeries = (username, seriesName) => {
        this.props.history.push(`/view/series/${username}/${seriesName}`);
    }

    handleSeeComic = (username, comicName, seriesName) => {
        this.props.history.push(`/view/comic/${username}/${seriesName}/${comicName}`);
    }

    populateSeriesName = (comic, index) => {
        (async () => {
            const res = await fetch("http://localhost:8080/view/series-data", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    id: comic.seriesId
                })
            });
            let content = await res.json();
            console.log(content);
            if (content) {
                this.setState({ comicSeriesNames: [...this.state.comicSeriesNames, content.name ]});
            }
        })();
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
                        <Button name={item} onClick={() => {this.handleSeeUser(this.state.users[i].username)}} variant="primary">See User Details</Button>
                    </Card.Body>
                </Card>
                : null
            )
        }) : <h3> NO USERS FOUND</h3>
        const badComics = this.state.comicsKeys.length ? this.state.comicsKeys.map((item, i) => {
            // Get corresponding comic series name for each reported comic (only when not already populated)
            if (!this.state.comicSeriesNames.length) {
                this.populateSeriesName(item, i);
            }
            return (
                item ?
                <Card key={item}>
                    <Card.Body>
                        <Card.Title>Comic ID: {item}</Card.Title>
                        <Card.Text>Number of Times Reported: {this.state.comicsValues[i]}</Card.Text>
                        <Button name={item} onClick={this.deleteComic} variant="danger">Delete Comic</Button>
                        <Button name={item} onClick={() => {this.handleSeeComic(this.state.comics[i].username, this.state.comics[i].name, this.state)}} variant="primary">See Comic Details</Button>
                    </Card.Body>
                </Card>
                : null
            )
        }) : <h3> NO COMICS FOUND</h3>
        const badSeries = this.state.seriesKeys.length ? this.state.seriesKeys.map((item, i) => {
            return (
                item ?
                <Card key={item}>
                    <Card.Body>
                        <Card.Title>Series ID: {item}</Card.Title>
                        <Card.Text>Number of Times Reported: {this.state.seriesValues[i]}</Card.Text>
                        <Button name={item} onClick={this.deleteSeries} variant="danger">Delete Series</Button>
                        <Button name={item} onClick={() => {this.handleSeeSeries(this.state.owners[i], this.state.series[i].name)}} variant="primary">See Series Details</Button>
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
                        <Card.Text>Ower of Comment: {this.state.comments[i].username}</Card.Text>
                        <Card.Text>Content of Comment: "{this.state.comments[i].content}"</Card.Text>
                        <Button name={item} onClick={this.deleteComment} variant="danger">Delete Comment</Button>
                    </Card.Body>
                </Card>
                : null
            )
        }) : <h3> NO COMMENTS FOUND</h3>
        if (this.state.isLoading) {
            return <LoadingScreen />
        }
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
                <hr/>
                <div className="del-comics">
                    <h3>Reported Comics: </h3>
                    {badComics}
                </div>
                <hr/>
                <div className="del-comments">
                    <h3>Reported Comments: </h3>
                    {badComments}
                </div>
                <Footer />
            </div>
        );
    }
}

export default connect(StateToProps, {})(withRouter(Admin));