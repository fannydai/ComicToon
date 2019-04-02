import React, { Component } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';

import NavigationBar from './NavigationBar';
import './styles/CreateComic.css';

class CreateComic extends Component {
    render() {
        return (
            <div className="create-comic-container">
                <NavigationBar />
                <div className="create-comic-bottom">
                    <Form className="create-comic-form">
                        <div className="create-panels-container">
                        </div>
                        <div className="create-comic-info">
                            <Form.Control className="create-comic-name-input" type="text" placeholder="Type Comic Name..." />
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
                                    <table className="create-comic-sharing-table">
                                        <tbody>
                                            <tr><td>User 1</td></tr>
                                            <tr><td>User 2</td></tr>
                                            <tr><td>User 3</td></tr>
                                            <tr><td>User 4</td></tr>
                                            <tr><td>UserWithALongUsernameThatDoes'tFit</td></tr>
                                            <tr><td>User 6</td></tr>
                                            <tr><td>User 7</td></tr>
                                            <tr><td>User 8</td></tr>
                                            <tr><td>User 9</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="create-comic-sharing-right">
                                    <Form.Control type="text" placeholder="Add User..." />
                                    <Button type="submit" variant="success">Add</Button>
                                    <Form.Check type="radio" name="privacy" label="Public" defaultChecked />
                                    <Form.Check type="radio" name="privacy" label="Private" />
                                </div>
                            </div>
                        </div>
                        <div className="create-comic-submit">
                            <Button type="submit" variant="success">Create Comic</Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

export default CreateComic;