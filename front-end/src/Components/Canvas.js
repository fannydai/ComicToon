import React, { Component } from 'react';
import {Dropdown, DropdownButton, Form} from 'react-bootstrap';
import NumericInput from 'react-numeric-input';

import { fabric } from 'fabric';
// import { CrayonBrush, InkBrush, MarkerBrush } from 'fabric-brush';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import NavigationBar from './NavigationBar';
import ShadowButton from './ShadowButton';
import OutlineButton from './OutlineButton';
import FillButton from './FillButton';
import ColorButton from './ColorButton';
import HighlightButton from './HighlightButton';
// import EyeDropper from './EyeDrop';
import './styles/Canvas.css';
import { addPanel, updateNewComicPanel, updateComicPanel } from '../Actions/ComicActions';
import io from 'socket.io-client'
const history = require('browser-history');
var SCALE_FACTOR = 1.3;

let socket;

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user,
    comic: state.comic
});

const SHAPES = {
    none: 'none',
    text: 'text',
    polygon: 'polygon',
    bubble: 'bubble',
    line: 'line',
    rectangle: 'rectangle',
    circle: 'circle',
    triagle: 'triangle',
    image: 'image'
};
  
class Canvas extends Component {

    constructor(props) {
        super(props);
        this.state = {    
            canvasState             : [],
            currentStateIndex       : -1,
            undoStatus              : false,
            redoStatus              : false,
            undoFinishedStatus      : 1,
            redoFinishedStatus      : 1,
            undoBtn                 : 'disable',
            redoBtn                 : 'disable',
            save                    : true,

            brushColor              : '#000000ff',
            lineWidth               : 1,
            stroke                  : '#000000ff',

            shadowColor             : '#000000ff',
            shadowWidth             : 0,
            shadowOffset            : 0,

            drawShape               : SHAPES.none,
            selectedShape           : null,

            startX                  : 0,
            startY                  : 0,

            fontSize                : 20,
            fontFamily              : 'Times New Roman',
            updateErr: false
        }
    }

    componentWillMount() {
        if(this.props.CurrUser.username === "" || this.props.CurrUser.token === "" || this.props.CurrUser.email === "" || this.props.CurrUser.isValidated === false){
            this.props.history.push('/');
        }
    }

    componentWillUnmount(){
        if(!this.state.updateErr) {socket.emit("doneUpdating", this.props.comic.saveNewComic.comicName);}
            socket.disconnect();
    }

    componentDidMount() {
        socket = io('http://localhost:4000', { transports: ['websocket'] }); 
        socket.emit('updating', {comicName: this.props.comic.saveNewComic.comicName, user: this.props.CurrUser.username})
        socket.on('err', () => {
            alert("Someone is currently editing... please wait");
            history(-1);
            this.setState({updateErr: true});
            //socket.off('err');
        });
        this.canvas = new fabric.Canvas('canvas', {
            height: 600,
            width: 900,
            isDrawingMode: false
        });
        // Load Data if any
        if (this.props.location.state) {
            console.log(this.props.location.state);
            if (this.props.location.state.previous === '/create') {
                const jsonData = this.props.location.state.panel.json;
                this.canvas.loadFromJSON(jsonData , () => {
                    this.canvas.renderAll();
                });
            }
            else if (this.props.location.state.previous === 'fromjson') {
                console.log('FROM JSON');
                this.canvas.loadFromJSON(JSON.parse(this.props.location.state.panel.canvas), () => {
                    this.canvas.renderAll();
                }, (o, object) => {
                    console.log(o, object);
                });
            }
        }

        this.canvas.on('mouse:down', this.doMouseDown);
        this.canvas.on('mouse:move', this.doMouseMove);
        this.canvas.on('mouse:up', this.doMouseUpOut);
        this.canvas.on('mouse:out', this.doMouseUpOut);
        this.canvas.on('mouse:wheel', this.handleZoom);

        this.canvas.on('object:added', (event) => {
            this.handleSave(event);
        });
        this.canvas.on('object:removed', (event) => {
            this.handleSave(event);
        });
        this.canvas.on('object:modified', (event) => {
            this.handleSave(event);
        });

        this.canvas.on('selection:updated', (event) => {
            this.handleUpdate(event);
        });
        this.canvas.on('selection:created', (event) => {
            this.handleUpdate(event);
        });
    }

    handleUpdate = (event) => {
        var value;
        // fill color
        // outline color
        // shadow color

        // line width
        try {
            value = this.canvas.getActiveObject().get("strokeWidth");
            this.setState({ lineWidth: value });
            this.canvas.freeDrawingBrush.width = value;
        } catch (error) {
            console.log("Obj does not have width");
        }
        // shadow width
        try {
            value = this.canvas.getActiveObject().shadow.blur;
            this.setState({ shadowWidth: value });
            this.canvas.freeDrawingBrush.shadowBlur = value;
        } catch (error) {
            console.log("Obj does not have shadow");
        }
        // shadow offset
        try {
            value = this.canvas.getActiveObject().shadow.offsetX;
            this.setState({ shadowOffset: value });
            this.canvas.freeDrawingBrush.shadowOffset = value;
        } catch (error) {
            console.log("Obj does not have shadow");
        }
        
        if(this.canvas.getActiveObject().get('type')==="textbox"){
            // font size
            try {
                value = this.canvas.getActiveObject().get("fontSize");
                this.setState({ fontSize: value });
            } catch (error) {
                console.log("Text box not selected");
            }
            // font family
            try {
                value = this.canvas.getActiveObject().get('fontFamily');
                console.log(value);
                this.setState({ fontFamily: value });
            } catch (error) {
                console.log("Text box not selected");
            }
        }
        // highlight color
    }

