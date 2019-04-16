import React, { Component } from 'react';

class LoadingScreen extends Component {
    render() {
        return (
            <div style={{ height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <h1>Loading ...</h1>
            </div>
        );
    }
}

export default LoadingScreen;