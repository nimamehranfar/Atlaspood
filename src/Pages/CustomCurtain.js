import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Zebra from "../Page Components/Zebra";
import Roller from "../Page Components/Roller";
import {useSelector} from "react-redux";


function CustomCurtain() {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    let navigate = useNavigate();
    const {isLoggedIn, isRegistered, user, showLogin} = useSelector((state) => state.auth);
    const {catID} = useParams();
    const {modelID} = useParams();
    const {projectId} = useParams();
    const {editIndex} = useParams();
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
            // console.log(projectId,editCart,localStorage.getItem("edit_project") !== null);
            setPageModel(<Zebra CatID={catID} ModelID={modelID} ProjectId={projectId} EditIndex={editIndex}/>)
        }
        else if(modelID === "0324") {
            setPageModel(<Roller CatID={catID} ModelID={modelID} ProjectId={projectId} EditIndex={editIndex}/>)
        }
        
    };
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
    }, [location.pathname]);
    
    useEffect(() => {
        if(editIndex!==undefined) {
            if(isLoggedIn){
                if (pageLanguage !== "") {
                    setPage();
                }
            }
            else if (localStorage.getItem("cart") !== null && JSON.parse(localStorage.getItem("cart"))["drapery"] !== undefined) {
                if (pageLanguage !== "") {
                    setPage();
                }
            }
            else{
                if (pageLanguage !== "") {
                    navigate("/" + pageLanguage+"/Curtain/"+catID+"/"+modelID);
                    setPage();
                }
            }
        }
        else{
            if (pageLanguage !== "") {
                setPage();
            }
        }
        
        
    }, [pageLanguage, location.pathname]);
    
    
    return (
        <div className="custom_page_Container">
            {pageModel}
        </div>
    );
}

export default CustomCurtain;