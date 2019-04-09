import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import NavigationBar from './NavigationBar';
import './styles/CreateSeries.css';
import { createSeries} from './../Actions/NavbarActions';
import {withRouter} from 'react-router-dom'

const StateToProps = (state) => ({ //application level state via redux
    UserSeries: state.NavBar.User_Series,
    CurrUser: state.user
});

class CreateSeries extends Component {
    constructor () {
        super()
        this.state = {
            seriesName: "",
            genre : ""
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.UserSeries !== this.props.UserSeries) alert(`Series "${this.state.seriesName}" Created!!`)
        else alert(`Series "${this.state.seriesName}" NOT Created... Error`) //on error
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.createSeries(this.props.CurrUser.username, this.state.seriesName, this.state.genre.split(" "), "private")
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
                            <Form.Control className="create-series-name-form-control" name="seriesName" type="text" placeholder="Type Series Name..." onChange={this.handleChange} />
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
                                <Form.Control type="text" name="genre" placeholder="Genre/Tags (ex. #horror #action #funny)" onChange={this.handleChange} />
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

CreateSeries.propTypes = {
    createSeries: PropTypes.func.isRequired,
    UserSeries: PropTypes.string,
    CurrUser: PropTypes.object
}

export default connect(StateToProps, {createSeries})(withRouter(CreateSeries));