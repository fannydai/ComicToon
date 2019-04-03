import React, { Component } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import './styles/Welcome.css';

class ForgotForm extends Component {
    render() {
        return (
            <div className="Forgot-container">
                
                <Form className="welcome">
                <p>Please enter your email associated with your account. You will be emailed a password reset link valid for 24 hours.</p>
                    <Form.Control type="email" className = "paddedFormControl" placeholder="Enter your email..." />
                    <button type="submit" className = "paddedFormControl" variant="primary" >Submit</button>
                </Form>
            </div>
        );
    }
}

export default ForgotForm;