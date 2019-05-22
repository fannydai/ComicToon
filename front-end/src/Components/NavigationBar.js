import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown,Image,Form,FormControl,Button } from 'react-bootstrap';
import { connect } from 'react-redux'
import './styles/App.css';
import './styles/NavigationBar.css';

import logo from './images/small_logo.png';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import { createSeries , createComic } from './../Actions/NavbarActions';

const StateToProps = (state) => ({ //application level state via redux
    NavBar: state.NavBar,
    user: state.user
});

class NavigationBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            query: ""
        }
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleLogout() { localStorage.removeItem('state'); }
    handleGoToCreateSeries = (e) => {this.props.history.push('/create/series')}
    handleGoToUpload = (e) => {this.props.history.push('/upload')}
    handleGoToCreateComic = (e) => {this.props.history.push('/create/comic')}
    handleGoToViewSeries = (e) =>{this.props.history.push('/view/series')}
    handleGoToViewComic = (e) =>{this.props.history.push('/view/comics')}
    handleGoToHome = (e) => {this.props.history.push('/')}
    handleGoToIndex = (e) => {this.props.history.push('/')}
    handleSearch = (e) => {
        e.preventDefault();
        this.props.history.push({
            pathname: '/search', 
            state: {
              query: this.state.query 
            }
        })
    }
    handleGoToMessages = (e) => {this.props.history.push('/messages')}
    handleGoToSharedComics = (e) => {this.props.history.push('/sharedComics')}

    render() {
        return (
            <Navbar expand="sm">
                <Navbar.Brand><Image className="logoimage" src={logo} fluid width="33" onClick={this.handleGoToHome}/></Navbar.Brand>
                <Navbar.Toggle aria-controls="top-nav" />
                <Navbar.Collapse id="top-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={this.handleGoToIndex}>Home</Nav.Link>
                        <Nav.Link onClick={this.handleGoToMessages}>Message Center</Nav.Link>

                        <NavDropdown title="Comic Menu">
                            <NavDropdown.Item onClick={this.handleGoToViewComic}>View My Comics</NavDropdown.Item>
                            <NavDropdown.Item onClick={this.handleGoToViewSeries}>View My Series</NavDropdown.Item>
                            <NavDropdown.Item onClick={this.handleGoToCreateComic}>Create Comic</NavDropdown.Item>
                            <NavDropdown.Item onClick={this.handleGoToUpload}>Upload Comic</NavDropdown.Item>
                            <NavDropdown.Item onClick={this.handleGoToCreateSeries}>Create Series</NavDropdown.Item>
                            <NavDropdown.Item onClick={this.handleGoToSharedComics}>Comics Shared With Me</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Form className="navbar-search-form" inline onSubmit={this.handleSearch}>
                        <FormControl type="text" name="query" placeholder="Search" className="navbar-search-input mr-sm-2" onChange={this.handleChange} />
                        <Button variant="success" type="submit">Search</Button>
                    </Form>
                    <Nav className="ml-auto">
                        {this.props.user.token ? <Nav.Link href="/logout" onClick={this.handleLogout}>Log Out</Nav.Link> : <Nav.Link href="/">Log In</Nav.Link>}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

NavigationBar.propTypes = {
    createSeries: PropTypes.func.isRequired,
    createComic: PropTypes.func.isRequired
}

export default connect(StateToProps, { createSeries, createComic})(withRouter(NavigationBar));