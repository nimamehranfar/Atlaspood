import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import parse, {domToReact} from 'html-react-parser';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import GetPrice from "../Components/GetPrice";
import {convertToPersian, NumToFa} from "../Components/TextTransform";

const baseURLCats = "https://api.atlaspood.ir/WebsitePage/GetDetailByName";

function Curtain() {
    const {t} = useTranslation();
    const location = useLocation();
    let navigate = useNavigate();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const {catID} = useParams();
    const [models, setModels] = useState([]);
    const [modelList, setModelList] = React.useState([]);
    const [defaultModelName, setDefaultModelName] = useState("");
    const [defaultModelNameFa, setDefaultModelNameFa] = useState("");
    const [defaultDesc, setDefaultDesc] = useState("");
    const [defaultDescFa, setDefaultDescFa] = useState("");
    
    const getCats = () => {
        axios.get(baseURLCats, {
            params: {
                pageName: catID
                // apiKey: window.$apikey
            }
        }).then((response) => {
            if(response.data["WebsitePageItems"].length) {
                let tempArr=[];
                let promiseArr=[];
                if(response.data["PageItems"].split(':')[1]) {
                    response.data["WebsitePageItems"].forEach((obj,index) => {
                        promiseArr[index]=new Promise((resolve, reject) => {
                            let tempSplit1 = response.data["PageItems"].split(obj["WebsitePageItemId"].toString() + ":");
                            let tempSplit2 = tempSplit1[1] ? parseInt(tempSplit1[1].split(",")[0]) : 0;
                            tempArr[tempSplit2-1] = obj;
                            resolve();
                        });
                    })
                    Promise.all(promiseArr).then(() => {
                        setModels(tempArr);
                    });
                }
                else{
                    setModels(response.data["WebsitePageItems"]);
                }
    
                setDefaultModelName(response.data["TitleEn"]);
                setDefaultModelNameFa(convertToPersian(response.data["Title"]));
                setDefaultDesc(response.data["DescriptionEn"]);
                setDefaultDescFa(convertToPersian(response.data["Description"]));
            }
            else{
                setModelList(<p>No Page Item</p>);
            }
        }).catch(err => {
            console.log(err);
            navigate("/" + pageLanguage);
        });
    };
    
    function renderModels() {
        const modelLists = [];
        for (let i = 0; i < models.length; i++) {
            let SewingModelId = models[i].Link;
            let WebsitePageItemId = models[i].WebsitePageItemId;
            let ModelName = convertToPersian(models[i].Title);
            let ModelENName = models[i].EnTitle;
            let DiscountDescription = convertToPersian(models[i].DiscountDesc);
            let DiscountEnDescription = models[i].DiscountEnDesc;
            let Description = convertToPersian(models[i].HtmlContent);
            let ENDescription = models[i].HtmlEnContent;
            let StartPrice = models[i].Price;
            let DiscountPrice = models[i].DiscountPrice;
            let PhotoUrl = models[i].ImageUrl;
            let DefaultFabricPhotoUrl = models[i].MainImageUrl;
            let discount = StartPrice !== DiscountPrice;
            
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
                    {SewingModelId === "0099" &&
                        <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/Selection"} className={`model_image_container`} onClick={() => sessionStorage.clear()}>
                            <img src={PhotoUrl === null ? `${process.env.PUBLIC_URL}/no_image.svg` : `https://api.atlaspood.ir${PhotoUrl}`} className="img-fluid" alt=""/>
                        </Link>
                    }
                    {SewingModelId !== "0099" &&
                        <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId} className={`model_image_container`} onClick={() => sessionStorage.clear()}>
                            <img src={PhotoUrl === null ? `${process.env.PUBLIC_URL}/no_image.svg` : `https://api.atlaspood.ir${PhotoUrl}`} className="img-fluid" alt=""/>
                        </Link>
                    }
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
                            <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId + "/Page-ID/" + WebsitePageItemId}
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
                                {pageLanguage === 'en' ? parse(ENDescription, options) : parse(convertToPersian(Description), options)}
                            </div>
                            {SewingModelId==="0099" &&
                                <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/Selection"} className="btn_normal model_item_btn_normal"
                                      onClick={() => sessionStorage.clear()}>{t("Start" +
                                    " Customizing")}</Link>
                            }
                            {SewingModelId!=="0099" &&
                                <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId + "/Page-ID/" + WebsitePageItemId} className="btn_normal model_item_btn_normal"
                                      onClick={() => sessionStorage.clear()}>{t("Start" +
                                    " Customizing")}</Link>
                            }
                            
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
                <h1>{defaultModelName === undefined || defaultModelName === "" ? "" : pageLanguage === 'fa' ? convertToPersian(defaultModelNameFa): defaultModelName}</h1>
                <h2>{pageLanguage === 'fa' ?defaultDescFa:defaultDesc}</h2>
                {/*<h1>{t("model_zebra_temp1")}</h1>*/}
                {/*<h2>{t("model_zebra_temp2")}</h2>*/}
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