import {combineReducers} from 'redux';
import userReducer from './UserReducer';
import comicReducer from './ComicReducer';

export default combineReducers({
    user: userReducer,
    comic: comicReducer
});