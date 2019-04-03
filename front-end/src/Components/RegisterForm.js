import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import './styles/RegisterForm.css';

class RegisterForm extends Component {
    render() {
        return (
            <Form className="register-form">
                <Form.Control type="email" className = "paddedFormControl" placeholder="Enter your email..." />
                <Form.Control type="text" className = "paddedFormControl" placeholder="Choose a username..." />
                <Form.Control type="password" className = "paddedFormControl"placeholder="Create a password..." />
                <Form.Control type="password" className = "paddedFormControl" placeholder="Confirm password..." />
                <Button type="submit" className = "paddedFormControl" variant="primary">Register</Button>
            </Form>
        );
    }
}

export default RegisterForm;