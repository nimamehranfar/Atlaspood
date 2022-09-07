import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation} from "react-router-dom";
import {Toast, ToastContainer} from "react-bootstrap";
import jwt from "jwt-decode";
import axios from "axios";

const baseURLReset = "https://api.atlaspood.ir/user/SendResetPasswordEmail";


function Settings() {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const [showToast, setShowToast] = React.useState(false);
    const [userName, setUserName] = React.useState("");
    const [userEmail, setUserEmail] = React.useState("");
    
    function resetUserPassword(){
        axios.post(baseURLReset, {},{
            params: {
                userName: userEmail
            }
        }).then((response) => {
            setShowToast(true)
        }).catch(err => {
            console.log(err);
        });
    }
    
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
        if (localStorage.getItem("user") !== null)
        {
            let tempObj=JSON.parse(localStorage.getItem("user"));
            setUserName(jwt(tempObj["access_token"])["FirstName"]+" "+jwt(tempObj["access_token"])["LastName"] );
            setUserEmail(jwt(tempObj["access_token"])["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
        }
    }, [location.pathname]);
    
    return (
        <div className={`Account_settings_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            <div className="Account_settings_section">
                <h1 className="Account_settings_section_title">{t("ACCOUNT SETTINGS")}</h1>
                <div className="Account_settings_item">
                    <span className="Account_settings_item_left">{t("Name: ")}</span>
                    <span className="Account_settings_item_right">{userName}</span>
                </div>
                <div className="Account_settings_item">
                    <span className="Account_settings_item_left">{t("Email: ")}</span>
                    <span className="Account_settings_item_right">{userEmail}</span>
                </div>
                <div className="Account_settings_item">
                    <span className="Account_settings_item_left">{t("Password: ")}</span>
                    <span className="Account_settings_item_right">*********</span>
                </div>
                <div className="Account_settings_item">
                    <span className="Account_settings_item_left">
                        <button className="Account_settings_reset_password" onClick={()=>resetUserPassword()}>{t("RESET")}</button>
                    </span>
                    <span className="Account_settings_item_right"/>
                </div>
            </div>
            {/*<div className="Account_settings_section">*/}
            {/*    <h1 className="Account_settings_section_title">MY PASSWORD</h1>*/}
            {/*</div>*/}
            <ToastContainer className="p-3 position_fixed" position="top-start">
                <Toast onClose={() => setShowToast(false)} bg="success" show={showToast} delay={3000} autohide>
                    <Toast.Header>
                        <img className="rounded me-2"/>
                        <strong className="me-auto">Success</strong>
                        {/*<small>couple of seconds ago</small>*/}
                    </Toast.Header>
                    <Toast.Body>We've sent you an email with a link to update your password.</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
        
    );
}

export default Settings;