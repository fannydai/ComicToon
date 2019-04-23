import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
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
            username: ""
        }
        
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.email === "" || this.state.pwNew === "" || this.state.userInputKey === "" || this.state.username === ""){
            alert("No Fields Can Be Empty!!")
        }
        else{
            if(this.state.key !== this.state.userInputKey){
                alert("Wrong Key!!")
            }
            else{
                (async () => {
                    const res = await fetch("http://localhost:8080/forgotChangePassword", {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json; charset=utf-8"
                        },
                        body: JSON.stringify({
                            username: this.state.username,
                            password: this.state.password
                        })
                    });
                    let content = await res.json();
                    console.log(content)
                    if(content.result === "success"){alert("Successfully Changed Password!!")}
                    else{alert("YOU AREN'T REGISTERED YET")}
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
            alert("Email Can't Be Empty!!")
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
                this.setState({key: content.key})
            })();
        } 
    }

    render() {
        return (
            <div className="Forgot-container">
                <Form className="welcome" onSubmit={this.handleSubmit}>
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