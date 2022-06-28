import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation} from "react-router-dom";
import {Toast, ToastContainer} from "react-bootstrap";


function Settings() {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const [showToast, setShowToast] = React.useState(false);
    
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
    }, [location.pathname]);
    
    return (
        <div className={`Account_settings_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            <div className="Account_settings_section">
                <h1 className="Account_settings_section_title">{t("ACCOUNT SETTINGS")}</h1>
                <div className="Account_settings_item">
                    <span className="Account_settings_item_left">{t("Name: ")}</span>
                    <span className="Account_settings_item_right">User</span>
                </div>
                <div className="Account_settings_item">
                    <span className="Account_settings_item_left">{t("Email: ")}</span>
                    <span className="Account_settings_item_right">User@gmail.com</span>
                </div>
                <div className="Account_settings_item">
                    <span className="Account_settings_item_left">{t("Password: ")}</span>
                    <span className="Account_settings_item_right">*********</span>
                </div>
                <div className="Account_settings_item">
                    <span className="Account_settings_item_left">
                        <button className="Account_settings_reset_password" onClick={()=>setShowToast(true)}>{t("RESET")}</button>
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