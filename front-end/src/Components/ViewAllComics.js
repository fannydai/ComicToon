import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

import NavigationBar from './NavigationBar';
import Footer from './Footer';
import './styles/ViewAllComics.css';
import pusheen from './images/pusheen.png';
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user
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
        if (!localStorage.getItem('user')) {
            this.props.history.push('/welcome');
        }
        (async () => {
            const res = await fetch("http://localhost:8080/view/allComics", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    comicOwnerName: localStorage.getItem('user')
                  })
            });
            let content = await res.json();
            console.log(content)
            this.setState({allComics: content.bundleComicList, isLoading: false})
        })();
    }
    
    renderOne(panelList){
        return (
            panelList.map(item=> {
                return item !== null ?
                <div key={item.id}>
                    <img src={item.image} alt="can't load"></img>
                </div>
                :
                null
            })
        )
    }
    handleDel = (e) => {
        console.log(e.target.name);
        console.log(this.props.CurrUser.username);
        e.persist();
        (async () => {
            fetch("http://localhost:8080/delete/comic", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({ comicName: e.target.name, ownerName: localStorage.getItem('user')})
            });
        })();
        alert(`Comic deleted!!`)
        let newArr = this.state.allComics.filter(item => item.comicId !== e.target.name);
        this.setState({allComics: newArr}, this.forceUpdate());
    }

    renderAll(){
        console.log(this.state.allComics)
        if(this.state.allComics != null && this.state.allComics.length !== 0)
            return (
                this.state.allComics.map(item=> {
                    return item !== null ?
                    <div key={item.comicName}>
                        <button onClick={this.handleDel} name={item.comicName}>Delete?</button>
                        {this.renderOne(item.comicList)}
                        <hr/>
                    </div>
                    :
                    null
                })
            )
        else{
            return(
                <h2>NO COMICS FOR THIS USER YET</h2>
            )
        }
    }

    handleClick() {
        this.props.history.push('/view/comic');
    }

    handleUpdate() {
        this.props.history.push('/update/comic');
    }

    render() {
        if(this.state.isLoading) return( <h1> Loading...</h1>)
        else{
            return (
                <div className="view-comics-container">
                    <NavigationBar />
                    <div className="view-comics-top">
                        <h1>My Comics</h1>
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
    CurrUser: PropTypes.object
}

export default connect(StateToProps, {})(withRouter(ViewAllComics));