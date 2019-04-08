import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Button, Form, Image } from 'react-bootstrap'; 
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavigationBar from './NavigationBar';
import './styles/HomeContent.css';
import shoes from './images/shoes.png';
import pi from './images/pi.png';
import yeti from './images/yeti.png';
import Footer from './Footer';
import { getSubscriptions, getRecentCreations, getFavorites } from './../Actions/ComicActions';

const StateToProps = (state) => ({ //application level state via redux
    info: state.info
});

class HomeContent extends Component {
    constructor(props) {
        super(props);
    }

    handleClick = (event) => {
        console.log(event.target);
        // Go to the comic/series
    }

    handleLeft = (event) => {

    }

    handleRight = (event) => {
        
        
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
            <div className="home-main-container">
                <NavigationBar history={this.props.history}/>
                <div className="home-content-container">
                    <div className="comic-container">
                        <div className="subscriptions-container">
                            <h2>Subscriptions</h2>
                            <div className="content-container">
                                <div className="left-container" onClick={this.handleLeft}>
                                    <FontAwesomeIcon icon="chevron-left" />
                                </div>
                                <div className="middle-container">
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={shoes} onClick={this.handleGoToComic}/>
                                    </div>
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={shoes} onClick={this.handleGoToComic}/>
                                    </div>
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={shoes} onClick={this.handleGoToComic}/>
                                    </div>
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={shoes} onClick={this.handleGoToComic}/>
                                    </div>
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={shoes} onClick={this.handleGoToComic}/>
                                    </div>
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={shoes} onClick={this.handleGoToComic}/>
                                    </div>
                                </div>
                                <div className="right-container" onClick={this.handleRight}>
                                    <FontAwesomeIcon icon="chevron-right" />
                                </div>
                            </div>
                        </div>
                        <div className="recent-container">
                            <h2>Recent Creations</h2>
                            <div className="content-container">
                                <div className="left-container" onClick={this.handleLeft}>
                                    <FontAwesomeIcon icon="chevron-left" />
                                </div>
                                <div className="middle-container">
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={pi} onClick={this.handleGoToComic}/>
                                    </div>
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={pi} onClick={this.handleGoToComic}/>
                                    </div>
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={pi} onClick={this.handleGoToComic}/>
                                    </div>
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={pi} onClick={this.handleGoToComic}/>
                                    </div>
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={pi} onClick={this.handleGoToComic}/>
                                    </div>
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={pi} onClick={this.handleGoToComic}/>
                                    </div>  
                                </div>
                                <div className="right-container" onClick={this.handleRight}>
                                    <FontAwesomeIcon icon="chevron-right" />
                                </div>
                            </div>
                        </div>
                        <div className="favorites-container">
                            <h2>Favorites</h2>
                            <div className="content-container">
                                <div className="left-container" onClick={this.handleLeft}>
                                    <FontAwesomeIcon icon="chevron-left" />
                                </div>
                                <div className="middle-container">
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={yeti} onClick={this.handleGoToComic}/>
                                    </div>
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={yeti} onClick={this.handleGoToComic}/>
                                    </div>
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={yeti} onClick={this.handleGoToComic}/>
                                    </div>
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={yeti} onClick={this.handleGoToComic}/>
                                    </div>
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={yeti} onClick={this.handleGoToComic}/>
                                    </div>
                                    <div className="img-container" onClick={this.handleClick}>
                                        <Image className="home-content-img" src={yeti} onClick={this.handleGoToComic}/>
                                    </div>
                                </div>
                                <div className="right-container" onClick={this.handleRight}>
                                    <FontAwesomeIcon icon="chevron-right" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
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
    info: PropTypes.object
}

export default connect(StateToProps, { getSubscriptions, getRecentCreations, getFavorites })(HomeContent);