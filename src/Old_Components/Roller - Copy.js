import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import {Accordion, AccordionContext, Card, useAccordionButton} from "react-bootstrap"
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import Select from "react-dropdown-select";
import ReactImageMagnify from '@blacklab/react-image-magnify';
import PopoverStickOnHover from "../Components/PopoverStickOnHover";
import CustomControl from "../Components/CustomControl";
import CustomControlMulti from "../Components/CustomControlMulti";
import CustomDropdown from "../Components/CustomDropdown";
import CustomDropdownMulti from "../Components/CustomDropdownMulti";
import SelectOptionRange from "../Components/SelectOptionRange";

import CustomDropdownWithSearch from "../Components/CustomDropdownWithSearch";
import CustomControlNum from "../Components/CustomControlNum";
import NumberToPersianWord from "number_to_persian_word";
import CartInfo from "../Components/CartInfo"
import GetPrice from "../Components/GetPrice";
import {useDispatch, useSelector} from "react-redux";
import {HideLoginModal, LOGIN, LOGOUT, ShowLoginModal} from "../Actions/types";
import authHeader from "../Services/auth-header";
import SaveUserProject from "../Components/SaveUserProject";
import {refreshToken} from "../Services/auth.service";
import GetUserProjectData from "../Components/GetUserProjectData";
import setGetDeps from "../Components/setGetDeps";
import ModalLogin from "../Components/ModalLogin";
import AddProjectToCart from "../Components/AddProjectToCart";


const baseURLCats = "https://api.atlaspood.ir/WebsitePage/GetDetailByName";
const baseURLModel = "https://api.atlaspood.ir/SewingModel/GetById";
const baseURLFabrics = "https://api.atlaspood.ir/Sewing/GetModelFabric";
const baseURLWindowSize = "https://api.atlaspood.ir/Sewing/GetWindowSize";
const baseURLPrice = "https://api.atlaspood.ir/Sewing/GetSewingOrderPrice";
const baseURLFreeShipping = "https://api.atlaspood.ir/WebsiteSetting/GetFreeShippingAmount?apiKey=477f46c6-4a17-4163-83cc-29908d";
const baseURGetProject = "https://api.atlaspood.ir/SewingPreorder/GetById";
const baseURLGetCart = "https://api.atlaspood.ir/cart/GetAll";


