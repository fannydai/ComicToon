import {LOGIN_USER, REGISTER_USER, ERR} from '../Actions/Types';

const initState = {
    username: "",
    pwd: "",
    email: "",
    isValidated: false //for third benchmark
}

export default function(state = initState, action){
    switch(action.type){
        case LOGIN_USER:
            return {
                username: action.payload.username,
                pwd: action.payload.pwd,
                email: action.payload.email,
                isValidated: action.payload.verified
            };
        case REGISTER_USER:
            return{
                username: action.payload.username,
                pwd: action.payload.pwd,
                email: action.payload.email,
                isValidated: action.payload.verified
            };
        case ERR:
            return state
        default: 
            return state
    }
}