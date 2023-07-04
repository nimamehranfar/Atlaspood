import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import parse, {domToReact} from 'html-react-parser';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import GetPrice from "../Components/GetPrice";
import { NumToFa,convertToPersian} from "../Components/TextTransform";

const baseURLCats = "https://api.atlaspood.ir/WebsitePage/GetDetailByName";

function CurtainSelection() {
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
            if (response.data["WebsitePageItems"].length) {
                let tempArr = [];
                let promiseArr = [];
                if (response.data["PageItems"].split(':')[1]) {
                    response.data["WebsitePageItems"].forEach((obj, index) => {
                        promiseArr[index] = new Promise((resolve, reject) => {
                            let tempSplit1 = response.data["PageItems"].split(obj["WebsitePageItemId"].toString() + ":");
                            let tempSplit2 = tempSplit1[1] ? parseInt(tempSplit1[1].split(",")[0]) : 0;
                            tempArr[tempSplit2 - 1] = obj;
                            resolve();
                        });
                    })
                    Promise.all(promiseArr).then(() => {
                        setModels(tempArr);
                    });
                } else {
                    setModels(response.data["WebsitePageItems"]);
                }
                
                setDefaultModelName(response.data["TitleEn"]);
                setDefaultModelNameFa(convertToPersian(response.data["Title"]));
                setDefaultDesc(response.data["DescriptionEn"]);
                setDefaultDescFa(convertToPersian(response.data["Description"]));
            } else {
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
            let PhotoUrl = models[i].ImageUrl;
            let pageLanguage = location.pathname.split('').slice(1, 3).join('');
            
            if (SewingModelId === "0099") {
                modelLists[0] =
                    <li key={"model" + 0} model_id={0} className={`${0 % 2 === 0 ? "model_color_1" : "model_color_2"}`}>
                        <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId + "/Drapery&Sheers" + "/Page-ID/" + WebsitePageItemId}
                              className={`model_image_container`} onClick={() => sessionStorage.clear()}>
                            <img src={PhotoUrl === null ? `${process.env.PUBLIC_URL}/no_image.svg` : `https://api.atlaspood.ir${PhotoUrl}`} className="img-fluid" alt=""/>
                        </Link>
                        <div className={`model_info_container`}>
                            <div className="model_item_info_container">
                                <div className={`model_item_info_description_section`}>
                                    {t("Drapery & Sheers")}
                                </div>
                                <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId + "/Drapery&Sheers" + "/Page-ID/" + WebsitePageItemId}
                                      className="btn_normal model_item_btn_normal"
                                      onClick={() => sessionStorage.clear()}>{t("Continue")}</Link>
                            </div>
                        </div>
                    </li>
                ;
                modelLists[1] =
                    <li key={"model" + 1} model_id={1} className={`${1 % 2 === 0 ? "model_color_1" : "model_color_2"}`}>
                        <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId + "/DraperyOnly" + "/Page-ID/" + WebsitePageItemId}
                              className={`model_image_container`} onClick={() => sessionStorage.clear()}>
                            <img src={PhotoUrl === null ? `${process.env.PUBLIC_URL}/no_image.svg` : `https://api.atlaspood.ir${PhotoUrl}`} className="img-fluid" alt=""/>
                        </Link>
                        <div className={`model_info_container`}>
                            <div className="model_item_info_container">
                                <div className={`model_item_info_description_section`}>
                                    {t("Drapery Only")}
                                </div>
                                <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId + "/DraperyOnly" + "/Page-ID/" + WebsitePageItemId}
                                      className="btn_normal model_item_btn_normal"
                                      onClick={() => sessionStorage.clear()}>{t("Continue")}</Link>
                            </div>
                        </div>
                    </li>
                ;
                modelLists[2] =
                    <li key={"model" + 2} model_id={2} className={`${2 % 2 === 0 ? "model_color_1" : "model_color_2"}`}>
                        <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId + "/SheersOnly" + "/Page-ID/" + WebsitePageItemId}
                              className={`model_image_container`} onClick={() => sessionStorage.clear()}>
                            <img src={PhotoUrl === null ? `${process.env.PUBLIC_URL}/no_image.svg` : `https://api.atlaspood.ir${PhotoUrl}`} className="img-fluid" alt=""/>
                        </Link>
                        <div className={`model_info_container`}>
                            <div className="model_item_info_container">
                                <div className={`model_item_info_description_section`}>
                                    {t("Sheers Only")}
                                </div>
                                <Link to={"/" + pageLanguage + "/Curtain/" + catID + "/" + SewingModelId + "/SheersOnly" + "/Page-ID/" + WebsitePageItemId}
                                      className="btn_normal model_item_btn_normal"
                                      onClick={() => sessionStorage.clear()}>{t("Continue")}</Link>
                            </div>
                        </div>
                    </li>
                ;
            }
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
            <div className="models_title_div">
                <h1>{defaultModelName === undefined || defaultModelName === "" ? "" : pageLanguage === 'fa' ? convertToPersian(defaultModelNameFa) : defaultModelName}</h1>
                <h2>{pageLanguage === 'fa' ? defaultDescFa : defaultDesc}</h2>
            </div>
            <div className="cat_models_list_container">
                <hr/>
                <ul className="cat_models_list_selection">
                    {modelList}
                </ul>
            </div>
        </div>
    
    );
}

export default CurtainSelection;