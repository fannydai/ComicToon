import React, { Component } from 'react';

class Panel extends Component {
    render() {
        return this.props.comic ? 
            <div style={{ display: "inline-block", position: "relative" }}>
                <img className="panel" style={{width: "100%", border: "1px solid black"}} src={this.props.comic.image} alt="Could not display comic" />
                <span className="close-panel-icon" onClick={this.props.close}>✕</span>
            </div> : null;
    }
}

export default Panel;