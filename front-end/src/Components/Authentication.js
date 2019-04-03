import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import './styles/Welcome.css';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotForm from './ForgotForm';

class Authentication extends Component {
    render() {
        return (
            <Tabs defaultActiveKey="login">
                <Tab eventKey="login" title="Login">
                    <LoginForm />
                </Tab>
                <Tab eventKey="register" title="Register">
                    <RegisterForm />
                </Tab>
                <Tab eventKey="forgot" title="Forgot Password">
                    <ForgotForm />
                </Tab>
            </Tabs>
        );
    }
}

export default Authentication;