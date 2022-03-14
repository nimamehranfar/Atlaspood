import {Link, useLocation, useParams} from "react-router-dom";
import React, {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import {Accordion, AccordionContext, Card, useAccordionButton} from "react-bootstrap"
import ReactTooltip from 'react-tooltip';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
// import Select from 'react-select';
import Select from "react-dropdown-select";

import {ReactComponent as MountInside} from '../Images/drapery/zebra/mount_inside.svg';
import {ReactComponent as MountOutside} from '../Images/drapery/zebra/mount_outside.svg';
import Form from "react-bootstrap/Form";
import PopoverStickOnHover from "./PopoverStickOnHover";
import CustomControl from "./CustomControl";
import CustomControlMulti from "./CustomControlMulti";
import CustomDropdown from "./CustomDropdown";
import CustomDropdownMulti from "./CustomDropdownMulti";
import SelectOptionRange from "./SelectOptionRange";

import {ReactComponent as Camera} from '../Images/public/camera.svg';
import CustomDropdownWithSearch from "./CustomDropdownWithSearch";


const baseURLCats = "http://atlaspood.ir/api/SewingModel/GetByCategory";
const baseURLFabrics = "http://atlaspood.ir/api/Sewing/GetModelFabric";


function Zebra({CatID, ModelID}) {
    const {t} = useTranslation();
    const location = useLocation();
    const [catID, setCatID] = useState("");
    const [modelID, setModelID] = useState("");
    const [models, setModels] = useState([]);
    const [fabrics, setFabrics] = useState([]);
    const [fabricsList, setFabricsList] = useState([]);
    const [defaultFabricPhoto, setDefaultFabricPhoto] = useState(null);
    const [defaultModelName, setDefaultModelName] = useState("");
    const [defaultModelNameFa, setDefaultModelNameFa] = useState("");
    const [show, setShow] = useState(false);
    const [searchShow, setSearchShow] = useState(false);
    const [measurementsNextStep, setMeasurementsNextStep] = useState("4");
    const [controlTypeNextStep, setControlTypeNextStep] = useState("5");
    const [zoomModalBody, setZoomModalBody] = useState([]);
    const [pageLanguage, setPageLanguage] = useState("");
    const [accordionActiveKey, setAccordionActiveKey] = useState("");
    const [stepSelectedValue, setStepSelectedValue] = useState({});
    const [hasTrim, setHasTrim] = useState(false);
    const [detailsShow, setDetailsShow] = useState(false);
    const [stepSelectedLabel, setStepSelectedLabel] = useState({});
    const [modals, setModals] = useState([]);
    const [popoverImages, setPopoverImages] = useState([]);
    const [widthLength, setWidthLength] = useState({
        "width": "",
        "length": ""
    });
    const [leftRight, setLeftRight] = useState({
        "left": "",
        "right": ""
    });
    const [stepSelectedOptions, setStepSelectedOptions] = useState({
        "values": {},
        "labels": {}
    });
    const [selectCustomValues, setSelectCustomValues] = useState({
        "width1": [],
        "width2": [],
        "width3": [],
        "height1": [],
        "height2": [],
        "height3": []
    });
    
    const selectedTitle = useRef([]);
    const search_input = useRef(null);
    const accordion = useRef(null);
    const filterCheckboxes = useRef({
        "colors": [],
        "patterns": [],
        "types": [],
        "prices": []
    });
    
    
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
    
    const getFabrics = () => {
        axios.get(baseURLFabrics, {
            params: {
                modelId: modelID,
                apiKey: window.$apikey
            }
        }).then((response) => {
            let tempFabrics = [];
            response.data.forEach(obj => {
                if (tempFabrics[obj["DesignEnName"]] === "" || tempFabrics[obj["DesignEnName"]] === undefined || tempFabrics[obj["DesignEnName"]] === null || tempFabrics[obj["DesignEnName"]] === [])
                    tempFabrics[obj["DesignEnName"]] = [];
                tempFabrics[obj["DesignEnName"]].push(obj);
            });
            
            setFabrics(tempFabrics);
        }).catch(err => {
            console.log(err);
        });
    };
    
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
    
    function renderFabrics() {
        const fabricList = [];
        let count = 0;
        Object.keys(fabrics).forEach((key, index) => {
            let DesignName = convertToPersian(fabrics[key][0].DesignName);
            let DesignEnName = fabrics[key][0].DesignEnName;
            
            const fabric = [];
            for (let j = 0; j < fabrics[key].length; j++) {
                let FabricId = fabrics[key][j].FabricId;
                
                let PhotoPath = "";
                fabrics[key][j].FabricPhotos.forEach(obj => {
                    if (obj.PhotoTypeId === 4702)
                        PhotoPath = obj.PhotoUrl;
                });
                
                let FabricOnModelPhotoUrl = fabrics[key][j].FabricOnModelPhotoUrl;
                let HasTrim = fabrics[key][j].HasTrim;
                let DesignCode = fabrics[key][j].DesignCode;
                let DesignRaportLength = fabrics[key][j].DesignRaportLength;
                let DesignRaportWidth = fabrics[key][j].DesignRaportWidth;
                let ColorName = convertToPersian(fabrics[key][j].ColorName);
                let ColorEnName = fabrics[key][j].ColorEnName;
                
                fabric.push(
                    <div className={`radio_group ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} key={"fabric" + key + j}>
                        <label data-tip={`${pageLanguage === 'en' ? DesignEnName : DesignName}: ${pageLanguage === 'en' ? ColorEnName : ColorName}`}
                               data-for={"fabric" + key + j} className={`radio_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                               data-img={`http://www.doopsalta.com/upload/${PhotoPath}`}>
                            <ReactTooltip id={"fabric" + key + j} place="top" type="light" effect="float"/>
                            <input className="radio" type="radio" ref-num="1" default-fabric-photo={FabricOnModelPhotoUrl}
                                   onClick={e => {
                                       fabricClicked(e, HasTrim);
                                       selectChanged(e);
                                   }} name="fabric"
                                   model-id={modelID} value={pageLanguage === 'en' ? DesignEnName : DesignName} text={pageLanguage === 'en' ? DesignEnName : DesignName}/>
                            <div className="frame_img">
                                <img className="img-fluid" src={`http://atlaspood.ir/${PhotoPath}`} alt=""/>
                            </div>
                        </label>
                        <div className={`fabric_name_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                            <h1>{pageLanguage === 'en' ? ColorEnName : ColorName}</h1>
                            <span onClick={() => handleShow(PhotoPath, DesignName, DesignEnName, ColorName, ColorEnName)}><i className="fa fa-search" aria-hidden="true"/></span>
                        </div>
                        <button className={`swatchButton ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} current-state="0"
                                onClick={e => fabricSwatch(e, FabricId)}>{t("ORDER SWATCH")}</button>
                    </div>
                );
                
            }
            
            fabricList.push(
                <div className={`material_detail ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} key={"fabric" + key}>
                    <div className={`material_traits ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                        <hr/>
                        <span>{t("DESIGN NAME")}: {pageLanguage === 'en' ? DesignEnName : DesignName}</span>
                    </div>
                    {fabric}
                </div>
            );
            
        });
        setFabricsList(fabricList);
        // console.log(fabricList)
    }
    
    function handleClose() {
        setShow(false);
    }
    
    function modalHandleClose(modalName) {
        let tempModals = [...modals];
        tempModals[modalName] = false;
        setModals(tempModals);
    }
    
    function handleShow(PhotoPath, DesignName, DesignEnName, ColorName, ColorEnName) {
        const tempDiv = [];
        tempDiv.push(
            <div key={PhotoPath} className="zoomImg">
                <span className="s">{pageLanguage === 'en' ? DesignEnName : DesignName} / {pageLanguage === 'en' ? ColorEnName : ColorName}</span>
                <div className="imageContainer">
                    <img className="img-fluid hover-zoom" src={`http://atlaspood.ir/${PhotoPath}`} alt=""/>
                </div>
            </div>
        );
        setZoomModalBody(tempDiv);
        setShow(true);
    }
    
    function modalHandleShow(modalName) {
        let tempModals = [...modals];
        tempModals[modalName] = true;
        setModals(tempModals);
    }
    
    function ContextAwareToggle({stepNum, stepTitle, stepSelected, eventKey, callback}) {
        const {activeEventKey} = useContext(AccordionContext);
        
        const decoratedOnClick = useAccordionButton(
            eventKey,
            () => {
                callback && callback(eventKey);
                activeEventKey === eventKey ? setAccordionActiveKey(""):setAccordionActiveKey(eventKey);
                // setTimeout(() => {
                //     if (isCurrentEventKey)
                //         window.scrollTo(window.scrollX, window.scrollY + 0.5);
                //     else
                //         window.scrollTo(window.screenX, window.scrollY - 0.5)
                // }, 500);
            },
        );
        
        const isCurrentEventKey = activeEventKey === eventKey;
        
        return (
            <div
                className={`w-100 h-100 steps_header ${isCurrentEventKey ? 'steps_header_active' : ''}`}
                onClick={decoratedOnClick}>
                <div className="steps_header_num_container">
                    <div className="steps_header_num">{stepNum}</div>
                </div>
                <div className="steps_header_title_container">
                    <div className="steps_header_title">{stepTitle}</div>
                </div>
                <div className="steps_header_selected_container">
                    <div className="steps_header_selected" ref={ref => (selectedTitle.current[stepNum] = ref)}>{stepSelected}</div>
                </div>
            </div>
        );
    }
    
    function NextStep({children, eventKey, callback}) {
        const decoratedOnClick = useAccordionButton(
            eventKey,
            () => {
                callback && callback(eventKey);
                setAccordionActiveKey(eventKey);
                // setTimeout(() => {
                //     window.scrollTo(window.scrollX, window.scrollY + 0.5);
                // }, 500);
            },
        );
        return (
            <div className="nextStep_area">
                <div className="nextStep" onClick={decoratedOnClick}>{children}</div>
            </div>
        );
    }
    
    function clearAllFilters() {
        filterCheckboxes.current["colors"].forEach(obj => {
            if (obj !== null)
                obj.checked = false;
        });
        filterCheckboxes.current["patterns"].forEach(obj => {
            if (obj !== null)
                obj.checked = false;
        });
        filterCheckboxes.current["types"].forEach(obj => {
            if (obj !== null)
                obj.checked = false;
        });
        filterCheckboxes.current["prices"].forEach(obj => {
            if (obj !== null)
                obj.checked = false;
        });
        search_input.current.value = "";
        setSearchShow(false)
    }
    
    function clearFilters(e) {
        let refIndex = e.target.getAttribute('text');
        filterCheckboxes.current[refIndex].forEach(obj => {
            obj.checked = false;
        })
    }
    
    function popoverThumbnailHover(e) {
        let refIndex = e.target.getAttribute('text');
        let tempImages = [...popoverImages];
        tempImages[refIndex] = e.target.src;
        setPopoverImages(tempImages);
    }
    
    function optionSelectChanged_three(obj, refIndex, position, isMin, modalRef) {
        if (obj !== undefined) {
            let temp = JSON.parse(JSON.stringify(stepSelectedOptions));
            if (temp.labels[refIndex] === undefined)
                temp.labels[refIndex] = [];
            if (temp.values[refIndex] === undefined)
                temp.values[refIndex] = [];
            temp.labels[refIndex][position] = obj.label;
            temp.values[refIndex][position] = parseFloat(obj.value);
            setStepSelectedOptions(temp);
            
            if (temp.values[refIndex].filter(function (e) {
                return e
            }).length === 3) {
                let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                if (isMin)
                    tempLabels[refIndex] = temp.labels[refIndex][temp.values[refIndex].indexOf(Math.min(...temp.values[refIndex]))];
                else
                    tempLabels[refIndex] = temp.labels[refIndex][temp.values[refIndex].indexOf(Math.max(...temp.values[refIndex]))];
                setStepSelectedLabel(tempLabels);
                let minValue = Math.min(...temp.values[refIndex]);
                let maxValue = Math.max(...temp.values[refIndex]);
                if (maxValue - minValue >= 2) {
                    modalHandleShow(modalRef);
                }
            }
        }
    }
    
    function optionSelectChanged_WidthLength(obj, refIndex, isWidth) {
        if (isWidth) {
            let temp = JSON.parse(JSON.stringify(widthLength));
            temp.width = obj.label;
            setWidthLength(temp);
            
            if (temp.length !== "" && temp.width !== "") {
                let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                tempLabels[refIndex] = `Width: ${temp.width}\u00A0\u00A0\u00A0Length: ${temp.length}`;
                setStepSelectedLabel(tempLabels);
            }
        } else {
            let temp = JSON.parse(JSON.stringify(widthLength));
            temp.length = obj.label;
            setWidthLength(temp);
            
            if (temp.length !== "" && temp.width !== "") {
                let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                tempLabels[refIndex] = `Width: ${temp.width}\u00A0\u00A0\u00A0Length: ${temp.length}`;
                setStepSelectedLabel(tempLabels);
            }
        }
    }
    
    function optionSelectChanged_LeftRight(obj, refIndex, isLeft) {
        if (isLeft) {
            let temp = JSON.parse(JSON.stringify(leftRight));
            temp.left = obj.label;
            setLeftRight(temp);
            
            if (temp.right !== "" && temp.left !== "") {
                let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                tempLabels[refIndex] = `Left: ${temp.left}\u00A0\u00A0\u00A0Right: ${temp.right}`;
                setStepSelectedLabel(tempLabels);
            }
        } else {
            let temp = JSON.parse(JSON.stringify(leftRight));
            temp.right = obj.label;
            setLeftRight(temp);
            
            if (temp.right !== "" && temp.left !== "") {
                let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                tempLabels[refIndex] = `Left: ${temp.left}\u00A0\u00A0\u00A0Right: ${temp.right}`;
                setStepSelectedLabel(tempLabels);
            }
        }
    }
    
    function optionSelectChanged(refIndex, selected) {
        let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
        tempLabels[refIndex] = selected.label;
        setStepSelectedLabel(tempLabels);
        
        let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
        tempValue[refIndex] = selected.value;
        // console.log(tempValue);
        setStepSelectedValue(tempValue);
    }
    
    function selectChanged(e, nums) {
        // console.log(e.target.value);
        let refIndex = e.target.getAttribute('ref-num');
        // selectedTitle.current[refIndex].innerHTML = e.target.getAttribute('text');
        let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
        tempLabels[refIndex] = e.target.getAttribute('text');
        
        
        let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
        tempValue[refIndex] = e.target.value;
        
        if (nums !== undefined) {
            let tempArr = nums.split(',');
            tempArr.forEach(num => {
                if (num !== undefined) {
                    if (tempValue[num] !== undefined)
                        delete tempValue[num];
                    if (tempLabels[num] !== undefined)
                        delete tempLabels[num];
                }
            });
        }
        // console.log(tempValue);
        setStepSelectedLabel(tempLabels);
        setStepSelectedValue(tempValue);
    }
    
    function selectUncheck(e) {
        let refIndex = e.target.getAttribute('ref-num');
        let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
        tempLabels[refIndex] = "";
        setStepSelectedLabel(tempLabels);
        
        let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
        if (tempValue[refIndex] !== undefined)
            delete tempValue[refIndex];
        setStepSelectedValue(tempValue);
        e.target.checked = false;
    }
    
    function fabricClicked(e, hasTrim) {
        let defFabricPhoto = e.target.getAttribute('default-fabric-photo');
        setDefaultFabricPhoto(defFabricPhoto);
        setHasTrim(hasTrim);
    }
    
    function fabricSwatch(e, fabricId) {
        let currentState = e.target.getAttribute('current-state');
        if (currentState === "0") {
            e.target.innerHTML = t("SWATCH IN CART");
            e.target.setAttribute('current-state', "1");
            e.target.className = "swatchButton activeSwatch";
        } else {
            e.target.innerHTML = t("ORDER SWATCH");
            e.target.setAttribute('current-state', "0");
            e.target.className = "swatchButton";
        }
    }
    
    const optionsMetalValance = {
        "en": [
            {value: 'White', label: 'White'},
            {value: 'Silver', label: 'Silver'},
            {value: 'Black', label: 'Black'}
        ],
        "fa": [
            {value: 'White', label: 'سفید'},
            {value: 'Silver', label: 'نقره ای'},
            {value: 'Black', label: 'مشکی'}
        ],
        
    };
    
    const optionsMetalValanceFabricInsert = {
        "en": [
            {value: 'White', label: 'White'},
            {value: 'Silver', label: 'Silver'},
            {value: 'Black', label: 'Black'}
        ],
        "fa": [
            {value: 'White', label: 'سفید'},
            {value: 'Silver', label: 'نقره ای'},
            {value: 'Black', label: 'مشکی'}
        ],
        
    };
    
    const MotorPosition = {
        "en": [
            {value: 'Left', label: 'Left'},
            {value: 'Right', label: 'Right'}
        ],
        "fa": [
            {value: 'Left', label: 'چپ'},
            {value: 'Right', label: 'راست'}
        ],
        
    };
    
    const motorChannels = {
        "en": [
            {value: '0', label: '0 (All Products)', disabled: true},
            {value: '1', label: '1'},
            {value: '2', label: '2'},
            {value: '3', label: '3'},
            {value: '4', label: '4'},
            {value: '5', label: '5'},
            {value: '6', label: '6'},
            {value: '7', label: '7'},
            {value: '8', label: '8'},
            {value: '9', label: '9'},
            {value: '10', label: '10'}
        ],
        "fa": [
            {value: '0', label: '۰ (همه محصولات)'},
            {value: '1', label: '۱'},
            {value: '2', label: '۲'},
            {value: '3', label: '۳'},
            {value: '4', label: '۴'},
            {value: '5', label: '۵'},
            {value: '6', label: '۶'},
            {value: '7', label: '۷'},
            {value: '8', label: '۸'},
            {value: '9', label: '۹'},
            {value: '10', label: '۱۰'}
        ],
        
    };
    
    const colors = {
        "en": [
            {value: 'Aqua', label: 'Aqua'},
            {value: 'Beige', label: 'Beige'},
            {value: 'Black', label: 'Black'},
            {value: 'Blue', label: 'Blue'},
            {value: 'Brown', label: 'Brown'},
            {value: 'Gold', label: 'Gold'},
            {value: 'Green', label: 'Green'},
            {value: 'Grey', label: 'Grey'},
            {value: 'Orange', label: 'Orange'},
            {value: 'Pink', label: 'Pink'}
        ],
        "fa": [
            {value: 'Aqua', label: 'آبی آسمانی'},
            {value: 'Beige', label: 'بژ'},
            {value: 'Black', label: 'مشکلی'},
            {value: 'Blue', label: 'آبی'},
            {value: 'Brown', label: 'قهوه ای'},
            {value: 'Gold', label: 'طلایی'},
            {value: 'Green', label: 'سبز'},
            {value: 'Grey', label: 'خاکستری'},
            {value: 'Orange', label: 'نارنجی'},
            {value: 'Pink', label: 'صورتی'}
        ],
        
    };
    
    const patterns = {
        "en": [
            {value: 'Botanical/Florals', label: 'Botanical/Florals'},
            {value: 'Chinoiserie', label: 'Chinoiserie'},
            {value: 'Damask', label: 'Damask'},
            {value: 'Geometric', label: 'Geometric'},
            {value: 'Modern', label: 'Modern'},
            {value: 'Solid', label: 'Solid'},
            {value: 'Stripes', label: 'Stripes'}
        ],
        "fa": [
            {value: 'Botanical/Florals', label: 'بوتانیک'},
            {value: 'Chinoiserie', label: 'چینی سری'},
            {value: 'Damask', label: 'دیماس'},
            {value: 'Geometric', label: 'هندسی'},
            {value: 'Modern', label: 'مدرن'},
            {value: 'Solid', label: 'یکرنگ'},
            {value: 'Stripes', label: 'راه راه'}
        ],
        
    };
    
    const types = {
        "en": [
            {value: 'Chenille', label: 'Chenille'},
            {value: 'Embroidery', label: 'Embroidery'},
            {value: 'Linen', label: 'Linen'},
            {value: 'Print', label: 'Print'},
            {value: 'Silk', label: 'Silk'},
            {value: 'Velvet', label: 'Velvet'}
        ],
        "fa": [
            {value: 'Chenille', label: 'Chenille'},
            {value: 'Embroidery', label: 'Embroidery'},
            {value: 'Linen', label: 'Linen'},
            {value: 'Print', label: 'Print'},
            {value: 'Silk', label: 'Silk'},
            {value: 'Velvet', label: 'Velvet'}
        ],
        
    };
    
    const prices = {
        "en": [
            {value: '$', label: '$'},
            {value: '$$', label: '$$'},
            {value: '$$$', label: '$$$'}
        ],
        "fa": [
            {value: '$', label: '$'},
            {value: '$$', label: '$$'},
            {value: '$$$', label: '$$$'}
        ],
        
    };
    
    const rooms = {
        "en": [
            {value: 'Family Room', label: 'Family Room'},
            {value: 'Den', label: 'Den'},
            {value: 'Living Room', label: 'Living Room'}
        ],
        "fa": [
            {value: 'Family Room', label: 'اتاق خانواده'},
            {value: 'Den', label: 'خلوتگاه'},
            {value: 'Living Room', label: 'اتاق نشیمن'}
        ],
        
    };
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
    }, [location.pathname]);
    
    useEffect(() => {
        if (models.length) {
            models.forEach(obj => {
                if (obj.SewingModelId === modelID) {
                    setDefaultFabricPhoto(obj.DefaultFabricPhotoUrl);
                    setDefaultModelName(obj.ModelENName);
                    setDefaultModelNameFa(obj.ModelName);
                }
            });
            getFabrics();
        }
    }, [models]);
    
    useEffect(() => {
        if (modelID !== '' && catID !== '') {
            getCats();
        }
    }, [modelID, catID, pageLanguage, location.pathname]);
    
    useEffect(() => {
        if (Object.keys(fabrics).length) {
            renderFabrics();
        }
    }, [fabrics]);
    
    useEffect(() => {
        setModels([]);
        setFabrics([]);
        setFabricsList([]);
        if (pageLanguage !== '') {
            setCatID(CatID);
            setModelID(ModelID);
        }
    }, [pageLanguage, location.pathname]);
    
    return (
        <div className="Custom_model_container">
            <div className="breadcrumb_container dir_ltr">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item linkAs={Link} className="breadcrumb_item" linkProps={{to: "/" + pageLanguage, className: "breadcrumb_item"}}>Home</Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} className="breadcrumb_item"
                                     linkProps={{
                                         to: "/" + pageLanguage + "/Curtain/" + catID,
                                         className: "breadcrumb_item breadcrumb_item_current"
                                     }}>{catID}</Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} className="breadcrumb_item"
                                     linkProps={{to: location, className: "breadcrumb_item breadcrumb_item_current"}}>{defaultModelName}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            
            
            <div className="models_title_div">
                <h1>{/*pageLanguage === 'fa' ? defaultModelNameFa : defaultModelName*/}Custom Zebra Shades</h1>
            </div>
            <div className="model_customize_container">
                <div className="model_customize_image">
                    <img src={`http://atlaspood.ir/${defaultFabricPhoto}`} className="img-fluid" alt=""/>
                </div>
                <div className={`model_customize_section ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                    <Accordion ref={accordion} flush activeKey={accordionActiveKey}>
                        {/* step 1 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="1" stepNum={t("1")} stepTitle={t("zebra_step1")}
                                                    stepSelected={stepSelectedLabel["1"] === undefined ? "" : stepSelectedLabel["1"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <div className="card_body card-body-fabric">
                                        <div className="search_filter_container">
                                            <div className="search_container">
                                                <div className="search_box">
                                                    <input type="text" placeholder={t("Search for product Name/Code")}
                                                           className="form-control search_input"
                                                           name="search_input" defaultValue=""
                                                           ref={search_input}
                                                           onChange={(e) => {
                                                               if (e.target.value !== "")
                                                                   setSearchShow(true);
                                                               else
                                                                   setSearchShow(false);
                                                           }}/>
                                                    {searchShow &&
                                                    <div className="clear-icon-container" onClick={() => {
                                                        search_input.current.value = "";
                                                        setSearchShow(false)
                                                    }}>
                                                        <i className="fa fa-times-circle clear-icon"/>
                                                    </div>
                                                    }
                                                    <div className="search-icon-container">
                                                        <i className="fa fa-search search-icon"/>
                                                    </div>
                                                </div>
                                                <button className="reset_filters" onClick={() => clearAllFilters()}>{t("Reset Filters")}</button>
                                            </div>
                                            <div className="filters_container">
                                                <div className="filter_container">
                                                    <Dropdown autoClose="outside" title="">
                                                        <Dropdown.Toggle className="dropdown_btn">
                                                            {t("filter_Color")}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu className="filter_color_items">
                                                            {colors[location.pathname.split('').slice(1, 3).join('')].map((obj, index) => (
                                                                <Dropdown.Item as={Button} key={index}>
                                                                    <label className="dropdown_label">
                                                                        <input type="checkbox" value={obj.value}
                                                                               ref={ref => (filterCheckboxes.current["colors"] = [...filterCheckboxes.current["colors"], ref])}/>
                                                                        {obj.label}
                                                                    </label>
                                                                </Dropdown.Item>
                                                            ))}
                                                            <div className="filter_inside_button_section">
                                                                <div className="clear_inside_filter" text="colors"
                                                                     onClick={(e) => clearFilters(e)}>{t("filter_Clear Filters")}</div>
                                                                <div className="done_inside_filter">{t("filter_Done")}</div>
                                                            </div>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                                <div className="filter_container">
                                                    <Dropdown autoClose="outside" title="">
                                                        <Dropdown.Toggle className="dropdown_btn">
                                                            {t("filter_Pattern")}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {patterns[location.pathname.split('').slice(1, 3).join('')].map((obj, index) => (
                                                                <Dropdown.Item as={Button} key={index}>
                                                                    <label className="dropdown_label">
                                                                        <input type="checkbox" value={obj.value}
                                                                               ref={ref => (filterCheckboxes.current["patterns"] = [...filterCheckboxes.current["patterns"], ref])}/>
                                                                        {obj.label}
                                                                    </label>
                                                                </Dropdown.Item>
                                                            ))}
                                                            <div className="filter_inside_button_section">
                                                                <div className="clear_inside_filter" text="patterns"
                                                                     onClick={(e) => clearFilters(e)}>{t("filter_Clear Filters")}</div>
                                                                <div className="done_inside_filter">{t("filter_Done")}</div>
                                                            </div>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                                <div className="filter_container">
                                                    <Dropdown autoClose="outside" title="">
                                                        <Dropdown.Toggle className="dropdown_btn">
                                                            {t("filter_Type")}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {types[location.pathname.split('').slice(1, 3).join('')].map((obj, index) => (
                                                                <Dropdown.Item as={Button} key={index}>
                                                                    <label className="dropdown_label">
                                                                        <input type="checkbox" value={obj.value}
                                                                               ref={ref => (filterCheckboxes.current["types"] = [...filterCheckboxes.current["types"], ref])}/>
                                                                        {obj.label}
                                                                    </label>
                                                                </Dropdown.Item>
                                                            ))}
                                                            <div className="filter_inside_button_section">
                                                                <div className="clear_inside_filter" text="types" onClick={(e) => clearFilters(e)}>{t("filter_Clear Filters")}</div>
                                                                <div className="done_inside_filter">{t("filter_Done")}</div>
                                                            </div>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                                <div className="filter_container">
                                                    <Dropdown autoClose="outside" title="">
                                                        <Dropdown.Toggle className="dropdown_btn">
                                                            {t("filter_Price")}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {prices[location.pathname.split('').slice(1, 3).join('')].map((obj, index) => (
                                                                <Dropdown.Item as={Button} key={index}>
                                                                    <label className="dropdown_label">
                                                                        <input type="checkbox" value={obj.value}
                                                                               ref={ref => (filterCheckboxes.current["prices"] = [...filterCheckboxes.current["prices"], ref])}/>
                                                                        {obj.label}
                                                                    </label>
                                                                </Dropdown.Item>
                                                            ))}
                                                            <div className="filter_inside_button_section">
                                                                <div className="clear_inside_filter" text="prices"
                                                                     onClick={(e) => clearFilters(e)}>{t("filter_Clear Filters")}</div>
                                                                <div className="done_inside_filter">{t("filter_Done")}</div>
                                                            </div>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </div>
                                        {fabricsList}
                                        <Modal dialogClassName="zoomModal" show={show} onHide={() => handleClose()}>
                                            <Modal.Header closeButton>
                                                {/*<Modal.Title>Modal heading</Modal.Title>*/}
                                            </Modal.Header>
                                            <Modal.Body>{zoomModalBody}</Modal.Body>
                                            <Modal.Footer>
                                                <button className="swatchButton" current-state="0" onClick={e => fabricSwatch(e)}>{t("ORDER SWATCH")}</button>
                                            </Modal.Footer>
                                        </Modal>
                                        <NextStep eventKey="2">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 2 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="2" stepNum={t("2")} stepTitle={t("zebra_step2")}
                                                    stepSelected={stepSelectedLabel["2"] === undefined ? "" : stepSelectedLabel["2"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/zebra/mount_inside.svg')} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("mount_Inside")} value="1" name="step2" ref-num="2" id="21"
                                                   onClick={e => {
                                                       selectChanged(e, "3AOut,3BOut,3COut,3DOut");
                                                   }}/>
                                            <label htmlFor="21">{t("mount_Inside")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/zebra/mount_outside.svg')} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("mount_Outside")} value="2" name="step2" ref-num="2" id="22"
                                                   onClick={e => {
                                                       selectChanged(e, "3AIn,3BIn");
                                                   }}/>
                                            <label htmlFor="22">{t("mount_Outside")}</label>
                                        </div>
                                        <NextStep eventKey="3">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="3" stepNum={t("3")} stepTitle={t("zebra_step3")}
                                                    stepSelected={stepSelectedLabel["3"] === undefined ? "" : stepSelectedLabel["3"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("I have my own measurements")} value="1" name="step3" ref-num="3" id="31"
                                                   onClick={e => {
                                                       selectChanged(e, "3AIn,3BIn,3AOut,3BOut,3COut,3DOut");
                                                       setMeasurementsNextStep("4");
                                                   }}/>
                                            <label htmlFor="31">{t("I have my own measurements.")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("Calculate my measurements")} value="2" name="step3"
                                                   ref-num="3" id="32"
                                                   onClick={e => {
                                                       if (stepSelectedValue["2"] === undefined) {
                                                           selectUncheck(e);
                                                           modalHandleShow("noMount")
                                                       } else if (stepSelectedValue["2"] === "1") {
                                                           selectChanged(e);
                                                           setMeasurementsNextStep("3A");
                                                       } else {
                                                           selectChanged(e);
                                                           setMeasurementsNextStep("3A");
                                                       }
                                                   }}/>
                                            <label htmlFor="32">{t("Calculate my measurements.")}</label>
                                        
                                        </div>
                                        
                                        {stepSelectedValue["3"] === "1" &&
                                        <div className="own_measurements_container">
                                            <div className="own_measurements_width">
                                                <label className="select_label">{t("Width")}</label>
                                                <div className="select_container select_container_num">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            optionSelectChanged_WidthLength(selected[0], "3", true);
                                                        }}
                                                        options={SelectOptionRange(30, 300, 1, "cm", "س\u200Cم" , pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="own_measurements_Length">
                                                <label className="select_label">{t("Length_step3")}</label>
                                                <div className="select_container select_container_num">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            optionSelectChanged_WidthLength(selected[0], "3", false);
                                                        }}
                                                        options={SelectOptionRange(30, 400, 1, "cm", "س\u200Cم" , pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        }
                                        
                                        <NextStep eventKey={measurementsNextStep}>{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    {(stepSelectedValue["3"] === "1") &&
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">
                                                        <div className="measurementsHelp_link" onClick={e => modalHandleShow("measurementsHelp")}>
                                                            {t("step3_help_1")}
                                                        </div>
                                                    </li>
                                                    <li className="no_listStyle single_line_height">
                                                        <b>{t("Note:&nbsp;")}</b>
                                                        {t("step3_help_2")}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                    {(stepSelectedValue["3"] === "2") &&
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">
                                                        <b>{t("Note:&nbsp;")}</b>
                                                        {t("step3_help_3")}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3A inside */}
                        {stepSelectedValue["3"] === "2" && stepSelectedValue["2"] === "1" &&
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="3A" stepNum={t("3A")} stepTitle={t("zebra_step3AInside")}
                                                    stepSelected={stepSelectedLabel["3AIn"] === undefined ? "" : stepSelectedLabel["3AIn"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3A">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">What's your window width?</p>
                                            <img src={require('../Images/drapery/zebra/width_inside_3.svg')} className="img-fluid" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="Three_select_container">
                                                <label className="select_label">A</label>
                                                <div className="select_container select_container_num">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        onDropdownOpen={() => {
                                                            let temp1 = window.scrollY;
                                                            window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                                            setTimeout(() => {
                                                                let temp2 = window.scrollY;
                                                                if (temp2 === temp1)
                                                                    window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                                            }, 100);
                                                        }}
                                                        values={selectCustomValues.width1}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            optionSelectChanged_three(selected[0], "3AIn", 0, true, "widthDifferent");
                                                            let temp = selectCustomValues;
                                                            temp.width1 = selected;
                                                            setSelectCustomValues(temp);
                                                        }}
                                                        options={SelectOptionRange(30, 300, 0.5, "cm", pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <label className="select_label">B</label>
                                                <div className="select_container select_container_num">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        onDropdownOpen={() => {
                                                            let temp1 = window.scrollY;
                                                            window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                                            setTimeout(() => {
                                                                let temp2 = window.scrollY;
                                                                if (temp2 === temp1)
                                                                    window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                                            }, 100);
                                                        }}
                                                        values={selectCustomValues.width2}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            optionSelectChanged_three(selected[0], "3AIn", 1, true, "widthDifferent");
                                                            let temp = selectCustomValues;
                                                            temp.width2 = selected;
                                                            setSelectCustomValues(temp);
                                                        }}
                                                        options={SelectOptionRange(30, 300, 0.5, "cm", "س\u200Cم" , pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <label className="select_label">C</label>
                                                <div className="select_container select_container_num">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        onDropdownOpen={() => {
                                                            let temp1 = window.scrollY;
                                                            window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                                            setTimeout(() => {
                                                                let temp2 = window.scrollY;
                                                                if (temp2 === temp1)
                                                                    window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                                            }, 100);
                                                        }}
                                                        values={selectCustomValues.width3}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            optionSelectChanged_three(selected[0], "3AIn", 2, true, "widthDifferent");
                                                            let temp = selectCustomValues;
                                                            temp.width3 = selected;
                                                            setSelectCustomValues(temp);
                                                        }}
                                                        options={SelectOptionRange(30, 300, 0.5, "cm", "س\u200Cم" , pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep eventKey="3B">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">For accurate sizing, measure the horizontal width of inside of the window frame
                                                        in 3 locations top, middle and bottom.
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        }
                        
                        {/* step 3B inside */}
                        {stepSelectedValue["3"] === "2" && stepSelectedValue["2"] === "1" &&
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="3B" stepNum={t("3B")} stepTitle={t("zebra_step3BInside")}
                                                    stepSelected={stepSelectedLabel["3BIn"] === undefined ? "" : stepSelectedLabel["3BIn"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3B">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">What's your window height?</p>
                                            <img src={require('../Images/drapery/zebra/height_inside_3.svg')} className="img-fluid" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="Three_select_container">
                                                <label className="select_label">A</label>
                                                <div className="select_container select_container_num">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        onDropdownOpen={() => {
                                                            let temp1 = window.scrollY;
                                                            window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                                            setTimeout(() => {
                                                                let temp2 = window.scrollY;
                                                                if (temp2 === temp1)
                                                                    window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                                            }, 100);
                                                        }}
                                                        values={selectCustomValues.height1}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            optionSelectChanged_three(selected[0], "3BIn", 0, false, "heightDifferent");
                                                            let temp = selectCustomValues;
                                                            temp.height1 = selected;
                                                            setSelectCustomValues(temp);
                                                        }}
                                                        options={SelectOptionRange(30, 400, 1, "cm", "س\u200Cم" , pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <label className="select_label">B</label>
                                                <div className="select_container select_container_num">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        onDropdownOpen={() => {
                                                            let temp1 = window.scrollY;
                                                            window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                                            setTimeout(() => {
                                                                let temp2 = window.scrollY;
                                                                if (temp2 === temp1)
                                                                    window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                                            }, 100);
                                                        }}
                                                        values={selectCustomValues.height2}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            optionSelectChanged_three(selected[0], "3BIn", 1, false, "heightDifferent");
                                                            let temp = selectCustomValues;
                                                            temp.height2 = selected;
                                                            setSelectCustomValues(temp);
                                                        }}
                                                        options={SelectOptionRange(30, 400, 1, "cm", "س\u200Cم" , pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <label className="select_label">C</label>
                                                <div className="select_container select_container_num">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        onDropdownOpen={() => {
                                                            let temp1 = window.scrollY;
                                                            window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                                            setTimeout(() => {
                                                                let temp2 = window.scrollY;
                                                                if (temp2 === temp1)
                                                                    window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                                            }, 100);
                                                        }}
                                                        values={selectCustomValues.height3}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            optionSelectChanged_three(selected[0], "3BIn", 2, false, "heightDifferent");
                                                            let temp = selectCustomValues;
                                                            temp.height3 = selected;
                                                            setSelectCustomValues(temp);
                                                        }}
                                                        options={SelectOptionRange(30, 400, 1, "cm", "س\u200Cم" , pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <NextStep eventKey="4">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">For accurate sizing, measure the vertical height of inside of the window frame
                                                        in 3 locations left , middle and right.
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        }
                        
                        {/* step 3A outside */}
                        {stepSelectedValue["3"] === "2" && stepSelectedValue["2"] === "2" &&
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="3A" stepNum={t("3A")} stepTitle={t("zebra_step3AOutside")}
                                                    stepSelected={stepSelectedLabel["3AOut"] === undefined ? "" : stepSelectedLabel["3AOut"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3A">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">What's your window width?<br/>(Frame outer edge to edge.)</p>
                                            <img src={require('../Images/drapery/zebra/FrameSize.svg')} className="img-fluid" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                <label className="select_label">Width</label>
                                                <div className="select_container select_container_num">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        onDropdownOpen={() => {
                                                            let temp1 = window.scrollY;
                                                            window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                                            setTimeout(() => {
                                                                let temp2 = window.scrollY;
                                                                if (temp2 === temp1)
                                                                    window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                                            }, 100);
                                                        }}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            optionSelectChanged("3AOut", selected[0])
                                                        }}
                                                        options={SelectOptionRange(30, 290, 1, "cm", "س\u200Cم" , pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep eventKey="3B">{t("NEXT STEP")}</NextStep>
                                    </div>
                                
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        }
                        
                        {/* step 3B outside */}
                        {stepSelectedValue["3"] === "2" && stepSelectedValue["2"] === "2" &&
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="3B" stepNum={t("3B")} stepTitle={t("zebra_step3BOutside")}
                                                    stepSelected={stepSelectedLabel["3BOut"] === undefined ? "" : stepSelectedLabel["3BOut"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3B">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">How many cm would you like the shade to extend<br/>slightly beyond the window frame?</p>
                                            <img src={require('../Images/drapery/zebra/wall_cover.svg')} className="img-fluid" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container dir_ltr">
                                            <div className="box50">
                                                <label className="select_label">Left</label>
                                                <div className="select_container select_container_num">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        onDropdownOpen={() => {
                                                            let temp1 = window.scrollY;
                                                            window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                                            setTimeout(() => {
                                                                let temp2 = window.scrollY;
                                                                if (temp2 === temp1)
                                                                    window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                                            }, 100);
                                                        }}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            optionSelectChanged_LeftRight(selected[0], "3BOut", true);
                                                        }}
                                                        options={SelectOptionRange(1, 10, 1, "cm", "س\u200Cم" , pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="box50">
                                                <label className="select_label">Right</label>
                                                <div className="select_container select_container_num">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        onDropdownOpen={() => {
                                                            let temp1 = window.scrollY;
                                                            window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                                            setTimeout(() => {
                                                                let temp2 = window.scrollY;
                                                                if (temp2 === temp1)
                                                                    window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                                            }, 100);
                                                        }}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            optionSelectChanged_LeftRight(selected[0], "3BOut", false);
                                                        }}
                                                        options={SelectOptionRange(1, 10, 1, "cm", "س\u200Cم" , pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <NextStep eventKey="3C">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">We recommend extending the shade 4-8cm on each side of the window frame to
                                                        minimize light gaps.
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        }
                        
                        {/* step 3C outside */}
                        {stepSelectedValue["3"] === "2" && stepSelectedValue["2"] === "2" &&
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="3C" stepNum={t("3C")} stepTitle={t("zebra_step3COutside")}
                                                    stepSelected={stepSelectedLabel["3COut"] === undefined ? "" : stepSelectedLabel["3COut"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3C">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">What's your window height?<br/>(Frame outer edge to edge.)</p>
                                            <img src={require('../Images/drapery/zebra/frame_height.svg')} className="img-fluid" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                <label className="select_label">Height</label>
                                                <div className="select_container select_container_num">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        onDropdownOpen={() => {
                                                            let temp1 = window.scrollY;
                                                            window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                                            setTimeout(() => {
                                                                let temp2 = window.scrollY;
                                                                if (temp2 === temp1)
                                                                    window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                                            }, 100);
                                                        }}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            optionSelectChanged("3COut", selected[0])
                                                        }}
                                                        options={SelectOptionRange(30, 400, 1, "cm", "س\u200Cم" , pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep eventKey="3D">{t("NEXT STEP")}</NextStep>
                                    </div>
                                
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        }
                        
                        {/* step 3D outside */}
                        {stepSelectedValue["3"] === "2" && stepSelectedValue["2"] === "2" &&
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="3D" stepNum={t("3D")} stepTitle={t("zebra_step3DOutside")}
                                                    stepSelected={stepSelectedLabel["3DOut"] === undefined ? "" : stepSelectedLabel["3DOut"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3D">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">How many cm above window frame<br/>would you like to mount the shade?</p>
                                            <img src={require('../Images/drapery/zebra/shade_mount.svg')} className="img-fluid" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                <label className="select_label"/>
                                                <div className="select_container select_container_num">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        onDropdownOpen={() => {
                                                            let temp1 = window.scrollY;
                                                            window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                                            setTimeout(() => {
                                                                let temp2 = window.scrollY;
                                                                if (temp2 === temp1)
                                                                    window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                                            }, 100);
                                                        }}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            optionSelectChanged("3DOut", selected[0])
                                                        }}
                                                        options={SelectOptionRange(0, 100, 1, "cm", "س\u200Cم" , pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep eventKey="4">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">We recommend the shade to be mounted at least 15-20cm above window frame to
                                                        accommodate for shade height when kept completely rolled up and to maximize window exposure. Our standard hardware cannot
                                                        accommodate a mounting height of less than 10cm. If you need to mount your shades lower than this, please contact us.
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        }
                        
                        {/* step 4 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="4" stepNum={t("4")} stepTitle={t("zebra_step4")}
                                                    stepSelected={stepSelectedLabel["4"] === undefined ? "" : stepSelectedLabel["4"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="4">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("Continuous") + " " + t("Loop")} value="1" name="step4" ref-num="4" id="41"
                                                   onClick={e => {
                                                       selectChanged(e);
                                                       setControlTypeNextStep("4A");
                                                   }}/>
                                            <label htmlFor="41">{t("Continuous")}<br/><p>{t("Loop")}</p></label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("Motorized")} value="2" name="step4"
                                                   ref-num="4" id="42"
                                                   onClick={e => {
                                                       selectChanged(e, "41", "4A,4B");
                                                       setControlTypeNextStep("5");
                                                   }}/>
                                            <label htmlFor="42">{t("Motorized")}<br/><p className="surcharge_price">{t("Add 200,000 Tomans")}</p></label>
                                        
                                        </div>
                                        {stepSelectedValue["4"] === "2" &&
                                        <div className="secondary_options same_row_selection">
                                            <hr/>
                                            <p className="no_power_title">Motorized hardware comes with a plug-in motor.<br/>Do you have power access near installation area?</p>
                                            <div className="card-body-display-flex">
                                                <div className="box50 radio_style">
                                                    <input className="radio" type="radio" text={t("Yes")} value="1" name="step41" ref-num="41" id="411"
                                                           onClick={e => {
                                                               selectChanged(e);
                                                           }}/>
                                                    <label htmlFor="411">{t("Yes")}</label>
                                                </div>
                                                <div className="box50 radio_style">
                                                    <input className="radio" type="radio" text={t("No")} value="2" name="step41" ref-num="41" id="412"
                                                           onClick={e => {
                                                               selectUncheck(e);
                                                               modalHandleShow("noPower")
                                                           }}/>
                                                    <label htmlFor="412">{t("No")}</label>
                                                </div>
                                            </div>
                                        </div>
                                        }
                                        {stepSelectedValue["41"] === "1" && stepSelectedValue["4"] === "2" &&
                                        <div className="motorized_options same_row_selection">
                                            <div className="motorized_option_left">
                                                <p>Motor Position</p>
                                                &nbsp;
                                                <span onClick={() => modalHandleShow("learnMore")}>(Learn More)</span>
                                            </div>
                                            <div className="motorized_option_right">
                                                <div className="select_container">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdown props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                        }}
                                                        options={MotorPosition[pageLanguage]}
                                                    />
                                                </div>
                                            </div>
                                            <div className="motorized_option_left">
                                                <p>Remote Name</p>
                                                &nbsp;
                                                <span onClick={() => modalHandleShow("learnMore")}>(Learn More)</span>
                                            </div>
                                            <div className="motorized_option_right">
                                                <input className="Remote_name" type="text" name="Remote_name" placeholder="Enter a name for your remote"/>
                                            </div>
                                            <div className="motorized_option_left">
                                                <p>Channel(s)</p>
                                                &nbsp;
                                                <span onClick={() => modalHandleShow("learnMore")}>(Learn More)</span>
                                            </div>
                                            <div className="motorized_option_right">
                                                <div className="select_container multi_select_container">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        multi={true}
                                                        values={[motorChannels[pageLanguage].find(opt => opt.value === '0')]}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownMulti props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControlMulti props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                        }}
                                                        options={motorChannels[pageLanguage]}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        }
                                        
                                        <NextStep eventKey={controlTypeNextStep}>{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    {(stepSelectedValue["4"] === "1" || stepSelectedValue["4"] === undefined) &&
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header">Continuous Loop</p>
                                                <ul className="help_column_list">
                                                    <li>Chain control maintains consistent length</li>
                                                    <li>Easier to operate larger shades</li>
                                                </ul>
                                            </div>
                                            <div className="help_column help_right_column">
                                                <p className="help_column_header">Motorization</p>
                                                <ul className="help_column_list">
                                                    <li>Plug in motors</li>
                                                    <li>Clean aesthetic - no chains</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 4A */}
                        {stepSelectedValue["4"] === "1" &&
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="4A" stepNum={t("4A")} stepTitle={t("zebra_step4A")}
                                                    stepSelected={stepSelectedLabel["4A"] === undefined ? "" : stepSelectedLabel["4A"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="4A">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("Left")} value="1" name="step4A" ref-num="4A" id="4A1"
                                                   onClick={e => {
                                                       selectChanged(e);
                                                   }}/>
                                            <label htmlFor="4A1">{t("Left")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("Right")} value="2" name="step4A"
                                                   ref-num="4A" id="4A2"
                                                   onClick={e => {
                                                       selectChanged(e);
                                                   }}/>
                                            <label htmlFor="4A2">{t("Right")}</label>
                                        </div>
                                        <NextStep eventKey="4B">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">Consider the placement of your shade and select a position that's easily
                                                        accessible for you. "Left" and "Right" refer to your left and right.
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        }
                        
                        {/* step 4A */}
                        {stepSelectedValue["4"] === "1" &&
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="4B" stepNum={t("4B")} stepTitle={t("zebra_step4B")}
                                                    stepSelected={stepSelectedLabel["4B"] === undefined ? "" : stepSelectedLabel["4B"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="4B">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box33 radio_style">
                                            <input className="radio" type="radio" text={t("150cm")} value="1" name="step4B" ref-num="4B" id="4B1"
                                                   onClick={e => {
                                                       selectChanged(e);
                                                   }}/>
                                            <label htmlFor="4B1">{t("150cm")}<br/><p>{t("(No extra charge)")}</p></label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <input className="radio" type="radio" text={t("300cm")} value="2" name="step4B"
                                                   ref-num="4B" id="4B2"
                                                   onClick={e => {
                                                       selectChanged(e);
                                                   }}/>
                                            <label htmlFor="4B2">{t("300cm")}<br/><p className="surcharge_price">{t("Add 200,000 Tomans")}</p></label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <input className="radio" type="radio" text={t("500cm")} value="3" name="step4B"
                                                   ref-num="4B" id="4B3"
                                                   onClick={e => {
                                                       selectChanged(e);
                                                   }}/>
                                            <label htmlFor="4B3">{t("500cm")}<br/><p className="surcharge_price">{t("Add 200,000 Tomans")}</p></label>
                                        </div>
                                        <NextStep eventKey="5">{t("NEXT STEP")}</NextStep>
                                    </div>
                                
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        }
                        
                        {/* step 5 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="5" stepNum={t("5")} stepTitle={t("zebra_step5")}
                                                    stepSelected={stepSelectedLabel["5"] === undefined ? "" : stepSelectedLabel["5"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="5">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/zebra/metal_valance.svg')} className="img-fluid mb-3" alt=""/>
                                            <input className="radio" type="radio" text={t("style_Metal Valance")} value="1" name="step5" ref-num="5" id="51"
                                                   onClick={e => {
                                                       selectChanged(e);
                                                   }}/>
                                            <label htmlFor="51">{t("style_Metal Valance")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/zebra/metal_valance_fabric_insert.svg')} className="img-fluid mb-3" alt=""/>
                                            <input className="radio" type="radio" text={t("style_Metal Valance") + " " + t("style_Fabric Insert")} value="2" name="step5"
                                                   ref-num="5" id="52"
                                                   onClick={e => {
                                                       selectChanged(e);
                                                   }}/>
                                            <label htmlFor="52">{t("style_Metal Valance")}<br/>{t("style_Fabric Insert")}</label>
                                        
                                        </div>
                                        <div className="selection_section">
                                            <div className="select_container">
                                                {stepSelectedValue["5"] === "1" &&
                                                <Select
                                                    className="select"
                                                    placeholder={t("Please Select")}
                                                    portal={document.body}
                                                    dropdownPosition="bottom"
                                                    dropdownHandle={false}
                                                    dropdownGap={0}
                                                    dropdownRenderer={
                                                        ({props, state, methods}) => <CustomDropdown props={props} state={state} methods={methods}/>
                                                    }
                                                    contentRenderer={
                                                        ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                    }
                                                    // optionRenderer={
                                                    //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                    // }
                                                    onChange={(selected) => {
                                                    }}
                                                    options={optionsMetalValance[pageLanguage]}
                                                />
                                                }
                                            </div>
                                            <div className="select_container">
                                                {stepSelectedValue["5"] === "2" &&
                                                <Select
                                                    className="select"
                                                    placeholder={t("Please Select")}
                                                    portal={document.body}
                                                    dropdownPosition="bottom"
                                                    dropdownHandle={false}
                                                    dropdownGap={0}
                                                    dropdownRenderer={
                                                        ({props, state, methods}) => <CustomDropdown props={props} state={state} methods={methods}/>
                                                    }
                                                    contentRenderer={
                                                        ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                    }
                                                    // optionRenderer={
                                                    //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                    // }
                                                    onChange={(selected) => {
                                                    }}
                                                    options={optionsMetalValanceFabricInsert[pageLanguage]}
                                                />
                                                }
                                            </div>
                                        
                                        </div>
                                        <NextStep eventKey="6">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header">Metal Valance</p>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle">&nbsp;</li>
                                                    <li className="no_listStyle">
                                                        <span className="popover_indicator">
                                                            {<PopoverStickOnHover placement={`${pageLanguage === 'fa' ? "right" : "left"}`}
                                                                                  children={<object className="popover_camera" type="image/svg+xml"
                                                                                                    data={require('../Images/public/camera.svg')}/>}
                                                                                  component={
                                                                                      <div className="clearfix">
                                                                                          <div className="popover_image clearfix">
                                                                                              <img
                                                                                                  src={popoverImages["step51"] === undefined ? require('../Images/drapery/zebra/DoubleRoller_Valance_Colors.jpg') : popoverImages["step51"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">Bottom Bar Colors</span>
                                                                                              <span className="popover_thumbnails">
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/zebra/DoubleRoller_Valance_Colors.jpg')}
                                                                                                           text="step51"
                                                                                                           onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                           className="popover_thumbnail_img img-fluid"
                                                                                                           alt=""/>
                                                                                                  </div>
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/zebra/roller_bottombar_designer.jpg')}
                                                                                                           text="step51"
                                                                                                           onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                           className="popover_thumbnail_img img-fluid"
                                                                                                           alt=""/>
                                                                                                  </div>
                                                                                              </span>
                                                                                          </div>
                                                                                      </div>
                                                                                  }/>
                                                            }
                                                        </span>Available in white, silver or black.
                                                    </li>
                                                    <li>Conceals control mechanism.</li>
                                                </ul>
                                            </div>
                                            <div className="help_column help_right_column">
                                                <p className="help_column_header">{t("style_Metal Valance")}<br/>{t("style_Fabric Insert")}</p>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle">
                                                        <span className="popover_indicator">
                                                            {<PopoverStickOnHover placement={`${pageLanguage === 'fa' ? "right" : "left"}`}
                                                                                  children={<object className="popover_camera" type="image/svg+xml"
                                                                                                    data={require('../Images/public/camera.svg')}/>}
                                                                                  component={
                                                                                      <div id="popover_content_step5help2" className="clearfix">
                                                                                          <div className="popover_image clearfix">
                                                                                              <img
                                                                                                  src={popoverImages["step52"] === undefined ? require('../Images/drapery/zebra/DoubleRoller_Valance_Colors.jpg') : popoverImages["step52"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">Bottom Bar Colors</span>
                                                                                              <span className="popover_thumbnails">
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/zebra/DoubleRoller_Valance_Colors.jpg')}
                                                                                                           text="step52"
                                                                                                           onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                           className="popover_thumbnail_img img-fluid"
                                                                                                           alt=""/>
                                                                                                  </div>
                                                                                              </span>
                                                                                          </div>
                                                                                      </div>
                                                                                  }/>
                                                            }
                                                        </span>Matching shade fabric inserted in metal valance.
                                                    </li>
                                                    <li>Metal valance fabric insert available in white, silver or black frame.</li>
                                                    <li>Conceals control mechanism.</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="help_container help_container_third">
                                            <div className="help_column help_left_column text_center">
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle">
                                                        <span className="popover_indicator">
                                                            {<PopoverStickOnHover placement={`${pageLanguage === 'fa' ? "right" : "left"}`}
                                                                                  children={<object className="popover_camera" type="image/svg+xml"
                                                                                                    data={require('../Images/public/camera.svg')}/>}
                                                                                  component={
                                                                                      <div id="popover_content_step5help2" className="clearfix">
                                                                                          <div className="popover_image clearfix">
                                                                                              <img
                                                                                                  src={popoverImages["step53"] === undefined ? require('../Images/drapery/zebra/roller_bottombar_designer.jpg') : popoverImages["step53"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">Bottom Bar Colors</span>
                                                                                              <span className="popover_thumbnails">
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/zebra/roller_bottombar_designer.jpg')}
                                                                                                           text="step53"
                                                                                                           onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                           className="popover_thumbnail_img img-fluid"
                                                                                                           alt=""/>
                                                                                                  </div>
                                                                                              </span>
                                                                                          </div>
                                                                                      </div>
                                                                                  }/>
                                                            }
                                                        </span>Bottom bar is color matched to the metal valance.
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 6 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="6" stepNum={t("6")} stepTitle={t("zebra_step6")}
                                                    stepSelected={stepSelectedLabel["6"] === undefined ? "" : stepSelectedLabel["6"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="6">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box100 upload_section">
                                            <div className="big_box">
                                                <div className="big_box_container box100">
                                                    <div className="upload_button_displayer" onClick={() => {
                                                        if (detailsShow)
                                                            setDetailsShow(false);
                                                        else
                                                            setDetailsShow(true);
                                                    }}>
                                                        <span className="details-label unselectable">{detailsShow ? "Hide Details" : "Add Room Image"}</span>
                                                        <span className="details_indicator">
                                                            <i className="arrow_down"/>
                                                        </span>
                                                    </div>
                                                    <div className="uploaded_images_section">
                                                        <ul className="upload_results clearfix">
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`box100 hidden_upload_section ${detailsShow ? "show_upload_section" : ""}`}>
                                            <div className="project-details">
                                                <div className="project-details-help">
                                                    <p>Use a photo of the room you are decorating for inspiration and to help you identify the project. You can upload up to 10
                                                        images of your choice.</p>
                                                </div>
                                                <div className="project-details-help">
                                                    <p>If you have measurements taken by a professional installer, you can upload a PDF version of them for reference.</p>
                                                </div>
                                            </div>
                                            <div className="project-details">
                                                <div className="btn-upload img_upload_btn">
                                                    <button type="button" className="btn" onClick={e => modalHandleShow("uploadImg")}>
                                                        Upload Image
                                                    </button>
                                                </div>
                                                <div className="btn-upload">
                                                    <button type="button" className="btn" onClick={e => modalHandleShow("uploadPdf")}>
                                                        Upload PDF
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="box100 uploaded_name_section">
                                            <div className="mid_upload">
                                                <ul className="upload_names_images">
                                                </ul>
                                                <br/>
                                                <ul className="upload_names_pdfs">
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="box100 selectInput_section">
                                            <div className="room_select">
                                                <label className="select_label">Room</label>
                                                <div className="select_container">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        onDropdownOpen={() => {
                                                            let temp1 = window.scrollY;
                                                            window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                                            setTimeout(() => {
                                                                let temp2 = window.scrollY;
                                                                if (temp2 === temp1)
                                                                    window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                                            }, 100);
                                                        }}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            // optionSelectChanged_WidthLength(selected[0], "3", false);
                                                        }}
                                                        options={rooms[pageLanguage]}
                                                    />
                                                </div>
                                            </div>
                                            <div className="room_select">
                                                <label className="select_label">Window Description</label>
                                                <input type="text" placeholder="(Optional)" className="form-control window_name" name="order_window_name"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" accordion_help">
                                        <div className=" help_container">
                                            <div className=" help_column help_left_column">
                                                <p className=" help_column_header">Room Image</p>
                                                <ul className=" help_column_list">
                                                    <li className=" no_listStyle">Upload images of your window</li>
                                                </ul>
                                            </div>
                                            <div className=" help_column help_right_column">
                                                <p className=" help_column_header">Room/Window Description</p>
                                                <ul className=" help_column_list">
                                                    <li className=" no_listStyle">Create a label to help easily identify this treatment when your order arrives. Select a room and
                                                        enter a brief description of the window’s location.
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
            </div>
            
            
            {/* Modals */}
            
            <Modal dialogClassName={`noPower_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} show={modals["noPower"] === undefined ? false : modals["noPower"]}
                   onHide={() => modalHandleClose(" noPower")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>If you don't have power access,<br/>please select continuous loop control type.</p>
                    
                    <br/>
                    <div className=" text_center">
                        <button className=" btn btn-new-dark" onClick={() => modalHandleClose(" noPower")}>{t("CONTINUE")}</button>
                    </div>
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            <Modal dialogClassName={`noMount_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} show={modals["noMount"] === undefined ? false : modals["noMount"]}
                   onHide={() => modalHandleClose(" noMount")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>Please select mount type in Step 2 first.</p>
                    
                    <br/>
                    <div className=" text_center">
                        <button className=" btn btn-new-dark" onClick={() => modalHandleClose(" noMount")}>{t("CONTINUE")}</button>
                    </div>
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            <Modal dialogClassName={`learnMore_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} show={modals["learnMore"] === undefined ? false : modals["learnMore"]}
                   onHide={() => modalHandleClose(" learnMore")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>All back panels are installed on a track system</p>
                    <p>Please specify your control type</p>
                    <p>Consider the placement of your treatment and select a position that's easily accessible for you." Left" and " Right" refer to your left and right.</p>
                    
                    <br/>
                    <div className="text_center">
                        <button className="btn btn-new-dark" onClick={() => modalHandleClose("learnMore")}>{t("CONTINUE")}</button>
                    </div>
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            <Modal backdrop="static" keyboard={false} dialogClassName={`measurementsHelp_modal largeSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["measurementsHelp"] === undefined ? false : modals["measurementsHelp"]}
                   onHide={() => modalHandleClose("measurementsHelp")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <div className="measurementsHelp_modal_img_section">
                        <p className="measurementsHelp_modal_title">{t("HOW TO MEASURE FOR ZEBRA SHADES")}</p>
                        <p className="measurementsHelp_modal_img_title">{t("Inside Mount")}</p>
                        <object className="measurementsHelp_modal_img" type="image/svg+xml" data={require('../Images/drapery/zebra/step3_help_inside.svg')}/>
                    </div>
                    <div className="accordion_help measurementsHelp_modal_help_section">
                        <div className="help_container">
                            <div className="help_column help_left_column">
                                <p className="help_column_header">{t("TO DETERMINE INSIDE MOUNT")}</p>
                                <ul className="help_column_list">
                                    <li>{t("modal_help_1")}</li>
                                    <li>{t("modal_help_2")}</li>
                                    <li>{t("modal_help_3")}</li>
                                </ul>
                            </div>
                            
                            <div className="help_column help_left_column">
                                <p className="help_column_header">{t("STEP 1: MEASURE WIDTH")}</p>
                                <ul className="help_column_list">
                                    <li>{t("modal_help_4")}</li>
                                    <li>{t("modal_help_5")}</li>
                                </ul>
                            </div>
                            
                            <div className="help_column help_right_column">
                                <p className="help_column_header">{t("STEP 2: MEASURE LENGTH")}</p>
                                <ul className="help_column_list">
                                    <li>{t("modal_help_6")}</li>
                                    <li>{t("modal_help_7")}</li>
                                </ul>
                            </div>
                        </div>
                        <br/>
                        <br/>
                        <div className="help_container">
                            <div className="help_column help_right_column">
                                <p className="help_column_header"/>
                                <ul className="help_column_list">
                                    <li><b>{t("Note:&nbsp;")}</b>{t("modal_help_8")}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <br/>
                    <br/>
                    <br/>
                    
                    <div className="measurementsHelp_modal_img_section">
                        <p className="measurementsHelp_modal_img_title">{t("Outside Mount")}</p>
                        <object className="measurementsHelp_modal_img" type="image/svg+xml" data={require('../Images/drapery/zebra/step3_help_outside.svg')}/>
                    </div>
                    <div className="accordion_help measurementsHelp_modal_help_section">
                        <div className="help_container">
                            <div className="help_column help_left_column">
                                <p className="help_column_header">{t("TO DETERMINE OUTSIDE MOUNT")}</p>
                                <ul className="help_column_list">
                                    <li>{t("modal_help_9")}</li>
                                    <li>{t("modal_help_10")}</li>
                                    <li>{t("modal_help_11")}</li>
                                </ul>
                            </div>
                            
                            <div className="help_column help_left_column">
                                <p className="help_column_header">{t("STEP 1: MEASURE WIDTH")}</p>
                                <ul className="help_column_list">
                                    <li>{t("modal_help_12")}</li>
                                    <li>{t("modal_help_13")}</li>
                                </ul>
                            </div>
                            
                            <div className="help_column help_right_column">
                                <p className="help_column_header">{t("STEP 2: MEASURE LENGTH")}</p>
                                <ul className="help_column_list">
                                    <li>{t("modal_help_14")}</li>
                                    <li>{t("modal_help_15")}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="text_center">
                        <button className="btn btn-new-dark" onClick={() => modalHandleClose("measurementsHelp")}>{t("CONTINUE")}</button>
                    </div>
                </Modal.Body>
            </Modal>
            
            <Modal dialogClassName={`upload_modal uploadImg_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} show={modals["uploadImg"] === undefined ? false : modals["uploadImg"]}
                   onHide={() => {
                       modalHandleClose(" uploadImg");
                       setDetailsShow(false)
                   }}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <h2>Upload Your Image</h2>
                    <p className="file_size_description">Your image size must be smaller than 5MB. Acceptable formats:<br/> .gif, .jpg, or .png file.</p>
                    <div className="controls">
                        <div className="modal_upload_section">
                            <div className="modal_upload_item">
                                <label htmlFor="image-upload-btn" className="btn btn-new-gray file-upload-btn">
                                    Choose File
                                    <input type="file" className="custom-file file-upload" name="file" id="image-upload-btn" accept="image/png,image/jpeg,image/jpg"/>
                                </label>
                                <div className="file-name file-upload-btn">No File Chosen</div>
                            </div>
                            <div className="modal_upload_item">
                                <input className="file_name_text" type="text" name="file_title" placeholder="Image Name"/>
                            </div>
                        </div>
                    </div>
                    <div className="controls">
                        <div className="modal_button_section">
                            <button className="btn btn-new-gray" onClick={() => {
                                modalHandleClose(" uploadImg");
                                setDetailsShow(false)
                            }}>Cancel
                            </button>
                            <div className="btn btn-new-dark image_submit file-upload-btn btn-disabled" onClick={() => {
                                modalHandleClose(" uploadImg");
                                setDetailsShow(false)
                            }}>Upload Image
                            </div>
                        </div>
                    </div>
                
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            <Modal dialogClassName={`upload_modal uploadPdf_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} show={modals["uploadPdf"] === undefined ? false : modals["uploadPdf"]}
                   onHide={() => {
                       modalHandleClose(" uploadPdf");
                       setDetailsShow(false)
                   }}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <h2>Upload Your PDF</h2>
                    <p className="file_size_description">Your pdf size must be smaller than 5MB.</p>
                    <div className="controls">
                        <div className="modal_upload_section">
                            <div className="modal_upload_item">
                                <label htmlFor="file-upload-btn" className="btn btn-new-gray file-upload-btn">
                                    Choose File
                                    <input type="file" className="custom-file file-upload" name="file" id="file-upload-btn" accept="image/png,image/jpeg,image/jpg"/>
                                </label>
                                <div className="file-name file-upload-btn">No File Chosen</div>
                            </div>
                            <div className="modal_upload_item">
                                <input className="file_name_text" type="text" name="file_title" placeholder="PDF Name"/>
                            </div>
                        </div>
                    </div>
                    <div className="controls">
                        <div className="modal_button_section">
                            <button className="btn btn-new-gray" onClick={() => {
                                modalHandleClose(" uploadPdf");
                                setDetailsShow(false)
                            }}>Cancel
                            </button>
                            <div className="btn btn-new-dark image_submit file-upload-btn btn-disabled" onClick={() => {
                                modalHandleClose(" uploadPdf");
                                setDetailsShow(false)
                            }}>Upload PDF
                            </div>
                        </div>
                    </div>
                
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            <Modal backdrop="static" keyboard={false} dialogClassName={`warning_modal bigSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} show={modals["widthDifferent"] === undefined ? false : modals["widthDifferent"]}
                   onHide={() => {
                       modalHandleClose(" widthDifferent");
                       setDetailsShow(false)
                   }}>
                <Modal.Header>
                    <div className="required"/>
                    <p>Confirm Width Discrepancies</p>
                </Modal.Header>
                <Modal.Body>
                    <p>We noticed that there’s quite a difference in some of your measurements, and this could affect the fit of your custom shades.</p>
                    <br/>
                    <p>Before you continue, please make sure you read &amp; understand our return policy, and if you need help, please feel free to contact us! Our designers
                        can help you work out any discrepancies to make sure you love your new custom drapery.</p>
                    <br/>
                    
                    <div className="buttons_section">
                        <button className="btn btn-new-dark" onClick={() => {
                            modalHandleClose("widthDifferent");
                            let temp = selectCustomValues;
                            temp.width1 = [];
                            temp.width2 = [];
                            temp.width3 = [];
                            setSelectCustomValues(temp);
                            let temp2 = JSON.parse(JSON.stringify(stepSelectedOptions));
                            temp2.labels["3AIn"] = [];
                            temp2.values["3AIn"] = [];
                            setStepSelectedOptions(temp2);
                            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                            delete tempLabels["3AIn"];
                            setStepSelectedLabel(tempLabels);
                        }}>CHANGE MEASUREMENTS
                        </button>
                        <button className="btn btn-danger" onClick={() => {
                            modalHandleClose("widthDifferent");
                            setAccordionActiveKey("3B");
                        }}>I AGREE, CONTINUE ANYWAY
                        </button>
                    </div>
                
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            <Modal backdrop="static" keyboard={false} dialogClassName={`warning_modal bigSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["heightDifferent"] === undefined ? false : modals["heightDifferent"]}
                   onHide={() => {
                       modalHandleClose(" heightDifferent");
                       setDetailsShow(false)
                   }}>
                <Modal.Header>
                    <div className="required"/>
                    <p>Confirm Height Discrepancies</p>
                </Modal.Header>
                <Modal.Body>
                    <p>We noticed that there’s quite a difference in some of your measurements, and this could affect the fit of your custom shades.</p>
                    <br/>
                    <p>Before you continue, please make sure you read &amp; understand our return policy, and if you need help, please feel free to contact us! Our designers
                        can help you work out any discrepancies to make sure you love your new custom drapery.</p>
                    <br/>
                    
                    <div className="buttons_section">
                        <button className="btn btn-new-dark" onClick={() => {
                            modalHandleClose("heightDifferent");
                            let temp = selectCustomValues;
                            temp.height1 = [];
                            temp.height2 = [];
                            temp.height3 = [];
                            setSelectCustomValues(temp);
                            let temp2 = JSON.parse(JSON.stringify(stepSelectedOptions));
                            temp2.labels["3BIn"] = [];
                            temp2.values["3BIn"] = [];
                            setStepSelectedOptions(temp2);
                            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                            delete tempLabels["3BIn"];
                            setStepSelectedLabel(tempLabels);
                        }}>CHANGE MEASUREMENTS
                        </button>
                        <button className="btn btn-danger" onClick={() => {
                            modalHandleClose("heightDifferent");
                            setAccordionActiveKey("4");
                        }}>I AGREE, CONTINUE ANYWAY
                        </button>
                    </div>
                
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            
            <div className={`CustomModelFooter ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                <div className="CustomModelFooter_hidden_part"/>
                <div className="CustomModelFooter_visible_part">
                    <div className="left_footer">
                        <button className="save_to_acc">{t("footer_Save To")}<br/>{t("footer_My Account")}</button>
                    </div>
                    <div className="hidden_inner_footer">&nbsp;</div>
                    <div className="footer_price_section">
                        <div className="showPrice">{t("footer_Price")}</div>
                        <div className="price">0 {t("TOMANS")}</div>
                    </div>
                    <div className="right_footer">
                        <input type="submit" className="btn add_to_cart" value={t("footer_Add To Cart")} readOnly/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Zebra;