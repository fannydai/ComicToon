import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { Button, Dropdown, Form } from 'react-bootstrap';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavigationBar from './NavigationBar';
import './styles/CreateComic.css';
import shoes1 from './images/shoes-1.png';
import shoes2 from './images/shoes-2.png';
import shoes3 from './images/shoes-3.png';

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user,
    comic: state.comic
});
class UpdateComic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comicData: {},
            comicName: this.props.match.params.comicName,
            addUsers: '',
            addUsersList: [],
            series: []
        }
    }

    componentDidMount() {
        (async () => {
            // Need to fetch panel data
            const res = await fetch('http://localhost:8080/view/comic', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    comicName: this.props.match.params.comicName,
                    comicOwnerName: this.props.match.params.username
                })
            });
            let content = await res.json();
            console.log(content);
            if (content.comicName) {
                this.setState({ comicData: content });
            } else {
                alert('Could not find comic');
                this.props.history.goBack();
            }
        })();
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
            this.setState({ series: content.comicSeries })
        })();
    }    

    handleLeft = (event) => {

    }

    handleRight = (event) => {

    }

    handleComicName = (event) => {
        this.setState({ comicName: event.target.value })
    }

    renderUserSeries(){
        return (
            this.state.series.map(item=> {
                return item !== null ?
                <div key={item.name}>
                    <Dropdown.Item name={item.name}onClick={this.handleChange}>{item.name}</Dropdown.Item>
                </div>
                :
                null
            })
        )
    }

    handleNavigateCanvas = (event) => {
        this.props.history.push('/canvas');
    }

    handleSubmit = (event) => {

    }
    
    handleDelete = (event) => {
        console.log(this.props.match.params.comicName);
        console.log(this.props.match.params.username);
        (async () => {
            const res = await fetch('http://localhost:8080/delete/comic', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    comicName: this.props.match.params.comicName,
                    ownerName: this.props.match.params.username
                })
            });
            let content = res.json();
            console.log(content);
            if (content.result === 'failed') {
                alert('Could not delete comic');
            } else {
                this.props.history.push('/view/comics');
            }
        })();
    }

    handleChange = e => {
        console.log(e.target)
        const { name } = e.target;
        this.setState({ selected_series: name });
        alert(`Series '${name} Selected!'`)
    }

    render() {
        return (
            <div className="create-comic-container">
                <NavigationBar />
                <div className="create-comic-bottom">
                    <Form className="create-comic-form">
                        <div className="create-comic-panel-container">
                            <div className="create-comic-panel-left">
                                <FontAwesomeIcon icon="chevron-left" size="2x" onClick={this.handleLeft} />
                            </div>
                            <div className="create-comic-panel-middle">
                                <div className="create-comic-panel-inner">
                                    <img className="create-comic-img" src={shoes1} alt="" />
                                </div>
                                <div className="create-comic-panel-inner">
                                    <img className="create-comic-img" src={shoes2} alt="" />
                                </div>
                                <div className="create-comic-panel-inner">
                                    <img className="create-comic-img" src={shoes3} alt="" />
                                </div>
                                <div className="create-comic-panel-plus">
                                    <FontAwesomeIcon icon="plus" size="2x" onClick={this.handleNavigateCanvas} />
                                </div>
                            </div>
                            <div className="create-comic-panel-right">
                                <FontAwesomeIcon icon="chevron-right" size="2x" onClick={this.handleRight} />
                            </div>
                        </div>
                        <div className="create-comic-info">
                            <Form.Control className="create-comic-name-input" type="text" value={this.state.comicName} placeholder="Type Comic Name..." onChange={this.handleComicName} />
                            <Dropdown className="create-comic-dropdown">
                                <Dropdown.Toggle variant="outline-info">
                                    Select Series
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {this.renderUserSeries()}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="create-comic-sharing">
                            <div className="create-comic-sharing-inner">
                                <div className="create-comic-sharing-left">
                                    <table className="create-comic-sharing-table">
                                        <tbody>
                                            <tr><td>User 1</td></tr>
                                            <tr><td>User 2</td></tr>
                                            <tr><td>User 3</td></tr>
                                            <tr><td>User 4</td></tr>
                                            <tr><td>UserWithALongUsernameThatDoes'tFit</td></tr>
                                            <tr><td>User 6</td></tr>
                                            <tr><td>User 7</td></tr>
                                            <tr><td>User 8</td></tr>
                                            <tr><td>User 9</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="create-comic-sharing-right">
                                    <Form.Control type="text" placeholder="Add User..." />
                                    <Button type="submit" variant="success">Add</Button>
                                    <Form.Check type="radio" name="privacy" label="Public" defaultChecked />
                                    <Form.Check type="radio" name="privacy" label="Private" />
                                </div>
                            </div>
                        </div>
                        <div className="update-comic-submit">
                            <Button type="submit" variant="success" onClick={this.handleSubmit}>Update Comic</Button>
                            <Button type="submit" variant="danger" onClick={this.handleDelete}>Delete Comic</Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

UpdateComic.propTypes = {
    CurrUser: PropTypes.object,
    comic: PropTypes.object
}

export default connect(StateToProps, {})(withRouter(UpdateComic));