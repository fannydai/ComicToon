import React, { Component } from 'react';

class Panel extends Component {
    render() {
        return this.props.comic ? <img style={{width: "100%"}} src={this.props.comic.panel} /> : null;
    }
}

export default Panel;