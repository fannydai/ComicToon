import {combineReducers} from 'redux';
import userReducer from './UserReducer';
import comicReducer from './ComicReducer';
import NavbarReducer from './NavBarReducer';

export default combineReducers({
    user: userReducer,
    comic: comicReducer,
    NavBar: NavbarReducer
});