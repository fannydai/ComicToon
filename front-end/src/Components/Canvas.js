import React, { Component } from 'react';
import {Dropdown, DropdownButton, Form} from 'react-bootstrap';
import NumericInput from 'react-numeric-input';
// import { ItemDirective, ItemsDirective, ToolbarComponent } from '@syncfusion/ej2-react-navigations';

import { fabric } from 'fabric';
// import { CrayonBrush, InkBrush, MarkerBrush } from 'fabric-brush';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavigationBar from './NavigationBar';
import ColorButton from './ColorButton';
import './styles/Canvas.css';
import { addPanel } from '../Actions/ComicActions';
import { updateComicPanel } from '../Actions/NavbarActions';


const history = require('browser-history')

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user
});

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

            brushColor: '#000',
            lineWidth: 1,
            stroke: '#000',

            previousCanvas: null
        }
    }

    componentDidMount() {
        this.canvas = new fabric.Canvas('canvas', {
            height: 600,
            width: 900,
            isDrawingMode: false
        });
        // Load Data if any
        if (this.props.location.state) {
            if (this.props.location.state.previous === 'fromjson') {
                console.log('FROM JSON');
                this.canvas.loadFromJSON(JSON.parse(this.props.location.state.panel.canvas), () => {
                    this.canvas.renderAll();
                }, (o, object) => {
                    console.log(o, object);
                });
            }
        }

        // this.canvas.on('object:added', (event) => {
        //     this.handleSave(event);
        // });
        // this.canvas.on('object:modified', (event) => {
        //     this.handleSave(event);
        // });
    }

    pencil = () => {
        this.canvas.freeDrawingBrush = this.pencilBrush;
        this.canvas.freeDrawingBrush.color = this.state.brushColor;
        this.canvas.freeDrawingBrush.width = this.state.lineWidth;
        this.canvas.isDrawingMode = true;
    }

    handlePencil = (event) => {
        this.pencilBrush = new fabric.PencilBrush(this.canvas);
        this.pencil();
    }

    handlePencilCrayon = (event) => {
        this.pencilBrush = new fabric.CrayonBrush(this.canvas);
        this.pencilBrush.density = 200;
        this.pencilBrush.dotWidth = 1;
        this.pencil();
    }

    handlePencilInk = (event) => {
        this.pencilBrush = new fabric.InkBrush(this.canvas);
        this.pencil();
    }

    handlePencilMarker = (event) => {
        this.pencilBrush = new fabric.MarkerBrush(this.canvas);
        this.pencil();
    }

    handlePencilCircle = (event) => {
        this.pencilBrush = new fabric.CircleBrush(this.canvas);
        this.pencil();
    }

    handlePencilSpray = (event) => {
        this.pencilBrush = new fabric.SprayBrush(this.canvas);
        this.pencil();
    }

    handlePencilPattern = (event) => {
        this.pencilBrush = new fabric.PatternBrush(this.canvas);
        this.pencil();
    }

    handlePencilHline = (event) => {
        this.pencilBrush = new fabric.PatternBrush(this.canvas);
        this.pencil();
        this.canvas.freeDrawingBrush.width = this.canvas.freeDrawingBrush.height = 10;
        this.canvas.freeDrawingBrush.strokeDashArray = [0, 5, 10, 5];

        this.canvas.freeDrawingBrush.getPatternSrc = function() {
            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = 10;
            var ctx = patternCanvas.getContext('2d');

            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.lineTo(10, 5);
            ctx.closePath();
            ctx.stroke();
            return patternCanvas;
        };
    }

    handlePencilVline = (event) => {
        this.pencilBrush = new fabric.PatternBrush(this.canvas);
        this.pencil();
        this.canvas.freeDrawingBrush.width = this.canvas.freeDrawingBrush.height = 10;
        this.canvas.freeDrawingBrush.strokeDashArray = [0, 5, 10, 5];

        this.pencilBrush.getPatternSrc = function() {
            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = 10;
            var ctx = patternCanvas.getContext('2d');

            ctx.beginPath();
            ctx.moveTo(5, 0);
            ctx.lineTo(5, 10);
            ctx.closePath();
            ctx.stroke();
            return patternCanvas;
        };
    }

    handlePencilSquare = (event) => {
        this.pencilBrush = new fabric.PatternBrush(this.canvas);
        this.pencil();

        this.pencilBrush.getPatternSrc = function() {
            var squareWidth = 10, squareDistance = 2;
            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
            var ctx = patternCanvas.getContext('2d');

            ctx.fillRect(0, 0, squareWidth, squareWidth);
            return patternCanvas;
        };
    }

    handlePencilDiamond = (event) => {
        this.pencilBrush = new fabric.PatternBrush(this.canvas);
        this.pencil();

        this.pencilBrush.getPatternSrc = function() {
            var squareWidth = 10, squareDistance = 5;
            var patternCanvas = fabric.document.createElement('canvas');
            var rect = new fabric.Rect({
                width: squareWidth,
                height: squareWidth,
                angle: 45,
                fill: this.color
            });

            var canvasWidth = rect.getBoundingRect().width;

            patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
            rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

            var ctx = patternCanvas.getContext('2d');
            rect.render(ctx);

            return patternCanvas;
        };
    }
    
    handleText = (event) => {
        const newText = new fabric.Textbox('Lorum ipsum dolor sit amet', {
            left: 50,
            top: 50,
            width: 150,
            fontSize: 20,
            fill: this.state.brushColor,
			stroke: this.state.stroke,
			strokeWidth: this.state.lineWidth,
        });
        this.canvas.add(newText).setActiveObject(newText);
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
            fill: this.state.brushColor,
			stroke: this.state.stroke,
			strokeWidth: this.state.lineWidth,
        });
        this.canvas.add(newLine);
    }

    handleCircle = (event) => {
        console.log('MAKING CIRCLE');
        const newCircle = new fabric.Circle({
            radius: 20,
            left: 50,
            top: 50,
            fill: this.state.brushColor,
			stroke: this.state.stroke,
            strokeWidth: this.state.lineWidth
        });
        this.canvas.add(newCircle);
    }

    handleRectangle = (event) => {
        console.log('MAKING RECTANGLE');
        const newRect = new fabric.Rect({
            left: 50,
            top: 50,
            height: 20,
            width: 20,
            fill: this.state.brushColor,
			stroke: this.state.stroke,
			strokeWidth: this.state.lineWidth,
        });
        this.canvas.add(newRect);
    }

    handleTriangle = (event) => {
        console.log('MAKING TRIANGLE');
        const newTriangle = new fabric.Triangle({
            left: 50,
            top: 50,
            height: 20,
            width: 20,
            fill: this.state.brushColor,
			stroke: this.state.stroke,
			strokeWidth: this.state.lineWidth
        });
        this.canvas.add(newTriangle);
    }

    handleSelectFile = (event) => {
        this.refs.fileUploader.click();
    }

    handleImage = (event) => {
        //this.refs.fileUploader.click();
        console.log(event.target);
        console.log(event.target.files);
        const file = event.target.files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (() => {
                return (e) => {
                    console.log(e.target.result);
                    fabric.Image.fromURL(e.target.result, (image) => {
                        this.canvas.add(image);
                        this.canvas.renderAll();
                    }, {
                        left: 50,
                        top: 50,
                        stroke: this.state.stroke,
                        strokeWidth: this.state.lineWidth
                    });
                };
            })();
            reader.readAsDataURL(file);
        } else {
            alert('Upload images only!');
        }
        // this.refs.fileUploader.onLoad = function () {
        //     console.log("AAAA");
        // }
        
        // var imgObj = new Image();   
        // imgObj.src = event.target.file;
        // console.log(imgObj.src);
        
        // const newImage = new fabric.Image(document.getElementById("file").value, {
        //     left: 50,
        //     top: 50,
        //     stroke: this.state.stroke,
        //     strokeWidth: this.state.lineWidth
        // });
        // this.canvas.add(newImage);
        // this.canvas.renderAll();
    }

    handleClearCanvas = (event) => {
        this.canvas.clear();
    }

    handleFillColor = (color) => {
        this.setState({ brushColor: color });
        this.canvas.freeDrawingBrush.color = color;
    }

    handleLineWidth = (value) => {
        this.setState({ lineWidth: value });
        this.canvas.freeDrawingBrush.width = value;
    }

    handleStrokeColor = (color) => {
        this.setState({ stroke: color });
        this.canvas.freeDrawingBrush.stroke = color;
    }

    handleBGColor = (color) => {
        this.canvas.backgroundColor = color;
        this.canvas.renderAll();
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
        if(this.state.undo.length === 0) {
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
        if(this.state.redo.length === 0) {
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

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.input.value);
        this.canvas.loadFromJSON(this.input.value , () => {
            this.canvas.renderAll();
        });
    }

    handleDone = (event) => {
        this.setState({ redo: [] });
        // If it is from JSON (from view comic) save the panel and return
        if (this.props.location.state && this.props.location.state.previous === 'fromjson') {
            this.props.updateComicPanel(this.canvas.toDataURL(), this.canvas.toJSON(), 
                this.props.location.state.panel, this.props.location.state.panelIndex, this.props.location.state.comicIndex);
        } else {
            // Done with drawing, reroute back to create comic
            this.props.addPanel(this.canvas.toDataURL(), this.canvas.toJSON());
            // If from update comic -> go back with state
            if (this.props.location.state && this.props.location.state.previous === 'update') {
                this.props.history.push(`/update/comic/${this.props.CurrUser.username}/${this.props.location.state.comic}`, { previous: 'canvas' });
            }
            //this.props.history.push('/create/comic');
            else {
                history(-1); //fix bug in update comic bc re routing to wrong page...
            }
        }
    }

    render() {
        return (
            <div className="panel-container">
                <NavigationBar />
                <div className="panel">

                    {/* TOP BAR */}
                    <div className="top-bar">
                        <FontAwesomeIcon className="icon" icon="th" />

                        <FontAwesomeIcon className="icon" icon="search-minus" />
                        <FontAwesomeIcon className="icon" icon="search-plus" />
                        <FontAwesomeIcon className="icon" icon="search" onClick={this.handleZoom}/>

                        <FontAwesomeIcon className="icon" icon="clone" />
                        <FontAwesomeIcon className="icon" icon="cut" />
                        <FontAwesomeIcon className="icon" icon="paste" />

                        <FontAwesomeIcon className="icon" icon="forward" />
                        <FontAwesomeIcon className="icon" icon="step-forward" />
                        <FontAwesomeIcon className="icon" icon="backward" />
                        <FontAwesomeIcon className="icon" icon="step-backward" />
                        
                        <FontAwesomeIcon className="icon" icon="download" onClick={this.handleDownload} />
                        <FontAwesomeIcon className="icon" icon="check" onClick={this.handleDone} />
                    </div>
                    {/* MID BAR */}
                    <div className="mid-canvas">
                    <table className="side-bar">
                        <tbody>
                            <tr>
                                <td><FontAwesomeIcon className="icon" icon="pencil-alt" onClick={this.handlePencil} /></td>
                                <td><FontAwesomeIcon className="icon" icon="font" onClick={this.handleText} /></td>
                            </tr>
                            <tr>
                                <td><FontAwesomeIcon className="icon" icon="draw-polygon" /></td>
                                <td><FontAwesomeIcon className="icon" icon="slash" onClick={this.handleLine} /></td>
                            </tr>
                            <tr>
                                <td><FontAwesomeIcon className="icon" icon="circle" onClick={this.handleCircle} /></td>
                                <td><FontAwesomeIcon className="icon" icon="square" onClick={this.handleRectangle} /></td> 
                            </tr>
                            <tr>
                                <td><FontAwesomeIcon className="icon" icon="play" onClick={this.handleTriangle} /></td>
                                <td><input type="file" id="file" ref="fileUploader" accept="image/*" style={{display: "none"}} onChange={this.handleImage} />
                                <FontAwesomeIcon className="icon" icon="image" onClick={this.handleSelectFile} /></td>
                            </tr>
                            <tr>
                                <td><FontAwesomeIcon className="icon" icon="trash" /></td>
                                <td><FontAwesomeIcon className="icon" onClick={this.handleClearCanvas} icon="eraser" /></td> 
                            </tr>
                            <tr>
                                <td><FontAwesomeIcon className={this.state.undoBtn} icon="undo" onClick={this.handleUndo}/></td>
                                <td><FontAwesomeIcon className={this.state.redoBtn} icon="redo" onClick={this.handleRedo}/></td> 
                            </tr>
                            <tr>
                                <td><FontAwesomeIcon className="icon" icon="arrows-alt" /></td>
                                <td><FontAwesomeIcon className="icon" icon="eye-dropper" /></td> 
                            </tr>
                            <tr>
                                <td><ColorButton changeColor={this.handleFillColor}/></td>
                                <td><ColorButton changeColor={this.handleStrokeColor}/></td>
                            </tr>
                            <tr>
                                <td><ColorButton changeColor={this.handleBGColor}/></td>
                            </tr>
                        </tbody>
                    </table>
                    <canvas id='canvas'></canvas>
                    </div>

                    {/* BOTTOM BAR */}
                    <div className="bottom-bar">
                        <div>
                            <div htmlFor="lineWidthSlider">Line Width: {this.state.lineWidth}</div>
                            <NumericInput onChange={this.handleLineWidth} className="line_width" value={this.state.lineWidth} min={1} max={100} step={1} precision={0} size={5} />
                        </div>
                        <DropdownButton title="Pencil Mode">
                            <Dropdown.Item onClick={this.handlePencil}>Pencil</Dropdown.Item>

                            {/* <Dropdown.Item onClick={this.handlePencilCrayon}>Crayon</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlePencilInk}>Ink</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlePencilMarker}>Marker</Dropdown.Item> */}

                            <Dropdown.Item onClick={this.handlePencilSpray}>Spray</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlePencilCircle}>Circle</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlePencilPattern}>Pattern</Dropdown.Item>

                            {/* <Dropdown.Item onClick={this.handlePencilHline}>H Line</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlePencilVline}>V Line</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlePencilSquare}>Square</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlePencilDiamond}>Diamond</Dropdown.Item> */}
                        </DropdownButton>
                    </div>
                    <Form onSubmit={this.handleSubmit}>
                        <textarea id="textform" ref={(input) => this.input = input}></textarea>
                        <input type="submit" value="Import JSON"></input>
                    </Form>
                </div>
            </div>
        );
    }
}

Canvas.propTypes = {
    CurrUser: PropTypes.object
}

export default connect(StateToProps, { addPanel, updateComicPanel })(withRouter(Canvas));