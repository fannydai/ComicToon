import React, { Component } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import ComicSharingTable from './ComicSharingTable';
import './styles/CreateSeries.css';
import { createSeries} from './../Actions/NavbarActions';
import {withRouter} from 'react-router-dom'

const StateToProps = (state) => ({ //application level state via redux
    UserSeries: state.NavBar.User_Series,
    CurrUser: state.user
});

class CreateSeries extends Component {
    constructor () {
        super()
        this.state = {
            seriesName: "",
            genre : "",
            genreList: [],
            seriesDes: "",
            error: ""
        }
    }

    componentWillMount() {
        if(this.props.CurrUser.username === "" || this.props.CurrUser.token === "" || this.props.CurrUser.email === "" || this.props.CurrUser.isValidated === false){
            this.props.history.push('/');
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if (typeof nextProps.UserSeries === "string") {
            this.setState({ error: nextProps.UserSeries });
        }
    }

    componentDidMount() {
        // Make sure token is correct
        (async () => {
            const res = await fetch("http://localhost:8080/checkToken", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
              },
              body: JSON.stringify({
                token: this.props.CurrUser.token,
                username: this.props.CurrUser.username
              })
            });
            let content = await res.json();
            if (content.result === "tokenerror") {
                localStorage.removeItem("state");
                this.props.history.push("/");
            }
        })(); 
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.seriesName === '') {
            this.setState({ error: "Enter a name for the series." });
        } else if (this.state.seriesDes === '') {
            this.setState({ error: "Enter a description for the series." });
        } else {
            console.log(this.state)
            this.props.createSeries(this.props.CurrUser.token, this.state.seriesName, this.state.seriesDes, this.state.genreList, "Private", this.props.history);
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleAddUserEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            let newGenres = this.state.genre.split(' ');
            let newGenres2 = newGenres.filter(item => item !== "")
            this.setState({ genreList: [...this.state.genreList, ...newGenres2], genre: '' }); 
        }
    }

    handleSeriesDescription = event =>{
        this.setState({ seriesDes: event.target.value });
    }
    
    handleDeleteShare = (index, event) => {
        event.preventDefault();
        var copy = [...this.state.genreList];
        if (index !== -1) {
            copy.splice(index, 1);
            this.setState({ genreList: copy });
        }
    }

    render() {
        return (
            <div className="create-series-container">
                <NavigationBar />
                <Form className="create-form" onSubmit={this.handleSubmit}>
                    <h1>Create Series</h1>
                    <Form.Control required className="create-series-form-control" name="seriesName" type="text" placeholder="Type Series Name..." onChange={this.handleChange} />
                    <Form.Control required className="create-series-description-input" as="textarea" rows="3"  placeholder="Write a description of the series" value={this.state.seriesDes} onChange={this.handleSeriesDescription} />
                    <Form.Control type="text" name="genre" placeholder="Press 'Enter' to Add Genre (ex. #horror)" value={this.state.genre} onChange={this.handleChange} onKeyPress={this.handleAddUserEnter} className="create-series-form-control" />
                    <div className="create-series-genre-input">
                        <h2>Genres </h2>
                        <div className="create-series-table-container">
                            <div className="list-genre"><ComicSharingTable usernames={this.state.genreList} handleDeleteShare={this.handleDeleteShare} /></div>
                        </div>
                    </div>
                    {this.state.error ? <Alert variant="danger" >{this.state.error}</Alert> : <Alert variant="danger" style={{ visibility: "hidden" }}>Hi</Alert>}
                    <div className="create-series-bottom">
                        <Button type="submit" variant="primary">Create Series</Button>
                    </div>
                </Form>
                 <Footer />
            </div>
        );
    }
}

CreateSeries.propTypes = {
    createSeries: PropTypes.func.isRequired,
    UserSeries: PropTypes.string,
    CurrUser: PropTypes.object
}

export default connect(StateToProps, {createSeries})(withRouter(CreateSeries));