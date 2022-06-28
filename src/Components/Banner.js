import React, {useEffect, useState} from "react";
import axios from "axios";
import {InputGroup, FormControl, Toast, ToastContainer} from "react-bootstrap"
import Form from "react-bootstrap/Form";
import Select from "react-select";

const baseURLGet = "http://api.atlaspood.ir/WebsiteSetting/GetBanner?apiKey=477f46c6-4a17-4163-83cc-29908d";
const baseURLPost = "http://api.atlaspood.ir/WebsiteSetting/SaveBanner";

function Banner() {
    
    const [banner, setBanner] = React.useState([]);
    const [bannerList, setBannerList] = React.useState([]);
    const [showToast, setShowToast] = React.useState(false);
    const [options, setOptions] =useState( []);
    
    const getOptions = () => {
        let tempArr = [];
        for (let i = 5; i < 49; i++) {
            let tempObj = {};
            tempObj["value"] = `${i}`;
            tempObj["label"] = `${i}px`;
            tempArr.push(tempObj);
        }
        setOptions(tempArr);
    };
    
    function getBanner() {
        axios.get(baseURLGet).then((response) => {
            let arr = response.data;
            setBanner(arr.banner);
        }).catch(err => {
            console.log(err);
        });
        
    }
    
    function renderBanner() {
        const bannerLists = [];
        for (let i = 0; i < banner.length; i++) {
            let text1 = banner[i].text1;
            let text2 = banner[i].text2;
            let url = banner[i].url;
            let lang = banner[i].lang;
            let oneSlide = banner[i].oneSlide;
            let fontSize = banner[i].fontSize;
            
            if (i === 0) {
                bannerLists.push(
                    <li key={"banner_oneSlide" + i} banner_id={i}>
                        <Form.Check
                            type='checkbox'
                            name="banner_type"
                            checkbox-choice="oneSlide"
                            label="All texts in 1 slide?"
                            defaultChecked={oneSlide === "true" && true}
                            onChange={(e) => {
                                const tempBanner = [...banner];
                                tempBanner.forEach(obj => {
                                    obj["oneSlide"] = `${e.target.checked}`;
                                });
                                setBanner(tempBanner);
                            }}
                        />
                    </li>
                );
            }
            
            bannerLists.push(
                <li key={"banner" + i} banner_id={i}>
                    <label className="input">
                        <input type="text" banner_text_id="text1" banner_id={i} defaultValue={text1} onChange={e => textChanged(e)} placeholder="Type Something..."/>
                        <span className="input__label">Primary Text</span>
                    </label>
                    <label className="input">
                        <input type="text" banner_text_id="text2" banner_id={i} defaultValue={text2} onChange={e => textChanged(e)} placeholder="Type Something..."/>
                        <span className="input__label">Secondary Text</span>
                    </label>
                    <label className="input">
                        {/*<input type="text"/>*/}
                        <InputGroup className="">
                            <InputGroup.Text id="basic-addon3">
                                https://doopsalta2.com/
                            </InputGroup.Text>
                            <FormControl id="basic-url" aria-describedby="basic-addon3" banner_text_id="url" banner_id={i} defaultValue={url} onChange={e => textChanged(e)}
                                         placeholder="Type Something..."/>
                        </InputGroup>
                        <span className="input__label">URL</span>
                    </label>
                    {/*<label className="input">*/}
                    {/*    <input type="text" banner_text_id="lang" banner_id={i} defaultValue={lang} onChange={e => textChanged(e)} placeholder="Type 'en' or 'fa'..."/>*/}
                    {/*    <span className="input__label">Language(en or fa)</span>*/}
                    {/*</label>*/}
                    <div className="menu_select_container">
                        <span className="input__label">Language</span>
                        <Select
                            onChange={(selected) => {
                                const tempBanner = [...banner];
                                tempBanner[i]["lang"] = selected["value"];
                                setBanner(tempBanner);
                            }}
                            options={[{value : "en", label : "en"},{value : "fa", label : "fa"}]}
                            defaultValue={{value : lang, label : lang}}
                        />
                    </div>
                    <div className="menu_select_container">
                        <span className="input__label">Font Size</span>
                        <Select
                            onChange={(selected) => {
                                const tempBanner = [...banner];
                                tempBanner[i]["fontSize"] = parseInt(selected["value"]);
                                setBanner(tempBanner);
                            }}
                            options={options}
                            defaultValue={{value : fontSize, label : `${fontSize}px`}}
                        />
                    </div>
                </li>);
        }
        setBannerList(bannerLists);
    }
    
    function updateBanner() {
        let postBannersArray = {};
        postBannersArray["Value"] = {};
        postBannersArray["Value"]["banner"] = banner;
        postBannersArray["ApiKey"] = window.$apikey;
        console.log(JSON.stringify(postBannersArray));
        axios.post(baseURLPost, postBannersArray)
            .then(() => {
                setShowToast(true);
            }).catch(err => {
            console.log(err);
        });
    }
    
    function addBanner() {
        const tempBanner = [...banner];
        tempBanner[banner.length] = {"text1": '', "text2": '', "url": 'en', "lang": 'en', "oneSlide": 'false', "fontSize": 16};
        setBanner(tempBanner);
    }
    
    function deleteBanner() {
        const tempBanner = [...banner];
        if (banner.length > 1) tempBanner.pop();
        setBanner(tempBanner);
    }
    
    function textChanged(e) {
        const tempBanner = [...banner];
        tempBanner[e.target.getAttribute('banner_id')][e.target.getAttribute('banner_text_id')] = e.target.value;
        setBanner(tempBanner);
    }
    
    useEffect(() => {
        getBanner();
        getOptions();
    }, []);
    
    useEffect(() => {
        if (banner.length) {
            renderBanner()
        }
    }, [banner]);
    
    return (<div className="banner_page_container">
        <h1 className="banner_title">Banners List</h1>
        <div className="banners">
            <ul className="banners_list">
                {bannerList}
            </ul>
            <button className="btn btn-success admin_panel_button" onClick={() => {
                addBanner()
            }}>Add
            </button>
            <button className="btn btn-danger admin_panel_button" onClick={() => {
                deleteBanner()
            }}>Delete Last
            </button>
        </div>
        <div>
            <button className="btn btn-primary admin_panel_button" onClick={() => {
                updateBanner()
            }}>Save Settings
            </button>
        </div>
        
        <ToastContainer className="p-3 position_fixed" position="top-start">
            <Toast onClose={() => setShowToast(false)} bg="success" show={showToast} delay={3000} autohide>
                <Toast.Header>
                    <img
                        src={"holder.js/20x20?text=%20"}
                        className="rounded me-2"
                        alt=""
                    />
                    <strong className="me-auto">Success</strong>
                    {/*<small>couple of seconds ago</small>*/}
                </Toast.Header>
                <Toast.Body>Saved Successfully!</Toast.Body>
            </Toast>
        </ToastContainer>
    </div>);
}

export default Banner;