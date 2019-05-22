import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Alert, Button, Form, Table } from 'react-bootstrap';

import NavigationBar from './NavigationBar';
import Footer from './Footer';
import './styles/CreateSeries.css';
import { getAllSeries } from './../Actions/ComicActions';


const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user,
    comic: state.comic
});
class UpdateSeries extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            seriesName: this.props.match.params.seriesName,
            seriesDescription: '',
            genre: '',
            genreList: [],
            addUser: '',
            addUserList: [],
            privacy: 'Private'
        }
    }

    componentWillMount() {
        if(this.props.CurrUser.username === "" || this.props.CurrUser.token === "" || this.props.CurrUser.email === "" || this.props.CurrUser.isValidated === false){
            this.state.removeItem("state");
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        console.log('UPDATE SERIES INFO');
        console.log(this.props.location.state);
        console.log(this.state.seriesName);
        // Load the information if needed
        if (this.props.CurrUser.username !== this.props.match.params.username) {
            this.props.history.push('/');
        }
        else if (!this.props.location.state) {
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
                } else {
                    (async () => {
                        const res = await fetch("http://localhost:8080/view/series", {
                            method: "POST",
                            headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json; charset=utf-8"
                            },
                            body: JSON.stringify({
                            username: this.props.match.params.username
                            })
                        });
                        let content = await res.json();
                        console.log(content);
                        if (content) {
                            for (const series of content.comicSeries) {
                                if (series && series.name === this.props.match.params.seriesName) {
                                    this.setState({ id: series.id, seriesDescription: series.description, genreList: series.genre, addUserList: series.sharedWith, privacy: series.privacy });
                                    break;
                                }
                            }
                        }
                    })();
                }
            })(); 
        } else {
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
                } else {
                    this.setState({ id: this.props.location.state.id, genreList: this.props.location.state.genre, 
                        addUserList: this.props.location.state.addUserList, privacy: this.props.location.state.privacy, 
                        seriesDescription: this.props.location.state.description });
                }
            })(); 
        }
    }

    renderGenre() {
        return this.state.genreList.map((genre, i) => {
            return <tr key={i}><td>{genre}</td><td><button className="btn-danger" onClick={(e) => this.handleDeleteGenre(i, e)}>Delete</button></td></tr>
        });
    }

    renderAddUserEnter() {
        return this.state.addUserList.map((user, i) => {
            return <tr key={i}><td>{user}</td><td><button className="btn-danger" onClick={(e) => this.handleDeleteUser(i, e)}>Delete</button></td></tr>
        });
    }

    handleDeleteGenre = (index, event) => {
        event.preventDefault();
        var copy = [...this.state.genreList];
        if (index !== -1) {
            copy.splice(index, 1);
            this.setState({ genreList: copy });
        }
    }

    handleDeleteUser = (index, event) => {
        event.preventDefault();
        var copy = [...this.state.addUserList];
        if (index !== -1) {
            copy.splice(index, 1);
            this.setState({ addUserList: copy });
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleAddGenreEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            let newGenres = this.state.genre.split(' ');
            newGenres = newGenres.filter(item => item !== "")
            this.setState({ genreList: [...this.state.genreList, ...newGenres], genre: '' }); 
        }
    }

    handleDelete = (event) => {
        event.preventDefault();
        (async () => {
            const res = await fetch("http://localhost:8080/delete/series", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
              },
              body: JSON.stringify({
                seriesName: this.props.match.params.seriesName,
                ownerName: this.props.CurrUser.token
              })
            });
            let content = await res.json();
            console.log(content);
            if (content.result === 'failure') {
                this.setState({ error: "Could not delete series." });
            } else {
                console.log('DELETED');
                (async () => {
                    const res = await fetch("http://localhost:8080/view/series", {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                      },
                      body: JSON.stringify({
                        username: this.props.CurrUser.token
                      })
                    });
                    let content = await res.json();
                    console.log(content);
                    if (content.comicSeries) {
                        this.props.getAllSeries(content.comicSeries);
                    }
                })();
                this.props.history.push('/view/series');
            }
        })();
    }

    handleUpdate = (event) => {
        event.preventDefault();
        console.log(this.state);
        (async () => {
            const res = await fetch("http://localhost:8080/update/series", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
              },
              body: JSON.stringify({
                seriesID: this.state.id,
                new_Name: this.state.seriesName,
                new_Description: this.state.seriesDescription,
                new_Genres: this.state.genreList,
                new_SharedWith: this.state.addUserList,
                new_Privacy: this.state.privacy
              })
            });
            let content = await res.json();
            console.log(content);
            if (content.result === 'success') {
                this.props.history.push('/view/series', { previous: 'update' });
            }
        })();
        //this.props.history.push('/view/series');
    }

    render() {
        return (
            <div className="create-series-container">
                 <NavigationBar />
                <Form className="create-form" onSubmit={this.handleUpdate}>
                    <Form.Control required className="create-series-form-control" type="text" placeholder="Type Series Name..." name="seriesName" value={this.state.seriesName} onChange={this.handleChange} />
                    <Form.Control required className="create-series-description-input" as="textarea" rows="3"  placeholder="Write a description of the series" name="seriesDescription" value={this.state.seriesDescription} onChange={this.handleChange} />
                    <div style={{ marginBottom: "1vh" }}>
                        <Form.Check required type="radio" name="privacy" value="Public" label="Public" checked={this.state.privacy === 'Public'} onChange={this.handleChange} />
                        <Form.Check type="radio" name="privacy" value="Private" label="Private" checked={this.state.privacy === 'Private'} onChange={this.handleChange} />
                    </div>
                    <div className="update-series-genre-input">
                        <div className="update-series-table-container">
                            <Form.Control type="text" placeholder="Press 'Enter' to Add Genre (ex. #horror)" name="genre" value={this.state.genre} onChange={this.handleChange} onKeyPress={this.handleAddGenreEnter} style={{ marginBottom: "1vh" }} />
                            <Table bordered hover className="update-series-genre-table">
                                <tbody>
                                    {this.renderGenre()}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    {this.state.error ? <Alert variant="danger" >{this.state.error}</Alert> : <Alert variant="danger" style={{ visibility: "hidden" }}>Hi</Alert>}
                    <div className="create-series-bottom">
                        <Button type="submit" variant="primary">Update Series</Button>
                        <Button onClick={this.handleDelete} variant="danger">Delete Series</Button>
                    </div>
                </Form>
                <Footer />
            </div>
        );
    }
}

UpdateSeries.propTypes = {
    getAllSeries: PropTypes.func.isRequired,
    comic: PropTypes.object,
    CurrUser: PropTypes.object
}

export default connect(StateToProps, { getAllSeries })(withRouter(UpdateSeries));