import { ERR, CREATESERIES, CREATECOMIC, VIEWCOMIC, GET_ALL_SERIES, SAVE_NEW_COMIC_DATA, UPDATE_COMIC_PANEL, CREATE_COMIC_ERROR, SET_SUGGESTIONS } from './Types';

export const createSeries = (token, seriesName, description, genres, privacy, history) => (dispatch) => {
    (async () => {
        const res = await fetch("http://localhost:8080/create/series", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({ username: token, name: seriesName, description: description, genre: genres, privacy: privacy })
        });
        let content = await res.json();
        console.log("CREATE SERIES RESULT", content);
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
                    username: token
                  })
                });
                let content = await res.json();
                console.log(content);
                if (content.comicSeries) {
                    dispatch({
                        type: GET_ALL_SERIES,
                        payload: { allSeries: content.comicSeries }
                    });
                    history.push(`/view/series`);
                }
            })();
            // history.push(`/view/series`); //async bug here
        } else if (content.result === "tokenerror") {
            localStorage.removeItem("state");
            history.push('/');
        } else{
            dispatch({
                type: ERR,
                payload: { Series: content.result }
            });
        }
    })();
}

export const createComic = (username, token, desc, comicName, seriesName, userList, privacy, canvases, images, history) => (dispatch) => {
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
                token: token,
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
            // Navigate only if successful
            history.push({
                pathname: `/view/comic/${username}/${seriesName}/${comicName}`,
                state: {
                    series: seriesName
                }
            });
        }
        else {
            dispatch({
                type: CREATE_COMIC_ERROR,
                payload: { createComicError: content.result }
            });
        }
    })();
}

export const viewComic = (username, viewerName, comicName, seriesName, token) => (dispatch) => {
    (async () => {
        const res = await fetch('http://localhost:8080/view/comic', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                comicName: comicName,
                seriesName: seriesName,
                comicOwnerName: username,
                viewerName: token
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
            // Get suggestions
            (async (content, token, viewerName) => {
                console.log(content);
                console.log(token);
                console.log(viewerName);
                const res = await fetch("http://localhost:8080/sidebar", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        token: token,
                        viewerName: viewerName,
                        viewedComicID: content.comicID
                    })
                });
                let content2 = await res.json();
                console.log(content2);
                const suggestions = content2.bundleComicList && content2.bundleComicList.length > 0 ? content2.bundleComicList : [];
                dispatch({
                    type: SET_SUGGESTIONS,
                    payload: { suggestions: suggestions }
                });
            })(content, token, viewerName);
        }
    })();
}

export const viewAllComics = (newComics) => (dispatch) => {
    dispatch({
        type: VIEWCOMIC,
        payload: { comics: newComics }
    });
}

export const setCreateComicError = (value) => (dispatch) => {
    dispatch({
        type: CREATE_COMIC_ERROR,
        payload: { createComicError: value }
    });
}