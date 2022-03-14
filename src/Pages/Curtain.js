import {Link, useLocation, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import parse, {domToReact} from 'html-react-parser';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

const baseURLCats = "http://atlaspood.ir/api/SewingModel/GetByCategory";

function Curtain() {
    const {t} = useTranslation();
    const location = useLocation();
    const {catID} = useParams();
    const [models, setModels] = useState([]);
    const [modelList, setModelList] = React.useState([]);
    const [pageLanguage, setPageLanguage] = React.useState("");
    
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
    
    function renderModels() {
        const modelLists = [];
        for (let i = 0; i < models.length; i++) {
            let SewingModelId = models[i].SewingModelId;
            let ModelName = convertToPersian(models[i].ModelName);
            let ModelENName = models[i].ModelENName;
            let DiscountDescription = models[i].DiscountDescription;
            let DiscountEnDescription = models[i].DiscountEnDescription;
            let Description = convertToPersian(models[i].Description);
            let ENDescription = models[i].ENDescription;
            let StartPrice = models[i].StartPrice;
            let DiscountPrice = models[i].DiscountPrice;
            let PhotoUrl = models[i].PhotoUrl;
            let DefaultFabricPhotoUrl = models[i].DefaultFabricPhotoUrl;
            
            if (Description === null || Description === undefined || Description === "") {
                Description = ""
            }
            if (ENDescription === null || ENDescription === undefined || ENDescription === "") {
                ENDescription = ""
            }
            
            const options = {
                replace: domNode => {
                    if (domNode.name === 'h1') {
                        return <h1 className={`model_info_description_title ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>{domToReact(domNode.children, options)}</h1>;
                    } else if (domNode.name === 'p') {
                        return <p className={`model_info_description_body ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>{domToReact(domNode.children, options)}</p>;
                    } else if (domNode.name === 'h2') {
                        return <h2
                            className={`model_info_description_key_features ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>{domToReact(domNode.children, options)}</h2>;
                    } else if (domNode.name === 'ul') {
                        return <ul className={`model_info_description_bullets ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>{domToReact(domNode.children, options)}</ul>;
                    } else if (domNode.name === 'li') {
                        return <li
                            className={`model_info_description_key_features_item ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>{domToReact(domNode.children, options)}</li>;
                    } else
                        return null;
                }
            };
            
            modelLists.push(
                <li key={"model" + i} model_id={i} className={`${i % 2 === 0 ? "model_color_1" : "model_color_2"} ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                    <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId} className={`model_image_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                        <img src={PhotoUrl === null ? `${process.env.PUBLIC_URL}/no_image.svg` : `http://atlaspood.ir${PhotoUrl}`} className="img-fluid" alt=""/>
                    </Link>
                    <div className={`model_info_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                        <div className={`model_info_price_title ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                            <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId}
                                  className={`model_info_title ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>{pageLanguage === 'en' ? ModelENName : ModelName}</Link>
                            <div className={`model_info_price_section ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                                <p>{pageLanguage === 'en' ? DiscountEnDescription : DiscountDescription}</p>
                                <h3>{t("prices from")}</h3>
                                <span className={`model_info_price ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>{StartPrice} TOMANS</span>
                                <span>&nbsp;|&nbsp;</span>
                                <span className={`model_info_price_off ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>{DiscountPrice} TOMANS</span>
                            </div>
                        </div>
                        <div className={`model_info_description_section ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                            {pageLanguage === 'en' ? parse(ENDescription, options) : parse(Description, options)}
                            {/*<h1 className={`model_info_description_title ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>DRAMATIC WITH DEEP FOLDS</h2>*/}
                            {/*<p className={`model_info_description_body ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>Featuring hand-pressed grommets. Perfect for stylish,*/}
                            {/*    modern interiors.</p>*/}
                            {/*<div className={`model_info_description_bullets ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>*/}
                            {/*    {keyFeatures}*/}
                            {/*</div>*/}
                        </div>
                        <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId} className={`btn_normal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>Start Customizing</Link>
                    </div>
                </li>
            );
        }
        setModelList(modelLists);
    }
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
    }, [location.pathname]);
    
    useEffect(() => {
        if (models.length) {
            renderModels()
        }
    }, [models]);
    
    useEffect(() => {
        if (pageLanguage !== '') {
            getCats();
        }
        
    }, [pageLanguage, location.pathname]);
    
    return (
        <div className="Drapery_page_container">
            <div className="breadcrumb_container dir_ltr">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item linkAs={Link} className="breadcrumb_item" linkProps={{to: "/" + pageLanguage, className: "breadcrumb_item"}}>Home</Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} className="breadcrumb_item"
                                     linkProps={{to: location, className: "breadcrumb_item breadcrumb_item_current"}}>{catID}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="models_title_div">
                <h1>Custom Zebra Shades</h1>
                <h2>8 CUSTOM STYLES | 650+ EXCLUSIVE MATERIALS</h2>
            </div>
            <div className="cat_models_list_container">
                <hr/>
                <ul className="cat_models_list">
                    {modelList}
                </ul>
            </div>
        </div>
    
    );
}

export default Curtain;