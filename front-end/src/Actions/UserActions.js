import {LOGIN_USER, REGISTER_USER, ERR} from './Types';

export const LoginUser = (email, pwd) => (dispatch) => {
    (async () => {
        const res = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            email: email,
            password: pwd
            })
        });
            let content = await res.json();
            if(content.status === "Incorrect Login Details") { 
                alert("INCORRECT EMAIL OR PASSWORD!!");
                dispatch({
                    type: ERR,
                    payload: {username: "", pwd: "", email: "", verified: false}
                });
            }  
            else { 
                localStorage.setItem('user', content.username);
                dispatch({
                    type: LOGIN_USER,
                    payload: {username: content.username, pwd: pwd, email: email, verified: false}
                });
            }
    })();
}