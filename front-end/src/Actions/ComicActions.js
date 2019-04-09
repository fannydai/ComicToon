import { GET_SUBSCRIPTIONS, GET_RECENT_CREATIONS, GET_FAVORITES, ADD_PANEL } from './Types';

// Don't call these functions yet, back-end is not set up
export const getSubscriptions = (username) => (dispatch) => {
    (async () => {
        const res = await fetch("http://localhost:8080/replaceHomeSubscriptions", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({ username: username })
        });
        let content = await res.json();
        dispatch({
            type: GET_SUBSCRIPTIONS,
            payload: { subscriptions: content.subscriptions }
        });
    })();
}

export const getRecentCreations = (username) => (dispatch) => {
    (async () => {
        const res = await fetch("http://localhost:8080/replaceRecentCreations", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({ username: username })
        });
        let content = await res.json();
        dispatch({
            type: GET_RECENT_CREATIONS,
            payload: { recentCreations: content.recentCreations }
        });
    })();
}

export const getFavorites = (username) => (dispatch) => {
    (async () => {
        const res = await fetch("http://localhost:8080/replaceFavorites", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({ username: username })
        });
        let content = await res.json();
        dispatch({
            type: GET_FAVORITES,
            payload: { favorites: content.favorites }
        });
    })();
}

export const addPanel = (panel, json) => (dispatch) => {
    dispatch({
        type: ADD_PANEL,
        payload: { newComic: { panel: panel, json: json} }
    });
}