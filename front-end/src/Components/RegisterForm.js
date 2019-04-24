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
        console.log(nextProps);
        if(nextProps.user.username !== "" && !nextProps.user.isValidated) {
            // Go to verify
            console.log('VERIFY');
            this.props.history.push('/verify');
        }
        else{
            console.log("heye")
        }
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
                <div className="bubbletext">
                    <Form.Control required type="email" className = "paddedFormControl textbox" name="email" placeholder="Enter your email..." onChange={this.handleChange}/>
                </div>
                <div className="bubbletext">
                    <Form.Control required type="text" className = "paddedFormControl textbox" name= "username" placeholder="Choose a username..." onChange={this.handleChange} />
                </div>
                <div className="bubbletext">
                    <Form.Control required type="password" className = "paddedFormControl textbox" name= "pwd" placeholder="Create a password..." onChange={this.handleChange} />
                </div>
                <div className="bubbletext">
                    <Form.Control required type="password" className = "paddedFormControl textbox" name="confirm" placeholder="Confirm password..." onChange={this.handleChange}/>
                </div>
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