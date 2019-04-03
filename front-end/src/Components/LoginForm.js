import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import './styles/Welcome.css';

class LoginForm extends Component {
    render() {
        return (
            <Form className="welcome">
                <Form.Control type="email" className = "paddedFormControl" placeholder="Enter your email..." />
                <Form.Control type="password" className = "paddedFormControl" placeholder="Enter your password..." />
                <button type="submit" className = "paddedFormControl">Login</button>
            </Form>
        );
    }
}

export default LoginForm;