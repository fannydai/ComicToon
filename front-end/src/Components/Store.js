import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../Reducers/indexReducer'
const initState = {};
const middleware = [thunk];


function saveToLocalStorage(state) {
    try {
        const serializedState = JSON.stringify(state)
        localStorage.setItem('state', serializedState)
    } catch(e) {
        console.log(e)
    }
}

function loadFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem('state')
        if (serializedState === null){
        return undefined
        }
        return JSON.parse(serializedState)
    } catch(e) {
        console.log(e)
        return undefined
    }
}

const persistedState = loadFromLocalStorage()
let store;
    if(persistedState === undefined){
    store = createStore(rootReducer, initState, 
        compose(
            applyMiddleware(...middleware)//,
            //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() //redux chrome extension
        ));
    }
    else{
    store = createStore(rootReducer, persistedState, 
        compose(
            applyMiddleware(...middleware)//,
            //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() //redux chrome extension
        ));  
    }
store.subscribe(() => saveToLocalStorage(store.getState()))
export default store;