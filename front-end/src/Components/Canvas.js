import React, { Component } from 'react';
import NavigationBar from './NavigationBar';
import './styles/Canvas.css';

class Canvas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            iframe: '<iframe class="muro" height = 100%; src="deviantart_muro_sandbox.html?background=..%2Fimages%2Fcrane_squared_by_mudimba_and_draweverywhere.png">'
        }    
    }
    
    /* Script for the canvas */
    componentDidMount() {
        const script = document.createElement('script');
        script.src = process.env.PUBLIC_URL + '/LoadCanvas.js';
        script.async = true;
        console.log(script);
        document.body.appendChild(script);
    }

    render() {
        return (
            <div className="canvas-container">
                <NavigationBar />
                <div className="canvas-bottom" dangerouslySetInnerHTML={{ __html: this.state.iframe }}>
                </div>
            </div>
        );
    }
}

export default Canvas;