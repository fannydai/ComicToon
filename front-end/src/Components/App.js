import React, { Component } from 'react';
import './styles/App.css';

import Authentication from './Authentication';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
		loggedIn: false
		}
	}

	render() {
		return (
			<div className="App-container">
				<div className="App-unauth">
					<Authentication />
				</div>
			</div>
		);
	}
}

export default App;
