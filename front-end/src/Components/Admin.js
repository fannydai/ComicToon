import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import './styles/Admin.css';
import {withRouter} from 'react-router-dom'
import NavigationBar from './NavigationBar';
import Footer from './Footer';

class Admin extends Component {
    constructor(){
        super()
        this.state = {
            toDeactivate: ""
            //add more
        }
    }

    componentDidMount(){
        //fill page with reported users, comics, series, and comments
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
                <NavigationBar />
                <h1> ADMIN WELCOME </h1>
                <div className="de-active">
                    {/* suggested users will appear here*/}
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
                <Footer />
            </div>
        );
    }
}

export default withRouter(Admin);