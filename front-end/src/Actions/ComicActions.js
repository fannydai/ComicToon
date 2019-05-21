import { GET_USER_SERIES, GET_SUBSCRIPTIONS, GET_RECENT_CREATIONS, GET_FAVORITES, ADD_PANEL, ADD_UPDATE_PANEL, SAVE_NEW_COMIC_DATA, SAVE_UPDATE_COMIC_DATA, GET_ALL_SERIES, CLEAR_PANELS, DELETE_NEW_COMIC_PANEL, DRAG_NEW_COMIC_PANEL } from './Types';

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

export const addPanel = (image, json) => (dispatch) => {
    dispatch({
        type: ADD_PANEL,
        payload: { image: image, json: json}
    });
}

export const addUpdatePanel = (image, json) => (dispatch) => {
    dispatch({
        type: ADD_UPDATE_PANEL,
        payload: { image: image, json: json}
    });
}

export const clearPanels = () => (dispatch) => {
    dispatch({
        type: CLEAR_PANELS
    })
}

// Save new comic data while creating panels
export const saveNewComic = (state) => (dispatch) => {
    dispatch({
        type: SAVE_NEW_COMIC_DATA,
        payload: { saveNewComic: state }
    });
}

// Save updating comic while creating panels
export const saveUpdateComic = (state) => (dispatch) => {
    dispatch({
        type: SAVE_UPDATE_COMIC_DATA,
        payload: { saveUpdateComic: state }
    });
}

export const getAllSeries = (state) => (dispatch) => {
    dispatch({
        type: GET_ALL_SERIES,
        payload: { allSeries: state }
    });
}

export const getUserSeries = (state) => (dispatch) => {
    dispatch({
        type: GET_USER_SERIES,
        payload: { userSeries: state }
    });
}

export const deleteNewComicPanel = (index) => (dispatch) => {
    dispatch({
        type: DELETE_NEW_COMIC_PANEL,
        payload: { index: index }
    });
}

export const dragNewComicPanel = (index, dragItem) => (dispatch) => {
    dispatch({
        type: DRAG_NEW_COMIC_PANEL,
        payload: { index: index, dragItem: dragItem }
    })
}