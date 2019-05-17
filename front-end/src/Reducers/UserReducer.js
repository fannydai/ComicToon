import {VERIFY, LOGIN_USER, REGISTER_USER, ERR} from '../Actions/Types';

const initState = {
    username: "",
    token: "",
    email: "",
    isValidated: false,
    loginError: "",
    registerError: ""
}

export default function(state = initState, action){
    switch(action.type){
        case LOGIN_USER:
            return {
                username: action.payload.username,
                id: action.payload.id,
                active: action.payload.active,
                token: action.payload.token,
                email: action.payload.email,
                isValidated: action.payload.verified,
                loginError: "",
                registerError: ""
            };
        case REGISTER_USER:
            return{
                username: action.payload.username,
                id: action.payload.id,
                token: action.payload.token,
                active: true,
                email: action.payload.email,
                isValidated: action.payload.verified,
                loginError: "",
                registerError: ""
            };
        case VERIFY:
            return{
                ...state,
                loginError: "",
                registerError: "",
                isValidated: action.payload.isValidated
            };
        case ERR:
            return {
                ...state,
                loginError: action.payload.loginError,
                registerError: action.payload.registerError
            }
        default: 
            return state
    }
}