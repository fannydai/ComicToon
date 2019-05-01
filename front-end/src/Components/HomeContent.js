import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import { getSubscriptions, getRecentCreations, getFavorites, getAllSeries } from './../Actions/ComicActions';

import Slider from "react-slick";

import shoes from './images/shoes.png';
import pi from './images/pi.png';
import yeti from './images/yeti.png';
import Footer from './Footer';

import NavigationBar from './NavigationBar';
import './styles/HomeContent.css';
import LoadingScreen from './LoadingScreen';
import { OverlayTrigger, Popover } from 'react-bootstrap';

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user
});

class HomeContent extends Component {

    constructor(props) {
        super(props);
        // this.handleClick = this.handleClick.bind(this);
        // this.handleUpdate = this.handleUpdate.bind(this);
        this.state = {
            allComics: null,
            subscriptionComics: null,
            isLoading: true
        }
    }

    /*
    componentWillMount() {
        if(this.props.CurrUser.username === "" || this.props.CurrUser.token === "" || this.props.CurrUser.email === "" || this.props.CurrUser.isValidated === false){
            this.props.history.push('/')
        }
    }*/

    componentDidMount(){
        if(!this.props.CurrUser.active) {
            localStorage.removeItem("state");
            this.props.history.push('/');
        }
        else if (!this.props.CurrUser.token || !this.props.CurrUser.isValidated) {
            this.props.history.push('/verify');
        }
        else if(this.props.CurrUser.username === "admin"){
            this.props.history.push('/admin')
        }
        else{
            (async () => {
                const res = await fetch("http://localhost:8080/welcomerecent", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        token: this.props.CurrUser.token,
                        comicOwnerName: this.props.CurrUser.username
                    })
                });
                let content = await res.json();
                console.log(content)
                if (content.result === "success") {
                    this.setState({allComics: content.bundleComicList, isLoading: false})
                } else {
                    localStorage.removeItem("state");
                    this.props.history.push("/");
                }
            })();
            (async () => {
                const res = await fetch("http://localhost:8080/welcomesubscriptions", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        token: this.props.CurrUser.token,
                        comicOwnerName: this.props.CurrUser.username
                    })
                });
                let content = await res.json();
                console.log(content)
                if (content.result === "success") {
                    this.setState({subscriptionComics: content.bundleComicList, isLoading: false})
                } else {
                    localStorage.removeItem("state");
                    this.props.history.push("/");
                }
            })();
        }
    }

    popover(comic) {
        return (
            <Popover title={comic.comicName}>
                Created by {comic.username} on {comic.date}
            </Popover>
        );
    }

    renderRecent(comic){
        const filtered = comic.comicList.filter(item => item !== null);
        return (
            filtered[0] ? <span key={filtered[0].id}><OverlayTrigger trigger="hover" placement="top" overlay={this.popover(comic)}><img className="comic" src={filtered[0].image} alt="comic" /></OverlayTrigger></span> : null
        )
    }

    handleViewRecent = (comicName, username) => {
        this.props.history.push(`/view/comic/${username}/${comicName}`);
    }

    renderRecents(){
        console.log(this.state.allComics)
        if(this.state.allComics != null) {
            return (
                this.state.allComics.map(item=> {
                    return item !== null ?
                    <span key={item.comicName} onClick={() => {this.handleViewRecent(item.comicName, item.username)}}>
                        {this.renderRecent(item)}
                    </span>
                    :
                    null
                })
            )
        }
    }

    renderSubscriptions() {
        if (this.state.subscriptionComics !== null) {
            return (
                this.state.subscriptionComics.map(item => {
                    return item !== null ?
                    <span key={"subscription-" + item.comicName} onClick={() => this.handleViewRecent(item.comicName, item.username)}>
                        {this.renderSubscription(item)}
                    </span>
                    : null
                })
            );
        }
    }

    renderSubscription(comic) {
        const filtered = comic.comicList.filter(item => item !== null);
        return (
            filtered[0] ? <span key={filtered[0].id}><OverlayTrigger trigger="hover" placement="top" overlay={this.popover(comic)}><img className="comic" src={filtered[0].image} alt="comic" /></OverlayTrigger></span> : null
        )
    }


    handleClick = (event) => {
        console.log(event.target);
        // Go to the comic/series
    }

    handleGoToComic = (event) => {
        console.log("in view comic!!")
        console.log(event.target.src)
        console.log(this.props);
        this.props.history.push({
            pathname: "/view/comic",
            state: {
                src: event.target.src
            }
          });
    }

    render() {
        var props = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4,
            initialSlide: 0,
            centerMode: true,
            autoplay: true,
            autoplaySpeed: 5000,
            pauseOnFocus: true,
            pauseOnHover: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        };
        if (this.state.isLoading) {
            return <LoadingScreen />
        }
        // Adjust props dynamically
        var subProps = JSON.parse(JSON.stringify(props)); // Deep copy the props
        if (this.state.subscriptionComics && this.state.subscriptionComics.length < 4) {
            subProps.slidesToShow = this.state.subscriptionComics.length;
            subProps.slidesToScroll = this.state.subscriptionComics.length;
        }
        var recentProps = JSON.parse(JSON.stringify(props)); // Deep copy the props
        if (this.state.allComics && this.state.allComics.length < 4) {
            recentProps.slidesToShow = this.state.allComics.length;
            recentProps.slidesToScroll = this.state.allComics.length;
        }
        return (
            <div className="home-main-container">
                <NavigationBar history={this.props.history}/>

                <div className="home-content-container">
                    <h2 className = "hometext"> Subscriptions</h2>
                    <Slider {...subProps}>
                        {this.renderSubscriptions()}
                    </Slider>
                </div>

                <div className="home-content-container">
                    <h2 className = "hometext">Recent Creations</h2>
                    <Slider {...recentProps}>
                        {this.renderRecents()}
                    </Slider>
                </div>

                <div className="home-content-container">
                    <h2 className = "hometext"> Favorites</h2>
                    <Slider {...props}>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic} alt= "can't load"/>
                        <img src={yeti} className="comic" onClick={this.handleGoToComic} alt= "can't load"/>
                        <img src={pi} className="comic" onClick={this.handleGoToComic} alt= "can't load"/>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic} alt= "can't load"/>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic} alt= "can't load"/>
                        <img src={yeti} className="comic" onClick={this.handleGoToComic} alt= "can't load"/>
                        <img src={pi} className="comic" onClick={this.handleGoToComic} alt= "can't load"/>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic} alt= "can't load"/>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic} alt= "can't load"/>
                        <img src={yeti} className="comic" onClick={this.handleGoToComic} alt= "can't load"/>
                        <img src={pi} className="comic" onClick={this.handleGoToComic} alt= "can't load"/>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic} alt= "can't load"/>
                    </Slider>
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
    getAllSeries: PropTypes.func.isRequired,
    comic: PropTypes.object
}

export default connect(StateToProps, { getSubscriptions, getRecentCreations, getFavorites, getAllSeries })(withRouter(HomeContent));