function Roller_Old({CatID, ModelID, ProjectId, EditIndex}) {
    const {t} = useTranslation();
    const location = useLocation();
    let pageLanguage = location.pathname.split('').slice(1, 3).join('');
    const [firstRender, setFirstRender] = useState(true);
    const [catID, setCatID] = useState(CatID);
    const [modelID, setModelID] = useState(ModelID);
    const [projectId, setProjectId] = useState(ProjectId);
    const [editIndex, setEditIndex] = useState(EditIndex);
    const {isLoggedIn, isRegistered, user, showLogin} = useSelector((state) => state.auth);
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const [models, setModels] = useState([]);
    const [projectData, setProjectData] = useState({});
    const [model, setModel] = useState({});
    const [modelAccessories, setModelAccessories] = useState({});
    const [fabrics, setFabrics] = useState([]);
    const [fabricsList, setFabricsList] = useState([]);
    const [defaultFabricPhoto, setDefaultFabricPhoto] = useState(null);
    const [defaultModelName, setDefaultModelName] = useState("");
    const [defaultModelNameFa, setDefaultModelNameFa] = useState("");
    const [price, setPrice] = useState(0);
    const [bagPrice, setBagPrice] = useState(0);
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [freeShipPrice, setFreeShipPrice] = useState(0);
    const [show, setShow] = useState(false);
    const [searchShow, setSearchShow] = useState(false);
    const [measurementsNextStep, setMeasurementsNextStep] = useState("4");
    const [controlTypeNextStep, setControlTypeNextStep] = useState("5");
    const [headrailsNextStep, setHeadrailsNextStep] = useState("6");
    const [hemStyleNextStep, setHemStyleNextStep] = useState("7");
    const [projectModalState, setProjectModalState] = useState(0);
    const [zoomModalHeader, setZoomModalHeader] = useState([]);
    const [zoomModalBody, setZoomModalBody] = useState([]);
    const [addCartErr, setAddCartErr] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [cartAgree, setCartAgree] = useState([]);
    const [accordionActiveKey, setAccordionActiveKey] = useState("");
    const [roomLabelText, setRoomLabelText] = useState("");
    const [fabricSelected, setFabricSelected] = useState({
        selectedFabricId: 0,
        selectedTextEn: "",
        selectedTextFa: "",
        selectedColorEn: "",
        selectedColorFa: "",
        selectedHasTrim: false,
        selectedPhoto: ""
    });
    const [roomLabelSelect, setRoomLabelSelect] = useState({
        label: "",
        value: ""
    });
    const [roomLabelComplete, setRoomLabelComplete] = useState(false);
    const [stepSelectedValue, setStepSelectedValue] = useState({});
    const [hasTrim, setHasTrim] = useState(false);
    const [showLabels, setShowLabels] = useState(true);
    const [detailsShow, setDetailsShow] = useState(false);
    const [windowSize, setWindowSize] = useState("");
    const [windowSizeBool, setWindowSizeBool] = useState(false);
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
        "left": [],
        "right": [],
        "width": [],
        "length": [],
        "width3A": [],
        "height3C": [],
        "shadeMount": []
    });
    const [requiredStep, setRequiredStep] = useState({
        "1": false,
        "2": false,
        "3": false,
        "3AIn": false,
        "3BIn": false,
        "3AOut": false,
        "3BOut": false,
        "3COut": false,
        "3DOut": false,
        "4": false,
        "4A": false,
        "4B": false,
        "5": false,
        "6": false
    });
    const [cartValues, setCartValues] = useState({});
    const [cartStateAgree, setCartStateAgree] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [cartProjectIndex, setCartProjectIndex] = useState(-1);
    const [cartDraperies, setCartDraperies] = useState({
        "count": 0,
        "list": []
    });
    
    const [depSet, setDepSet] = useState(new Set(['1', '2', '3', '4', '5', '6', '71', '72']));
    
    const inputs = useRef({});
    const selectedTitle = useRef({});
    const search_input = useRef(null);
    const accordion = useRef(null);
    const filterCheckboxes = useRef({
        "colors": [],
        "patterns": [],
        "types": [],
        "prices": []
    });
    const steps = useRef([]);
    const draperyRef = useRef([]);
    
    
    const [step1, setStep1] = useState("");
    const [step2, setStep2] = useState("");
    const [step3, setStep3] = useState("");
    const [step4, setStep4] = useState("");
    const [step41, setStep41] = useState("");
    const [step4A, setStep4A] = useState("");
    const [step4B, setStep4B] = useState("");
    const [step5, setStep5] = useState("");
    const [step5A, setStep5A] = useState("");
    const [step5B, setStep5B] = useState("");
    const [step5C, setStep5C] = useState("");
    const [step6, setStep6] = useState("");
    const [step6A, setStep6A] = useState("");
    const [remoteName, setRemoteName] = useState("");
    const [selectedValanceColor1, setSelectedValanceColor1] = useState([]);
    const [selectedValanceColor2, setSelectedValanceColor2] = useState([]);
    const [selectedRoomLabel, setSelectedRoomLabel] = useState([]);
    
    const [savedProjectRoomLabel, setSavedProjectRoomLabel] = useState("");
    const [savedProjectRoomText, setSavedProjectRoomText] = useState("");
    
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
                pageName: catID,
                apiKey: window.$apikey
            }
        }).then((response) => {
            setModels(response.data.SewingModels);
        }).catch(err => {
            console.log(err);
        });
    };
    
    const getModel = () => {
        axios.get(baseURLModel, {
            params: {
                id: modelID,
                apiKey: window.$apikey
            }
        }).then((response) => {
            setModel(response.data);
            // console.log(response.data)
        }).catch(err => {
            console.log(err);
        });
    };
    
    function renderFabrics() {
        const fabricList = [];
        let count = 0;
        let pageLanguage1 = location.pathname.split('').slice(1, 3).join('');
        
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
                
                // console.log(step1 === `${FabricId}`, step1, `${FabricId}`, FabricId);
                
                fabric.push(
                    <div className={`radio_group ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`} key={"fabric" + key + j}>
                        <label data-tip={`${pageLanguage1 === 'en' ? DesignEnName : DesignName}: ${pageLanguage1 === 'en' ? ColorEnName : ColorName}`}
                               data-for={"fabric" + key + j} className={`radio_container ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`}
                               data-img={`https://www.doopsalta.com/upload/${PhotoPath}`}>
                            {/*<ReactTooltip id={"fabric" + key + j} place="top" type="light" effect="float"/>*/}
                            <input className="radio" type="radio" ref-num="1" default-fabric-photo={FabricOnModelPhotoUrl}
                                   onChange={e => {
                                       // console.log("hi1");
                                       let temp = JSON.parse(JSON.stringify(fabricSelected));
                                       temp.selectedFabricId = FabricId;
                                       temp.selectedTextEn = DesignEnName;
                                       temp.selectedTextFa = DesignName;
                                       temp.selectedColorEn = ColorEnName;
                                       temp.selectedColorFa = ColorName;
                                       temp.selectedHasTrim = HasTrim;
                                       temp.selectedPhoto = FabricOnModelPhotoUrl;
                                       setFabricSelected(temp);
                                       // fabricClicked(e, HasTrim);
                                       // selectChanged(e);
                                       // setCart("FabricId", FabricId);
                                       // setDeps("", "1");
                                   }} name="fabric"
                                   model-id={modelID} value={FabricId} text-en={DesignEnName} text-fa={DesignName} checked={`${FabricId}` === step1}
                                   ref={ref => (inputs.current[`1${FabricId}`] = ref)}/>
                            <div className="frame_img">
                                <img className={`img-fluid ${`${FabricId}` === step1?"img-fluid_checked":""}`} src={`https://api.atlaspood.ir/${PhotoPath}`} alt=""/>
                            </div>
                        </label>
                        <div className={`fabric_name_container ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`}>
                            <h1>{pageLanguage1 === 'en' ? ColorEnName : ColorName}</h1>
                            <span onClick={() => handleShow(PhotoPath, DesignName, DesignEnName, ColorName, ColorEnName)}><i className="fa fa-search" aria-hidden="true"/></span>
                        </div>
                        <button className={`swatchButton ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`} current-state="0"
                                onClick={e => fabricSwatch(e, FabricId)}>{t("ORDER SWATCH")}</button>
                    </div>
                );
                
            }
            
            fabricList.push(
                <div className={`material_detail ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`} key={"fabric" + key}>
                    <div className={`material_traits ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`}>
                        <hr/>
                        <span>{t("DESIGN NAME")}: {pageLanguage1 === 'en' ? DesignEnName : DesignName}</span>
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
        const tempDiv1 = [];
        tempDiv.push(
            <div key={PhotoPath} className="zoomImg">
                <div className="imageContainer">
                    <ReactImageMagnify
                        imageProps={{
                            alt: '',
                            isFluidWidth: true,
                            src: `https://api.atlaspood.ir/${PhotoPath}`
                        }}
                        magnifiedImageProps={{
                            src: `https://api.atlaspood.ir/${PhotoPath}`,
                            width: 800,
                            height: 800
                        }}
                        portalProps={{placement: 'over'}}
                    />
                    {/*<img className="img-fluid hover-zoom" src={`https://api.atlaspood.ir/${PhotoPath}`} alt=""/>*/}
                </div>
            </div>
        );
        tempDiv1.push(
            <span key={1} className="s">{pageLanguage === 'en' ? DesignEnName : DesignName} / {pageLanguage === 'en' ? ColorEnName : ColorName}</span>
        );
        
        setZoomModalBody(tempDiv);
        setZoomModalHeader(tempDiv1);
        setShow(true);
    }
    
    function modalHandleShow(modalName) {
        let tempModals = [...modals];
        tempModals[modalName] = true;
        setModals(tempModals);
    }
    
    function ContextAwareToggle({stepNum, stepTitle, stepSelected, eventKey, callback, stepRef, type, required, cartCustomText}) {
        const {activeEventKey} = useContext(AccordionContext);
        
        const decoratedOnClick = useAccordionButton(
            eventKey,
            () => {
                callback && callback(eventKey);
                activeEventKey === eventKey ? setAccordionActiveKey("") : setAccordionActiveKey(eventKey);
                // setTimeout(() => {
                //     if (isCurrentEventKey)
                //         window.scrollTo(window.scrollX, window.scrollY + 0.5);
                //     else
                //         window.scrollTo(window.screenX, window.scrollY - 0.5)
                // }, 500);
            },
        );
        
        const isCurrentEventKey = activeEventKey === eventKey;
        
        if (stepSelected !== "" && required) {
            let temp = JSON.parse(JSON.stringify(requiredStep));
            setTimeout(() => {
                temp[stepRef] = false;
                setRequiredStep(temp);
            }, 1000);
            
        }
        
        return (
            <div
                className={`w-100 h-100 steps_header ${isCurrentEventKey ? 'steps_header_active' : ''}`}
                onClick={decoratedOnClick}>
                <div className="steps_header_num_container">
                    <div className="steps_header_num">{stepNum}</div>
                </div>
                <div className="steps_header_title_container">
                    <div className="steps_header_title" type-of-step={type} cart-custom-text={cartCustomText === undefined ? stepTitle : cartCustomText}
                         ref={ref => (steps.current[stepRef] = ref)}>{stepTitle}</div>
                </div>
                <div className="steps_header_selected_container">
                    <div className="steps_header_selected" ref={ref => (selectedTitle.current[stepNum] = ref)}>{showLabels ? stepSelected : null}</div>
                </div>
                {required && stepSelected === "" &&
                <div className="stepRequired"/>
                }
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
    
    function optionSelectChanged_three(obj, refIndex, position, isMin, modalRef, postfixEn, postfixFa, pageLang) {
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
                if (isMin) {
                    let tempMin = temp.values[refIndex][temp.values[refIndex].indexOf(Math.min(...temp.values[refIndex]))];
                    tempLabels[refIndex] = pageLang === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMin}`) + postfixFa : tempMin + postfixEn;
                } else {
                    let tempMax = temp.values[refIndex][temp.values[refIndex].indexOf(Math.max(...temp.values[refIndex]))];
                    tempLabels[refIndex] = pageLang === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMax}`) + postfixFa : tempMax + postfixEn;
                }
                setStepSelectedLabel(tempLabels);
                let minValue = Math.min(...temp.values[refIndex]);
                let maxValue = Math.max(...temp.values[refIndex]);
                if (maxValue - minValue >= 2) {
                    modalHandleShow(modalRef);
                }
            }
        }
    }
    
    function optionSelectChanged_WidthLength(obj, refIndex, isWidth, postfixEn, postfixFa, pageLang) {
        if (obj !== undefined) {
            if (isWidth) {
                let temp = JSON.parse(JSON.stringify(widthLength));
                temp.width = obj.value;
                setWidthLength(temp);
                
                if (temp.length !== "" && temp.width !== "") {
                    // let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                    // tempLabels[refIndex] = pageLang === "fa" ? `ارتفاع:  ${NumberToPersianWord.convertEnToPe(`${temp.length}`) + postfixFa}\u00A0\u00A0\u00A0عرض: ${NumberToPersianWord.convertEnToPe(`${temp.width}`) + postfixFa}` : `Left: ${temp.width + postfixEn}\u00A0\u00A0\u00A0Right: ${temp.length + postfixEn}`;
                    // setStepSelectedLabel(tempLabels);
                }
            } else {
                let temp = JSON.parse(JSON.stringify(widthLength));
                temp.length = obj.value;
                setWidthLength(temp);
                
                if (temp.length !== "" && temp.width !== "") {
                    // let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                    // tempLabels[refIndex] = pageLang === "fa" ? `ارتفاع:  ${NumberToPersianWord.convertEnToPe(`${temp.length}`) + postfixFa}\u00A0\u00A0\u00A0عرض: ${NumberToPersianWord.convertEnToPe(`${temp.width}`) + postfixFa}` : `Left: ${temp.width + postfixEn}\u00A0\u00A0\u00A0Right: ${temp.length + postfixEn}`;
                    // setStepSelectedLabel(tempLabels);
                }
            }
        }
    }
    
    function optionSelectChanged_LeftRight(obj, refIndex, isLeft, postfixEn, postfixFa, pageLang) {
        if (obj !== undefined) {
            if (isLeft) {
                let temp = JSON.parse(JSON.stringify(leftRight));
                temp.left = obj.value;
                setLeftRight(temp);
                
                if (temp.right !== "" && temp.left !== "") {
                    let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                    tempLabels[refIndex] = pageLang === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp.right}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp.left}`) + postfixFa}` : `Left: ${temp.left + postfixEn}\u00A0\u00A0\u00A0Right: ${temp.right + postfixEn}`;
                    setStepSelectedLabel(tempLabels);
                }
            } else {
                let temp = JSON.parse(JSON.stringify(leftRight));
                temp.right = obj.value;
                setLeftRight(temp);
                
                if (temp.right !== "" && temp.left !== "") {
                    let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                    tempLabels[refIndex] = pageLang === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp.right}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp.left}`) + postfixFa}` : `Left: ${temp.left + postfixEn}\u00A0\u00A0\u00A0Right: ${temp.right + postfixEn}`;
                    setStepSelectedLabel(tempLabels);
                }
            }
        }
    }
    
    function optionSelectChanged(refIndex, selected, postfixEn, postfixFa, pageLang) {
        if (selected !== undefined) {
            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
            tempLabels[refIndex] = pageLang === "fa" ? `${NumberToPersianWord.convertEnToPe(`${selected.value}`) + postfixFa}` : `${selected.value + postfixEn}`;
            setStepSelectedLabel(tempLabels);
            
            let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
            tempValue[refIndex] = selected.value;
            // console.log(tempValue);
            setStepSelectedValue(tempValue);
        }
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
    
    function setBasketNumber(refIndex, numValue, type, minusPlus) {
        if(isLoggedIn){
        
        }
        else {
            // console.log(refIndex);
            let temp = [];
            let typeString = "";
            let cartObj = {};
            if (type === 0) {
                if (localStorage.getItem("cart") !== null) {
                    cartObj = JSON.parse(localStorage.getItem("cart"));
                    temp = cartObj["drapery"];
                    typeString = "drapery";
                } else {
                    renderCart();
                }
            } else if (type === 1) {
                if (localStorage.getItem("cart") !== null) {
                    cartObj = JSON.parse(localStorage.getItem("cart"));
                    temp = cartObj["product"];
                    typeString = "product";
                } else {
                    renderCart();
                }
            } else {
                if (localStorage.getItem("cart") !== null) {
                    cartObj = JSON.parse(localStorage.getItem("cart"));
                    temp = cartObj["swatches"];
                    typeString = "swatches";
                } else {
                    renderCart();
                }
            }
            if (temp !== []) {
                if (minusPlus !== undefined) {
                    if (temp[refIndex] === undefined) {
                        temp[refIndex]["qty"] = 1;
                        cartObj[typeString] = temp;
                        localStorage.setItem('cart', JSON.stringify(cartObj));
                        renderCart(cartObj);
                    } else {
                        if (temp[refIndex]["qty"] + minusPlus <= 0 || temp[refIndex]["qty"] + minusPlus > 10)
                            setBasketNumber(refIndex, temp[refIndex]["qty"] + minusPlus, type);
                        else {
                            temp[refIndex]["qty"] = temp[refIndex]["qty"] + minusPlus;
                            cartObj[typeString] = temp;
                            localStorage.setItem('cart', JSON.stringify(cartObj));
                            renderCart(cartObj);
                        }
                    }
                } else {
                    if (numValue > 10) {
                        temp[refIndex]["qty"] = 10;
                        cartObj[typeString] = temp;
                        localStorage.setItem('cart', JSON.stringify(cartObj));
                        renderCart(cartObj);
                        
                    } else if (numValue <= 0) {
                        draperyRef.current[refIndex].className = "custom_cart_item is_loading";
                        setTimeout(() => {
                            draperyRef.current[refIndex].className = "custom_cart_item";
                            temp.splice(refIndex, 1);
                            cartObj[typeString] = temp;
                            localStorage.setItem('cart', JSON.stringify(cartObj));
                            renderCart(cartObj);
                        }, 1500);
                    } else {
                        temp[refIndex]["qty"] = numValue;
                        cartObj[typeString] = temp;
                        localStorage.setItem('cart', JSON.stringify(cartObj));
                        renderCart(cartObj);
                    }
                }
            }
        }
    }
    
    function setCart(refIndex, cartValue, delRefs, secondRedIndex, secondCartValue) {
        let temp = JSON.parse(JSON.stringify(cartValues));
        temp[refIndex] = cartValue;
        if (delRefs !== undefined) {
            let tempArr = delRefs.split(',');
            tempArr.forEach(ref => {
                if (ref !== undefined) {
                    if (temp[ref] !== undefined)
                        delete temp[ref];
                }
            });
        }
        if (secondRedIndex !== undefined) {
            let tempArr1 = secondRedIndex.split(',');
            tempArr1.forEach((ref, index) => {
                if (ref !== undefined) {
                    temp[ref] = secondCartValue[index]
                }
            });
        }
        // console.log(temp);
        // console.log(refIndex, cartValue);
        // setTimeout(() => {
        // console.log(temp);
        // }, 1000);
        let tempPostObj = {};
        tempPostObj["ApiKey"] = window.$apikey;
        tempPostObj["WindowCount"] = 1;
        tempPostObj["SewingModelId"] = `${modelID}`;
        
        let cartInfo = JSON.parse(JSON.stringify(CartInfo))[`${modelID}`]["data"];
        
        Object.keys(temp).forEach(key => {
            if (temp[key] !== null || temp[key] !== "") {
                let tempObj = cartInfo.find(obj => obj["cart"] === key);
                if (tempObj === undefined) {
                    window.location.reload();
                } else {
                    if (tempObj["apiLabel"] !== "") {
                        if (tempObj["apiValue"] === null) {
                            tempPostObj[tempObj["apiLabel"]] = temp[key];
                        } else {
                            tempPostObj[tempObj["apiLabel"]] = tempObj["apiValue"][temp[key]];
                        }
                    }
                }
            }
        });
        
        tempPostObj["SewingOrderDetails"] = [];
        tempPostObj["SewingOrderDetails"][0] = {};
        tempPostObj["SewingOrderDetails"][0]["CurtainPartId"] = 2303;
        tempPostObj["SewingOrderDetails"][0]["SewingModelId"] = `${modelID}`;
        tempPostObj["SewingOrderDetails"][0]["IsLowWrinkle"] = true;
        tempPostObj["SewingOrderDetails"][0]["IsCoverAll"] = true;
        tempPostObj["SewingOrderDetails"][0]["IsAltogether"] = true;
        
        Object.keys(temp).forEach(key => {
            if (temp[key] !== null || temp[key] !== "") {
                let tempObj = cartInfo.find(obj => obj["cart"] === key);
                if (tempObj["apiLabel2"] !== undefined) {
                    if (tempObj["apiValue2"] === null) {
                        tempPostObj["SewingOrderDetails"][0][tempObj["apiLabel2"]] = temp[key];
                    } else {
                        tempPostObj["SewingOrderDetails"][0][tempObj["apiLabel2"]] = tempObj["apiValue2"][temp[key]];
                    }
                }
            }
        });
        tempPostObj["SewingOrderDetails"][0]["Accessories"] = [];
        Object.keys(temp).forEach(key => {
            if (temp[key] !== null || temp[key] !== "") {
                let tempObj = cartInfo.find(obj => obj["cart"] === key);
                if (tempObj["apiAcc"] !== undefined) {
                    if (tempObj["apiAcc"] === true) {
                        tempPostObj["SewingOrderDetails"][0]["Accessories"].push(tempObj["apiAccValue"][temp[key]]);
                    } else {
                    
                    }
                }
            }
        });
        tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
            return el != null;
        });
        
        if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined && stepSelectedValue["2"] !== undefined && stepSelectedValue["3"] !== undefined) {
            // console.log(JSON.stringify(tempPostObj));
            axios.post(baseURLPrice, tempPostObj)
                .then((response) => {
                    setPrice(response.data["price"]);
                    
                    // setCart("HeightCart", totalHeight, "", "WidthCart", [totalWidth]);
                    if (stepSelectedValue["2"] === "1" && stepSelectedValue["3"] === "2") {
                        if (stepSelectedOptions.values["3AIn"] !== undefined && stepSelectedOptions.values["3BIn"] !== undefined) {
                            if (stepSelectedOptions.values["3AIn"].filter(function (e) {
                                return e
                            }).length === 3 && stepSelectedOptions.values["3BIn"].filter(function (e) {
                                return e
                            }).length === 3) {
                                getWindowSize(response.data["Width"], response.data["Height"]);
                                temp["WidthCart"] = response.data["Width"];
                                temp["HeightCart"] = response.data["Height"];
                            }
                        }
                    } else if (stepSelectedValue["2"] === "2" && stepSelectedValue["3"] === "2") {
                        if (stepSelectedValue["3AOut"] !== undefined && leftRight.right !== "" && leftRight.left !== "" && stepSelectedValue["3COut"] !== undefined && stepSelectedValue["3DOut"] !== undefined) {
                            getWindowSize(response.data["Width"], response.data["Height"]);
                            temp["WidthCart"] = response.data["Width"];
                            temp["HeightCart"] = response.data["Height"];
                        }
                    } else {
                        getWindowSize(response.data["Width"], response.data["Height"]);
                        temp["WidthCart"] = response.data["Width"];
                        temp["HeightCart"] = response.data["Height"];
                    }
                }).catch(err => {
                setPrice(0);
                if (temp["HeightCart"] !== undefined)
                    delete temp["HeightCart"];
                if (temp["WidthCart"] !== undefined)
                    delete temp["WidthCart"];
                // console.log(err);
            });
        }
        setCartValues(temp);
    }
    
    function deleteSpecialSelects(InOut) {
        let temp = selectCustomValues;
        let temp2 = JSON.parse(JSON.stringify(stepSelectedOptions));
        let temp3 = JSON.parse(JSON.stringify(leftRight));
        setWindowSizeBool(false);
        
        if (InOut === 1) {
            temp.width1 = [];
            temp.width2 = [];
            temp.width3 = [];
            temp.height1 = [];
            temp.height2 = [];
            temp.height3 = [];
            setSelectCustomValues(temp);
            
            temp2.labels["3AIn"] = [];
            temp2.values["3AIn"] = [];
            temp2.labels["3BIn"] = [];
            temp2.values["3BIn"] = [];
            setStepSelectedOptions(temp2);
        } else if (InOut === 2) {
            temp.width3A = [];
            temp.height3C = [];
            temp.left = [];
            temp.right = [];
            temp.shadeMount = [];
            setSelectCustomValues(temp);
            
            temp3.left = "";
            temp3.right = "";
            setLeftRight(temp3);
        } else if (InOut === 3) {
            temp.width = [];
            temp.length = [];
            setSelectCustomValues(temp);
        } else {
            temp.width1 = [];
            temp.width2 = [];
            temp.width3 = [];
            temp.height1 = [];
            temp.height2 = [];
            temp.height3 = [];
            temp.width3A = [];
            temp.height3C = [];
            temp.left = [];
            temp.right = [];
            temp.shadeMount = [];
            setSelectCustomValues(temp);
            
            temp2.labels["3AIn"] = [];
            temp2.values["3AIn"] = [];
            temp2.labels["3BIn"] = [];
            temp2.values["3BIn"] = [];
            setStepSelectedOptions(temp2);
            
            temp3.left = "";
            temp3.right = "";
            setLeftRight(temp3);
        }
    }
    
    function selectUncheck(e) {
        let refIndex = e.target.getAttribute('ref-num');
        let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
        delete tempLabels[refIndex];
        setStepSelectedLabel(tempLabels);
        
        let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
        if (tempValue[refIndex] !== undefined)
            delete tempValue[refIndex];
        setStepSelectedValue(tempValue);
        e.target.checked = false;
    }
    
    function setDeps(addDeps, removeDeps) {
        let depSetTempArr = new Set([...depSet]);
        if (addDeps !== undefined && addDeps !== "") {
            let tempArr = addDeps.split(',');
            tempArr.forEach(dep => {
                if (dep !== undefined && dep !== "") {
                    depSetTempArr.add(dep);
                }
            });
        }
        if (removeDeps !== undefined && removeDeps !== "") {
            let tempArr = removeDeps.split(',');
            tempArr.forEach(dep => {
                if (dep !== undefined && dep !== "") {
                    depSetTempArr = new Set([...depSetTempArr].filter(x => x !== dep))
                    // depSetTempArr.delete(dep);
                }
            });
        }
        // console.log([...new Set(depSet)]);
        // console.log(depSetTempArr);
        setDepSet(depSetTempArr);
    }
    
    const doNotShow = ["ModelId", "qty", "Width1", "Height1", "Width2", "Height2", "Width3", "Height3", "RoomNameEn", "RoomNameFa", "calcMeasurements", "FabricId", "PhotoUrl", "RemoteName",
        "hasPower", "WindowName", "ExtensionLeft", "ExtensionRight", "Height3C", "Width3A", "ShadeMount", "ModelNameEn", "ModelNameFa", "FabricColorEn", "FabricColorFa", "FabricDesignEn", "FabricDesignFa"];
    
    function addToCart() {
        let tempDepSet = [...depSet];
        let tempNewSet = new Set();
        let tempErr = [];
        tempDepSet.forEach(dependency => {
            tempNewSet.add(dependency.split('')[0]);
            // tempNewSet.add(dependency);
            // console.log(dependency)
        });
        
        if (tempNewSet.size > 0) {
            let temp = JSON.parse(JSON.stringify(requiredStep));
            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
            [...tempNewSet].sort(function (a, b) {
                return a - b
            }).forEach((dependency, index) => {
                while (steps.current[dependency] === undefined) {
                    dependency = dependency.slice(0, -1);
                    if (dependency === "")
                        break;
                }
                if (steps.current[dependency] !== undefined) {
                    let type = steps.current[dependency].getAttribute("type-of-step") === "1" ? (pageLanguage === 'fa' ? " را مشخص کنید" : "SPECIFY ") : (pageLanguage === 'fa' ? " را انتخاب کنید" : "SELECT ");
                    tempErr.push(
                        <li key={index}>
                            {pageLanguage === 'fa' ? "شما باید " + steps.current[dependency].getAttribute("cart-custom-text") + type : "YOU MUST " + type + steps.current[dependency].getAttribute("cart-custom-text")}
                        </li>
                    );
                }
            });
            
            tempNewSet = new Set();
            
            tempDepSet.forEach(dependency => {
                // tempNewSet.add(dependency.split('')[0]);
                tempNewSet.add(dependency);
                // console.log(dependency)
            });
            [...tempNewSet].sort(function (a, b) {
                return a - b
            }).forEach((dependency, index) => {
                while (steps.current[dependency] === undefined) {
                    dependency = dependency.slice(0, -1);
                    if (dependency === "")
                        break;
                }
                if (steps.current[dependency] !== undefined) {
                    temp[dependency] = true;
                    delete tempLabels[dependency];
                }
            });
            
            setTimeout(() => {
                setRequiredStep(temp);
            }, 1000);
            setStepSelectedLabel(tempLabels);
            setAddCartErr(tempErr);
            modalHandleShow("addToCartErr");
        } else {
            let cartInfo = JSON.parse(JSON.stringify(CartInfo))[`${modelID}`]["data"];
            let tempArr = [];
            let temp1 = [];
            let temp = JSON.parse(JSON.stringify(cartValues));
            let tempPostObj = {};
            let tempBagPrice = 0;
            
            tempPostObj["ApiKey"] = window.$apikey;
            tempPostObj["WindowCount"] = 1;
            tempPostObj["SewingModelId"] = `${modelID}`;
            Object.keys(temp).forEach(key => {
                if (temp[key] !== null || temp[key] !== "") {
                    let tempObj = cartInfo.find(obj => obj["cart"] === key);
                    if (tempObj["apiLabel"] !== "") {
                        if (tempObj["apiValue"] === null) {
                            tempPostObj[tempObj["apiLabel"]] = temp[key];
                        } else {
                            tempPostObj[tempObj["apiLabel"]] = tempObj["apiValue"][temp[key]];
                        }
                    }
                }
            });
            tempPostObj["SewingOrderDetails"] = [];
            tempPostObj["SewingOrderDetails"][0] = {};
            tempPostObj["SewingOrderDetails"][0]["CurtainPartId"] = 2303;
            tempPostObj["SewingOrderDetails"][0]["SewingModelId"] = `${modelID}`;
            tempPostObj["SewingOrderDetails"][0]["IsLowWrinkle"] = true;
            tempPostObj["SewingOrderDetails"][0]["IsCoverAll"] = true;
            tempPostObj["SewingOrderDetails"][0]["IsAltogether"] = true;
            Object.keys(temp).forEach(key => {
                if (temp[key] !== null || temp[key] !== "") {
                    let tempObj = cartInfo.find(obj => obj["cart"] === key);
                    if (tempObj["apiLabel2"] !== undefined) {
                        if (tempObj["apiValue2"] === null) {
                            tempPostObj["SewingOrderDetails"][0][tempObj["apiLabel2"]] = temp[key];
                        } else {
                            tempPostObj["SewingOrderDetails"][0][tempObj["apiLabel2"]] = tempObj["apiValue2"][temp[key]];
                        }
                    }
                }
            });
            tempPostObj["SewingOrderDetails"][0]["Accessories"] = [];
            Object.keys(temp).forEach(key => {
                if (temp[key] !== null || temp[key] !== "") {
                    let tempObj = cartInfo.find(obj => obj["cart"] === key);
                    if (tempObj["apiAcc"] !== undefined) {
                        if (tempObj["apiAcc"] === true) {
                            tempPostObj["SewingOrderDetails"][0]["Accessories"].push(tempObj["apiAccValue"][temp[key]]);
                        } else {
                        
                        }
                    }
                }
            });
            tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
                return el != null;
            });
            // console.log(tempPostObj);
            if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined) {
                // console.log(JSON.stringify(tempPostObj));
                axios.post(baseURLPrice, tempPostObj)
                    .then((response) => {
                        setBagPrice(response.data["price"]);
                        tempBagPrice = response.data["price"];
                        temp["price"] = response.data["price"];
                        // console.log(response.data);
                        
                        
                        let roomNameFa = cartValues["RoomNameFa"];
                        let roomName = cartValues["RoomNameEn"];
                        let WindowName = cartValues["WindowName"] === undefined ? "" : cartValues["WindowName"];
                        Object.keys(cartValues).forEach(key => {
                            let tempObj = cartInfo.find(obj => obj["cart"] === key);
                            if (tempObj === undefined) {
                                window.location.reload();
                            } else {
                                if (tempObj["title"] !== "" && tempObj["lang"].indexOf(pageLanguage) > -1) {
                                    let objLabel = "";
                                    if (tempObj["titleValue"] === null) {
                                        if (tempObj["titlePostfix"] === "") {
                                            objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${t(cartValues[key].toString())}`).toString() : t(cartValues[key].toString());
                                        } else {
                                            objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${cartValues[key]}`).toString() + t(tempObj["titlePostfix"]) : cartValues[key].toString() + t(tempObj["titlePostfix"]);
                                        }
                                        // objLabel = cartValues[key].toString() + tempObj["titlePostfix"];
                                    } else {
                                        if (tempObj["titleValue"][cartValues[key].toString()] === null) {
                                            if (tempObj["titlePostfix"] === "") {
                                                objLabel = t(cartValues[key].toString());
                                            } else {
                                                objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${cartValues[key]}`).toString() + t(tempObj["titlePostfix"]) : cartValues[key].toString() + t(tempObj["titlePostfix"]);
                                            }
                                        } else {
                                            objLabel = t(tempObj["titleValue"][cartValues[key].toString()]);
                                        }
                                    }
                                    temp1[tempObj["order"]] =
                                        <li className="cart_agree_item" key={key}>
                                            <h1 className="cart_agree_item_title">{t(tempObj["title"])}&nbsp;</h1>
                                            <h2 className="cart_agree_item_desc">{objLabel}</h2>
                                        </li>;
                                }
                            }
                        });
                        tempArr.push(
                            <div key={defaultModelName}>
                                <h2 className="cart_agree_title2">{pageLanguage === 'fa' ? defaultModelNameFa + " سفارشی " : "Custom " + defaultModelName}</h2>
                                <ul className="cart_agree_items_container">
                                    {temp1}
                                    <li className="cart_agree_item">
                                        <h1 className="cart_agree_item_title">{pageLanguage === 'fa' ? "نام اتاق" : "Room Label"}&nbsp;</h1>
                                        <h2 className="cart_agree_item_desc">{pageLanguage === 'fa' ? roomNameFa + (WindowName === "" ? "" : " / " + WindowName) : roomName + (WindowName === "" ? "" : " / " + WindowName)}</h2>
                                    </li>
                                    <li className="cart_agree_item">
                                        <h1 className="cart_agree_item_title">{t("Price")}&nbsp;</h1>
                                        <h2 className="cart_agree_item_desc">{GetPrice(tempBagPrice, pageLanguage, t("TOMANS"))}</h2>
                                    </li>
                                </ul>
                            </div>
                        );
                        setCartAgree(tempArr);
                        modalHandleShow("cart_modal");
                        setCartValues(temp);
                        
                    }).catch(err => {
                    setPrice(0);
                    setBagPrice(0);
                    temp["price"] = 0;
                    setCartValues(temp);
                    console.log(err);
                });
            }
            // console.log(cartValues);
        }
        // modalHandleShow("cart_modal");
        // renderCart();
        // setCartStateAgree(true);
        
    }
    
    function addToCart_agreed() {
        let customPageCart = {};
        AddProjectToCart(cartValues, `${modelID}`, price, defaultModelName, defaultModelNameFa, cartProjectIndex,navigate, isLoggedIn).then((temp) => {
            if (temp) {
                renderCart(temp);
                setTimeout(() => {
                    // modalHandleShow("cart_modal");
                    setCartStateAgree(true);
                }, 500);
            }
        });
    }
    
    function renderCart(customPageCart) {
        let cartObjects = {};
        let promise2 = new Promise((resolve, reject) => {
            if (customPageCart !== undefined) {
                cartObjects = customPageCart;
                resolve();
            } else {
                if (isLoggedIn) {
                    axios.get(baseURLGetCart, {
                        headers: authHeader()
                    }).then((response) => {
                        cartObjects = response.data;
                        resolve();
                    }).catch(err => {
                        if (err.response.status === 401) {
                            refreshToken().then((response2) => {
                                if (response2 !== false) {
                                    renderCart(customPageCart);
                                } else {
                                }
                            });
                        } else {
                            reject();
                            modalHandleClose("cart_modal");
                        }
                    });
                } else {
                    if (localStorage.getItem("cart") === null) {
                        setCartItems([]);
                        modalHandleClose("cart_modal");
                        reject();
                    } else {
                        cartObjects = JSON.parse(localStorage.getItem("cart"));
                        resolve();
                    }
                }
            }
        });
        promise2.then(() => {
            if (cartObjects !== {}) {
                let temp1 = [];
                let cartCount = 0;
                if (isLoggedIn) {
                    cartCount += cartObjects["CartDetails"].length;
                    let draperiesTotalPrice = 0;
                    let promiseArr = [];
                    
                    cartObjects["CartDetails"]["preorderText"].forEach((obj, index) => {
                        let tempPostObj = {};
                        tempPostObj["ApiKey"] = window.$apikey;
                        let cartInfo = JSON.parse(JSON.stringify(CartInfo))[obj["ModelId"]]["data"];
                        let temp = obj;
                        
                        Object.keys(temp).forEach(key => {
                            if (temp[key] !== null || temp[key] !== "") {
                                let tempObj = cartInfo.find(obj => obj["cart"] === key);
                                if (tempObj["apiLabel"] !== "") {
                                    if (tempObj["apiValue"] === null) {
                                        tempPostObj[tempObj["apiLabel"]] = temp[key];
                                    } else {
                                        tempPostObj[tempObj["apiLabel"]] = tempObj["apiValue"][temp[key]];
                                    }
                                }
                            }
                        });
                        
                        tempPostObj["SewingOrderDetails"] = [];
                        tempPostObj["SewingOrderDetails"][0] = {};
                        tempPostObj["SewingOrderDetails"][0]["CurtainPartId"] = 2303;
                        tempPostObj["SewingOrderDetails"][0]["SewingModelId"] = `${modelID}`;
                        tempPostObj["SewingOrderDetails"][0]["IsLowWrinkle"] = true;
                        tempPostObj["SewingOrderDetails"][0]["IsCoverAll"] = true;
                        tempPostObj["SewingOrderDetails"][0]["IsAltogether"] = true;
                        
                        Object.keys(temp).forEach(key => {
                            if (temp[key] !== null || temp[key] !== "") {
                                let tempObj = cartInfo.find(obj => obj["cart"] === key);
                                if (tempObj["apiLabel2"] !== undefined) {
                                    if (tempObj["apiValue2"] === null) {
                                        tempPostObj["SewingOrderDetails"][0][tempObj["apiLabel2"]] = temp[key];
                                    } else {
                                        tempPostObj["SewingOrderDetails"][0][tempObj["apiLabel2"]] = tempObj["apiValue2"][temp[key]];
                                    }
                                }
                            }
                        });
                        
                        tempPostObj["SewingOrderDetails"][0]["Accessories"] = [];
                        Object.keys(temp).forEach(key => {
                            if (temp[key] !== null || temp[key] !== "") {
                                let tempObj = cartInfo.find(obj => obj["cart"] === key);
                                if (tempObj["apiAcc"] !== undefined) {
                                    if (tempObj["apiAcc"] === true) {
                                        tempPostObj["SewingOrderDetails"][0]["Accessories"].push(tempObj["apiAccValue"][temp[key]]);
                                    } else {
                                    
                                    }
                                }
                            }
                        });
                        tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
                            return el != null;
                        });
                        
                        if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined) {
                            promiseArr[index] = axios.post(baseURLPrice, tempPostObj);
                        }
                    });
                    Promise.all(promiseArr).then(function (values) {
                        // console.log(values);
                        cartObjects["CartDetails"]["preorderText"].forEach((obj, index) => {
                            obj["price"] = values[index].data["price"];
                            draperiesTotalPrice += obj["price"];
                            let roomName = (obj["WindowName"] === undefined || obj["WindowName"] === "") ? "" : " / " + obj["WindowName"];
                            temp1[index] =
                                <li className="custom_cart_item" key={"drapery" + index} ref={ref => (draperyRef.current[index] = ref)}>
                                    <div className="custom_cart_item_image_container">
                                        <img src={`https://api.atlaspood.ir/${obj["PhotoUrl"]}`} alt="" className="custom_cart_item_img img-fluid"/>
                                    </div>
                                    <div className="custom_cart_item_desc">
                                        <div className="custom_cart_item_desc_container">
                                            <h1 className="custom_cart_item_desc_name">{pageLanguage === 'fa' ? obj["ModelNameFa"] + " سفارشی " : "Custom " + obj["ModelNameEn"]}</h1>
                                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setBasketNumber(index, 0, 0)}/>
                                        </div>
                                        <div className="custom_cart_item_desc_container">
                                            <h2 className="custom_cart_item_desc_detail">{pageLanguage === 'fa' ? obj["FabricDesignFa"] + " / " + obj["FabricColorFa"] : obj["FabricDesignEn"] + " / " + obj["FabricColorEn"]}</h2>
                                        </div>
                                        <div className="custom_cart_item_desc_container">
                                            <h2 className="custom_cart_item_desc_detail">{pageLanguage === 'fa' ? obj["RoomNameFa"] + roomName : obj["RoomNameEn"] + roomName}</h2>
                                        </div>
                                        <div className="custom_cart_item_desc_container">
                                            <div className="custom_cart_item_desc_qty">
                                                <button type="text" className="basket_qty_minus" onClick={() => setBasketNumber(index, 0, 0, -1)}>–</button>
                                                <input type="text" className="basket_qty_num"
                                                       value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj["qty"]}`) : obj["qty"]}
                                                       onChange={(e) => setBasketNumber(index, NumberToPersianWord.convertPeToEn(`${e.target.value}`), 0)}/>
                                                <button type="text" className="basket_qty_plus" onClick={() => setBasketNumber(index, 0, 0, 1)}>+</button>
                                            </div>
                                            <p className="custom_cart_item_end_price">{GetPrice(obj["price"], pageLanguage, t("TOMANS"))}</p>
                                        </div>
                                    </div>
                                </li>;
                        });
                        setCartItems(temp1);
                        setCartCount(cartCount);
                        localStorage.removeItem("cart");
                        setTotalCartPrice(draperiesTotalPrice);
                        
                    }).catch(err => {
                        console.log(err);
                    });
                    
                    if (cartObjects["CartDetails"].length === 0) {
                        modalHandleClose("cart_modal");
                        setCartStateAgree(false);
                    }
                } else {
                    if (cartObjects["drapery"].length) {
                        cartCount += cartObjects["drapery"].length;
                        let draperiesTotalPrice = 0;
                        let promiseArr = [];
                        
                        cartObjects["drapery"].forEach((obj, index) => {
                            let tempPostObj = {};
                            tempPostObj["ApiKey"] = window.$apikey;
                            let cartInfo = JSON.parse(JSON.stringify(CartInfo))[obj["ModelId"]]["data"];
                            let temp = obj;
                            
                            Object.keys(temp).forEach(key => {
                                if (temp[key] !== null || temp[key] !== "") {
                                    let tempObj = cartInfo.find(obj => obj["cart"] === key);
                                    if (tempObj["apiLabel"] !== "") {
                                        if (tempObj["apiValue"] === null) {
                                            tempPostObj[tempObj["apiLabel"]] = temp[key];
                                        } else {
                                            tempPostObj[tempObj["apiLabel"]] = tempObj["apiValue"][temp[key]];
                                        }
                                    }
                                }
                            });
                            
                            tempPostObj["SewingOrderDetails"] = [];
                            tempPostObj["SewingOrderDetails"][0] = {};
                            tempPostObj["SewingOrderDetails"][0]["CurtainPartId"] = 2303;
                            tempPostObj["SewingOrderDetails"][0]["SewingModelId"] = `${modelID}`;
                            tempPostObj["SewingOrderDetails"][0]["IsLowWrinkle"] = true;
                            tempPostObj["SewingOrderDetails"][0]["IsCoverAll"] = true;
                            tempPostObj["SewingOrderDetails"][0]["IsAltogether"] = true;
                            
                            Object.keys(temp).forEach(key => {
                                if (temp[key] !== null || temp[key] !== "") {
                                    let tempObj = cartInfo.find(obj => obj["cart"] === key);
                                    if (tempObj["apiLabel2"] !== undefined) {
                                        if (tempObj["apiValue2"] === null) {
                                            tempPostObj["SewingOrderDetails"][0][tempObj["apiLabel2"]] = temp[key];
                                        } else {
                                            tempPostObj["SewingOrderDetails"][0][tempObj["apiLabel2"]] = tempObj["apiValue2"][temp[key]];
                                        }
                                    }
                                }
                            });
                            
                            tempPostObj["SewingOrderDetails"][0]["Accessories"] = [];
                            Object.keys(temp).forEach(key => {
                                if (temp[key] !== null || temp[key] !== "") {
                                    let tempObj = cartInfo.find(obj => obj["cart"] === key);
                                    if (tempObj["apiAcc"] !== undefined) {
                                        if (tempObj["apiAcc"] === true) {
                                            tempPostObj["SewingOrderDetails"][0]["Accessories"].push(tempObj["apiAccValue"][temp[key]]);
                                        } else {
                                        
                                        }
                                    }
                                }
                            });
                            tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
                                return el != null;
                            });
                            
                            if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined) {
                                promiseArr[index] = axios.post(baseURLPrice, tempPostObj);
                            }
                        });
                        Promise.all(promiseArr).then(function (values) {
                            // console.log(values);
                            cartObjects["drapery"].forEach((obj, index) => {
                                obj["price"] = values[index].data["price"];
                                draperiesTotalPrice += obj["price"];
                                let roomName = (obj["WindowName"] === undefined || obj["WindowName"] === "") ? "" : " / " + obj["WindowName"];
                                temp1[index] =
                                    <li className="custom_cart_item" key={"drapery" + index} ref={ref => (draperyRef.current[index] = ref)}>
                                        <div className="custom_cart_item_image_container">
                                            <img src={`https://api.atlaspood.ir/${obj["PhotoUrl"]}`} alt="" className="custom_cart_item_img img-fluid"/>
                                        </div>
                                        <div className="custom_cart_item_desc">
                                            <div className="custom_cart_item_desc_container">
                                                <h1 className="custom_cart_item_desc_name">{pageLanguage === 'fa' ? obj["ModelNameFa"] + " سفارشی " : "Custom " + obj["ModelNameEn"]}</h1>
                                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setBasketNumber(index, 0, 0)}/>
                                            </div>
                                            <div className="custom_cart_item_desc_container">
                                                <h2 className="custom_cart_item_desc_detail">{pageLanguage === 'fa' ? obj["FabricDesignFa"] + " / " + obj["FabricColorFa"] : obj["FabricDesignEn"] + " / " + obj["FabricColorEn"]}</h2>
                                            </div>
                                            <div className="custom_cart_item_desc_container">
                                                <h2 className="custom_cart_item_desc_detail">{pageLanguage === 'fa' ? obj["RoomNameFa"] + roomName : obj["RoomNameEn"] + roomName}</h2>
                                            </div>
                                            <div className="custom_cart_item_desc_container">
                                                <div className="custom_cart_item_desc_qty">
                                                    <button type="text" className="basket_qty_minus" onClick={() => setBasketNumber(index, 0, 0, -1)}>–</button>
                                                    <input type="text" className="basket_qty_num"
                                                           value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj["qty"]}`) : obj["qty"]}
                                                           onChange={(e) => setBasketNumber(index, NumberToPersianWord.convertPeToEn(`${e.target.value}`), 0)}/>
                                                    <button type="text" className="basket_qty_plus" onClick={() => setBasketNumber(index, 0, 0, 1)}>+</button>
                                                </div>
                                                <p className="custom_cart_item_end_price">{GetPrice(obj["price"], pageLanguage, t("TOMANS"))}</p>
                                            </div>
                                        </div>
                                    </li>;
                            });
                            setCartItems(temp1);
                            setCartCount(cartCount);
                            localStorage.setItem('cart', JSON.stringify(cartObjects));
                            setTotalCartPrice(draperiesTotalPrice);
                            
                        }).catch(err => {
                            console.log(err);
                        });
                    }
                    
                    
                    if (cartObjects["drapery"].length + cartObjects["product"].length + cartObjects["swatches"].length === 0) {
                        modalHandleClose("cart_modal");
                        setCartStateAgree(false);
                    }
                }
            } else {
                setCartCount(0);
            }
            
        });
        axios.get(baseURLFreeShipping).then((response) => {
            setFreeShipPrice(response.data);
        }).catch(err => {
            console.log(err);
        });
    }
    
    function addToProjects() {
    
    }
    
    function fabricClicked(photo, hasTrim) {
        setDefaultFabricPhoto(photo);
        setHasTrim(hasTrim);
        // console.log(hasTrim)
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
    
    function getWindowSize(totalWidth, totalHeight) {
        let tempWindowSize = pageLanguage === "fa" ? `عرض: ${totalWidth}س\u200Cم\u00A0\u00A0\u00A0ارتفاع: ${totalHeight}س\u200Cم` : `Width: ${totalWidth}cm\u00A0\u00A0\u00A0Height: ${totalHeight}cm`;
        setWindowSize(tempWindowSize);
        setWindowSizeBool(true);
        // console.log(totalWidth,totalHeight);
    }
    
    function roomLabelChanged(changedValue, refIndex, isText) {
        if (isText) {
            if (roomLabelSelect.label !== "") {
                let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                if (changedValue === "") {
                    tempLabels[refIndex] = roomLabelSelect.label;
                } else {
                    tempLabels[refIndex] = roomLabelSelect.label + " - " + changedValue;
                }
                setStepSelectedLabel(tempLabels);
            }
        } else {
            let tempSelect = JSON.parse(JSON.stringify(roomLabelSelect));
            tempSelect.label = changedValue.label;
            tempSelect.value = changedValue.value;
            setRoomLabelSelect(tempSelect);
            
            let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
            tempValue[refIndex] = changedValue.value;
            setStepSelectedValue(tempValue);
            
            if (changedValue.label !== "") {
                let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                if (roomLabelText === "") {
                    tempLabels[refIndex] = changedValue.label;
                } else {
                    tempLabels[refIndex] = changedValue.label + " - " + roomLabelText;
                }
                setStepSelectedLabel(tempLabels);
            }
        }
        
    }
    
    function getProjectDetail() {
        axios.get(baseURGetProject, {
            params: {
                id: projectId
            },
            headers: authHeader()
        }).then((response) => {
            setProjectDetails(response.data);
        }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        getProjectDetail();
                    } else {
                        navigate("/" + pageLanguage);
                    }
                });
            } else {
                navigate("/" + pageLanguage + "/Curtain/" + catID + "/" + modelID);
            }
        });
    }
    
    function setProjectDetails(data, editIndex) {
        if (data && data !== {}) {
            setProjectData(data);
        }
        
        let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
        let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
        let selectValues = JSON.parse(JSON.stringify(selectCustomValues));
        let tempSelect = JSON.parse(JSON.stringify(roomLabelSelect));
        let depSetTempArr = new Set([...depSet]);
        
        let postfixFa = "س\u200Cم";
        let postfixEn = "cm";
        
        GetUserProjectData(data, isLoggedIn, editIndex).then((temp) => {
            if (editIndex !== undefined && Object.keys(temp).length !== 0) {
                setCartProjectIndex(editIndex);
            }
            setCartValues(temp);
            
            let tempFabric = {};
            let promise2 = new Promise((resolve, reject) => {
                if (temp["FabricId"]) {
                    axios.get(baseURLFabrics, {
                        params: {
                            modelId: modelID
                        }
                    }).then((response) => {
                        response.data.forEach(obj => {
                            if (obj["FabricId"] === temp["FabricId"]) {
                                tempFabric = obj;
                            }
                        });
                        resolve();
                    }).catch(err => {
                        console.log(err);
                        reject();
                    });
                } else {
                    reject();
                }
            });
            promise2.then(() => {
                if (tempFabric !== {}) {
                    let temp1 = JSON.parse(JSON.stringify(fabricSelected));
                    temp1.selectedFabricId = tempFabric.FabricId;
                    temp1.selectedTextEn = tempFabric.DesignEnName;
                    temp1.selectedTextFa = tempFabric.DesignName;
                    temp1.selectedColorEn = tempFabric.ColorEnName;
                    temp1.selectedColorFa = tempFabric.ColorName;
                    temp1.selectedHasTrim = tempFabric.HasTrim;
                    temp1.selectedPhoto = tempFabric.FabricOnModelPhotoUrl;
                    setFabricSelected(temp1);
                    // fabricClicked(tempFabric["FabricOnModelPhotoUrl"], tempFabric["HasTrim"]);
                    tempLabels["1"] = location.pathname.split('').slice(1, 3).join('') === "fa" ? tempFabric["DesignName"] + "/" + tempFabric["ColorName"] : tempFabric["DesignEnName"] + "/" + tempFabric["ColorEnName"];
                    tempValue["1"] = temp["FabricId"];
                    depSetTempArr = new Set([...setGetDeps("", "1", depSetTempArr)]);
                    // console.log(depSetTempArr);
                    // setStep1(temp["FabricId"]);
                    setStepSelectedLabel(tempLabels);
                    setStepSelectedValue(tempValue);
                    promise2.reject();
                }
            }).catch(() => {
                    // console.log(temp);
                    if (temp["Mount"]) {
                        setStep2(temp["Mount"]);
                        if (temp["Mount"] === "Inside") {
                            let refIndex = inputs.current["21"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["21"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["21"].value;
                            depSetTempArr = new Set([...setGetDeps("", "2", depSetTempArr)]);
                        } else {
                            
                            let refIndex = inputs.current["22"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["22"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["22"].value;
                            depSetTempArr = new Set([...setGetDeps("", "2", depSetTempArr)]);
                        }
                        setStepSelectedLabel(tempLabels);
                        setStepSelectedValue(tempValue);
                    }
                    
                    if (temp["calcMeasurements"] !== undefined) {
                        // console.log(temp["calcMeasurements"].toString());
                        setStep3(temp["calcMeasurements"].toString());
                        if (!temp["calcMeasurements"]) {
                            let refIndex = inputs.current["31"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["31"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["31"].value;
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            
                            selectValues["width"] = temp["Width"] ? [{value: temp["Width"]}] : [];
                            selectValues["length"] = temp["Height"] ? [{value: temp["Height"]}] : [];
                            depSetTempArr = new Set([...setGetDeps((temp["Width"] ? "" : "31,") + (temp["Height"] ? "" : "32,"), "3", depSetTempArr)]);
                            setSelectCustomValues(selectValues);
                            
                        } else {
                            let refIndex = inputs.current["32"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["32"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["32"].value;
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            if (temp["Mount"]) {
                                if (temp["Mount"] === "Inside") {
                                    selectValues["width1"] = temp["Width"] ? [{value: temp["Width"]}] : [];
                                    selectValues["width2"] = temp["Width2"] ? [{value: temp["Width2"]}] : [];
                                    selectValues["width3"] = temp["Width3"] ? [{value: temp["Width3"]}] : [];
                                    selectValues["height1"] = temp["Height"] ? [{value: temp["Height"]}] : [];
                                    selectValues["height2"] = temp["Height2"] ? [{value: temp["Height2"]}] : [];
                                    selectValues["height3"] = temp["Height3"] ? [{value: temp["Height3"]}] : [];
                                    if (temp["Width"] && temp["Width2"] && temp["Width3"]) {
                                        let tempMin = Math.min(temp["Width"], temp["Width2"], temp["Width3"]);
                                        tempLabels["3AIn"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMin}`) + postfixFa : tempMin + postfixEn;
                                    }
                                    if (temp["Height"] && temp["Height2"] && temp["Height3"]) {
                                        let tempMax = Math.max(temp["Height"], temp["Height2"], temp["Height3"]);
                                        tempLabels["3BIn"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMax}`) + postfixFa : tempMax + postfixEn;
                                    }
                                    
                                    depSetTempArr = new Set([...setGetDeps((temp["Width"] ? "" : "3AIn1,") + (temp["Width2"] ? "" : "3AIn2,") + (temp["Width3"] ? "" : "3AIn3,") + (temp["Height"] ? "" : "3BIn1,") + (temp["Height2"] ? "" : "3BIn2,") + (temp["Height3"] ? "" : "3BIn3,"), "3", depSetTempArr)]);
                                    setSelectCustomValues(selectValues);
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                } else {
                                    selectValues["width3A"] = temp["Width"] ? [{value: temp["Width"]}] : [];
                                    if (temp["Width"]) {
                                        tempLabels["3AOut"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["Width"]}`) + postfixFa : temp["Width"] + postfixEn;
                                    }
                                    selectValues["height3C"] = temp["Height"] ? [{value: temp["Height"]}] : [];
                                    if (temp["Height"]) {
                                        tempLabels["3COut"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["Height"]}`) + postfixFa : temp["Height"] + postfixEn;
                                    }
                                    selectValues["left"] = temp["ExtensionLeft"] ? [{value: temp["ExtensionLeft"]}] : [];
                                    selectValues["right"] = temp["ExtensionRight"] ? [{value: temp["ExtensionRight"]}] : [];
                                    if (temp["ExtensionLeft"] && temp["ExtensionRight"]) {
                                        tempLabels["3BOut"] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionRight"]}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionLeft"]}`) + postfixFa}` : `Left: ${temp["ExtensionLeft"] + postfixEn}\u00A0\u00A0\u00A0Right: ${temp["ExtensionRight"] + postfixEn}`;
                                    }
                                    selectValues["ShadeMount"] = temp["ShadeMount"] ? [{value: temp["ShadeMount"]}] : [];
                                    if (temp["ShadeMount"]) {
                                        tempLabels["3DOut"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["ShadeMount"]}`) + postfixFa : temp["ShadeMount"] + postfixEn;
                                    }
                                    
                                    depSetTempArr = new Set([...setGetDeps((temp["Width"] ? "" : "3AOut,") + (temp["Height"] ? "" : "3COut,") + (temp["ExtensionLeft"] ? "" : "3BOut1,") + (temp["ExtensionRight"] ? "" : "3BOut2,") + (temp["ShadeMount"] ? "" : "3DOut,"), "3", depSetTempArr)]);
                                    setSelectCustomValues(selectValues);
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                }
                            }
                        }
                    }
                    if (temp["WidthCart"] && temp["HeightCart"]) {
                        getWindowSize(temp["WidthCart"], temp["HeightCart"]);
                    }
                    
                    if (temp["ControlType"]) {
                        setStep4(temp["ControlType"]);
                        if (temp["ControlType"] === "Continuous Loop") {
                            let refIndex = inputs.current["41"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["41"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["41"].value;
                            
                            depSetTempArr = new Set([...setGetDeps((temp["ControlPosition"] ? "" : "4A,") + (temp["ChainLength"] ? "" : "4B,"), "4", depSetTempArr)]);
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            
                            if (temp["ControlPosition"]) {
                                setStep4A(temp["ControlPosition"].toString());
                                if (temp["ControlPosition"] === "Left") {
                                    let refIndex = inputs.current["4A1"].getAttribute('ref-num');
                                    tempLabels[refIndex] = inputs.current["4A1"].getAttribute('text');
                                    tempValue[refIndex] = inputs.current["4A1"].value;
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                } else {
                                    
                                    let refIndex = inputs.current["4A2"].getAttribute('ref-num');
                                    tempLabels[refIndex] = inputs.current["4A2"].getAttribute('text');
                                    tempValue[refIndex] = inputs.current["4A2"].value;
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                }
                            }
                            
                            if (temp["ChainLength"]) {
                                setStep4B(temp["ChainLength"].toString());
                                if (temp["ChainLength"].toString() === "150") {
                                    let refIndex = inputs.current["4B1"].getAttribute('ref-num');
                                    tempLabels[refIndex] = inputs.current["4B1"].getAttribute('text');
                                    tempValue[refIndex] = inputs.current["4B1"].value;
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                } else if (temp["ChainLength"].toString() === "300") {
                                    let refIndex = inputs.current["4B2"].getAttribute('ref-num');
                                    tempLabels[refIndex] = inputs.current["4B2"].getAttribute('text');
                                    tempValue[refIndex] = inputs.current["4B2"].value;
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                } else {
                                    let refIndex = inputs.current["4B3"].getAttribute('ref-num');
                                    tempLabels[refIndex] = inputs.current["4B3"].getAttribute('text');
                                    tempValue[refIndex] = inputs.current["4B3"].value;
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                }
                            }
                            
                        } else {
                            let refIndex = inputs.current["42"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["42"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["42"].value;
                            
                            depSetTempArr = new Set([...setGetDeps((temp["hasPower"] ? (temp["MotorPosition"] ? "" : "411,") : "41,"), "4", depSetTempArr)]);
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            if (temp["hasPower"] !== undefined) {
                                setStep41(temp["hasPower"].toString());
                                let refIndex = inputs.current["411"].getAttribute('ref-num');
                                tempLabels[refIndex] = inputs.current["411"].getAttribute('text');
                                tempValue[refIndex] = inputs.current["411"].value;
                                setStepSelectedLabel(tempLabels);
                                setStepSelectedValue(tempValue);
                                
                                setSelectedMotorPosition(temp["MotorPosition"] ? [{
                                    value: temp["MotorPosition"],
                                    label: MotorPosition[pageLanguage].find(opt => opt.value === temp["MotorPosition"]).label
                                }] : []);
                                setRemoteName(temp["RemoteName"] ? temp["RemoteName"] : "");
                                setSelectedMotorChannels(temp["MotorChannels"] ? temp["MotorChannels"].map(item => ({
                                    value: item,
                                    label: motorChannels[pageLanguage].find(opt => opt.value === item).label
                                })) : []);
                            }
                        }
                    }
                    
                    if (temp["Headrail"]) {
                        setStep5(temp["Headrail"]);
                        
                        if (temp["Headrail"] === "MetalValance") {
                            let refIndex = inputs.current["53"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["53"].getAttribute('text') + (temp["MetalValanceColor"] ? "/" + temp["MetalValanceColor"] : "");
                            tempValue[refIndex] = inputs.current["53"].value;
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            setSelectedValanceColor1(temp["MetalValanceColor"] ? [{
                                value: temp["MetalValanceColor"],
                                label: optionsMetalValance[pageLanguage].find(opt => opt.value === temp["MetalValanceColor"]).label
                            }] : []);
                            depSetTempArr = new Set([...setGetDeps((temp["MetalValanceColor"] ? "" : "53,"), "5", depSetTempArr)]);
                        } else if (temp["Headrail"] === "MetalValanceFabricInsert") {
                            let refIndex = inputs.current["54"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["54"].getAttribute('text') + (temp["MetalValanceColor"] ? "/" + temp["MetalValanceColor"] : "");
                            tempValue[refIndex] = inputs.current["54"].value;
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            setSelectedValanceColor2(temp["MetalValanceColor"] ? [{
                                value: temp["MetalValanceColor"],
                                label: optionsMetalValance[pageLanguage].find(opt => opt.value === temp["MetalValanceColor"]).label
                            }] : []);
                            depSetTempArr = new Set([...setGetDeps((temp["MetalValanceColor"] ? "" : "54,"), "5", depSetTempArr)]);
                        } else if (temp["Headrail"] === "Upholstered") {
                            let refIndex = inputs.current["52"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["52"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["52"].value;
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            depSetTempArr = new Set([...setGetDeps("", "5", depSetTempArr)]);
                        } else {
                            let refIndex = inputs.current["51"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["51"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["51"].value;
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            depSetTempArr = new Set([...setGetDeps((temp["RollType"] ? "" : "5A,") + (temp["BracketType"] ? "" : "5B,") + (temp["BracketColor"] ? "" : "5C,"), "5", depSetTempArr)]);
                            
                            if (temp["RollType"]) {
                                setStep5A(temp["RollType"]);
                                if (temp["RollType"] === "Regular") {
                                    let refIndex = inputs.current["5A1"].getAttribute('ref-num');
                                    tempLabels[refIndex] = inputs.current["5A1"].getAttribute('text');
                                    tempValue[refIndex] = inputs.current["5A1"].value;
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                    depSetTempArr = new Set([...setGetDeps("", "5A", depSetTempArr)]);
                                } else {
                                    let refIndex = inputs.current["5A2"].getAttribute('ref-num');
                                    tempLabels[refIndex] = inputs.current["5A2"].getAttribute('text');
                                    tempValue[refIndex] = inputs.current["5A2"].value;
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                    depSetTempArr = new Set([...setGetDeps("", "5A", depSetTempArr)]);
                                }
                            }
                            if (temp["BracketType"]) {
                                setStep5B(temp["BracketType"]);
                                if (temp["BracketType"] === "Round Edge") {
                                    let refIndex = inputs.current["5B1"].getAttribute('ref-num');
                                    tempLabels[refIndex] = inputs.current["5B1"].getAttribute('text');
                                    tempValue[refIndex] = inputs.current["5B1"].value;
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                    depSetTempArr = new Set([...setGetDeps("", "5B", depSetTempArr)]);
                                } else {
                                    let refIndex = inputs.current["5B2"].getAttribute('ref-num');
                                    tempLabels[refIndex] = inputs.current["5B2"].getAttribute('text');
                                    tempValue[refIndex] = inputs.current["5B2"].value;
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                    depSetTempArr = new Set([...setGetDeps("", "5B", depSetTempArr)]);
                                }
                            }
                            if (temp["BracketColor"]) {
                                setStep5C(temp["BracketColor"]);
                                if (temp["BracketColor"] === "Satin Brass") {
                                    let refIndex = inputs.current["5C1"].getAttribute('ref-num');
                                    tempLabels[refIndex] = inputs.current["5C1"].getAttribute('text');
                                    tempValue[refIndex] = inputs.current["5C1"].value;
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                    depSetTempArr = new Set([...setGetDeps("", "5C", depSetTempArr)]);
                                } else if (temp["BracketColor"] === "Satin Nickel") {
                                    let refIndex = inputs.current["5C2"].getAttribute('ref-num');
                                    tempLabels[refIndex] = inputs.current["5C2"].getAttribute('text');
                                    tempValue[refIndex] = inputs.current["5C2"].value;
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                    depSetTempArr = new Set([...setGetDeps("", "5C", depSetTempArr)]);
                                } else {
                                    let refIndex = inputs.current["5C3"].getAttribute('ref-num');
                                    tempLabels[refIndex] = inputs.current["5C3"].getAttribute('text');
                                    tempValue[refIndex] = inputs.current["5C3"].value;
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                    depSetTempArr = new Set([...setGetDeps("", "5C", depSetTempArr)]);
                                }
                            }
                        }
                    }
                    
                    if (temp["HemStyle"]) {
                        setStep6(temp["HemStyle"]);
                        
                        if (temp["HemStyle"] === "Scallop") {
                            let refIndex = inputs.current["62"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["62"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["62"].value;
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            depSetTempArr = new Set([...setGetDeps("", "6", depSetTempArr)]);
                        } else if (temp["HemStyle"] === "Wave") {
                            let refIndex = inputs.current["63"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["63"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["63"].value;
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            depSetTempArr = new Set([...setGetDeps("", "6", depSetTempArr)]);
                        } else if (temp["HemStyle"] === "Colonial") {
                            let refIndex = inputs.current["64"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["64"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["64"].value;
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            depSetTempArr = new Set([...setGetDeps("", "6", depSetTempArr)]);
                        } else {
                            let refIndex = inputs.current["61"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["61"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["61"].value;
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            depSetTempArr = new Set([...setGetDeps((temp["RollType"] ? "" : "6A,"), "6", depSetTempArr)]);
                            
                            if (temp["BottomBarStyle"]) {
                                setStep6A(temp["BottomBarStyle"]);
                                if (temp["BottomBarStyle"] === "Sewn-In") {
                                    let refIndex = inputs.current["6A1"].getAttribute('ref-num');
                                    tempLabels[refIndex] = inputs.current["6A1"].getAttribute('text');
                                    tempValue[refIndex] = inputs.current["6A1"].value;
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                    depSetTempArr = new Set([...setGetDeps("", "6A", depSetTempArr)]);
                                } else {
                                    let refIndex = inputs.current["6A2"].getAttribute('ref-num');
                                    tempLabels[refIndex] = inputs.current["6A2"].getAttribute('text');
                                    tempValue[refIndex] = inputs.current["6A2"].value;
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                    depSetTempArr = new Set([...setGetDeps("", "6A", depSetTempArr)]);
                                }
                            }
                        }
                    }
                    
                    if (temp["RoomNameEn"]) {
                        setSavedProjectRoomLabel(temp["RoomNameEn"]);
                        
                        depSetTempArr = new Set([...setGetDeps("", "71", depSetTempArr)]);
                        setSelectedRoomLabel(temp["RoomNameEn"] ? [{
                            value: temp["RoomNameEn"],
                            label: rooms[pageLanguage].find(opt => opt.value === temp["RoomNameEn"]).label
                        }] : []);
                        tempSelect.label = rooms[pageLanguage].find(opt => opt.value === temp["RoomNameEn"]).label;
                        tempSelect.value = temp["RoomNameEn"];
                        setRoomLabelSelect(tempSelect);
                        if (temp["WindowName"] === undefined || (temp["WindowName"] && temp["WindowName"] === "")) {
                            tempLabels["7"] = tempSelect.label;
                        } else if (temp["WindowName"]) {
                            tempLabels["7"] = tempSelect.label + " - " + temp["WindowName"];
                        }
                        setStepSelectedLabel(tempLabels);
                    }
                    if (temp["WindowName"] && temp["WindowName"] !== "") {
                        setSavedProjectRoomText(temp["WindowName"]);
                        depSetTempArr = new Set([...setGetDeps("", "72", depSetTempArr)]);
                        setRoomLabelText(temp["WindowName"]);
                    }
                    
                    setDepSet(depSetTempArr);
                    setStepSelectedLabel(tempLabels);
                    setStepSelectedValue(tempValue);
                    
                }
            );
        });
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
    
    const qty = {
        "en": [
            {value: '0', label: '0'},
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
            {value: '0', label: '۰'},
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
    const [selectedMotorChannels, setSelectedMotorChannels] = useState([motorChannels[pageLanguage].find(opt => opt.value === '0')]);
    const [selectedMotorPosition, setSelectedMotorPosition] = useState([]);
    
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
            {value: 'Chenille', label: 'شنیلی'},
            {value: 'Embroidery', label: 'گلدوزی'},
            {value: 'Linen', label: 'کتانی'},
            {value: 'Print', label: 'چاپی'},
            {value: 'Silk', label: 'ابریشمی'},
            {value: 'Velvet', label: 'مخملی'}
        ],
        
    };
    
    const prices = {
        "en": [
            {value: 'standard', label: 'standard'},
            {value: 'premium', label: 'premium'},
            {value: 'Luxe', label: 'Luxe'}
        ],
        "fa": [
            {value: 'standard', label: 'معمولی'},
            {value: 'premium', label: 'اعلاء'},
            {value: 'Luxe', label: 'تجملی'}
        ],
        
    };
    
    const rooms = {
        "en": [
            {value: 'Family Room', label: 'Family Room'},
            {value: 'Den', label: 'Den'},
            {value: 'Living Room', label: 'Living Room'},
            {value: 'Dining Room', label: 'Dining Room'},
            {value: 'Kitchen', label: 'Kitchen'},
            {value: 'Pantry', label: 'Pantry'},
            {value: 'Breakfast Nook', label: 'Breakfast Nook'},
            {value: 'Main Bedroom', label: 'Main Bedroom'},
            {value: 'Bedroom', label: 'Bedroom'},
            {value: 'Closet', label: 'Closet'},
            {value: 'Main Bathroom', label: 'Main Bathroom'},
            {value: 'Bathroom', label: 'Bathroom'},
            {value: 'Office', label: 'Office'},
            {value: 'Basement', label: 'Basement'},
            {value: 'Entry', label: 'Entry'},
            {value: 'Mud Room', label: 'Mud Room'},
            {value: 'Hall', label: 'Hall'},
            {value: 'Media', label: 'Media'},
            {value: 'Laundry', label: 'Laundry'},
            {value: 'Nursery', label: 'Nursery'},
            {value: 'Study', label: 'Study'},
            {value: 'Garage', label: 'Garage'},
            {value: 'Attic', label: 'Attic'},
            {value: 'Powder Room', label: 'Powder Room'},
            {value: 'Guest Bedroom', label: 'Guest Bedroom'},
            {value: 'Sunroom', label: 'Sunroom'},
            {value: 'Playroom', label: 'Playroom'},
            {value: 'Gym', label: 'Gym'},
            {value: 'Pool House', label: 'Pool House'},
            {value: 'ADU', label: 'ADU'},
            {value: 'Stairway', label: 'Stairway'},
            {value: 'Other', label: 'Other'}
        ],
        "fa": [
            {value: 'Family Room', label: 'اتاق خانواده'},
            {value: 'Den', label: 'خلوتگاه'},
            {value: 'Living Room', label: 'اتاق نشیمن'},
            {value: 'Dining Room', label: 'غذاخوری'},
            {value: 'Kitchen', label: 'آشپزخانه'},
            {value: 'Pantry', label: 'آبدارخانه'},
            {value: 'Breakfast Nook', label: 'گوشه صبحانه'},
            {value: 'Main Bedroom', label: 'اتاق خواب اصلی'},
            {value: 'Bedroom', label: 'اتاق خواب'},
            {value: 'Closet', label: 'کمد لباس'},
            {value: 'Main Bathroom', label: 'سرویس بهداشتی اصلی'},
            {value: 'Bathroom', label: 'سرویس بهداشتی'},
            {value: 'Office', label: 'دفتر'},
            {value: 'Basement', label: 'زیر زمین'},
            {value: 'Entry', label: 'ورودی'},
            {value: 'Mud Room', label: 'اتاق گلی'},
            {value: 'Hall', label: 'هال'},
            {value: 'Media', label: 'رسانه'},
            {value: 'Laundry', label: 'خشکشویی'},
            {value: 'Nursery', label: 'مهد کودک'},
            {value: 'Study', label: 'کتابخانه'},
            {value: 'Garage', label: 'کاراژ'},
            {value: 'Attic', label: 'اتاق زیر شیروانی'},
            {value: 'Powder Room', label: 'توالت زنانه'},
            {value: 'Guest Bedroom', label: 'اتاق خواب مهمان'},
            {value: 'Sunroom', label: 'اتاق افتاب رو'},
            {value: 'Playroom', label: 'اتاق بازی'},
            {value: 'Gym', label: 'باشگاه'},
            {value: 'Pool House', label: 'استخر خانه'},
            {value: 'ADU', label: 'واحد مسکونی لوازم جانبی'},
            {value: 'Stairway', label: 'راه پله'},
            {value: 'Other', label: 'دیگر'}
        ],
        
    };
    
    useEffect(() => {
        if (fabricSelected.selectedFabricId && fabricSelected.selectedFabricId !== 0) {
            fabricClicked(fabricSelected.selectedPhoto, fabricSelected.selectedHasTrim);
            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
            tempLabels["1"] = location.pathname.split('').slice(1, 3).join('') === "fa" ? fabricSelected.selectedTextFa + "/" + fabricSelected.selectedColorFa : fabricSelected.selectedTextEn + "/" + fabricSelected.selectedColorEn;
            let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
            tempValue["1"] = fabricSelected.selectedFabricId;
            setStepSelectedLabel(tempLabels);
            setStepSelectedValue(tempValue);
            // setCart("FabricId", fabricSelected.selectedFabricId);
            setCart("FabricId", `${fabricSelected.selectedFabricId}`, "", "FabricDesignFa,FabricDesignEn,FabricColorEn,FabricColorFa,PhotoUrl", [fabricSelected.selectedTextFa, fabricSelected.selectedTextEn, fabricSelected.selectedColorEn, fabricSelected.selectedColorFa, fabricSelected.selectedPhoto]);
            // setCart("PhotoUrl", fabricSelected.selectedPhoto);
            setDeps("", "1");
            setStep1(fabricSelected.selectedFabricId.toString());
        }
    }, [fabricSelected]);
    
    useEffect(() => {
        renderFabrics();
    }, [step1]);
    // useEffect(() => {
    //     if (firstRender === false) {
    //         const tempLang = location.pathname.split('');
    //         pageLanguage = tempLang.slice(1, 3).join('');
    //         setShowLabels(false);
    //         Object.keys(inputs.current).forEach(refObj => {
    //             if (inputs.current[refObj] !== null) {
    //                 if (inputs.current[refObj].checked) {
    //                     inputs.current[refObj].click();
    //                 }
    //             }
    //         });
    //         setTimeout(() => {
    //             let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
    //             let tempObj = {};
    //             tempObj["3AOut"] = selectCustomValues.width3A[0];
    //             tempObj["3BOut"] = selectCustomValues.left[0];
    //             tempObj["3COut"] = selectCustomValues.height3C[0];
    //             tempObj["3DOut"] = selectCustomValues.shadeMount[0];
    //             tempObj["3AIn"] = selectCustomValues.width1[0];
    //             tempObj["3BIn"] = selectCustomValues.height1[0];
    //             tempObj["3"] = selectCustomValues.width[0];
    //
    //             Object.keys(tempObj).forEach(objKey => {
    //                 if (tempObj[objKey] !== undefined) {
    //                     if (objKey === "3AIn") {
    //                         let temp = JSON.parse(JSON.stringify(stepSelectedOptions));
    //                         if (temp.labels[objKey] === undefined)
    //                             temp.labels[objKey] = [];
    //                         if (temp.values[objKey] === undefined)
    //                             temp.values[objKey] = [];
    //                         let tempMin = temp.values[objKey][temp.values[objKey].indexOf(Math.min(...temp.values[objKey]))];
    //                         tempLabels[objKey] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMin}`) + "س\u200Cم" : tempMin + "cm";
    //                     } else if (objKey === "3BIn") {
    //                         let temp = JSON.parse(JSON.stringify(stepSelectedOptions));
    //                         if (temp.labels[objKey] === undefined)
    //                             temp.labels[objKey] = [];
    //                         if (temp.values[objKey] === undefined)
    //                             temp.values[objKey] = [];
    //                         let tempMax = temp.values[objKey][temp.values[objKey].indexOf(Math.max(...temp.values[objKey]))];
    //                         tempLabels[objKey] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMax}`) + "س\u200Cم" : tempMax + "cm";
    //
    //                     } else if (objKey === "3BOut") {
    //                         let temp = JSON.parse(JSON.stringify(leftRight));
    //
    //                         if (temp.right !== "" && temp.left !== "") {
    //                             tempLabels[objKey] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp.right}`) + "س\u200Cم"}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp.left}`) + "س\u200Cم"}` : `Left: ${temp.left + "cm"}\u00A0\u00A0\u00A0Right: ${temp.right + "cm"}`;
    //                         }
    //                     } else if (objKey === "3") {
    //                         let temp = JSON.parse(JSON.stringify(widthLength));
    //
    //                         if (temp.length !== "" && temp.width !== "") {
    //                             tempLabels[objKey] = pageLanguage === "fa" ? `ارتفاع:  ${NumberToPersianWord.convertEnToPe(`${temp.length}`) + "س\u200Cم"}\u00A0\u00A0\u00A0عرض: ${NumberToPersianWord.convertEnToPe(`${temp.width}`) + "س\u200Cم"}` : `Left: ${temp.width + "cm"}\u00A0\u00A0\u00A0Right: ${temp.length + "cm"}`;
    //                         }
    //                     } else {
    //                         tempLabels[objKey] = pageLanguage === "fa" ? `${NumberToPersianWord.convertEnToPe(`${tempObj[objKey].value}`) + "س\u200Cم"}` : `${tempObj[objKey].value + "cm"}`;
    //                     }
    //                 }
    //             });
    //
    //             setTimeout(() => {
    //                 setStepSelectedLabel(tempLabels);
    //             }, 100);
    //
    //
    //             // temp.width1 = [];
    //             // temp.width2 = [];
    //             // temp.width3 = [];
    //             // temp.height1 = [];
    //             // temp.height2 = [];
    //             // temp.left = [];
    //             // temp.right = [];
    //             // temp.width = [];
    //             // temp.length = [];
    //             // temp.width3A = [];
    //             // temp.height3C = [];
    //             // temp.shadeMount = [];
    //
    //             setTimeout(() => {
    //                 setShowLabels(true);
    //             }, 1000);
    //         }, 5000);
    //     } else {
    //         setFirstRender(false);
    //     }
    // }, [location.pathname]);
    
    useEffect(() => {
        if (projectModalState === 2 && isLoggedIn) {
            if (roomLabelText !== "" && selectedRoomLabel.length) {
                if (projectId && projectId !== "") {
                    SaveUserProject(depSet, cartValues, `${modelID}`, price, defaultModelName, defaultModelNameFa, projectData).then((temp) => {
                        if (temp) {
                            setProjectModalState(1);
                        } else {
                            console.log("project not saved!");
                        }
                    }).catch(() => {
                        setProjectModalState(2);
                    });
                } else {
                    SaveUserProject(depSet, cartValues, `${modelID}`, price, defaultModelName, defaultModelNameFa).then((temp) => {
                        if (temp) {
                            setProjectModalState(1);
                        } else {
                            console.log("project not saved!");
                        }
                    }).catch(() => {
                        setProjectModalState(2);
                    });
                }
            } else {
                setProjectModalState(0);
                modalHandleShow("add_to_project_modal");
            }
        }
    }, [isLoggedIn]);
    
    useEffect(() => {
        if (Object.keys(model).length !== 0) {
            // console.log(model);
            // model.forEach(obj => {
            //     if (obj.SewingModelId === modelID) {
            //         setDefaultFabricPhoto(obj.DefaultFabricPhotoUrl);
            //         setDefaultModelName(obj.ModelENName);
            //         setDefaultModelNameFa(obj.ModelName);
            //     }
            // });
            let tempObj = {};
            model["Accessories"].forEach(obj => {
                let tempObj2 = {};
                obj["SourceValue"].split(',').forEach(el => {
                    tempObj2[el] = {};
                    tempObj2[el]["price"] = obj["Products"][el];
                });
                tempObj[obj["SewingModelAccessoryId"]] = tempObj2;
            });
            setModelAccessories(tempObj);
            setDefaultFabricPhoto(model["DefaultFabricPhotoUrl"]);
            setCart("PhotoUrl",model["DefaultFabricPhotoUrl"]);
            setDefaultModelName(model["ModelENName"]);
            setDefaultModelNameFa(model["ModelName"]);
        }
    }, [model]);
    
    useEffect(() => {
        if (modelID !== '' && catID !== '') {
            // if(firstRender) {
            getCats();
            getModel();
            getFabrics();
            // setFirstRender(false);
            // }
        }
    }, [modelID, catID]);
    
    
    useEffect(() => {
        if (Object.keys(fabrics).length) {
            renderFabrics();
        }
    }, [fabrics, location.pathname]);
    
    useEffect(() => {
        // setModels([]);
        // setFabrics([]);
        // setFabricsList([]);
        if (pageLanguage !== '') {
            setSelectedMotorChannels([motorChannels[pageLanguage].find(opt => opt.value === '0')]);
            
        }
    }, [pageLanguage, location.pathname]);
    
    useEffect(() => {
        if (editIndex !== undefined) {
            if (localStorage.getItem("cart") !== null) {
                if (JSON.parse(localStorage.getItem("cart"))["drapery"] !== undefined) {
                    setProjectDetails(JSON.parse(localStorage.getItem("cart"))["drapery"][editIndex], editIndex);
                } else {
                    navigate("/" + pageLanguage + "/Curtain/" + catID + "/" + modelID);
                }
            } else {
                navigate("/" + pageLanguage + "/Curtain/" + catID + "/" + modelID);
            }
        } else if (projectId && projectId !== '') {
            getProjectDetail();
        }
    }, [location.pathname]);
    
    return (
        <div className={`Custom_model_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            {/*<div className="breadcrumb_container dir_ltr">*/}
            {/*    <Breadcrumb className="breadcrumb">*/}
            {/*        <Breadcrumb.Item linkAs={Link} className="breadcrumb_item" linkProps={{to: "/" + pageLanguage, className: "breadcrumb_item"}}>Home</Breadcrumb.Item>*/}
            {/*        <Breadcrumb.Item linkAs={Link} className="breadcrumb_item"*/}
            {/*                         linkProps={{*/}
            {/*                             to: "/" + pageLanguage + "/Curtain/" + catID,*/}
            {/*                             className: "breadcrumb_item breadcrumb_item_current"*/}
            {/*                         }}>{catID}</Breadcrumb.Item>*/}
            {/*        <Breadcrumb.Item linkAs={Link} className="breadcrumb_item"*/}
            {/*                         linkProps={{to: location, className: "breadcrumb_item breadcrumb_item_current"}}>{defaultModelName}</Breadcrumb.Item>*/}
            {/*    </Breadcrumb>*/}
            {/*</div>*/}
            
            
            <div className="models_title_div">
                <h1>{defaultModelName === undefined || defaultModelName === "" ? " " : pageLanguage === 'fa' ? defaultModelNameFa + " سفارشی " : "Custom " + defaultModelName}</h1>
            </div>
            <div className="model_customize_container">
                <div className="model_customize_image">
                    {defaultFabricPhoto &&
                    <img src={`https://api.atlaspood.ir/${defaultFabricPhoto}`} className="img-fluid" alt=""/>
                    }
                </div>
                <div className={`model_customize_section ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                    <Accordion ref={accordion} flush activeKey={accordionActiveKey}>
                        {/* step 1 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="1" stepNum={t("1")} stepTitle={t("zebra_step1")} stepRef="1" type="1" required={requiredStep["1"]}
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
                                                            <p>{t("filter_Color")}</p>
                                                            {/*<img className="select_control_handle_close img-fluid" src={require('../Images/public/arrow_down.svg').default} alt=""/>*/}
                                                            <div className="select_control_handle_close img-fluid"/>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu className="filter_color_items">
                                                            <div className="filter_items_container">
                                                                {colors[location.pathname.split('').slice(1, 3).join('')].map((obj, index) => (
                                                                    <Dropdown.Item as={Button} key={index}>
                                                                        <label className="dropdown_label">
                                                                            <input type="checkbox" value={obj.value}
                                                                                   ref={ref => (filterCheckboxes.current["colors"] = [...filterCheckboxes.current["colors"], ref])}/>
                                                                            {obj.label}
                                                                        </label>
                                                                    </Dropdown.Item>
                                                                ))}
                                                            </div>
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
                                                            <p>{t("filter_Pattern")}</p>
                                                            {/*<img className="select_control_handle_close img-fluid" src={require('../Images/public/arrow_down.svg').default} alt=""/>*/}
                                                            <div className="select_control_handle_close img-fluid"/>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <div className="filter_items_container">
                                                                {patterns[location.pathname.split('').slice(1, 3).join('')].map((obj, index) => (
                                                                    <Dropdown.Item as={Button} key={index}>
                                                                        <label className="dropdown_label">
                                                                            <input type="checkbox" value={obj.value}
                                                                                   ref={ref => (filterCheckboxes.current["patterns"] = [...filterCheckboxes.current["patterns"], ref])}/>
                                                                            {obj.label}
                                                                        </label>
                                                                    </Dropdown.Item>
                                                                ))}
                                                            </div>
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
                                                            <p>{t("filter_Type")}</p>
                                                            {/*<img className="select_control_handle_close img-fluid" src={require('../Images/public/arrow_down.svg').default} alt=""/>*/}
                                                            <div className="select_control_handle_close img-fluid"/>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <div className="filter_items_container">
                                                                {types[location.pathname.split('').slice(1, 3).join('')].map((obj, index) => (
                                                                    <Dropdown.Item as={Button} key={index}>
                                                                        <label className="dropdown_label">
                                                                            <input type="checkbox" value={obj.value}
                                                                                   ref={ref => (filterCheckboxes.current["types"] = [...filterCheckboxes.current["types"], ref])}/>
                                                                            {obj.label}
                                                                        </label>
                                                                    </Dropdown.Item>
                                                                ))}
                                                            </div>
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
                                                            <p>{t("filter_Price")}</p>
                                                            {/*<img className="select_control_handle_close img-fluid" src={require('../Images/public/arrow_down.svg').default} alt=""/>*/}
                                                            <div className="select_control_handle_close img-fluid"/>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <div className="filter_items_container">
                                                                <div className="price_filter_description">Pricing tiers determine the upholstery cost of our furniture prices. All swatch samples ship free no matter the tier.</div>
                                                                {prices[location.pathname.split('').slice(1, 3).join('')].map((obj, index) => (
                                                                    <Dropdown.Item as={Button} key={index}>
                                                                        <label className="dropdown_label">
                                                                            <input type="checkbox" value={obj.value}
                                                                                   ref={ref => (filterCheckboxes.current["prices"] = [...filterCheckboxes.current["prices"], ref])}/>
                                                                            {obj.label}
                                                                        </label>
                                                                    </Dropdown.Item>
                                                                ))}
                                                            </div>
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
                                                {zoomModalHeader}
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
                                <ContextAwareToggle eventKey="2" stepNum={t("2")} stepTitle={t("zebra_step2")} stepRef="2" type="1" required={requiredStep["2"]}
                                                    stepSelected={stepSelectedLabel["2"] === undefined ? "" : stepSelectedLabel["2"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/mount_inside.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("mount_Inside")} value="1" name="step2" ref-num="2" id="21" checked={step2 === "Inside"}
                                                   onChange={e => {
                                                       selectChanged(e, "3AOut,3BOut,3COut,3DOut");
                                                       setStep2("Inside");
                                                       if (stepSelectedValue["3"] === "2") {
                                                           setDeps("3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3", "2,3AOut,3BOut1,3BOut2,3COut,3DOut");
                                                           deleteSpecialSelects(2);
                                                           setCart("Mount", "Inside");
                                                       } else {
                                                           setDeps("", "2");
                                                           setCart("Mount", "Inside");
                                                       }
                                                
                                                   }} ref={ref => (inputs.current["21"] = ref)}/>
                                            <label htmlFor="21">{t("mount_Inside")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/mount_outside.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("mount_Outside")} value="2" name="step2" ref-num="2" id="22" checked={step2 === "Outside"}
                                                   onChange={e => {
                                                       selectChanged(e, "3AIn,3BIn");
                                                       setStep2("Outside");
                                                       if (stepSelectedValue["3"] === "2") {
                                                           setDeps("3AOut,3BOut1,3BOut2,3COut,3DOut", "2,3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3");
                                                           deleteSpecialSelects(1);
                                                           setCart("Mount", "Outside", "Width1,Width2,Width3,Height1,Height2,Height3");
                                                       } else {
                                                           setDeps("", "2");
                                                           setCart("Mount", "Outside", "Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount");
                                                       }
                                                   }} ref={ref => (inputs.current["22"] = ref)}/>
                                            <label htmlFor="22">{t("mount_Outside")}</label>
                                        </div>
                                        <NextStep eventKey="3">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column help_left_column_mount_type">
                                                <p className="help_column_header">{t("step2_help_1")}</p>
                                                <ul className="help_column_list">
                                                    <li>{t("step2_help_2")}</li>
                                                    <li>{t("step2_help_3")}</li>
                                                    <li>{t("step2_help_4")}</li>
                                                    <li>{t("step2_help_5")}</li>
                                                </ul>
                                            </div>
                                            <div className="help_column help_right_column help_right_column_mount_type">
                                                <p className="help_column_header">{t("step2_help_6")}</p>
                                                <ul className="help_column_list">
                                                    <li>{t("step2_help_7")}</li>
                                                    <li>{t("step2_help_8")}</li>
                                                    <li>{t("step2_help_9")}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="3" stepNum={t("3")} stepTitle={t("zebra_step3")} stepRef="3" type="2" required={requiredStep["3"]}
                                                    stepSelected={windowSizeBool ? windowSize : (stepSelectedLabel["3"] === undefined ? "" : stepSelectedLabel["3"])}
                                                    cartCustomText={t("zebra_step3_custom_cart_text")}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("I have my own measurements")} value="1" name="step3" ref-num="3" id="31"
                                                   checked={step3 === "false"}
                                                   onChange={e => {
                                                       setStep3("false");
                                                       selectChanged(e, "3AIn,3BIn,3AOut,3BOut,3COut,3DOut");
                                                       setMeasurementsNextStep("4");
                                                       setDeps("31,32", "3,3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3,3AOut,3BOut1,3BOut2,3COut,3DOut");
                                                       deleteSpecialSelects();
                                                       setCart("calcMeasurements", false, "WidthCart,HeightCart,Width1,Width2,Width3,Height1,Height2,Height3,Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount");
                                                   }} ref={ref => (inputs.current["31"] = ref)}/>
                                            <label htmlFor="31">{t("I have my own measurements.")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("Calculate my measurements")} value="2" name="step3" checked={step3 === "true"}
                                                   ref-num="3" id="32" ref={ref => (inputs.current["32"] = ref)}
                                                   onChange={e => {
                                                       if (stepSelectedValue["2"] === undefined) {
                                                           setStep3("");
                                                           selectUncheck(e);
                                                           modalHandleShow("noMount");
                                                           setDeps("3", "31,32");
                                                           setCart("calcMeasurements", true, "Width,height");
                                                       } else if (stepSelectedValue["2"] === "1") {
                                                           setStep3("true");
                                                           deleteSpecialSelects(3);
                                                           selectChanged(e);
                                                           setMeasurementsNextStep("3A");
                                                           setDeps("3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3", "3,3AOut,3BOut1,3BOut2,3COut,3DOut,31,32");
                                                           setCart("calcMeasurements", true, "Width,Height,Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount");
                                                       } else {
                                                           setStep3("true");
                                                           deleteSpecialSelects(3);
                                                           selectChanged(e);
                                                           setMeasurementsNextStep("3A");
                                                           setDeps("3AOut,3BOut1,3BOut2,3COut,3DOut", "3,3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3,31,32");
                                                           setCart("calcMeasurements", true, "Width,Height,Width1,Width2,Width3,Height1,Height2,Height3");
                                                       }
                                                   }}/>
                                            <label htmlFor="32">{t("Calculate my measurements.")}</label>
                                        
                                        </div>
                                        
                                        {stepSelectedValue["3"] === "1" &&
                                        <div className="own_measurements_container">
                                            <div className="own_measurements_width">
                                                <label className="select_label">{t("Width")}<p className="farsi_cm">{t("select_cm")}</p></label>
                                                <div className="select_container select_container_num">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        values={selectCustomValues.width}
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
                                                            ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm" postfixFa=""/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            optionSelectChanged_WidthLength(selected[0], "3", true, "cm", "س\u200Cم", pageLanguage);
                                                            let temp = selectCustomValues;
                                                            temp.width = selected;
                                                            setSelectCustomValues(temp);
                                                            setDeps("", "31");
                                                            setCart("Width", selected[0].value);
                                                        }}
                                                        options={SelectOptionRange(30, 300, 0.5, "cm", "", pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="own_measurements_Length">
                                                <label className="select_label">{t("Length_step3")}<p className="farsi_cm">{t("select_cm")}</p></label>
                                                <div className="select_container select_container_num">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        values={selectCustomValues.length}
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
                                                            ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm" postfixFa=""/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            optionSelectChanged_WidthLength(selected[0], "3", false, "cm", "س\u200Cم", pageLanguage);
                                                            let temp = selectCustomValues;
                                                            temp.length = selected;
                                                            setSelectCustomValues(temp);
                                                            setDeps("", "32");
                                                            setCart("Height", selected[0].value);
                                                        }}
                                                        options={SelectOptionRange(30, 400, 0.5, "cm", "", pageLanguage)}
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
                                <ContextAwareToggle eventKey="3A" stepNum={t("3A")} stepTitle={t("zebra_step3AInside")} stepRef="3AIn" type="2" required={requiredStep["3AIn"]}
                                                    stepSelected={stepSelectedLabel["3AIn"] === undefined ? "" : stepSelectedLabel["3AIn"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3A">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("step3A_title")}</p>
                                            <img
                                                src={pageLanguage === 'fa' ? require('../Images/drapery/roller/width_inside_3_fa.svg').default : require('../Images/drapery/roller/width_inside_3.svg').default}
                                                className="img-fluid" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="Three_select_container">
                                                <label className="select_label">{t("step3AIn_A")}<p className="farsi_cm">{t("select_cm")}</p></label>
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
                                                            ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm" postfixFa=""/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            if (selected[0] !== undefined) {
                                                                optionSelectChanged_three(selected[0], "3AIn", 0, true, "widthDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                let temp = selectCustomValues;
                                                                temp.width1 = selected;
                                                                setSelectCustomValues(temp);
                                                                setDeps("", "3AIn1");
                                                                setCart("Width1", selected[0].value);
                                                            }
                                                        }}
                                                        options={SelectOptionRange(30, 300, 0.5, "cm", "", pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <label className="select_label">{t("step3AIn_B")}<p className="farsi_cm">{t("select_cm")}</p></label>
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
                                                            ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm" postfixFa=""/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            if (selected[0] !== undefined) {
                                                                optionSelectChanged_three(selected[0], "3AIn", 1, true, "widthDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                let temp = selectCustomValues;
                                                                temp.width2 = selected;
                                                                setSelectCustomValues(temp);
                                                                setDeps("", "3AIn2");
                                                                setCart("Width2", selected[0].value);
                                                            }
                                                        }}
                                                        options={SelectOptionRange(30, 300, 0.5, "cm", "", pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <label className="select_label">{t("step3AIn_C")}<p className="farsi_cm">{t("select_cm")}</p></label>
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
                                                            ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm" postfixFa=""/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            if (selected[0] !== undefined) {
                                                                optionSelectChanged_three(selected[0], "3AIn", 2, true, "widthDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                let temp = selectCustomValues;
                                                                temp.width3 = selected;
                                                                setSelectCustomValues(temp);
                                                                setDeps("", "3AIn3");
                                                                setCart("Width3", selected[0].value);
                                                            }
                                                        }}
                                                        options={SelectOptionRange(30, 300, 0.5, "cm", "", pageLanguage)}
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
                                                    <li className="no_listStyle single_line_height">{t("step3A_help_1")}
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
                                <ContextAwareToggle eventKey="3B" stepNum={t("3B")} stepTitle={t("zebra_step3BInside")} stepRef="3BIn" type="2" required={requiredStep["3BIn"]}
                                                    stepSelected={stepSelectedLabel["3BIn"] === undefined ? "" : stepSelectedLabel["3BIn"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3B">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("step3B_title")}</p>
                                            <img
                                                src={pageLanguage === 'fa' ? require('../Images/drapery/roller/height_inside_3_fa.svg').default : require('../Images/drapery/roller/height_inside_3.svg').default}
                                                className="img-fluid" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="Three_select_container">
                                                <label className="select_label">{t("step3BIn_A")}<p className="farsi_cm">{t("select_cm")}</p></label>
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
                                                            ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm" postfixFa=""/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            if (selected.length) {
                                                                optionSelectChanged_three(selected[0], "3BIn", 0, false, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                let temp = selectCustomValues;
                                                                temp.height1 = selected;
                                                                setSelectCustomValues(temp);
                                                                setDeps("", "3BIn1");
                                                                setCart("Height1", selected[0].value);
                                                            }
                                                        }}
                                                        options={SelectOptionRange(30, 400, 0.5, "cm", "", pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <label className="select_label">{t("step3BIn_B")}<p className="farsi_cm">{t("select_cm")}</p></label>
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
                                                            ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm" postfixFa=""/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            if (selected.length) {
                                                                optionSelectChanged_three(selected[0], "3BIn", 1, false, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                let temp = selectCustomValues;
                                                                temp.height2 = selected;
                                                                setSelectCustomValues(temp);
                                                                setDeps("", "3BIn2");
                                                                setCart("Height2", selected[0].value);
                                                            }
                                                        }}
                                                        options={SelectOptionRange(30, 400, 0.5, "cm", "", pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <label className="select_label">{t("step3BIn_C")}<p className="farsi_cm">{t("select_cm")}</p></label>
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
                                                            ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm" postfixFa=""/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            if (selected[0] !== undefined) {
                                                                optionSelectChanged_three(selected[0], "3BIn", 2, false, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                let temp = selectCustomValues;
                                                                temp.height3 = selected;
                                                                setSelectCustomValues(temp);
                                                                setDeps("", "3BIn3");
                                                                setCart("Height3", selected[0].value);
                                                            }
                                                        }}
                                                        options={SelectOptionRange(30, 400, 0.5, "cm", "", pageLanguage)}
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
                                                    <li className="no_listStyle single_line_height">{t("step3B_help_1")}
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
                                <ContextAwareToggle eventKey="3A" stepNum={t("3A")} stepTitle={t("zebra_step3AOutside")} stepRef="3AOut" type="2" required={requiredStep["3AOut"]}
                                                    stepSelected={stepSelectedLabel["3AOut"] === undefined ? "" : stepSelectedLabel["3AOut"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3A">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("step3A_out_title")}</p>
                                            <img src={require('../Images/drapery/roller/FrameSize.svg').default} className="img-fluid" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                <label className="select_label">{t("Width")}<p className="farsi_cm">{t("select_cm")}</p></label>
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
                                                        values={selectCustomValues.width3A}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm" postfixFa=""/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            if (selected[0] !== undefined) {
                                                                optionSelectChanged("3AOut", selected[0], "cm", "س\u200Cم", pageLanguage);
                                                                let temp = selectCustomValues;
                                                                temp.width3A = selected;
                                                                setSelectCustomValues(temp);
                                                                setDeps("", "3AOut");
                                                                setCart("Width3A", selected[0].value);
                                                            }
                                                        }}
                                                        options={SelectOptionRange(30, 290, 0.5, "cm", "", pageLanguage)}
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
                                <ContextAwareToggle eventKey="3B" stepNum={t("3B")} stepTitle={t("zebra_step3BOutside")} stepRef="3BOut" type="2" required={requiredStep["3BOut"]}
                                                    stepSelected={stepSelectedLabel["3BOut"] === undefined ? "" : stepSelectedLabel["3BOut"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3B">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("step3B_out_title")}</p>
                                            <img src={require('../Images/drapery/roller/wall_cover.svg').default} className="img-fluid" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container dir_ltr">
                                            <div className="box50">
                                                <label className="select_label"><p className="farsi_cm">{t("select_cm")}</p>{t("Left")}</label>
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
                                                        values={selectCustomValues.left}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm" postfixFa=""/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            if (selected[0] !== undefined) {
                                                                optionSelectChanged_LeftRight(selected[0], "3BOut", true, "cm", "س\u200Cم", pageLanguage);
                                                                let temp = selectCustomValues;
                                                                temp.left = selected;
                                                                setSelectCustomValues(temp);
                                                                setDeps("", "3BOut1");
                                                                setCart("ExtensionLeft", selected[0].value);
                                                            }
                                                        }}
                                                        options={SelectOptionRange(1, 10, 1, "cm", "", pageLanguage)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="box50">
                                                <label className="select_label"><p className="farsi_cm">{t("select_cm")}</p>{t("Right")}</label>
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
                                                        values={selectCustomValues.right}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm" postfixFa=""/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            if (selected[0] !== undefined) {
                                                                optionSelectChanged_LeftRight(selected[0], "3BOut", false, "cm", "س\u200Cم", pageLanguage);
                                                                let temp = selectCustomValues;
                                                                temp.right = selected;
                                                                setSelectCustomValues(temp);
                                                                setDeps("", "3BOut2");
                                                                setCart("ExtensionRight", selected[0].value);
                                                            }
                                                        }}
                                                        options={SelectOptionRange(1, 10, 1, "cm", "", pageLanguage)}
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
                                                    <li className="no_listStyle single_line_height">{t("step3B_out_help_1")}
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
                                <ContextAwareToggle eventKey="3C" stepNum={t("3C")} stepTitle={t("zebra_step3COutside")} stepRef="3COut" type="2" required={requiredStep["3COut"]}
                                                    stepSelected={stepSelectedLabel["3COut"] === undefined ? "" : stepSelectedLabel["3COut"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3C">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("step3C_out_title")}</p>
                                            <img src={require('../Images/drapery/roller/frame_height.svg').default} className="img-fluid" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                <label className="select_label">{t("Height")}<p className="farsi_cm">{t("select_cm")}</p></label>
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
                                                        values={selectCustomValues.height3C}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm" postfixFa=""/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            if (selected[0] !== undefined) {
                                                                optionSelectChanged("3COut", selected[0], "cm", "س\u200Cم", pageLanguage);
                                                                let temp = selectCustomValues;
                                                                temp.height3C = selected;
                                                                setSelectCustomValues(temp);
                                                                setDeps("", "3COut");
                                                                setCart("Height3C", selected[0].value);
                                                            }
                                                        }}
                                                        options={SelectOptionRange(30, 400, 0.5, "cm", "", pageLanguage)}
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
                                <ContextAwareToggle eventKey="3D" stepNum={t("3D")} stepTitle={t("zebra_step3DOutside")} stepRef="3DOut" type="2" required={requiredStep["3DOut"]}
                                                    stepSelected={stepSelectedLabel["3DOut"] === undefined ? "" : stepSelectedLabel["3DOut"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3D">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("step3D_out_title")}</p>
                                            <img src={require('../Images/drapery/roller/shade_mount.svg').default} className="img-fluid" alt=""/>
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
                                                        values={selectCustomValues.shadeMount}
                                                        dropdownRenderer={
                                                            ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm" postfixFa=""/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            if (selected[0] !== undefined) {
                                                                optionSelectChanged("3DOut", selected[0], "cm", "س\u200Cم", pageLanguage);
                                                                let temp = selectCustomValues;
                                                                temp.shadeMount = selected;
                                                                setSelectCustomValues(temp);
                                                                setDeps("", "3DOut");
                                                                setCart("ShadeMount", selected[0].value);
                                                            }
                                                        }}
                                                        options={SelectOptionRange(0, 100, 1, "cm", "", pageLanguage)}
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
                                                    <li className="no_listStyle single_line_height">{t("step3D_out_help_1")}
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
                                <ContextAwareToggle eventKey="4" stepNum={t("4")} stepTitle={t("zebra_step4")} stepRef="4" type="1" required={requiredStep["4"]}
                                                    stepSelected={stepSelectedLabel["4"] === undefined ? "" : stepSelectedLabel["4"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="4">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("Continuous") + " " + t("Loop")} value="1" name="step4" ref-num="4" id="41"
                                                   checked={step4 === "Continuous Loop"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep4("Continuous Loop");
                                                       setControlTypeNextStep("4A");
                                                       setDeps("4A,4B", "4,41,411");
                                                       setCart("ControlType", "Continuous Loop", "hasPower,MotorPosition,RemoteName,MotorChannels");
                                                   }} ref={ref => (inputs.current["41"] = ref)}/>
                                            <label htmlFor="41">{t("Continuous")}<br/><p>{t("Loop")}</p></label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("Motorized")} value="2" name="step4" checked={step4 === "Motorized"}
                                                   ref-num="4" id="42"
                                                   onChange={e => {
                                                       selectChanged(e, "41", "4A,4B");
                                                       setStep4("Motorized");
                                                       setControlTypeNextStep("5");
                                                       setDeps("41", "4,4A,4B");
                                                       setCart("ControlType", "Motorized", "ControlPosition,ChainLength");
                                                   }} ref={ref => (inputs.current["42"] = ref)}/>
                                            <label htmlFor="42">{t("Motorized")}<br/><p
                                                className="surcharge_price">{Object.keys(modelAccessories).length !== 0 ? t("Add "): t("Surcharge Applies")}{(modelAccessories["1"] ? (modelAccessories["1"]["61500508"] ? GetPrice(modelAccessories["1"]["61500508"]["price"], pageLanguage, t("TOMANS")) : null) : null)}</p>
                                            </label>
                                        
                                        </div>
                                        {stepSelectedValue["4"] === "2" &&
                                        <div className="secondary_options same_row_selection">
                                            <hr/>
                                            <p className="no_power_title">{t("Motor_title")}</p>
                                            <div className="card-body-display-flex">
                                                <div className="box50 radio_style">
                                                    <input className="radio" type="radio" text={t("Yes")} value="1" name="step41" ref-num="41" id="411" checked={step41 === "true"}
                                                           onChange={e => {
                                                               selectChanged(e);
                                                               setStep41("true");
                                                               setDeps("411", "41");
                                                               setCart("hasPower", true, "", "MotorChannels", [selectedMotorChannels.map(obj => obj.value)]);
                                                           }} ref={ref => (inputs.current["411"] = ref)}/>
                                                    <label htmlFor="411">{t("Yes")}</label>
                                                </div>
                                                <div className="box50 radio_style">
                                                    <input className="radio" type="radio" text={t("No")} value="2" name="step41" ref-num="41" id="412"
                                                           onClick={e => {
                                                               selectUncheck(e);
                                                               setStep41("");
                                                               modalHandleShow("noPower");
                                                               setDeps("41", "411");
                                                           }} ref={ref => (inputs.current["412"] = ref)}/>
                                                    <label htmlFor="412">{t("No")}</label>
                                                </div>
                                            </div>
                                        </div>
                                        }
                                        {stepSelectedValue["41"] === "1" && stepSelectedValue["4"] === "2" &&
                                        <div className="motorized_options same_row_selection">
                                            <div className="motorized_option_left">
                                                <p>{t("Motor Position")}</p>
                                                &nbsp;
                                                <span onClick={() => modalHandleShow("learnMore")}>{t("(Learn More)")}</span>
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
                                                        values={selectedMotorPosition}
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
                                                            ({props, state, methods}) => <CustomDropdown props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            setDeps("", "411");
                                                            setCart("MotorPosition", selected[0].value);
                                                            if (selected[0]) {
                                                                setSelectedMotorPosition(selected);
                                                            }
                                                        }}
                                                        options={MotorPosition[pageLanguage]}
                                                    />
                                                </div>
                                            </div>
                                            <div className="motorized_option_left">
                                                <p>{t("Remote Name")}</p>
                                                &nbsp;
                                                <span onClick={() => modalHandleShow("learnMore")}>{t("(Learn More)")}</span>
                                            </div>
                                            <div className="motorized_option_right">
                                                <input className="Remote_name" type="text" name="Remote_name" value={remoteName}
                                                       placeholder={t("Enter a name for your remote")} onChange={(e) => {
                                                    setCart("RemoteName", e.target.value);
                                                    setRemoteName(e.target.value);
                                                }}/>
                                            </div>
                                            <div className="motorized_option_left">
                                                <p>{t("Channel(s)")}</p>
                                                &nbsp;
                                                <span onClick={() => modalHandleShow("learnMore")}>{t("(Learn More)")}</span>
                                            </div>
                                            <div className="motorized_option_right">
                                                <div className="select_container multi_select_container">
                                                    <Select
                                                        className="select select_motor_channels"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        multi={true}
                                                        values={selectedMotorChannels}
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
                                                            ({props, state, methods}) => <CustomDropdownMulti props={props} state={state} methods={methods}/>
                                                        }
                                                        contentRenderer={
                                                            ({props, state, methods}) => <CustomControlMulti props={props} state={state} methods={methods}/>
                                                        }
                                                        // optionRenderer={
                                                        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                        // }
                                                        onChange={(selected) => {
                                                            // setDeps("", "412");
                                                            setCart("MotorChannels", selected.map(obj => obj.value));
                                                            setSelectedMotorChannels(selected);
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
                                                <p className="help_column_header">{t("step4_help_1")}</p>
                                                <ul className="help_column_list">
                                                    <li>{t("step4_help_2")}</li>
                                                    <li>{t("step4_help_3")}</li>
                                                </ul>
                                            </div>
                                            <div className="help_column help_right_column">
                                                <p className="help_column_header">{t("step4_help_4")}</p>
                                                <ul className="help_column_list">
                                                    <li>{t("step4_help_5")}</li>
                                                    <li>{t("step4_help_6")}</li>
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
                                <ContextAwareToggle eventKey="4A" stepNum={t("4A")} stepTitle={t("zebra_step4A")} stepRef="4A" type="1" required={requiredStep["4A"]}
                                                    stepSelected={stepSelectedLabel["4A"] === undefined ? "" : stepSelectedLabel["4A"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="4A">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/position_left.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("Left")} value="1" name="step4A" ref-num="4A" id="4A1" checked={step4A === "Left"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep4A("Left");
                                                       setDeps("", "4A");
                                                       setCart("ControlPosition", "Left");
                                                   }} ref={ref => (inputs.current["4A1"] = ref)}/>
                                            <label htmlFor="4A1">{t("Left")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/position_right.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("Right")} value="2" name="step4A"
                                                   ref-num="4A" id="4A2" checked={step4A === "Right"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep4A("Right");
                                                       setDeps("", "4A");
                                                       setCart("ControlPosition", "Right");
                                                   }} ref={ref => (inputs.current["4A2"] = ref)}/>
                                            <label htmlFor="4A2">{t("Right")}</label>
                                        </div>
                                        <NextStep eventKey="4B">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">{t("step4A_help_1")}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        }
                        
                        {/* step 4B */}
                        {stepSelectedValue["4"] === "1" &&
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="4B" stepNum={t("4B")} stepTitle={t("zebra_step4B")} stepRef="4B" type="1" required={requiredStep["4B"]}
                                                    stepSelected={stepSelectedLabel["4B"] === undefined ? "" : stepSelectedLabel["4B"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="4B">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box33 radio_style">
                                            <input className="radio" type="radio" text={t("150cm")} value="1" name="step4B" ref-num="4B" id="4B1" checked={step4B === "150"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep4B("150");
                                                       setDeps("", "4B");
                                                       setCart("ChainLength", "150");
                                                   }} ref={ref => (inputs.current["4B1"] = ref)}/>
                                            <label htmlFor="4B1">{t("150cm")}<br/><p className="no_surcharge_price">{t("(No extra charge)")}</p></label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <input className="radio" type="radio" text={t("300cm")} value="2" name="step4B"
                                                   ref-num="4B" id="4B2" checked={step4B === "300"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep4B("300");
                                                       setDeps("", "4B");
                                                       setCart("ChainLength", "300");
                                                   }} ref={ref => (inputs.current["4B2"] = ref)}/>
                                            <label htmlFor="4B2">{t("300cm")}<br/><p
                                                className="surcharge_price">{Object.keys(modelAccessories).length !== 0 ? t("Add "): t("Surcharge Applies")}{(modelAccessories["3"] ? (modelAccessories["3"]["90908901"] ? GetPrice(modelAccessories["3"]["90908901"]["price"], pageLanguage, t("TOMANS")) : null) : null)}</p>
                                            </label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <input className="radio" type="radio" text={t("500cm")} value="3" name="step4B"
                                                   ref-num="4B" id="4B3" checked={step4B === "500"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep4B("500");
                                                       setDeps("", "4B");
                                                       setCart("ChainLength", "500");
                                                   }} ref={ref => (inputs.current["4B3"] = ref)}/>
                                            <label htmlFor="4B3">{t("500cm")}<br/><p
                                                className="surcharge_price">{Object.keys(modelAccessories).length !== 0 ? t("Add "): t("Surcharge Applies")}{(modelAccessories["3"] ? (modelAccessories["3"]["90908902"] ? GetPrice(modelAccessories["3"]["90908902"]["price"], pageLanguage, t("TOMANS")) : null) : null)}</p>
                                            </label>
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
                                <ContextAwareToggle eventKey="5" stepNum={t("5")} stepTitle={t("roller_step5")} stepRef="5" type="1" required={requiredStep["5"]}
                                                    stepSelected={stepSelectedLabel["5"] === undefined ? "" : stepSelectedLabel["5"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="5">
                                <Card.Body>
                                    <div className="card_body card_body_radio card_body_4">
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/roll_regular.svg').default} className="img-fluid half_margin" alt=""/>
                                            <input className="radio" type="radio" text={t("roller_headrail1")} value="1" name="step5" ref-num="5" id="51"
                                                   checked={step5 === "Exposed"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep5("Exposed");
                                                       setDeps("", "5,53,54");
                                                       setCart("Headrail", "Exposed");
                                                       setHeadrailsNextStep("5A");
                                                   }} ref={ref => (inputs.current["51"] = ref)}/>
                                            <label htmlFor="51">{t("roller_headrail1")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/roll_upholstered_valance.svg').default} className="img-fluid half_margin" alt=""/>
                                            <input className="radio" type="radio" text={t("roller_headrail2")} value="2" name="step5" ref-num="5" id="52"
                                                   checked={step5 === "Upholstered"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep5("Upholstered");
                                                       setDeps("", "5,53,54");
                                                       setCart("Headrail", "Upholstered");
                                                       setHeadrailsNextStep("6");
                                                   }} ref={ref => (inputs.current["52"] = ref)}/>
                                            <label htmlFor="52">{t("roller_headrail2")}<br/><p
                                                className="surcharge_price">{Object.keys(modelAccessories).length !== 0 ? t("Add "): t("Surcharge Applies")}{(modelAccessories["1"] ? (modelAccessories["1"]["61500508"] ? GetPrice(modelAccessories["1"]["61500508"]["price"], pageLanguage, t("TOMANS")) : null) : null)}</p>
                                            </label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/roll_metal_valance.svg').default} className="img-fluid half_margin" alt=""/>
                                            <input className="radio" type="radio" text={t("roller_headrail3")} value="3" name="step5" ref-num="5" id="53"
                                                   checked={step5 === "MetalValance"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep5("MetalValance");
                                                       setDeps("53", "5,54");
                                                       setCart("Headrail", "MetalValance");
                                                       setHeadrailsNextStep("6");
                                                   }} ref={ref => (inputs.current["53"] = ref)}/>
                                            <label htmlFor="53">{t("roller_headrail3")}<br/><p
                                                className="surcharge_price">{Object.keys(modelAccessories).length !== 0 ? t("Add "): t("Surcharge Applies")}{(modelAccessories["1"] ? (modelAccessories["1"]["61500508"] ? GetPrice(modelAccessories["1"]["61500508"]["price"], pageLanguage, t("TOMANS")) : null) : null)}</p>
                                            </label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/roll_fabric_insert.svg').default} className="img-fluid half_margin" alt=""/>
                                            <input className="radio" type="radio" text={t("roller_headrail4")} value="4" name="step5" ref-num="5" id="54"
                                                   checked={step5 === "MetalValanceFabricInsert"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep5("MetalValanceFabricInsert");
                                                       setDeps("54", "5,53");
                                                       setCart("Headrail", "MetalValanceFabricInsert");
                                                       setHeadrailsNextStep("6");
                                                   }} ref={ref => (inputs.current["54"] = ref)}/>
                                            <label htmlFor="54">{t("roller_headrail4")}<br/><p
                                                className="surcharge_price">{Object.keys(modelAccessories).length !== 0 ? t("Add "): t("Surcharge Applies")}{(modelAccessories["1"] ? (modelAccessories["1"]["61500508"] ? GetPrice(modelAccessories["1"]["61500508"]["price"], pageLanguage, t("TOMANS")) : null) : null)}</p>
                                            </label>
                                        </div>
                                        {(stepSelectedValue["5"] === "3" || stepSelectedValue["5"] === "4") &&
                                        <div className="selection_section">
                                            <div className="select_container">
                                                {stepSelectedValue["5"] === "3" &&
                                                <Select
                                                    className="select"
                                                    placeholder={t("Please Select")}
                                                    portal={document.body}
                                                    dropdownPosition="bottom"
                                                    dropdownHandle={false}
                                                    dropdownGap={0}
                                                    values={selectedValanceColor1}
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
                                                        ({props, state, methods}) => <CustomDropdown props={props} state={state} methods={methods}/>
                                                    }
                                                    contentRenderer={
                                                        ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                    }
                                                    // optionRenderer={
                                                    //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                    // }
                                                    onChange={(selected) => {
                                                        if (selected.length) {
                                                            setDeps("", "53");
                                                            setCart("MetalValanceColor", selected[0].value);
                                                            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                                                            tempLabels["5"] = t("roller_headrail3") + "/" + selected[0].label;
                                                            setStepSelectedLabel(tempLabels);
                                                        }
                                                    }}
                                                    options={optionsMetalValance[pageLanguage]}
                                                />
                                                }
                                            </div>
                                            <div className="select_container">
                                                {stepSelectedValue["5"] === "4" &&
                                                <Select
                                                    className="select"
                                                    placeholder={t("Please Select")}
                                                    portal={document.body}
                                                    dropdownPosition="bottom"
                                                    dropdownHandle={false}
                                                    dropdownGap={0}
                                                    values={selectedValanceColor2}
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
                                                        ({props, state, methods}) => <CustomDropdown props={props} state={state} methods={methods}/>
                                                    }
                                                    contentRenderer={
                                                        ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                    }
                                                    // optionRenderer={
                                                    //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                    // }
                                                    onChange={(selected) => {
                                                        if (selected.length) {
                                                            setDeps("", "54");
                                                            setCart("MetalValanceColor", selected[0].value);
                                                            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                                                            tempLabels["5"] = t("roller_headrail4") + "/" + selected[0].label;
                                                            setStepSelectedLabel(tempLabels);
                                                        }
                                                    }}
                                                    options={optionsMetalValanceFabricInsert[pageLanguage]}
                                                />
                                                }
                                            </div>
                                        </div>
                                        }
                                        <NextStep eventKey={headrailsNextStep}>{t("NEXT STEP")}</NextStep>
                                    </div>
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">
                                                        <div className="measurementsHelp_link text-center" onClick={e => modalHandleShow("headrailHelp")}>
                                                            {t("headrailHelp")}
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 5A */}
                        {stepSelectedValue["5"] === "1" &&
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="5A" stepNum={t("5A")} stepTitle={t("roller_step5A")} stepRef="5A" type="1" required={requiredStep["5A"]}
                                                    stepSelected={stepSelectedLabel["5A"] === undefined ? "" : stepSelectedLabel["5A"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="5A">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/roll_regular.svg').default} className="img-fluid half_margin" alt=""/>
                                            <input className="radio" type="radio" text={t("RollType1")} value="1" name="step5A" ref-num="5A" id="5A1" checked={step5A === "Regular"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep5A("Regular");
                                                       setDeps("", "5A");
                                                       setCart("RollType", "Regular");
                                                   }} ref={ref => (inputs.current["5A1"] = ref)}/>
                                            <label htmlFor="5A1">{t("RollType1")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/roll_reverse.svg').default} className="img-fluid half_margin" alt=""/>
                                            <input className="radio" type="radio" text={t("RollType2")} value="2" name="step5A" ref-num="5A" id="5A2" checked={step5A === "Reverse"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep5A("Reverse");
                                                       setDeps("", "5A");
                                                       setCart("RollType", "Reverse");
                                                   }} ref={ref => (inputs.current["5A2"] = ref)}/>
                                            <label htmlFor="5A2">{t("RollType2")}</label>
                                        </div>
                                        <NextStep eventKey="5B">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column help_left_column_mount_type">
                                                <p className="help_column_header">{t("RollType_help_1")}</p>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle">
                                                        <span className="popover_indicator">
                                                            {<PopoverStickOnHover placement={`${pageLanguage === 'fa' ? "right" : "left"}`}
                                                                                  children={<object className="popover_camera" type="image/svg+xml"
                                                                                                    data={require('../Images/public/camera.svg').default}/>}
                                                                                  component={
                                                                                      <div className="clearfix">
                                                                                          <div className="popover_image clearfix">
                                                                                              <img
                                                                                                  src={popoverImages["step51"] === undefined ? require('../Images/drapery/roller/RegularRoll1a.jpg') : popoverImages["step51"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">{t("RollType_help_7")}</span>
                                                                                              <span className="popover_thumbnails">
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/roller/RegularRoll1a.jpg')}
                                                                                                           text="step51"
                                                                                                           onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                           className="popover_thumbnail_img img-fluid"
                                                                                                           alt=""/>
                                                                                                  </div>
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/roller/RegularRoll2.jpg')}
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
                                                        </span>{t("RollType_help_2")}</li>
                                                    <li>{t("RollType_help_3")}</li>
                                                </ul>
                                            </div>
                                            <div className="help_column help_right_column help_right_column_mount_type">
                                                <p className="help_column_header">{t("RollType_help_4")}</p>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle">
                                                        <span className="popover_indicator">
                                                            {<PopoverStickOnHover placement={`${pageLanguage === 'fa' ? "right" : "left"}`}
                                                                                  children={<object className="popover_camera" type="image/svg+xml"
                                                                                                    data={require('../Images/public/camera.svg').default}/>}
                                                                                  component={
                                                                                      <div className="clearfix">
                                                                                          <div className="popover_image clearfix">
                                                                                              <img
                                                                                                  src={popoverImages["step51"] === undefined ? require('../Images/drapery/roller/ReverseRoll1a.jpg') : popoverImages["step51"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">{t("RollType_help_8")}</span>
                                                                                              <span className="popover_thumbnails">
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/roller/ReverseRoll1a.jpg')}
                                                                                                           text="step51"
                                                                                                           onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                           className="popover_thumbnail_img img-fluid"
                                                                                                           alt=""/>
                                                                                                  </div>
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/roller/ReverseRoll2.jpg')}
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
                                                        </span>{t("RollType_help_5")}</li>
                                                    <li>{t("RollType_help_6")}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        }
                        
                        {/* step 5B */}
                        {stepSelectedValue["5"] === "1" &&
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="5B" stepNum={t("5B")} stepTitle={t("roller_step5B")} stepRef="5B" type="1" required={requiredStep["5B"]}
                                                    stepSelected={stepSelectedLabel["5B"] === undefined ? "" : stepSelectedLabel["5B"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="5B">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/bracket_type_round.png')} className="img-fluid half_margin" alt=""/>
                                            <input className="radio" type="radio" text={t("BracketType1")} value="1" name="step5B" ref-num="5B" id="5B1"
                                                   checked={step5B === "Round Edge"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep5B("Round Edge");
                                                       setDeps("", "5B");
                                                       setCart("BracketType", "Round Edge");
                                                   }} ref={ref => (inputs.current["5B1"] = ref)}/>
                                            <label htmlFor="5B1">{t("BracketType1")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/bracket_type_square.png')} className="img-fluid half_margin" alt=""/>
                                            <input className="radio" type="radio" text={t("BracketType2")} value="2" name="step5B" ref-num="5B" id="5B2"
                                                   checked={step5B === "Square Edge"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep5B("Square Edge");
                                                       setDeps("", "5B");
                                                       setCart("BracketType", "Square Edge");
                                                   }} ref={ref => (inputs.current["5B2"] = ref)}/>
                                            <label htmlFor="5B2">{t("BracketType2")}</label>
                                        </div>
                                        <NextStep eventKey="5C">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        }
                        
                        {/* step 5C */}
                        {stepSelectedValue["5"] === "1" &&
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="5C" stepNum={t("5C")} stepTitle={t("roller_step5C")} stepRef="5C" type="1" required={requiredStep["5C"]}
                                                    stepSelected={stepSelectedLabel["5C"] === undefined ? "" : stepSelectedLabel["5C"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="5C">
                                <Card.Body>
                                    <div className="card_body card_body_radio bracket_color">
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/roller/SatinBrass.jpg')} className="img-fluid bracket_color_img" alt=""/>
                                            <input className="radio" type="radio" text={t("BracketColor1")} value="1" name="step5C" ref-num="5C" id="5C1"
                                                   checked={step5C === "Satin Brass"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep5C("Satin Brass");
                                                       setDeps("", "5C");
                                                       setCart("BracketColor", "Satin Brass");
                                                   }} ref={ref => (inputs.current["5C1"] = ref)}/>
                                            <label htmlFor="5C1">{t("BracketColor1")}</label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/roller/SatinNickel.jpg')} className="img-fluid bracket_color_img" alt=""/>
                                            <input className="radio" type="radio" text={t("BracketColor2")} value="2" name="step5C" ref-num="5C" id="5C2"
                                                   checked={step5C === "Satin Nickel"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep5C("Satin Nickel");
                                                       setDeps("", "5C");
                                                       setCart("BracketColor", "Satin Nickel");
                                                   }} ref={ref => (inputs.current["5C2"] = ref)}/>
                                            <label htmlFor="5C2">{t("BracketColor2")}</label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/roller/GunMetal.jpg')} className="img-fluid bracket_color_img" alt=""/>
                                            <input className="radio" type="radio" text={t("BracketColor3")} value="3" name="step5C" ref-num="5C" id="5C3"
                                                   checked={step5C === "Gun Metal"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep5C("Gun Metal");
                                                       setDeps("", "5C");
                                                       setCart("BracketColor", "Gun Metal");
                                                   }} ref={ref => (inputs.current["5C2"] = ref)}/>
                                            <label htmlFor="5C3">{t("BracketColor3")}</label>
                                        </div>
                                        <NextStep eventKey="6">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle text-center">
                                                        
                                                        <span className="popover_indicator">
                                                            {<PopoverStickOnHover placement={`${pageLanguage === 'fa' ? "right" : "left"}`}
                                                                                  children={<object className="popover_camera" type="image/svg+xml"
                                                                                                    data={require('../Images/public/camera.svg').default}/>}
                                                                                  component={
                                                                                      <div className="clearfix">
                                                                                          <div className="popover_image clearfix">
                                                                                              <img
                                                                                                  src={popoverImages["step51"] === undefined ? require('../Images/drapery/roller/bracket_type_round.png') : popoverImages["step51"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">{t("BottomBarStyle_help_5")}</span>
                                                                                              <span className="popover_thumbnails">
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/roller/bracket_type_round.png')}
                                                                                                           text="step51"
                                                                                                           onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                           className="popover_thumbnail_img img-fluid"
                                                                                                           alt=""/>
                                                                                                  </div>
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/roller/bracket_type_square.png')}
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
                                                        </span>{t("bracketColor_help")}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        }
                        
                        {/* step 6 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="6" stepNum={t("6")} stepTitle={t("roller_step6")} stepRef="6" type="1" required={requiredStep["6"]}
                                                    stepSelected={stepSelectedLabel["6"] === undefined ? "" : stepSelectedLabel["6"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="6">
                                <Card.Body>
                                    <div className="card_body card_body_radio card_body_4">
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/Standard.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("roller_HemStyle1")} value="1" name="step6" ref-num="6" id="61"
                                                   checked={step6 === "Standard"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep6("Standard");
                                                       setDeps("", "6");
                                                       setCart("HemStyle", "Standard");
                                                       setHemStyleNextStep("6A");
                                                   }} ref={ref => (inputs.current["61"] = ref)}/>
                                            <label htmlFor="61">{t("roller_HemStyle1")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/Scallop.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("roller_HemStyle2")} value="2" name="step6" ref-num="6" id="62"
                                                   checked={step6 === "Scallop"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep6("Scallop");
                                                       setDeps("", "6");
                                                       setCart("HemStyle", "Scallop");
                                                       setHemStyleNextStep("7");
                                                   }} ref={ref => (inputs.current["62"] = ref)}/>
                                            <label htmlFor="62">{t("roller_HemStyle2")}<br/><p
                                                className="surcharge_price">{Object.keys(modelAccessories).length !== 0 ? t("Add "): t("Surcharge Applies")}{(modelAccessories["1"] ? (modelAccessories["1"]["61500508"] ? GetPrice(modelAccessories["1"]["61500508"]["price"], pageLanguage, t("TOMANS")) : null) : null)}</p>
                                            </label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/Wave.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("roller_HemStyle3")} value="3" name="step6" ref-num="6" id="63" checked={step6 === "Wave"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep6("Wave");
                                                       setDeps("", "6");
                                                       setCart("HemStyle", "Wave");
                                                       setHemStyleNextStep("7");
                                                   }} ref={ref => (inputs.current["63"] = ref)}/>
                                            <label htmlFor="63">{t("roller_HemStyle3")}<br/><p
                                                className="surcharge_price">{Object.keys(modelAccessories).length !== 0 ? t("Add "): t("Surcharge Applies")}{(modelAccessories["1"] ? (modelAccessories["1"]["61500508"] ? GetPrice(modelAccessories["1"]["61500508"]["price"], pageLanguage, t("TOMANS")) : null) : null)}</p>
                                            </label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/Colonial.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("roller_HemStyle4")} value="4" name="step6" ref-num="6" id="64"
                                                   checked={step6 === "Colonial"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep6("Colonial");
                                                       setDeps("", "6");
                                                       setCart("HemStyle", "Colonial");
                                                       setHemStyleNextStep("7");
                                                   }} ref={ref => (inputs.current["64"] = ref)}/>
                                            <label htmlFor="64">{t("roller_HemStyle4")}<br/><p
                                                className="surcharge_price">{Object.keys(modelAccessories).length !== 0 ? t("Add "): t("Surcharge Applies")}{(modelAccessories["1"] ? (modelAccessories["1"]["61500508"] ? GetPrice(modelAccessories["1"]["61500508"]["price"], pageLanguage, t("TOMANS")) : null) : null)}</p>
                                            </label>
                                        </div>
                                        <NextStep eventKey={hemStyleNextStep}>{t("NEXT STEP")}</NextStep>
                                    </div>
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">
                                                        <div className="measurementsHelp_link text-center" onClick={e => modalHandleShow("headrailHelp")}>
                                                            {t("headrailHelp")}
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 6A */}
                        {stepSelectedValue["6"] === "1" &&
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="6A" stepNum={t("6A")} stepTitle={t("roller_step6A")} stepRef="6A" type="1" required={requiredStep["6A"]}
                                                    stepSelected={stepSelectedLabel["6A"] === undefined ? "" : stepSelectedLabel["6A"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="6A">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/bottom_bar_sewn_in.png')} className="img-fluid half_margin special_margin" alt=""/>
                                            <input className="radio" type="radio" text={t("BottomBarStyle1")} value="1" name="step6A" ref-num="6A" id="6A1"
                                                   checked={step6A === "Sewn-In"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep6A("Sewn-In");
                                                       setDeps("", "6A");
                                                       setCart("BottomBarStyle", "Sewn-In");
                                                   }} ref={ref => (inputs.current["6A1"] = ref)}/>
                                            <label htmlFor="6A1">{t("BottomBarStyle1")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/roller/bottom_bar_exposed_designer.png')} className="img-fluid half_margin special_margin" alt=""/>
                                            <input className="radio" type="radio" text={t("BottomBarStyle2")} value="2" name="step6A" ref-num="6A" id="6A2"
                                                   checked={step6A === "Exposed - Designer"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep6A("Exposed - Designer");
                                                       setDeps("", "6A");
                                                       setCart("BottomBarStyle", "Exposed - Designer");
                                                   }} ref={ref => (inputs.current["6A2"] = ref)}/>
                                            <label htmlFor="6A2">{t("BottomBarStyle2")}<br/><p
                                                className="surcharge_price">{Object.keys(modelAccessories).length !== 0 ? t("Add "): t("Surcharge Applies")}{(modelAccessories["1"] ? (modelAccessories["1"]["61500508"] ? GetPrice(modelAccessories["1"]["61500508"]["price"], pageLanguage, t("TOMANS")) : null) : null)}</p>
                                            </label>
                                        </div>
                                        <NextStep eventKey="7">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column help_left_column_mount_type">
                                                <p className="help_column_header">{t("BottomBarStyle_help_1")}</p>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle">
                                                        <span className="popover_indicator">
                                                            {<PopoverStickOnHover placement={`${pageLanguage === 'fa' ? "right" : "left"}`}
                                                                                  children={<object className="popover_camera" type="image/svg+xml"
                                                                                                    data={require('../Images/public/camera.svg').default}/>}
                                                                                  component={
                                                                                      <div className="clearfix">
                                                                                          <div className="popover_image clearfix">
                                                                                              <img
                                                                                                  src={popoverImages["step51"] === undefined ? require('../Images/drapery/roller/SewnIn.jpg') : popoverImages["step51"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">{t("BottomBarStyle_help_5")}</span>
                                                                                              <span className="popover_thumbnails">
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/roller/SewnIn.jpg')}
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
                                                        </span>{t("BottomBarStyle_help_2")}</li>
                                                </ul>
                                            </div>
                                            <div className="help_column help_right_column help_right_column_mount_type">
                                                <p className="help_column_header">{t("BottomBarStyle_help_3")}</p>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle">
                                                        <span className="popover_indicator">
                                                            {<PopoverStickOnHover placement={`${pageLanguage === 'fa' ? "right" : "left"}`}
                                                                                  children={<object className="popover_camera" type="image/svg+xml"
                                                                                                    data={require('../Images/public/camera.svg').default}/>}
                                                                                  component={
                                                                                      <div className="clearfix">
                                                                                          <div className="popover_image clearfix">
                                                                                              <img
                                                                                                  src={popoverImages["step51"] === undefined ? require('../Images/drapery/roller/designer.jpg') : popoverImages["step51"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">{t("BottomBarStyle_help_6")}</span>
                                                                                              <span className="popover_thumbnails">
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/roller/designer.jpg')}
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
                                                        </span>{t("BottomBarStyle_help_4")}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        }
                        
                        {/* step 7 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="7" stepNum={t("7")} stepTitle={t("zebra_step6")} stepRef="7" type="2" required={requiredStep["7"]}
                                                    stepSelected={stepSelectedLabel["7"] === undefined ? "" : stepSelectedLabel["7"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="7">
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
                                                        <span className="details-label unselectable">{detailsShow ? t("Hide Details") : t("Add Room Image")}</span>
                                                        <span className="details_indicator">
                                                            {/*<i className="arrow_down"/>*/}
                                                            <img className="arrow_down img-fluid" src={require('../Images/public/arrow_down.svg').default} alt=""/>
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
                                                    <p>{t("upload_t1")}</p>
                                                </div>
                                                <div className="project-details-help">
                                                    <p>{t("upload_t2")}</p>
                                                </div>
                                            </div>
                                            <div className="project-details">
                                                <div className="btn-upload img_upload_btn">
                                                    <button type="button" className="btn" onClick={e => modalHandleShow("uploadImg")}>
                                                        {t("Upload Image")}
                                                    </button>
                                                </div>
                                                <div className="btn-upload">
                                                    <button type="button" className="btn" onClick={e => modalHandleShow("uploadPdf")}>
                                                        {t("Upload PDF")}
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
                                                <label className="select_label">{t("Room")}</label>
                                                <div className="select_container">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        values={selectedRoomLabel}
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
                                                            setDeps("", "71");
                                                            roomLabelChanged(selected[0], "7", false);
                                                            setSelectedRoomLabel(selected);
                                                            // setCart("RoomNameEn", selected[0].value);
                                                            setCart("RoomNameFa", rooms["fa"].find(opt => opt.value === selected[0].value).label, "", "RoomNameEn", [selected[0].value]);
                                                        }}
                                                        options={rooms[pageLanguage]}
                                                    />
                                                </div>
                                            </div>
                                            <div className="room_select">
                                                <label className="select_label">{t("Window Description")}</label>
                                                <input type="text" placeholder={t("Window Description")} className="form-control window_name" name="order_window_name"
                                                       value={roomLabelText}
                                                       onChange={(e) => {
                                                           if (e.target.value === "")
                                                               setDeps("72", "");
                                                           else
                                                               setDeps("", "72");
                                                           roomLabelChanged(e.target.value, "7", true);
                                                           setRoomLabelText(e.target.value);
                                                           setCart("WindowName", e.target.value);
                                                       }}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" accordion_help">
                                        <div className=" help_container">
                                            <div className=" help_column help_left_column">
                                                <p className=" help_column_header">{t("step6_help_1")}</p>
                                                <ul className=" help_column_list">
                                                    <li className=" no_listStyle">{t("step6_help_2")}</li>
                                                </ul>
                                            </div>
                                            <div className=" help_column help_right_column">
                                                <p className=" help_column_header">{t("step6_help_3")}</p>
                                                <ul className=" help_column_list">
                                                    <li className=" no_listStyle">{t("step6_help_4")}</li>
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
            
            <Modal dialogClassName={`noPower_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["noPower"] === undefined ? false : modals["noPower"]}
                   onHide={() => modalHandleClose(" noPower")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("modal_no power")}</p>
                    
                    <br/>
                    <div className=" text_center">
                        <button className=" btn btn-new-dark" onClick={() => modalHandleClose(" noPower")}>{t("CONTINUE")}</button>
                    </div>
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            <Modal dialogClassName={`noMount_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["noMount"] === undefined ? false : modals["noMount"]}
                   onHide={() => modalHandleClose(" noMount")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("modal_select_mount")}</p>
                    
                    <br/>
                    <div className=" text_center">
                        <button className=" btn btn-new-dark" onClick={() => modalHandleClose(" noMount")}>{t("CONTINUE")}</button>
                    </div>
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            <Modal dialogClassName={`learnMore_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["learnMore"] === undefined ? false : modals["learnMore"]}
                   onHide={() => modalHandleClose(" learnMore")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("modal_learn_more1")}</p>
                    <p>{t("modal_learn_more2")}</p>
                    <p>{t("modal_learn_more3")}</p>
                    
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
                        <object className="measurementsHelp_modal_img" type="image/svg+xml"
                                data={pageLanguage === 'fa' ? require('../Images/drapery/roller/step3_help_inside_fa.svg').default : require('../Images/drapery/roller/step3_help_inside.svg').default}/>
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
                        <object className="measurementsHelp_modal_img" type="image/svg+xml"
                                data={pageLanguage === 'fa' ? require('../Images/drapery/roller/step3_help_outside_fa.svg').default : require('../Images/drapery/roller/step3_help_outside.svg').default}/>
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
            
            <Modal backdrop="static" keyboard={false} dialogClassName={`measurementsHelp_modal largeSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["headrailHelp"] === undefined ? false : modals["headrailHelp"]}
                   onHide={() => modalHandleClose("headrailHelp")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <div className="largeSizeModal_modal_body_container">
                        <div className="accordion_help help_largeSizeModal_modal">
                            <p className="help_column_header">{t("headrailHelp1")}</p>
                            <div className="largeSizeModal_img_plus_help">
                                <img src={require('../Images/drapery/roller/roller_help_NoValance.jpg')} className="img-fluid" alt=""/>
                                <div className="help_container">
                                    <div className="help_column help_left_column">
                                        <ul className="help_column_list">
                                            <li>{t("headrailHelp2")}</li>
                                            <li>{t("headrailHelp3")}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion_help help_largeSizeModal_modal">
                            <p className="help_column_header">{t("headrailHelp4")}</p>
                            <div className="largeSizeModal_img_plus_help">
                                <img src={require('../Images/drapery/roller/roller_help_MetalValance.jpg')} className="img-fluid" alt=""/>
                                <div className="help_container">
                                    <div className="help_column help_left_column">
                                        <ul className="help_column_list">
                                            <li>{t("headrailHelp5")}</li>
                                            <li>{t("headrailHelp6")}</li>
                                            <li>{t("headrailHelp7")}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="largeSizeModal_modal_body_container">
                        <div className="accordion_help help_largeSizeModal_modal">
                            <p className="help_column_header">{t("headrailHelp8")}</p>
                            <div className="largeSizeModal_img_plus_help">
                                <img src={require('../Images/drapery/roller/roller_help_MetalValance.jpg')} className="img-fluid" alt=""/>
                                <div className="help_container">
                                    <div className="help_column help_left_column">
                                        <ul className="help_column_list">
                                            <li>{t("headrailHelp9")}</li>
                                            <li>{t("headrailHelp10")}</li>
                                            <li>{t("headrailHelp11")}</li>
                                            <li>{t("headrailHelp12")}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion_help help_largeSizeModal_modal">
                            <p className="help_column_header">{t("headrailHelp13")}</p>
                            <div className="largeSizeModal_img_plus_help">
                                <img src={require('../Images/drapery/roller/roller_help_UphosteredValance.jpg')} className="img-fluid" alt=""/>
                                <div className="help_container">
                                    <div className="help_column help_left_column">
                                        <ul className="help_column_list">
                                            <li>{t("headrailHelp14")}</li>
                                            <li>{t("headrailHelp15")}</li>
                                            <li>{t("headrailHelp16")}</li>
                                            <li>{t("headrailHelp17")}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="text_center">
                        <button className="btn btn-new-dark" onClick={() => modalHandleClose("headrailHelp")}>{t("CONTINUE")}</button>
                    </div>
                </Modal.Body>
            </Modal>
            
            <Modal dialogClassName={`upload_modal uploadImg_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["uploadImg"] === undefined ? false : modals["uploadImg"]}
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
            
            <Modal dialogClassName={`upload_modal uploadPdf_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["uploadPdf"] === undefined ? false : modals["uploadPdf"]}
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
            
            <Modal backdrop="static" keyboard={false} dialogClassName={`warning_modal bigSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["widthDifferent"] === undefined ? false : modals["widthDifferent"]}
                   onHide={() => {
                       modalHandleClose(" widthDifferent");
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
            
            <Modal backdrop="static" keyboard={false} dialogClassName={`addToCartErr bigSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["addToCartErr"] === undefined ? false : modals["addToCartErr"]}
                   onHide={() => {
                       modalHandleClose("addToCartErr");
                   }}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <ul className="addToCartErr_list">
                        {addCartErr}
                    </ul>
                    <p>{t("addToCartErr1")}</p>
                    <p>{t("addToCartErr2")}</p>
                    <p>{t("addToCartErr3")}</p>
                    
                    <br/>
                    <div className="text_center">
                        <button className="btn btn-new-dark" onClick={() => modalHandleClose("addToCartErr")}>{t("OK")}</button>
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
            
            <Modal backdrop="static" keyboard={false} className={`cart_modal_container cart_agree_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   dialogClassName={`cart_modal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["cart_modal"] === undefined ? false : modals["cart_modal"]}
                   onHide={() => {
                       modalHandleClose("cart_modal");
                       setCartStateAgree(false);
                   }} id="cart_modal">
                {cartStateAgree &&
                <div
                    className="custom_cart_header_desc">{`${(freeShipPrice - totalCartPrice) > 0 ? `${t("cart_agree_free_ship1")}${pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${GetPrice(freeShipPrice - totalCartPrice, pageLanguage, t("TOMANS"))}`) : GetPrice(freeShipPrice - totalCartPrice, pageLanguage, t("TOMANS"))}${t("cart_agree_free_ship2")}` : `${t("cart_agree_free_ship")}`}`}</div>
                }
                <Modal.Header>
                    {cartStateAgree &&
                    <span className="custom_cart_title">{t("My Bag")} <h3>({pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${cartCount}`) : cartCount})</h3></span>
                    }
                    {!cartStateAgree &&
                    <p className="custom_cart_title">&nbsp;</p>
                    }
                    <button className="custom_cart_close" onClick={() => {
                        modalHandleClose("cart_modal");
                        setCartStateAgree(false);
                    }}>{t("CONTINUE SHOPPING")}
                    </button>
                </Modal.Header>
                <Modal.Body>
                    {cartStateAgree &&
                    <ul className="custom_cart_items_container">
                        {cartItems}
                    </ul>
                    }
                    
                    {!cartStateAgree &&
                    <h1 className="cart_agree_title1">{t("SPECIAL ORDER")}</h1>
                    }
                    {!cartStateAgree &&
                    <h2 className="cart_agree_title2">{t("TERMS OF SALE")}</h2>
                    }
                    {!cartStateAgree &&
                    <span className="cart_agree_desc">{t("cart_agree_desc")}<p
                        className="return_policy">{t("Return Policy")}</p>.</span>
                    }
                    {!cartStateAgree &&
                    <div>{cartAgree}</div>
                    }
                
                </Modal.Body>
                <Modal.Footer>
                    {cartStateAgree &&
                    <div className="go_to_checkout">
                        <div className="checkout_button_section">
                            <span className="checkout_payment_price_detail payment_price_detail">
                                <h3>{t("SUBTOTAL")}</h3>
                                <h4>{GetPrice(totalCartPrice, pageLanguage, t("TOMANS"))}</h4>
                            </span>
                            <Link className="basket_checkout btn" to={"/" + pageLanguage + "/Basket"} onClick={() => {
                                setCartStateAgree(false);
                            }}>{t("CHECKOUT")}</Link>
                        </div>
                    </div>
                    }
                    {!cartStateAgree &&
                    <div className="go_to_checkout">
                        <button className="basket_checkout" onClick={() => {
                            addToCart_agreed();
                        }}>{t("AGREE & ADD TO BAG")}
                        </button>
                    </div>
                    }
                </Modal.Footer>
            </Modal>
            
            <Modal backdrop="static" keyboard={false}
                   className={`cart_modal_container cart_agree_container add_to_project_modal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   dialogClassName={`cart_modal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["add_to_project_modal"] === undefined ? false : modals["add_to_project_modal"]}
                   onHide={() => {
                       modalHandleClose("add_to_project_modal");
                   }} id="add_to_project_modal">
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    {projectModalState === 0 &&
                    <div className="add_to_project_container2">
                        <h2 className="project_added_text">{t("Please select a room name")}</h2>
                        <div className="box100 selectInput_section">
                            <div className="room_select">
                                <label className="select_label">{t("Room")}</label>
                                <div className="select_container">
                                    <Select
                                        className="select"
                                        placeholder={t("Please Select")}
                                        // portal={document.body}
                                        dropdownPosition="bottom"
                                        dropdownHandle={false}
                                        dropdownGap={0}
                                        values={selectedRoomLabel}
                                        // onDropdownOpen={() => {
                                        //     let temp1 = window.scrollY;
                                        //     window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                        //     setTimeout(() => {
                                        //         let temp2 = window.scrollY;
                                        //         if (temp2 === temp1)
                                        //             window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                        //     }, 100);
                                        // }}
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
                                            setDeps("", "61");
                                            roomLabelChanged(selected[0], "6", false);
                                            setSelectedRoomLabel(selected);
                                            // setCart("RoomNameEn", selected[0].value);
                                            setCart("RoomNameFa", rooms["fa"].find(opt => opt.value === selected[0].value).label, "", "RoomNameEn", [selected[0].value]);
                                        }}
                                        options={rooms[pageLanguage]}
                                    />
                                </div>
                            </div>
                            <div className="room_select">
                                <label className="select_label">{t("Window Description")}</label>
                                <input type="text" placeholder={t("Window Description")} className="form-control window_name" name="order_window_name"
                                       value={roomLabelText}
                                       onChange={(e) => {
                                           if (e.target.value === "")
                                               setDeps("62", "");
                                           else
                                               setDeps("", "62");
                                           roomLabelChanged(e.target.value, "6", true);
                                           setRoomLabelText(e.target.value);
                                           setCart("WindowName", e.target.value);
                                       }}/>
                            </div>
                        </div>
                        {!!(roomLabelText !== "" && selectedRoomLabel.length) &&
                        <button className="save_item_btn btn-new-dark"
                                onClick={() => {
                                    if (roomLabelText !== "" && selectedRoomLabel.length) {
                                        if (projectId && projectId !== "") {
                                            SaveUserProject(depSet, cartValues, `${modelID}`, price, defaultModelName, defaultModelNameFa, projectData).then((temp) => {
                                                if (temp) {
                                                    modalHandleShow("add_to_project_modal");
                                                    setProjectModalState(1);
                                                } else {
                                                    console.log("project not saved!");
                                                }
                                            }).catch(() => {
                                                setProjectModalState(2);
                                            });
                                        } else {
                                            SaveUserProject(depSet, cartValues, `${modelID}`, price, defaultModelName, defaultModelNameFa).then((temp) => {
                                                if (temp) {
                                                    setProjectModalState(1);
                                                } else {
                                                    console.log("project not saved!");
                                                }
                                            }).catch(() => {
                                                setProjectModalState(2);
                                            });
                                        }
                                    } else {
                                        setProjectModalState(0);
                                    }
                                }}>{t("SAVE ITEM")}
                        </button>
                        }
                    </div>
                    }
                    {projectModalState === 1 &&
                    <div className="add_to_project_container">
                        <h2 className="project_added_text">{t("1 ITEM ADDED TO YOUR PROJECTS")}</h2>
                        <Link className="add_to_project_btn btn" to={"/" + pageLanguage + "/Account/Projects"}>{t("VIEW PROJECTS")}</Link>
                        <button className="continue_shopping_btn" onClick={() => {
                            modalHandleClose("add_to_project_modal");
                        }}>{t("CONTINUE SHOPPING")}
                        </button>
                    </div>
                    }
                    
                    {projectModalState === 2 &&
                    <ModalLogin/>
                    }
                
                
                </Modal.Body>
            </Modal>
            
            {/*<Modal backdrop="static" keyboard={false} className={`cart_modal_container cart_agree_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}*/}
            {/*       dialogClassName={`cart_modal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}*/}
            {/*       show={modals["cart_agree"] === undefined ? false : modals["cart_agree"]}*/}
            {/*       onHide={() => {*/}
            {/*           modalHandleClose("cart_agree");*/}
            {/*       }}>*/}
            {/*    <Modal.Header closeButton>*/}
            {/*        /!*<p className="custom_cart_title">My Shopping Bag (1)</p>*!/*/}
            {/*        /!*<button className="custom_cart_close" onClick={()=>modalHandleClose("cart_agree")}>Close</button>*!/*/}
            {/*    </Modal.Header>*/}
            {/*    <Modal.Body>*/}
            {/*        <h1 className="cart_agree_title1">SPECIAL ORDER</h1>*/}
            {/*        <h2 className="cart_agree_title2">TERMS OF SALE</h2>*/}
            {/*        <span className="cart_agree_desc">Special orders begin production immediately upon order placement and are built to your specifications. As a result, the item(s) cannot be cancelled, changed, returned or refunded at any time. See <p*/}
            {/*            className="return_policy">Return Policy</p>.</span>*/}
            {/*        {cartAgree}*/}
            {/*        <div className="cart_agree_button_container">*/}
            {/*            <button className="cart_agree_button" onClick={() => {*/}
            {/*                addToCart_agreed();*/}
            {/*                modalHandleClose("cart_agree");*/}
            {/*            }}>AGREE & ADD TO BAG*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    */}
            {/*    </Modal.Body>*/}
            {/*    /!*<Modal.Footer>*!/*/}
            {/*    /!*    *!/*/}
            {/*    /!*</Modal.Footer>*!/*/}
            {/*</Modal>*/}
            
            
            <div className={`CustomModelFooter ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                <div className="CustomModelFooter_hidden_part"/>
                <div className="CustomModelFooter_visible_part">
                    <div className="left_footer">
                        <button className="save_to_acc" onClick={() => {
                            if (roomLabelText !== "" && selectedRoomLabel.length) {
                                if (projectId && projectId !== "") {
                                    SaveUserProject(depSet, cartValues, `${modelID}`, price, defaultModelName, defaultModelNameFa, projectData).then((temp) => {
                                        if (temp) {
                                            modalHandleShow("add_to_project_modal");
                                            setProjectModalState(1);
                                        } else {
                                            console.log("project not saved!");
                                        }
                                    }).catch(() => {
                                        setProjectModalState(2);
                                        modalHandleShow("add_to_project_modal")
                                    });
                                } else {
                                    SaveUserProject(depSet, cartValues, `${modelID}`, price, defaultModelName, defaultModelNameFa).then((temp) => {
                                        if (temp) {
                                            modalHandleShow("add_to_project_modal");
                                            setProjectModalState(1);
                                        } else {
                                            console.log("project not saved!");
                                        }
                                    }).catch(() => {
                                        setProjectModalState(2);
                                        modalHandleShow("add_to_project_modal")
                                    });
                                }
                            } else {
                                setProjectModalState(0);
                                modalHandleShow("add_to_project_modal");
                            }
                        }}>{t("footer_Save To")}<br/>{t("footer_My Account")}</button>
                    </div>
                    <div className="hidden_inner_footer">&nbsp;</div>
                    <div className="footer_price_section">
                        <div className="showPrice">{t("footer_Price")}</div>
                        <div className="price">{GetPrice(price, pageLanguage, t("TOMANS"))}</div>
                    </div>
                    <div className="right_footer">
                        <input type="submit" onClick={() => addToCart()} className="btn add_to_cart" value={t("footer_Add To Cart")} readOnly/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Roller_Old;