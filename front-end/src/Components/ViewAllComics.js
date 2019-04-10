import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

import NavigationBar from './NavigationBar';
import Footer from './Footer';
import './styles/ViewAllComics.css';
import pusheen from './images/pusheen.png';
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user
});

class ViewAllComics extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount(){
        (async () => {
            const res = await fetch("http://localhost:8080/view/allComics", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    comicOwnerName: this.props.CurrUser.username
                  })
            });
            let content = await res.json();
            console.log(content)
        })();
    }

    handleClick() {
        this.props.history.push('/view/comic');
    }

    handleUpdate() {
        this.props.history.push('/update/comic');
    }

    render() {
        return (
            <div className="view-comics-container">
                <NavigationBar />
                <div className="view-comics-top">
                    <h1>My Comics</h1>
                </div>
                <div className="view-comics-bottom">

                </div>
                <Footer />
            </div>
        );
    }
}

ViewAllComics.propTypes = {
    CurrUser: PropTypes.object
}

export default connect(StateToProps, {})(withRouter(ViewAllComics));