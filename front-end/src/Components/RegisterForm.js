import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import {Redirect} from 'react-router-dom'
import './styles/Welcome.css';

class RegisterForm extends Component {
    constructor() {
        super();
        this.state = {
          username: "",
          pwd: "",
          email: "",
          confirm: "",
          isValidated: false
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.pwd !== this.state.confirm)
            alert("PASSWORD AND CONFIRM PASSWORD DON'T MATCH!")
        else{
            (async () => {
                const res = await fetch("http://localhost:8080/register", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        email: this.state.email,
                        username: this.state.username,
                        password: this.state.pwd
                    })
                });
                let content = await res.json();
                if(content.status === "Email Already Exists") alert("EMAIL EXISTS ALREADY!!")
                else if(content.status === "Username Already Exists") alert("USERNAME EXISTS ALREADY!!")
                else this.setState({isValidated: true})
            })();
        }
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    render() {
        if(this.state.isValidated)
            return <Redirect push to="/verify"/>;

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

export default RegisterForm;