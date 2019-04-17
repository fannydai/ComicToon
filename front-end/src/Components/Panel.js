import React, { Component } from 'react';

class Panel extends Component {
    render() {
        return this.props.comic ? <img style={{width: "100%", border: "1px solid black"}} src={this.props.comic.image} alt="Click to edit and display comic" /> : null;
    }
}

export default Panel;