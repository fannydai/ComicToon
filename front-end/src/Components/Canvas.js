import React, { Component } from 'react';
import NavigationBar from './NavigationBar';
import './styles/Canvas.css';

class Canvas extends Component {
    render() {
        return (
            <div className="create-comic-container">
                <NavigationBar />
            </div>
        );
    }
}

export default Canvas;