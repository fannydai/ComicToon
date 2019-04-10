import React, { Component } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavigationBar from './NavigationBar';
import Footer from './Footer';
import './styles/UploadComic.css';

class UploadComic extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        //todo
    }

    render() {
        return (
            <div className="upload-comic-container">
                <NavigationBar />
                <div className="upload-bottom-container">
                    <Form className="upload-form" onSubmit={this.handleSubmit}>
                        <div className="upload-container">
                            <FontAwesomeIcon icon="cloud-upload-alt" size="7x" />
                            <p>Drop file here</p>
                        </div>
                        <div className="upload-info">
                            <Form.Control className="upload-name-input" type="text" placeholder="Type Comic Name..." />
                            <br />
                        </div>
                        <div className="upload-sharing">
                            <div className="upload-sharing-inner">
                                <div className="upload-table-container">
                                    <table className="upload-sharing-table">
                                    <Form.Control type="text" placeholder="Add User... (ex. Sean Jeffrey Fanny Joel)" />
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
                                <div className="upload-sharing-right">
                                    <Form.Check type="radio" name="privacy" label="Public" defaultChecked />
                                    <Form.Check type="radio" name="privacy" label="Private" />
                                    <br />
                                    <br />
                                    <br />
                                    <Dropdown className="upload-dropdown">
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
                            </div>
                        </div>
                        <div className="upload-submit">
                            <Button type="submit" variant="success">Upload Comic</Button>
                        </div>
                    </Form>
                </div>
                <Footer />
            </div>
        );
    }
}

export default UploadComic;