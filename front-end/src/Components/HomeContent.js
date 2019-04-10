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
            isLoading: true
        }
    }

    componentDidMount(){
        (async () => {
            const res = await fetch("http://localhost:8080/welcomerecent", {
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
            this.setState({allComics: content.bundleComicList, isLoading: false})
        })();
    }

    renderOne(panelList){
        return (
            panelList.map(item=> {
                return item !== null ?
                <div key={item.id}>
                    <img src={item.image} alt="can't load"></img>
                </div>
                :
                null
            })
        )
    }

    renderAll(){
        console.log(this.state.allComics)
        if(this.state.allComics != null)
            return (
                this.state.allComics.map(item=> {
                    return item !== null ?
                    <div key={item.comicName}>
                        {/* <button onClick={this.handleDel} name={item.comicID}>Delete?</button> */}
                        {this.renderOne(item.comicList)}
                        <hr/>
                    </div>
                    :
                    null
                })
            )
        else{
            return(
                <h2>NO COMICS CREATED</h2>
            )
        }
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
        var props = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
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
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
                },
                {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2
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

        return (
            <div className="home-main-container">
                <NavigationBar history={this.props.history}/>

                <div className="home-content-container">
                    <h2>Subscriptions</h2>
                    <Slider {...props}>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic}/>
                        <img src={yeti} className="comic" onClick={this.handleGoToComic}/>
                        <img src={pi} className="comic" onClick={this.handleGoToComic}/>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic}/>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic}/>
                        <img src={yeti} className="comic" onClick={this.handleGoToComic}/>
                        <img src={pi} className="comic" onClick={this.handleGoToComic}/>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic}/>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic}/>
                        <img src={yeti} className="comic" onClick={this.handleGoToComic}/>
                        <img src={pi} className="comic" onClick={this.handleGoToComic}/>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic}/>
                    </Slider>
                </div>

                <div className="home-content-container">
                    <h2>Recent Creations</h2>
                    {/* <Slider {...props}> */}
                    <div>
                        {this.renderAll()}
                    </div>
                    {/* </Slider> */}
                </div>

                <div className="home-content-container">
                    <h2>Favorites</h2>
                    <Slider {...props}>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic}/>
                        <img src={yeti} className="comic" onClick={this.handleGoToComic}/>
                        <img src={pi} className="comic" onClick={this.handleGoToComic}/>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic}/>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic}/>
                        <img src={yeti} className="comic" onClick={this.handleGoToComic}/>
                        <img src={pi} className="comic" onClick={this.handleGoToComic}/>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic}/>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic}/>
                        <img src={yeti} className="comic" onClick={this.handleGoToComic}/>
                        <img src={pi} className="comic" onClick={this.handleGoToComic}/>
                        <img src={shoes} className="comic" onClick={this.handleGoToComic}/>
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