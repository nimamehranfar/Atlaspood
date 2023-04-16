import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Zebra from "../Page Components/Zebra";
import Roller from "../Page Components/Roller";
import DualRoller from "../Page Components/DualRoller";
import DK from "../Page Components/DK";
import DK2 from "../Page Components/DK2";
import {useSelector} from "react-redux";
import axios from "axios";
import Grommet from "../Page Components/Grommet";

const baseURLGet = "https://api.atlaspood.ir/WebsitePageItem/GetById";

function CustomCurtain() {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    let navigate = useNavigate();
    const {isLoggedIn, isRegistered, user, showLogin} = useSelector((state) => state.auth);
    const {catID} = useParams();
    const {modelID} = useParams();
    const {specialID} = useParams();
    const {projectId} = useParams();
    const {editIndex} = useParams();
    const {websitePageItemId} = useParams();
    const [pageModel, setPageModel] = React.useState([]);
    
    
    
    const setPage = () => {
        let queryObj;
        let pageItem;
        let parameters;
        let promise1 = new Promise((resolve, reject) => {
            if (typeof websitePageItemId !== 'undefined') {
                axios.get(baseURLGet, {
                    params: {
                        pageId: websitePageItemId
                        // apiKey: window.$apikey
                    }
                }).then((response) => {
                    if (response.data) {
                        pageItem=response.data;
                        let queries = response.data["QueryString"] ? response.data["QueryString"] : "";
                
                        let queryColorsArr = queries.split('colors=');
                        queryColorsArr = queryColorsArr[1] ? queryColorsArr[1].split('&') : [];
                        let queryColors = queryColorsArr[0] ? queryColorsArr[0] : "";
                        let queryColorsSelected = queryColors.split(',').filter(n => n) ? [...new Set(queryColors.split(','))].filter(n => n) : []
                
                        let queryPatternsArr = queries.split('patterns=');
                        queryPatternsArr = queryPatternsArr[1] ? queryPatternsArr[1].split('&') : [];
                        let queryPatterns = queryPatternsArr[0] ? queryPatternsArr[0] : "";
                        let queryPatternsSelected = queryPatterns.split(',').filter(n => n) ? [...new Set(queryPatterns.split(','))].filter(n => n) : []
                
                
                        let queryTypesArr = queries.split('types=');
                        queryTypesArr = queryTypesArr[1] ? queryTypesArr[1].split('&') : [];
                        let queryTypes = queryTypesArr[0] ? queryTypesArr[0] : "";
                        let queryTypesSelected = queryTypes.split(',').filter(n => n) ? [...new Set(queryTypes.split(','))].filter(n => n) : []
                
                        let queryPricesArr = queries.split('prices=');
                        queryPricesArr = queryPricesArr[1] ? queryPricesArr[1].split('&') : [];
                        let queryPrices = queryPricesArr[0] ? queryPricesArr[0] : "";
                        let queryPricesSelected = queryPrices.split(',').filter(n => n) ? [...new Set(queryPrices.split(','))].filter(n => n) : []
                
                        let queryDesignsArr = queries.split('designs=');
                        queryDesignsArr = queryDesignsArr[1] ? queryDesignsArr[1].split('&') : [];
                        let queryDesigns = queryDesignsArr[0] ? queryDesignsArr[0] : "";
                        let queryDesignsSelected = queryDesigns.split(',').filter(n => n) ? [...new Set(queryDesigns.split(','))].filter(n => n) : []
                
                        queryObj = {
                            "colors": queryColorsSelected,
                            "patterns": queryPatternsSelected,
                            "types": queryTypesSelected,
                            "prices": queryPricesSelected,
                            "designs": queryDesignsSelected
                        }
                        parameters=JSON.parse(response.data["Parameters"] || "{}");
                        resolve();
                
                    } else {
                        reject();
                    }
                }).catch(err => {
                    console.log(err);
                    reject();
                });
            } else {
                resolve();
            }
        });
    
        promise1.then(() => {
            if(specialID){
                if (modelID === "0326" && specialID==="1") {
                    setPageModel(<DK2 CatID={catID} ModelID={modelID} SpecialId={specialID} ProjectId={projectId} EditIndex={editIndex} PageItem={pageItem} QueryString={queryObj}
                                     Parameters={parameters} PageId={websitePageItemId}/>)
                }
            }
            else {
                if (modelID === "0303") {
                    setPageModel(<Zebra CatID={catID} ModelID={modelID} SpecialId={specialID} ProjectId={projectId} EditIndex={editIndex} PageItem={pageItem} QueryString={queryObj}
                                        Parameters={parameters} PageId={websitePageItemId}/>)
                } else if (modelID === "0324") {
                    setPageModel(<Roller CatID={catID} ModelID={modelID} SpecialId={specialID} ProjectId={projectId} EditIndex={editIndex} PageItem={pageItem} QueryString={queryObj}
                                         Parameters={parameters} PageId={websitePageItemId}/>)
                } else if (modelID === "0325") {
                    setPageModel(<DualRoller CatID={catID} ModelID={modelID} SpecialId={specialID} ProjectId={projectId} EditIndex={editIndex} PageItem={pageItem} QueryString={queryObj}
                                             Parameters={parameters} PageId={websitePageItemId}/>)
                } else if (modelID === "0326") {
                    setPageModel(<DK CatID={catID} ModelID={modelID} SpecialId={specialID} ProjectId={projectId} EditIndex={editIndex} PageItem={pageItem} QueryString={queryObj}
                                     Parameters={parameters} PageId={websitePageItemId}/>)
                } else if (modelID === "0099") {
                    setPageModel(<Grommet CatID={catID} ModelID={modelID} SpecialId={specialID} ProjectId={projectId} EditIndex={editIndex} PageItem={pageItem} QueryString={queryObj}
                                     Parameters={parameters} PageId={websitePageItemId}/>)
                }
            }
        }).catch(err => {
            console.log(err);
            setPageModel(<p>No Page Item</p>);
        });
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