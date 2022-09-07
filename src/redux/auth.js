import {
    HideLoginModal,HideLogin2Modal,
    LOGIN,
    LOGOUT, ShowLoginModal,ShowLogin2Modal,REGISTER,CLEAR_REGISTER
} from "../Actions/types";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
    ? {isLoggedIn: true,isRegistered: false, user, showLogin: false, showLogin2: false}
    : {isLoggedIn: false,isRegistered: false, user: null, showLogin: false, showLogin2: false};
export default function auth(state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case LOGIN:
            return {
                ...state,
                isLoggedIn: true,
                user: payload.user,
            };
        case REGISTER:
            return {
                ...state,
                isLoggedIn: true,
                isRegistered: true,
                user: payload.user,
            };
        case CLEAR_REGISTER:
            return {
                ...state,
                isRegistered: false
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
        case ShowLogin2Modal:
            return {
                ...state,
                showLogin2: true
            };
        case HideLogin2Modal:
            return {
                ...state,
                showLogin2: false
            };
        default:
            return state;
    }
}