import React, { Component } from 'react';
import { Alert, Button, Form, Card } from 'react-bootstrap';
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
            key: "",
            error: ""
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
                this.props.verifyUser(true);
                this.props.history.push("/");
            } else {
                this.setState({ error: content.result });
            }
        })();
    }

    render() {
        return (
            <div className="verify-form-container">
                <Card  style={{ width: '36rem' }}>

                <Card.Body style={{ width: '36rem' }}>
				<div className="verify">
                    <Card.Title style={{ width: '50rem' }}>
                    <h1>Verify Your Account!</h1>
                    </Card.Title>
                    {this.state.error ? <Alert variant="danger" >{this.state.error}</Alert> : <Alert variant="danger" style={{ visibility: "hidden" }}>Hi</Alert>}
                    <Form className="verify-form" onSubmit={this.handleRequest} style={{ width: '20rem' }}>
                        <Form.Control required name="email" type="email" onChange={this.handleChange} placeholder="Enter your account email." />
                        <Form.Control required name="key" type="key" onChange={this.handleChange} placeholder="Enter the key found in the sent email. " />
                        <Button type="submit" variant="primary">Verify!</Button>
                    </Form>
				</div>
                </Card.Body>
                </Card>
			</div>
        );
    }
}

export default connect(StateToProps, {verifyUser})(withRouter(Verify));