import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';

import NavigationBar from './NavigationBar';
import './styles/CreateSeries.css';

class CreateSeries extends Component {
    constructor () {
        super()
        this.state = {
            username: "",
            seriesName: "",
            genre : "",
            privacy: "" //default private
        }
    }

    handleSubmit = (e) => {
        e.preventfault();

    }
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    render() {
        return (
            <div className="create-series-container">
                 <NavigationBar />
                 <div className="create-bottom-container">
                    <Form className="create-form" onSubmit={this.handleSubmit}>
                        <div className="create-series-name-input">
                            <Form.Control className="create-series-name-form-control" name="seriesName" type="text" placeholder="Type Series Name..." />
                        </div>
                        <div className="create-series-genre-input">
                            <div className="create-series-table-container">
                                <table className="create-series-genre-table">
                                    <tbody>
                                        <tr><td>Horror</td></tr>
                                        <tr><td>Romance</td></tr>
                                        <tr><td>Comedy</td></tr>
                                        <tr><td>Action</td></tr>
                                        <tr><td>Action</td></tr>
                                        <tr><td>SuperCoolGenreThatDoesn'tFitHere</td></tr>
                                        <tr><td>Action</td></tr>
                                        <tr><td>Action</td></tr>
                                        <tr><td>Action</td></tr>
                                        <tr><td>Action</td></tr>
                                        <tr><td>Action</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="create-series-genre-right">
                                <Form.Control type="text" name="genre" placeholder="Genre/Tags (ex. #horror #action #funny)" />
                            </div>
                        </div>
                        <div className="create-series-bottom">
                            <Button type="submit" variant="primary">Create Series</Button>
                        </div>
                    </Form>
                 </div>  
            </div>
        );
    }
}

export default CreateSeries;