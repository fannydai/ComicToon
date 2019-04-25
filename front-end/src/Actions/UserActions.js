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
            console.log(content);
            if(content.status === "Incorrect Login Details") { 
                alert("INCORRECT EMAIL OR PASSWORD!!");
                dispatch({
                    type: ERR,
                    payload: {username: "", id: "", active: "", token: "", email: ""}
                });
            }  else if (content.status === "User is not verified!") {
                dispatch({
                    type: LOGIN_USER,
                    payload: {username: "", id: "", active: "", token: "", email: "", verified: false}
                });
            }
            else { 
                console.log(content);
                dispatch({
                    type: LOGIN_USER,
                    payload: {username: content.username, id: content.id, active: content.active, token: content.token, email: email, verified: true}
                });
            }
    })();
}

export const RegisterUser = (username, email, pwd) => (dispatch) => {
    (async () => {
        const res = await fetch("http://localhost:8080/register", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                email: email,
                username: username,
                password: pwd
            })
        });
        let content = await res.json();
        if (content.status !== "success") {
            alert(content.status);
            dispatch({
                type: ERR,
                payload: {username: "", id: "", pwd: "", email: "", verified: false}
            });
        }
        else {
            dispatch({
                type: REGISTER_USER,
                payload: {username: username, id: content.id, pwd: pwd, email: email, verified: false}
            });
        }
    })();
}