import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavigationBar from './NavigationBar';
import Comic from './Comic';
import './styles/ViewComic.css';
import pusheen from './images/pusheen.png';
import shoes from './images/shoes.png';

class ViewComic extends Component {

    //<Comic src= {this.props.history.location.state.src}></Comic>

    // Fetch the details of the comic using its ID
    // Make sure to take the privacy into account
    constructor(props){
        super(props)
        // console.log(this.props.history.location.state.src)
    }
    componentDidMount() {
        const comicId = this.props.match.params.comicId;
        console.log("VIEW COMIC ID", comicId);
    }

    handleLeft() {

    }

    handleRight() {

    }

    render() {
        return (
            <div className="view-comic-container">
                <NavigationBar />
                <div className="view-comic-bottom">
                    <div className="view-comic-overlay">
                        <div className="view-comic-left">
                            <div className="view-comic-left-top">
                                <div className="view-comic-navigate">
                                    <FontAwesomeIcon icon="chevron-left" size="2x" onClick={this.handleLeft} />
                                </div>
                                <div className="view-comic-panel-container">
                                    <img className="view-comic-panel-img" src={shoes} />
                                </div>
                                <div className="view-comic-navigate">
                                    <FontAwesomeIcon icon="chevron-right" size="2x" onClick={this.handleRight} />
                                </div>
                            </div>
                            <div className="view-comic-left-bottom">
                                <div className="view-comic-title-row">
                                    <h1>Noruta</h1>
                                    <div className="view-comic-button-row ml-auto">
                                        <FontAwesomeIcon icon="history" size="2x" />
                                        <FontAwesomeIcon icon="download" size="2x" />
                                        <FontAwesomeIcon className="icon-cog view-comic-press-like" icon={['far', 'thumbs-up']} size="2x" />
                                        <FontAwesomeIcon className="icon-cog view-comic-press-dislike" icon={['far', 'thumbs-down']} size="2x" />
                                        <p className="view-comic-rating">+20</p>
                                    </div>
                                </div>
                                <div className="view-comic-second-row">
                                    <div className="view-comic-second-left">
                                        <h2>By: Sean</h2>
                                    </div>
                                    <div className="view-comic-second-middle">
                                        <h2>Series: Manga</h2>
                                    </div>
                                    <div className="ml-auto">
                                        <Button>Subscribe</Button>
                                    </div>
                                </div>
                                <Form className="view-comic-comment-form">
                                    <Form.Control as="textarea" rows="2" className="view-comic-comment-input" name="comicCommentInput" type="text" placeholder="Comment on this comic..." />
                                    <Button>Submit</Button>
                                </Form>
                                <div className="view-comic-comment-container">
                                    <div className="view-comic-comment">
                                        <div className="view-comic-comment-info">
                                        <p>Joel</p>
                                        <FontAwesomeIcon icon="trash" />
                                        </div>
                                        <p>This comic was great! Please post more.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="view-comic-right">
                            <div className="view-comic-right-img-container">
                                <img className="view-comic-right-img" src={pusheen} />
                            </div>
                            <div className="view-comic-right-img-container">
                                <img className="view-comic-right-img" src={pusheen} />
                            </div>
                            <div className="view-comic-right-img-container">
                                <img className="view-comic-right-img" src={pusheen} />
                            </div>
                            <div className="view-comic-right-img-container">
                                <img className="view-comic-right-img" src={pusheen} />
                            </div>
                            <div className="view-comic-right-img-container">
                                <img className="view-comic-right-img" src={pusheen} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewComic;