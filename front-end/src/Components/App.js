import React, { Component } from 'react';
import './styles/App.css';

import Authentication from './Authentication';
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
				<HomeContent />
			);
		}
	}
}

export default App;
