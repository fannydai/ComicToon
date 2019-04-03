import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import './styles/Welcome.css';

class RegisterForm extends Component {
    render() {
        return (
            <Form className="welcome">
                <Form.Control type="email" className = "paddedFormControl" placeholder="Enter your email..." />
                <Form.Control type="text" className = "paddedFormControl" placeholder="Choose a username..." />
                <Form.Control type="password" className = "paddedFormControl"placeholder="Create a password..." />
                <Form.Control type="password" className = "paddedFormControl" placeholder="Confirm password..." />
                <button type="submit" className = "paddedFormControl" variant="primary">Register</button>
            </Form>
        );
    }
}

export default RegisterForm;