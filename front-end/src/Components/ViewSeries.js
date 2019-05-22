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
            this.setState({visible: false});
        }
        else{
            this.setState({visible: true});
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
            console.log(content);
            if (content.result === "failure") {
                //alert('Could not find series.'); // No comic/no permission
                this.props.history.push('/notfound');
            } else {
                this.setState({ comicData: content.bundleComicList });
            }
        })();
    }

    handleClick = (comic, event) => {
        console.log(comic);
        this.props.history.push(`/view/comic/${comic.username}/${this.props.match.params.seriesName}/${comic.comicName}`);
    }

    handleUpdate = (comic, event) => {
        console.log(comic);
        this.props.history.push(`/update/comic/${comic.username}/${this.props.match.params.seriesName}/${comic.comicName}`);
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

    renderOne(panelList, comicIndex){
        return (
            panelList.map((item, i)=> {
                return item !== null ?
                <div className="view-comics-panel-container" key={item.id}>
                    <img className="view-comics-panel-img" src={item.image} alt="can't load"></img>
                </div>
                :
                null
            })
        )
    }

    render() {
        const cards = this.state.comicData ? this.state.comicData.map((comic, i) => {
            const BtnComp = () => {
                return (
                    <Card.Text><button className="btn-block" onClick={(e) => this.handleUpdate(comic, e)} >Update</button></Card.Text>
                )
            }
            return (
                <div className="view-comics-strip-container" key={comic.comicID}>
                    <div className="view-comics-strip-top">
                        <h3 className="view-comics-h3" onClick={(e) => this.handleClick(comic, e)}>{comic.comicName}</h3>
                        {this.state.visible ? <Button onClick={(e) => this.handleUpdate(comic, e)}>Update</Button> : <Button name={comic.username} onClick={(e)=>{this.handleReport(e,comic.comicID,this.props.CurrUser.id,"comic")}} variant="danger">Report Comic</Button>}
                    </div>
                    <div className="view-comics-strip-bottom">
                        {this.renderOne(comic.comicList, i)}
                    </div>
                    <hr style={{ height: "1vh", width: "100%" }} />
                </div>
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
                        {cards && cards.length !== 0 ? cards : <h2>There Aren't Any Comics In This Series Yet. Create One <a href="/create/comic">Here</a></h2>}
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