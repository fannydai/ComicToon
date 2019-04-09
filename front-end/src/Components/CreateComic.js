import React, { Component } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavigationBar from './NavigationBar';
import './styles/CreateComic.css';
import shoes1 from './images/shoes-1.png';
import shoes2 from './images/shoes-2.png';
import shoes3 from './images/shoes-3.png';

class CreateComic extends Component {

    constructor(props) {
        super(props);
        this.handleLeft = this.handleLeft.bind(this);
        this.handleRight = this.handleRight.bind(this);
        this.handleNavigateCanvas = this.handleNavigateCanvas.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleLeft() {

    }

    handleRight() {

    }

    handleNavigateCanvas() {
        this.props.history.push('/canvas');
    }

    handleSubmit = (e) => {
        e.preventDefault();
        //todo
    }

    render() {
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
                                    <h2>Shared With</h2>
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
                                    <label>Add User: </label>
                                    <Form.Control type="text" placeholder= "Sean Jeffrey Fanny" />
                                    <Form.Check type="radio" name="privacy" label="Public" defaultChecked />
                                    <Form.Check type="radio" name="privacy" label="Private" />
                                </div>
                            </div>
                        </div>
                        <div className="create-comic-submit">
                            <Button type="submit" variant="success" onClick={this.handleSubmit}>Create Comic</Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

export default CreateComic;