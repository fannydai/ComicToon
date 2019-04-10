import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
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
            seriesDes: ""
        }
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps)
        if(nextProps.UserSeries !== this.props.UserSeries && nextProps.UserSeries !== "" && this.state.genreList != null) alert(`Series "${this.state.seriesName}" Created!!`)
        else alert(`Series "${this.state.seriesName}" NOT Created... Error`) //on error
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.seriesName === '') {
            alert('Please enter a name for the series.');
        } else if (this.state.seriesDes === '') {
            alert('Please enter a description for the series.');
        } else {
            console.log(this.state)
            this.props.createSeries(this.props.CurrUser.username, this.state.seriesName, this.state.description, this.state.genreList, "private")
            this.setState({genreList: []})
            this.props.history.push(`/view/series/${this.props.CurrUser.username}/${this.state.seriesName}`);
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
            this.setState({ genreList: [...this.state.genreList, ...newGenres2] }); 
        }
    }

    handleSeriesDescription = event =>{
        this.setState({ seriesDes: event.target.value });
    }

    render() {
        return (
            <div className="create-series-container">
                 <NavigationBar />
                    <Form className="create-form" onSubmit={this.handleSubmit}>
                        <Form.Control className="form-control" name="seriesName" type="text" placeholder="Type Series Name..." onChange={this.handleChange} />
                        <br />
                        <Form.Control className="create-series-description-input" as="textarea" rows="3"  placeholder="Write a description of the series" value={this.state.seriesDes} onChange={this.handleSeriesDescription} />
                        <br />
                        <div className="create-series-genre-input">
                            <div className="create-series-table-container">
                                <h2>Genre: </h2>
                                <div class="list-genre"><ComicSharingTable usernames={this.state.genreList} /></div>
                            </div>
                            <div className="create-series-genre-right">
                                <Form.Control type="text" name="genre" placeholder="Press 'Enter' to Add Genre (ex. #horror)" onChange={this.handleChange} onKeyPress={this.handleAddUserEnter}/>
                            </div>
                        </div>
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