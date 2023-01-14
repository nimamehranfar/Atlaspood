import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {InputGroup, FormControl, Toast, ToastContainer} from "react-bootstrap"
import {Editor} from '@tinymce/tinymce-react';
import authHeader from "../Services/auth-header";
import {removeNodeAtPath} from "@nosferatu500/react-sortable-tree";
import Modal from "react-bootstrap/Modal";
import Select from "react-dropdown-select";
import CustomDropdownWithSearch from "./CustomDropdownWithSearch";
import CustomControl from "./CustomControl";
import CustomDropdownMulti from "./CustomDropdownMulti";
import CustomControlMulti from "./CustomControlMulti";
import LoadingOverlay from 'react-loading-overlay';
import {refreshToken} from "../Services/auth.service";
import {ShowLogin2Modal} from "../Actions/types";
import GetPrice from "./GetPrice";
import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap
} from "react-grid-drag";

const baseURLGet = "https://api.atlaspood.ir/WebsitePageItem/GetAll";
const baseURLGetModels = "https://api.atlaspood.ir/SewingModel/GetAll";
const baseURLPost = "https://api.atlaspood.ir/WebsitePageItem/Edit";
const baseURLAdd = "https://api.atlaspood.ir/WebsitePageItem/Add";
const baseURLDeletePageItem = "https://api.atlaspood.ir/WebsitePageItem/Delete";
const baseURLFabrics = "https://api.atlaspood.ir/Sewing/GetModelFabric";

const baseURLFilterColor = "https://api.atlaspood.ir/Color/GetBaseColors";
const baseURLFilterPattern = "https://api.atlaspood.ir/BaseType/GetDesignPattern";
const baseURLFilterType = "https://api.atlaspood.ir/BaseType/GetDesignType";
const baseURLFilterPrice = "https://api.atlaspood.ir/BaseType/GetPriceLevel";

