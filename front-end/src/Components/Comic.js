import React, { Component } from 'react';
import NavigationBar from './NavigationBar';
import {Image} from 'react-bootstrap';
import './styles/Comic.css';


function Comic(props){
    return(
        <Image className="home-content-img" src={props.src}/>
    )
}


export default Comic;