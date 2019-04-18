import { ERR, CREATESERIES, CREATECOMIC, UPLOAD, VIEWCOMIC, VIEWSERIES, UPDATE_COMIC_PANEL } from './../Actions/Types';

const initState = {
    User_Series: "",
    User_Comic: "",
    User_Upload: "",
    User_Comic_View: [],
    User_Series_View: []
}

export default function(state = initState, action) {
    switch(action.type) {
        case CREATESERIES:
            return {
                User_Comic: state.User_Comic,
                User_Series: action.payload.Series,
                User_Upload: state.User_Upload,
                User_Comic_View: state.User_Comic_View,
                User_Series_View: state.User_Series_View
            };
        case CREATECOMIC:
            return {
                //todo
            };
        case UPLOAD:
            return {
                //todo for milestone 2
            };
        case VIEWCOMIC:
            //View all my comics
            return {
                ...state,
                User_Comic_View: action.payload.comics
            };
        case UPDATE_COMIC_PANEL:
            // console.log(state);
            // console.log(action.payload);
            state.User_Comic_View[action.payload.comicIndex].comicList[action.payload.panelIndex].image = action.payload.image;
            state.User_Comic_View[action.payload.comicIndex].comicList[action.payload.panelIndex].canvas = JSON.stringify(action.payload.canvas);
            // console.log(state);
            return {
                ...state
            }
        case VIEWSERIES:
            return {
                //todo
            };
        case ERR:
            return {
                ...state,
                User_Series: action.payload.Series
            }
        default:
            return state;
    }
}