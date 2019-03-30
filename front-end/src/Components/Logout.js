import React, { Component } from 'react';
import Authentication from './Authentication';
//import './styles/Logout.css';
import './styles/App.css';


class Logout extends Component {

    render() {
        return (
            <div className="App-unauth-container">
                <div className="App-unauth">
                    <h1>Your're Logged Out! What Next?...</h1>
                    <Authentication />
                </div>
            </div>
        );
    }
}

export default Logout;