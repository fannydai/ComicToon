import { CREATESERIES, CREATECOMIC, UPLOAD, VIEWCOMIC, VIEWSERIES } from './../Actions/Types';

const initState = {
    User_Serieses: [],
    User_Comics: [],
    User_Uploads: [],
    User_Comic_Views: [],
    User_Series_Views: []
}

export default function(state = initState, action) {
    switch(action.type) {
        case CREATESERIES:
            return {
                //todo
            };
        case CREATECOMIC:
            return {
                //todo
            };
        case UPLOAD:
            return {
                //todo
            };
        case VIEWCOMIC:
            return {
                //todo
            };
        case VIEWSERIES:
            return {
                //todo
            };
        default:
            return state;
    }
}