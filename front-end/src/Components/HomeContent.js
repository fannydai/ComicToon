import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'

import shoes from './images/shoes.png';
import pi from './images/pi.png';
import yeti from './images/yeti.png';
import Footer from './Footer';
import { getSubscriptions, getRecentCreations, getFavorites } from './../Actions/ComicActions';

import NavigationBar from './NavigationBar';
import './styles/HomeContent.css';

// import Glide from '@glidejs/glide'

const StateToProps = (state) => ({ //application level state via redux
    comic: state.comic
});

class HomeContent extends Component {
    constructor(props) {
        super(props);
    }

    handleClick = (event) => {
        console.log(event.target);
        // Go to the comic/series
    }

    handleGoToComic = (event) => {
        //console.log(event.target.src)
        console.log(this.props);
        this.props.history.push({
            pathname: "/view/comic",
            state: {
                src: event.target.src
            }
          });
    }

    render() {
        return (
            <div class="home-main-container">
                <NavigationBar history={this.props.history}/>
                <div class="home-content-container">
                    <h2>Subscriptions</h2>

                    <div class="glide">
                    <div data-glide-el="track" class="glide__track">
                        <ul class="glide__slides">
                        <li class="glide__slide"><img src={shoes} class="comic" height="175" width="175" onClick={this.handleGoToComic}/></li>
                        <li class="glide__slide"><img src={pi} class="comic" height="175" width="175" onClick={this.handleGoToComic}/></li>
                        <li class="glide__slide"><img src={yeti} class="comic" height="175" width="175" onClick={this.handleGoToComic}/></li>
                        </ul>
                    </div>
                    </div>

                    {/* <Glide {...props}>
                        <img src={shoes} class="comic" height="175" width="175" onClick={this.handleGoToComic}/>
                        <img src={pi} class="comic" height="175" width="175" onClick={this.handleGoToComic}/>
                        <img src={yeti} class="comic" height="175" width="175" onClick={this.handleGoToComic}/>
                    </Glide> */}

                    {/* <h2>Recent Creations</h2>
                    <h2>Favorites</h2> */}
                </div>
                <Footer />
            </div>
        );
    }
}

HomeContent.propTypes = {
    getSubscriptions: PropTypes.func.isRequired,
    getRecentCreations: PropTypes.func.isRequired,
    getFavorites: PropTypes.func.isRequired,
    comic: PropTypes.object
}

export default connect(StateToProps, { getSubscriptions, getRecentCreations, getFavorites })(withRouter(HomeContent));