import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';

import NavigationBar from './NavigationBar';
import './styles/CreateSeries.css';

class CreateSeries extends Component {
    render() {
        return (
            <div className="create-series-container">
                 <NavigationBar />
                 <div className="create-bottom-container">
                    <Form className="create-form">
                        <div className="name-input">
                            <Form.Control className="name-form-control" type="text" placeholder="Type Series Name..." />
                        </div>
                        <div className="genre-input">
                            <table className="genre-table">
                                <tbody>
                                    <tr><td>Horror</td></tr>
                                    <tr><td>Romance</td></tr>
                                    <tr><td>Comedy</td></tr>
                                    <tr><td>Action</td></tr>
                                </tbody>
                            </table>
                            <div class="genre-right">
                                <Form.Control type="text" placeholder="Genre/Tags" />
                                <Button type="submit" variant="success">Add</Button>
                            </div>
                        </div>
                        <div className="create-bottom">
                            <Button type="submit" variant="primary">Create Series</Button>
                        </div>
                    </Form>
                 </div>
            </div>
        );
    }
}

export default CreateSeries;