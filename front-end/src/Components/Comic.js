import React, { Component } from 'react';
import NavigationBar from './NavigationBar';
import './styles/Comic.css';

class Comic extends Component {
    render() {
        return (
            <div className="create-comic-container">
                <NavigationBar />
            </div>
        );
    }
}

export default Comic;