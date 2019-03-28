import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap'; 
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavigationBar from './NavigationBar';
import './styles/HomeContent.css';

class HomeContent extends Component {
    render() {
        return (
            <div className="home-main-container">
                <NavigationBar />
                <div className="home-content-container">
                    <Form inline className="search-form">
                            <Form.Control type="text" placeholder="Search..." />
                            <Button type="submit" variant="success">Search</Button>
                    </Form>
                    <div className="comic-container">
                        <div className="subscriptions-container">
                            <h1>Subscriptions</h1>
                            <div className="content-container">
                                <div className="left-container">
                                    <FontAwesomeIcon icon="chevron-left" />
                                </div>
                                <div className="middle-container">

                                </div>
                                <div className="right-container">
                                    <FontAwesomeIcon icon="chevron-right" />
                                </div>
                            </div>
                        </div>
                        <div className="recent-container">
                            <h1>Recent Creations</h1>
                            <div className="content-container">
                                <div className="left-container">
                                    <FontAwesomeIcon icon="chevron-left" />
                                </div>
                                <div className="middle-container">

                                </div>
                                <div className="right-container">
                                    <FontAwesomeIcon icon="chevron-right" />
                                </div>
                            </div>
                        </div>
                        <div className="favorites-container">
                            <h1>Favorites</h1>
                            <div className="content-container">
                                <div className="left-container">
                                    <FontAwesomeIcon icon="chevron-left" />
                                </div>
                                <div className="middle-container">

                                </div>
                                <div className="right-container">
                                    <FontAwesomeIcon icon="chevron-right" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomeContent;