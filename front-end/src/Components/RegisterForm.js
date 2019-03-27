import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import './styles/RegisterForm.css';

class RegisterForm extends Component {
    render() {
        return (
            <Form className="register-form">
                <Form.Control type="email" placeholder="Enter your email..." />
                <Form.Control type="text" placeholder="Choose a username..." />
                <Form.Control type="password" placeholder="Create a password..." />
                <Form.Control type="password" placeholder="Confirm password..." />
                <Button type="submit" variant="primary">Register</Button>
            </Form>
        );
    }
}

export default RegisterForm;