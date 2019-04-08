import React, { Component } from 'react';
import Authentication from './Authentication';
//import './styles/Logout.css';
import './styles/App.css';


class Logout extends Component {

    render() {
        localStorage.removeItem('user');
        return (
            <div className="App-unauth-container">
                <div className="App-unauth">
                    <Authentication />
                </div>
            </div>
        );
    }
}

export default Logout;