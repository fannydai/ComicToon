import React, { Component } from 'react';
import NavigationBar from './NavigationBar';
import {Image} from 'react-bootstrap';
import './styles/Comic.css';


function Comic(props){
    return(
        <Image className="home-content-img" src={props.src} style={{width: 400, height: 400}}/>
    )
}


export default Comic;