import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import {Provider} from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPaperPlane, faCloudUploadAlt, faChevronRight, faHistory, faThumbsUp as solidUp, faThumbsDown as solidDown, faTh, faUndo, faRedo, faSearchMinus, faSearchPlus, faSearch, faClone, faCut, 
    faPaste, faAngleRight, faAngleDoubleRight, faAngleLeft, faAngleDoubleLeft, faDownload, faCheck, faObjectGroup, faObjectUngroup,
    faPencilAlt, faFont, faDrawPolygon, faSlash, faCircle, faSquare, faPlay, faImage,
    faEyeDropper, faArrowsAlt, faTrash, faFill, faPalette, faEraser, faCloud, faDotCircle,
    faChevronLeft,faPaintBrush, faHandPointer,
    faItalic, faBold, faUnderline, faStrikethrough, faSubscript, faSuperscript, faAlignLeft, faAlignRight, faAlignCenter, faHighlighter
} from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import CreateSeries from './Components/CreateSeries';
import UploadComic from './Components/UploadComic';
import ViewAllComics from './Components/ViewAllComics';
import ViewAllSeries from './Components/ViewAllSeries';
import CreateComic from './Components/CreateComic';
import Error404 from './Components/Error404';
import HomeContent from './Components/HomeContent'
import Verify from './Components/Verify';
import Admin from './Components/Admin';
import About from './Components/About';
import UpdateComic from './Components/UpdateComic';
import UpdateSeries from './Components/UpdateSeries';
import Canvas from './Components/Canvas';
import ViewComic from './Components/ViewComic'
import ViewSeries from './Components/ViewSeries';
import store from './Components/Store';
import Search from './Components/Search'
import UserDashboard from './Components/UserDashboard'
import ReportComponent from './Components/ReportComponent';
import Messages from './Components/Messages';
import SharedComics from './Components/SharedComics';

library.add(faPaperPlane, faCloudUploadAlt, faChevronRight, faHistory, faThumbsUp, solidUp, faThumbsDown, solidDown, faTh, faUndo, faRedo, faSearchMinus, faSearchPlus, faSearch, faClone, faCut, 
    faPaste, faAngleRight, faAngleDoubleRight, faAngleLeft, faAngleDoubleLeft, faDownload, faCheck, faObjectGroup, faObjectUngroup,
    faPencilAlt, faFont, faDrawPolygon, faSlash, faCircle, faSquare, faPlay, faImage,
    faEyeDropper, faArrowsAlt, faTrash, faFill, faPalette, faEraser, faCloud, faDotCircle,
    faChevronLeft,faPaintBrush, faHandPointer,
    faItalic, faBold, faUnderline, faStrikethrough, faSubscript, faSuperscript, faAlignLeft, faAlignRight, faAlignCenter, faHighlighter);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/admin" component={Admin} />
                <Route exact path="/welcome" component={App} />
                <Route exact path="/create/series" component={CreateSeries} />
                <Route exact path="/create/comic" component={CreateComic} />
                <Route exact path="/view/comics" component={ViewAllComics} />
                <Route exact path="/view/series" component={ViewAllSeries} />
                <Route exact path="/upload" component={UploadComic} />
                <Route exact path="/home" component={HomeContent} />
                <Route exact path="/verify" component={Verify} />
                <Route exact path="/logout" component={App} />    
                <Route exact path="/about" component={About} />
                <Route exact path="/canvas" component={Canvas} />  
                <Route path="/view/comic/:username/:comicName" component={ViewComic} />  
                <Route exact path="/view/series/:username/:seriesName" component={ViewSeries} />
                <Route exact path="/update/comic/:username/:seriesName/:comicName" component={UpdateComic} />
                <Route exact path="/update/series/:username/:seriesName" component={UpdateSeries} />
                <Route exact path="/search" component={Search} />
                <Route exact path="/dashboard" component={UserDashboard} />
                <Route exact path="/report" component={ReportComponent} />
                <Route exact path="/messages" component={Messages} />
                <Route exact path="/sharedComics" component={SharedComics} />
                <Redirect from="/" exact to="/welcome"/>
                <Route path="*" component={Error404} />
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
