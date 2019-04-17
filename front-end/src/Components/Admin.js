import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import './styles/Admin.css';

class Admin extends Component {
    constructor(){
        super()
        this.state = {
            toDeactivate: ""
            //add more
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
    render() {
        return (
            <div>
                <div className="de-active">
                    <Form className="search-deactivate" onSubmit={this.handleRequest}>
                        <Form.Control name="toDeactivate" type="text" placeholder="Enter a username to deactive..." />
                        <Button type="submit" variant="primary">Search!</Button>
                    </Form>
                </div>
                <div className="del-series">
                    {/* suggested series of users will appear here*/}
                </div>
                <div className="del-comics">
                    {/* suggested comics of users will appear here*/}
                </div>
                <div className="del-comments">
                    {/* suggested comments of users will appear here*/}
                </div>
            </div>
        );
    }
}

export default Admin;