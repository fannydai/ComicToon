import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import ComicSharingTable from './ComicSharingTable';
import './styles/CreateSeries.css';
import { createSeries} from './../Actions/NavbarActions';
import { getAllSeries } from './../Actions/ComicActions';
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
            this.props.createSeries(localStorage.getItem('user'), this.state.seriesName, this.state.seriesDes, this.state.genreList, "Private")
            // this.setState({genreList: []});
            this.props.history.push(`/view/series/${localStorage.getItem('user')}/${this.state.seriesName}`, { previous: 'create' });
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
                        <Form.Control className="create-series-form-control" name="seriesName" type="text" placeholder="Type Series Name..." onChange={this.handleChange} />
                        <br />
                        <Form.Control className="create-series-description-input" as="textarea" rows="3"  placeholder="Write a description of the series" value={this.state.seriesDes} onChange={this.handleSeriesDescription} />
                        <br />
                        <div className="create-series-genre-input">
                            <div className="create-series-table-container">
                                <h2>Genre: </h2>
                                <div className="list-genre"><ComicSharingTable usernames={this.state.genreList} handleDeleteShare={this.handleDeleteShare} /></div>
                            </div>
                            <div className="create-series-genre-right">
                                <Form.Control type="text" name="genre" placeholder="Press 'Enter' to Add Genre (ex. #horror)" value={this.state.genre} onChange={this.handleChange} onKeyPress={this.handleAddUserEnter}/>
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
    getAllSeries: PropTypes.func.isRequired,
    UserSeries: PropTypes.string,
    CurrUser: PropTypes.object
}

export default connect(StateToProps, {createSeries, getAllSeries})(withRouter(CreateSeries));