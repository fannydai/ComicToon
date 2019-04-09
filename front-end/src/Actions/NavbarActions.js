import { ERR, CREATESERIES, CREATECOMIC, UPLOAD, VIEWCOMIC, VIEWSERIES } from './Types';

export const createSeries = (userName, seriesName, genres, privacy) => (dispatch) => {
    (async () => {
        const res = await fetch("http://localhost:8080/create/series", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({ username: userName, name: seriesName, genre: genres, privacy: privacy })
        });
        let content = await res.json();
    
        if(content.result === "success"){
            dispatch({
                type: CREATESERIES,
                payload: { Series: seriesName }
            });
        }
        else{
            dispatch({
                type: ERR,
                payload: { Series: "" }
            });
        }
    })();
}
export const viewMySeries = () => (dispatch) => {
    // (async () => {
    //     const res = await fetch("http://localhost:8080/replaceFavorites", {
    //         method: "POST",
    //         headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json; charset=utf-8"
    //         },
    //         body: JSON.stringify({ username: "" })
    //     });
    //     let content = await res.json();
    //     dispatch({
    //         type: GET_FAVORITES,
    //         payload: { favorites: content.favorites }
    //     });
    // })();
}

export const upload = () => (dispatch) => {
    // (async () => {
    //     const res = await fetch("http://localhost:8080/replaceFavorites", {
    //         method: "POST",
    //         headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json; charset=utf-8"
    //         },
    //         body: JSON.stringify({ username: "" })
    //     });
    //     let content = await res.json();
    //     dispatch({
    //         type: GET_FAVORITES,
    //         payload: { favorites: content.favorites }
    //     });
    // })();
}

export const createComic = () => (dispatch) => {
    // (async () => {
    //     const res = await fetch("http://localhost:8080/replaceFavorites", {
    //         method: "POST",
    //         headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json; charset=utf-8"
    //         },
    //         body: JSON.stringify({ username: "" })
    //     });
    //     let content = await res.json();
    //     dispatch({
    //         type: GET_FAVORITES,
    //         payload: { favorites: content.favorites }
    //     });
    // })();
}

export const viewMyComic = () => (dispatch) => {
    // (async () => {
    //     const res = await fetch("http://localhost:8080/replaceFavorites", {
    //         method: "POST",
    //         headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json; charset=utf-8"
    //         },
    //         body: JSON.stringify({ username: "" })
    //     });
    //     let content = await res.json();
    //     dispatch({
    //         type: GET_FAVORITES,
    //         payload: { favorites: content.favorites }
    //     });
    // })();
}