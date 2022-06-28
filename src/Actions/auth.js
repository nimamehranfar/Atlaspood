import {
    LOGOUT,
    LOGIN
} from "./types";
import {login as user_login,logout as user_logout,register as user_register} from "../Services/auth.service";

export const register = (firstName, lastName, email, phoneNumber, password) => (dispatch) => {
    return user_register(firstName, lastName, email, phoneNumber, password).then(
        (response) => {
            dispatch({
                type: REGISTER_SUCCESS,
            });
            dispatch({
                type: SET_MESSAGE,
                payload: "REGISTER SUCCEED",
            });
            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            dispatch({
                type: REGISTER_FAIL,
            });
            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });
            return Promise.reject();
        }
    );
};
export const login = (email, password) => (dispatch) => {
    return user_login(email, password).then(
        (data) => {
            dispatch({
                type: LOGIN,
                payload: { user: data },
            });
            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            dispatch({
                type: LOGIN_FAIL,
            });
            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });
            return Promise.reject();
        }
    );
};
export const logout = () => (dispatch) => {
    user_logout();
    dispatch({
        type: LOGOUT,
    });
};