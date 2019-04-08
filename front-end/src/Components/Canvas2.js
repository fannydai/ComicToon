import React, { Component } from 'react';
import { fabric } from 'fabric';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavigationBar from './NavigationBar';
import './styles/Canvas2.css';

class Canvas2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            canRedo: false,
            canUndo: false,
            canvasState: null,
            brushColor: '#000000',
            undo: [],
            redo: [],
            previousCanvas: null
        }
    }

    componentDidMount() {
        this.canvas = new fabric.Canvas('canvas', {
            height: window.innerHeight * 0.8,
            width: window.innerWidth,
            isDrawingMode: false
        });
        this.pencilBrush = new fabric.PencilBrush(this.canvas);
        this.pencilBrush.color = this.state.brushColor;
        this.pencilBrush.width = 1;
    }

    handlePencil = (event) => {
        event.preventDefault();
        this.pencilBrush.color = this.state.brushColor;
        this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
        this.canvas.freeDrawingBrush.width = 1;
    }

    handlePaint = (event) => {
        event.preventDefault();
        this.pencilBrush.color = this.state.brushColor;
        this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
        this.canvas.freeDrawingBrush.width = 30;
    }
    
    handleText = (event) => {
        event.preventDefault();
        const newText = new fabric.Text('Enter Text');
        this.canvas.add(newText).setActiveObject(newText);
    }

    handleUndo = (event) => {
    }

    handleRedo = (event) => {

    }

    handleMouseDown = (event) => {

    }

    handleMouseUp = (event) => {
        console.log(JSON.stringify(this.canvas));
        // Check if the canvas changed
        if (this.previousCanvas != this.canvas.toJSON()) {
            this.setState({ redo: [] });
            
        }
    }

    render() {
        return (
            <div className="canvas2-container">
                <NavigationBar />
                <div className="canvas-tool-container">
                    <FontAwesomeIcon className="icon-container" icon="pencil-alt" size="2x" onClick={this.handlePencil} />
                    <FontAwesomeIcon className="icon-container" icon="paint-brush" size="2x" onClick={this.handlePaint} />
                    <FontAwesomeIcon className="icon-container" icon="font" size="2x" onClick={this.handleText} />
                    <FontAwesomeIcon className="icon-container" icon="palette" size="2x" />
                    <FontAwesomeIcon className="icon-container" icon="arrows-alt" size="2x" />
                    <FontAwesomeIcon className="icon-container" icon="undo" size="2x" onClick={this.handleUndo} />
                    <FontAwesomeIcon className="icon-container" icon="redo" size="2x" onClick={this.handleRedo} />
                </div>
                <canvas id='canvas' onMouseUp={this.handleMouseUp}></canvas>
            </div>
        );
    }
}

export default Canvas2;