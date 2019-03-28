import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import './styles/NavigationBar.css';

class NavigationBar extends Component {
    
    handleLogout() {
        
    }

    render() {
        return (
            <Navbar expand="sm">
                <Navbar.Brand>ComicToon</Navbar.Brand>
                <Navbar.Toggle aria-controls="top-nav" />
                <Navbar.Collapse id="top-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <NavDropdown title="Comic">
                            <NavDropdown.Item href="">View My Comics</NavDropdown.Item>
                            <NavDropdown.Item href="">View My Series</NavDropdown.Item>
                            <NavDropdown.Item href="">Create Comic</NavDropdown.Item>
                            <NavDropdown.Item href="/upload">Upload Comic</NavDropdown.Item>
                            <NavDropdown.Item href="/create/series">Create Series</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="ml-auto">
                        <Nav.Link onSelect={this.handleLogout()}>Log out</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavigationBar;