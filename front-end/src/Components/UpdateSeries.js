import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Button, Form } from 'react-bootstrap';

import NavigationBar from './NavigationBar';
import Footer from './Footer';
import './styles/CreateSeries.css';
import { getAllSeries } from './../Actions/ComicActions';


const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user,
    comic: state.comic
});
class UpdateSeries extends Component {

    constructor(props) {
        super(props);
    }

    handleDelete = (event) => {
        event.preventDefault();
        (async () => {
            const res = await fetch("http://localhost:8080/delete/series", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
              },
              body: JSON.stringify({
                seriesName: this.props.match.params.seriesName,
                ownerName: this.props.match.params.username
              })
            });
            let content = await res.json();
            console.log(content);
            if (content.result === 'failure') {
                alert('Could not delete series.');
            } else {
                console.log('DELETED');
                (async () => {
                    const res = await fetch("http://localhost:8080/view/series", {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                      },
                      body: JSON.stringify({
                        username: this.props.CurrUser.username
                      })
                    });
                    let content = await res.json();
                    console.log(content);
                    if (content.comicSeries) {
                        this.props.getAllSeries(content.comicSeries);
                    }
                })();
                this.props.history.push('/view/series');
            }
        })();
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
                            <div className="create-series-genre-right">
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
                 <Footer />
            </div>
        );
    }
}

UpdateSeries.propTypes = {
    getAllSeries: PropTypes.func.isRequired,
    comic: PropTypes.object,
    CurrUser: PropTypes.object
}

export default connect(StateToProps, { getAllSeries })(withRouter(UpdateSeries));