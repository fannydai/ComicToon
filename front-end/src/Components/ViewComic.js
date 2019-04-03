import React, { Component } from 'react';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavigationBar from './NavigationBar';
import Comic from './Comic'
import './styles/ViewComic.css';

class ViewComic extends Component {

    // Fetch the details of the comic using its ID
    // Make sure to take the privacy into account
    constructor(props){
        super(props)
        console.log(this.props.history.location.state.src)
    }
    componentDidMount() {
        const comicId = this.props.match.params.comicId;
        console.log("VIEW COMIC ID", comicId);
    }

    render() {
        return (
            <div className="view-comic-container">
                <NavigationBar />
                <div className="view-comic-bottom">
                    <Comic src= {this.props.history.location.state.src}></Comic>
                    <div className="view-comic-left">
                        <div className="view-comic-left-top">
                            
                        </div>
                        <div className="view-comic-left-bottom">

                        </div>
                    </div>
                    <div className="view-comic-right">

                    </div>
                </div>
            </div>
        );
    }
}

export default ViewComic;