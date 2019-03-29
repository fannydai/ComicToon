import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
//import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft, faChevronRight, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import CreateSeries from './Components/CreateSeries';
import UploadComic from './Components/UploadComic';
import ViewAllComics from './Components/ViewAllComics';
import ViewAllSeries from './Components/ViewAllSeries';
import CreateComic from './Components/CreateComic';

library.add(faChevronLeft, faChevronRight, faCloudUploadAlt);

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={App} />
            <Route exact path="/create/series" component={CreateSeries} />
            <Route exact path="/create/comic" component={CreateComic} />
            <Route path="/upload" component={UploadComic} />
            <Route exact path="/view/comics" component={ViewAllComics} />
            <Route exact path="/view/series" component={ViewAllSeries} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
