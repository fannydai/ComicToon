import { GET_SUBSCRIPTIONS, GET_RECENT_CREATIONS, GET_FAVORITES, ADD_PANEL, SAVE_NEW_COMIC_DATA, GET_ALL_SERIES } from './../Actions/Types';

const initState = {
    subscriptions: [],
    recentCreations: [],
    favorites: [],
    newComic: [],
    saveNewComic: {},
    allSeries: []
}

export default function(state = initState, action) {
    switch(action.type) {
        case GET_SUBSCRIPTIONS:
            return {
                subscriptions: action.payload.subscriptions,
                recentCreations: state.recentCreations,
                favorites: state.favorites,
                newComic: state.newComic,
                saveNewComic: state.saveNewComic,
                allSeries: state.allSeries
            };
        case GET_RECENT_CREATIONS:
            return {
                subscriptions: state.subscriptions,
                recentCreations: action.payload.recentCreations,
                favorites: state.favorites,
                newComic: state.newComic,
                saveNewComic: state.saveNewComic,
                allSeries: state.allSeries
            };
        case GET_FAVORITES:
            return {
                subscriptions: state.subscriptions,
                recentCreations: state.recentCreations,
                favorites: action.payload.favorites,
                newComic: state.newComic,
                saveNewComic: state.saveNewComic,
                allSeries: state.allSeries
            };
        case ADD_PANEL:
            console.log(action.payload);
            return {
                subscriptions: state.subscriptions,
                recentCreations: state.recentCreations,
                favorites: state.favorites,
                newComic: [...state.newComic, action.payload],
                saveNewComic: state.saveNewComic,
                allSeries: state.allSeries
            }
        case SAVE_NEW_COMIC_DATA:
            return {
                subscriptions: state.subscriptions,
                recentCreations: state.recentCreations,
                favorites: state.favorites,
                newComic: state.newComic,
                saveNewComic: action.payload.saveNewComic,
                allSeries: state.allSeries
            }
        case GET_ALL_SERIES:
            return {
                subscriptions: state.subscriptions,
                recentCreations: state.recentCreations,
                favorites: state.favorites,
                newComic: state.newComic,
                saveNewComic: state.saveNewComic,
                allSeries: action.payload.allSeries
            }
        default:
            return state;
    }
}