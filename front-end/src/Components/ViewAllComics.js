import React, { Component } from 'react';

import NavigationBar from './NavigationBar';
import Footer from './Footer';
import './styles/ViewAllComics.css';
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import LoadingScreen from './LoadingScreen';

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user,
    comic: state.comic
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
        console.log(this.props.comic);
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
            panelList.map((item, i)=> {
                return item !== null ?
                <div className="view-comics-panel-container" key={item.id}>
                    <img className="view-comics-panel-img" src={item.image} alt="can't load"></img>
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
        // <button onClick={this.handleDel} name={item.comicName}>Delete?</button>
        console.log(this.state.allComics)
        if(this.state.allComics != null && this.state.allComics.length !== 0)
            return (
                this.state.allComics.map((item, i)=> {
                    return item !== null ?
                    <div className="view-comics-strip-container" key={item.comicName}>
                        <div className="view-comics-strip-top">
                            <h3>{item.comicName}</h3>
                            <button onClick={(e) => this.handleUpdate(item, e)}>Update</button>
                        </div>
                        <div className="view-comics-strip-bottom" onClick={(e) => this.handleClick(item, e)}>
                            {this.renderOne(item.comicList)}
                        </div>
                        <hr style={{ height: "1vh", width: "100%" }} />
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

    handleClick = (item, event) => {
        console.log(item);
        this.props.history.push(`/view/comic/${localStorage.getItem('user')}/${item.comicName}`);
    }

    handleUpdate(item, event) {
        this.props.history.push(`/update/comic/${localStorage.getItem('user')}/${item.comicName}`);
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
    CurrUser: PropTypes.object,
    comic: PropTypes.object
}

export default connect(StateToProps, {})(withRouter(ViewAllComics));