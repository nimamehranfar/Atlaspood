import React, {useEffect, useState} from "react";
import {Outlet} from "react-router";
import i18n from "i18next";
import {I18nextProvider, useTranslation} from "react-i18next";

function NoHeaderNoFooter() {
    const {t} = useTranslation();
    
    return (
        <div className="page_container">
            <I18nextProvider i18n={i18n}>
                <Outlet/>
            </I18nextProvider>
        </div>
    
    );
}

export default NoHeaderNoFooter;