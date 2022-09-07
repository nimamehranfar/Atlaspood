import axios from "axios";
import authHeader from "./auth-header";
import {LOGIN, LOGOUT} from "../Actions/types";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import store from "../store";

const baseURLRegister = "https://api.atlaspood.ir/user/register";
const baseURLLogin = "https://api.atlaspood.ir/login";


export function login(email, password) {
    return axios
        .post(baseURLLogin, {
            Email: email,
            Password: password
        }, {
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        })
        .then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        });
}

export function logout() {
    localStorage.removeItem("user");
}

export function register(firstName, lastName, email, phoneNumber, password) {
    return axios.post(baseURLRegister, {
        Email: email,
        Password: password,
        FirstName: firstName,
        LastName: lastName,
        Mobile: phoneNumber
    }, {
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    });
}

export async function refreshToken() {
    return await new Promise((resolve, reject) => {
        if (localStorage.getItem("user") !== null && JSON.parse(localStorage.getItem('user'))["refresh_token"] !== undefined) {
            const formData = new URLSearchParams();
            formData.append("refresh_token", JSON.parse(localStorage.getItem('user'))["refresh_token"]);
            formData.append("grant_type", "refresh_token");
            axios.post(baseURLLogin, formData).then((response) => {
                localStorage.setItem('user', JSON.stringify(response.data));
                store.dispatch({
                    type: LOGIN,
                    payload: {user: response.data},
                });
                resolve(response);
            }).catch(err => {
                if (localStorage.getItem("user") !== null) {
                    localStorage.removeItem("user");
                }
                store.dispatch({
                    type: LOGOUT,
                });
                resolve(false);
            });
        } else {
            if (localStorage.getItem("user") !== null) {
                localStorage.removeItem("user");
            }
            store.dispatch({
                type: LOGOUT,
            });
            resolve(false);
        }
    });
}