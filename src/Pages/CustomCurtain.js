import {Link, useLocation, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Zebra from "../Components/Zebra";

const baseURLCats = "http://atlaspood.ir/api/SewingModel/GetByCategory";

function CustomCurtain() {
    const {t} = useTranslation();
    const location = useLocation();
    const {catID} = useParams();
    const {modelID} = useParams();
    const [models, setModels] = useState([]);
    const [defaultFabricPhoto, setDefaultFabricPhoto] = React.useState("");
    const [pageLanguage, setPageLanguage] = React.useState("");
    const [pageModel, setPageModel] = React.useState([]);
    
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
    
    const getCats = () => {
        axios.get(baseURLCats, {
            params: {
                categoryId: catID,
                apiKey: window.$apikey
            }
        }).then((response) => {
            setModels(response.data);
        }).catch(err => {
            console.log(err);
        });
    };
    
    const setPage=()=>{
        if(modelID==="0303") {
            setPageModel(<Zebra DefaultFabricPhoto={defaultFabricPhoto}/>)
        }
    
    };
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
    }, [location.pathname]);
    
    useEffect(() => {
        if (models.length) {
            models.forEach(obj=>{
                if (obj.SewingModelId===modelID)
                    setDefaultFabricPhoto(obj.DefaultFabricPhotoUrl);
            })
        }
    }, [models]);
    
    useEffect(() => {
        if (pageLanguage !== '') {
            getCats();
        }
        
    }, [pageLanguage, location]);
    
    useEffect(() => {
        if (defaultFabricPhoto !== '') {
            setPage();
        }
        
    }, [defaultFabricPhoto]);
    
    
    
    return (
        <div className="Custom_page_container">
            <div className="breadcrumb_container dir_ltr">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item linkAs={Link} className="breadcrumb_item" linkProps={{to:"/" + pageLanguage, className:"breadcrumb_item"}}>Home</Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} className="breadcrumb_item" linkProps={{to:"/" + pageLanguage+ "/Curtain/" + catID, className:"breadcrumb_item breadcrumb_item_current"}}>{catID}</Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} className="breadcrumb_item" linkProps={{to:location, className:"breadcrumb_item breadcrumb_item_current"}}>{modelID}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
    
            {pageModel}

        </div>
        
    
    );
}

export default CustomCurtain;