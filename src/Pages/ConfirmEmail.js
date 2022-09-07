import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {LOGIN} from "../Actions/types";
import {useDispatch} from "react-redux";


const baseUrl = "https://api.atlaspood.ir/user/Activate";


function ConfirmEmail() {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const {activeId} = useParams();
    let navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [confirmState, setConfirmState] = useState(0);
    const confirmText = {
        "en": [
            {text:"Verifying your email ..."},
            {text:"Your email verified, Redirecting ..."},
            {text:"Invalid Activation code, Redirecting ..."}
        ],
        "fa": [
            {text:"Verifying your email ..."},
            {text:"Your email verified, Redirecting ..."},
            {text:"Invalid Activation code, Redirecting ..."}
        ],
        
    };
    
    function verifyEmail(){
        axios.post(baseUrl, {},{
            params: {
                ActivationCode: activeId
            }
        }).then((response) => {
            localStorage.setItem('user', JSON.stringify(response.data));
            setConfirmState(1);
            setTimeout(() => {
                dispatch({
                    type: LOGIN,
                    payload: { user: response.data },
                });
                navigate("/" + pageLanguage+"/Account");
            }, 3000);
        }).catch(err => {
            console.log(err);
            setConfirmState(2);
            setTimeout(() => {
                navigate("/" + pageLanguage+"/User");
            }, 1000);
        });
    }
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
        verifyEmail();
    }, [location.pathname]);
    
    return (
        <div className={`active_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            <h2 className="active_loading">{confirmText[pageLanguage][confirmState].text}</h2>
        </div>
    );
}

export default ConfirmEmail;