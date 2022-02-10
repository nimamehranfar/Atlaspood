import {Link, useLocation, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import Breadcrumb from 'react-bootstrap/Breadcrumb';

function Zebra({DefaultFabricPhoto}) {
    const {t} = useTranslation();
    const location = useLocation();
    const {catID} = useParams();
    const {modelID} = useParams();
    const [models, setModels] = useState([]);
    const [defaultFabricPhoto, setDefaultFabricPhoto] = React.useState(DefaultFabricPhoto);
    const [pageLanguage, setPageLanguage] = React.useState("");
    
    function convertToPersian(string_farsi) {
        if (string_farsi !== null && string_farsi!==undefined && string_farsi!=="") {
            let tempString = string_farsi.replace("ي", "ی");
            tempString = tempString.replace("ي", "ی");
            tempString = tempString.replace("ي", "ی");
            tempString = tempString.replace("ي", "ی");
            tempString = tempString.replace('ك', 'ک');
            return tempString;
        }
        else
            return string_farsi;
    }
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
    }, [location.pathname]);
    
    
    useEffect(() => {
        if (pageLanguage !== '') {
            // getCats();
            console.log(DefaultFabricPhoto)
        }
        
    }, [pageLanguage, location]);
    
    return (
            <img src={defaultFabricPhoto === null ? `${process.env.PUBLIC_URL}/no_image.svg` : `http://atlaspood.ir${defaultFabricPhoto}`} className="img-fluid" alt=""/>
    
    );
}

export default Zebra;