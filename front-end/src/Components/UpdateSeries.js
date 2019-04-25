import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Button, Form } from 'react-bootstrap';

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

    componentDidMount() {
        console.log('UPDATE SERIES INFO');
        console.log(this.props.location.state);
        console.log(this.state.seriesName);
        // Load the information if needed
        if (!this.props.location.state) {
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
        } else {
            this.setState({ id: this.props.location.state.id, genreList: this.props.location.state.genre, 
                addUserList: this.props.location.state.addUserList, privacy: this.props.location.state.privacy, 
                seriesDescription: this.props.location.state.description });
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

    handleAddUserEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            let newUsers = this.state.addUser.split(' ');
            newUsers = newUsers.filter(item => item !== "")
            this.setState({ addUserList: [...this.state.addUserList, ...newUsers], addUser: '' }); 
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
                alert('Could not delete series.');
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

                 <div className="update-series-bottom-container">
                    <Form className="create-form">
                        <div className="create-series-name-input">
                            <Form.Control className="create-series-name-form-control" type="text" placeholder="Type Series Name..." name="seriesName" value={this.state.seriesName} onChange={this.handleChange} />
                            <Form.Control className="create-series-description-input" as="textarea" rows="3"  placeholder="Write a description of the series" name="seriesDescription" value={this.state.seriesDescription} onChange={this.handleChange} />
                        </div>
                        <Form.Check type="radio" name="privacy" value="Public" label="Public" checked={this.state.privacy === 'Public'} onChange={this.handleChange} />
                        <Form.Check type="radio" name="privacy" value="Private" label="Private" checked={this.state.privacy === 'Private'} onChange={this.handleChange} />
                        <div className="create-series-genre-input">
                            <div className="update-series-table-container">
                                <Form.Control type="text" placeholder="Genre/Tags" name="genre" value={this.state.genre} onChange={this.handleChange} onKeyPress={this.handleAddGenreEnter} />
                                <table className="update-series-genre-table">
                                    <tbody>
                                        {this.renderGenre()}
                                    </tbody>
                                </table>
                            </div>
                            <div className="update-series-table-container">
                                <Form.Control type="text" placeholder="Add User... (ex. Sean Jeffrey Fanny Joel)" name="addUser" value={this.state.addUser} onChange={this.handleChange} onKeyPress={this.handleAddUserEnter} />
                                <table className="update-series-genre-table">
                                    <tbody>
                                        {this.renderAddUserEnter()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="create-series-bottom">
                            <Button onClick={this.handleUpdate} type="submit" variant="primary">Update Series</Button>
                            <Button onClick={this.handleDelete} type="submit" variant="danger">Delete Series</Button>
                        </div>
                    </Form>
                 </div>
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