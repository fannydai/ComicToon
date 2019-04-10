import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavigationBar from './NavigationBar';
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
        this.state = {
            comicData: {},
            panelIndex: 0
        }
    }
    componentDidMount() {
        //const comicId = this.props.match.params.comicId;
        //console.log("VIEW COMIC ID", comicId);
        console.log(this.props.match.params);
        if (!this.props.match.params.username || !this.props.match.params.comicName) {
            this.props.history.goBack();
        }
        (async () => {
            const res = await fetch('http://localhost:8080/view/comic', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    comicName: this.props.match.params.comicName,
                    comicOwnerName: this.props.match.params.username
                })
            });
            let content = await res.json();
            console.log(content);
            if (!content.comicName) {
                alert('Could not find comic.'); // No comic/no permission
            } else {
                this.setState({ comicData: content });
            }
        })();
    }

    handleLeft = (event) => {
        if (this.state.panelIndex > 0) {
            this.setState({ panelIndex: this.state.panelIndex - 1 });
        }
    }

    handleRight = (event) => {
        if (this.state.comicData.panels && this.state.panelIndex + 4 < this.state.comicData.panels.length) {
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
                                    {this.state.comicData.panels && this.state.comicData.panels[this.state.panelIndex] ? <div className="view-comic-panel-inner"><img className="view-comic-panel-img" src={this.state.comicData.panels[this.state.panelIndex].image} /></div> : null }
                                    {this.state.comicData.panels && this.state.comicData.panels[this.state.panelIndex + 1] ? <div className="view-comic-panel-inner"><img className="view-comic-panel-img" src={this.state.comicData.panels[this.state.panelIndex + 1].image} /></div> : null }
                                    {this.state.comicData.panels && this.state.comicData.panels[this.state.panelIndex + 2] ? <div className="view-comic-panel-inner"><img className="view-comic-panel-img" src={this.state.comicData.panels[this.state.panelIndex + 2].image} /></div> : null }
                                    {this.state.comicData.panels && this.state.comicData.panels[this.state.panelIndex + 3] ? <div className="view-comic-panel-inner"><img className="view-comic-panel-img" src={this.state.comicData.panels[this.state.panelIndex + 3].image} /></div> : null }
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
                                    <div className="view-comic-second-left">
                                        <h2>By: {this.props.match.params.username}</h2>
                                    </div>
                                    <div className="view-comic-second-middle">
                                        <h2>Series: {this.state.comicData ? this.state.comicData.seriesName : null}</h2>
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