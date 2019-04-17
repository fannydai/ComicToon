import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

import './styles/ViewAllSeries.css';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

import { getAllSeries } from './../Actions/ComicActions';
import LoadingScreen from './LoadingScreen';

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user,
    comic: state.comic
});
class ViewAllSeries extends Component {

    constructor(props) {
        super(props);
        console.log(this.props.comic);
        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        // Fetch all series just in case
        if (this.props.comic.allSeries.length === 0) {
            (async () => {
                const res = await fetch("http://localhost:8080/view/series", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                  },
                  body: JSON.stringify({
                    username: localStorage.getItem('user')
                  })
                });
                let content = await res.json();
                if (content.comicSeries) {
                    this.props.getAllSeries(content.comicSeries);
                    this.setState({ isLoading: false });
                }
            })();  
        } 
    }

    handleClick = (series, event) => {
        this.props.history.push(`/view/series/${localStorage.getItem('user')}/${series.name}`);
    }

    handleUpdate = (series, event) => {
        this.props.history.push(`/update/series/${localStorage.getItem('user')}/${series.name}`);
    }
    
    render() {
        const seriesCards = this.props.comic.allSeries.length ? this.props.comic.allSeries.map((series, i) => {
            return (
                series ? 
                <Card key={i} className="view-series-card">
                    <Card.Body>
                        <Card.Title className="view-series-card-title" onClick={(e) => this.handleClick(series, e)}>{series.name}</Card.Title>
                        <Card.Text>Artist: {localStorage.getItem('user')}</Card.Text>
                        <Card.Text><button className="btn-block" onClick={(e) => this.handleUpdate(series, e)}>Update</button></Card.Text>
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
                    <h1>Your Series</h1>
                </div>
                <div className="view-series-bottom">
                    {seriesCards}
                </div>
                <Footer />
            </div>
        );
    }
}

ViewAllSeries.propTypes = {
    CurrUser: PropTypes.object,
    comic: PropTypes.object
}

export default connect(StateToProps, { getAllSeries })(withRouter(ViewAllSeries));