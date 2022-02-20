import {Link, useLocation, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Zebra from "../Components/Zebra";


function CustomCurtain() {
    const {t} = useTranslation();
    const location = useLocation();
    const {catID} = useParams();
    const {modelID} = useParams();
    const [pageLanguage, setPageLanguage] = React.useState("");
    const [pageModel, setPageModel] = React.useState([]);
    
    function convertToPersian(string_farsi) {
        if (string_farsi !== null && string_farsi !== undefined && string_farsi !== "") {
            let tempString = string_farsi.replace("ي", "ی");
            tempString = tempString.replace("ي", "ی");
            tempString = tempString.replace("ي", "ی");
            tempString = tempString.replace("ي", "ی");
            tempString = tempString.replace('ك', 'ک');
            return tempString;
        } else
            return string_farsi;
    }
    
    const setPage = () => {
        if (modelID === "0303") {
            setPageModel(<Zebra CatID={catID} ModelID={modelID}/>)
        }
        
    };
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
    }, [location.pathname]);
    
    useEffect(() => {
        if (pageLanguage !== '') {
            setPage();
        }
        
    }, [pageLanguage, location.pathname]);
    
    
    return (
        <div className="custom_page_Container">
            {pageModel}
        </div>
    );
}

export default CustomCurtain;