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
        this.canvas.on('object:added', (event) => {
            this.handleSave(event);
        });
        this.canvas.on('object:modified', (event) => {
            this.handleSave(event);
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
        console.log('UNDO', this.state.undo);
        console.log('PREVIOUS', this.state.previousCanvas);
        const newRedo = [...this.state.redo, this.state.previousCanvas];
        console.log('NEW REDO', newRedo);
        this.setState({ redo: newRedo });
        this.canvas.clear();
        const newUndo = [...this.state.undo];
        const lastElement = newUndo.pop();
        this.canvas.loadFromJSON(lastElement, () => {
            this.setState({ previousCanvas: lastElement });
            this.setState({ undo: newUndo });
        });

    }

    handleRedo = (event) => {
        console.log('REDO', this.state.redo);
        console.log('PREVIOUS', this.state.previousCanvas);
        const newUndo = [...this.state.undo, this.state.previousCanvas];
        this.setState({ undo: newUndo });
        this.canvas.clear();
        const newRedo = [...this.state.redo];
        const lastElement = newRedo.pop();
        this.canvas.loadFromJSON(lastElement, () => {
            this.setState({ previousCanvas: lastElement });
            this.setState({ redo: newRedo });
        });
    }

    handleMouseDown = (event) => {

    }

    handleSave = (event) => {
        console.log(event);

        console.log('SAVING');
        const newCanvas = this.canvas.toJSON()
        this.setState({ redo: [] });
        // Push the canvas onto the undo stack
        if (this.state.previousCanvas) {
            const newUndo = this.state.undo;
            newUndo.push(this.state.previousCanvas);
            this.setState({ undo: newUndo });
        }
        this.setState({ previousCanvas: newCanvas });
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
                <canvas id='canvas'></canvas>
            </div>
        );
    }
}

export default Canvas2;