function PageItems() {
    
    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };
    
    const [pageItems, setPageItems] = React.useState([]);
    const [models, setModels] = React.useState([]);
    const [sewingColors, setSewingColors] = useState([]);
    const [sewingPatterns, setSewingPatterns] = useState([]);
    const [sewingTypes, setSewingTypes] = useState([]);
    const [sewingPrices, setSewingPrices] = useState([]);
    // const [photo, setPhoto] = React.useState([]);
    // const [ImageUrl, setImageUrl] = React.useState([]);
    // const [fabricImageUrl, setFabricImageUrl] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [pageItemsList, setPageItemsList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [showToast, setShowToast] = React.useState(false);
    const [show, setShow] = React.useState(false);
    const [showFabrics, setShowFabrics] = React.useState(false);
    const [showFabrics2, setShowFabrics2] = React.useState(false);
    const [fabricsDragList, setFabricsDragList] = React.useState({});
    const [newPageItem, setNewPageItem] = React.useState({
        "Title": "",
        "EnTitle": "",
        "Price": 0,
        "DiscountPrice": 0,
        "DiscountPercent": 0,
        "DiscountDesc": null,
        "DiscountEnDesc": null,
        "ImageFile": null,
        "ImageUrl": null,
        "OverImage": null,
        "OverImageUrl": null,
        "MainImageFile": null,
        "MainImageUrl": null,
        "Link": "",
        "QueryString": "",
        "HtmlContent": "",
        "HtmlEnContent": ""
    });
    
    const [fabricsList, setFabricsList] = useState([]);
    const [fabricsButtonList, setFabricsButtonList] = useState([]);
    const [fabricDesigns, setFabricDesigns] = useState({
        "refIndex": null,
        "id": null,
        "type": null,
        "order": -1,
        "onlyOne": null,
        "fabrics": []
    });
    const [fabricOrders, setFabricOrders] = useState({
        "refIndex": null,
        "id": null,
        "type": null,
        "order": -1,
        "fabrics": []
    });
    
    const [fabricChanged, setFabricChanged] = useState({
        "refIndex": -1,
        "fabrics": [],
        "save": false,
        "clear": false
    });
    
    const DesignType = [
        {value: 'none', label: 'none'},
        {value: 'Base', label: 'Base'},
        {value: 'Decorative', label: 'Decorative'}
    ];
    
    function convertToPersian(string_farsi) {
        let tempString = string_farsi.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace('ك', 'ک');
        return tempString;
    }
    
    function dragOnChange(sourceId, sourceIndex, targetIndex, targetId,key) {
        let temp = JSON.parse(JSON.stringify(fabricsDragList));
        const nextState = swap(temp[key], sourceIndex, targetIndex);
        temp[key]=nextState
        setFabricsDragList(temp);
    }
    
    function getPageItems() {
        axios.get(baseURLGet, {
            headers: authHeader()
        }).then((response) => {
            let arr = response.data;
            setPageItems(arr);
        }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        getPageItems();
                    } else {
                    }
                });
            } else {
                console.log("failed");
            }
        });
        
    }
    
    function getSelections() {
        
        let promiseArr = [];
        promiseArr[0] = new Promise((resolve, reject) => {
            axios.get(baseURLGetModels).then((response) => {
                let tempArr = [];
                response.data.forEach(el => {
                    if (el["SewingModelId"] && el["ModelENName"]) {
                        tempArr.push({
                            value: el["SewingModelId"],
                            label: el["ModelENName"]
                        });
                    }
                });
                // console.log(response.data,tempArr);
                setModels(tempArr);
                resolve();
            }).catch(err => {
                if (err.response.status === 401) {
                    refreshToken().then((response2) => {
                        if (response2 !== false) {
                            getSelections();
                        } else {
                        }
                    });
                } else {
                    console.log("failed");
                }
                reject();
            });
        });
        promiseArr[1] = new Promise((resolve, reject) => {
            axios.get(baseURLFilterColor).then((response) => {
                let tempArr = [];
                response.data.forEach(el => {
                    if (el["ColorId"] && el["ColorENName"]) {
                        tempArr.push({value: el["ColorId"].toString(), label: el["ColorENName"]});
                    }
                });
                // console.log(response.data,tempArr);
                setSewingColors(tempArr);
                resolve();
            }).catch(err => {
                console.log(err);
                reject();
            });
        });
        promiseArr[2] = new Promise((resolve, reject) => {
            axios.get(baseURLFilterPattern).then((response) => {
                let tempArr = [];
                response.data.forEach(el => {
                    if (el["BaseTypeDetailId"] && el["ENName"]) {
                        tempArr.push({value: el["BaseTypeDetailId"].toString(), label: el["ENName"]});
                    }
                });
                // console.log(response.data,tempArr);
                setSewingPatterns(tempArr);
                resolve();
            }).catch(err => {
                console.log(err);
                reject();
            });
        });
        promiseArr[3] = new Promise((resolve, reject) => {
            axios.get(baseURLFilterType).then((response) => {
                let tempArr = [];
                response.data.forEach(el => {
                    if (el["BaseTypeDetailId"] && el["ENName"]) {
                        tempArr.push({value: el["BaseTypeDetailId"].toString(), label: el["ENName"]});
                    }
                });
                // console.log(response.data,tempArr);
                setSewingTypes(tempArr);
                resolve();
            }).catch(err => {
                console.log(err);
                reject();
            });
        });
        promiseArr[4] = new Promise((resolve, reject) => {
            axios.get(baseURLFilterPrice).then((response) => {
                let tempArr = [];
                response.data.forEach(el => {
                    if (el["ProductPriceLevelId"] && el["LevelEnTitle"]) {
                        tempArr.push({value: el["ProductPriceLevelId"].toString(), label: el["LevelEnTitle"]});
                    }
                });
                // console.log(response.data,tempArr);
                setSewingPrices(tempArr);
                resolve();
            }).catch(err => {
                console.log(err);
                reject();
            });
        });
        Promise.all(promiseArr).then(function (values) {
            getPageItems();
        });
        
    }
    
    function renderPageItems() {
        const pageItemsLists = [];
        for (let i = 0; i < pageItems.length; i++) {
            let WebsitePageItemId = pageItems[i].WebsitePageItemId;
            let Title = pageItems[i].Title;
            let EnTitle = pageItems[i].EnTitle;
            let DiscountDesc = pageItems[i].DiscountDesc;
            let DiscountEnDesc = pageItems[i].DiscountEnDesc;
            let HtmlContent = pageItems[i].HtmlContent ? pageItems[i].HtmlContent : "";
            let HtmlEnContent = pageItems[i].HtmlEnContent ? pageItems[i].HtmlEnContent : "";
            let Price = pageItems[i].Price;
            let DiscountPrice = pageItems[i].DiscountPrice;
            let DiscountPercent = pageItems[i].DiscountPercent;
            let ImageUrl = pageItems[i].ImageUrl;
            let MainImageUrl = pageItems[i].MainImageUrl;
            
            let UrlLink = pageItems[i].Link ? pageItems[i].Link : "";
            let UrlLinkArr = UrlLink.split('/');
            let Link = UrlLinkArr[0] ? UrlLinkArr[0] : "";
            let selectedModel = models.find(opt => opt.value === Link) ? [{"value": Link, "label": models.find(opt => opt.value === Link).label}] : []
            let SpecialId = UrlLinkArr[1] ? UrlLinkArr[1] : "";
            
            let ModelDesigns = pageItems[i].ModelDesigns ? pageItems[i].ModelDesigns : [];
            let Fabrics = pageItems[i].Fabrics ? pageItems[i].Fabrics : {};
            
            let Parameters = pageItems[i].Parameters ? pageItems[i].Parameters : "{}";
            
            let QueryString = pageItems[i].QueryString ? pageItems[i].QueryString : "";
            if (i === 0) {
                // console.log(Parameters);
            }
            
            let paramColorsArr = QueryString.split('colors=');
            paramColorsArr = paramColorsArr[1] ? paramColorsArr[1].split('&') : [];
            let paramColors = paramColorsArr[0] ? paramColorsArr[0] : "";
            let paramColorsSelected = paramColors.split(',').filter(n => n) ? [...new Set(paramColors.split(','))].filter(n => n).map(item => ({
                value: item,
                label: sewingColors.find(opt => opt.value === item).label
            })) : []
            
            let paramPatternsArr = QueryString.split('patterns=');
            paramPatternsArr = paramPatternsArr[1] ? paramPatternsArr[1].split('&') : [];
            let paramPatterns = paramPatternsArr[0] ? paramPatternsArr[0] : "";
            let paramPatternsSelected = paramPatterns.split(',').filter(n => n) ? [...new Set(paramPatterns.split(','))].filter(n => n).map(item => ({
                value: item,
                label: sewingPatterns.find(opt => opt.value === item).label
            })) : []
            
            
            let paramTypesArr = QueryString.split('types=');
            paramTypesArr = paramTypesArr[1] ? paramTypesArr[1].split('&') : [];
            let paramTypes = paramTypesArr[0] ? paramTypesArr[0] : "";
            let paramTypesSelected = paramTypes.split(',').filter(n => n) ? [...new Set(paramTypes.split(','))].filter(n => n).map(item => ({
                value: item,
                label: sewingTypes.find(opt => opt.value === item).label
            })) : []
            
            let paramPricesArr = QueryString.split('prices=');
            paramPricesArr = paramPricesArr[1] ? paramPricesArr[1].split('&') : [];
            let paramPrices = paramPricesArr[0] ? paramPricesArr[0] : "";
            let paramPricesSelected = paramPrices.split(',').filter(n => n) ? [...new Set(paramPrices.split(','))].filter(n => n).map(item => ({
                value: item,
                label: sewingPrices.find(opt => opt.value === item).label
            })) : []
            
            let paramDesignsArr;
            let paramDesigns;
            let paramDesignsSelected;
            if (ModelDesigns.length) {
                paramDesignsArr = QueryString.split('designs=');
                paramDesignsArr = paramDesignsArr[1] ? paramDesignsArr[1].split('&') : [];
                paramDesigns = paramDesignsArr[0] ? paramDesignsArr[0] : "";
                paramDesignsSelected = paramDesigns.split(',').filter(n => n) ? [...new Set(paramDesigns.split(','))].filter(n => n).map(item => ({
                    value: item,
                    label: ModelDesigns.find(opt => opt.value === item) ? ModelDesigns.find(opt => opt.value === item).label : ""
                })) : []
            }
            
            // if(i===0)
            //     console.log(paramDesignsSelected);
            
            pageItemsLists.push(
                <li className={searchQuery && searchQuery !== "" && !(EnTitle.toLowerCase().includes(searchQuery.toLowerCase()) || Title.includes(searchQuery)) ? "list_item_disappear" : ""}
                    key={"pageItems" + i} pageitems_id={i}>
                    <span className="li_label">Page-Item ID:{WebsitePageItemId}</span>
                    <div className="pageItems_small_inputs">
                        {/*<label className="input">*/}
                        {/*    <input type="text" pageitems_text_id="WebsitePageItemId" pageitems_id={i} defaultValue={WebsitePageItemId} onChange={e => textChanged(e)}*/}
                        {/*           placeholder="Type Something..." readOnly/>*/}
                        {/*    <span className="input__label">PageItems ID</span>*/}
                        {/*</label>*/}
                        <label className="input">
                            <input type="text" pageitems_text_id="Title" pageitems_id={i} defaultValue={Title} onChange={e => textChanged(e)} placeholder="Type Something..."/>
                            <span className="input__label">PageItems FA Name</span>
                        </label>
                        <label className="input">
                            <input type="text" pageitems_text_id="EnTitle" pageitems_id={i} defaultValue={EnTitle} onChange={e => textChanged(e)} placeholder="Type Something..."/>
                            <span className="input__label">PageItems EN Name</span>
                        </label>
                        <label className="input">
                            <input type="text" className="dir_rtl" pageitems_text_id="DiscountDesc" pageitems_id={i} defaultValue={DiscountDesc} onChange={e => textChanged(e)}
                                   placeholder="شروع به نوشتن کنید..."/>
                            <span className="input__label">Desc Above Price FA</span>
                        </label>
                        <label className="input">
                            <input type="text" pageitems_text_id="DiscountEnDesc" pageitems_id={i} defaultValue={DiscountEnDesc} onChange={e => textChanged(e)}
                                   placeholder="Type Something..."/>
                            <span className="input__label">Desc Above Price EN</span>
                        </label>
                    </div>
                    <div className="pageItems_small_inputs">
                        <label className="input">
                            <input type="text" pageitems_text_id="Price" pageitems_id={i} defaultValue={Price} onChange={e => numberChanged(e)} placeholder="Type Something..."/>
                            <span className="input__label">Price</span>
                        </label>
                        
                        <label className="input">
                            <input type="text" pageitems_text_id="DiscountPrice" pageitems_id={i} defaultValue={DiscountPrice} onChange={e => numberChanged(e)}
                                   placeholder="Type Something..."/>
                            <span className="input__label">Discount Price {DiscountPercent ? "(" + DiscountPercent + "%)" : ""}</span>
                        </label>
                        <div className="input_file">
                            <label className="input_file_label">Main Photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                pageitems_text_id="ImageFile"
                                pageitems_id={i}
                                multiple={false}
                                onChange={e => updatePicture(e)}
                            />
                        </div>
                        <div className="input_file">
                            <label className="input_file_label">Fabric Photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                pageitems_text_id="MainImageFile"
                                pageitems_id={i}
                                multiple={false}
                                onChange={e => updatePicture(e)}
                            />
                        </div>
                    
                    </div>
                    <div className="pageItems_large_inputs">
                        <label className="input editor_container">
                            <Editor
                                apiKey="3uw03r5df0osn2rjhclnqcli0o4aehyx3sbmipq9aege3f81"
                                onInit={(evt, editor) => editorRef.current = editor}
                                value={HtmlContent}
                                onEditorChange={(newText) => textEditorChanged(newText, i, "HtmlContent")}
                                init={{
                                    height: 215,
                                    menubar: false,
                                    plugins: [
                                        'lists',
                                        'insertdatetime paste wordcount'
                                    ],
                                    toolbar: 'formatselect | ' +
                                        'bold italic | bullist | numlist outdent indent | ' +
                                        'removeformat',
                                    content_style: 'body { font-family: iransans, sans-serif; font-size:14px; direction:rtl; } p{margin-block-end: 0;}'
                                }}
                            
                            />
                            <span className="input__label">FA HtmlContent</span>
                        </label>
                    </div>
                    <div className="pageItems_large_inputs">
                        <label className="input editor_container">
                            <Editor
                                apiKey="3uw03r5df0osn2rjhclnqcli0o4aehyx3sbmipq9aege3f81"
                                onInit={(evt, editor) => editorRef.current = editor}
                                value={HtmlEnContent}
                                onEditorChange={(newText) => textEditorChanged(newText, i, "HtmlEnContent")}
                                init={{
                                    height: 215,
                                    menubar: false,
                                    plugins: [
                                        'lists',
                                        'insertdatetime paste wordcount'
                                    ],
                                    toolbar: 'formatselect | ' +
                                        'bold italic | bullist | numlist outdent indent | ' +
                                        'removeformat',
                                    content_style: 'body { font-family: proximanova-nova, sans-serif; font-size:14px; } p{margin-block-end: 0;}'
                                }}
                            
                            /> <span className="input__label">EN HtmlContent</span>
                        </label>
                    </div>
                    <div className="pageItems_small_inputs">
                        
                        <button className="btn btn-success mt-4 mb-2" pageitems_id={i}
                                onClick={e => updatePageItems(e)}
                        >Update Page Item
                        </button>
                        
                        <button className="btn btn-danger mt-4 mb-2" pageitems_id={i}
                                onClick={e => deletePageItems(WebsitePageItemId)}
                        >Delete Page Item
                        </button>
                        
                        {Object.keys(Fabrics).length > 0 &&
                            <button className="btn btn-primary mt-4 mb-2" pageitems_id={i}
                                    onClick={() => {
                                        if(i===0){
                                            setFabricsDragList(Fabrics);
                                            setShowFabrics2(true);
                                        }else {
                                            renderFabrics(i, "Parameters", Fabrics, Parameters);
                                        }
                                    }}
                            >Sort Fabrics
                            </button>
                        }
                    </div>
                    
                    <div className="pageItems_small_inputs pageItem_input_clearable">
                        <label className="input">
                            <input type="text" pageitems_text_id="Link" pageitems_id={i} value={UrlLink} onChange={e => textChanged(e)} placeholder="Select Below"/>
                            <span className="input__label">Link(Model/Product ID)</span>
                            <button className="clear_input" pageitems_id={i} onClick={(e) => clearField(e, i, "Link")}>Clear</button>
                        </label>
                        <div className="select_container">
                            <span className="input__label">Link(Model)</span>
                            <Select
                                className="select"
                                placeholder={"Please Select"}
                                // portal={document.body}
                                dropdownPosition="bottom"
                                dropdownHandle={false}
                                dropdownGap={0}
                                values={selectedModel}
                                onDropdownOpen={() => {
                                    let temp1 = window.scrollY;
                                    window.scrollTo(window.scrollX, window.scrollY + 1);
                                    setTimeout(() => {
                                        let temp2 = window.scrollY;
                                        if (temp2 === temp1)
                                            window.scrollTo(window.scrollX, window.scrollY - 1);
                                    }, 100);
                                }}
                                dropdownRenderer={
                                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                }
                                contentRenderer={
                                    ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                }
                                onChange={(selected) => {
                                    if (selected.length) {
                                        setSelection(i, "Link", selected[0].value);
                                        getFabrics(i, selected[0].value);
                                    }
                                }}
                                options={models}
                            />
                        </div>
                        
                        <label className="input">
                            <input type="text" defaultValue={SpecialId} onChange={e => setSelection(i, "SpecialId", e.target.value.replace(/\s/g, '').replace(/\//g, ''))}
                                   placeholder="Type Something..."/>
                            <span className="input__label">Special Id</span>
                        </label>
                    </div>
                    <div className="pageItems_large_inputs pageItems_grow pageItem_input_clearable">
                        <label className="input readOnly">
                            <input readOnly type="text" pageitems_text_id="QueryString" pageitems_id={i} value={QueryString} onChange={e => textChanged(e)}
                                   placeholder="Type Something..."/>
                            <span className="input__label">QueryString</span>
                            <button className="clear_input" pageitems_id={i} onClick={(e) => clearField(e, i, "QueryString")}>Clear</button>
                        </label>
                        <div className="pageItems_filters_container">
                            <div className="select_container multi_select_container">
                                <span className="input__label">QueryString(Colors)</span>
                                <Select
                                    className="select"
                                    placeholder={"Please Select"}
                                    // portal={document.body}
                                    dropdownPosition="bottom"
                                    dropdownHandle={false}
                                    dropdownGap={0}
                                    multi={true}
                                    values={QueryString ? paramColorsSelected : []}
                                    onDropdownOpen={() => {
                                        let temp1 = window.scrollY;
                                        window.scrollTo(window.scrollX, window.scrollY + 1);
                                        setTimeout(() => {
                                            let temp2 = window.scrollY;
                                            if (temp2 === temp1)
                                                window.scrollTo(window.scrollX, window.scrollY - 1);
                                        }, 100);
                                    }}
                                    dropdownRenderer={
                                        ({props, state, methods}) => <CustomDropdownMulti props={props} state={state} methods={methods}/>
                                    }
                                    contentRenderer={
                                        ({props, state, methods}) => <CustomControlMulti props={props} state={state} methods={methods}/>
                                    }
                                    onChange={(selected) => {
                                        setMultiSelection(i, "QueryString", "colors=", selected.map(obj => obj.value.toString()));
                                    }}
                                    options={sewingColors}
                                />
                            </div>
                            <div className="select_container multi_select_container">
                                <span className="input__label">QueryString(Patterns)</span>
                                <Select
                                    className="select"
                                    placeholder={"Please Select"}
                                    // portal={document.body}
                                    dropdownPosition="bottom"
                                    dropdownHandle={false}
                                    dropdownGap={0}
                                    multi={true}
                                    values={QueryString ? paramPatternsSelected : []}
                                    onDropdownOpen={() => {
                                        let temp1 = window.scrollY;
                                        window.scrollTo(window.scrollX, window.scrollY + 1);
                                        setTimeout(() => {
                                            let temp2 = window.scrollY;
                                            if (temp2 === temp1)
                                                window.scrollTo(window.scrollX, window.scrollY - 1);
                                        }, 100);
                                    }}
                                    dropdownRenderer={
                                        ({props, state, methods}) => <CustomDropdownMulti props={props} state={state} methods={methods}/>
                                    }
                                    contentRenderer={
                                        ({props, state, methods}) => <CustomControlMulti props={props} state={state} methods={methods}/>
                                    }
                                    onChange={(selected) => {
                                        setMultiSelection(i, "QueryString", "patterns=", selected.map(obj => obj.value.toString()));
                                    }}
                                    options={sewingPatterns}
                                />
                            </div>
                            <div className="select_container multi_select_container">
                                <span className="input__label">QueryString(Types)</span>
                                <Select
                                    className="select"
                                    placeholder={"Please Select"}
                                    // portal={document.body}
                                    dropdownPosition="bottom"
                                    dropdownHandle={false}
                                    dropdownGap={0}
                                    multi={true}
                                    values={QueryString ? paramTypesSelected : []}
                                    onDropdownOpen={() => {
                                        let temp1 = window.scrollY;
                                        window.scrollTo(window.scrollX, window.scrollY + 1);
                                        setTimeout(() => {
                                            let temp2 = window.scrollY;
                                            if (temp2 === temp1)
                                                window.scrollTo(window.scrollX, window.scrollY - 1);
                                        }, 100);
                                    }}
                                    dropdownRenderer={
                                        ({props, state, methods}) => <CustomDropdownMulti props={props} state={state} methods={methods}/>
                                    }
                                    contentRenderer={
                                        ({props, state, methods}) => <CustomControlMulti props={props} state={state} methods={methods}/>
                                    }
                                    onChange={(selected) => {
                                        setMultiSelection(i, "QueryString", "types=", selected.map(obj => obj.value.toString()));
                                    }}
                                    options={sewingTypes}
                                />
                            </div>
                            <div className="select_container multi_select_container">
                                <span className="input__label">QueryString(Prices)</span>
                                <Select
                                    className="select"
                                    placeholder={"Please Select"}
                                    // portal={document.body}
                                    dropdownPosition="bottom"
                                    dropdownHandle={false}
                                    dropdownGap={0}
                                    multi={true}
                                    values={QueryString ? paramPricesSelected : []}
                                    onDropdownOpen={() => {
                                        let temp1 = window.scrollY;
                                        window.scrollTo(window.scrollX, window.scrollY + 1);
                                        setTimeout(() => {
                                            let temp2 = window.scrollY;
                                            if (temp2 === temp1)
                                                window.scrollTo(window.scrollX, window.scrollY - 1);
                                        }, 100);
                                    }}
                                    dropdownRenderer={
                                        ({props, state, methods}) => <CustomDropdownMulti props={props} state={state} methods={methods}/>
                                    }
                                    contentRenderer={
                                        ({props, state, methods}) => <CustomControlMulti props={props} state={state} methods={methods}/>
                                    }
                                    onChange={(selected) => {
                                        setMultiSelection(i, "QueryString", "prices=", selected.map(obj => obj.value.toString()));
                                    }}
                                    options={sewingPrices}
                                />
                            </div>
                            {ModelDesigns.length > 0 &&
                                <div className="select_container multi_select_container">
                                    <span className="input__label">QueryString(Designs)</span>
                                    <Select
                                        className="select"
                                        placeholder={"Please Select"}
                                        // portal={document.body}
                                        dropdownPosition="bottom"
                                        dropdownHandle={false}
                                        dropdownGap={0}
                                        multi={true}
                                        values={QueryString ? paramDesignsSelected : []}
                                        onDropdownOpen={() => {
                                            let temp1 = window.scrollY;
                                            window.scrollTo(window.scrollX, window.scrollY + 1);
                                            setTimeout(() => {
                                                let temp2 = window.scrollY;
                                                if (temp2 === temp1)
                                                    window.scrollTo(window.scrollX, window.scrollY - 1);
                                            }, 100);
                                        }}
                                        dropdownRenderer={
                                            ({props, state, methods}) => <CustomDropdownMulti props={props} state={state} methods={methods}/>
                                        }
                                        contentRenderer={
                                            ({props, state, methods}) => <CustomControlMulti props={props} state={state} methods={methods}/>
                                        }
                                        onChange={(selected) => {
                                            setMultiSelection(i, "QueryString", "designs=", selected.map(obj => obj.value.toString()));
                                        }}
                                        options={ModelDesigns}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </li>
            );
        }
        setPageItemsList(pageItemsLists);
    }
    
    function renderFabrics(refIndex, fieldName, fabrics, Parameters) {
        setFabricsList([]);
        setFabricsButtonList([]);
        // console.log(refIndex, fieldName, fabrics, Parameters);
        setTimeout(() => {
            const fabricList = [];
            
            let parameters = JSON.parse(Parameters === undefined || Parameters === null || Parameters === "undefined" || Parameters === "null" || Parameters === "" ? "{}" : Parameters);
            // console.log(Parameters);
            
            Object.keys(fabrics).forEach((key, index) => {
                let DesignEnName = fabrics[key][0]["DesignEnName"];
                let DesignCode = fabrics[key][0]["DesignCode"].toString();
                let designTypeSelected = parameters["Designs"] && parameters["Designs"][DesignCode] && parameters["Designs"][DesignCode]["type"] ?
                    [{
                        value: parameters["Designs"][DesignCode]["type"].toString(),
                        label: DesignType.find(opt => opt.value === parameters["Designs"][DesignCode]["type"].toString())["label"]
                    }] : []
                
                let designOrderSelected = parameters["Designs"] && parameters["Designs"][DesignCode] && parameters["Designs"][DesignCode]["order"] ? parameters["Designs"][DesignCode]["order"] : -1;
                let designOnlyOneSelected = parameters["Designs"] && parameters["Designs"][DesignCode] && parameters["Designs"][DesignCode]["onlyOne"] ? parameters["Designs"][DesignCode]["onlyOne"] : false;
                
                const fabric = [];
                for (let j = 0; j < fabrics[key].length; j++) {
                    let FabricId = fabrics[key][j].FabricId;
                    let fabricOrderSelected = parameters["Fabrics"] && parameters["Fabrics"][FabricId] && parameters["Fabrics"][FabricId]["order"] ? parameters["Fabrics"][FabricId]["order"] : -1;
                    
                    let PhotoPath = "";
                    fabrics[key][j]["FabricPhotos"].forEach(obj => {
                        if (obj["PhotoTypeId"] === 4702)
                            PhotoPath = obj["PhotoUrl"];
                    });
                    // console.log(PhotoPath);
                    
                    let ColorEnName = fabrics[key][j]["ColorEnName"];
                    
                    if (fabricOrderSelected !== -1 && !fabric[fabricOrderSelected]) {
                        fabric[fabricOrderSelected] =
                            <div className={`radio_group`} key={"fabric" + key + j}>
                                <label>
                                    <div className="frame_img">
                                        <img className={`img-fluid`} src={`https://api.atlaspood.ir/${PhotoPath}`} alt=""/>
                                    </div>
                                </label>
                                <div className={`fabric_name_container`}>
                                    <h1>{ColorEnName}</h1>
                                    <span>
                                        <input className="page_item_fabric_order_input" type="number" defaultValue={fabricOrderSelected} onChange={e => {
                                            if (e.target.value !== "" || e.target.value !== "-1") {
                                                let temp = JSON.parse(JSON.stringify(fabricOrders));
                                                temp["refIndex"] = refIndex;
                                                temp["id"] = FabricId;
                                                temp["order"] = Math.abs(parseInt(e.target.value));
                                                temp["fabrics"] = fabrics;
                                                // console.log(temp["order"],temp["refIndex"]);
                                                setFabricOrders(temp);
                                                e.target.value = Math.abs(parseInt(e.target.value)).toString();
                                            }
                                        }}/>
                                    </span>
                                </div>
                            </div>;
                    } else {
                        let index = fabric.findIndex(Object.is.bind(null, undefined));
                        let pushIndex = index === -1 ? fabric.length : index;
                        fabric[pushIndex] =
                            <div className={`radio_group`} key={"fabric" + key + j}>
                                <label>
                                    <div className="frame_img">
                                        <img className={`img-fluid`} src={`https://api.atlaspood.ir/${PhotoPath}`} alt=""/>
                                    </div>
                                </label>
                                <div className={`fabric_name_container`}>
                                    <h1>{ColorEnName}</h1>
                                    <span>
                                <input className="page_item_fabric_order_input" type="number" defaultValue={fabricOrderSelected} onChange={e => {
                                    if (e.target.value !== "" || e.target.value !== "-1") {
                                        let temp = JSON.parse(JSON.stringify(fabricOrders));
                                        temp["refIndex"] = refIndex;
                                        temp["id"] = FabricId;
                                        temp["order"] = Math.abs(parseInt(e.target.value));
                                        temp["fabrics"] = fabrics;
                                        // console.log(temp["order"],temp["refIndex"]);
                                        setFabricOrders(temp);
                                        e.target.value = Math.abs(parseInt(e.target.value)).toString();
                                    }
                                }}/>
                            </span>
                                </div>
                            </div>;
                    }
                }
                
                if (designOrderSelected !== -1 && !fabricList[designOrderSelected]) {
                    fabricList[designOrderSelected] =
                        <div className={`material_detail`} key={"fabric" + key}>
                            <div className={`material_traits`}>
                                <span>{"DESIGN NAME"}: {DesignEnName}</span>
                                <span>
                                    <div className="select_container">
                                        <Select
                                            className="select"
                                            placeholder={"Please Select"}
                                            // portal={document.body}
                                            dropdownPosition="bottom"
                                            dropdownHandle={false}
                                            dropdownGap={0}
                                            values={designTypeSelected}
                                            onDropdownOpen={() => {
                                                let temp1 = window.scrollY;
                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                setTimeout(() => {
                                                    let temp2 = window.scrollY;
                                                    if (temp2 === temp1)
                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                }, 100);
                                            }}
                                            dropdownRenderer={
                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                            }
                                            contentRenderer={
                                                ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                            }
                                            onChange={(selected) => {
                                                if (selected.length) {
                                                    let temp = JSON.parse(JSON.stringify(fabricDesigns));
                                                    temp["refIndex"] = refIndex;
                                                    temp["id"] = DesignCode;
                                                    temp["type"] = selected[0]["value"];
                                                    temp["fabrics"] = fabrics;
                                                    setFabricDesigns(temp);
                                                }
                                            }}
                                            options={DesignType}
                                        />
                                    </div>
                                </span>
                                <span>
                                    <input className="page_item_fabric_order_input" type="number" defaultValue={designOrderSelected} onChange={e => {
                                        if (e.target.value !== "" || e.target.value !== "-1") {
                                            let temp = JSON.parse(JSON.stringify(fabricDesigns));
                                            temp["refIndex"] = refIndex;
                                            temp["id"] = DesignCode;
                                            temp["order"] = Math.abs(parseInt(e.target.value));
                                            temp["fabrics"] = fabrics;
                                            setFabricDesigns(temp);
                                            e.target.value = Math.abs(parseInt(e.target.value)).toString();
                                        }
                                    }}/>
                                </span>
                                <span>
                                    <div className="checkbox_style">
                                        <input type="checkbox" defaultChecked={designOnlyOneSelected} onChange={(e) => {
                                            if (e.target.checked) {
                                                let temp = JSON.parse(JSON.stringify(fabricDesigns));
                                                temp["refIndex"] = refIndex;
                                                temp["id"] = DesignCode;
                                                temp["onlyOne"] = true;
                                                temp["fabrics"] = fabrics;
                                                setFabricDesigns(temp);
                                            } else {
                                                let temp = JSON.parse(JSON.stringify(fabricDesigns));
                                                temp["refIndex"] = refIndex;
                                                temp["id"] = DesignCode;
                                                temp["onlyOne"] = false;
                                                temp["fabrics"] = fabrics;
                                                setFabricDesigns(temp);
                                            }
                                        }} id={DesignEnName+key}/>
                                        <label htmlFor={DesignEnName+key} className="checkbox_label">
                                            <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')}
                                                 alt=""/>
                                        </label>
                                        <span className="checkbox_text">Only 1 Design</span>
                                    </div>
                                </span>
                            </div>
                            {fabric}
                        </div>;
                } else {
                    let index = fabricList.findIndex(Object.is.bind(null, undefined));
                    let pushIndex = index === -1 ? fabricList.length : index;
                    fabricList[pushIndex] =
                        <div className={`material_detail`} key={"fabric" + key}>
                            <div className={`material_traits`}>
                                <span>{"DESIGN NAME"}: {DesignEnName}</span>
                                <span>
                                    <div className="select_container">
                                        <Select
                                            className="select"
                                            placeholder={"Please Select"}
                                            // portal={document.body}
                                            dropdownPosition="bottom"
                                            dropdownHandle={false}
                                            dropdownGap={0}
                                            values={designTypeSelected}
                                            onDropdownOpen={() => {
                                                let temp1 = window.scrollY;
                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                setTimeout(() => {
                                                    let temp2 = window.scrollY;
                                                    if (temp2 === temp1)
                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                }, 100);
                                            }}
                                            dropdownRenderer={
                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                            }
                                            contentRenderer={
                                                ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                            }
                                            onChange={(selected) => {
                                                if (selected.length) {
                                                    let temp = JSON.parse(JSON.stringify(fabricDesigns));
                                                    temp["refIndex"] = refIndex;
                                                    temp["id"] = DesignCode;
                                                    temp["type"] = selected[0]["value"];
                                                    temp["fabrics"] = fabrics;
                                                    setFabricDesigns(temp);
                                                }
                                            }}
                                            options={DesignType}
                                        />
                                    </div>
                                </span>
                                <span>
                                    <input className="page_item_fabric_order_input" type="number" defaultValue={designOrderSelected} onChange={e => {
                                        if (e.target.value !== "" || e.target.value !== "-1") {
                                            let temp = JSON.parse(JSON.stringify(fabricDesigns));
                                            temp["refIndex"] = refIndex;
                                            temp["id"] = DesignCode;
                                            temp["order"] = Math.abs(parseInt(e.target.value));
                                            temp["fabrics"] = fabrics;
                                            setFabricDesigns(temp);
                                            e.target.value = Math.abs(parseInt(e.target.value)).toString();
                                        }
                                    }}/>
                                </span>
                                <span>
                                    <div className="checkbox_style">
                                        <input type="checkbox" defaultChecked={designOnlyOneSelected} onChange={(e) => {
                                            if (e.target.checked) {
                                                let temp = JSON.parse(JSON.stringify(fabricDesigns));
                                                temp["refIndex"] = refIndex;
                                                temp["id"] = DesignCode;
                                                temp["onlyOne"] = true;
                                                temp["fabrics"] = fabrics;
                                                setFabricDesigns(temp);
                                            } else {
                                                let temp = JSON.parse(JSON.stringify(fabricDesigns));
                                                temp["refIndex"] = refIndex;
                                                temp["id"] = DesignCode;
                                                temp["onlyOne"] = false;
                                                temp["fabrics"] = fabrics;
                                                setFabricDesigns(temp);
                                            }
                                        }} id={DesignEnName+key}/>
                                        <label htmlFor={DesignEnName+key} className="checkbox_label">
                                            <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')}
                                                 alt=""/>
                                        </label>
                                        <span className="checkbox_text">Only 1 Design</span>
                                    </div>
                                </span>
                            </div>
                            {fabric}
                        </div>;
                }
            });
            let fabricsButtonList=[];
    
            fabricsButtonList[0] =
                <button className="btn btn-primary mt-4 mb-2" key={"button1"}
                        onClick={e => {
                            let temp = JSON.parse(JSON.stringify(fabricChanged));
                            temp["refIndex"] = refIndex;
                            temp["fabrics"] = fabrics;
                            setFabricChanged(temp)
                        }}
                >Apply
                </button>;
            fabricsButtonList[1] =
                <button className="btn btn-success mt-4 mb-2" key={"button2"}
                        onClick={e => {
                            let temp = JSON.parse(JSON.stringify(fabricChanged));
                            temp["refIndex"] = refIndex;
                            temp["save"] = true;
                            setFabricChanged(temp)
                            setShowFabrics(false);
                        }}
                >Save
                </button>;
            fabricsButtonList[2] =
                <button className="btn btn-warning mt-4 mb-2" key={"button3"}
                        onClick={e => {
                            let temp = JSON.parse(JSON.stringify(fabricChanged));
                            temp["refIndex"] = refIndex;
                            temp["clear"] = true;
                            setFabricChanged(temp)
                            setShowFabrics(false);
                        }}
                >Clear
                </button>;
            setFabricsList(fabricList);
            setFabricsButtonList(fabricsButtonList);
            setShowFabrics(true);
        }, 1000);
    }
    
    function getFabrics(refIndex, modelID) {
        let tempPageItems = JSON.parse(JSON.stringify(pageItems));
        axios.get(baseURLFabrics, {
            params: {
                modelId: modelID
            }
        }).then((response) => {
            let tempArr = [];
            response.data.forEach(obj => {
                if (obj["DesignEnName"] && obj["DesignCode"]) {
                    tempArr.push({value: obj["DesignCode"].toString(), label: obj["DesignEnName"]});
                }
            });
            tempArr = [...new Set(tempArr.map(obj => JSON.stringify(obj)))].map(obj => JSON.parse(obj))
            // console.log(response.data,tempArr);
            tempPageItems[refIndex]["ModelDesigns"] = tempArr;
            // tempPageItems[refIndex]["QueryString"] = "";
            
            let tempFabrics = {};
            response.data.forEach(obj => {
                if (tempFabrics[obj["DesignEnName"]] === "" || tempFabrics[obj["DesignEnName"]] === undefined || tempFabrics[obj["DesignEnName"]] === null || tempFabrics[obj["DesignEnName"]] === [])
                    tempFabrics[obj["DesignEnName"]] = [];
                tempFabrics[obj["DesignEnName"]].push(obj);
            });
            tempPageItems[refIndex]["Fabrics"] = tempFabrics;
            setPageItems(tempPageItems);
        }).catch(err => {
            console.log(err);
        });
    }
    
    function deletePageItems(id) {
        axios.delete(baseURLDeletePageItem, {
            params: {
                id: id
            },
            headers: authHeader()
        }).then((response) => {
            getPageItems();
            setShowToast(true);
        }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        deletePageItems(id);
                    } else {
                        setIsLoading(false);
                    }
                });
            } else {
                setIsLoading(false);
                console.log("failed");
            }
        });
    }
    
    function updatePageItems(e, refIndex, delField) {
        const tempPageItems = [...pageItems];
        let postpageItemsArray = 0;
        if (refIndex !== undefined) {
            postpageItemsArray = tempPageItems[refIndex];
        } else {
            postpageItemsArray = tempPageItems[e.target.getAttribute('pageitems_id')];
        }
        const formData = new FormData();
        // formData.append("ApiKey", window.$apikey);
        formData.append("WebsitePageItemId", postpageItemsArray['WebsitePageItemId']);
        formData.append("Title", postpageItemsArray['Title']);
        formData.append("EnTitle", postpageItemsArray['EnTitle']);
        formData.append("HtmlContent", postpageItemsArray['HtmlContent']);
        formData.append("HtmlEnContent", postpageItemsArray['HtmlEnContent']);
        formData.append("DiscountDesc", postpageItemsArray['DiscountDesc']);
        formData.append("DiscountEnDesc", postpageItemsArray['DiscountEnDesc']);
        formData.append("Link", postpageItemsArray['Link']);
        formData.append("QueryString", postpageItemsArray['QueryString']);
        formData.append("Parameters", postpageItemsArray['Parameters']);
        // console.log(postpageItemsArray);
        
        if (postpageItemsArray['Price'] === null || postpageItemsArray['Price'] === undefined || postpageItemsArray['Price'] === "") {
            formData.append("Price", 0);
        } else {
            formData.append("Price", postpageItemsArray['Price']);
        }
        if (postpageItemsArray['DiscountPrice'] === null || postpageItemsArray['DiscountPrice'] === undefined || postpageItemsArray['DiscountPrice'] === "") {
            formData.append("DiscountPrice", 0);
        } else {
            formData.append("DiscountPrice", postpageItemsArray['DiscountPrice']);
        }
        if (postpageItemsArray['Price'] || postpageItemsArray['DiscountPrice']) {
            formData.append("DiscountPercent", parseInt(((1 - postpageItemsArray['DiscountPrice'] / postpageItemsArray['Price']) * 100).toFixed(2)));
        } else {
            formData.append("DiscountPercent", 0);
        }
        if (postpageItemsArray['ImageFile'] === null || postpageItemsArray['ImageFile'] === undefined) {
            formData.append("ImageUrl", postpageItemsArray['ImageUrl']);
            formData.append("ImageFile", null);
        } else {
            formData.append("ImageFile", postpageItemsArray['ImageFile']);
            formData.append("ImageUrl", null);
        }
        if (postpageItemsArray['MainImageFile'] === null || postpageItemsArray['MainImageFile'] === undefined) {
            formData.append("MainImageUrl", postpageItemsArray['MainImageUrl']);
            formData.append("MainImageFile", null);
        } else {
            formData.append("MainImageFile", postpageItemsArray['MainImageFile']);
            formData.append("MainImageUrl", null);
        }
        formData.delete(delField);
        // console.log(postpageItemsArray);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                ...authHeader()
            }
        };
        setIsLoading(true);
        axios.post(baseURLPost, formData, config)
            .then(() => {
                setShowToast(true);
                getPageItems();
                setIsLoading(false);
            }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        updatePageItems(e, refIndex, delField)
                    } else {
                        setIsLoading(false);
                    }
                });
            } else {
                setIsLoading(false);
                console.log("failed");
            }
        });
    }
    
    function addPageItems() {
        let postpageItemsArray = JSON.parse(JSON.stringify(newPageItem));
        const formData = new FormData();
        // formData.append("ApiKey", window.$apikey);
        formData.append("WebsitePageItemId", postpageItemsArray['WebsitePageItemId']);
        formData.append("Title", postpageItemsArray['Title']);
        formData.append("EnTitle", postpageItemsArray['EnTitle']);
        formData.append("HtmlContent", postpageItemsArray['HtmlContent']);
        formData.append("HtmlEnContent", postpageItemsArray['HtmlEnContent']);
        formData.append("DiscountDesc", postpageItemsArray['DiscountDesc']);
        formData.append("DiscountEnDesc", postpageItemsArray['DiscountEnDesc']);
        formData.append("Link", "");
        formData.append("QueryString", "");
        
        if (postpageItemsArray['Price'] === null || postpageItemsArray['Price'] === undefined || postpageItemsArray['Price'] === "") {
            formData.append("Price", 0);
        } else {
            formData.append("Price", postpageItemsArray['Price']);
        }
        if (postpageItemsArray['DiscountPrice'] === null || postpageItemsArray['DiscountPrice'] === undefined || postpageItemsArray['DiscountPrice'] === "") {
            formData.append("DiscountPrice", 0);
        } else {
            formData.append("DiscountPrice", postpageItemsArray['DiscountPrice']);
        }
        if (postpageItemsArray['Price'] || postpageItemsArray['DiscountPrice']) {
            formData.append("DiscountPercent", parseInt(((1 - postpageItemsArray['DiscountPrice'] / postpageItemsArray['Price']) * 100).toFixed(2)));
        } else {
            formData.append("DiscountPercent", 0);
        }
        if (postpageItemsArray['ImageFile'] === null || postpageItemsArray['ImageFile'] === undefined) {
            formData.append("ImageUrl", postpageItemsArray['ImageUrl']);
            formData.append("ImageFile", null);
        } else {
            formData.append("ImageFile", postpageItemsArray['ImageFile']);
            formData.append("ImageUrl", null);
        }
        if (postpageItemsArray['MainImageFile'] === null || postpageItemsArray['MainImageFile'] === undefined) {
            formData.append("MainImageUrl", postpageItemsArray['MainImageUrl']);
            formData.append("MainImageFile", null);
        } else {
            formData.append("MainImageFile", postpageItemsArray['MainImageFile']);
            formData.append("MainImageUrl", null);
        }
        console.log(newPageItem);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                ...authHeader()
            }
        };
        setIsLoading(true);
        axios.post(baseURLAdd, formData, config)
            .then(() => {
                setShowToast(true);
                handleClose();
                getPageItems();
                setIsLoading(false);
            }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        addPageItems();
                    } else {
                        setIsLoading(false);
                    }
                });
            } else {
                setIsLoading(false);
                console.log("failed");
            }
        });
        
    }
    
    function updatePicture(e, isAdd) {
        if (isAdd) {
            let file = e.target.files[0];
            let tempPageItem = JSON.parse(JSON.stringify(newPageItem));
            tempPageItem[e.target.getAttribute('pageitems_text_id')] = file;
            setNewPageItem(tempPageItem);
        } else {
            let file = e.target.files[0];
            const tempPageItems = [...pageItems];
            tempPageItems[e.target.getAttribute('pageitems_id')][e.target.getAttribute('pageitems_text_id')] = file;
            setPageItems(tempPageItems);
        }
    }
    
    function textEditorChanged(tempText, i, pageitems_text_id, isAdd) {
        if (isAdd) {
            let tempPageItem = JSON.parse(JSON.stringify(newPageItem));
            tempPageItem[pageitems_text_id] = convertToPersian(tempText);
            setNewPageItem(tempPageItem);
        } else {
            const tempPageItems = [...pageItems];
            tempPageItems[i][pageitems_text_id] = convertToPersian(tempText);
            setPageItems(tempPageItems);
            // console.log(pageItems)
        }
    }
    
    function textChanged(e, isAdd) {
        if (isAdd) {
            let tempPageItem = JSON.parse(JSON.stringify(newPageItem));
            tempPageItem[e.target.getAttribute('pageitems_text_id')] = e.target.value;
            setNewPageItem(tempPageItem);
        } else {
            const tempPageItems = [...pageItems];
            tempPageItems[e.target.getAttribute('pageitems_id')][e.target.getAttribute('pageitems_text_id')] = e.target.value;
            setPageItems(tempPageItems);
            // console.log(pageItems)
        }
    }
    
    function clearField(e, refIndex, fieldName) {
        const tempPageItems = [...pageItems];
        tempPageItems[refIndex][fieldName] = "";
        setPageItemsList([]);
        updatePageItems(e, refIndex)
        // setPageItems(tempPageItems);
    }
    
    function setSelection(refIndex, fieldName, value, isAdd) {
        if (isAdd) {
        
        } else {
            const tempPageItems = [...pageItems];
            let UrlLink = pageItems[refIndex].Link ? pageItems[refIndex].Link : "";
            let UrlLinkArr = UrlLink.split('/');
            let Link = UrlLinkArr[0] ? UrlLinkArr[0] : "";
            let SpecialId = UrlLinkArr[1] ? UrlLinkArr[1] : "";
            
            if (fieldName === "Link") {
                if (SpecialId !== "") {
                    tempPageItems[refIndex]["Link"] = value + "/" + SpecialId;
                } else {
                    tempPageItems[refIndex]["Link"] = value;
                }
            } else if (fieldName === "SpecialId") {
                if (Link !== "") {
                    tempPageItems[refIndex]["Link"] = Link + "/" + value;
                } else {
                    tempPageItems[refIndex]["Link"] = "";
                }
            } else {
                tempPageItems[refIndex]["Link"] = value;
            }
            tempPageItems[refIndex]["Link"] = tempPageItems[refIndex]["Link"].replace(/^\/|\/$/g, '');
            setPageItems(tempPageItems);
            // console.log(tempPageItems[refIndex]["Link"]);
        }
    }
    
    function setMultiSelection(refIndex, fieldName, searchQuery, value, isAdd) {
        // console.log(refIndex, fieldName, searchQuery, value, isAdd);
        if (isAdd) {
        
        } else {
            const tempPageItems = [...pageItems];
            let tempParams = tempPageItems[refIndex][fieldName] ? tempPageItems[refIndex][fieldName] : "";
            
            let allParamQueryArr = tempParams.split(searchQuery);
            let paramQueryArr = allParamQueryArr[1] ? allParamQueryArr[1].split('&') : [];
            // let paramQuery=paramQueryArr[0]?paramQueryArr[0]:"";
            // paramQuery=paramQuery+","+value;
            
            let paramQuerySelected = [...new Set(value)].filter(n => n).join(',');
            if (allParamQueryArr.length > 1) {
                paramQueryArr[0] = paramQuerySelected;
                allParamQueryArr[1] = paramQueryArr.join('&');
                if (paramQuerySelected === "") {
                    tempPageItems[refIndex][fieldName] = allParamQueryArr.join('').replace(/&$/, '').replace(/&+/g, '&').replace(/^(&)/, "");
                } else {
                    tempPageItems[refIndex][fieldName] = allParamQueryArr.join(searchQuery);
                }
            } else {
                if (tempParams !== "") {
                    if (paramQuerySelected === "") {
                        tempPageItems[refIndex][fieldName] = tempParams.replace(/&$/, '').replace(/&+/g, '&').replace(/^(&)/, "");
                    } else {
                        tempPageItems[refIndex][fieldName] = tempParams + "&" + searchQuery + paramQuerySelected;
                    }
                } else {
                    if (paramQuerySelected === "") {
                        tempPageItems[refIndex][fieldName] = "";
                    } else {
                        tempPageItems[refIndex][fieldName] = searchQuery + paramQuerySelected;
                    }
                }
            }
            
            setPageItems(tempPageItems);
            // console.log(tempPageItems,tempPageItems[refIndex][fieldName])
        }
    }
    
    function numberChanged(e, isAdd) {
        if (isAdd) {
            let tempPageItem = JSON.parse(JSON.stringify(newPageItem));
            tempPageItem[e.target.getAttribute('pageitems_text_id')] = parseInt(e.target.value);
            if (e.target.getAttribute('pageitems_text_id') === "Price" || e.target.getAttribute('pageitems_text_id') === "DiscountPrice") {
                if (tempPageItem["Price"] && tempPageItem["DiscountPrice"]) {
                    tempPageItem["DiscountPercent"] = ((1 - tempPageItem["DiscountPrice"] / tempPageItem["Price"]) * 100).toFixed(2);
                }
            }
            setNewPageItem(tempPageItem);
        } else {
            const tempPageItems = [...pageItems];
            tempPageItems[e.target.getAttribute('pageitems_id')][e.target.getAttribute('pageitems_text_id')] = parseInt(e.target.value);
            if (e.target.getAttribute('pageitems_text_id') === "Price" || e.target.getAttribute('pageitems_text_id') === "DiscountPrice") {
                if (tempPageItems[e.target.getAttribute('pageitems_id')]["Price"] && tempPageItems[e.target.getAttribute('pageitems_id')]["DiscountPrice"]) {
                    tempPageItems[e.target.getAttribute('pageitems_id')]["DiscountPercent"] = ((1 - tempPageItems[e.target.getAttribute('pageitems_id')]["DiscountPrice"] / tempPageItems[e.target.getAttribute('pageitems_id')]["Price"]) * 100).toFixed(2);
                }
            }
            setPageItems(tempPageItems);
        }
    }
    
    function handleClose() {
        setShow(false);
        setNewPageItem({
            "Title": "",
            "EnTitle": "",
            "Price": 0,
            "DiscountPrice": 0,
            "DiscountPercent": 0,
            "DiscountDesc": null,
            "DiscountEnDesc": null,
            "ImageFile": null,
            "ImageUrl": null,
            "OverImageFile": null,
            "OverImageUrl": null,
            "MainImageFile": null,
            "MainImageUrl": null,
            "Link": "",
            "QueryString": "",
            "HtmlContent": "",
            "HtmlEnContent": ""
        });
    }
    
    // useEffect(() => {
    //     getPageItems();
    // }, [models]);
    
    useEffect(() => {
        if (fabricDesigns["id"]) {
            let tempPageItems = JSON.parse(JSON.stringify(pageItems));
            
            let Parameters = tempPageItems[fabricDesigns["refIndex"]].Parameters ? tempPageItems[fabricDesigns["refIndex"]].Parameters : "{}";
            let params = JSON.parse(Parameters);
            
            if (params["Designs"]) {
                if (params["Designs"][fabricDesigns["id"]]) {
                    params["Designs"][fabricDesigns["id"]]["type"] = fabricDesigns["type"] === null ? params["Designs"][fabricDesigns["id"]]["type"] : fabricDesigns["type"];
                    params["Designs"][fabricDesigns["id"]]["order"] = fabricDesigns["order"] === -1 ? params["Designs"][fabricDesigns["id"]]["order"] : fabricDesigns["order"];
                    params["Designs"][fabricDesigns["id"]]["onlyOne"] = fabricDesigns["onlyOne"] === null ? params["Designs"][fabricDesigns["id"]]["onlyOne"] : fabricDesigns["onlyOne"];
                } else {
                    params["Designs"][fabricDesigns["id"]] = {};
                    params["Designs"][fabricDesigns["id"]]["type"] = fabricDesigns["type"] === null ? "none" : fabricDesigns["type"];
                    params["Designs"][fabricDesigns["id"]]["order"] = fabricDesigns["order"] === -1 ? -1 : fabricDesigns["order"];
                    params["Designs"][fabricDesigns["id"]]["onlyOne"] = fabricDesigns["onlyOne"] === null ? null : fabricDesigns["onlyOne"];
                }
            } else {
                params["Designs"] = {};
                params["Designs"][fabricDesigns["id"]] = {};
                params["Designs"][fabricDesigns["id"]]["type"] = fabricDesigns["type"] === null ? "none" : fabricDesigns["type"];
                params["Designs"][fabricDesigns["id"]]["order"] = fabricDesigns["order"] === -1 ? -1 : fabricDesigns["order"];
                params["Designs"][fabricDesigns["id"]]["onlyOne"] = fabricDesigns["onlyOne"] === null ? null : fabricDesigns["onlyOne"];
            }
            
            tempPageItems[fabricDesigns["refIndex"]]["Fabrics"] = fabricDesigns["fabrics"];
            tempPageItems[fabricDesigns["refIndex"]]["Parameters"] = JSON.stringify(params);
            setPageItems(tempPageItems);
        }
    }, [fabricDesigns]);
    
    useEffect(() => {
        if (fabricOrders["id"]) {
            let tempPageItems = JSON.parse(JSON.stringify(pageItems));
            
            let Parameters = tempPageItems[fabricOrders["refIndex"]].Parameters ? tempPageItems[fabricOrders["refIndex"]].Parameters : "{}";
            let params = JSON.parse(Parameters);
            
            if (params["Fabrics"]) {
                if (params["Fabrics"][fabricOrders["id"]]) {
                    params["Fabrics"][fabricOrders["id"]]["order"] = fabricOrders["order"] === -1 ? params["Designs"][fabricOrders["id"]]["order"] : fabricOrders["order"];
                } else {
                    params["Fabrics"][fabricOrders["id"]] = {};
                    params["Fabrics"][fabricOrders["id"]]["order"] = fabricOrders["order"] === -1 ? -1 : fabricOrders["order"];
                }
            } else {
                params["Fabrics"] = {};
                params["Fabrics"][fabricOrders["id"]] = {};
                params["Fabrics"][fabricOrders["id"]]["order"] = fabricOrders["order"] === -1 ? -1 : fabricOrders["order"];
            }
            
            tempPageItems[fabricOrders["refIndex"]]["Fabrics"] = fabricOrders["fabrics"];
            tempPageItems[fabricOrders["refIndex"]]["Parameters"] = JSON.stringify(params);
            setPageItems(tempPageItems);
        }
    }, [fabricOrders]);
    
    useEffect(() => {
        if (fabricChanged["refIndex"] !== -1) {
            if (fabricChanged["save"]) {
                updatePageItems(undefined, fabricChanged["refIndex"]);
                setFabricChanged({
                    "refIndex": -1,
                    "fabrics": [],
                    "save": false,
                    "clear": false
                });
                // console.log(pageItems);
            } else if (fabricChanged["clear"]) {
                let tempPageItems = JSON.parse(JSON.stringify(pageItems));
                tempPageItems[fabricChanged["refIndex"]]["Parameters"] = ""
                tempPageItems[fabricChanged["refIndex"]]["Fabrics"] = undefined;
                setPageItems(tempPageItems);
                updatePageItems(undefined, fabricChanged["refIndex"], "Parameters");
                setFabricChanged({
                    "refIndex": -1,
                    "fabrics": [],
                    "save": false,
                    "clear": false
                });
            } else {
                let tempPageItems = JSON.parse(JSON.stringify(pageItems));
                renderFabrics(fabricChanged["refIndex"], "Parameters", fabricChanged["fabrics"], tempPageItems[fabricChanged["refIndex"]]["Parameters"]);
                setFabricChanged({
                    "refIndex": -1,
                    "fabrics": [],
                    "save": false,
                    "clear": false
                });
            }
        }
    }, [fabricChanged]);
    
    useEffect(() => {
        renderPageItems();
    }, [searchQuery]);
    
    useEffect(() => {
        console.log(fabricsDragList);
    }, [fabricsDragList]);
    
    useEffect(() => {
        getSelections();
    }, []);
    
    useEffect(() => {
        if (pageItems.length) {
            renderPageItems();
        }
    }, [pageItems]);
    
    return (
        <div className="pageItems_page_container">
            <LoadingOverlay
                active={isLoading}
                spinner
                className={isLoading ? "loading_overlay" : ""}
            >
                <h1 className="pageItems_title">Page-Items List</h1>
                <div className="pageItems">
                    <ul className="pageItems_list">
                        <li className="pageItems_list_first_item">
                            <div className="pageItems_small_inputs">
                                <button className="btn btn-success mt-2 mb-2"
                                        onClick={e => setShow(true)}
                                >Add Page Item
                                </button>
                            </div>
                            <div className="pageItems_small_inputs pageItem_search">
                                <FormControl
                                    type="search"
                                    placeholder="Search Title (EN/FA)"
                                    className="me-2"
                                    aria-label="Search"
                                    onChange={e => setSearchQuery(e.target.value.toString())}
                                />
                            </div>
                        </li>
                        {pageItemsList}
                    </ul>
                </div>
                
                <Modal dialogClassName="page_item_fabric_modal" show={showFabrics} onHide={() => setShowFabrics(false)}>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="card_body card-body-fabric">
                            <div className="fabrics_list_container">
                                {fabricsList}
                                {fabricsButtonList}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
                
                <Modal dialogClassName="page_item_fabric_modal" show={showFabrics2} onHide={() => setShowFabrics2(false)}>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="card_body card-body-fabric">
                            <div className="fabrics_list_container">
                                {Object.keys(fabricsDragList).map((key, index) => {
                                    return (
                                        <div className={`material_detail`} key={"fabric" + key}>
                                            <div className={`material_traits`}>
                                                <span>{"DESIGN NAME"}: {key}</span>
                                            </div>
                                            <GridContextProvider onChange={(sourceId,sourceIndex,targetIndex,targetId)=>dragOnChange(sourceId,sourceIndex,targetIndex,targetId,key)}>
                                                <GridDropZone
                                                    id="items"
                                                    boxesPerRow={4}
                                                    rowHeight={155}
                                                    style={{ height: "465px" }}
                                                    className="drag_grid_container"
                                                >
                                                    {fabricsDragList[key] && fabricsDragList[key].map(function(item,index) {
                                                        let PhotoPath = "";
                                                        item["FabricPhotos"].forEach(obj => {
                                                            if (obj["PhotoTypeId"] === 4702)
                                                                PhotoPath = obj["PhotoUrl"];
                                                        });
                                                        return (
                                                            <GridItem key={index} className="drag_grid">
                                                                <div
                                                                    style={{
                                                                        width: "90%",
                                                                        height: "100%"
                                                                    }}
                                                                    className="radio_group"
                                                                >
                                                                    <label>
                                                                        <div className="frame_img">
                                                                            <img className={`img-fluid`} src={`https://api.atlaspood.ir/${PhotoPath}`} alt=""/>
                                                                        </div>
                                                                    </label>
                                                                    <div className={`fabric_name_container`}>
                                                                        <h1>{item["ColorEnName"]}</h1>
                                                                    </div>
                                                                </div>
                                                            </GridItem>
                                                        );
                                                    })}
                                                </GridDropZone>
                                            </GridContextProvider>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
                
                <Modal dialogClassName="newPageItemModal" show={show} onHide={() => handleClose()}>
                    {/*<Modal.Header closeButton>*/}
                    {/*</Modal.Header>*/}
                    <Modal.Body>
                        <div className="modal-header">
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => handleClose()}/>
                        </div>
                        <ul className="pageItems_list">
                            <li>
                                <div className="pageItems_small_inputs">
                                    {/*<label className="input">*/}
                                    {/*    <input type="text" pageitems_text_id="WebsitePageItemId"  defaultValue={WebsitePageItemId} onChange={e => textChanged(e)}*/}
                                    {/*           placeholder="Type Something..." readOnly/>*/}
                                    {/*    <span className="input__label">PageItems ID</span>*/}
                                    {/*</label>*/}
                                    <label className="input">
                                        <input type="text" pageitems_text_id="Title" defaultValue={newPageItem.Title} onChange={e => textChanged(e, true)}
                                               placeholder="Type Something..."/>
                                        <span className="input__label">PageItems FA Name</span>
                                    </label>
                                    <label className="input">
                                        <input type="text" pageitems_text_id="EnTitle" defaultValue={newPageItem.EnTitle} onChange={e => textChanged(e, true)}
                                               placeholder="Type Something..."/>
                                        <span className="input__label">PageItems EN Name</span>
                                    </label>
                                    <label className="input">
                                        <input type="text" className="dir_rtl" pageitems_text_id="DiscountDesc" defaultValue={newPageItem.DiscountDesc}
                                               onChange={e => textChanged(e, true)} placeholder="شروع به نوشتن کنید..."/>
                                        <span className="input__label">Desc Above Price FA</span>
                                    </label>
                                    <label className="input">
                                        <input type="text" pageitems_text_id="DiscountEnDesc" defaultValue={newPageItem.DiscountEnDesc} onChange={e => textChanged(e, true)}
                                               placeholder="Type Something..."/>
                                        <span className="input__label">Desc Above Price EN</span>
                                    </label>
                                </div>
                                <div className="pageItems_small_inputs">
                                    <label className="input">
                                        <input type="text" pageitems_text_id="Price" defaultValue={newPageItem.Price} onChange={e => numberChanged(e, true)}
                                               placeholder="Type Something..."/>
                                        <span className="input__label">Price</span>
                                    </label>
                                    
                                    <label className="input">
                                        <input type="text" pageitems_text_id="DiscountPrice" defaultValue={newPageItem.DiscountPrice} onChange={e => numberChanged(e, true)}
                                               placeholder="Type Something..."/>
                                        <span className="input__label">Discount Price {newPageItem.DiscountPercent ? "(" + newPageItem.DiscountPercent + "%)" : ""}</span>
                                    </label>
                                    <div>
                                        <label className="input_file_label">Main Photo</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            pageitems_text_id="ImageFile"
                                            
                                            multiple={false}
                                            onChange={e => updatePicture(e, true)}
                                        />
                                    </div>
                                    <div>
                                        <label className="input_file_label">Fabric Photo</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            pageitems_text_id="MainImageFile"
                                            
                                            multiple={false}
                                            onChange={e => updatePicture(e, true)}
                                        />
                                    </div>
                                
                                </div>
                                <div className="pageItems_large_inputs">
                                    <label className="input editor_container">
                                        <Editor
                                            apiKey="3uw03r5df0osn2rjhclnqcli0o4aehyx3sbmipq9aege3f81"
                                            onInit={(evt, editor) => editorRef.current = editor}
                                            value={newPageItem.HtmlContent}
                                            onEditorChange={(newText) => textEditorChanged(newText, 0, "HtmlContent", true)}
                                            init={{
                                                height: 215,
                                                menubar: false,
                                                plugins: [
                                                    'lists',
                                                    'insertdatetime paste wordcount'
                                                ],
                                                toolbar: 'formatselect | ' +
                                                    'bold italic | bullist | numlist outdent indent | ' +
                                                    'removeformat',
                                                content_style: 'body { font-family: iransans, sans-serif; font-size:14px; direction:rtl; } p{margin-block-end: 0;}'
                                            }}
                                        
                                        />
                                        <span className="input__label">FA HtmlContent</span>
                                    </label>
                                </div>
                                <div className="pageItems_large_inputs">
                                    <label className="input editor_container">
                                        <Editor
                                            apiKey="3uw03r5df0osn2rjhclnqcli0o4aehyx3sbmipq9aege3f81"
                                            onInit={(evt, editor) => editorRef.current = editor}
                                            value={newPageItem.HtmlEnContent}
                                            onEditorChange={(newText) => textEditorChanged(newText, 0, "HtmlEnContent", true)}
                                            init={{
                                                height: 215,
                                                menubar: false,
                                                plugins: [
                                                    'lists',
                                                    'insertdatetime paste wordcount'
                                                ],
                                                toolbar: 'formatselect | ' +
                                                    'bold italic | bullist | numlist outdent indent | ' +
                                                    'removeformat',
                                                content_style: 'body { font-family: proximanova-nova, sans-serif; font-size:14px; } p{margin-block-end: 0;}'
                                            }}
                                        
                                        /> <span className="input__label">EN HtmlContent</span>
                                    </label>
                                </div>
                                <div className="pageItems_small_inputs">
                                    <button className="btn btn-success mt-4 mb-2"
                                            onClick={e => addPageItems()}
                                    >ADD
                                    </button>
                                </div>
                                {/*<div className="pageItems_small_inputs">*/}
                                {/*    <label className="input">*/}
                                {/*        <input type="text" pageitems_text_id="Link" defaultValue={newPageItem.Link} onChange={e => textChanged(e, true)}*/}
                                {/*               placeholder="Type Something..."/>*/}
                                {/*        <span className="input__label">Link(Model/Product ID)</span>*/}
                                {/*    </label>*/}
                                {/*</div>*/}
                                {/*<div className="pageItems_large_inputs">*/}
                                {/*    <label className="input">*/}
                                {/*        <input type="text" pageitems_text_id="QueryString" defaultValue={newPageItem.QueryString} onChange={e => textChanged(e, true)}*/}
                                {/*               placeholder="Type Something..."/>*/}
                                {/*        <span className="input__label">QueryString</span>*/}
                                {/*    </label>*/}
                                {/*</div>*/}
                            </li>
                        </ul>
                        {/*<div className="pageItems_button_section">*/}
                        {/*    <button className="btn btn-success mt-4 mb-2"*/}
                        {/*            onClick={e => addPageItems()}*/}
                        {/*    >ADD*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                    </Modal.Body>
                    {/*<Modal.Footer>*/}
                    {/*</Modal.Footer>*/}
                </Modal>
                
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
            </LoadingOverlay>
        </div>);
}

export default PageItems;