import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { Button, Dropdown, Form } from 'react-bootstrap';
import Slider from 'react-slick';

import NavigationBar from './NavigationBar';
import './styles/CreateComic.css';
import Panel from './Panel';
import Footer from './Footer';
import ComicSharingTable from './ComicSharingTable';
import addPanel from './images/addPanel.png';
import { saveUpdateComic, clearPanels } from './../Actions/ComicActions';

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user,
    comic: state.comic
});
class UpdateComic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            comicPanels: [],
            comicName: this.props.match.params.comicName,
            comicDescription: '',
            privacy: '',
            userInput: '',
            sharedUsersList: [],
            series: [],
            selected_series: ''
        }
    }

    componentDidMount() {
        console.log(this.props.comic);
        console.log(this.props.location);
        // Load saved data if any
        if (this.props.location.state && this.props.location.state.previous === 'canvas') {
            const savedData = this.props.comic.saveUpdateComic;
            if (savedData.comicName) {
                this.setState({ comicName: savedData.comicName });
            }
            if (savedData.userInput) {
                this.setState({ userInput: savedData.userInput });
            }
            if (savedData.description) {
                this.setState({ comicDescription: savedData.description });
            }
            if (savedData.privacy) {
                this.setState({ privacy: savedData.privacy });
            }
            if (savedData.series) {
                this.setState({ series: savedData.series });
            }
            if (savedData.seriesName) {
                this.setState({ selected_series: savedData.seriesName });
            }
            if (savedData.sharedUsersList) {
                this.setState({ sharedUsersList: savedData.sharedUsersList });
            }
            if (savedData.comicPanels) {
                // Potentially add a new panel if any
                if (this.props.comic.newComic.length) {
                    this.setState({ comicPanels: [...savedData.comicPanels, ...this.props.comic.newComic]});
                    this.props.clearPanels();
                } else {
                    this.setState({ comicPanels: savedData.comicPanels });
                }
            }
        }

        (async () => {
            // Need to fetch panel data
            const res = await fetch('http://localhost:8080/view/comic', {
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
            if (content.comicName) {
                this.setState({ comicData: content });
                if (!this.state.comicDescription) {
                    this.setState({ comicDescription: content.description });
                }
                if (!this.state.selected_series) {
                    this.setState({ selected_series: content.seriesName });
                }
                if (this.state.sharedUsersList.length === 0) {
                    this.setState({ sharedUsersList: content.sharedWith });
                }
                if (this.state.comicPanels.length === 0) {
                    this.setState({ comicPanels: content.panels });
                }
                if (!this.props.comic.saveUpdateComic.privacy) {
                    this.setState({ privacy: content.privacy });
                }
            } else {
                alert('Could not find comic');
                this.props.history.goBack();
            }
        })();
        (async () => {
            const res = await fetch("http://localhost:8080/view/series", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
              },
              body: JSON.stringify({
                username: this.props.match.params.username
              })
            });
            let content = await res.json();
            console.log(content);
            this.setState({ series: content.comicSeries })
        })();
    }   
    
    componentWillUnmount() {
        // In case they want to navigate out and back again
        this.props.saveUpdateComic({
            comicName: this.state.comicName,
            description: this.state.comicDescription,
            userInput: this.state.userInput,
            privacy: this.state.privacy,
            series: this.state.series,
            seriesName: this.state.selected_series,
            sharedUsersList: this.state.sharedUsersList,
            comicPanels: this.state.comicPanels
        });
    }

    handleComicName = (event) => {
        this.setState({ comicName: event.target.value });
    }

    handleComicDescription = (event) => {
        this.setState({ comicDescription: event.target.value });
    }

    handleAddUser = (event) => {
        this.setState({ userInput: event.target.value });
    }

    handleAddUserEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            console.log('PRESSED ENTER');
            let newUsers = this.state.userInput.split(' ');
            let newUsers2 = newUsers.filter(item => item !== "")
            console.log('USERS TO ADD', newUsers2);
            this.setState({ sharedUsersList: [...this.state.sharedUsersList, ...newUsers2], userInput: '' }); 
        }
    }

    handlePrivacy = (event) => {
        this.setState({ privacy: event.target.value });
    }

    renderUserSeries(){
        return (
            this.state.series.map(item=> {
                return item !== null ?
                <div key={item.name}>
                    <Dropdown.Item name={item.name}onClick={this.handleChange}>{item.name}</Dropdown.Item>
                </div>
                :
                null
            })
        )
    }

    handleNavigateCanvas = (event) => {
        this.props.saveUpdateComic({
            comicName: this.state.comicName,
            description: this.state.comicDescription,
            userInput: this.state.userInput,
            privacy: this.state.privacy,
            series: this.state.series,
            seriesName: this.state.selected_series,
            sharedUsersList: this.state.sharedUsersList,
            comicPanels: this.state.comicPanels
        });
        this.props.history.push('/canvas', { previous: 'update', comic: this.props.match.params.comicName });
    }

    handleDeleteShare = (index, event) => {
        event.preventDefault();
        var copy = [...this.state.sharedUsersList];
        if (index !== -1) {
            copy.splice(index, 1);
            this.setState({ sharedUsersList: copy });
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state);
        console.log(this.props.comic.saveUpdateComic);
        const canvases = this.state.comicPanels.map(panel => panel.canvas);
        const images = this.state.comicPanels.map(panel => panel.image);
        console.log(canvases);
        console.log(images);
        (async () => {
            const res = await fetch('http://localhost:8080/update/comic', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    username: this.props.CurrUser.token,
                    description: this.state.comicDescription,
                    oldName: this.props.match.params.comicName,
                    name: this.state.comicName,
                    series: this.state.selected_series,
                    privacy: this.state.privacy,
                    sharedWith: this.state.sharedUsersList,
                    canvases: canvases,
                    images: images
                })
            });
            let content = res.json();
            console.log(content);
            if (content.result === 'failed') {
                alert('Could not update comic');
            } else {
                this.props.saveUpdateComic({});
                this.props.history.push('/view/comics');
            }
        })();
    }
    
    handleDelete = (event) => {
        event.preventDefault();
        console.log(this.props.match.params.comicName);
        console.log(this.props.match.params.username);
        (async () => {
            const res = await fetch('http://localhost:8080/delete/comic', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    comicName: this.props.match.params.comicName,
                    ownerName: this.props.CurrUser.token
                })
            });
            let content = res.json();
            console.log(content);
            if (content.result === 'failed') {
                alert('Could not delete comic');
            } else {
                this.props.history.push('/view/comics');
            }
        })();
    }

    handleChange = e => {
        console.log(e.target)
        const { name } = e.target;
        this.setState({ selected_series: name });
    }

    render() {
        var props = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            initialSlide: 0,
            autoplay: true,
            autoplaySpeed: 1000,
            swipeToSlide: true,
            responsive: [
                {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
                },
                {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2
                }
                },
                {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
                }
            ]
        };
        console.log(this.state.sharedUsersList);
        return (
            <div className="create-comic-container">
                <NavigationBar />
                <div className="create-comic-bottom">
                    <Form className="create-comic-form" onSubmit={this.handleSubmit}>
                        <div className="create-comic-panel-container">
                            <Slider {...props}>
                                {this.state.comicPanels.length ? 
                                    this.state.comicPanels.map((panel, i) => {
                                        return <Panel comic={panel} key={i} />
                                    }) : null}
                                <img src={addPanel} className="panel" onClick={this.handleNavigateCanvas} alt="" />
                            </Slider>
                        </div>
                        <div className="create-comic-info">
                            <Form.Control required className="create-comic-name-input" type="text"  placeholder="Type Comic Name..." name="comicName" value={this.state.comicName} onChange={this.handleComicName} />
                            <Form.Control.Feedback type="invalid">Please name the comic.</Form.Control.Feedback>
                            <Dropdown className="create-comic-dropdown">
                                <Dropdown.Toggle variant="outline-info">
                                    {this.state.selected_series ? this.state.selected_series : 'Select Series'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {this.renderUserSeries()}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="create-comic-description">
                            <Form.Control required className="create-comic-description-input" as="textarea" rows="3"  placeholder="Write a description of the comic" value={this.state.comicDescription} onChange={this.handleComicDescription} />
                        </div>
                        <div className="create-comic-sharing">
                            <div className="create-comic-sharing-inner">
                                <div className="create-comic-sharing-left">
                                    <h2>Shared With</h2>
                                    <ComicSharingTable usernames={this.state.sharedUsersList} handleDeleteShare={this.handleDeleteShare} />
                                </div>
                                <div className="create-comic-sharing-right">
                                    <label>Add User: (Press 'Enter' to Add)</label>
                                    <Form.Control type="text" placeholder= "Sean Jeffrey Fanny" name="userInput" value={this.state.userInput} onChange={this.handleAddUser} onKeyPress={this.handleAddUserEnter}/>
                                    <Form.Check type="radio" name="privacy" value="Public" label="Public" checked={this.state.privacy === 'Public'} onChange={this.handlePrivacy} />
                                    <Form.Check type="radio" name="privacy" value="Private" label="Private" checked={this.state.privacy === 'Private'} onChange={this.handlePrivacy} />
                                </div>
                            </div>
                        </div>
                        <div className="update-comic-submit">
                            <Button type="submit" variant="success" onClick={this.handleSubmit}>Update Comic</Button>
                            <Button variant="danger" onClick={this.handleDelete}>Delete Comic</Button>
                        </div>
                    </Form>
                </div>
                <Footer />
            </div>
        );
    }
}

UpdateComic.propTypes = {
    CurrUser: PropTypes.object,
    comic: PropTypes.object
}

export default connect(StateToProps, { saveUpdateComic, clearPanels })(withRouter(UpdateComic));