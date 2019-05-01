import React, { Component } from 'react';

import NavigationBar from './NavigationBar';
import './styles/CreateComic.css';

class ViewSubs extends Component {

    componentWillMount() {
        if(this.props.CurrUser.username === "" || this.props.CurrUser.token === "" || this.props.CurrUser.email === "" || this.props.CurrUser.isValidated === false){
            this.props.history.push('/*')
        }
    }
    
    render() {
        return (
            <div className="create-comic-container">
                <NavigationBar />
            </div>
        );
    }
}

export default ViewSubs;