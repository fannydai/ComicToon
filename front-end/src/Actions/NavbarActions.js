import { ERR, CREATESERIES, CREATECOMIC, UPLOAD, VIEWCOMIC, VIEWSERIES, GET_ALL_SERIES, SAVE_NEW_COMIC_DATA } from './Types';

export const createSeries = (userName, seriesName, description, genres, privacy) => (dispatch) => {
    (async () => {
        const res = await fetch("http://localhost:8080/create/series", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({ username: userName, name: seriesName, description: description, genre: genres, privacy: privacy })
        });
        let content = await res.json();
    
        if(content.result === "success"){
            dispatch({
                type: CREATESERIES,
                payload: { Series: seriesName }
            });
            // Fetch update redux with all series
            (async () => {
                const res = await fetch("http://localhost:8080/view/series", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                  },
                  body: JSON.stringify({
                    username: userName
                  })
                });
                let content = await res.json();
                console.log(content);
                if (content.comicSeries) {
                    dispatch({
                        type: GET_ALL_SERIES,
                        payload: { allSeries: content.comicSeries }
                    });
                }
            })();  
        }
        else{
            console.log(content.result);
            dispatch({
                type: ERR,
                payload: { Series: content.result }
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

export const createComic = (username, desc, comicName, seriesName, userList, privacy, canvases, images) => (dispatch) => {
    (async () => {
        console.log('sharedWITH', userList);
        const res = await fetch("http://localhost:8080/create/comic", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                username: username,
                description: desc,
                name: comicName,
                series: seriesName,
                sharedWith: userList,
                privacy: privacy,
                canvases: canvases,
                images: images
              })
        });
        let content = await res.json();
        console.log(content)
        if(content.result === 'success'){ 
            dispatch({
                type: CREATECOMIC,
                payload: { Comic: comicName }
            });
            alert(`Comic '${comicName}' Created!!`)
        }
        else {
            dispatch({
                type: ERR,
                payload: { Comic: "" }
            });
            alert(`ERROR! Comic '${comicName}' NOT Created!!`)
        }
    })();
}

export const viewComic = (username, viewerName, comicName) => (dispatch) => {
    (async () => {
        const res = await fetch('http://localhost:8080/view/comic', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                comicName: comicName,
                comicOwnerName: username,
                viewerName: viewerName
            })
        });
        let content = await res.json();
        console.log(content);
        if (!content.comicName) {
            dispatch({
                type: SAVE_NEW_COMIC_DATA,
                payload: { saveNewComic: { error: "No permission to see comic or does not exist." } }
            });
        } else {
            dispatch({
                type: SAVE_NEW_COMIC_DATA,
                payload: { saveNewComic: content }
            });
        }
    })();
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

export const viewAllComics = (newComics) => (dispatch) => {
    dispatch({
        type: VIEWCOMIC,
        payload: { comics: newComics }
    });
}

export const updateComicPanel = (panel) => (dispatch) => {
    // Call backend to update the panel and update User_Comic_View with it
}