import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { fabric } from 'fabric';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavigationBar from './NavigationBar';
import './styles/Canvas.css';
import { addPanel } from '../Actions/ComicActions';

const StateToProps = (state) => ({ //application level state via redux
    comic: state.comic
});

class Canvas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            canRedo: false,
            canUndo: false,
            zooming: false,
            canvasState: null,
            brushColor: '#FF0000',
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
        this.canvas.freeDrawingBrush.color = this.state.brushColor;
        //this.pencilBrush.width = 1;
        this.canvas.freeDrawingBrush.width = 1;
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

    handleColor = (event) => {
        this.setState({ brushColor: event.target.value });
        // Change the brush color
        this.canvas.freeDrawingBrush.color = event.target.value;
    }

    handleLine = (event) => {
        console.log('MAKING LINE');
        const newLine = new fabric.Line([25, 50, 100, 100], {
            stroke: this.state.brushColor
        });
        this.canvas.add(newLine);
    }

    handleCircle = (event) => {
        console.log('MAKING CIRCLE');
        const newCircle = new fabric.Circle({
            radius: 20,
            left: 50,
            top: 50
        });
        this.canvas.add(newCircle);
    }

    handleRectangle = (event) => {
        console.log('MAKING RECTANGLE');
        const newRect = new fabric.Rect({
            left: 50,
            top: 50,
            height: 20,
            width: 20
        });
        this.canvas.add(newRect);
    }

    handleTriangle = (event) => {
        console.log('MAKING TRIANGLE');
        const newTriangle = new fabric.Triangle({
            left: 50,
            top: 50,
            height: 20,
            width: 20
        });
        this.canvas.add(newTriangle);
    }

    handleZoom = (event) => {
        if (!this.state.zooming) {
            console.log('ZOOMING');
            this.setState({ zooming: true });
            this.canvas.on('mouse:wheel', (opt) => {
                var delta = opt.e.deltaY;
                var zoom = this.canvas.getZoom();
                zoom = zoom + delta/200;
                if (zoom > 20) zoom = 20;
                if (zoom < 0.01) zoom = 0.01;
                this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
                opt.e.preventDefault();
                opt.e.stopPropagation();
                var vpt = this.canvas.viewportTransform;
                if (zoom < 400 / 1000) {
                this.canvas.viewportTransform[4] = 200 - 1000 * zoom / 2;
                this.canvas.viewportTransform[5] = 200 - 1000 * zoom / 2;
                } else {
                    if (vpt[4] >= 0) {
                        this.canvas.viewportTransform[4] = 0;
                    } else if (vpt[4] < this.canvas.getWidth() - 1000 * zoom) {
                        this.canvas.viewportTransform[4] = this.canvas.getWidth() - 1000 * zoom;
                    }
                    if (vpt[5] >= 0) {
                        this.canvas.viewportTransform[5] = 0;
                    } else if (vpt[5] < this.canvas.getHeight() - 1000 * zoom) {
                        this.canvas.viewportTransform[5] = this.canvas.getHeight() - 1000 * zoom;
                    }
                }
            })
        } else {
            console.log('CANNOT ZOOM');
            this.setState({ zooming: false });
            this.canvas.off('mouse:wheel');
        }
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

    handleDownload = (event) => {
        const img = this.canvas.toDataURL();
        const a = document.createElement('a');
        a.href = img;
        a.download = 'image.png';
        a.click();
    }

    handleDone = (event) => {
        this.setState({ redo: [] });
        // Done with drawing, reroute back to create comic
        this.props.addPanel(this.canvas.toDataURL(), this.canvas.toJSON());
        this.props.history.push('/create/comic');
    }

    render() {
        return (
            <div className="canvas2-container">
                <NavigationBar />
                <div className="canvas-tool-container">
                    <FontAwesomeIcon className="icon-container" icon="pencil-alt" onClick={this.handlePencil} />
                    <FontAwesomeIcon className="icon-container" icon="paint-brush" onClick={this.handlePaint} />
                    <FontAwesomeIcon className="icon-container" icon="font" onClick={this.handleText} />
                    <FontAwesomeIcon className="icon-container" icon="palette" onClick={this.handleColor} />
                    <FontAwesomeIcon className="icon-container" icon="slash" onClick={this.handleLine} />
                    {/* <input type="color" value={this.state.brushColor} onChange={this.handleColor} /> */}
                    {/* <div className="rando" onClick={this.handleLine}></div> */}
                    <FontAwesomeIcon className="icon-container" icon="circle" onClick={this.handleCircle} />
                    <FontAwesomeIcon className="icon-container" icon="square" onClick={this.handleRectangle} />
                    <FontAwesomeIcon className="icon-container" icon="caret-up" onClick={this.handleTriangle} />
                    <FontAwesomeIcon className="icon-container" icon="search-plus" onClick={this.handleZoom} />
                    <FontAwesomeIcon className="icon-container" icon="undo" onClick={this.handleUndo} />
                    <FontAwesomeIcon className="icon-container" icon="redo" onClick={this.handleRedo} />
                    <FontAwesomeIcon className="icon-container" icon="download" onClick={this.handleDownload} />
                    <FontAwesomeIcon className="icon-container" icon="check" onClick={this.handleDone} />
                </div>
                <div className="canvas-bottom-container">
                    <canvas id='canvas'></canvas>
                </div>
            </div>
        );
    }
}

export default connect(StateToProps, { addPanel })(withRouter(Canvas));