import React from 'react'
import { ChromePicker } from 'react-color'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ShadowButton extends React.Component {
    // constructor(props){
    //     super(props);    
    // }

    state = {
        displayColorPicker: false,
        color: '#000000ff',
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false });
    };

    handleChange = (color) => {
        this.setState({color: color.hex + Math.round(color.rgb.a * 255).toString(16)});
    };

    handleChangeComplete = () => {
        this.props.changeColor(this.state.color);
    };

    getColor = () => {
        return this.state.color;
    }

    render() {
        const palette = {
            color: this.state.color,
        }
        const popover = {
            position: 'absolute',
            zIndex: '2',
            background: this.state.color
        }
        const cover = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        }
        return (
        <div>
            <span onClick={this.handleClick}>
                <FontAwesomeIcon style={palette} className="icon" icon="cloud" />
            </span>
            {this.state.displayColorPicker ? 
                <div style={popover}> <div style={cover} onClick={this.handleClose} />
                    <ChromePicker color={this.state.color} onChange={this.handleChange} 
                    onChangeComplete={this.handleChangeComplete}/>
                </div>  : null 
            }
        </div>
        )
    }
}

export default ShadowButton