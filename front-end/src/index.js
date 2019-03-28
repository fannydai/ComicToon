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

library.add(faChevronLeft, faChevronRight, faCloudUploadAlt);

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={App} />
            <Route path="/create/series" component={CreateSeries} />
            <Route path="/upload" component={UploadComic} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
