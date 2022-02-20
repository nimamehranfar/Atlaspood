import Header from "../Components/Header";
import Footer from "../Components/Footer";
import React, {useEffect, useState} from "react";
import {Outlet} from "react-router";
import i18n from "i18next";
import {I18nextProvider, useTranslation} from "react-i18next";

function HeaderWithOutlet() {
    const {t} = useTranslation();
    
    return (
        <div className="page_container">
            <I18nextProvider i18n={i18n}>
                <Header/>
                <Outlet/>
            </I18nextProvider>
        </div>
    
    );
}

export default HeaderWithOutlet;