import React, { Component } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavigationBar from './NavigationBar';
import Footer from './Footer';
import './styles/UploadComic.css';

class UploadComic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            image: null,
            json: null,
            filename: null
        }
    }

    componentDidMount() {
        window.addEventListener('dragenter', this.onDragEnter, false);
        window.addEventListener('dragover', this.onDragOver, false);
        window.addEventListener('drop', this.onDrop, false);
    }

    onDragEnter = (event) => {
        event.stopPropagation();
        event.preventDefault();
    }

    onDragOver = (event) => {
        event.stopPropagation();
        event.preventDefault();
    }

    onDrop = (event) => {
        event.stopPropagation();
        event.preventDefault();

        const file = event.dataTransfer.files[0];
        this.onFileUpload(file);
    }


    onFileUpload = (file) => {
        console.log(file);
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (() => {
                return (e) => {
                    this.setState({ image: e.target.result });
                };
            })();
            reader.readAsDataURL(file);
        } else if (file.type === 'application/json') {
            this.setState({ filename: file.name });
            const reader = new FileReader();
            reader.onload = (() => {
                return (e) => {
                    console.log(e);
                    this.setState({ json: JSON.parse(e.target.result) });
                }
            })();
            reader.readAsText(file);
        }
    }

    handleDelete = (event) => {
        this.setState({ image: null, json: null });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        //todo
    }

    render() {
        const imgOrUpload = this.state.image ? 
            <div className="upload-preview-container">
                <span className="upload-preview-close" onClick={this.handleDelete}>X</span>
                <img id="upload-preview" src={this.state.image} /> 
            </div>
            : this.state.json ?
            <div style={{ display: "flex" }}>
                <p>{this.state.filename}</p>
                <button type="button" className="btn-danger" aria-label="Close"><span aria-hidden="true">X</span></button>
            </div>
            :
            <div><FontAwesomeIcon icon="cloud-upload-alt" size="7x" /><p style={{ textAlign: "center" }}>Drop file here</p></div>;
        return (
            <div className="upload-comic-container">
                <NavigationBar />
                <div className="upload-bottom-container">
                    <Form className="upload-form" onSubmit={this.handleSubmit}>
                        <div className="upload-container" id="upload-container">
                            {imgOrUpload}
                        </div>
                        <div className="upload-info">
                            <Form.Control className="upload-name-input" type="text" placeholder="Type Comic Name..." />
                            <br />
                        </div>
                        <div className="upload-sharing">
                            <div className="upload-sharing-inner">
                                <div className="upload-table-container">
                                    <table className="upload-sharing-table">
                                    
                                        <tbody>
                                            <tr><td><Form.Control type="text" placeholder="Add User... (ex. Sean Jeffrey Fanny Joel)" /></td></tr>
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