import { GET_USER_SERIES, GET_SUBSCRIPTIONS, GET_RECENT_CREATIONS, GET_FAVORITES, ADD_PANEL, SAVE_NEW_COMIC_DATA, GET_ALL_SERIES, CLEAR_PANELS, SAVE_UPDATE_COMIC_DATA, ADD_UPDATE_PANEL, DELETE_NEW_COMIC_PANEL, CREATE_COMIC_ERROR, DRAG_NEW_COMIC_PANEL, UPDATE_NEW_COMIC_PANEL, UPDATE_COMIC_PANEL, SET_SUGGESTIONS, SET_NEW_COMIC } from './../Actions/Types';

const initState = {
    subscriptions: [],
    recentCreations: [],
    favorites: [],
    newComic: [],
    newUpdateComic: null,
    saveNewComic: {},
    saveUpdateComic: {},
    allSeries: [],
    userSeries: [],
    suggestions: [],
    createComicError: ""
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
            return {
                ...state,
                newComic: [...state.newComic, action.payload]
            }
        case DELETE_NEW_COMIC_PANEL:
            const newComic = state.newComic;
            newComic.splice(action.payload.index, 1);
            return {
                ...state,
                newComic: newComic
            }
        case DRAG_NEW_COMIC_PANEL:
            let items = state.newComic.filter(item => item !== action.payload.dragItem);
            items.splice(action.payload.index, 0, action.payload.dragItem);
            return {
                ...state,
                newComic: items
            }
        case UPDATE_NEW_COMIC_PANEL:
            let temp = state.newComic;
            temp[action.payload.index] = { image: action.payload.image, json: action.payload.json }
            return {
                ...state,
                newComic: temp
            }
        case ADD_UPDATE_PANEL:
            const updatedComic = state.saveUpdateComic;
            updatedComic.comicPanels = [...updatedComic.comicPanels, { image: action.payload.image, canvas: JSON.stringify(action.payload.json) }];
            return {
                ...state,
                saveUpdateComic: updatedComic,
                newUpdateComic: { image: action.payload.image, canvas: JSON.stringify(action.payload.json) }
            }
        case UPDATE_COMIC_PANEL:
            let updatedComic2 = state.saveUpdateComic;
            updatedComic2.comicPanels[action.payload.index] = { image: action.payload.image, canvas: action.payload.json }
            return {
                ...state,
                saveUpdateComic: updatedComic2
            }
        case SET_NEW_COMIC:
            return {
                ...state,
                newComic: action.payload.newComic
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
        case GET_USER_SERIES:
            return {
                ...state,
                userSeries: action.payload.userSeries
            }
        case SET_SUGGESTIONS:
            return {
                ...state,
                suggestions: action.payload.suggestions
            }
        case CREATE_COMIC_ERROR:
            return {
                ...state,
                createComicError: action.payload.createComicError
            }
        default:
            return state;
    }
}