import React, {useEffect} from "react";
import axios from "axios";
import {InputGroup, FormControl, Toast, ToastContainer} from "react-bootstrap"

const baseURLGet = "http://atlaspood.ir/api/WebsiteSetting/GetBanner?apiKey=477f46c6-4a17-4163-83cc-29908d";
const baseURLPost = "http://atlaspood.ir/api/WebsiteSetting/SaveBanner";

function Banner() {
    const [banner, setBanner] = React.useState([]);
    const [bannerList, setBannerList] = React.useState([]);
    const [showToast, setShowToast] = React.useState(false);
    
    async function getBanner() {
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
            
            bannerLists.push(<li key={"banner" + i} banner_id={i}>
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
            </li>);
        }
        setBannerList(bannerLists);
    }
    
    function updateBanner() {
        let postBannersArray = {};
        postBannersArray["Value"] = {};
        postBannersArray["Value"]["banner"] = banner;
        postBannersArray["ApiKey"] = window.$apikey;
        axios.post(baseURLPost, postBannersArray)
            .then((response) => {
                setShowToast(true);
            }).catch(err => {
            console.log(err);
        });
    }
    
    function addBanner() {
        const tempBanner = [...banner];
        tempBanner[banner.length] = {"text1": '', "text2": '', "url": ''};
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
        
        <ToastContainer className="p-3" position="top-start">
            <Toast onClose={() => setShowToast(false)} bg="success" show={showToast} delay={3000} autohide>
                <Toast.Header>
                    <img
                        src="holder.js/20x20?text=%20"
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