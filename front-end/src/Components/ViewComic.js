import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { Button, Card, Form } from 'react-bootstrap';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import JSZip from 'jszip';

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
        if (!this.props.comic.saveNewComic.comicName || this.props.comic.newComic.length === 0) {
            console.log('VIEW COMIC FETCHING DATA');
            this.props.viewComic(this.props.match.params.username, this.props.CurrUser.token, this.props.match.params.comicName);
        }
        //this.updateRating();
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps);
        // Set the new comments
        if (nextProps.comic.saveNewComic.commentsList) {
            this.setState({ comments: nextProps.comic.saveNewComic.commentsList });
        }
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
        if (this.props.comic.saveNewComic.panels && this.state.panelIndex + 1 < this.props.comic.saveNewComic.panels.length) {
            this.setState({ panelIndex: this.state.panelIndex + 1 });
        } else if (this.props.comic.newComic.length && this.state.panelIndex + 1 < this.props.comic.newComic.length) {
            this.setState({ panelIndex: this.state.panelIndex + 1 });
        }
    }

    handleDownload = (event) => {
        const panels = this.props.comic.newComic.length ? this.props.comic.newComic : this.props.comic.saveNewComic.panels ? this.props.comic.saveNewComic.panels : [];
        if (panels.length) {
            const zip =new JSZip();
            for (var i = 0; i < panels.length; i++) {
                // Look for the type of file
                const image = panels[i].image;
                const beginning = image.indexOf('/');
                const end = image.indexOf(';');
                const type = image.substring(beginning + 1, end);
                const base64String = image.replace("data:image/png;base64,", "");
                zip.file(`image${i+1}.${type}`, base64String, { base64: true });
            }
            const link = document.createElement('a');
            link.download = 'comic';
            zip.generateAsync({type: "base64"}).then((base64) => {
                // window.location = "data:application/zip;base64," + base64;
                link.href = "data:application/zip;base64," + base64;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
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
                        username: this.props.CurrUser.username,
                        token: this.props.CurrUser.token,
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
                        username: this.props.CurrUser.username,
                        token: this.props.CurrUser.token,
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
        this.setState({ comments: [...this.state.comments, { username: this.props.CurrUser.username, content: this.state.comment }] });
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
                    commenterName: this.props.CurrUser.token,
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
                        viewerName: this.props.CurrUser.token
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

    handleReportComment = (reportedID, reportingID, type) => {
        this.props.history.push({
            pathname: '/report', 
            state: {
              reportingID: reportingID,
              reportedID: reportedID,
              type: type
            }
        }) 
    }

    renderComments = () => {
        /*
        <div className="view-comic-comment" key={index}>
                    <div className="view-comic-comment-info">
                        <p><span style={{ fontWeight: "bold", fontSize: "large" }}>{ comment.username }</span><span style={{ fontSize: "small" }}> on { comment.date }</span></p>
                        {deleteButton}
                        {reportButton}
                    </div>
                    <p style={{ fontWeight: "400"}}>{ comment.content }</p>
                </div>
                */
        console.log("MAKING SURE THE STATE EXISTS", this.state);
        return this.state.comments.map((comment, index) => {
            const deleteButton = comment.username === this.props.CurrUser.username ? 
                <FontAwesomeIcon icon="trash" onClick={(e) => this.handleDeleteComment(comment, index, e)} /> : null;
            const reportButton = comment.username !== this.props.CurrUser.username ? 
                <p onClick={(e) => this.handleReportComment(comment.id, this.props.CurrUser.id, "comment")} >REPORT</p> : null;
            return (
                <Card key={index}>
                    <Card.Body>
                        <Card.Title>{ comment.username }</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{ comment.date }</Card.Subtitle>
                        <Card.Text>{ comment.content }</Card.Text>
                        <Card.Text>{deleteButton}</Card.Text>
                        <Card.Text>{reportButton}</Card.Text>
                    </Card.Body>
                </Card>
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
            if(content.result !== "success") {
                // Delete from state
                const copy = [...this.state.comments];
                copy.splice(index, 1);
                this.setState({ comments: copy });
            } else {
                alert("Could not delete comment");
            }
        })();

    }

    handleSeries = (event) => {
        const seriesName = this.props.comic.saveNewComic.seriesName ? this.props.comic.saveNewComic.seriesName : null;
        const creatorName = this.props.comic.saveNewComic.creatorName ? this.props.comic.saveNewComic.creatorName : null;
        if (seriesName && creatorName) {
            this.props.history.push(`/view/series/${creatorName}/${seriesName}`);
        }
    }

    handleChange = (event) => {
        event.preventDefault();
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        console.log(this.props.comic);
        /*
        {panels && panels[this.state.panelIndex + 1] ? <div className="view-comic-panel-inner"><img className="view-comic-panel-img" src={panels[this.state.panelIndex + 1].image} alt="can't load"/></div> : null}
        {panels && panels[this.state.panelIndex + 2] ? <div className="view-comic-panel-inner"><img className="view-comic-panel-img" src={panels[this.state.panelIndex + 2].image} alt="can't load"/></div> : null}
        {panels && panels[this.state.panelIndex + 3] ? <div className="view-comic-panel-inner"><img className="view-comic-panel-img" src={panels[this.state.panelIndex + 3].image} alt="can't load"/></div> : null}
        */
        // Check permissions
        if (this.props.comic.saveNewComic.error) {
            this.props.history.push('/notfound');
        }
        const panels = this.props.comic.newComic.length ? this.props.comic.newComic : this.props.comic.saveNewComic.panels ? this.props.comic.saveNewComic.panels : [];
        const subButton = this.props.CurrUser.username !== this.props.match.params.username ? this.state.subbed ? 
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
                                        {!this.state.didUpVote ? <FontAwesomeIcon className="icon-cog view-comic-press-like" icon={['far', 'thumbs-up']} size="2x" onClick={this.handleUpVote} /> 
                                            : <FontAwesomeIcon className="icon-cog view-comic-press-like" icon='thumbs-up' size="2x" onClick={this.handleUpVote} />}
                                        {!this.state.didDownVote ? <FontAwesomeIcon className="icon-cog view-comic-press-dislike" icon={['far', 'thumbs-down']} size="2x" onClick={this.handleDownVote} /> 
                                            : <FontAwesomeIcon className="icon-cog view-comic-press-dislike" icon='thumbs-down' size="2x" onClick={this.handleDownVote} />}
                                        <p className="view-comic-rating">{this.state.rating}</p>
                                    </div>
                                </div>
                                <div className="view-comic-second-row">
                                    <div className="mr-auto">
                                        <h2>By: {this.props.match.params.username}</h2>
                                    </div>
                                    <div className="view-comic-second-middle">
                                        <h2 className="view-comic-series-h2" onClick={this.handleSeries}>Series: {this.props.comic.saveNewComic.seriesName ? this.props.comic.saveNewComic.seriesName : null }</h2>
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