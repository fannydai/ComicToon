import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavigationBar from './NavigationBar';
import './styles/ViewComic.css';
import pusheen from './images/pusheen.png';
import shoes from './images/shoes.png';
import { viewComic } from './../Actions/NavbarActions';
import { clearPanels, saveNewComic } from './../Actions/ComicActions';

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user,
    comic: state.comic
});
class ViewComic extends Component {

    //<Comic src= {this.props.history.location.state.src}></Comic>

    // Fetch the details of the comic using its ID
    // Make sure to take the privacy into account
    constructor(props){
        super(props)
        // console.log(this.props.history.location.state.src)
        this.state = {
            comicData: {},
            panelIndex: 0
        }
    }

    componentDidMount() {
        console.log('COMIC', this.props.comic);
        if (!this.props.match.params.username || !this.props.match.params.comicName) {
            this.props.history.goBack();
        }
        // Load comic only if this page is not redirected from create comic
        if (!this.props.comic.saveNewComic.comicName) {
            console.log('VIEW COMIC FETCHING DATA');
            this.props.viewComic(this.props.match.params.username, this.props.match.params.comicName);
        }
    }

    componentWillUnmount() {
        // Clears panels and comic data (if it was loaded after creation)
        this.props.clearPanels();
        this.props.saveNewComic({});
    }

    handleLeft = (event) => {
        if (this.state.panelIndex > 0) {
            this.setState({ panelIndex: this.state.panelIndex - 1 });
        }
    }

    handleRight = (event) => {
        if (this.props.comic.saveNewComic.panels && this.state.panelIndex + 4 < this.props.comic.saveNewComic.panels.length) {
            this.setState({ panelIndex: this.state.panelIndex + 1 });
        } else if (this.props.comic.newComic.length && this.state.panelIndex + 4 < this.props.comic.newComic.length) {
            this.setState({ panelIndex: this.state.panelIndex + 1 });
        }
    }

    handleDownload = (event) => {
        if (this.state.comicData.panels) {
            const a = document.createElement('a');
            this.state.comicData.panels.forEach((panel, i) => {
                a.href = panel.image;
                a.download = `image${i+1}.png`;
                a.click();
            });
        }
    }

    render() {
       const panels = this.props.comic.newComic.length ? this.props.comic.newComic : this.props.comic.saveNewComic.panels ? this.props.comic.saveNewComic.panels : [];
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
                                    {panels && panels[this.state.panelIndex] ? <div className="view-comic-panel-inner"><img className="view-comic-panel-img" src={panels[this.state.panelIndex].image} /></div> : null}
                                    {panels && panels[this.state.panelIndex + 1] ? <div className="view-comic-panel-inner"><img className="view-comic-panel-img" src={panels[this.state.panelIndex + 1].image} /></div> : null}
                                    {panels && panels[this.state.panelIndex + 2] ? <div className="view-comic-panel-inner"><img className="view-comic-panel-img" src={panels[this.state.panelIndex + 2].image} /></div> : null}
                                    {panels && panels[this.state.panelIndex + 3] ? <div className="view-comic-panel-inner"><img className="view-comic-panel-img" src={panels[this.state.panelIndex + 3].image} /></div> : null}
                                </div>
                                <div className="view-comic-navigate">
                                    <FontAwesomeIcon icon="chevron-right" size="2x" onClick={this.handleRight} />
                                </div>
                            </div>
                            <div className="view-comic-left-bottom">
                                <div className="view-comic-title-row">
                                    <h1>{this.props.match.params.comicName}</h1>
                                    <div className="view-comic-button-row ml-auto">
                                        <FontAwesomeIcon icon="history" size="2x" />
                                        <FontAwesomeIcon icon="download" size="2x" onClick={this.handleDownload} />
                                        <FontAwesomeIcon className="icon-cog view-comic-press-like" icon={['far', 'thumbs-up']} size="2x" />
                                        <FontAwesomeIcon className="icon-cog view-comic-press-dislike" icon={['far', 'thumbs-down']} size="2x" />
                                        <p className="view-comic-rating">+20</p>
                                    </div>
                                </div>
                                <div className="view-comic-second-row">
                                    <div className="mr-auto">
                                        <h2>By: {this.props.match.params.username}</h2>
                                    </div>
                                    <div className="view-comic-second-middle">
                                        <h2>Series: {this.props.comic.saveNewComic.seriesName ? this.props.comic.saveNewComic.seriesName : null }</h2>
                                    </div>
                                    <div className="ml-auto">
                                        <Button>Subscribe</Button>
                                    </div>
                                </div>
                                <hr />
                                <div className="view-comic-description">
                                    <h1>Description</h1>
                                    <p>{this.props.comic.saveNewComic.description ? this.props.comic.saveNewComic.description : null}</p>
                                </div>
                                <hr />
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

ViewComic.propTypes = {
    CurrUser: PropTypes.object,
    comic: PropTypes.object,
    viewComic: PropTypes.func.isRequired,
    clearPanels: PropTypes.func.isRequired,
    saveNewComic: PropTypes.func.isRequired
}

export default connect(StateToProps, {viewComic, clearPanels, saveNewComic })(withRouter(ViewComic));