import React, { Component } from 'react';

import './styles/Footer.css';

class Footer extends Component {
    render() {
        return (
            <footer className="footer-container">
                <p className="footer-paragraph">All content&nbsp;&#169;<a href="/about">Hot Pink Enterprise</a>
                </p>
            </footer>
        );
    }
}

export default Footer;