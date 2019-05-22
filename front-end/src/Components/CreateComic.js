import React, { Component } from 'react';
import { Alert, Button, Dropdown, Form } from 'react-bootstrap';
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import './styles/CreateComic.css';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import Slider from 'react-slick';

import ComicSharingTable from './ComicSharingTable';
import Panel from './Panel';
import addPanel from './images/addPanel.png';
import { createComic, setCreateComicError } from '../Actions/NavbarActions'
import { saveNewComic, clearPanels, deleteNewComicPanel, dragNewComicPanel } from '../Actions/ComicActions';
import LoadingScreen from './LoadingScreen';


const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user,
    comic: state.comic
});
class CreateComic extends Component {

    constructor(props) {
        super(props);
        this.handleNavigateCanvas = this.handleNavigateCanvas.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddUser = this.handleAddUser.bind(this);

        this.state = {
            comicName: '',
            comicDescription: '',
            userInput: '',
            privacy: 'Public',
            UserSerieses: [],
            selected_series: "",
            loading: true,
            sharedUsersList: [],
            submitError: ""
        }
    }

    componentWillMount() {
        if(this.props.CurrUser.username === "" || this.props.CurrUser.token === "" || this.props.CurrUser.email === "" || this.props.CurrUser.isValidated === false){
            this.props.history.push('/')
        }
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.comic.createComicError) {
            this.setState({ submitError: nextProps.comic.createComicError });
            this.props.setCreateComicError("");
        }
    }

    componentDidMount() {
        // Initialize values if comics is already being edited
        const savedData = this.props.comic.saveNewComic;
        console.log(savedData);
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
        if (savedData.UserSerieses) {
            this.setState({ UserSerieses: savedData.UserSerieses });
        }
        if (savedData.seriesName) {
            this.setState({ selected_series: savedData.seriesName });
        }
        if (savedData.sharedUsersList) {
            this.setState({ sharedUsersList: savedData.sharedUsersList });
        }

        (async () => {
            const res = await fetch("http://localhost:8080/view/series", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
              },
              body: JSON.stringify({
                username: this.props.CurrUser.username,
                token: this.props.CurrUser.token
              })
            });
            let content = await res.json();
            console.log(content);
            this.setState({UserSerieses: content.comicSeries, loading: false})
            if (content.comicSeries && !content.comicSeries.includes(savedData.seriesName)) {
                this.setState({ selected_series: "" });
            }
        })();   
    }

    componentWillUnmount() {
        // In case they want to navigate out and back again
        this.props.saveNewComic({
            comicName: this.state.comicName,
            description: this.state.comicDescription,
            userInput: this.state.userInput,
            privacy: this.state.privacy,
            UserSerieses: this.state.UserSerieses,
            seriesName: this.state.selected_series,
            sharedUsersList: this.state.sharedUsersList
        });
    }

    renderUserSeries(){
        console.log(this.state.UserSerieses);
        return (
            this.state.UserSerieses.map(item=> {
                return item !== null ?
                <div key={item.name}>
                    <Dropdown.Item name={item.name} onClick={this.handleChange}>{item.name}</Dropdown.Item>
                </div>
                :
                null
            })
        )
    }

    handleNavigateCanvas = (e) => {
        // Save the current state to the store
        this.props.saveNewComic({
            comicName: this.state.comicName,
            description: this.state.comicDescription,
            userInput: this.state.userInput,
            privacy: this.state.privacy,
            UserSerieses: this.state.UserSerieses,
            seriesName: this.state.selected_series,
            sharedUsersList: this.state.sharedUsersList
        });
        this.props.history.push('/canvas');
    }

    handleEditPanel = (e, panel, index) => {
        this.props.saveNewComic({
            comicName: this.state.comicName,
            description: this.state.comicDescription,
            userInput: this.state.userInput,
            privacy: this.state.privacy,
            UserSerieses: this.state.UserSerieses,
            seriesName: this.state.selected_series,
            sharedUsersList: this.state.sharedUsersList
        });
        this.props.history.push("/canvas", {
            previous: "/create",
            panel: panel,
            index: index
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.saveNewComic({
            comicName: this.state.comicName,
            description: this.state.comicDescription,
            userInput: this.state.userInput,
            privacy: this.state.privacy,
            UserSerieses: this.state.UserSerieses,
            seriesName: this.state.selected_series,
            sharedUsersList: this.state.sharedUsersList
        });
        console.log(this.state)
        if (this.state.comicName === '') {
            alert('Please enter a comic name.');
        } else if (this.state.comicDescription === '') {
            alert('Please enter a comic description.');
        } else if (this.state.selected_series === '') {
            this.setState({ submitError: "Select a series." });
        } else if (this.props.comic.newComic.length === 0) {
            this.setState({ submitError: "Create at least one panel." });
        } else {
            const canvases = [];
            const images = [];
            this.props.comic.newComic.forEach(c => {
                canvases.push(JSON.stringify(c.json));
                images.push(c.image);
            });
            this.props.createComic(
                this.props.CurrUser.username,
                this.props.CurrUser.token, 
                this.state.comicDescription, 
                this.state.comicName, 
                this.state.selected_series,
                this.state.sharedUsersList,
                this.state.privacy,
                canvases,
                images,
                this.props.history
            );
            // this.setState({sharedUsersList: []});
            /*
            this.props.history.push({
                pathname: `/view/comic/${localStorage.getItem('user')}/${this.state.comicName}`,
                state: {
                    series: this.state.selected_series
                }
            });*/
        }
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
            //let newUsers = this.state.userInput.split(' ');
            //let newUsers2 = newUsers.filter(item => item !== "")
            if (this.state.userInput) {
                this.setState({ sharedUsersList: [...this.state.sharedUsersList, this.state.userInput], userInput: '' }); 
            }
        }
    }

    handlePrivacy = (event) => {
        this.setState({ privacy: event.target.value });
    }

    handleDeleteShare = (index, event) => {
        const copy = [...this.state.sharedUsersList];
        copy.splice(index, 1);
        this.setState({ sharedUsersList: copy });
    }

    handleChange = e => {
        console.log(e.target)
        const { name } = e.target;
        this.setState({ selected_series: name });
    }
    
    handleClosePanel = (index, event) => {
        this.props.deleteNewComicPanel(index);
    }

    handleDragStart = (e, index) => {
        this.draggedItem = this.props.comic.newComic[index];
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", e.target.parentNode);
        e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
    }

    handleDragOver = (index) => {
        const draggedOverItem = this.props.comic.newComic[index];
        if (this.draggedItem === draggedOverItem) {
            return;
        }
        this.props.dragNewComicPanel(index, this.draggedItem);
    }

    handleDragEnd = () => {
        this.draggedItem = null;
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
                    slidesToShow: 2,
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
        if(this.state.loading) {
            return <LoadingScreen />
        }
        else{
            return (
                <div className="create-comic-container">
                    <NavigationBar />
                    <div className="create-comic-bottom">
                        <Form className="create-comic-form" onSubmit={this.handleSubmit}>
                            <h1>CREATE COMIC</h1>
                            <div className="create-comic-panel-container">
                                <Slider {...props}>
                                    {this.props.comic.newComic.length ? 
                                        this.props.comic.newComic.map((panel, i) => {
                                            return <Panel comic={panel} key={i} edit={e => this.handleEditPanel(e, panel, i)} close={e => this.handleClosePanel(i, e)} dragstart={e => this.handleDragStart(e, i)} dragend={this.handleDragEnd} dragover={e => this.handleDragOver(i)} draggable />
                                        }) : null}
                                    <img src={addPanel} className="panel" onClick={this.handleNavigateCanvas} alt="" />
                                </Slider>
                            </div>
                            <div className="create-comic-info">
                                {this.state.submitError ? <Alert variant="danger" >{this.state.submitError}</Alert> : <Alert variant="danger" style={{ visibility: "hidden" }}>Hi</Alert>}
                                <Form.Control required className="create-comic-name-input" type="text"  placeholder="Type Comic Name..." name="comicName" value={this.state.comicName} onChange={this.handleComicName} />
                                <Form.Control.Feedback type="invalid">Please name the comic.</Form.Control.Feedback>
                                <Dropdown className="create-comic-dropdown">
                                    <Dropdown.Toggle variant="info" className="create-comic-dropdown-button">
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
                                        <Form.Control type="text" placeholder= "Sean Jeffrey Fanny Joel" name="userInput" value={this.state.userInput} onChange={this.handleAddUser} onKeyPress={this.handleAddUserEnter}/>
                                        <Form.Check required type="radio" name="privacy" value="Public" label="Public" checked={this.state.privacy === 'Public'} onChange={this.handlePrivacy} />
                                        <Form.Check type="radio" name="privacy" value="Private" label="Private" checked={this.state.privacy === 'Private'} onChange={this.handlePrivacy} />
                                    </div>
                                </div>
                            </div>
                            <div className="create-comic-submit">
                                <Button type="submit" variant="success">Create Comic</Button>
                            </div>
                        </Form>
                    </div>
                    <Footer />
                </div>
            );
        }
    }
}

CreateComic.propTypes = {
    CurrUser: PropTypes.object,
    comic: PropTypes.object,
    createComic: PropTypes.func.isRequired,
    saveNewComic: PropTypes.func.isRequired,
    clearPanels: PropTypes.func.isRequired,
    deleteNewComicPanel: PropTypes.func.isRequired,
    setCreateComicError: PropTypes.func.isRequired,
    dragNewComicPanel: PropTypes.func.isRequired
}

export default connect(StateToProps, {createComic, saveNewComic, clearPanels, deleteNewComicPanel, setCreateComicError, dragNewComicPanel})(withRouter(CreateComic));