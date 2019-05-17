import React, { Component } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import {withRouter} from 'react-router-dom'
import './styles/Welcome.css';

class ForgotForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            pwNew: "",
            key: "",
            userInputKey: "",
            username: "",
            error: "",
            info: "",
            success: "",
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.pwNew === "" || this.state.userInputKey === "" || this.state.username === "") {
            this.setState({ error: "Key, username, and new password must be filled in.", info: "", success: "" });
        }
        else {
            if (this.state.key && this.state.key !== this.state.userInputKey) {
                this.setState({ error: "Invalid key.", info: "", success: "" });
            }
            else {
                (async () => {
                    const res = await fetch("http://localhost:8080/forgotChangePassword", {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json; charset=utf-8"
                        },
                        body: JSON.stringify({
                            key: this.state.userInputKey,
                            username: this.state.username,
                            password: this.state.pwNew
                        })
                    });
                    let content = await res.json();
                    console.log(content)
                    if (content.result === "success") {
                        this.setState({ success: "Your password has been changed.", info: "", error: "" });
                    } else{
                        this.setState({ error: content.result, info: "", success: "" });
                    }
                })();
            }
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    sendEmail = () => {
        if(this.state.email === ""){
            this.setState({ error: "Email field cannot be empty.", info: "", success: "" });
        } else if (!/.+@.+\..+/.test(this.state.email)) {
            this.setState({ error: "Invalid email.", info: "", success: "" });
        }
        else{ 
            console.log(this.state.email);
            (async () => {
                const res = await fetch("http://localhost:8080/forgot", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        email: this.state.email
                    })
                });
                let content = await res.json();
                console.log(content)
                this.setState({ key: content.key, info: "Email has been sent.", error: "", success: "" });
            })();
        } 
    }

    render() {
        return (
            <div className="Forgot-container">
                <Form className="welcome" onSubmit={this.handleSubmit}>
                {this.state.success ? <Alert variant="success" >{this.state.success}</Alert> : this.state.error ? <Alert variant="danger" >{this.state.error}</Alert> : this.state.info ?  <Alert variant="info" >{this.state.info}</Alert> : <Alert variant="danger" style={{ visibility: "hidden" }}>Hi</Alert>}
                    <p>First, Enter Your Email to Get The Key!</p>
                    <div className="bubbletext">
                        <Form.Control name="email" type="email" className = "paddedFormControl textbox" placeholder="Enter your email" onChange={this.handleChange}/>
                    </div>
                    <Button onClick={this.sendEmail} className = "paddedFormControl" variant="primary">Get Key Via Email!</Button>
                    <br/>
                    <div className="bubbletext">
                        <Form.Control name="userInputKey" type="password" className = "paddedFormControl textbox" placeholder="Enter the key from your email" onChange={this.handleChange}/>
                        <Form.Control name="username" type="text" className = "paddedFormControl textbox" placeholder="Enter your username" onChange={this.handleChange}/>
                        <Form.Control name="pwNew" type="password" className = "paddedFormControl textbox" placeholder="Enter your new password" onChange={this.handleChange}/>
                    </div>
                    <br />
                    <Button type="submit" className = "paddedFormControl" variant="primary">Submit!</Button>
                </Form>
            </div>
        );
    }
}

export default withRouter(ForgotForm);