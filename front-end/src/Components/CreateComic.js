import React, { Component } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
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
import {createComic} from '../Actions/NavbarActions'


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
            comicPanelIndex: 0,
            privacy: 'Public',
            UserSerieses: [],
            selected_series: "",
            loading: false,
            sharedUsersList: []
        }
    }

    componentDidMount(){
        (async () => {
            const res = await fetch("http://localhost:8080/view/series", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
              },
              body: JSON.stringify({
                username: this.props.CurrUser.username
              })
            });
            let content = await res.json();
            this.setState({UserSerieses: content.comicSeries, loading: false})
        })();   
    }

    renderUserSeries(){
        return (
            this.state.UserSerieses.map(item=>
                <div key={item.name}>
                    <Dropdown.Item name={item.name}onClick={this.handleChange}>{item.name}</Dropdown.Item>
                </div>
            )
        )
    }

    handleNavigateCanvas() {
        this.props.history.push('/canvas');
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state)
        if (this.state.comicName === '') {
            alert('Please enter a comic name.');
        } else if (this.state.comicDescription === '') {
            alert('Please enter a comic description.');
        } else if (this.selected_series === '') {
            alert('Please select a series.');
        } else if (this.props.comic.newComic.length === 0) {
            alert('Please create at least one panel.');
        } else {
            const canvases = [];
            const images = [];
            this.props.comic.newComic.forEach(c => {
                canvases.push(JSON.stringify(c.json));
                images.push(c.panel);
            });
            this.props.createComic(
                this.props.CurrUser.username, 
                this.state.comicDescription, 
                this.state.comicName, 
                this.state.selected_series,
                this.state.sharedUsersList,
                canvases,
                images
            )
            this.setState({sharedUsersList: []})
            this.props.history.push({
                pathname: `/view/comic/${this.props.CurrUser.username}/${this.state.comicName}`,
                state: {
                    series: this.state.selected_series
                }
            });
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
            console.log('PRESSED ENTER');
            let newUsers = this.state.userInput.split(' ');
            let newUsers2 = newUsers.filter(item => item !== "")
            console.log('USERS TO ADD', newUsers2);
            this.setState({ sharedUsersList: [...this.state.sharedUsersList, ...newUsers2] }); 
        }
    }

    handlePrivacy = (event) => {
        this.setState({ privacy: event.target.value });
    }

    handleChange = e => {
        console.log(e.target)
        const { name } = e.target;
        this.setState({ selected_series: name });
        alert(`Series '${name} Selected!'`)
    }

    render() {
        var props = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            initialSlide: 0,
            autoplay: false,
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

        const firstPanel = this.props.comic.newComic[0] ? <div className="create-comic-panel-inner"><Panel className="create-comic-panel-inner" comic={this.props.comic.newComic[0]} /></div> : null;
        const secondPanel = this.props.comic.newComic[1] ? <div className="create-comic-panel-inner"><Panel className="create-comic-panel-inner" comic={this.props.comic.newComic[1]} /></div> : null;
        const thirdPanel = this.props.comic.newComic[2] ? <div className="create-comic-panel-inner"><Panel className="create-comic-panel-inner" comic={this.props.comic.newComic[2]} /></div> : null;

        if(this.state.loading) return (<h1>Loading ...</h1>)
        else{
            return (
                <div className="create-comic-container">
                    <NavigationBar />
                    <div className="create-comic-bottom">
                        <Form className="create-comic-form" onSubmit={this.handleSubmit}>
                            <div className="create-comic-panel-container">
                                <Slider {...props}>
                                    {firstPanel}
                                    {secondPanel}
                                    {thirdPanel}
                                    <img src={addPanel} className="panel" onClick={this.handleNavigateCanvas}/>
                                </Slider>
                            </div>
                            <div className="create-comic-info">
                                <Form.Control required className="create-comic-name-input" type="text"  placeholder="Type Comic Name..." name="comicName" value={this.state.comicName} onChange={this.handleComicName} />
                                <Form.Control.Feedback type="invalid">Please name the comic.</Form.Control.Feedback>
                                <Dropdown className="create-comic-dropdown">
                                    <Dropdown.Toggle variant="outline-info">
                                        Select Series
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
                                        <ComicSharingTable usernames={this.state.sharedUsersList} />
                                    </div>
                                    <div className="create-comic-sharing-right">
                                        <label>Add User: (Press 'Enter' to Add)</label>
                                        <Form.Control type="text" placeholder= "Sean Jeffrey Fanny" name="userInput" value={this.state.userInput} onChange={this.handleAddUser} onKeyPress={this.handleAddUserEnter}/>
                                        <Form.Check type="radio" name="privacy" value="Public" label="Public" checked={this.state.privacy === 'Public'} onChange={this.handlePrivacy} />
                                        <Form.Check type="radio" name="privacy" value="Private" label="Private" checked={this.state.privacy === 'Private'} onChange={this.handlePrivacy} />
                                    </div>
                                </div>
                            </div>
                            <div className="create-comic-submit">
                                <Button type="submit" variant="success" onClick={this.handleSubmit}>Create Comic</Button>
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
    createComic: PropTypes.func.isRequired
}

export default connect(StateToProps, {createComic})(withRouter(CreateComic));