import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';

import NavigationBar from './NavigationBar';
import './styles/CreateSeries.css';

class UpdateSeries extends Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    handleDelete() {
        this.props.history.push('/view/series');
    }

    handleUpdate() {
        this.props.history.push('/view/series');
    }

    render() {
        return (
            <div className="create-series-container">
                 <NavigationBar />

                 <div className="create-bottom-container">
                    <Form className="create-form">
                        <div className="create-series-name-input">
                            <Form.Control className="create-series-name-form-control" type="text" placeholder="Type Series Name..." />
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
                                <Form.Control type="text" placeholder="Genre/Tags" />
                                <Button type="submit" variant="success">Add</Button>
                            </div>
                        </div>
                        <div className="create-series-bottom">
                            <Button onClick={this.handleUpdate} type="submit" variant="primary">Update Series</Button>
                            <Button onClick={this.handleDelete} type="submit" variant="danger">Delete Series</Button>
                        </div>
                    </Form>
                 </div>
                 
            </div>
        );
    }
}

export default UpdateSeries;