import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavigationBar from './NavigationBar';
import './styles/ViewComic.css';
import pusheen from './images/pusheen.png';
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
            panelIndex: 0,
            subbed: false,
            rating: 0,
            didDownVote: false,
            didUpVote: false,
            comment: '',
            comments: [],
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
            this.props.viewComic(this.props.match.params.username, localStorage.getItem('user'), this.props.match.params.comicName);
        }
        //this.updateRating();
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps);
        // Set the new comments
        this.setState({ comments: nextProps.comic.saveNewComic.commentsList });
        (async () => {
            const res = await fetch("http://localhost:8080/comic/rate/getRating", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    comicID: nextProps.comic.saveNewComic.comicID
                })
            });
            let content = await res.json();
            console.log(content)
            this.setState({rating: content.result})
        })();
    }

    updateRating(){
        (async () => {
            const res = await fetch("http://localhost:8080/comic/rate/getRating", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    comicID: this.props.comic.saveNewComic.comicID
                })
            });
            let content = await res.json();
            console.log(content)
            this.setState({rating: content.result})
        })();
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

    handleSubscribe = (event) => {
        this.setState({ subbed: !this.state.subbed });
    }

    handleUpVote = () => {
        if(this.state.didUpVote) alert("YOU JUST UPVOTED!!")
        else{
            (async () => {
                const res = await fetch("http://localhost:8080/comic/rate", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        username: localStorage.getItem('user'),
                        comicID: this.props.comic.saveNewComic.comicID,
                        rating: 1
                    })
                });
                let content = await res.json();
                console.log(content)
                if(content.result !== "success") alert("you're trying to do multiple upvotes...")
                else alert("You just up voted!");
                this.setState({didUpVote: !this.state.didUpVote, didDownVote: false})
                this.updateRating();
            })();
        }
    }

    handleDownVote = () => {
        if(this.state.didDownVote) alert("YOU JUST DOWNVOTED:((")
        else{
            (async () => {
                const res = await fetch("http://localhost:8080/comic/rate", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        username: localStorage.getItem('user'),
                        comicID: this.props.comic.saveNewComic.comicID,
                        rating: -1
                    })
                }); 
                let content = await res.json();
                console.log(content)
                if(content.result !== "success") alert("you're trying to do multiple downvotes...")
                else alert("You just down voted:(");
                this.setState({didUpVote: false, didDownVote: !this.state.didDownVote})
                this.updateRating();
            })();
        }
    }

    handleComment = (event) => {
        event.preventDefault();
        console.log('COMMENTING');
        // Adds comment on backend, updates comments with this one and fetches the comments again
        this.setState({ comments: [...this.state.comments, { username: localStorage.getItem('user'), content: this.state.comment }] });
        (async () => {
            const res = await fetch("http://localhost:8080/comment", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    comicOwner: this.props.match.params.username,
                    comicName: this.props.match.params.comicName,
                    commenterName: localStorage.getItem('user'),
                    content: this.state.comment
                })
            });
            let content = await res.json();
            console.log(content);
            if(content.status !== "success") {
                alert('Your comment could not be posted');
                // Remove the comment that was appended in the beginning
                var copy = [...this.state.comments];
                copy.splice(copy.length - 1, 1);
                this.setState({ comments: copy });
            }
            // Reload the comments in case of change
            (async () => {
                const res = await fetch("http://localhost:8080/view/comic", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        comicName: this.props.match.params.comicName,
                        comicOwnerName: this.props.match.params.username,
                        viewerName: localStorage.getItem('user')
                    })
                });
                let content = await res.json();
                console.log(content);
                // Update comments if successful
                if (content.commentsList) {
                    this.setState({ comments: content.commentsList, comment: '' });
                }
            })();
        })();
    }

    renderComments = () => {
        return this.state.comments.map((comment, index) => {
            return (
                <div className="view-comic-comment" key={index}>
                    <div className="view-comic-comment-info">
                        <p>{ comment.username }</p>
                        <FontAwesomeIcon icon="trash" onClick={(e) => this.handleDeleteComment(comment, index, e)} />
                    </div>
                    <p>{ comment.content }</p>
                </div>
            );
        });
    }

    handleDeleteComment = (comment, index, event) => {
        event.preventDefault();
        console.log("DELETING COMMENT");
        (async () => {
            const res = await fetch("http://localhost:8080/delete/comment", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    commentID: comment.id,
                    comicID: comment.comicID
                })
            }); 
            let content = await res.json();
            console.log(content)
            if(content.result !== "success") alert("you're trying to do multiple downvotes...")
            else alert("You just down voted:(");
            this.setState({didUpVote: false, didDownVote: !this.state.didDownVote})
            this.updateRating();
        })();

    }

    handleChange = (event) => {
        event.preventDefault();
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        console.log(this.props.comic);
        // Check permissions
        if (this.props.comic.saveNewComic.error) {
            this.props.history.push('/notfound');
        }
        const panels = this.props.comic.newComic.length ? this.props.comic.newComic : this.props.comic.saveNewComic.panels ? this.props.comic.saveNewComic.panels : [];
        const subButton = localStorage.getItem('user') !== this.props.match.params.username ? this.state.subbed ? 
        <div className="ml-auto">
            <Button onClick={this.handleSubscribe}>Unsubscribe</Button>
        </div> :
        <div className="ml-auto">
            <Button onClick={this.handleSubscribe}>Subscribe</Button>
        </div> : null;
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
                                    {panels && panels[this.state.panelIndex] ? <div className="view-comic-panel-inner"><img className="view-comic-panel-img" src={panels[this.state.panelIndex].image} alt="can't load"/></div> : null}
                                    {panels && panels[this.state.panelIndex + 1] ? <div className="view-comic-panel-inner"><img className="view-comic-panel-img" src={panels[this.state.panelIndex + 1].image} alt="can't load"/></div> : null}
                                    {panels && panels[this.state.panelIndex + 2] ? <div className="view-comic-panel-inner"><img className="view-comic-panel-img" src={panels[this.state.panelIndex + 2].image} alt="can't load"/></div> : null}
                                    {panels && panels[this.state.panelIndex + 3] ? <div className="view-comic-panel-inner"><img className="view-comic-panel-img" src={panels[this.state.panelIndex + 3].image} alt="can't load"/></div> : null}
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
                                        {/*<FontAwesomeIcon className="icon-cog view-comic-press-like" icon={['far', 'thumbs-up']} size="2x" />
                                        <FontAwesomeIcon className="icon-cog view-comic-press-dislike" icon={['far', 'thumbs-down']} size="2x" />*/}
                                        <p onClick={this.handleUpVote}>Up-Vote</p> {/* temporarily using this bc thumbs up & down icon not working..*/}
                                        <p onClick={this.handleDownVote}>Down-Vote</p>
                                        <p className="view-comic-rating">{this.state.rating}</p>
                                    </div>
                                </div>
                                <div className="view-comic-second-row">
                                    <div className="mr-auto">
                                        <h2>By: {this.props.match.params.username}</h2>
                                    </div>
                                    <div className="view-comic-second-middle">
                                        <h2>Series: {this.props.comic.saveNewComic.seriesName ? this.props.comic.saveNewComic.seriesName : null }</h2>
                                    </div>
                                    {subButton}
                                </div>
                                <hr />
                                <div className="view-comic-description">
                                    <h1>Description</h1>
                                    <p>{this.props.comic.saveNewComic.description ? this.props.comic.saveNewComic.description : null}</p>
                                </div>
                                <hr />
                                <Form className="view-comic-comment-form">
                                    <Form.Control as="textarea" rows="2" className="view-comic-comment-input" name="comment" type="text" placeholder="Comment on this comic..." value={this.state.comment} onChange={this.handleChange} />
                                    <Button onClick={this.handleComment}>Submit</Button>
                                </Form>
                                <div className="view-comic-comment-container">
                                    <div className="view-comic-comment">
                                        <div className="view-comic-comment-info">
                                        <p>Joel</p>
                                        <FontAwesomeIcon icon="trash" />
                                        </div>
                                        <p>This comic was great! Please post more.</p>
                                    </div>
                                    {this.renderComments()}
                                </div>
                            </div>
                        </div>
                        <div className="view-comic-right">
                            <div className="view-comic-right-img-container">
                                <img className="view-comic-right-img" src={pusheen} alt="can't load"/>
                            </div>
                            <div className="view-comic-right-img-container">
                                <img className="view-comic-right-img" src={pusheen} alt="can't load"/>
                            </div>
                            <div className="view-comic-right-img-container">
                                <img className="view-comic-right-img" src={pusheen} alt="can't load"/>
                            </div>
                            <div className="view-comic-right-img-container">
                                <img className="view-comic-right-img" src={pusheen} alt="can't load"/>
                            </div>
                            <div className="view-comic-right-img-container">
                                <img className="view-comic-right-img" src={pusheen} alt="can't load"/>
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