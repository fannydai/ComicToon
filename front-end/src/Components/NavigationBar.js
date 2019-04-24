import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown,Image,Form,FormControl,Button } from 'react-bootstrap';
import { connect } from 'react-redux'
import './styles/App.css';
import './styles/NavigationBar.css';

import logo from './images/small_logo.png';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import { createSeries, viewMySeries, upload, createComic, viewMyComic} from './../Actions/NavbarActions';

const StateToProps = (state) => ({ //application level state via redux
    NavBar: state.NavBar
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

    handleLogout() {localStorage.removeItem('user'); localStorage.removeItem('state');}
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

    render() {
        return (
            <Navbar expand="sm">
                <Navbar.Brand><Image className="logoimage" src={logo} fluid width="33" onClick={this.handleGoToHome}/></Navbar.Brand>
                <Navbar.Toggle aria-controls="top-nav" />
                <Navbar.Collapse id="top-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={this.handleGoToIndex}>Home</Nav.Link>
                        <NavDropdown title="Comic">
                            <NavDropdown.Item onClick={this.handleGoToViewComic}>View My Comics</NavDropdown.Item>
                            <NavDropdown.Item onClick={this.handleGoToViewSeries}>View My Series</NavDropdown.Item>
                            <NavDropdown.Item onClick={this.handleGoToCreateComic}>Create Comic</NavDropdown.Item>
                            <NavDropdown.Item onClick={this.handleGoToUpload}>Upload Comic</NavDropdown.Item>
                            <NavDropdown.Item onClick={this.handleGoToCreateSeries}>Create Series</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Form className="navbar-search-form" inline onSubmit={this.handleSearch}>
                        <FormControl type="text" name="query" placeholder="Search" className="navbar-search-input mr-sm-2" onChange={this.handleChange} />
                        <Button variant="outline-success" type="submit">Search</Button>
                    </Form>
                    <Nav className="ml-auto">
                        <Nav.Link href="/logout" onClick={this.handleLogout}>Log Out</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

NavigationBar.propTypes = {
    createSeries: PropTypes.func.isRequired,
    viewMySeries: PropTypes.func.isRequired,
    upload: PropTypes.func.isRequired,
    createComic: PropTypes.func.isRequired,
    viewMyComic: PropTypes.func.isRequired
}

export default connect(StateToProps, { createSeries, viewMySeries, upload, createComic, viewMyComic})(withRouter(NavigationBar));