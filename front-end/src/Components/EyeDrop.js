import React, { Component } from 'react';
import EyeDropper from 'react-eyedropper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class EyeDrop extends Component {
  state = {
    r: 255,
    g: 255,
    b: 255
  }
  setColor = ({ r, g, b }) => {
    this.setState({ r, g, b })
  }

  colorSelected = () => {
      alert("Color is " + this.setColor);
  }

  handleClick = () => {
      
  };

  render() {
    const {r, g, b} = this.state
    const eyedropper = {
        color: this.state.color,
    }
    const invisible = {
      display: none,
    }

    return (
    <div>
        <span onClick={this.handleClick}>
            <FontAwesomeIcon style={eyedropper} className="icon" icon="eye-dropper" />
        </span>
        <div> <EyeDropper style={invisible} initializedColor={this.setColor}/> </div>
        {/* {this.state.displayColorPicker ? 
            <div style={popover}> <div style={cover} onClick={this.handleClose} />
                <ChromePicker color={this.state.color} onChange={this.handleChange} onChangeComplete={this.handleChangeComplete}/>
            </div>  : null 
        } */}
    </div>
    )
  }
}

export default EyeDrop