import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft, faChevronRight, faCloudUploadAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import CreateSeries from './Components/CreateSeries';
import UploadComic from './Components/UploadComic';
import ViewAllComics from './Components/ViewAllComics';
import ViewAllSeries from './Components/ViewAllSeries';
import CreateComic from './Components/CreateComic';
import Error404 from './Components/Error404';
import HomeContent from './Components/HomeContent'
import Verify from './Components/Verify';
import Logout from './Components/Logout';
import Admin from './Components/Admin';
import About from './Components/About';
import UpdateComic from './Components/UpdateComic';
import Canvas from './Components/Canvas';
import ViewSubs from './Components/ViewSubscriptions';
import ViewRecents from './Components/ViewRecents';
import ViewComic from './Components/ViewComic'

library.add(faChevronLeft, faChevronRight, faCloudUploadAlt, faPlus);

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/welcome" component={App} />
            <Route exact path="/create/series" component={CreateSeries} />
            <Route exact path="/create/comic" component={CreateComic} />
            <Route exact path="/view/comics" component={ViewAllComics} />
            <Route exact path="/view/series" component={ViewAllSeries} />
            <Route exact path="/upload" component={UploadComic} />
            <Route exact path="/home" component={HomeContent} />
            <Route exact path="/verify" component={Verify} />
            <Route exact path="/logout" component={Logout} />   
            <Route exact path="/admin" component={Admin} /> 
            <Route exact path="/about" component={About} /> 
            <Route exact path="/update" component={UpdateComic} /> 
            <Route exact path="/canvas" component={Canvas} />  
            <Route exact path="/subscriptions" component={ViewSubs} />
            <Route exact path="/view/comic" component={ViewComic} />  
            <Route exact path="/recents" component={ViewRecents} />
            <Redirect from="/" exact to="/welcome"/>
            <Route path="*" component={Error404} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
