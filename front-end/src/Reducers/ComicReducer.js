import { GET_SUBSCRIPTIONS, GET_RECENT_CREATIONS, GET_FAVORITES } from './../Actions/Types';

const initState = {
    subscriptions: [],
    recentCreations: [],
    favorites: []
}

export default function(state = initState, action) {
    switch(action.type) {
        case GET_SUBSCRIPTIONS:
            return {
                subscriptions: action.payload.subscriptions,
                recentCreations: state.recentCreations,
                favorites: state.favorites
            };
        case GET_RECENT_CREATIONS:
            return {
                subscriptions: state.subscriptions,
                recentCreations: action.payload.recentCreations,
                favorites: state.favorites
            };
        case GET_FAVORITES:
            return {
                subscriptions: state.subscriptions,
                recentCreations: state.recentCreations,
                favorites: action.payload.favorites
            };
        default:
            return state;
    }
}