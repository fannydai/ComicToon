import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

import NavigationBar from './NavigationBar';
import Footer from './Footer';
import './styles/ViewSeries.css';

const StateToProps = (state) => ({ //application level state via redux
    UserSeries: state.NavBar.User_Series,
    CurrUser: state.user
});
class ViewSeries extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comicData: [],
            panels: [],
            visible: true,
            ratings: []
        }
    }

    componentWillMount() {
        if(this.props.CurrUser.username === "" || this.props.CurrUser.token === "" || this.props.CurrUser.email === "" || this.props.CurrUser.isValidated === false){
            this.props.history.push('/')
        }
    }

    componentDidMount() {
        console.log(this.props.match.params.username)
        if(this.props.match.params.username !== this.props.CurrUser.username){
            this.setState({visible: false})
        }
        else{
            this.setState({visible: true})
        }
        (async () => {
            const res = await fetch('http://localhost:8080/view/comic-series', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    comicSeriesName: this.props.match.params.seriesName,
                    ownerName: this.props.match.params.username,
                    viewerName: this.props.CurrUser.token
                })
            });
            let content = await res.json();
            if (content.result === "error") {
                //alert('Could not find series.'); // No comic/no permission
                this.props.history.push('/notfound');
            } else {
                this.setState({ comicData: content.comics });
                for (const comic of content.comics) {
                    console.log(comic)
                    // Get the panel for each comic in the series
                    const pan = await fetch('http://localhost:8080/view/panel', {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json; charset=utf-8"
                        },
                        body: JSON.stringify({
                            id: comic.panelsList[0]
                        })
                    });
                    console.log('PANEL', pan);
                    if (pan.panel) {
                        this.setState({ panels: [...this.state.panels, pan.panel] });
                    }

                    const res = await fetch('http://localhost:8080/comic/rate/getRating', {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json; charset=utf-8"
                        },
                        body: JSON.stringify({
                            comicID: comic.id
                        })
                    });
                    let content = await res.json();
                    this.setState({ratings: [...this.state.ratings, content.result]})
                }
            }
        })();
    }

    handleClick = (comic, event) => {
        console.log(comic);
        this.props.history.push(`/view/comic/${comic.username}/${comic.name}`);
    }

    handleUpdate = (comic, event) => {
        this.props.history.push(`/update/comic/${comic.username}/${comic.name}`);
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
        
        const cards = this.state.comicData ? this.state.comicData.map((comic, i) => {
            const BtnComp = () => {
                return (
                    <Card.Text><button className="btn-block" onClick={(e) => this.handleUpdate(comic, e)} >Update</button></Card.Text>
                )
            }
            return (
                <Card key={i} className="view-one-series-card">
                    <Card.Img variant="top" src={this.state.panels[i]} />
                    <Card.Body>
                        <Card.Title onClick={(e) => this.handleClick(comic, e)}>{comic.name}</Card.Title>
                        <Card.Text>{comic.description}</Card.Text>
                        <Card.Text>Artist: {comic.username}</Card.Text>
                        <Card.Text>Series: {this.props.match.params.seriesName}</Card.Text>
                        <Card.Text> Rating: {this.state.ratings[i]}</Card.Text>
                        {this.state.visible ? <BtnComp /> : null}
                        {!this.state.visible ? 
                        <Button name={comic.username} onClick={(e)=>{this.handleReport(e,comic.id,this.props.CurrUser.id,"comic")}} variant="danger">Report Comic</Button>
                        : null}
                    </Card.Body>
                </Card>
            );
        }) : null;
        return (
            <div className="view-one-series-container">
                <NavigationBar />
                <div className="view-one-series-heading">
                    <h1 className = "hometext">{this.props.match.params.seriesName}</h1>
                    <h2 className = "hometext">By: {this.props.match.params.username}</h2>
                </div>
                <div className="view-one-series-bottom">
                    <div className="view-one-series-comics">
                        {cards && cards.length !== 0 ? cards : <h2>NO COMICS IN THIS SERIES. CREATE ONE <a href="/create/comic">HERE</a></h2>}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

// export default ViewSeries;
ViewSeries.propTypes = {
    UserSeries: PropTypes.string,
    CurrUser: PropTypes.object
}

export default connect(StateToProps, { })(withRouter(ViewSeries));