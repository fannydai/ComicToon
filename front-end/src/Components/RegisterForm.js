import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import {withRouter} from 'react-router-dom'
import './styles/Welcome.css';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {RegisterUser} from '../Actions/UserActions'

const StateToProps = (state) => ({ //application level state via redux
    user: state.user
});

class RegisterForm extends Component {
    constructor() {
        super();
        this.state = {
          username: "",
          pwd: "",
          email: "",
          confirm: ""
        };
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.user.username !== "") this.props.history.push('/home') 
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.pwd !== this.state.confirm)
            alert("PASSWORD AND CONFIRM PASSWORD DON'T MATCH!")
        else this.props.RegisterUser(this.state.username, this.state.email, this.state.pwd)
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    render() {
        return (
            <Form className="welcome" onSubmit={this.handleSubmit}>
                <Form.Control type="email" className = "paddedFormControl" name="email" placeholder="Enter your email..." onChange={this.handleChange}/>
                <Form.Control type="text" className = "paddedFormControl" name= "username" placeholder="Choose a username..." onChange={this.handleChange} />
                <Form.Control type="password" className = "paddedFormControl" name= "pwd" placeholder="Create a password..." onChange={this.handleChange} />
                <Form.Control type="password" className = "paddedFormControl" name="confirm" placeholder="Confirm password..." onChange={this.handleChange}/>
                <button type="submit" className = "paddedFormControl" variant="primary">Register</button>
            </Form>
        );
    }
}
RegisterForm.propTypes = {
    RegisterUser: PropTypes.func.isRequired,
    user: PropTypes.object,
};

export default connect(StateToProps, {RegisterUser})(withRouter(RegisterForm));