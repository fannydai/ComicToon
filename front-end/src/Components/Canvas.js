import React, { Component } from 'react';
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

const history = require('browser-history')

class Canvas extends Component {

    constructor(props) {
        super(props);
        this.state = {            
            undo: [],
            redo: [],
            undoBtn: 'disable',
            redoBtn: 'disable',
            
            zooming: false,
            canvasState: null,

            brushColor: '#FF0000',
            lineWidth: 1,
            stroke: '#FF0000',

            previousCanvas: null
        }
    }

    componentDidMount() {
        this.canvas = new fabric.Canvas('canvas', {
            height: 600,
            width: 600,
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
        // this.canvas.freeDrawingBrush.width = 1;

        // Scaling
        // this.canvas.on('object:scaling', (e) => {
        //     if (e.target.strokeWidthUnscaled && e.target.strokeWidth) {
        //         e.target.strokeWidthUnscaled = e.target.strokeWidth;
        //     }
        //     if (e.target.strokeWidthUnscaled) {
        //         e.target.strokeWidth = e.target.strokeWidthUnscaled  / e.target.scaleX; 
        //     }
        // });
    }

    handlePencil = (event) => {
        this.pencilBrush.color = this.state.brushColor;
        this.canvas.freeDrawingBrush.width = this.state.lineWidth;
        this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
    }

    handleChangeLineWidth = (event) => {
        this.setState({ lineWidth: event.target.value });
        this.canvas.freeDrawingBrush.width = event.target.value;
    }
    
    handleText = (event) => {
        const newText = new fabric.Textbox('Lorum ipsum dolor sit amet', {
            left: 50,
            top: 50,
            width: 150,
            fontSize: 20
        });
        this.canvas.add(newText).setActiveObject(newText);
    }

    handleColor = (event) => {
        this.setState({ brushColor: event.target.value });
        // Change the brush color
        this.canvas.freeDrawingBrush.color = event.target.value;
    }

    handlePolygon = (event) => {
        console.log('MAKING POLYGON');
        const newPolygon = new fabric.Polygon([0, 0], {
			opacity: 1,
			selectable: false,
			hasBorders: true,
			fill: this.state.brushColor,
			stroke: this.state.stroke,
			strokeWidth: this.state.lineWidth,
		});
        this.canvas.add(newPolygon);
    }

    handleLine = (event) => {
        console.log('MAKING LINE');
        console.log(this.state.lineWidth);
        const newLine = new fabric.Line([0, 0, 50, 50], {
            stroke: this.state.brushColor,
            strokeWidth: this.state.lineWidth
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

    // Not working will work on undo & redo later
    handleUndo = (event) => {
        if(this.state.undo.length !== 0) {
            this.state.redo.push(this.state.previousCanvas);
            this.canvas.clear();

            const lastElement = this.state.undo.pop();
            this.canvas.loadFromJSON(lastElement, () => {
                this.setState({ previousCanvas: lastElement });
            });
        }
        if(this.state.undo.length == 0) {
            this.setState({undoBtn: 'disable'});
        }
    }

    handleRedo = (event) => {
        if(this.state.redo.length !== 0) {
            this.state.undo.push(this.state.previousCanvas);
            this.canvas.clear();

            const lastElement = this.state.redo.pop();
            this.canvas.loadFromJSON(lastElement, () => {
                this.setState({ previousCanvas: lastElement });
            });
        }
        if(this.state.redo.length == 0) {
            this.setState({redoBtn: 'disable'});
        }
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
        history(-1); //bo back bc used in update and create pages
    }

    render() {
        return (
            <div className="panel-container">
                <NavigationBar />
                <div className="panel">
                    <div className="top-canvas">
                        <div className="canvas-tool-container">
                            <FontAwesomeIcon className="icon" icon="pencil-alt" onClick={this.handlePencil} />
                            <FontAwesomeIcon className="icon" icon="font" onClick={this.handleText} />
                            <FontAwesomeIcon className="icon" icon="slash" onClick={this.handleLine} />
                            <input type="color" value={this.state.brushColor} onChange={this.handleColor} />
                            <FontAwesomeIcon className="icon" icon="circle" onClick={this.handleCircle} />
                            <FontAwesomeIcon className="icon" icon="square" onClick={this.handleRectangle} />
                            <FontAwesomeIcon className="icon" icon="play" onClick={this.handleTriangle} />
                            <FontAwesomeIcon className="icon" icon="search-plus" onClick={this.handleZoom} />
                            <FontAwesomeIcon className={this.state.undoBtn} icon="undo" onClick={this.handleUndo}/>
                            <FontAwesomeIcon className={this.state.redoBtn} icon="redo" onClick={this.handleRedo}/>
                            <FontAwesomeIcon className="icon" icon="download" onClick={this.handleDownload} />
                            <FontAwesomeIcon className="icon" icon="check" onClick={this.handleDone} />
                        </div>
                        <canvas id='canvas'></canvas>
                    </div>
                    <div className="canvas-bottom-tool-container">
                        <div htmlFor="lineWidthSlider">Line Width: {this.state.lineWidth}</div>
                        <input type="range" min="1" max="100" id="lineWidthSlider" value={this.state.lineWidth} onChange={this.handleChangeLineWidth} />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(StateToProps, { addPanel })(withRouter(Canvas));