import { GET_SUBSCRIPTIONS, GET_RECENT_CREATIONS, GET_FAVORITES, ADD_PANEL, SAVE_NEW_COMIC_DATA, GET_ALL_SERIES, CLEAR_PANELS, SAVE_UPDATE_COMIC_DATA } from './../Actions/Types';

const initState = {
    subscriptions: [],
    recentCreations: [],
    favorites: [],
    newComic: [],
    saveNewComic: {},
    saveUpdateComic: {},
    allSeries: []
}

export default function(state = initState, action) {
    switch(action.type) {
        case GET_SUBSCRIPTIONS:
            return {
                ...state,
                subscriptions: action.payload.subscriptions
            };
        case GET_RECENT_CREATIONS:
            return {
                ...state,
                recentCreations: action.payload.recentCreations
            };
        case GET_FAVORITES:
            return {
                ...state,
                favorites: action.payload.favorites
            };
        case ADD_PANEL:
            console.log(action.payload);
            return {
                ...state,
                newComic: [...state.newComic, action.payload]
            }
        case CLEAR_PANELS:
            return {
                ...state,
                newComic: []
            }
        case SAVE_NEW_COMIC_DATA:
            return {
                ...state,
                saveNewComic: action.payload.saveNewComic
            }
        case SAVE_UPDATE_COMIC_DATA:
            return {
                ...state,
                saveUpdateComic: action.payload.saveUpdateComic
            }
        case GET_ALL_SERIES:
            return {
                ...state,
                allSeries: action.payload.allSeries
            }
        default:
            return state;
    }
}