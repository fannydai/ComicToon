import {VERIFY, LOGIN_USER, REGISTER_USER, ERR} from '../Actions/Types';

const initState = {
    username: "",
    token: "",
    email: "",
    isValidated: false
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
                isValidated: action.payload.verified
            };
        case REGISTER_USER:
            return{
                username: action.payload.username,
                id: action.payload.id,
                token: action.payload.token,
                active: true,
                email: action.payload.email,
                isValidated: action.payload.verified
            };
        case VERIFY:
            return{
                ...state,
                isValidated: action.payload.isValidated
            };
        case ERR:
            return state
        default: 
            return state
    }
}