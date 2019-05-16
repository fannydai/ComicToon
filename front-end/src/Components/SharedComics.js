import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import { Button } from 'react-bootstrap';
import './styles/ViewAllComics.css';
import LoadingScreen from './LoadingScreen';

const StateToProps = (state) => ({ //application level state via redux
    CurrUser: state.user,
    nav: state.NavBar
});

class SharedComics extends Component {
    constructor(props) {
        super(props);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.state = {
            allComics: null,
            isLoading: true
        }
    }

    componentDidMount(){
        if(this.props.CurrUser.username === "" || this.props.CurrUser.token === "" || this.props.CurrUser.email === "" || this.props.CurrUser.isValidated === false){
            localStorage.removeItem("state");
            this.props.history.push('/')
        }
         else {
            (async () => {
                const res = await fetch("http://localhost:8080/getSharedComics", {
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
                <div className="view-comics-panel-container" key={item.id}>
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

    renderAll(){
        // <button onClick={this.handleDel} name={item.comicName}>Delete?</button>
        console.log(this.state.allComics)
        if(this.state.allComics != null && this.state.allComics.length !== 0)
            return (
                this.state.allComics.map((item, i)=> {
                    console.log(item);
                    return item !== null ?
                    <div className="view-comics-strip-container" key={item.comicName}>
                        <div className="view-comics-strip-top">
                            <h3 className="view-comics-h3" >{item.comicName}</h3>
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
                <h2>NO COMICS SHARED WITH YOU YET :(</h2>
            )
        }
    }

    handleUpdate(item, event) {
        this.props.history.push({
            pathname: `/update/comic/${item.username}/${item.comicName}`, 
            state: {
              flag: true 
            }
        })
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
                        <h1 className = "hometext">Comics Shared With Me</h1>
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

export default connect(StateToProps, {})(withRouter(SharedComics));