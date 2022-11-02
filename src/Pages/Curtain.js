import {Link, useLocation, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import parse, {domToReact} from 'html-react-parser';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import GetPrice from "../Components/GetPrice";

const baseURLCats = "https://api.atlaspood.ir/WebsitePage/GetDetailByName";

function Curtain() {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const {catID} = useParams();
    const [models, setModels] = useState([]);
    const [modelList, setModelList] = React.useState([]);
    const [defaultModelName, setDefaultModelName] = useState("");
    const [defaultModelNameFa, setDefaultModelNameFa] = useState("");
    
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
                pageName: catID,
                apiKey: window.$apikey
            }
        }).then((response) => {
            setModels(response.data.SewingModels);
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
            let discount = StartPrice !== DiscountPrice;
    
    
            setDefaultModelName(ModelENName);
            setDefaultModelNameFa(ModelName);
            
            if (Description === null || Description === undefined || Description === "") {
                Description = ""
            }
            if (ENDescription === null || ENDescription === undefined || ENDescription === "") {
                ENDescription = ""
            }
            
            if (DiscountDescription === null || DiscountDescription === undefined || DiscountDescription === "") {
                DiscountDescription = ""
            }
            if (DiscountEnDescription === null || DiscountEnDescription === undefined || DiscountEnDescription === "") {
                DiscountEnDescription = ""
            }
            
            // const options = {
            //     replace: domNode => {
            //         if (domNode.name === 'h1') {
            //             return <h1 className={`model_info_description_title`}>{domToReact(domNode.children, options)}</h1>;
            //         } else if (domNode.name === 'p') {
            //             return <p className={`model_info_description_body`}>{domToReact(domNode.children, options)}</p>;
            //         } else if (domNode.name === 'h2') {
            //             return <h2
            //                 className={`model_info_description_key_features`}>{domToReact(domNode.children, options)}</h2>;
            //         } else if (domNode.name === 'ul') {
            //             return <ul className={`model_info_description_bullets`}>{domToReact(domNode.children, options)}</ul>;
            //         } else if (domNode.name === 'li') {
            //             return <li
            //                 className={`model_info_description_key_features_item`}>{domToReact(domNode.children, options)}</li>;
            //         } else
            //             return null;
            //     }
            // };
            
            const options = {
                replace: domNode => {
                    if (domNode.name === 'h1') {
                        return <h1 className={`model_item_info_description_title`}>{domToReact(domNode.children, options)}</h1>;
                    } else if (domNode.name === 'p') {
                        return <p className={`model_item_info_description_body`}>{domToReact(domNode.children, options)}</p>;
                    } else if (domNode.name === 'h2') {
                        return <h2 className={`model_item_info_description_key_features`}/>;
                    } else if (domNode.name === 'ul') {
                        return <ul className={`model_item_info_description_bullets`}/>;
                    } else if (domNode.name === 'li') {
                        return <li className={`model_item_info_description_key_features_item`}/>;
                    } else
                        return null;
                }
            };
            
            modelLists.push(
                <li key={"model" + i} model_id={i} className={`${i % 2 === 0 ? "model_color_1" : "model_color_2"}`}>
                    <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId} className={`model_image_container`} onClick={()=>sessionStorage.clear()}>
                        <img src={PhotoUrl === null ? `${process.env.PUBLIC_URL}/no_image.svg` : `https://api.atlaspood.ir${PhotoUrl}`} className="img-fluid" alt=""/>
                    </Link>
                    <div className={`model_info_container`}>
                        {/*<div className={`model_info_price_title`}>*/}
                        {/*    <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId}*/}
                        {/*          className={`model_info_title`}>{pageLanguage === 'en' ? ModelENName : ModelName}</Link>*/}
                        {/*    <div className={`model_info_price_section`}>*/}
                        {/*        <p>{pageLanguage === 'en' ? DiscountEnDescription : DiscountDescription}</p>*/}
                        {/*        <h3>{t("prices from")}</h3>*/}
                        {/*        <span className={`${discount ? "model_info_price" : ""}}`}>{GetPrice(StartPrice, pageLanguage, t("TOMANS"))}</span>*/}
                        {/*        {discount &&*/}
                        {/*        <span>&nbsp;|&nbsp;</span>*/}
                        {/*        }*/}
                        {/*        {discount &&*/}
                        {/*        <span*/}
                        {/*            className={`model_info_price_off`}>{GetPrice(DiscountPrice, pageLanguage, t("TOMANS"))}</span>*/}
                        {/*        }*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<div className={`model_info_description_section`}>*/}
                        {/*    {pageLanguage === 'en' ? parse(ENDescription, options) : parse(Description, options)}*/}
                        {/*    /!*<h1 className={`model_info_description_title ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>DRAMATIC WITH DEEP FOLDS</h2>*!/*/}
                        {/*    /!*<p className={`model_info_description_body ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>Featuring hand-pressed grommets. Perfect for stylish,*!/*/}
                        {/*    /!*    modern interiors.</p>*!/*/}
                        {/*    /!*<div className={`model_info_description_bullets ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>*!/*/}
                        {/*    /!*    {keyFeatures}*!/*/}
                        {/*    /!*</div>*!/*/}
                        {/*</div>*/}
                        {/*<Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId} className={`btn_normal`}>{t("Start Customizing")}</Link>*/}

                        <div className="model_item_info_container">
                            <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId}
                                  className="model_item_info_title">{pageLanguage === 'en' ? ModelENName : ModelName}</Link>
                            <h3 className="model_item_info_price_from">{t("prices from")}</h3>
                            <span className={`${discount ? "model_item_info_price model_item_info_price2" : "model_item_info_price"}}`}>{GetPrice(StartPrice, pageLanguage, t("TOMANS"))}</span>
                            {discount &&
                            <span>&nbsp;|&nbsp;</span>
                            }
                            {discount &&
                            <span className={`model_item_info_price_off`}>{GetPrice(DiscountPrice, pageLanguage, t("TOMANS"))}</span>
                            }
                            <div className={`model_item_info_description_section`}>
                                {pageLanguage === 'en' ? parse(ENDescription, options) : parse(Description, options)}
                            </div>
                            <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId} className="btn_normal model_item_btn_normal" onClick={()=>sessionStorage.clear()}>{t("Start" +
                                " Customizing")}</Link>
                        </div>
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
        <div className={`Drapery_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            {/*<div className="breadcrumb_container dir_ltr">*/}
            {/*    <Breadcrumb className="breadcrumb">*/}
            {/*        <Breadcrumb.Item linkAs={Link} className="breadcrumb_item" linkProps={{to: "/" + pageLanguage, className: "breadcrumb_item"}}>Home</Breadcrumb.Item>*/}
            {/*        <Breadcrumb.Item linkAs={Link} className="breadcrumb_item"*/}
            {/*                         linkProps={{to: location, className: "breadcrumb_item breadcrumb_item_current"}}>{catID}</Breadcrumb.Item>*/}
            {/*    </Breadcrumb>*/}
            {/*</div>*/}
            <div className="models_title_div">
                <h1>{defaultModelName === undefined || defaultModelName === "" ? " " : pageLanguage === 'fa' ? defaultModelNameFa + " سفارشی " : "Custom " + defaultModelName}</h1>
                {/*<h1>{t("model_zebra_temp1")}</h1>*/}
                <h2>{t("model_zebra_temp2")}</h2>
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