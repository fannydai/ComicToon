import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import {withRouter} from 'react-router-dom'
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import './styles/Welcome.css';

class ReportComponent extends Component {
    constructor(){
        super()
        this.state = {
            reason: ""
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleRequest = (e) => {
        e.preventDefault()
        console.log(this.state.toDeactivate)  
    }

    handleReport = (e) => {
        e.preventDefault();
        console.log(this.state.reason)
        if(this.state.reason === ""){
            alert("You MUST give a reason for your report!");
        }
        else{
            (async () => {
                const res = await fetch("http://localhost:8080/report", {
                    method: "POST",
                    headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        type: this.props.history.location.state.type,
                        reportedID: this.props.history.location.state.reportedID,
                        reportingID: this.props.history.location.state.reportingID,
                        reason: this.state.reason
                    })
                });
                let content = await res.json();
                if (content.status === "success") {alert("Reported!!");}
                else{ alert("you already reported this item.. wait for it to be resolved")}
            })(); 
            
        }
    }

    render() {
        return (
            <div>
                <NavigationBar />
                <h1> Report Page </h1>
                <Form className="welcome" onSubmit={this.handleReport}>
                <p>Report Type: </p>
                <div className="bubbletext">
                    <Form.Control value={this.props.history.location.state.type} className ="paddedFormControl textbox" readOnly/>
                </div>
                <br />
                <p>The Reporter: </p>
                <div className="bubbletext">
                    <Form.Control value={this.props.history.location.state.reportingID} className ="paddedFormControl textbox" readOnly/>
                </div>
                <br />
                <p>Reported ID: </p>
                <div className="bubbletext">
                    <Form.Control value={this.props.history.location.state.reportedID} className ="paddedFormControl textbox" readOnly/>
                </div>
                <br />
                <p>Reason: </p>
                <div className="bubbletext">
                    <Form.Control name="reason" placeholder="what's the reason for your report?" className ="paddedFormControl textbox"  onChange={this.handleChange}/>
                </div>
                <Button type="submit" variant="danger">Submit Report</Button>
                </Form>
                <Footer />
            </div>
        );
    }
}

export default withRouter(ReportComponent);