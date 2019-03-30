import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import './styles/VerifyForm.css';

class Verify extends Component {
    constructor(){
        super()
        this.state = {
            email: "",
            key: ""
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleRequest = (e) => {
        e.preventDefault()
        console.log(this.state.email)
        console.log(this.state.key)
    }

    render() {
        return (
            <div className="verify-form-container">
				<div className="verify">
                    <h1>Verify Your Account!</h1>
                    <Form className="verify-form" onSubmit={this.handleRequest}>
                        <Form.Control name="email" type="email" onChange={this.handleChange} placeholder="Enter your email..." />
                        <Form.Control name="key" type="key" onChange={this.handleChange} placeholder="Enter the key found in your email... " />
                        <Button type="submit" variant="primary">Verify!</Button>
                    </Form>
				</div>
			</div>
        );
    }
}

export default Verify;