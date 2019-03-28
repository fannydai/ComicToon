import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import './styles/LoginForm.css';

class LoginForm extends Component {
    render() {
        return (
            <Form className="login-form">
                <Form.Control type="email" placeholder="Enter your email..." />
                <Form.Control type="password" placeholder="Enter your password..." />
                <Button type="submit" variant="primary">Login</Button>
            </Form>
        );
    }
}

export default LoginForm;