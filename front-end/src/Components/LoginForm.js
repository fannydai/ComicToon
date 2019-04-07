import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import './styles/Welcome.css';
import {Redirect} from 'react-router-dom'

class LoginForm extends Component {
    constructor() {
        super();
        this.state = {
          pwd: "",
          email: "",
          isValidated: false
        };
    }

    handleLogin = (e) => {
        e.preventDefault();
        (async () => {
            const res = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.pwd
                })
            });
            let content = await res.json();
            console.log(content)
            if(content.status === "Incorrect Login Details") alert("INCORRECT EMAIL OR PASSWORD!!")
            else { 
                localStorage.setItem('user', content.username)
                this.setState({isValidated: true})
            }
        })();

    }
    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    render() {
        if(this.state.isValidated)
            return <Redirect push to="/home"/>;

        return (
            <Form className="welcome" onSubmit={this.handleLogin}>
                <Form.Control id="email" type="email" name="email" className = "paddedFormControl" placeholder="Enter your email..." onChange={this.handleChange}/>
                <Form.Control id="pwd" type="password" name="pwd" className = "paddedFormControl" placeholder="Enter your password..." onChange={this.handleChange}/>
                <button type="submit" className = "paddedFormControl">Login</button>
            </Form>
        );
    }
}

export default LoginForm;