    /**********************************************************
     ********************** PENCIL ****************************
     **********************************************************/
    // Pencil which all the pencil features will call. Sets the values needed.
    pencil = () => {
        this.canvas.freeDrawingBrush = this.pencilBrush;
        this.canvas.freeDrawingBrush.color = this.state.brushColor;
        this.canvas.freeDrawingBrush.width = this.state.lineWidth;
        this.handleShadow();
        this.canvas.isDrawingMode = true;
        this.selectable(true);
        this.setState({
            selectedShape: null,
            drawShape: SHAPES.none
        });
    }

    // Enables the pencil feature
    handlePencil = (event) => {
        this.pencilBrush = new fabric.PencilBrush(this.canvas);
        this.pencil();
    }

    // Currently not working.
    handlePencilCrayon = (event) => {
        this.pencilBrush = new fabric.CrayonBrush(this.canvas);
        this.pencilBrush.density = 200;
        this.pencilBrush.dotWidth = 1;
        this.pencil();
    }

    // Currently not working.
    handlePencilInk = (event) => {
        this.pencilBrush = new fabric.InkBrush(this.canvas);
        this.pencil();
    }

    // Currently not working.
    handlePencilMarker = (event) => {
        this.pencilBrush = new fabric.MarkerBrush(this.canvas);
        this.pencil();
    }

    // Circle feature for pencil
    handlePencilCircle = (event) => {
        this.pencilBrush = new fabric.CircleBrush(this.canvas);
        this.pencil();
    }

    // Spray feature for pencil
    handlePencilSpray = (event) => {
        this.pencilBrush = new fabric.SprayBrush(this.canvas);
        this.pencil();
    }

    // The poka dot feature for pencil
    handlePencilPattern = (event) => {
        this.pencilBrush = new fabric.PatternBrush(this.canvas);
        this.pencil();
    }

