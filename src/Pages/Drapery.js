import {Link, useLocation, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";


const baseURLCats = "http://atlaspood.ir/api/SewingModel/GetByCategory";

function Drapery() {
    const {t} = useTranslation();
    const location = useLocation();
    const {catID} = useParams();
    const [models, setModels] = useState([]);
    const [modelList, setModelList] = React.useState([]);
    const [pageLanguage, setPageLanguage] = React.useState("");
    
    
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
            let ModelName = models[i].ModelName;
            let ModelENName = models[i].ModelENName;
            let AbovePriceDesc = "";
            let Description = models[i].Description;
            let ENDescription = models[i].ENDescription;
            let StartPrice = models[i].StartPrice;
            let StartPrice_off = "";
            let PhotoUrl = models[i].PhotoUrl;
            let DefaultFabricPhotoUrl = models[i].DefaultFabricPhotoUrl;
            let keyFeatures = [<p key={"keyFeatures4" + i}>&nbsp;</p>];
            let keyFeaturesItem = [];
            if (keyFeatures.length !== 0) {
                keyFeatures.push(
                    <h2 key={"keyFeatures2" + i} className={`model_info_description_key_features ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>Key Features</h2>
                );
                keyFeaturesItem.push(
                    <li key={"keyFeatures" + i} model_id={i}
                        className={`model_info_description_key_features_item ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                        grommets in 5 designer finishes
                    </li>);
                keyFeaturesItem.push(
                    <li key={"keyFeatures1" + i} model_id={i}
                        className={`model_info_description_key_features_item ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                        grommets in 5 designer finishes
                    </li>);
                keyFeatures.push(
                    <ul key={"keyFeatures3" + i}>
                        {keyFeaturesItem}
                    </ul>
                );
            }
            
            modelLists.push(
                <li key={"model" + i} model_id={i} className={`${i % 2 === 0 ? "model_color_1" : "model_color_2"} ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                    <div className={`model_image_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                        <img src={PhotoUrl === null ? `${process.env.PUBLIC_URL}/no_image.svg` : `http://atlaspood.ir${PhotoUrl}`} className="img-fluid" alt=""/>
                    </div>
                    <div className={`model_info_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                        <div className={`model_info_price_title ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                            <div className={`model_info_title ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>{pageLanguage === 'en' ? ModelENName : ModelName}</div>
                            <div className={`model_info_price_section ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                                <p>20% OFF (ends 6/9)</p>
                                <h3>prices from</h3>
                                <span className={`model_info_price ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>{StartPrice} TOMANS</span>
                                <span>&nbsp;|&nbsp;</span>
                                <span className={`model_info_price_off ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>600000 TOMANS</span>
                            </div>
                        </div>
                        <div className={`model_info_description_section ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                            {pageLanguage === 'en' ? ENDescription : Description}
                            {/*<h2 className={`model_info_description_title ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>DRAMATIC WITH DEEP FOLDS</h2>*/}
                            {/*<p className={`model_info_description_body ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>Featuring hand-pressed grommets. Perfect for stylish,*/}
                            {/*    modern interiors.</p>*/}
                            {/*<div className={`model_info_description_bullets ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>*/}
                            {/*    {keyFeatures}*/}
                            {/*</div>*/}
                        </div>
                        <Link to="/" className={`btn_normal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>Start Customizing</Link>
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
        
    }, [pageLanguage]);
    
    return (
        <div className="Drapery_page_container">
            <div className="models_title_div">
                <h1>Custom Drapery</h1>
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

export default Drapery;