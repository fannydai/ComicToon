import React, { Component } from 'react';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import './styles/About.css';


class About extends Component {

    render() {
        return (
            <div className="about-container">
            <NavigationBar />
            <div className="center">
                <h3>Welcome to ComicToon!</h3>
                <p>
                    The site where you can generate comics, view other users's creations, and share your creations with the <b>ComicToon</b> community! 
                    Our site is all about enjoying yourself and letting your imagination run wild. Have fun and welcome once again!
                </p>
                <p>
                    <b>ComicToon</b> is a web application accessible through most common consumer oriented web browsers. Its purpose is to allow users of 
                    <b>ComicToon</b> to view, create, and upload short comics to the <b>ComicToon</b> website. <b>ComicToon</b> aims to be user friendly, intuitive, and
                    fully featured.
                </p>
                <p>
                    Here are the founders of <b>Hot Pink Enterprise</b>
                </p>
                <ul>
                    <li>Fanng Dai</li>
                    <li>QiYuan Fang</li>
                    <li>Joel George</li>
                    <li>Jeffrey Zou</li>
                </ul>
                <p>
                    Frameworks we used are
                </p>
                <ul>
                    <li>Fabricjs</li>
                    <li>slick</li>
                </ul>
            </div>
            <Footer />
            </div>
        );
    }
}

export default About;