    // Currently not working. Deletes after writing...
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
        this.canvas.renderAll();
    }

    // Currently not working. Deletes after writing...
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

    // Currently not working. Deletes after writing...
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

    // Currently not working. Deletes after writing...
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

    /**********************************************************
     ********************** SHAPES ****************************
     **********************************************************/
    selectable = (flag) => {
        if(!flag) {
            this.canvas.isDrawingMode = false;
        }
        this.canvas.forEachObject((o) => o.selectable = o.evented = flag);
        if(flag) {
            this.canvas.defaultCursor = 'default';
        } else {
            this.canvas.defaultCursor = 'crosshair';
        }
    }

    doMouseDown = (o) => {
        if(this.state.drawShape === SHAPES.none) {
            return;
        }
        
        var pointer = this.canvas.getPointer(o.e);
        var newShape = null;
        this.setState({
            startX: pointer.x,
            startY: pointer.y
        });

        if(this.state.drawShape === SHAPES.text) {
            newShape = new fabric.Textbox('Lorum ipsum dolor sit amet', {
                left: pointer.x,
                top: pointer.y,
                fontSize: this.state.fontSize,
                fontFamily: this.state.fontFamily,
                fill: this.state.brushColor,
                stroke: this.state.stroke,
                strokeWidth: this.state.lineWidth,
            });
            this.canvas.add(newShape);
            this.setState({ selectedShape: newShape});
            this.doMouseUpOut();
            return;
        } else if(this.state.drawShape === SHAPES.line) {
            var points = [pointer.x, pointer.y, pointer.x, pointer.y];
            newShape = new fabric.Line(points, {
                strokeWidth: this.state.lineWidth,
                stroke: this.state.stroke,
            });
        } else if(this.state.drawShape === SHAPES.polygon) {

        } else if(this.state.drawShape === SHAPES.circle) {
            newShape= new fabric.Ellipse({
                left: this.state.startX,
                top: this.state.startY,
                originX: 'left',
                originY: 'top',
                rx: pointer.x-this.state.startX,
                ry: pointer.y-this.state.startY,
                fill: this.state.brushColor,
                stroke: this.state.stroke,
                strokeWidth: this.state.lineWidth
            });
        } else if(this.state.drawShape === SHAPES.rectangle) {
            newShape = new fabric.Rect({
                originX: 'left',
                originY: 'top',
                left: pointer.x,
                top: pointer.y,
                height: pointer.x - this.state.startX,
                width: pointer.y - this.state.startY,
                fill: this.state.brushColor,
                stroke: this.state.stroke,
                strokeWidth: this.state.lineWidth
            });
        } else if(this.state.drawShape === SHAPES.triangle) {
            newShape = new fabric.Triangle({
                originX: 'left',
                originY: 'top',
                left: Math.abs(pointer.x),
                top: Math.abs(pointer.y),
                height: pointer.x - this.state.startX,
                width: pointer.y - this.state.startY,
                fill: this.state.brushColor,
                stroke: this.state.stroke,
                strokeWidth: this.state.lineWidth
            });
        } else if(this.state.drawShape === SHAPES.image && this.state.selectedShape !== null) {
            var tempShape = this.state.selectedShape;
            tempShape.originX = 'center';
            tempShape.originY = 'center';
            tempShape.left = pointer.x;
            tempShape.top = pointer.y;
            this.setState({
                selectedShape: tempShape
            });
            
            this.canvas.add(this.state.selectedShape);
            this.doMouseUpOut();
            return;
        } else {
            return;
        }

        this.setState({save: false});
        this.canvas.add(newShape);
        this.setState({ selectedShape: newShape});
    }
    
    linearDistance = (point1, point2) => {
        let xs = point2.x - point1.x;
        let ys = point2.y - point1.y;
        return Math.sqrt(xs * xs + ys * ys);
    };

    doMouseMove = (o) => {
        if(this.state.selectedShape === null) {
            return;
        }

        var pointer = this.canvas.getPointer(o.e);
        if(this.state.drawShape === SHAPES.line) {
            this.state.selectedShape.set({ x2: pointer.x, y2: pointer.y });
        } else if(this.state.drawShape === SHAPES.polygon) {
            
        } else if(this.state.drawShape === SHAPES.circle) {
            var rx = Math.abs(this.state.startX  - pointer.x)/2;
            var ry = Math.abs(this.state.startY - pointer.y)/2;
            if (rx > this.state.selectedShape.strokeWidth) {
            rx -= this.state.selectedShape.strokeWidth/2
            }
            if (ry > this.state.selectedShape.strokeWidth) {
            ry -= this.state.selectedShape.strokeWidth/2
            }
            this.state.selectedShape.set({ rx: rx, ry: ry});
            
            if(this.state.startX > pointer.x){
                this.state.selectedShape.set({originX: 'right' });
            } else {
                this.state.selectedShape.set({originX: 'left' });
            }
            if(this.state.startY > pointer.y){
                this.state.selectedShape.set({originY: 'bottom'  });
            } else {
                this.state.selectedShape.set({originY: 'top'  });
            }
        } else if(this.state.drawShape === SHAPES.rectangle) {
            if (this.state.startX > pointer.x) {
                this.state.selectedShape.set({ left: Math.abs(pointer.x) });
            }
            if (this.state.startY > pointer.y) {
                this.state.selectedShape.set({ top: Math.abs(pointer.y) });
            }
            this.state.selectedShape.set({ width: Math.abs(this.state.startX - pointer.x) });
            this.state.selectedShape.set({ height: Math.abs(this.state.startY - pointer.y) });
        } else if(this.state.drawShape === SHAPES.triangle) {
            if (this.state.startX > pointer.x) {
                this.state.selectedShape.set({ left: Math.abs(pointer.x) });
            }
            if (this.state.startY > pointer.y) {
                this.state.selectedShape.set({ top: Math.abs(pointer.y) });
            }
            this.state.selectedShape.set({ width: Math.abs(this.state.startX - pointer.x) });
            this.state.selectedShape.set({ height: Math.abs(this.state.startY - pointer.y) });
        } else {
            return;
        }
        this.state.selectedShape.setCoords();
        this.canvas.renderAll();
    }
    
    doMouseUpOut = (o) => {
        try {
            this.state.selectedShape.setShadow({
                color: this.state.shadowColor,
                blur: this.state.shadowWidth,
                offsetX: this.state.shadowOffset,
                offsetY: this.state.shadowOffset,
            });
            this.canvas.renderAll();
        } catch(error) {
            
        }

        if(this.state.selectedShape == null) { return; }
        this.setState({
            selectedShape: null,
            drawShape: SHAPES.none
        });
        this.selectable(true);
        this.handleSave();
    }
    
    handleText = (event) => {
        this.setState({save: false});
        this.setState({ drawShape: SHAPES.text });
        this.selectable(false);
    }

    handleFontSize = (value) => {
        this.setState({ fontSize: value });
        try {
            if(this.canvas.getActiveObject() === null || this.canvas.getActiveObject().get('type')!=="textbox") return;
            this.canvas.getActiveObject().set("fontSize", value);
            this.canvas.renderAll();
            this.handleSave();
        } catch (error) {
            console.log("Text box not selected");
        }
    }

    handleChangeFontFamily = (event) => {
        if(event.target.textContent==="") { return; }
        try {
            if(this.canvas.getActiveObject() === null || this.canvas.getActiveObject().get('type')!=="textbox") return;
            this.canvas.getActiveObject().set("fontFamily", event.target.textContent);
            this.setState({ fontFamily: event.target.textContent });
            this.canvas.renderAll();
            this.handleSave();
        } catch (error) {
            console.log("Text box not selected");
        }
    }

    handleFontItalic = (event) => {
        try {
            if(this.canvas.getActiveObject() === null || this.canvas.getActiveObject().get('type')!=="textbox") return;
            var italic = this.canvas.getActiveObject().get("fontStyle") === 'italic' ? 'normal' : 'italic';
            this.canvas.getActiveObject().set("fontStyle", italic);
            this.canvas.renderAll();
            this.handleSave();
        } catch (error) {
            console.log("Text box not selected");
        }
    }

    handleFontBold = (event) => {
        try {
            if(this.canvas.getActiveObject() === null || this.canvas.getActiveObject().get('type')!=="textbox") return;
            var bold = this.canvas.getActiveObject().get("fontWeight") === 'bold' ? 'normal' : 'bold';
            this.canvas.getActiveObject().set("fontWeight", bold);
            this.canvas.renderAll();
            this.handleSave();
        } catch (error) {
            console.log("Text box not selected");
        }
    }

    handleFontUnderline = (event) => {
        try {
            if(this.canvas.getActiveObject() === null || this.canvas.getActiveObject().get('type')!=="textbox") return;
            this.canvas.getActiveObject().set("underline", !this.canvas.getActiveObject().get("underline"));
            // this.canvas.getActiveObject().setSelectionStyles("underline", !this.canvas.getActiveObject().getSelectionStyles('underline'));
            this.canvas.renderAll();
            this.handleSave();
        } catch (error) {
            console.log("Text box not selected");
        }
    }

    handleFontOverline = (event) => {
        try {
            if(this.canvas.getActiveObject() === null || this.canvas.getActiveObject().get('type')!=="textbox") return;
            this.canvas.getActiveObject().set("overline", !this.canvas.getActiveObject().get("overline"));
            this.canvas.renderAll();
            this.handleSave();
        } catch (error) {
            console.log("Text box not selected");
        }
    }

    handleFontLinethrough = (event) => {
        try {
            if(this.canvas.getActiveObject() === null || this.canvas.getActiveObject().get('type')!=="textbox") return;
            this.canvas.getActiveObject().set("linethrough", !this.canvas.getActiveObject().get("linethrough"));
            this.canvas.renderAll();
            this.handleSave();
        } catch (error) {
            console.log("Text box not selected");
        }
    }

    handleFontSub = (event) => {
        try {
            if(this.canvas.getActiveObject() === null || this.canvas.getActiveObject().get('type')!=="textbox") return;
            var active = this.canvas.getActiveObject();
            if (!active) return;
            active.setSubscript();
            this.canvas.requestRenderAll();
            this.handleSave();
        } catch (error) {
            console.log("Text box not selected");
        }
    }

    handleFontSup = (event) => {
        try {
            if(this.canvas.getActiveObject() === null || this.canvas.getActiveObject().get('type')!=="textbox") return;
            var active = this.canvas.getActiveObject();
            if (!active) return;
            active.setSuperscript();
            this.canvas.requestRenderAll();
            this.handleSave();
        } catch (error) {
            console.log("Text box not selected");
        }
    }

    handleLeftAlign = (event) => {
        try {
            if(this.canvas.getActiveObject() === null || this.canvas.getActiveObject().get('type')!=="textbox") return;
            this.canvas.getActiveObject().textAlign = "left";
            this.canvas.requestRenderAll();
            this.handleSave();
        } catch (error) {
            console.log("Text box not selected");
        }
    }

    handleCenterAlign = (event) => {
        try {
            if(this.canvas.getActiveObject() === null || this.canvas.getActiveObject().get('type')!=="textbox") return;
            this.canvas.getActiveObject().textAlign = "center";
            this.canvas.requestRenderAll();
            this.handleSave();
        } catch (error) {
            console.log("Text box not selected");
        }
    }

    handleRightAlign = (event) => {
        try {
            if(this.canvas.getActiveObject() === null || this.canvas.getActiveObject().get('type')!=="textbox") return;
            this.canvas.getActiveObject().textAlign = "right";
            this.canvas.requestRenderAll();
            this.handleSave();
        } catch (error) {
            console.log("Text box not selected");
        }
    }

    handleHighlightFont = (color) => {
        try {
            if(this.canvas.getActiveObject() === null || this.canvas.getActiveObject().get('type')!=="textbox") return;
            if(!this.canvas.getActiveObject() || this.canvas.getActiveObject().get('backgroundColor') === color) return;
            this.canvas.getActiveObject().set('backgroundColor', color);
            this.canvas.renderAll();
            this.handleSave();
        } catch (error) {
            console.log("Text box not selected");
        }
    }

    handlePolygon = (event) => {
        this.canvas.isDrawingMode = false;
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
        this.setState({ drawShape: SHAPES.line });
        this.selectable(false);
    }

    handleCircle = (event) => {
        this.setState({ drawShape: SHAPES.circle });
        this.selectable(false);
    }

    handleRectangle = (event) => {
        this.setState({ drawShape: SHAPES.rectangle });
        this.selectable(false);
    }

    handleTriangle = (event) => {
        this.setState({ drawShape: SHAPES.triangle });
        this.selectable(false);
    }

    handleSelectFile = (event) => {
        this.canvas.isDrawingMode = false;
        this.refs.fileUploader.click();
    }

    handleImage = (event) => {
        this.setState({save: false});
        const file = event.target.files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (() => {
                return (e) => {
                    fabric.Image.fromURL(e.target.result, (image) => {
                        this.setState({
                            selectedShape: image,
                            drawShape: SHAPES.image
                        });
                        this.selectable(false);
                    }, {
                        stroke: this.state.stroke,
                        strokeWidth: this.state.lineWidth
                    });
                };
            })();
            reader.readAsDataURL(file);  
            event.target.value = null;   
        } else {
            alert('Upload images only!');
        }
    }

    handleFillColor = (color) => {
        this.setState({ brushColor: color });
        this.canvas.freeDrawingBrush.color = color;
        try {
            if(this.canvas.getActiveObject() === null
                || this.canvas.getActiveObject().get('type')==="image"
                || this.canvas.getActiveObject().get("fill") === color)
                return;
            this.canvas.getActiveObject().set("fill", color);
            this.canvas.renderAll();
            this.handleSave();
        } catch (error) {
            console.log("Obj does not have fill");
        }
    }

    handleLineWidth = (value) => {
        this.setState({ lineWidth: value });
        this.canvas.freeDrawingBrush.width = value;

        try {
            this.canvas.getActiveObject().set("strokeWidth", value);
            this.canvas.renderAll();
            this.handleSave();
        } catch (error) {
            console.log("Obj does not have width");
        }
    }

    handleShadow = () => {
        this.canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            blur: this.state.shadowWidth,
            offsetX: this.state.shadowOffset,
            offsetY: this.state.shadowOffset,
            color: this.state.shadowColor
        });
        try {
            this.canvas.getActiveObject().setShadow({
                color: this.state.shadowColor,
                blur: this.state.shadowWidth,
                offsetX: this.state.shadowOffset,
                offsetY: this.state.shadowOffset
            });
            this.canvas.renderAll();
            this.handleSave();
        } catch (error) {
            console.log("Obj does not have shadow option");
        }
    }

    handleShadowWidth = (value) => {
        this.setState({ shadowWidth: value });
        this.canvas.freeDrawingBrush.shadowBlur = value;
        this.handleShadow();
    }

    handleShadowOffset  = (value) => {
        this.setState({ shadowOffset: value });
        this.canvas.freeDrawingBrush.shadowOffsetX = value;
        this.canvas.freeDrawingBrush.shadowOffsetY = value;
        this.handleShadow();
    }

    handleStrokeColor = (color) => {
        this.setState({ stroke: color });
        this.canvas.freeDrawingBrush.stroke = color;

        try {
            if(!this.canvas.getActiveObject() || this.canvas.getActiveObject().get("stroke") === color) return;
            this.canvas.getActiveObject().set("stroke", color);
            this.canvas.renderAll();
            this.handleSave();
        } catch (error) {
            console.log("Obj does not have stoke");
        }   
    }

    handleShadowColor = (color) => {
        try {
            if(!this.canvas.getActiveObject() || this.canvas.getActiveObject().shadow.color === color) return;
            this.setState({ shadowColor: color });
            this.canvas.freeDrawingBrush.shadowColor = color;
            this.handleShadow();
        } catch (error) {
            console.log("Shadow color error");
        } 
    }

    handleBGColor = (color) => {
        try {
            if(this.canvas.backgroundColor === color) return;
            this.canvas.backgroundColor = color;
            this.canvas.renderAll();
            this.handleSave();
        } catch (error) {
            console.log("Background color error");
        } 
    }

     /**********************************************************
     ********************** OTHERS ****************************
     **********************************************************/
    handleDeleteObject = (event) => {
        this.canvas.remove(this.canvas.getActiveObject());
    }

    handleClearCanvas = (event) => {
        this.canvas.isDrawingMode = false;
        this.canvas.clear();
        this.handleSave();
    }
    
    handleZoom = (event) => {
        var delta = event.e.deltaY;
        var zoom = this.canvas.getZoom();
        zoom = zoom + delta/200;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        this.canvas.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, zoom);
        event.e.preventDefault();
        event.e.stopPropagation();
    }

    handleZoomIn = (event) => {
        this.canvas.setZoom(this.canvas.getZoom()/SCALE_FACTOR);
    }

    handleZoomOut = (event) => {
        this.canvas.setZoom(this.canvas.getZoom()*SCALE_FACTOR);
    }

    handleResetZoom = (event) => {
        this.canvas.setViewportTransform([1,0,0,1,0,0]);
    }

    handleForward = (event) => {
        try {
            this.canvas.bringForward(this.canvas.getActiveObject());
            this.handleSave();
        } catch (error) {
            console.log("Nothing Selected");
        }
    }

    handleFront = (event) => {
        try {
            this.canvas.bringToFront(this.canvas.getActiveObject());
            this.handleSave();
        } catch (error) {
            console.log("Nothing Selected");
        }
    }

    handleBackward = (event) => {
        try {
            this.canvas.sendBackwards(this.canvas.getActiveObject());
            this.handleSave();
        } catch (error) {
            console.log("Nothing Selected");
        }
    }

    handleBack = (event) => {
        try {
            this.canvas.sendToBack(this.canvas.getActiveObject());
            this.handleSave();
        } catch (error) {
            console.log("Nothing Selected");
        }
    }

    handleCopy = (event) => {
        try {
            this.canvas.getActiveObject().clone(cloned => this._clipboard = cloned);
        } catch(error) {
            console.log("Nothing selected.");
        }
    }

    handleCut = (event) => {
        this.handleCopy(event);
        this.handleDeleteObject(event);
    }

    handlePaste = (event) => {
        try {
            this._clipboard.clone(clonedObj => {
                this.canvas.discardActiveObject();
                clonedObj.set({
                    left: clonedObj.left + 10,
                    top: clonedObj.top + 10,
                    evented: true,
                });
                if (clonedObj.type === 'activeSelection') {
                    // active selection needs a reference to the canvas.
                    clonedObj.canvas = this.canvas;
                    clonedObj.forEachObject(obj => this.canvas.add(obj));
                    clonedObj.setCoords();
                } else {
                    this.canvas.add(clonedObj);
                }
                this._clipboard.top += 10;
                this._clipboard.left += 10;
                this.canvas.setActiveObject(clonedObj);
                this.canvas.requestRenderAll();
            });
        } catch (error) {
            console.log("Nothing copied.");
        }
    }

    handleGroup = (event) => {
        if (!this.canvas.getActiveObject() || this.canvas.getActiveObject().type !== 'activeSelection') {
            return;
        }
        this.canvas.getActiveObject().toGroup();
        this.canvas.requestRenderAll();
    }

    handleUngroup = (event) => {
        if (!this.canvas.getActiveObject() || this.canvas.getActiveObject().type !== 'group') {
            return;
        }
        this.canvas.getActiveObject().toActiveSelection();
        this.canvas.requestRenderAll();
    }

    handleSave = (event) => {
        if(this.state.save === false ) {
            this.setState({save: true});
            return;
        }
        console.log("save");
        if((this.state.undoStatus === false && this.state.redoStatus === false)){
			var jsonData = this.canvas.toJSON();
			var canvasAsJson = JSON.stringify(jsonData);
			if(this.state.currentStateIndex < this.state.canvasState.length-1){
				var indexToBeInserted = this.state.currentStateIndex+1;
                var tempCanvasState = this.state.canvasState;
                tempCanvasState[indexToBeInserted] = canvasAsJson;
                this.setState({
                    canvasState: tempCanvasState,
                });
                var numberOfElementsToRetain = indexToBeInserted+1;
                this.setState({
                    canvasState: this.state.canvasState.splice(0,numberOfElementsToRetain)
                });
			} else{
	    	    this.state.canvasState.push(canvasAsJson);
            }
            this.setState({
                currentStateIndex: this.state.canvasState.length-1
            });
            if((this.state.currentStateIndex === this.state.canvasState.length-1) && this.state.currentStateIndex !== -1) {
                this.setState({redoBtn: 'disable'});
            }
        }
        this.setState({undoBtn: 'icon'});
    }

    handleUndo = (event) => {
        if(this.state.undoFinishedStatus){
            if(this.state.currentStateIndex === -1){
                this.setState({
                    undoStatus: false
                });
            } else if(this.state.canvasState.length >= 1) {
                this.setState({
                    undoFinishedStatus: 0
                });
                if(this.state.currentStateIndex !== 0){
                    this.setState({
                        undoStatus: true
                    });
                    this.canvas.loadFromJSON(this.state.canvasState[this.state.currentStateIndex-1], () => {
                        this.canvas.renderAll();
                        this.setState({
                            undoStatus: false,
                            currentStateIndex: -1
                        });
                        this.setState({undoBtn: 'icon'});
                        if(this.state.currentStateIndex !== this.state.canvasState.length-1){
                            this.setState({redoBtn: 'icon'});
                        }
                        this.setState({undoFinishedStatus: 1});
                    });
                } else if(this.state.currentStateIndex === 0){
                    this.canvas.clear();
                    this.setState({
                        undoFinishedStatus: 1,
                        undoBtn: 'disable',
                        redoBtn: 'icon',
                        currentStateIndex: this.state.currentStateIndex -1
                    });
                }
            }
		}
    }

    handleRedo = (event) => {
        if(this.state.redoFinishedStatus){
			if((this.state.currentStateIndex === this.state.canvasState.length-1) && this.state.currentStateIndex !== -1){
                this.setState({redoBtn: 'disable'});
			} else if(this.state.canvasState.length > this.state.currentStateIndex && this.state.canvasState.length !== 0){
                this.setState({
                    redoFinishedStatus: 0,
                    redoStatus: true
                });
                this.canvas.loadFromJSON(this.state.canvasState[this.state.currentStateIndex+1], () => {
                    this.canvas.renderAll();
                    this.setState({
                        currentStateIndex: this.state.currentStateIndex + 1,
                        redoStatus: false
                    });
                    if(this.state.currentStateIndex !== -1){
                        this.setState({undoBtn: 'icon'});
                    }
                    this.setState({
                        redoFinishedStatus: 1
                    });
                    if((this.state.currentStateIndex === this.state.canvasState.length-1) && this.state.currentStateIndex !== -1){
                        this.setState({redoBtn: 'disable'});
                    }
                });
			}
		}
    }

    handleMoveObject = (event) => {
        this.canvas.isDrawingMode = false;
    }

    handleDownload = (event) => {
        var randomString = require('random-string');
        var fileName = prompt("Please enter what you would like to call your file.", randomString({length: 10}));
        if (fileName == null) {
            return;
        } else if(fileName === "") {
            alert("Nothing was entered!");
        } else {
            const img = this.canvas.toDataURL();
            const a = document.createElement('a');
            a.href = img;
            a.download = fileName + '.png';
            a.click();

            var jsonData = this.canvas.toJSON();
            var canvasAsJson = JSON.stringify(jsonData);
            var fileDownload = require('js-file-download');
            fileDownload(canvasAsJson, fileName + '.json');
        }
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
        if (this.props.location.state) {
            if (this.props.location.state.previous === '/create') {
                this.props.updateNewComicPanel(this.props.location.state.index, this.canvas.toDataURL(), this.canvas.toJSON());
                history(-1);
            }
            else if (this.props.location.state.previous === 'fromjson') {
                this.props.updateComicPanel(this.canvas.toDataURL(), this.canvas.toJSON(), 
                    this.props.location.state.panel, this.props.location.state.panelIndex, this.props.location.state.comicIndex);
            }
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

    handleGrid = (event) => {
        const gridOption = { stroke:'#000', selectable:false, excludeFromExport:true };

        const grid = 50;
        const width = this.canvas.width*100;
        const height = this.canvas.height*100;

        for(var i=0; i<width/(grid*2); i++) {
            this.canvas.add(new fabric.Line([i*grid,0,i*grid,height], gridOption));
            this.canvas.add(new fabric.Line([0,i*grid,width,i*grid], gridOption));
        }
    }
      
    render() {
        return (
            <div className="panel-container">
                <NavigationBar />
                <div className="panel">

                    {/* TOP BAR */}
                    <div className="top-bar">
                        {/* <FontAwesomeIcon className="icon" icon="th" onClick={this.handleGrid}/> */}

                        <FontAwesomeIcon className="icon" icon="search-minus" onClick={this.handleZoomIn} title="Zoom In"/>
                        <FontAwesomeIcon className="icon" icon="search-plus" onClick={this.handleZoomOut} title="Zoom Out"/>
                        <FontAwesomeIcon className="icon" icon="search" onClick={this.handleResetZoom} title="Reset Zoom"/>

                        <FontAwesomeIcon className="icon" icon="clone" onClick={this.handleCopy} title="Copy"/>
                        <FontAwesomeIcon className="icon" icon="cut" onClick={this.handleCut}  title="Cut"/>
                        <FontAwesomeIcon className="icon" icon="paste" onClick={this.handlePaste}  title="Paste"/>

                        <FontAwesomeIcon className="icon" icon="object-group" onClick={this.handleGroup}  title="Group"/>
                        <FontAwesomeIcon className="icon" icon="object-ungroup" onClick={this.handleUngroup}  title="Ungroup"/>

                        <FontAwesomeIcon className="icon" icon="angle-right" onClick={this.handleForward}  title="Move Forward"/>
                        <FontAwesomeIcon className="icon" icon="angle-double-right" onClick={this.handleFront}  title="Move Front"/>
                        <FontAwesomeIcon className="icon" icon="angle-left" onClick={this.handleBackward}  title="Move Backward"/>
                        <FontAwesomeIcon className="icon" icon="angle-double-left" onClick={this.handleBack}  title="Move Back"/>
                        
                        <FontAwesomeIcon className="icon" icon="download" onClick={this.handleDownload}  title="Download Panel"/>
                        <FontAwesomeIcon className="icon" icon="check" onClick={this.handleDone}  title="Save and Exit"/>
                    </div>
                    {/* MID BAR */}
                    <div className="mid-canvas">
                    <table className="side-bar">
                        <tbody>
                            <tr>
                                <td><FontAwesomeIcon className="icon" icon="arrows-alt" onClick={this.handleMoveObject}  title="Move Object"/></td>
                                <td><FontAwesomeIcon className="icon" icon="paint-brush" onClick={this.handlePencil}  title="Pencil"/></td>
                            </tr>
                            <tr>
                                <td><FontAwesomeIcon className="icon" icon="font" onClick={this.handleText}  title="Add Text"/></td>
                                {/* <td><FontAwesomeIcon className="icon" icon="draw-polygon" /></td> */}
                                <td><FontAwesomeIcon className="icon" icon="slash" onClick={this.handleLine}  title="Add Line"/></td>
                            </tr>
                            <tr>
                                <td><FontAwesomeIcon className="icon" icon="circle" onClick={this.handleCircle}  title="Add Circle"/></td>
                                <td><FontAwesomeIcon className="icon" icon="square" onClick={this.handleRectangle}  title="Add Square"/></td> 
                            </tr>
                            <tr>
                                <td><FontAwesomeIcon className="icon" icon="play" onClick={this.handleTriangle}  title="Add Triangle"/></td>
                                <td><input type="file" id="file" ref="fileUploader" accept="image/*" style={{display: "none"}} onChange={this.handleImage} />
                                <FontAwesomeIcon className="icon" icon="image" onClick={this.handleSelectFile}  title="Add Image"/></td>
                            </tr>
                            <tr>
                                <td><FontAwesomeIcon className="icon" icon="trash" onClick={this.handleDeleteObject}  title="Delete Selected Object"/></td>
                                <td><FontAwesomeIcon className="icon" onClick={this.handleClearCanvas} icon="eraser"  title="Clear Canvas"/></td> 
                            </tr>
                            {/* <tr>
                                <td><FontAwesomeIcon className={this.state.undoBtn} icon="undo" onClick={this.handleUndo} disabled={this.state.undoBtn}  title="Undo"/></td>
                                <td><FontAwesomeIcon className={this.state.redoBtn} icon="redo" onClick={this.handleRedo} disabled={this.state.redoBtn}  title="Redo"/></td> 
                            </tr> */}
                            {/* <tr>
                                <td><FontAwesomeIcon className="icon" icon="eye-dropper" title="Color Picker"/></td> 
                                <td><div className="eye-drop-container"><EyeDropper initializedColor={this.state.setColor}/></div></td>
                            </tr> */}
                            <tr>
                                <td><FillButton changeColor={this.handleFillColor}  title="Fill Color"/></td>
                                <td><OutlineButton changeColor={this.handleStrokeColor}  title="Stroke Color"/></td>
                            </tr>
                            <tr>
                                <td><ShadowButton changeColor={this.handleShadowColor} title="Shadow Color"/></td>
                                <td><ColorButton changeColor={this.handleBGColor}  title="Background Color"/></td>
                            </tr>
                        </tbody>
                    </table>
                    <canvas id='canvas'></canvas>
                    </div>

                    {/* BOTTOM BAR */}
                    <div className="bottom-bar">
                        <div>
                            <div htmlFor="lineWidthSlider">Line Width</div>
                            <Slider onChange={this.handleLineWidth} className="line_width" value={this.state.lineWidth}
                                railStyle={{ backgroundColor: 'black'}}
                                trackStyle={{ backgroundColor: '#047AFB'}}/>
                        </div>
                        <div>
                            <div htmlFor="shadowWidthSlider">Shadow Width</div>
                            <Slider onChange={this.handleShadowWidth} className="shadow_width" value={this.state.shadowWidth}
                                railStyle={{ backgroundColor: 'black'}}
                                trackStyle={{ backgroundColor: '#047AFB'}}/>
                        </div>
                        <div>
                            <div htmlFor="shadowOffsetSlider">Shadow Offset</div>
                            <Slider onChange={this.handleShadowOffset} className="shadow_offset" value={this.state.shadowOffset}
                                railStyle={{ backgroundColor: 'black'}}
                                trackStyle={{ backgroundColor: '#047AFB'}}/>
                        </div>
                        <DropdownButton title="Pencil Mode">
                            <Dropdown.Item onClick={this.handlePencil}>Pencil</Dropdown.Item>

                            {/* <Dropdown.Item onClick={this.handlePencilCrayon}>Crayon</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlePencilInk}>Ink</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlePencilMarker}>Marker</Dropdown.Item> */}

                            <Dropdown.Item onClick={this.handlePencilSpray}>Spray</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlePencilCircle}>Circle</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlePencilPattern}>Poka dots</Dropdown.Item>

                            <Dropdown.Item onClick={this.handlePencilHline}>H Line</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlePencilVline}>V Line</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlePencilSquare}>Square</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlePencilDiamond}>Diamond</Dropdown.Item>
                        </DropdownButton>
                    </div>
                    <div className="bottom-bar">
                        <div>
                            <div htmlFor="fontSize">Font Size</div>
                            <NumericInput onChange={this.handleFontSize} className="font_size" value={this.state.fontSize} size={5} />
                        </div>
                        <DropdownButton title={this.state.fontFamily} value={this.state.fontFamily}>
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Arial</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Comic Sans MS</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Courier</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Garamond</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Georgia</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Helvetica</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Hoefler Text</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Impact</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Monaco</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Myriad Pro</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Optima</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Pacifico</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Palatino</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Plaster</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Times New Roman</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Trebuchet MS</Dropdown.Item>                  
                            <Dropdown.Item onClick={this.handleChangeFontFamily}>Verdana</Dropdown.Item>         
                        </DropdownButton>

                        <td><FontAwesomeIcon className="icon" icon="italic" onClick={this.handleFontItalic}  title="Italic"/></td>
                        <td><FontAwesomeIcon className="icon" icon="bold" onClick={this.handleFontBold}  title="Bold"/></td>
                        <td><FontAwesomeIcon className="icon" icon="underline" onClick={this.handleFontUnderline}  title="Underline"/></td>
                        <td><FontAwesomeIcon className="icon" icon="strikethrough" onClick={this.handleFontLinethrough}  title="Strike Through"/></td>
                        {/* <td><FontAwesomeIcon className="icon" icon="strikethrough" onClick={this.handleFontOverline}  title="Overline"/></td> */}

                        {/* <td><FontAwesomeIcon className="icon" icon="subscript" onClick={this.handleFontSub}/></td>
                        <td><FontAwesomeIcon className="icon" icon="superscript" onClick={this.handleFontSup}/></td> */}

                        <td><FontAwesomeIcon className="icon" icon="align-left" onClick={this.handleLeftAlign}  title="Left Align"/></td>
                        <td><FontAwesomeIcon className="icon" icon="align-center" onClick={this.handleCenterAlign}  title="Center Align"/></td>
                        <td><FontAwesomeIcon className="icon" icon="align-right" onClick={this.handleRightAlign}  title="Right Align"/></td>
                        <td><HighlightButton changeColor={this.handleHighlightFont}  title="Highlight Color"/></td>
                    </div>
                    <br />
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

export default connect(StateToProps, { addPanel, updateComicPanel, updateNewComicPanel })(withRouter(Canvas));