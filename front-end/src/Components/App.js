import React, { Component } from 'react';
import { Image } from 'react-bootstrap'; 
import './styles/App.css';


import Authentication from './Authentication';
import HomeContent from './HomeContent';
import logo from './images/logo.jpg';

import Footer from './Footer';

class App extends Component {

	render() {
		if (!window.localStorage.getItem('user')) {
			return (
				
				<div className="App-unauth-container">
					<div className="App-unauth">
						<div className = "logo">
							<Image className="logoimage" src={logo} fluid width="200" />
						</div>
						<Authentication />
						<Footer/>
					</div>
				</div>
			);
		} else {
			return (
				<HomeContent />
			);
		}
	}
}

export default App;
