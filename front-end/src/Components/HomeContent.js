import React, { Component } from 'react';
import { Button, Form, Row } from 'react-bootstrap'; 

import './styles/HomeContent.css';

class HomeContent extends Component {
    render() {
        return (
            <div className="home-content-container">
                <Form inline className="search-form">
                        <Form.Control type="text" placeholder="Search..." />
                        <Button type="submit" varient="success">Search</Button>
                </Form>
                <div className="comic-container">
                    <div className="subscriptions-container">
                        <h1>Subscriptions</h1>
                    </div>
                    <div className="recent-container">
                        <h1>Recent Creations</h1>
                    </div>
                    <div className="favorites-container">
                        <h1>Favorites</h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomeContent;