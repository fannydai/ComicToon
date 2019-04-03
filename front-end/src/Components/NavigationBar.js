import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown,Image,Form,FormControl,Button } from 'react-bootstrap';

import './styles/App.css';
import './styles/NavigationBar.css';

import logo from './images/logo.jpg';


class NavigationBar extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <Navbar expand="sm">
                <Navbar.Brand><a href = "/home"><Image className="logoimage" src={logo} fluid width="75" /></a></Navbar.Brand>
                <Navbar.Toggle aria-controls="top-nav" />
                <Navbar.Collapse id="top-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <NavDropdown title="Comic">
                            <NavDropdown.Item href="/view/comics">View My Comics</NavDropdown.Item>
                            <NavDropdown.Item href="/view/series">View My Series</NavDropdown.Item>
                            <NavDropdown.Item href="/create/comic">Create Comic</NavDropdown.Item>
                            <NavDropdown.Item href="/upload">Upload Comic</NavDropdown.Item>
                            <NavDropdown.Item href="/create/series">Create Series</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Form className="navbar-search-form" inline>
                        <FormControl type="text" placeholder="Search" className="navbar-search-input mr-sm-2" />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                    <Nav className="ml-auto">
                        <Nav.Link href="/logout">Log out</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavigationBar;