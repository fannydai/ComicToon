import React, { Component } from 'react';

import './styles/Footer.css';

class Footer extends Component {
    render() {
        return (
            <footer className="footer-container">
                <p className="footer-paragraph">All content &#169; ComicToon | <a href="/about">ABOUT</a></p>
            </footer>
        );
    }
}

export default Footer;