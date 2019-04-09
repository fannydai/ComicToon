import React, { Component } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import './styles/CreateComic.css';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

import shoes1 from './images/shoes-1.png';
import shoes2 from './images/shoes-2.png';
import shoes3 from './images/shoes-3.png';

import ComicSharingTable from './ComicSharingTable';


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
    }

    handleComicName = (event) => {
        this.setState({ comicName: event.target.value });
    }

    handleAddUser = (event) => {
        this.setState({ userInput: event.target.value });
    }

    handleAddUserEnter = (event) => {
        if (event.key === 'Enter') {
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
    }

    render() {
        if(this.state.loading) return (<h1>Loading ...</h1>)
        else{
            return (
                <div className="create-comic-container">
                    <NavigationBar />
                    <div className="create-comic-bottom">
                        <Form className="create-comic-form" onSubmit={this.handleSubmit}>
                            <div className="create-comic-panel-container">
                                <div className="create-comic-panel-left">
                                    <FontAwesomeIcon icon="chevron-left" size="2x" onClick={this.handleLeft} />
                                </div>
                                <div className="create-comic-panel-middle">
                                    <div className="create-comic-panel-inner">
                                        <img className="create-comic-img" src={shoes1} />
                                    </div>
                                    <div className="create-comic-panel-inner">
                                        <img className="create-comic-img" src={shoes2} />
                                    </div>
                                    <div className="create-comic-panel-inner">
                                        <img className="create-comic-img" src={shoes3} />
                                    </div>
                                    <div className="create-comic-panel-plus">
                                        <FontAwesomeIcon icon="plus" size="2x" onClick={this.handleNavigateCanvas} />
                                    </div>
                                </div>
                                <div className="create-comic-panel-right">
                                    <FontAwesomeIcon icon="chevron-right" size="2x" onClick={this.handleRight} />
                                </div>
                            </div>
                            <div className="create-comic-info">
                                <Form.Control className="create-comic-name-input" type="text"  placeholder="Type Comic Name..." name="comicName" value={this.state.comicName} onChange={this.handleComicName} />
                                <Dropdown className="create-comic-dropdown">
                                    <Dropdown.Toggle variant="outline-info">
                                        Select Series
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu >
                                        {this.renderUserSeries()}
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
    CurrUser: PropTypes.object
}

export default connect(StateToProps, {})(withRouter(CreateComic));