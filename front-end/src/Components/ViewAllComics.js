import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import NavigationBar from './NavigationBar';
import Footer from './Footer';
import './styles/ViewAllComics.css';
import {withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingScreen from './LoadingScreen';

import { viewAllComics } from './../Actions/NavbarActions';

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user,
    nav: state.NavBar,
});

class ViewAllComics extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.state = {
            allComics: null,
            isLoading: true
        }
    }

    componentDidMount(){
        console.log(this.props.nav);
        if (!this.props.CurrUser.token) {
            this.props.history.push('/welcome');
        }
         else {
            (async () => {
                const res = await fetch("http://localhost:8080/view/allComics", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        token: this.props.CurrUser.token,
                        comicOwnerName: this.props.CurrUser.username
                    })
                });
                let content = await res.json();
                console.log(content)
                if (content.result === "success") {
                    this.setState({allComics: content.bundleComicList, isLoading: false})
                } else {
                    localStorage.removeItem("state");
                    this.props.history.push("/");
                }
            })();
        }
    }
    
    renderOne(panelList, comicIndex){
        return (
            panelList.map((item, i)=> {
                return item !== null ?
                <div className="view-comics-panel-container" key={item.id} onClick={(e) => this.handlePanelClick(item, i, comicIndex, e)}>
                    <img className="view-comics-panel-img" src={item.image} alt="can't load"></img>
                </div>
                :
                null
            })
        )
    }
    handleDel = (e) => {
        e.persist();
        (async () => {
            fetch("http://localhost:8080/delete/comic", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({ comicName: e.target.name, ownerName: this.props.CurrUser.token})
            });
        })();
        alert(`Comic deleted!!`)
        let newArr = this.state.allComics.filter(item => item.comicId !== e.target.name);
        this.setState({allComics: newArr}, this.forceUpdate());
    }

    handlePanelClick = (item, index, comicIndex, event) => {
        console.log(this.props.comic);
        console.log(item);
        console.log(index);
        console.log(event);
        event.preventDefault();
        // Save the comics
        if (this.state.allComics) {
            this.props.viewAllComics(this.state.allComics);
        }
        // Editing from JSON
        if (!item.image) {
            this.props.history.push('/canvas', { previous: "fromjson", panel: item, panelIndex: index, comicIndex: comicIndex });
        }
    }

    renderAll(){
        // <button onClick={this.handleDel} name={item.comicName}>Delete?</button>
        console.log(this.state.allComics)
        if(this.state.allComics != null && this.state.allComics.length !== 0)
            return (
                this.state.allComics.map((item, i)=> {
                    return item !== null ?
                    <div className="view-comics-strip-container" key={item.comicName}>
                        <div className="view-comics-strip-top">
                            <h3 className="view-comics-h3" onClick={(e) => this.handleClick(item, e)}>{item.comicName}</h3>
                            <Button onClick={(e) => this.handleUpdate(item, e)}>Update</Button>
                        </div>
                        <div className="view-comics-strip-bottom">
                            {this.renderOne(item.comicList, i)}
                        </div>
                        <hr style={{ height: "1vh", width: "100%" }} />
                    </div>
                    :
                    null
                })
            )
        else{
            return(
                <h2>CREATE A <a href="/create/series">SERIES</a> THEN A <a href="/create/comic">COMIC</a></h2>
            )
        }
    }

    handleClick = (item, event) => {
        console.log(item);
        this.props.history.push(`/view/comic/${this.props.CurrUser.username}/${item.comicName}`);
    }

    handleUpdate(item, event) {
        this.props.history.push(`/update/comic/${this.props.CurrUser.username}/${item.comicName}`);
    }

    render() {
        if(this.state.isLoading) {
            return <LoadingScreen />
        }
        else{
            return (
                <div className="view-comics-container">
                    <NavigationBar />
                    <div className="view-comics-top">
                        <h1 className = "hometext">My Comics</h1>
                    </div>
                    <div className="view-comics-bottom">
                        {this.renderAll()}
                    </div>
                    <Footer />
                </div>
            );
        }
    }
}

ViewAllComics.propTypes = {
    CurrUser: PropTypes.object,
    nav: PropTypes.object
}

export default connect(StateToProps, { viewAllComics })(withRouter(ViewAllComics));