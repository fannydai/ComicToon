import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import './styles/VerifyForm.css';
import {withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import { verifyUser } from './../Actions/UserActions';

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user,
});

class Verify extends Component {
    constructor(props) {
        super(props);
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
        console.log(this.state.email);
        console.log(this.state.key);
        (async () => {
            const res = await fetch("http://localhost:8080/verifyAccount", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({ 
                    email: this.state.email,
                    key: this.state.key
                })
            });
            let content = await res.json();
            console.log("VERIFICAION RESULT", content);
            if (content.result === "success") {
                alert("YOU ARE NOW VERIFIED!")
                this.props.verifyUser(true);
                this.props.history.push("/");
            } else {
                alert(content.result);
            }
        })();
    }

    render() {
        return (
            <div className="verify-form-container">
				<div className="verify">
                    <h1>Verify Your Account!</h1>
                    <Form className="verify-form" onSubmit={this.handleRequest}>
                        <Form.Control required name="email" type="email" onChange={this.handleChange} placeholder="Enter your email..." />
                        <Form.Control required name="key" type="key" onChange={this.handleChange} placeholder="Enter the key found in your email... " />
                        <Button type="submit" variant="primary">Verify!</Button>
                    </Form>
				</div>
			</div>
        );
    }
}

export default connect(StateToProps, {verifyUser})(withRouter(Verify));