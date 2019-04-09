import React, { Component } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import shoes1 from './images/shoes-1.png';
import shoes2 from './images/shoes-2.png';
import shoes3 from './images/shoes-3.png';

import addPanel from './images/addPanel.png';
import ComicSharingTable from './ComicSharingTable';

import Slider from "react-slick";
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import './styles/CreateComic.css';

let AllSerieses = null;

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user
});
class CreateComic extends Component {

    constructor(props) {
        super(props);
        this.handleLeft = this.handleLeft.bind(this);
        this.handleRight = this.handleRight.bind(this);
        this.handleNavigateCanvas = this.handleNavigateCanvas.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddUser = this.handleAddUser.bind(this);

        this.state = {
            comicName: '',
            sharedUsers: '',
            userInput: '',
            privacy: 'Public',
            UserSerieses: null,
            selected_series: "",
            loading: true,
            sharedUsersList: []

        }
    }

    componentDidMount(){
        console.log(this.props);
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

    handleLeft() {

    }

    handleRight() {

    }

    renderUserSeries(){
        return (
            this.state.UserSerieses.map(item=>
                <div key={item.name}>
                    <Dropdown.Item name="selected_series" onClick={this.handleChange}>{item.name}</Dropdown.Item>
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
    }

    handleComicName = (event) => {
        console.log(event.target.value);
        this.setState({ comicName: event.target.value });
    }

    handleAddUser = (event) => {
        this.setState({ userInput: event.target.value });
    }

    handleAddUserEnter = (event) => {
        if (event.key === 'Enter') {
            console.log('PRESSED ENTER');
            const newUsers = this.state.userInput.split(' ');
            console.log('USERS TO ADD', newUsers);
            this.setState({ sharedUsersList: [...this.state.sharedUsersList, ...newUsers] }); 
        }
    }

    handlePrivacy = (event) => {
        this.setState({ privacy: event.target.value });
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
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

        if(this.state.loading) return (<h1>Loading ...</h1>)
        else{
            return (
            <div className="create-comic-container">
                <NavigationBar />
                <div className="create-comic-bottom">
                    <Form className="create-comic-form" onSubmit={this.handleSubmit}>

                        <div className="create-comic-panel-container">
                            <Slider {...props}>
                                <img src={shoes1} className="panel" onClick={this.handleNavigateCanvas}/>
                                <img src={shoes2} className="panel" onClick={this.handleNavigateCanvas}/>
                                <img src={shoes3} className="panel" onClick={this.handleNavigateCanvas}/>
                                <img src={addPanel} className="panel" onClick={this.handleNavigateCanvas}/>
                            </Slider>
                        </div>
                        <div className="create-comic-info">
                            <Form.Control className="create-comic-name-input" type="text"  placeholder="Type Comic Name..." name="comicName" value={this.state.comicName} onChange={this.handleComicName} />
                            <Dropdown className="create-comic-dropdown">
                                <Dropdown.Toggle variant="outline-info">
                                    Select Series
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item>XKCD</Dropdown.Item>
                                    <Dropdown.Item>SMBC</Dropdown.Item>
                                    <Dropdown.Item>Cyanide and Happiness</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="create-comic-sharing">
                            <div className="create-comic-sharing-inner">
                                <div className="create-comic-sharing-left">
                                    <h2>Shared With</h2>
                                    <ComicSharingTable usernames={this.state.sharedUsersList} />
                                </div>
                                <div className="create-comic-sharing-right">
                                    <label>Add User: </label>
                                    <Form.Control type="text" placeholder= "Sean Jeffrey Fanny" name="userInput" value={this.state.userInput} onChange={this.handleAddUser} onKeyPress={this.handleAddUserEnter} />
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
    CurrUser: PropTypes.object
}

export default connect(StateToProps, {})(withRouter(CreateComic));