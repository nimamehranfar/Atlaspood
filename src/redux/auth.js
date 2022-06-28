import {
    HideLoginModal,
    LOGIN,
    LOGOUT, ShowLoginModal,
} from "../Actions/types";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
    ? {isLoggedIn: true, user, showLogin: false}
    : {isLoggedIn: false, user: null, showLogin: false};
export default function auth(state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case LOGIN:
            return {
                ...state,
                isLoggedIn: true,
                user: payload.user,
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        case ShowLoginModal:
            return {
                ...state,
                showLogin: true
            };
        case HideLoginModal:
            return {
                ...state,
                showLogin: false
            };
        default:
            return state;
    }
}