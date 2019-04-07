import React, { Component } from 'react';
import { Image } from 'react-bootstrap'; 
import './styles/App.css';
import {Provider} from 'react-redux'
import Authentication from './Authentication';
import HomeContent from './HomeContent';
import logo from './images/logo.jpg';

import Footer from './Footer';
import store from './Store'
class App extends Component {

	render() {
		if (!window.localStorage.getItem('user')) {
			return (
				<Provider store={store}>
					<div className="App-unauth-container">
						<div className="App-unauth">
							<div className = "logo">
								<Image className="logoimage" src={logo} fluid width="200" />
							</div>
							<Authentication />
							<Footer/>
						</div>
					</div>
				</Provider>
			);
		} else {
			return (
				<Provider store={store}>
					<HomeContent />
				</Provider>
			);
		}
	}
}

export default App;
