import React, { Component } from 'react';
import './styles/App.css';

import Authentication from './Authentication';
import NavigationBar from './NavigationBar';
import HomeContent from './HomeContent';

class App extends Component {

	render() {
		if (!window.localStorage.getItem('user')) {
			return (
				<div className="App-unauth-container">
					<div className="App-unauth">
						<Authentication />
					</div>
				</div>
			);
		} else {
			return (
				<div className="App-auth-container">
					<NavigationBar />
					<HomeContent />
				</div>
			);
		}
	}
}

export default App;
