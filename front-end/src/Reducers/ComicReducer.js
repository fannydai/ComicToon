import { GET_SUBSCRIPTIONS, GET_RECENT_CREATIONS, GET_FAVORITES, ADD_PANEL } from './../Actions/Types';

const initState = {
    subscriptions: [],
    recentCreations: [],
    favorites: [],
    newComic: []
}

export default function(state = initState, action) {
    switch(action.type) {
        case GET_SUBSCRIPTIONS:
            return {
                subscriptions: action.payload.subscriptions,
                recentCreations: state.recentCreations,
                favorites: state.favorites,
                newComic: state.newComic
            };
        case GET_RECENT_CREATIONS:
            return {
                subscriptions: state.subscriptions,
                recentCreations: action.payload.recentCreations,
                favorites: state.favorites,
                newComic: state.newComic
            };
        case GET_FAVORITES:
            return {
                subscriptions: state.subscriptions,
                recentCreations: state.recentCreations,
                favorites: action.payload.favorites,
                newComic: state.newComic
            };
        case ADD_PANEL:
            console.log(action.payload);
            return {
                subscriptions: state.subscriptions,
                recentCreations: state.recentCreations,
                favorites: state.favorites,
                newComic: [...state.newComic, action.payload]
            }
        default:
            return state;
    }
}