import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
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
import ReactImageMagnify from '@blacklab/react-image-magnify';
import * as qs from 'qs'

import {ReactComponent as MountInside} from '../Images/drapery/zebra/mount_inside.svg';
import {ReactComponent as MountOutside} from '../Images/drapery/zebra/mount_outside.svg';
import Form from "react-bootstrap/Form";
import PopoverStickOnHover from "../Components/PopoverStickOnHover";
import CustomControl from "../Components/CustomControl";
import CustomControlMulti from "../Components/CustomControlMulti";
import CustomDropdown from "../Components/CustomDropdown";
import CustomDropdownMulti from "../Components/CustomDropdownMulti";
import SelectOptionRange from "../Components/SelectOptionRange";

import {ReactComponent as Camera} from '../Images/public/camera.svg';
import CustomDropdownWithSearch from "../Components/CustomDropdownWithSearch";
import CustomControlNum from "../Components/CustomControlNum";
import NumberToPersianWord from "number_to_persian_word";
// import CartInfo from "../Components/CartInfo"
import UserProjects from "../Components/UserProjects";
import GetPrice from "../Components/GetPrice";
import {useDispatch, useSelector} from "react-redux";
import {HideLogin2Modal, HideLoginModal, LOGIN, LOGOUT, ShowLogin2Modal, ShowLoginModal} from "../Actions/types";
import authHeader from "../Services/auth-header";
import SaveUserProject from "../Components/SaveUserProject";
import {refreshToken} from "../Services/auth.service";
import GetUserProjectData from "../Components/GetUserProjectData";
import setGetDeps from "../Components/setGetDeps";
import ModalLogin from "../Components/ModalLogin";
import AddProjectToCart from "../Components/AddProjectToCart";
import GetMeasurementArray from "../Components/GetMeasurementArray";
import GetSewingFilters from "../Components/GetSewingFilters";


const baseURLCats = "https://api.atlaspood.ir/WebsitePage/GetDetailByName";
const baseURLModel = "https://api.atlaspood.ir/SewingModel/GetById";
const baseURLFabrics = "https://api.atlaspood.ir/Sewing/GetModelFabric";
const baseURLWindowSize = "https://api.atlaspood.ir/Sewing/GetWindowSize";
const baseURLPrice = "https://api.atlaspood.ir/Sewing/GetSewingOrderPrice";
const baseURLFreeShipping = "https://api.atlaspood.ir/WebsiteSetting/GetFreeShippingAmount";
const baseURGetProject = "https://api.atlaspood.ir/SewingPreorder/GetById";
const baseURLGetCart = "https://api.atlaspood.ir/cart/GetAll";
const baseURLUploadImg = "https://api.atlaspood.ir/SewingOrderAttachment/ImageUpload";
const baseURLUploadPdf = "https://api.atlaspood.ir/SewingOrderAttachment/PdfUpload";
const baseURLDeleteFile = "https://api.atlaspood.ir/SewingOrderAttachment/Delete";
const baseURLEditProject = "https://api.atlaspood.ir/SewingPreorder/Edit";
const baseURLDeleteBasketProject = "https://api.atlaspood.ir/Cart/DeleteItem";

const baseURLAddSwatch = "https://api.atlaspood.ir/Cart/Add";
const baseURLFilterPattern = "https://api.atlaspood.ir/Sewing/GetModelPatternType";
const baseURLFilterType = "https://api.atlaspood.ir/Sewing/GetModelDesignType";
const baseURLFilterPrice = "https://api.atlaspood.ir/BaseType/GetPriceLevel";


function DK({CatID, ModelID, ProjectId, EditIndex}) {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
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
    const [noWidth, setNoWidth] = useState({});
    const [fabrics, setFabrics] = useState({});
    const [fabricsList, setFabricsList] = useState([]);
    const [fabricColorHtmlCode, setFabricColorHtmlCode] = useState("#000");
    const [dkCurtainList, setDkCurtainList] = useState([]);
    const [dkCurtainPreviewList, setDkCurtainPreviewList] = useState([]);
    const [showMoreFabric, setShowMoreFabric] = useState("");
    const [dkCurtainArr, setDkCurtainArr] = useState([]);
    const [dkCurtainArrComplete, setDkCurtainArrComplete] = useState(false);
    const [dkCurtainArrCount, setDkCurtainArrCount] = useState(0);
    const [sodFabrics, setSodFabrics] = useState([]);
    const [symmetric, setSymmetric] = useState(true);
    const [defaultFabricPhoto, setDefaultFabricPhoto] = useState(null);
    const [defaultModelName, setDefaultModelName] = useState("");
    const [defaultModelNameFa, setDefaultModelNameFa] = useState("");
    const [price, setPrice] = useState(0);
    const [bagPrice, setBagPrice] = useState(0);
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [freeShipPrice, setFreeShipPrice] = useState(0);
    const [show, setShow] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchShow, setSearchShow] = useState(false);
    const [measurementsNextStep, setMeasurementsNextStep] = useState("3");
    const [controlTypeNextStep, setControlTypeNextStep] = useState("5");
    const [headrailsNextStep, setHeadrailsNextStep] = useState("6");
    const [hemStyleNextStep, setHemStyleNextStep] = useState("7");
    const [projectModalState, setProjectModalState] = useState(0);
    const [zoomModalHeader, setZoomModalHeader] = useState([]);
    const [zoomModalBody, setZoomModalBody] = useState([]);
    const [swatchId, setSwatchId] = useState(0);
    const [swatchDetailId, setSwatchDetailId] = useState(0);
    const [swatchPhotoPath, setSwatchPhotoPath] = useState("");
    const [hasSwatchId, setHasSwatchId] = useState(false);
    const [addCartErr, setAddCartErr] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [cartAgree, setCartAgree] = useState([]);
    // const [pageLanguage, setPageLanguage] = useState("");
    const [cartChanged, setCartChanged] = useState(0);
    const [bag, setBag] = useState(0);
    const [accordionActiveKey, setAccordionActiveKey] = useState("");
    const [roomLabelText, setRoomLabelText] = useState("");
    const [fabricSelected, setFabricSelected] = useState({
        selectedFabricId: 0,
        selectedTextEn: "",
        selectedTextFa: "",
        selectedColorEn: "",
        selectedColorFa: "",
        ColorHtmlCode: "",
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
        "ceilingToWindow1": [],
        "ceilingToWindow2": [],
        "ceilingToWindow3": [],
        "ceilingToFloor": [],
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
        "2AIn": false,
        "2BIn": false,
        "2A": false,
        "2B": false,
        "2C": false,
        "2D": false,
        "2E": false,
        "2F": false,
        "2G": false,
        "2H": false,
        "3": false,
        "4": false,
        "5": false,
        "6": false
    });
    const [cartValues, setCartValues] = useState({});
    const [cartStateAgree, setCartStateAgree] = useState(false);
    const [cartAgreeDescription, setCartAgreeDescription] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [cartProjectIndex, setCartProjectIndex] = useState(-1);
    const [cartDraperies, setCartDraperies] = useState({
        "count": 0,
        "list": []
    });
    const [saveProjectCount, setSaveProjectCount] = useState(0);
    
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
    
    const [filterChanged, setFilterChanged] = useState({
        filter: 0,
        filter_id: undefined,
        isDelete: false
    });
    
    const [filterColors, setFilterColors] = useState([]);
    const [filterPatterns, setFilterPatterns] = useState([]);
    const [filterTypes, setFilterTypes] = useState([]);
    const [filterPrices, setFilterPrices] = useState([]);
    const [selectedMountOutsideType, setSelectedMountOutsideType] = useState([]);
    
    const [step1, setStep1] = useState("");
    const [step11, setStep11] = useState("");
    const [step2, setStep2] = useState("");
    const [step2A, setStep2A] = useState("");
    const [step3, setStep3] = useState("");
    const [step4, setStep4] = useState("");
    const [step5, setStep5] = useState("");
    const [remoteName, setRemoteName] = useState("");
    const [selectedRoomLabel, setSelectedRoomLabel] = useState([]);
    
    const [savedProjectRoomLabel, setSavedProjectRoomLabel] = useState("");
    const [savedProjectRoomText, setSavedProjectRoomText] = useState("");
    
    const [selectedFile, setSelectedFile] = useState();
    const [selectedFileName, setSelectedFileName] = useState("");
    const [editedFileName, setEditedFileName] = useState("");
    const [uploadedImagesList, setUploadedImagesList] = useState([]);
    const [uploadedImagesNamesList, setUploadedImagesNamesList] = useState([]);
    const [uploadedPDFNameList, setUploadedPDFNameList] = useState([]);
    const [uploadedImagesFile, setUploadedImagesFile] = useState([]);
    const [uploadedPDFFile, setUploadedPDFFile] = useState([]);
    const [uploadedImagesURL, setUploadedImagesURL] = useState([]);
    const [uploadedPDFURL, setUploadedPDFURL] = useState([]);
    
    const [sewingColors, setSewingColors] = useState([]);
    const [sewingPatterns, setSewingPatterns] = useState([]);
    const [sewingTypes, setSewingTypes] = useState([]);
    const [sewingPrices, setSewingPrices] = useState([]);
    
    const [deleteUploadImageUrl, setDeleteUploadImageUrl] = useState("");
    const [deleteUploadPdfUrl, setDeleteUploadPdfUrl] = useState("");
    const [deleteUploadImageIndex, setDeleteUploadImageIndex] = useState(-1);
    const [deleteUploadPdfIndex, setDeleteUploadPdfIndex] = useState(-1);
    
    const [addingLoading, setAddingLoading] = useState(false);
    const [savingLoading, setSavingLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [swatchLogin, setSwatchLogin] = useState(false);
    
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
                modelId: modelID
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
    
    function getFabricsWithFilter() {
        let paramObj = {modelId: modelID, searchString: searchText};
        
        let promise1 = new Promise((resolve, reject) => {
            if (filterColors.length > 0) {
                paramObj["colorIds"] = [];
                filterColors.forEach((filter_id, index) => {
                    paramObj["colorIds"] = [...paramObj["colorIds"], filter_id];
                    if (index === filterColors.length - 1) {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
        let promise2 = new Promise((resolve, reject) => {
            if (filterPatterns.length > 0) {
                paramObj["patternTypeIds"] = [];
                filterPatterns.forEach((filter_id, index) => {
                    paramObj["patternTypeIds"] = [...paramObj["patternTypeIds"], filter_id];
                    if (index === filterPatterns.length - 1) {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
        let promise3 = new Promise((resolve, reject) => {
            if (filterTypes.length > 0) {
                paramObj["typeIds"] = [];
                filterTypes.forEach((filter_id, index) => {
                    paramObj["typeIds"] = [...paramObj["typeIds"], filter_id];
                    if (index === filterTypes.length - 1) {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
        let promise4 = new Promise((resolve, reject) => {
            if (filterPrices.length > 0) {
                paramObj["priceLevelIds"] = [];
                filterPrices.forEach((filter_id, index) => {
                    paramObj["priceLevelIds"] = [...paramObj["priceLevelIds"], filter_id];
                    if (index === filterPrices.length - 1) {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
        
        Promise.all([promise1, promise2, promise3, promise4]).then(() => {
            // console.log(filterColors,paramObj);
            axios.get(baseURLFabrics, {
                params: paramObj,
                paramsSerializer: params => {
                    return qs.stringify(params, {arrayFormat: 'repeat'})
                }
            }).then((response) => {
                let tempFabrics = {};
                response.data.forEach(obj => {
                    obj["ShowMore"] = false;
                    if (tempFabrics[obj["DesignEnName"]] === "" || tempFabrics[obj["DesignEnName"]] === undefined || tempFabrics[obj["DesignEnName"]] === null || tempFabrics[obj["DesignEnName"]] === [])
                        tempFabrics[obj["DesignEnName"]] = [];
                    tempFabrics[obj["DesignEnName"]].push(obj);
                });
                setShowMoreFabric("");
                setFabrics(tempFabrics);
                // console.log(tempFabrics);
            }).catch(err => {
                console.log(err);
            });
        })
    }
    
    const getCats = () => {
        axios.get(baseURLCats, {
            params: {
                pageName: catID
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
                id: modelID
            }
        }).then((response) => {
            setModel(response.data);
            // console.log(response.data)
        }).catch(err => {
            console.log(err);
        });
    };
    
    function renderFabrics(bag) {
        const fabricList = [];
        let count = 0;
        let cartObj = {};
        let temp = [];
        let pageLanguage1 = location.pathname.split('').slice(1, 3).join('');
        if (Object.keys(bag).length > 0) {
            if (isLoggedIn) {
            
            } else {
                cartObj = JSON.parse(localStorage.getItem("cart"));
                temp = cartObj["swatches"];
            }
        }
        
        Object.keys(fabrics).forEach((key, index) => {
            let DesignName = convertToPersian(fabrics[key][0].DesignName);
            let DesignEnName = fabrics[key][0].DesignEnName;
            
            const fabric = [];
            for (let j = 0; j < fabrics[key].length; j++) {
                if (j === 8 && !fabrics[key][j]["ShowMore"]) {
                    fabric.push(
                        <div key={j} className="dk_fabric_show_more_button_container">
                            <button className="dk_fabric_show_more_button btn" onClick={() => setShowMoreFabric(key)}>SEE MORE COLOR OPTIONS</button>
                        </div>
                    );
                } else if (j > 8 && !fabrics[key][j]["ShowMore"]) {
                
                } else {
                    let FabricId = fabrics[key][j].FabricId;
                    // console.log(fabrics,key);
                    let PhotoPath = "";
                    // console.log(fabrics[key][j].FabricPhotos);
                    fabrics[key][j].FabricPhotos.forEach(obj => {
                        if (obj.PhotoTypeId === 4702)
                            PhotoPath = obj.PhotoUrl;
                    });
                    
                    let FabricOnModelPhotoUrl = fabrics[key][j].FabricOnModelPhotoUrl;
                    let HasTrim = fabrics[key][j].HasTrim;
                    let DesignCode = fabrics[key][j].DesignCode;
                    let DesignRaportLength = fabrics[key][j].DesignRaportLength;
                    let DesignRaportWidth = fabrics[key][j].DesignRaportWidth;
                    let PolyesterPercent = fabrics[key][j].PolyesterPercent;
                    let ViscosePercent = fabrics[key][j].ViscosePercent;
                    let NylonPercent = fabrics[key][j].NylonPercent;
                    let ColorName = convertToPersian(fabrics[key][j].ColorName);
                    let ColorEnName = fabrics[key][j].ColorEnName;
                    let ColorHtmlCode = fabrics[key][j].ColorHtmlCode ? fabrics[key][j].ColorHtmlCode : "#000";
                    let SwatchId = fabrics[key][j].SwatchId ? fabrics[key][j].SwatchId : -1;
                    let HasSwatchId = false;
                    let swatchDetailId = undefined;
                    let index = -1;
                    if (isLoggedIn) {
                        if (bag["CartDetails"]) {
                            let index = bag["CartDetails"].findIndex(object => {
                                return object["ProductId"] === SwatchId;
                            });
                            // console.log(index);
                            if (index !== -1) {
                                HasSwatchId = true;
                                swatchDetailId = bag["CartDetails"][index]["CartDetailId"];
                            }
                        }
                    } else {
                        if (temp.length > 0) {
                            index = temp.findIndex(object => {
                                return object["SwatchId"] === SwatchId;
                            });
                            if (index !== -1) {
                                HasSwatchId = true;
                            }
                        }
                    }
                    // console.log(HasSwatchId);
                    // console.log(step3 === `${FabricId}`, step3, `${FabricId}`, FabricId);
                    
                    fabric.push(
                        <div className={`radio_group ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`} key={"fabric" + key + j}>
                            <label data-tip={`${pageLanguage1 === 'en' ? DesignEnName : DesignName}: ${pageLanguage1 === 'en' ? ColorEnName : ColorName}`}
                                   data-for={"fabric" + key + j} className={`radio_container ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`}
                                   data-img={`https://www.doopsalta.com/upload/${PhotoPath}`}>
                                {/*<ReactTooltip id={"fabric" + key + j} place="top" type="light" effect="float"/>*/}
                                <input className="radio" type="radio" ref-num="3" default-fabric-photo={FabricOnModelPhotoUrl}
                                       onChange={e => {
                                           // console.log("hi1");
                                           let temp = JSON.parse(JSON.stringify(fabricSelected));
                                           temp.selectedFabricId = FabricId;
                                           temp.selectedTextEn = DesignEnName;
                                           temp.selectedTextFa = DesignName;
                                           temp.selectedColorEn = ColorEnName;
                                           temp.selectedColorFa = ColorName;
                                           temp.ColorHtmlCode = ColorHtmlCode;
                                           temp.selectedHasTrim = HasTrim;
                                           temp.selectedPhoto = FabricOnModelPhotoUrl;
                                           setFabricSelected(temp);
                                           // fabricClicked(e, HasTrim);
                                           // selectChanged(e);
                                           // setCart("FabricId", FabricId);
                                           // setDeps("", "1");
                                       }} name="fabric"
                                       model-id={modelID} value={FabricId} text-en={DesignEnName} text-fa={DesignName} checked={`${FabricId}` === step3}
                                       ref={ref => (inputs.current[`3${FabricId}`] = ref)}/>
                                <div className="frame_img">
                                    <img className={`img-fluid ${`${FabricId}` === step3 ? "img-fluid_checked" : ""}`} src={`https://api.atlaspood.ir/${PhotoPath}`} alt=""/>
                                </div>
                            </label>
                            <div className={`fabric_name_container ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`}>
                                <h1>{pageLanguage1 === 'en' ? ColorEnName : ColorName}</h1>
                                <span onClick={() => {
                                    handleShow(fabrics[key][j], swatchDetailId);
                                    setHasSwatchId(HasSwatchId);
                                }}><i className="fa fa-search" aria-hidden="true"/></span>
                            </div>
                            <button className={`swatchButton ${HasSwatchId ? "activeSwatch" : ""} ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`}
                                    current-state={HasSwatchId ? "1" : "0"}
                                    onClick={(e) => {
                                        fabricSwatch(e, SwatchId, swatchDetailId, PhotoPath);
                                    }} disabled={SwatchId === -1}>{HasSwatchId ? t("SWATCH IN CART") : t("ORDER" +
                                " SWATCH")}</button>
                        </div>
                    );
                }
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
    
    function renderDkCurtains(curtainWidth) {
        const curtainList = [];
        let count = Math.floor(curtainWidth / 11.5);
        let DkCurtainArr=JSON.parse(JSON.stringify(dkCurtainArr));
        if(dkCurtainArrCount!==count){
            setDkCurtainArr([]);
            DkCurtainArr=[]
            setDkCurtainArrCount(count);
        }
        // console.log(dkCurtainArr);
        
        let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
        let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
        if (DkCurtainArr.filter(el => el).length === count) {
            tempLabels["3"] = t('Completed')
            tempValue["3"] = "Completed";
            setDkCurtainArrComplete(true);
        } else {
            tempLabels["3"] = undefined;
            tempValue["3"] = undefined;
            setDkCurtainArrComplete(false);
        }
        setStepSelectedLabel(tempLabels);
        setStepSelectedValue(tempValue);
        
        let promiseArr = [];
        for (let i = 0; i < count; i++) {
            promiseArr[i] = new Promise((resolve, reject) => {
                let tempColor = DkCurtainArr[i] ? (DkCurtainArr[i]["ColorHtmlCode"] ? DkCurtainArr[i]["ColorHtmlCode"] : "#e2e2e2") : "#e2e2e2";
                curtainList.push(
                    <div key={i} className="dk_curtain_inside_part" onClick={() => curtainChanged(i)} style={{backgroundColor: tempColor}}/>
                );
                resolve();
            });
        }
        
        Promise.all(promiseArr).then(() => {
            setDkCurtainList(curtainList);
            // console.log(curtainList)
        });
    }
    
    function handleClose() {
        setShow(false);
    }
    
    function handleShow(fabricObj, SwatchDetailId) {
        let pageLanguage = location.pathname.split('').slice(1, 3).join('');
        
        let DesignName = convertToPersian(fabricObj["DesignName"]);
        let DesignEnName = fabricObj["DesignEnName"];
        let FabricId = fabricObj["FabricId"];
        let PhotoPath = "";
        fabricObj["FabricPhotos"].forEach(obj => {
            if (obj["PhotoTypeId"] === 4702)
                PhotoPath = obj["PhotoUrl"];
        });
        console.log(fabricObj);
        let PriceLevelEnTitle = fabricObj["PriceLevelEnTitle"];
        let PriceLevelTitle = fabricObj["PriceLevelTitle"];
        let PolyesterPercent = fabricObj["PolyesterPercent"] || 0;
        let ViscosePercent = fabricObj["ViscosePercent"] || 0;
        let NylonPercent = fabricObj["NylonPercent"] || 0;
        let ConttonPercent = fabricObj["ConttonPercent"] || 0;
        let LinenPercent = fabricObj["LinenPercent"] || 0;
        let ColorName = convertToPersian(fabricObj["ColorName"]);
        let ColorEnName = fabricObj["ColorEnName"];
        let SwatchId = fabricObj["SwatchId"] ? fabricObj["SwatchId"] : -1;
        
        const tempDiv = [];
        const tempDiv1 = [];
        tempDiv.push(
            <div key={PhotoPath} className="zoomImg">
                <div className="imageContainer">
                    <ReactImageMagnify
                        imageProps={{
                            alt: '',
                            // isFluidWidth: true,
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
            <div key={1} className="zoom_modal_header_container">
                <h1 className="zoom_modal_header_design">{pageLanguage === 'en' ? DesignEnName : DesignName} / {pageLanguage === 'en' ? ColorEnName : ColorName}</h1>
                <h1 className="zoom_modal_header_Price">{t("PRICE GROUP: ")}{pageLanguage === 'en' ? PriceLevelEnTitle : PriceLevelTitle}</h1>
                <div className="zoom_modal_header_Contents_container">
                    <h1 className="zoom_modal_header_Contents">{t("Contents")}</h1>
                    {PolyesterPercent > 0 && <p className="zoom_modal_header_Contents_item">{PolyesterPercent + "%"} {t("Polyester")}</p>}
                    {ViscosePercent > 0 && <p className="zoom_modal_header_Contents_item">{ViscosePercent + "%"} {t("Viscose")}</p>}
                    {NylonPercent > 0 && <p className="zoom_modal_header_Contents_item">{NylonPercent + "%"} {t("Nylon")}</p>}
                    {ConttonPercent > 0 && <p className="zoom_modal_header_Contents_item">{ConttonPercent + "%"} {t("Contton")}</p>}
                    {LinenPercent > 0 && <p className="zoom_modal_header_Contents_item">{LinenPercent + "%"} {t("Linen")}</p>}
                </div>
            </div>
        );
        
        setZoomModalBody(tempDiv);
        setZoomModalHeader(tempDiv1);
        setSwatchId(SwatchId);
        setSwatchDetailId(SwatchDetailId);
        setSwatchPhotoPath(PhotoPath);
        setShow(true);
    }
    
    function modalHandleClose(modalName) {
        let tempModals = [...modals];
        tempModals[modalName] = false;
        setModals(tempModals);
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
                //         window.scrollTo(window.scrollX, window.scrollY + 1);
                //     else
                //         window.scrollTo(window.screenX, window.scrollY - 1)
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
                {/*<div className="steps_header_selected_container">*/}
                {/*    <PopoverStickOnHover classNames="step_label_popover"*/}
                {/*                         placement="bottom"*/}
                {/*                         children={<div className="steps_header_selected"*/}
                {/*                                        ref={ref => (selectedTitle.current[stepNum] = ref)}>{showLabels ? stepSelected : null}</div>}*/}
                {/*                         component={*/}
                {/*                             <div className="step_label_popover_container">*/}
                {/*                                 <div className="steps_header_selected" ref={ref => (selectedTitle.current[stepNum] = ref)}>{showLabels ? stepSelected : null}</div>*/}
                {/*                             </div>*/}
                {/*                         }/>*/}
                {/*</div>*/}
                <div className="steps_header_selected_container">
                    <div className="steps_header_selected" ref={ref => (selectedTitle.current[stepNum] = ref)}>{showLabels ? stepSelected : null}</div>
                </div>
                {required && stepSelected === "" &&
                    <div className="stepRequired"/>
                }
            </div>
        );
    }
    
    function NextStep({children, eventKey, callback, onClick}) {
        const decoratedOnClick = useAccordionButton(
            eventKey,
            () => {
                callback && callback(eventKey);
                setAccordionActiveKey(eventKey);
                // setTimeout(() => {
                //     window.scrollTo(window.scrollX, window.scrollY + 1);
                // }, 500);
            },
        );
        return (
            <div className="nextStep_area" onClick={onClick}>
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
        setSearchText("");
        setSearchShow(false);
        
        setFilterColors([]);
        setFilterPatterns([]);
        setFilterTypes([]);
        setFilterPrices([]);
    }
    
    function clearFilters(e) {
        let refIndex = e.target.getAttribute('text');
        filterCheckboxes.current[refIndex].forEach(obj => {
            obj.checked = false;
        });
        
        if (e.target.getAttribute('text') === "colors") {
            setFilterColors([]);
        } else if (e.target.getAttribute('text') === "patterns") {
            setFilterPatterns([]);
        } else if (e.target.getAttribute('text') === "types") {
            setFilterTypes([]);
        } else {
            setFilterPrices([]);
        }
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
        // console.log(refIndex, selected, postfixEn, postfixFa, pageLang);
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
    
    function setBasketNumber(cart, refIndex, numValue, type, minusPlus) {
        // console.log(cart,refIndex, numValue, type, minusPlus);
        if (isLoggedIn) {
            let temp = JSON.parse(JSON.stringify(cart))["CartDetails"];
            let tempProjectContainer = temp.find(opt => opt["CartDetailId"] === refIndex);
            
            if (Object.keys(tempProjectContainer).length !== 0) {
                let tempProject = tempProjectContainer["SewingPreorder"];
                if (minusPlus !== undefined) {
                    if (tempProject["Count"] + minusPlus <= 0 || tempProject["Count"] + minusPlus > 10)
                        setBasketNumber(cart, refIndex, tempProject["Count"] + minusPlus, type);
                    else {
                        tempProject["Count"] = tempProject["Count"] + minusPlus;
                        editBasketProject(tempProject);
                    }
                } else {
                    if (numValue === "") {
                        tempProject["Count"] = 1;
                        editBasketProject(tempProject);
                    } else if (!isNaN(numValue) || numValue === 10 || numValue === "10") {
                        if (parseInt(numValue) > 10) {
                            tempProject["Count"] = 10;
                            editBasketProject(tempProject);
                            
                        } else if (parseInt(numValue) <= 0) {
                            deleteBasketProject(refIndex);
                        } else {
                            tempProject["Count"] = parseInt(numValue);
                            editBasketProject(tempProject);
                        }
                    }
                }
            }
        } else {
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
            if (temp.length > 0) {
                if (minusPlus !== undefined) {
                    if (temp[refIndex] === undefined) {
                        cartObj[typeString] = temp;
                        localStorage.setItem('cart', JSON.stringify(cartObj));
                        renderCart(cartObj);
                    } else {
                        if (temp[refIndex]["Count"] + minusPlus <= 0 || temp[refIndex]["Count"] + minusPlus > 10)
                            setBasketNumber(refIndex, temp[refIndex]["Count"] + minusPlus);
                        else {
                            temp[refIndex]["Count"] = temp[refIndex]["Count"] + minusPlus;
                            temp[refIndex]["PreorderText"]["WindowCount"] = temp[refIndex]["Count"];
                            cartObj[typeString] = temp;
                            localStorage.setItem('cart', JSON.stringify(cartObj));
                            renderCart(cartObj);
                        }
                    }
                } else {
                    if (!isNaN(numValue) || numValue === 10 || numValue === "10") {
                        if (numValue > 10) {
                            temp[refIndex]["Count"] = 10;
                            temp[refIndex]["PreorderText"]["WindowCount"] = temp[refIndex]["Count"];
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
                            temp[refIndex]["Count"] = numValue;
                            temp[refIndex]["PreorderText"]["WindowCount"] = temp[refIndex]["Count"];
                            cartObj[typeString] = temp;
                            localStorage.setItem('cart', JSON.stringify(cartObj));
                            renderCart(cartObj);
                        }
                    } else {
                        temp[refIndex]["Count"] = 1;
                        temp[refIndex]["PreorderText"]["WindowCount"] = temp[refIndex]["Count"];
                        cartObj[typeString] = temp;
                        localStorage.setItem('cart', JSON.stringify(cartObj));
                        renderCart(cartObj);
                    }
                }
            }
        }
    }
    
    
    function editBasketProject(projectObj) {
        projectObj["PreorderText"]["WindowCount"] = projectObj["Count"];
        axios.post(baseURLEditProject, projectObj, {
            headers: authHeader()
        })
            .then(() => {
                renderCart();
            }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        editBasketProject(projectObj);
                    } else {
                        navigate("/" + pageLanguage);
                    }
                });
            }
        });
    }
    
    function deleteBasketProject(refIndex) {
        draperyRef.current[refIndex].className = "custom_cart_item is_loading";
        axios.delete(baseURLDeleteBasketProject, {
            params: {
                detailId: refIndex
            },
            headers: authHeader()
        }).then((response) => {
            if (draperyRef.current[refIndex]) {
                draperyRef.current[refIndex].className = "custom_cart_item";
            }
            renderCart();
        }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        deleteBasketProject(refIndex);
                    } else {
                        navigate("/" + pageLanguage);
                    }
                });
            } else {
                if (draperyRef.current[refIndex]) {
                    draperyRef.current[refIndex].className = "custom_cart_item";
                }
            }
        });
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
        // console.log(temp,refIndex,cartValue);
        // console.log(refIndex, cartValue);
        // setTimeout(() => {
        // console.log(temp);
        // }, 1000);
        let tempPostObj = {};
        tempPostObj["WindowCount"] = 1;
        tempPostObj["SewingModelId"] = `${modelID}`;
        
        let userProjects = JSON.parse(JSON.stringify(UserProjects))[`${modelID}`]["data"];
        
        Object.keys(temp).forEach(key => {
            if (temp[key] !== null || temp[key] !== "") {
                let tempObj = userProjects.find(obj => obj["cart"] === key);
                if (tempObj === undefined) {
                    console.log(key);
                    // window.location.reload();
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
                let tempObj = userProjects.find(obj => obj["cart"] === key);
                // console.log(key,userProjects.find(obj => obj["cart"] === key));
                if (tempObj) {
                    if (tempObj["apiLabel2"] !== undefined) {
                        if (tempObj["apiValue2"] === null) {
                            tempPostObj["SewingOrderDetails"][0][tempObj["apiLabel2"]] = temp[key];
                        } else {
                            tempPostObj["SewingOrderDetails"][0][tempObj["apiLabel2"]] = tempObj["apiValue2"][temp[key]];
                        }
                    }
                }
            }
        });
        tempPostObj["SewingOrderDetails"][0]["Accessories"] = [];
        Object.keys(temp).forEach(key => {
            if (temp[key] !== null || temp[key] !== "") {
                let tempObj = userProjects.find(obj => obj["cart"] === key);
                if (tempObj) {
                    if (tempObj["apiAcc"] !== undefined) {
                        if (tempObj["apiAcc"] === true) {
                            tempPostObj["SewingOrderDetails"][0]["Accessories"].push(tempObj["apiAccValue"][temp[key]]);
                        } else {
                        
                        }
                    }
                }
            }
        });
        tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
            return el != null;
        });
        
        tempPostObj["SewingOrderDetails"][0]["SodFabrics"] = JSON.parse(JSON.stringify(sodFabrics));
        
        let promise2 = new Promise((resolve, reject) => {
            if (stepSelectedValue["2"] !== undefined) {
                if (!dkCurtainArrComplete) {
                    delete tempPostObj["SewingOrderDetails"];
                }
                // if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined && stepSelectedValue["2"] !== undefined && stepSelectedValue["3"] !== undefined) {
                // console.log(JSON.stringify(tempPostObj));
                axios.post(baseURLPrice, tempPostObj)
                    .then((response) => {
                        setPrice(response.data["price"]);
                        
                        // console.log("1");
                        
                        // setCart("HeightCart", totalHeight, "", "WidthCart", [totalWidth]);
                        if (stepSelectedValue["1"] === "1" && stepSelectedValue["2"] === "2") {
                            if (temp["Width1"] !== undefined && temp["Width2"] !== undefined && temp["Width3"] !== undefined && temp["Height1"] !== undefined && temp["Height2"] !== undefined && temp["Height3"] !== undefined) {
                                // console.log("2");
                                getWindowSize(response.data["Width"], response.data["Height"]);
                                temp["WidthCart"] = response.data["Width"];
                                temp["HeightCart"] = response.data["Height"];
                                
                            }
                        } else if (stepSelectedValue["1"] === "2" && stepSelectedValue["2"] === "2") {
                            if (temp["Width3A"] !== undefined && temp["Height3C"] !== undefined && temp["ExtensionRight"] !== undefined && temp["ExtensionLeft"] !== undefined && temp["ShadeMount"] !== undefined) {
                                getWindowSize(response.data["Width"], response.data["Height"]);
                                temp["WidthCart"] = response.data["Width"];
                                temp["HeightCart"] = response.data["Height"];
                                // console.log("3");
                            }
                        } else {
                            getWindowSize(response.data["Width"], response.data["Height"]);
                            temp["WidthCart"] = response.data["Width"];
                            temp["HeightCart"] = response.data["Height"];
                            // console.log("4");
                        }
                        resolve();
                    }).catch(err => {
                    setPrice(0);
                    if (temp["HeightCart"] !== undefined)
                        delete temp["HeightCart"];
                    if (temp["WidthCart"] !== undefined)
                        delete temp["WidthCart"];
                    resolve();
                    // console.log(err);
                });
            } else {
                resolve();
            }
        });
        promise2.then(() => {
            setCartValues(temp);
        });
    }
    
    function measureWindowSize() {
        
        let promise2 = new Promise((resolve, reject) => {
            let temp = JSON.parse(JSON.stringify(cartValues));
            let tempPostObj = {};
            tempPostObj["WindowCount"] = 1;
            tempPostObj["SewingModelId"] = `${modelID}`;
            
            let userProjects = JSON.parse(JSON.stringify(UserProjects))[`${modelID}`]["data"];
            
            Object.keys(temp).forEach(key => {
                if (temp[key] !== null || temp[key] !== "") {
                    let tempObj = userProjects.find(obj => obj["cart"] === key);
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
                    let tempObj = userProjects.find(obj => obj["cart"] === key);
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
                    let tempObj = userProjects.find(obj => obj["cart"] === key);
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
            
            if (stepSelectedValue["3"] !== undefined) {
                if (tempPostObj["SewingOrderDetails"][0]["FabricId"] === undefined) {
                    delete tempPostObj["SewingOrderDetails"];
                }
                // if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined && stepSelectedValue["2"] !== undefined && stepSelectedValue["3"] !== undefined) {
                // console.log(JSON.stringify(tempPostObj));
                axios.post(baseURLPrice, tempPostObj)
                    .then((response) => {
                        setPrice(response.data["price"]);
                        
                        // setCart("HeightCart", totalHeight, "", "WidthCart", [totalWidth]);
                        getWindowSize(response.data["Width"], response.data["Height"]);
                        temp["WidthCart"] = response.data["Width"];
                        temp["HeightCart"] = response.data["Height"];
                        setCartValues(temp);
                        setTimeout(() => {
                            resolve();
                        }, 1000);
                    }).catch(err => {
                    setPrice(0);
                    if (temp["HeightCart"] !== undefined)
                        delete temp["HeightCart"];
                    if (temp["WidthCart"] !== undefined)
                        delete temp["WidthCart"];
                    // console.log(err);
                    setCartValues(temp);
                    setTimeout(() => {
                        reject();
                    }, 1000);
                });
            } else {
                reject();
            }
            
        });
        promise2.then(() => {
            return true;
        }).catch(() => {
            return false;
        });
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
        });
        
        if (tempNewSet.size > 0) {
            setAddingLoading(false);
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
        } else if (cartValues["HeightCart"] === undefined || cartValues["WidthCart"] === undefined) {
            // console.log(cartValues);
            if (measureWindowSize()) {
                addToCart();
            } else {
                setAddingLoading(false);
            }
        } else {
            // console.log(cartValues,"hi");
            let userProjects = JSON.parse(JSON.stringify(UserProjects))[`${modelID}`]["data"];
            let tempArr = [];
            let temp1 = [];
            let temp = JSON.parse(JSON.stringify(cartValues));
            let tempPostObj = {};
            let tempBagPrice = 0;
            
            
            // tempPostObj["ApiKey"] = window.$apikey;
            tempPostObj["WindowCount"] = 1;
            tempPostObj["SewingModelId"] = `${modelID}`;
            Object.keys(temp).forEach(key => {
                if (temp[key] !== null || temp[key] !== "") {
                    let tempObj = userProjects.find(obj => obj["cart"] === key);
                    // console.log(key,tempObj);
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
                    let tempObj = userProjects.find(obj => obj["cart"] === key);
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
                    let tempObj = userProjects.find(obj => obj["cart"] === key);
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
                            let tempObj = userProjects.find(obj => obj["cart"] === key);
                            if (tempObj === undefined) {
                                window.location.reload();
                            } else {
                                if (key === "HeightCart" || key === "WidthCart") {
                                
                                } else if (tempObj["title"] !== "" && tempObj["lang"].indexOf(pageLanguage) > -1) {
                                    let objLabel = "";
                                    if (tempObj["titleValue"] === null || true) {
                                        if (tempObj["titlePostfix"] === "") {
                                            objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${t(cartValues[key].toString())}`).toString() : t(cartValues[key].toString());
                                        } else {
                                            objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${cartValues[key]}`).toString() + t(tempObj["titlePostfix"]) : cartValues[key].toString() + t(tempObj["titlePostfix"]);
                                        }
                                        // objLabel = cartValues[key].toString() + tempObj["titlePostfix"];
                                    } else {
                                        // console.log(tempObj["titleValue"],tempObj["titleValue"][cartValues[key].toString()],cartValues[key]);
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
                                <h2 className="cart_agree_title">{pageLanguage === 'fa' ? defaultModelNameFa + " سفارشی " : "Custom " + defaultModelName}</h2>
                                <ul className="cart_agree_items_container">
                                    <GetMeasurementArray modelId={`${modelID}`} cartValues={cartValues}/>
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
                        setAddingLoading(false);
                        
                    }).catch(err => {
                    if (err.response.status === 401) {
                        refreshToken().then((response2) => {
                            if (response2 !== false) {
                                addToCart();
                            } else {
                                setPrice(0);
                                setBagPrice(0);
                                temp["price"] = 0;
                                setCartValues(temp);
                                setAddingLoading(false);
                                navigate("/" + pageLanguage + "/User");
                            }
                        });
                    } else {
                        setPrice(0);
                        setBagPrice(0);
                        temp["price"] = 0;
                        setCartValues(temp);
                        setAddingLoading(false);
                    }
                    
                });
            } else {
                setAddingLoading(false);
            }
            // console.log(cartValues);
        }
        // modalHandleShow("cart_modal");
        // renderCart();
        // setCartStateAgree(true);
        
    }
    
    function addToCart_agreed() {
        AddProjectToCart(cartValues, `${modelID}`, price, defaultModelName, defaultModelNameFa, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], (projectId && projectId !== "") ? projectId : cartProjectIndex, editIndex, navigate, isLoggedIn).then((temp) => {
            if (temp === 401) {
                addToCart_agreed();
            } else if (temp) {
                setCartAgreeDescription(false);
                renderCart(temp);
                setTimeout(() => {
                    // modalHandleShow("cart_modal");
                    setCartStateAgree(true);
                }, 500);
                setAddingLoading(false);
            } else {
                setAddingLoading(false);
                setCartAgreeDescription(false);
            }
        }).catch(() => {
            setAddingLoading(false);
            setCartAgreeDescription(false);
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
                                    navigate("/" + pageLanguage + "/User");
                                }
                            });
                        } else {
                            modalHandleClose("cart_modal");
                            reject();
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
            let temp1 = [];
            let cartCount = 0;
            if (isLoggedIn) {
                cartCount += cartObjects["CartDetails"].length;
                let totalPrice = cartObjects["TotalAmount"];
                
                let draperies = cartObjects["CartDetails"].filter((object1) => {
                    return object1["SewingPreorderId"] !== null;
                });
                
                let swatches = cartObjects["CartDetails"].filter((object1) => {
                    return object1["ProductId"] !== null;
                });
                
                let promise1 = new Promise((resolve, reject) => {
                    if (draperies.length) {
                        for (let i = 0; i < draperies.length; i++) {
                            let obj = draperies[i]["SewingPreorder"]["PreorderText"];
                            let roomName = (obj["WindowName"] === undefined || obj["WindowName"] === "") ? "" : " / " + obj["WindowName"];
                            temp1[i] =
                                <li className="custom_cart_item" key={"drapery" + i} ref={ref => (draperyRef.current[draperies[i]["CartDetailId"]] = ref)}>
                                    <div className="custom_cart_item_image_container">
                                        <img src={`https://api.atlaspood.ir/${obj["PhotoUrl"]}`} alt="" className="custom_cart_item_img img-fluid"/>
                                    </div>
                                    <div className="custom_cart_item_desc">
                                        <div className="custom_cart_item_desc_container">
                                            <h1 className="custom_cart_item_desc_name">{pageLanguage === 'fa' ? obj["ModelNameFa"] + " سفارشی " : "Custom " + obj["ModelNameEn"]}</h1>
                                            <button type="button" className="btn-close" aria-label="Close"
                                                    onClick={() => setBasketNumber(cartObjects, draperies[i]["CartDetailId"], 0, 0)}/>
                                        </div>
                                        <div className="custom_cart_item_desc_container">
                                            <h2 className="custom_cart_item_desc_detail">{pageLanguage === 'fa' ? obj["FabricDesignFa"] + " / " + obj["FabricColorFa"] : obj["FabricDesignEn"] + " / " + obj["FabricColorEn"]}</h2>
                                        </div>
                                        <div className="custom_cart_item_desc_container">
                                            <h2 className="custom_cart_item_desc_detail">{pageLanguage === 'fa' ? obj["RoomNameFa"] + roomName : obj["RoomNameEn"] + roomName}</h2>
                                        </div>
                                        <div className="custom_cart_item_desc_container">
                                            <div className="custom_cart_item_desc_qty">
                                                <button type="text" className="basket_qty_minus"
                                                        onClick={() => setBasketNumber(cartObjects, draperies[i]["CartDetailId"], 0, 0, -1)}>–
                                                </button>
                                                <input type="text" className="basket_qty_num"
                                                       value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${draperies[i]["SewingPreorder"]["Count"]}`) : draperies[i]["SewingPreorder"]["Count"]}
                                                       onChange={(e) => setBasketNumber(cartObjects, draperies[i]["CartDetailId"], NumberToPersianWord.convertPeToEn(`${e.target.value}`))}/>
                                                <button type="text" className="basket_qty_plus"
                                                        onClick={() => setBasketNumber(cartObjects, draperies[i]["CartDetailId"], 0, 0, 1)}>+
                                                </button>
                                            </div>
                                            <p className="custom_cart_item_end_price">{GetPrice(obj["price"], pageLanguage, t("TOMANS"))}</p>
                                        </div>
                                    </div>
                                </li>;
                            if (i === draperies.length - 1) {
                                resolve();
                            }
                        }
                    } else {
                        resolve();
                    }
                });
                
                let promise2 = new Promise((resolve, reject) => {
                    if (swatches.length) {
                        for (let i = 0; i < swatches.length; i++) {
                            let obj = swatches[i];
                            temp1[i + draperies.length] =
                                <li className="custom_cart_item" key={"swatches" + i} ref={ref => (draperyRef.current[swatches[i]["CartDetailId"]] = ref)}>
                                    <div className="custom_cart_item_image_container">
                                        <img src={`https://api.atlaspood.ir/${obj["PhotoUrl"]}`} alt="" className="custom_cart_item_img img-fluid"/>
                                    </div>
                                    <div className="custom_cart_item_desc">
                                        <div className="custom_cart_item_desc_container">
                                            <h1 className="custom_cart_item_desc_name">{pageLanguage === 'fa' ? obj["ProductName"] : obj["ProductEnName"]}</h1>
                                            <button type="button" className="btn-close" aria-label="Close"
                                                    onClick={() => setBasketNumber(cartObjects, swatches[i]["CartDetailId"], 0, 0)}/>
                                        </div>
                                        <div className="custom_cart_item_desc_container">
                                            <h2 className="custom_cart_item_desc_detail"/>
                                        </div>
                                        <div className="custom_cart_item_desc_container">
                                            <h2 className="custom_cart_item_desc_detail"/>
                                        </div>
                                        <div className="custom_cart_item_desc_container">
                                            <div className="custom_cart_item_desc_qty">
                                                <button type="text" className="basket_qty_minus"
                                                        onClick={() => setBasketNumber(cartObjects, swatches[i]["CartDetailId"], 0, 0, -1)}>–
                                                </button>
                                                <input type="text" className="basket_qty_num"
                                                       value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${swatches[i]["Count"]}`) : swatches[i]["Count"]}
                                                       onChange={(e) => setBasketNumber(cartObjects, swatches[i]["CartDetailId"], NumberToPersianWord.convertPeToEn(`${e.target.value}`))}/>
                                                <button type="text" className="basket_qty_plus"
                                                        onClick={() => setBasketNumber(cartObjects, swatches[i]["CartDetailId"], 0, 0, 1)}>+
                                                </button>
                                            </div>
                                            <p className="custom_cart_item_end_price">{GetPrice(obj["UnitPrice"], pageLanguage, t("TOMANS"))}</p>
                                        </div>
                                    </div>
                                </li>;
                            if (i === swatches.length - 1) {
                                resolve();
                            }
                        }
                    } else {
                        resolve();
                    }
                });
                Promise.all([promise1, promise2]).then(() => {
                    setCartItems(temp1);
                    setCartCount(cartCount);
                    localStorage.removeItem("cart");
                    setTotalCartPrice(totalPrice);
                });
                if (cartObjects["CartDetails"].length === 0) {
                    modalHandleClose("cart_modal");
                    setCartStateAgree(false);
                }
            } else {
                let promiseArr = [];
                let totalPrice = 0;
                let draperiesTotalPrice = 0;
                let swatchesTotalPrice = 0;
                if (cartObjects["drapery"].length) {
                    promiseArr[0] = new Promise((resolve, reject) => {
                        cartCount += cartObjects["drapery"].length;
                        let promiseArr2 = [];
                        
                        cartObjects["drapery"].forEach((obj, index) => {
                            promiseArr2[index] = new Promise((resolve, reject) => {
                                let tempPostObj = {};
                                // tempPostObj["ApiKey"] = window.$apikey;
                                if (obj["PreorderText"] === undefined) {
                                    localStorage.removeItem("cart");
                                } else {
                                    let userProjects = JSON.parse(JSON.stringify(UserProjects))[obj["PreorderText"]["SewingModelId"]]["data"];
                                    // let temp = obj["PreorderText"];
                                    GetUserProjectData(obj).then((temp) => {
                                        tempPostObj["WindowCount"] = 1;
                                        tempPostObj["SewingModelId"] = `${modelID}`;
                                        Object.keys(temp).forEach(key => {
                                            if (temp[key] !== null || temp[key] !== "") {
                                                let tempObj = userProjects.find(obj => obj["cart"] === key);
                                                // console.log(key,tempObj);
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
                                                let tempObj = userProjects.find(obj => obj["cart"] === key);
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
                                                let tempObj = userProjects.find(obj => obj["cart"] === key);
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
                                        
                                        // delete tempPostObj["SewingOrderDetails"][0]["SewingModelId"];
                                        // delete tempPostObj["SewingModelId"];
                                        tempPostObj["SewingModelId"] = tempPostObj["SewingOrderDetails"][0]["SewingModelId"];
                                        
                                        if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined) {
                                            axios.post(baseURLPrice, tempPostObj).then((response) => {
                                                resolve(response);
                                            }).catch(err => {
                                                resolve(false);
                                                // console.log("hi2");
                                            });
                                        } else {
                                            // console.log("hi3");
                                            resolve(false);
                                        }
                                    }).catch(err => {
                                        // console.log("hi3");
                                        resolve(false);
                                    });
                                }
                            });
                        });
                        Promise.all(promiseArr2).then(function (values) {
                            // console.log(values);
                            cartObjects["drapery"].forEach((obj1, index) => {
                                let obj = obj1["PreorderText"];
                                obj["price"] = values[index].data["price"] / obj1["Count"];
                                obj1["price"] = values[index].data["price"] / obj1["Count"];
                                draperiesTotalPrice += values[index].data["price"];
                                let roomName = (obj["WindowName"] === undefined || obj["WindowName"] === "") ? "" : " / " + obj["WindowName"];
                                temp1[index] =
                                    <li className="custom_cart_item" key={"drapery" + index} ref={ref => (draperyRef.current[index] = ref)}>
                                        <div className="custom_cart_item_image_container">
                                            <img src={`https://api.atlaspood.ir/${obj["PhotoUrl"]}`} alt="" className="custom_cart_item_img img-fluid"/>
                                        </div>
                                        <div className="custom_cart_item_desc">
                                            <div className="custom_cart_item_desc_container">
                                                <h1 className="custom_cart_item_desc_name">{pageLanguage === 'fa' ? obj["ModelNameFa"] + " سفارشی " : "Custom " + obj["ModelNameEn"]}</h1>
                                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setBasketNumber(undefined, index, 0, 0)}/>
                                            </div>
                                            <div className="custom_cart_item_desc_container">
                                                <h2 className="custom_cart_item_desc_detail">{pageLanguage === 'fa' ? obj["FabricDesignFa"] + " / " + obj["FabricColorFa"] : obj["FabricDesignEn"] + " / " + obj["FabricColorEn"]}</h2>
                                            </div>
                                            <div className="custom_cart_item_desc_container">
                                                <h2 className="custom_cart_item_desc_detail">{pageLanguage === 'fa' ? obj["RoomNameFa"] + roomName : obj["RoomNameEn"] + roomName}</h2>
                                            </div>
                                            <div className="custom_cart_item_desc_container">
                                                <div className="custom_cart_item_desc_qty">
                                                    <button type="text" className="basket_qty_minus" onClick={() => setBasketNumber(undefined, index, 0, 0, -1)}>–</button>
                                                    <input type="text" className="basket_qty_num"
                                                           value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj1["Count"]}`) : obj1["Count"]}
                                                           onChange={(e) => setBasketNumber(undefined, index, NumberToPersianWord.convertPeToEn(`${e.target.value}`), 0)}/>
                                                    <button type="text" className="basket_qty_plus" onClick={() => setBasketNumber(undefined, index, 0, 0, 1)}>+</button>
                                                </div>
                                                <p className="custom_cart_item_end_price">{GetPrice(obj1["price"] * obj1["Count"], pageLanguage, t("TOMANS"))}</p>
                                            </div>
                                        </div>
                                    </li>;
                                if (index === cartObjects["drapery"].length - 1) {
                                    resolve();
                                }
                            });
                        }).catch(err => {
                            console.log(err);
                            resolve();
                        });
                    });
                }
                Promise.all(promiseArr).then(() => {
                    setCartItems(temp1);
                    setCartCount(cartCount);
                    localStorage.setItem('cart', JSON.stringify(cartObjects));
                    setTotalCartPrice(draperiesTotalPrice + swatchesTotalPrice);
                });
                
                if (cartObjects["drapery"].length + cartObjects["product"].length + cartObjects["swatches"].length === 0) {
                    setCartCount(0);
                    modalHandleClose("cart_modal");
                    setCartStateAgree(false);
                }
            }
            
        });
        axios.get(baseURLFreeShipping).then((response) => {
            setFreeShipPrice(response.data);
        }).catch(err => {
            console.log(err);
        });
    }
    
    function fabricClicked(photo, hasTrim) {
        setDefaultFabricPhoto(photo);
        setHasTrim(hasTrim);
        // console.log(hasTrim)
    }
    
    function fabricSwatch(e, SwatchId, SwatchDetailId, PhotoPath) {
        let currentState = e.target.getAttribute('current-state');
        let cartObj = {};
        let temp = [];
        if (isLoggedIn) {
            if (currentState === "0") {
                axios.post(baseURLAddSwatch, {}, {
                    headers: authHeader(),
                    params: {
                        productId: SwatchId,
                        count: 1
                    }
                }).then((response) => {
                    setBag(response.data);
                    renderFabrics(response.data);
                    if (show) {
                        if (response.data["CartDetails"]) {
                            let index = response.data["CartDetails"].findIndex(object => {
                                return object["ProductId"] === SwatchId;
                            });
                            if (index !== -1) {
                                setSwatchDetailId(response.data["CartDetails"][index]["CartDetailId"]);
                            }
                        }
                    }
                }).catch(err => {
                    if (err.response.status === 401) {
                        refreshToken().then((response2) => {
                            if (response2 !== false) {
                                fabricSwatch(e, SwatchId, SwatchDetailId);
                            } else {
                                fabricSwatch(e, SwatchId, SwatchDetailId);
                            }
                        });
                    } else {
                    }
                });
            } else {
                if (SwatchDetailId) {
                    axios.delete(baseURLDeleteBasketProject, {
                        params: {
                            detailId: SwatchDetailId
                        },
                        headers: authHeader()
                    }).then((response) => {
                        setCartChanged(cartChanged + 1);
                    }).catch(err => {
                        if (err.response.status === 401) {
                            refreshToken().then((response2) => {
                                if (response2 !== false) {
                                    fabricSwatch(e, SwatchId, SwatchDetailId);
                                } else {
                                    fabricSwatch(e, SwatchId, SwatchDetailId);
                                }
                            });
                        } else {
                        }
                    });
                }
            }
            if (show) {
                if (currentState === "0") {
                    setHasSwatchId(true);
                } else {
                    setHasSwatchId(false);
                }
            }
            
        } else {
            setSwatchLogin(true);
            modalHandleShow("side_login_modal");
            // dispatch({
            //     type: ShowLoginModal,
            // })
            // if (localStorage.getItem("cart") !== null) {
            //     cartObj = JSON.parse(localStorage.getItem("cart"));
            //     temp = cartObj["swatches"];
            // } else {
            //     cartObj["drapery"] = [];
            //     cartObj["product"] = [];
            //     cartObj["swatches"] = [];
            // }
            // if (currentState === "0") {
            //     temp.push({"SwatchId": SwatchId, "Count": 1,"PhotoPath":PhotoPath});
            // } else {
            //     if (temp.length > 0) {
            //         let index = temp.findIndex(object => {
            //             return object["SwatchId"] === SwatchId;
            //         });
            //         if (index !== -1) {
            //             temp.splice(index, 1);
            //         }
            //     }
            // }
            // cartObj["swatches"] = temp;
            // localStorage.setItem('cart', JSON.stringify(cartObj));
            // setCartChanged(cartChanged + 1);
        }
        
    }
    
    function getWindowSize(totalWidth, totalHeight) {
        let tempWindowSize = pageLanguage === "fa" ? `عرض: ${NumberToPersianWord.convertEnToPe(totalWidth.toString())}س\u200Cم\u00A0\u00A0\u00A0ارتفاع: ${NumberToPersianWord.convertEnToPe(totalHeight.toString())}س\u200Cم` : `Width: ${totalWidth}cm\u00A0\u00A0\u00A0Height: ${totalHeight}cm`;
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
    
    function uploadImg(file) {
        setSelectedFile(file);
        setSelectedFileName(file.name);
    }
    
    function submitUploadedFile(PDFOrImg) {
        setIsUploading(true);
        let extensionSearch = /(?:\.([^.]+))?$/;
        let extension = extensionSearch.exec(selectedFile.name)[1];
        let newFile = new File([selectedFile], editedFileName === "" ? selectedFile.name : editedFileName + "." + extension, {type: `${selectedFile.type}`});
        
        // console.log(selectedFile,newFile,editedFileName,selectedFile.name);
        if (PDFOrImg === 1) {
            const formData = new FormData();
            formData.append("File", newFile);
            formData.append("UserFileName", newFile.name);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                    ...authHeader()
                }
            };
            axios.post(baseURLUploadPdf, formData, config)
                .then((response) => {
                    setIsUploading(false);
                    // console.log(response.data);
                    addUploadFileUrl(response.data, newFile.name, PDFOrImg, newFile);
                    setSelectedFile(undefined);
                    setSelectedFileName("");
                    setEditedFileName("");
                    modalHandleClose("uploadPdf");
                    setDetailsShow(false);
                }).catch(err => {
                if (err.response.status === 401) {
                    refreshToken().then((response2) => {
                        if (response2 !== false) {
                            submitUploadedFile(PDFOrImg);
                        } else {
                            setIsUploading(false);
                            setSelectedFile(undefined);
                            setSelectedFileName("");
                            setEditedFileName("");
                            modalHandleClose("uploadPdf");
                            setDetailsShow(false);
                            
                            dispatch({
                                type: ShowLogin2Modal,
                            });
                        }
                    });
                } else {
                    setIsUploading(false);
                    console.log("not uploaded")
                }
            });
        } else {
            const formData = new FormData();
            formData.append("File", newFile);
            formData.append("UserFileName", newFile.name);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                    ...authHeader()
                }
            };
            axios.post(baseURLUploadImg, formData, config)
                .then((response) => {
                    // console.log(response.data);
                    setIsUploading(false);
                    addUploadFileUrl(response.data, newFile.name, PDFOrImg, newFile);
                    setSelectedFile(undefined);
                    setSelectedFileName("");
                    setEditedFileName("");
                    modalHandleClose(" uploadImg");
                    setDetailsShow(false);
                }).catch(err => {
                if (err.response.status === 401) {
                    refreshToken().then((response2) => {
                        if (response2 !== false) {
                            submitUploadedFile(PDFOrImg);
                        } else {
                            setIsUploading(false);
                            setSelectedFile(undefined);
                            setSelectedFileName("");
                            setEditedFileName("");
                            modalHandleClose(" uploadImg");
                            setDetailsShow(false);
                            
                            dispatch({
                                type: ShowLogin2Modal,
                            });
                        }
                    });
                } else {
                    setIsUploading(false);
                    console.log("not uploaded")
                }
            });
        }
    }
    
    function addUploadFileUrl(fileUrl, imageName, PDFOrImg, newFile) {
        if (fileUrl) {
            if (PDFOrImg === 1) {
                let tempArrayNames = [...uploadedPDFNameList];
                let tempArrayFiles = [...uploadedPDFFile];
                let tempArrayURLs = [...uploadedPDFURL];
                let freeIndex = tempArrayNames.findIndex(Object.is.bind(null, undefined));
                if (freeIndex === -1) {
                    freeIndex = tempArrayNames.length;
                }
                tempArrayNames[freeIndex] = <li className="uploaded_name_item" key={freeIndex}>
                    <i className="fa fa-file"/>
                    <span className="uploaded_name_item_text">{imageName.replace(/\.[^/.]+$/, "")}</span>
                    <span className="uploaded_name_item_x" onClick={() => {
                        setDeleteUploaded(fileUrl, freeIndex, PDFOrImg);
                    }}>X</span>
                </li>;
                
                tempArrayFiles[freeIndex] = newFile.name;
                tempArrayURLs[freeIndex] = fileUrl;
                
                setUploadedPDFURL(tempArrayURLs);
                setUploadedPDFFile(tempArrayFiles);
                setUploadedPDFNameList(tempArrayNames);
            } else {
                let tempArray = uploadedImagesList;
                let freeIndex = tempArray.findIndex(Object.is.bind(null, undefined));
                if (freeIndex === -1) {
                    freeIndex = tempArray.length;
                }
                tempArray[freeIndex] = <li className="uploaded_image_item" key={freeIndex}>
                    <img src={`https://api.atlaspood.ir/${fileUrl}`} className="img-fluid" alt=""/>
                </li>;
                setUploadedImagesList(tempArray);
                
                let tempArrayNames = [...uploadedImagesNamesList];
                let tempArrayFiles = [...uploadedImagesFile];
                let tempArrayURLs = [...uploadedImagesURL];
                tempArrayNames[freeIndex] = <li className="uploaded_name_item" key={freeIndex}>
                    <i className="fa fa-file"/>
                    <span className="uploaded_name_item_text">{imageName.replace(/\.[^/.]+$/, "")}</span>
                    <span className="uploaded_name_item_x" onClick={() => {
                        setDeleteUploaded(fileUrl, freeIndex, PDFOrImg);
                    }}>X</span>
                </li>;
                tempArrayFiles[freeIndex] = newFile.name;
                tempArrayURLs[freeIndex] = fileUrl;
                
                setUploadedImagesURL(tempArrayURLs);
                setUploadedImagesFile(tempArrayFiles);
                setUploadedImagesNamesList(tempArrayNames);
            }
        }
        
        /* test */
        else {
            let tempArray = [...uploadedImagesList];
            let freeIndex = tempArray.findIndex(Object.is.bind(null, undefined));
            if (freeIndex === -1) {
                freeIndex = tempArray.length;
            }
            // console.log(freeIndex);
            tempArray[freeIndex] = <li className="uploaded_image_item" key={freeIndex}>
                <img src={`https://api.atlaspood.ir/${defaultFabricPhoto}`} className="img-fluid" alt=""/>
            </li>;
            // console.log(tempArray);
            setUploadedImagesList(tempArray);
            
            
            let tempArrayNames = [...uploadedImagesNamesList];
            tempArrayNames[freeIndex] = <li className="uploaded_name_item" key={freeIndex}>
                <i className="fa fa-file"/>
                <span className="uploaded_name_item_text">{imageName.replace(/\.[^/.]+$/, "")}</span>
                <span className="uploaded_name_item_x" onClick={() => {
                    setDeleteUploaded(fileUrl, freeIndex, PDFOrImg);
                }}>X</span>
            </li>;
            setUploadedImagesNamesList(tempArrayNames);
        }
    }
    
    function setDeleteUploaded(fileUrl, freeIndex, PDFOrImg) {
        // console.log(fileUrl, freeIndex, PDFOrImg);
        
        if (PDFOrImg === 1) {
            setDeleteUploadPdfUrl(fileUrl);
            setDeleteUploadPdfIndex(freeIndex);
        } else {
            setDeleteUploadImageUrl(fileUrl);
            setDeleteUploadImageIndex(freeIndex);
        }
    }
    
    function deleteUploadedImg(uploadedImagesList1, uploadedImagesNamesList1, fileUrl, index) {
        let promise2 = new Promise((resolve, reject) => {
            if (fileUrl !== "") {
                axios.delete(baseURLDeleteFile, {
                    params: {
                        url: fileUrl
                    },
                    headers: authHeader()
                }).then((response) => {
                    resolve();
                }).catch(err => {
                    if (err.response.status === 401) {
                        refreshToken().then((response2) => {
                            if (response2 !== false) {
                                deleteUploadedImg(uploadedImagesList1, uploadedImagesNamesList1, fileUrl, index);
                                reject();
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
        promise2.then(() => {
            let tempArray = [...uploadedImagesList1];
            let tempArrayNames = [...uploadedImagesNamesList1];
            let tempArrayFiles = [...uploadedImagesFile];
            let tempArrayURLs = [...uploadedImagesURL];
            
            delete tempArray[index];
            delete tempArrayNames[index];
            delete tempArrayFiles[index];
            delete tempArrayURLs[index];
            
            setUploadedImagesURL(tempArrayURLs);
            setUploadedImagesFile(tempArrayFiles);
            setUploadedImagesList(tempArray);
            setUploadedImagesNamesList(tempArrayNames);
            setDeleteUploadImageUrl("");
            setDeleteUploadImageIndex(-1);
        });
    }
    
    function deleteUploadedPdf(uploadedPdfsNamesList1, fileUrl, index) {
        let promise2 = new Promise((resolve, reject) => {
            if (fileUrl !== "") {
                axios.delete(baseURLDeleteFile, {
                    params: {
                        url: fileUrl
                    },
                    headers: authHeader()
                }).then((response) => {
                    resolve();
                }).catch(err => {
                    if (err.response.status === 401) {
                        refreshToken().then((response2) => {
                            if (response2 !== false) {
                                deleteUploadedPdf(uploadedPdfsNamesList1, fileUrl, index);
                                reject();
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
        promise2.then(() => {
            let tempArrayNames = [...uploadedPdfsNamesList1];
            let tempArrayFiles = [...uploadedPDFFile];
            let tempArrayURLs = [...uploadedPDFURL];
            
            delete tempArrayNames[index];
            delete tempArrayFiles[index];
            delete tempArrayURLs[index];
            
            setUploadedPDFURL(tempArrayURLs);
            setUploadedPDFFile(tempArrayFiles);
            setUploadedPDFNameList(tempArrayNames);
            setDeleteUploadImageUrl("");
            setDeleteUploadImageIndex(-1);
        });
    }
    
    function curtainChanged(refIndex) {
        if (refIndex !== -1 && cartValues["WidthCart"] !== undefined) {
            let tempArr = JSON.parse(JSON.stringify(dkCurtainArr));
            let count = Math.floor(cartValues["WidthCart"] / 11.5);
            tempArr=tempArr.slice(0, count);
            let fabricObject = {};
            
            let promiseArr = [];
            Object.keys(fabrics).forEach((key, index) => {
                promiseArr[index] = new Promise((resolve, reject) => {
                    fabricObject = fabrics[key].filter(obj => {
                        return obj["FabricId"] === step3
                    })[0] || fabricObject;
                    resolve();
                });
            });
            
            Promise.all(promiseArr).then(() => {
                if (symmetric) {
                    tempArr[refIndex] = fabricObject;
                    tempArr[count - refIndex - 1] = fabricObject;
                } else {
                    tempArr[refIndex] = fabricObject;
                }
                setDkCurtainArr(tempArr);
            });
        } else {
            modalHandleShow("noMeasurements");
        }
        
        // console.log(fabricColorHtmlCode,step3,refIndex);
    }
    
    function getProjectDetail(basketId) {
        axios.get(baseURGetProject, {
            params: {
                id: basketId ? basketId : projectId
            },
            headers: authHeader()
        }).then((response) => {
            setProjectDetails(response.data, basketId);
        }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        getProjectDetail();
                    } else {
                        navigate("/" + pageLanguage + "/Curtain/" + catID + "/" + modelID);
                    }
                });
            } else {
                navigate("/" + pageLanguage + "/Curtain/" + catID + "/" + modelID);
            }
        });
    }
    
    function setProjectDetails(data, editIndex, changeLang) {
        if (data && Object.keys(data).length !== 0) {
            setProjectData(data);
        }
        
        let pageLanguage = location.pathname.split('').slice(1, 3).join('');
        let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
        let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
        let selectValues = JSON.parse(JSON.stringify(selectCustomValues));
        let tempSelect = JSON.parse(JSON.stringify(roomLabelSelect));
        let depSetTempArr = new Set([...depSet]);
        
        let postfixFa = "س\u200Cم";
        let postfixEn = "cm";
        
        GetUserProjectData(data, isLoggedIn, editIndex, changeLang).then((temp) => {
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
                    tempLabels["3"] = location.pathname.split('').slice(1, 3).join('') === "fa" ? tempFabric["DesignName"] + "/" + tempFabric["ColorName"] : tempFabric["DesignEnName"] + "/" + tempFabric["ColorEnName"];
                    tempValue["3"] = temp["FabricId"];
                    depSetTempArr = new Set([...setGetDeps("", "3", depSetTempArr)]);
                    // console.log(depSetTempArr);
                    // setStep1(temp["FabricId"]);
                    setStepSelectedLabel(tempLabels);
                    setStepSelectedValue(tempValue);
                    promise2.reject();
                }
            }).catch(() => {
                    // console.log(temp);
                    if (temp["Mount"]) {
                        setStep1(temp["Mount"]);
                        if (temp["Mount"] === "Inside") {
                            setStep11("true");
                            let refIndex = inputs.current["11"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["11"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["11"].value;
                            depSetTempArr = new Set([...setGetDeps("", "1", depSetTempArr)]);
                        } else if (temp["Mount"] === "Outside") {
                            let refIndex = inputs.current["12"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["12"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["12"].value;
                            depSetTempArr = new Set([...setGetDeps("", "1", depSetTempArr)]);
                        } else {
                            setStep11("true");
                            let refIndex = inputs.current["13"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["13"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["13"].value;
                            depSetTempArr = new Set([...setGetDeps("", "1", depSetTempArr)]);
                        }
                        setStepSelectedLabel(tempLabels);
                        setStepSelectedValue(tempValue);
                    }
                    
                    if (temp["calcMeasurements"] !== undefined) {
                        // console.log(temp["calcMeasurements"].toString());
                        setStep2(temp["calcMeasurements"].toString());
                        
                    }
                    if (temp["WidthCart"] && temp["HeightCart"]) {
                        getWindowSize(temp["WidthCart"], temp["HeightCart"]);
                    }
                    
                    if (temp["RoomNameEn"]) {
                        setSavedProjectRoomLabel(temp["RoomNameEn"]);
                        
                        depSetTempArr = new Set([...setGetDeps("", "61", depSetTempArr)]);
                        setSelectedRoomLabel(temp["RoomNameEn"] ? [{
                            value: temp["RoomNameEn"],
                            label: rooms[pageLanguage].find(opt => opt.value === temp["RoomNameEn"]).label
                        }] : []);
                        tempSelect.label = rooms[pageLanguage].find(opt => opt.value === temp["RoomNameEn"]).label;
                        tempSelect.value = temp["RoomNameEn"];
                        setRoomLabelSelect(tempSelect);
                        if (temp["WindowName"] === undefined || (temp["WindowName"] && temp["WindowName"] === "")) {
                            tempLabels["6"] = tempSelect.label;
                        } else if (temp["WindowName"]) {
                            tempLabels["6"] = tempSelect.label + " - " + temp["WindowName"];
                        }
                        setStepSelectedLabel(tempLabels);
                    }
                    if (temp["WindowName"] && temp["WindowName"] !== "") {
                        setSavedProjectRoomText(temp["WindowName"]);
                        depSetTempArr = new Set([...setGetDeps("", "62", depSetTempArr)]);
                        setRoomLabelText(temp["WindowName"]);
                    }
                    
                    if (temp["uploadedImagesURL"] && temp["uploadedImagesURL"].length > 0) {
                        setUploadedImagesURL(temp["uploadedImagesURL"]);
                        setUploadedImagesFile(temp["uploadedImagesFile"]);
                        let tempArrayNames = [];
                        let tempArray = [];
                        
                        let promise3 = new Promise((resolve, reject) => {
                            temp["uploadedImagesFile"].forEach((obj, index) => {
                                tempArrayNames[index] = <li className="uploaded_name_item" key={index}>
                                    <i className="fa fa-file"/>
                                    <span className="uploaded_name_item_text">{obj.replace(/\.[^/.]+$/, "")}</span>
                                    <span className="uploaded_name_item_x" onClick={() => {
                                        setDeleteUploaded(temp["uploadedImagesURL"][index], index, 2);
                                    }}>X</span>
                                </li>;
                                
                                tempArray[index] = <li className="uploaded_image_item" key={index}>
                                    <img src={`https://api.atlaspood.ir/${temp["uploadedImagesURL"][index]}`} className="img-fluid" alt=""/>
                                </li>;
                                
                                if (index === temp["uploadedImagesFile"].length - 1) {
                                    resolve();
                                }
                            });
                        });
                        
                        promise3.then(() => {
                            setUploadedImagesNamesList(tempArrayNames);
                            setUploadedImagesList(tempArray);
                        });
                        
                    }
                    if (temp["uploadedPDFURL"] && temp["uploadedPDFURL"].length > 0) {
                        setUploadedPDFURL(temp["uploadedPDFURL"]);
                        setUploadedPDFFile(temp["uploadedPDFFile"]);
                        let tempArrayNames = [];
                        
                        let promise3 = new Promise((resolve, reject) => {
                            temp["uploadedPDFFile"].forEach((obj, index) => {
                                tempArrayNames[index] = <li className="uploaded_name_item" key={index}>
                                    <i className="fa fa-file"/>
                                    <span className="uploaded_name_item_text">{obj.replace(/\.[^/.]+$/, "")}</span>
                                    <span className="uploaded_name_item_x" onClick={() => {
                                        setDeleteUploaded(temp["uploadedPDFURL"][index], index, 1);
                                    }}>X</span>
                                </li>;
                                if (index === temp["uploadedPDFFile"].length - 1) {
                                    resolve();
                                }
                            });
                        });
                        
                        promise3.then(() => {
                            setUploadedPDFNameList(tempArrayNames);
                        });
                    }
                    
                    
                    setTimeout(() => {
                        setDepSet(depSetTempArr);
                        setSelectCustomValues(selectValues);
                        setStepSelectedLabel(tempLabels);
                        setStepSelectedValue(tempValue);
                        // setLabelLock(true);
                    }, 300);
                    
                }
            );
        });
    }
    
    function filterSelected(filter, filterId, isDelete) {
        // console.log(filterColors, filterPatterns, filterPatterns, filterPrices);
        if (filter === 1) {
            if (isDelete) {
                setFilterColors([
                    ...filterColors,
                    filterId
                ]);
            } else {
                setFilterColors(
                    filterColors.filter((id1) => id1 !== filterId),
                );
            }
        } else if (filter === 2) {
            if (isDelete) {
                setFilterPatterns([
                    ...filterPatterns,
                    filterId
                ]);
            } else {
                setFilterPatterns(
                    filterPatterns.filter((id1) => id1 !== filterId),
                );
            }
        } else if (filter === 3) {
            if (isDelete) {
                setFilterTypes([
                    ...filterTypes,
                    filterId
                ]);
            } else {
                setFilterTypes(
                    filterTypes.filter((id1) => id1 !== filterId),
                );
            }
        } else {
            if (isDelete) {
                setFilterPrices([
                    ...filterPrices,
                    filterId
                ]);
            } else {
                setFilterPrices(
                    filterPrices.filter((id1) => id1 !== filterId),
                );
            }
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
    
    const optionsOutside = {
        "en": [
            {value: 'Wall', label: 'Wall'},
            {value: 'Ceiling', label: 'Ceiling'}
        ],
        "fa": [
            {value: 'Wall', label: 'دیوار'},
            {value: 'Ceiling', label: 'سقف'}
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
            {value: '10', label: '10'},
            {value: '11', label: '11'},
            {value: '12', label: '12'},
            {value: '13', label: '13'},
            {value: '14', label: '14'},
            {value: '15', label: '15'}
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
            {value: '10', label: '۱۰'},
            {value: '11', label: '۱۱'},
            {value: '12', label: '۱۲'},
            {value: '13', label: '۱۳'},
            {value: '14', label: '۱۴'},
            {value: '15', label: '۱۵'}
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
        ]
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
        ]
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
        ]
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
        ]
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
            // let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
            // tempLabels["3"] = location.pathname.split('').slice(1, 3).join('') === "fa" ? fabricSelected.selectedTextFa + "/" + fabricSelected.selectedColorFa : fabricSelected.selectedTextEn + "/" + fabricSelected.selectedColorEn;
            // let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
            // tempValue["3"] = fabricSelected.selectedFabricId;
            // setStepSelectedLabel(tempLabels);
            // setStepSelectedValue(tempValue);
            // setCart("FabricId", fabricSelected.selectedFabricId);
            setCart("FabricId", `${fabricSelected.selectedFabricId}`, "", "FabricDesignFa,FabricDesignEn,FabricColorEn,FabricColorFa,PhotoUrl", [fabricSelected.selectedTextFa, fabricSelected.selectedTextEn, fabricSelected.selectedColorEn, fabricSelected.selectedColorFa, fabricSelected.selectedPhoto]);
            // setCart("PhotoUrl", fabricSelected.selectedPhoto);
            setDeps("", "3");
            setStep3(fabricSelected.selectedFabricId.toString());
            setFabricColorHtmlCode(fabricSelected.ColorHtmlCode);
        }
    }, [fabricSelected]);
    
    useEffect(() => {
        getCart().then((temp) => {
            if (Object.keys(fabrics).length) {
                setTimeout(() => {
                    renderFabrics(temp);
                }, 100);
            } else {
                setFabricsList([]);
            }
        });
    }, [step3]);
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
        // console.log("hi2");
        if (swatchLogin) {
            setSwatchLogin(false);
            modalHandleClose("side_login_modal");
        } else if ((projectModalState === 2 && isLoggedIn) || (saveProjectCount !== 0 && isLoggedIn)) {
            if (roomLabelText !== "" && selectedRoomLabel.length) {
                if (projectId && projectId !== "") {
                    SaveUserProject(depSet, cartValues, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], `${modelID}`, price, defaultModelName, defaultModelNameFa, projectData).then((temp) => {
                        if (temp === 401) {
                            setSaveProjectCount(saveProjectCount + 1);
                        } else if (temp) {
                            setProjectModalState(1);
                            setSavingLoading(false);
                        } else {
                            console.log("project not saved!");
                            setSavingLoading(false);
                        }
                    }).catch(() => {
                        // console.log("hi6");
                        setProjectModalState(2);
                        setSavingLoading(false);
                    });
                } else {
                    SaveUserProject(depSet, cartValues, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], `${modelID}`, price, defaultModelName, defaultModelNameFa).then((temp) => {
                        if (temp === 401) {
                            setSaveProjectCount(saveProjectCount + 1);
                        } else if (temp) {
                            setProjectModalState(1);
                            setSavingLoading(false);
                        } else {
                            console.log("project not saved!");
                            setSavingLoading(false);
                        }
                    }).catch((err) => {
                        // console.log("hi5",err);
                        setProjectModalState(2);
                        setSavingLoading(false);
                    });
                }
            } else {
                setProjectModalState(0);
                modalHandleShow("add_to_project_modal");
            }
        }
    }, [isLoggedIn, saveProjectCount]);
    
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
            setDefaultFabricPhoto(model["DefaultFabricPhotoUrl"]);
            setCart("PhotoUrl", model["DefaultFabricPhotoUrl"]);
            setDefaultModelName(model["ModelENName"]);
            setDefaultModelNameFa(model["ModelName"]);
        }
    }, [model]);
    
    useEffect(() => {
        if (deleteUploadImageIndex !== -1) {
            if (deleteUploadImageUrl !== "") {
                deleteUploadedImg(uploadedImagesList, uploadedImagesNamesList, deleteUploadImageUrl, deleteUploadImageIndex);
            }
        }
    }, [deleteUploadImageUrl]);
    
    useEffect(() => {
        if (deleteUploadPdfIndex !== -1) {
            if (deleteUploadPdfUrl !== "") {
                deleteUploadedPdf(uploadedPDFNameList, deleteUploadPdfUrl, deleteUploadPdfIndex);
            }
        }
    }, [deleteUploadPdfUrl]);
    
    useEffect(() => {
        if (Object.keys(model).length !== 0 && cartValues["WidthCart"] !== undefined) {
            let tempObj = {};
            model["Accessories"].forEach(obj => {
                let tempObj2 = {};
                obj["SewingAccessoryDetails"].forEach(el => {
                    tempObj2[el["SewingAccessoryDetailId"]] = JSON.parse(JSON.stringify(el));
                    tempObj2[el["SewingAccessoryDetailId"]]["Price"] = el["Price"] * cartValues["WidthCart"] / 100;
                });
                tempObj[obj["SewingAccessoryId"]] = tempObj2;
            });
            setModelAccessories(tempObj);
            setNoWidth(false);
            
            renderDkCurtains(cartValues["WidthCart"]);
        } else {
            setModelAccessories({});
            setNoWidth(true);
            renderDkCurtains(184);
        }
    }, [JSON.stringify(cartValues)]);
    
    // useEffect(() => {
    //     if (currentDkCurtainIndex !== -1 && cartValues["WidthCart"] !== undefined) {
    //         let tempArr = JSON.parse(JSON.stringify(dkCurtainArr));
    //         let count = Math.floor(cartValues["WidthCart"] / 11.5);
    //         // let fabricColorHtmlCode="#000"
    //         // Object.keys(fabrics).forEach((key, index) => {
    //         //     fabricColorHtmlCode = fabrics[key].filter(obj => {
    //         //         return obj["FabricId"] === step3
    //         //     })[0]["ColorHtmlCode"];
    //         // });
    //         // fabricColorHtmlCode=fabricColorHtmlCode?fabricColorHtmlCode:"#000";
    //         if(symmetric){
    //             tempArr[currentDkCurtainIndex]=fabricColorHtmlCode;
    //             tempArr[count-currentDkCurtainIndex-1]=fabricColorHtmlCode;
    //         }
    //         else{
    //             tempArr[currentDkCurtainIndex]=fabricColorHtmlCode;
    //         }
    //         setDkCurtainArr(tempArr);
    //     }
    //
    //     console.log(fabricColorHtmlCode,step3,currentDkCurtainIndex);
    // }, [currentDkCurtainIndex]);
    
    useEffect(() => {
        if (cartValues["WidthCart"] !== undefined) {
            renderDkCurtains(cartValues["WidthCart"]);
            
            let tempArr = [];
            let tempObj = [];
            let tempObjFabric = [];
            let promiseArr = [];
            for (let i = 0; i <= dkCurtainArr.length; i++) {
                if (dkCurtainArr[i]) {
                    promiseArr[i] = new Promise((resolve, reject) => {
                        let objKey = (pageLanguage === 'en' ? dkCurtainArr[i]["DesignEnName"] : dkCurtainArr[i]["DesignName"]).toString() + "/" + (pageLanguage === 'en' ? dkCurtainArr[i]["ColorEnName"] : dkCurtainArr[i]["ColorName"]).toString();
                        tempObj[i] = objKey;
                        tempObjFabric[i] = dkCurtainArr[i]["FabricId"];
                        resolve();
                    });
                }
            }
            
            Promise.all(promiseArr).then(() => {
                let promiseArr2 = [];
                let lastString = tempObj[0];
                let lastFabric = tempObjFabric[0];
                let tempObjCount = {};
                let count = 0;
                let lastRef = 0;
                
                const doPush = (refIndex) => {
                    tempObjCount[refIndex] = {
                        "count": count,
                        "string": lastString,
                        "fabricId": lastFabric
                    };
                };
                for (let i = 0; i < tempObj.length; i++) {
                    let string = tempObj[i];
                    promiseArr2[i] = new Promise((resolve, reject) => {
                        if (string !== lastString) {
                            doPush(lastRef);
                            lastString = string;
                            lastFabric = tempObjFabric[i];
                            count = 1;
                            lastRef = i;
                            resolve();
                        } else {
                            count++;
                            resolve();
                        }
                    });
                }
                
                Promise.all(promiseArr2).then(() => {
                    doPush(lastRef);
                    
                    let promiseArr3 = [];
                    Object.keys(tempObjCount).forEach((key, index) => {
                        // if (index < 8) {
                        promiseArr3[index] = new Promise((resolve, reject) => {
                            if (tempObjCount[key]["string"]) {
                                tempArr.push(
                                    <div key={index}
                                         className="dk_curtain_preview_detail"><h2>{tempObjCount[key]["string"]}</h2><h3>&nbsp;{"\u00d7 " + tempObjCount[key]["count"]}</h3>
                                    </div>
                                );
                                resolve();
                            } else {
                                resolve();
                            }
                        });
                        // } else {
                        //     if (showMorePreview) {
                        //         promiseArr2[index] = new Promise((resolve, reject) => {
                        //             tempArr.push(
                        //                 <div key={index}
                        //                      className="dk_curtain_preview_detail"><h2>{key}</h2><h3>&nbsp;{"/ " + tempObj[key]}</h3></div>
                        //             );
                        //             resolve();
                        //         });
                        //     } else if (index === 8) {
                        //         promiseArr2[index] = new Promise((resolve, reject) => {
                        //             tempArr.push(
                        //                 <div key={index} className="dk_curtain_preview_detail_more_button_container">
                        //                     <button className="dk_curtain_preview_detail_more_button btn" onClick={() => setShowMorePreview(true)}>See More Color Options</button>
                        //                 </div>
                        //             );
                        //             resolve();
                        //         });
                        //     }
                        // }
                    });
                    Promise.all(promiseArr3).then(() => {
                        setDkCurtainPreviewList(tempArr);
                        
                        let tempSodFabrics = [];
                        let promiseArr4 = [];
                        Object.keys(tempObjCount).forEach((key, index) => {
                            promiseArr4[index] = new Promise((resolve, reject) => {
                                if (tempObjCount[key]["fabricId"]) {
                                    tempSodFabrics.push(
                                        {
                                            "FabricId": tempObjCount[key]["fabricId"].toString(),
                                            "Qty": tempObjCount[key]["count"].toString(),
                                            "FabricOrder": (+key + +1).toString()
                                        });
                                }
                                resolve();
                            });
                        });
                        
                        Promise.all(promiseArr4).then(() => {
                            setSodFabrics(tempSodFabrics);
                            // console.log(tempSodFabrics);
                        });
                    });
                    // console.log(curtainList)
                });
            });
        }
    }, [JSON.stringify(dkCurtainArr), symmetric]);
    
    useEffect(() => {
        if (showMoreFabric !== "") {
            let tempFabrics = JSON.parse(JSON.stringify(fabrics));
            
            let promiseArr = [];
            if (fabrics[showMoreFabric]) {
                tempFabrics[showMoreFabric].forEach((el, index) => {
                    promiseArr[index] = new Promise((resolve, reject) => {
                        el["ShowMore"] = true;
                        // console.log(fabrics[showMoreFabric],el,index);
                        resolve();
                    });
                })
            }
            
            Promise.all(promiseArr).then(() => {
                setFabrics(tempFabrics);
                // console.log(tempFabrics);
            });
        }
    }, [showMoreFabric]);
    
    useEffect(() => {
        if (modelID !== '' && catID !== '') {
            // if(firstRender) {
            getCats();
            getModel();
            // getFabrics();
            // setFirstRender(false);
            // }
        }
    }, [modelID, catID]);
    
    async function setLang() {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
    }
    
    async function getCart() {
        return await new Promise((resolve, reject) => {
            if (isLoggedIn) {
                axios.get(baseURLGetCart, {
                    headers: authHeader()
                }).then((response) => {
                    setBag(response.data);
                    resolve(response.data);
                }).catch(err => {
                    if (err.response.status === 401) {
                        refreshToken().then((response2) => {
                            if (response2 !== false) {
                                setCartChanged(cartChanged + 1);
                                reject();
                            } else {
                                setCartChanged(cartChanged + 1);
                                reject();
                            }
                        });
                    } else {
                        setCartChanged(cartChanged + 1);
                        reject();
                    }
                });
            } else {
                if (localStorage.getItem("cart") !== null) {
                    setBag(JSON.parse(localStorage.getItem("cart")));
                    resolve(JSON.parse(localStorage.getItem("cart")));
                } else {
                    setBag({});
                    resolve({});
                }
            }
        });
    }
    
    useEffect(() => {
        setLang().then(() => {
            if (pageLanguage !== '') {
                if (Object.keys(fabrics).length) {
                    getCart().then((temp) => {
                        setTimeout(() => {
                            renderFabrics(temp);
                        }, 100);
                    });
                } else {
                    setFabricsList([]);
                }
            }
        });
    }, [fabrics, cartChanged, isLoggedIn, location.pathname]);
    
    useEffect(() => {
        if (filterChanged["filter"] !== 0) {
            filterSelected(filterChanged["filter"], filterChanged["filter_id"], filterChanged["isDelete"]);
            
            setFilterChanged({
                filter: 0,
                filter_id: undefined,
                isDelete: false
            });
        }
    }, [filterChanged]);
    
    useEffect(() => {
        getFabricsWithFilter();
    }, [filterColors, filterPatterns, filterTypes, filterPrices, searchText]);
    
    useEffect(() => {
        // setModels([]);
        // setFabrics([]);
        // setFabricsList([]);
        if (pageLanguage !== '') {
            setSelectedMotorChannels([motorChannels[pageLanguage].find(opt => opt.value === '0')]);
        }
        GetSewingFilters(1, `${modelID}`).then((temp) => {
            setSewingColors(temp[location.pathname.split('').slice(1, 3).join('')].map((obj, index) => (
                <Dropdown.Item as={Button} key={index}>
                    <label className="dropdown_label">
                        <input type="checkbox" filter-id={obj.value}
                               ref={ref => (filterCheckboxes.current["colors"] = [...filterCheckboxes.current["colors"], ref])}
                               onChange={(e) => {
                                   setFilterChanged({
                                       filter: 1,
                                       filter_id: e.target.getAttribute("filter-id"),
                                       isDelete: e.target.checked
                                   });
                               }} id={"dropdown_color" + obj.value + index}/>
                        <label htmlFor={"dropdown_color" + obj.value + index} className="checkbox_label">
                            <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')} alt=""/>
                        </label>
                        {obj.label}
                    </label>
                </Dropdown.Item>
            )));
        });
        GetSewingFilters(2, `${modelID}`).then((temp) => {
            setSewingPatterns(temp[location.pathname.split('').slice(1, 3).join('')].map((obj, index) => (
                <Dropdown.Item as={Button} key={index}>
                    <label className="dropdown_label">
                        <input type="checkbox" filter-id={obj.value}
                               ref={ref => (filterCheckboxes.current["patterns"] = [...filterCheckboxes.current["patterns"], ref])}
                               onChange={(e) => {
                                   setFilterChanged({
                                       filter: 2,
                                       filter_id: e.target.getAttribute("filter-id"),
                                       isDelete: e.target.checked
                                   });
                               }} id={"dropdown_pattern" + obj.value + index}/>
                        <label htmlFor={"dropdown_pattern" + obj.value + index} className="checkbox_label">
                            <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')} alt=""/>
                        </label>
                        {obj.label}
                    </label>
                </Dropdown.Item>
            )));
        });
        GetSewingFilters(3, `${modelID}`).then((temp) => {
            setSewingTypes(temp[location.pathname.split('').slice(1, 3).join('')].map((obj, index) => (
                <Dropdown.Item as={Button} key={index}>
                    <label className="dropdown_label">
                        <input type="checkbox" filter-id={obj.value}
                               ref={ref => (filterCheckboxes.current["types"] = [...filterCheckboxes.current["types"], ref])}
                               onChange={(e) => {
                                   setFilterChanged({
                                       filter: 3,
                                       filter_id: e.target.getAttribute("filter-id"),
                                       isDelete: e.target.checked
                                   });
                               }} id={"dropdown_type" + obj.value + index}/>
                        <label htmlFor={"dropdown_type" + obj.value + index} className="checkbox_label">
                            <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')} alt=""/>
                        </label>
                        {obj.label}
                    </label>
                </Dropdown.Item>
            )));
        });
        GetSewingFilters(4, `${modelID}`).then((temp) => {
            setSewingPrices(temp[location.pathname.split('').slice(1, 3).join('')].map((obj, index) => (
                <Dropdown.Item as={Button} key={index}>
                    <label className="dropdown_label">
                        <input type="checkbox" filter-id={obj.value}
                               ref={ref => (filterCheckboxes.current["prices"] = [...filterCheckboxes.current["prices"], ref])}
                               onChange={(e) => {
                                   setFilterChanged({
                                       filter: 4,
                                       filter_id: e.target.getAttribute("filter-id"),
                                       isDelete: e.target.checked
                                   });
                               }} id={"dropdown_price" + obj.value + index}/>
                        <label htmlFor={"dropdown_price" + obj.value + index} className="checkbox_label">
                            <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')} alt=""/>
                        </label>
                        {obj.label}
                    </label>
                </Dropdown.Item>
            )));
        });
    }, [pageLanguage, location.pathname]);
    
    useEffect(() => {
        if (Object.keys(cartValues).length !== 0) {
            cartValues["SewingModelId"] = `${modelID}`;
            sessionStorage.setItem("cartValues", JSON.stringify(cartValues));
            if (editIndex) {
                sessionStorage.setItem("editIndex", JSON.stringify(editIndex));
            }
            if (projectId) {
                sessionStorage.setItem("projectId", JSON.stringify(projectId));
            }
        }
    }, [cartValues]);
    
    useEffect(() => {
        if (sessionStorage.getItem("cartValues") !== null && editIndex === undefined && projectId === undefined) {
            let tempCartValues = {};
            let tempEditIndex;
            let tempProjectId;
            if (sessionStorage.getItem("cartValues") !== null) {
                tempCartValues = JSON.parse(sessionStorage.getItem("cartValues"));
                if (Object.keys(tempCartValues).length !== 0) {
                    if (tempCartValues["SewingModelId"] && tempCartValues["SewingModelId"] === `${modelID}`) {
                        setStepSelectedLabel({});
                        setWindowSize("");
                        setProjectDetails(tempCartValues, undefined, true);
                    }
                }
            }
            if (sessionStorage.getItem("editIndex") !== null) {
                tempEditIndex = JSON.parse(sessionStorage.getItem("editIndex") && sessionStorage.getItem("editIndex").toUpperCase() !== "UNDEFINED");
                setEditIndex(tempEditIndex);
            }
            if (sessionStorage.getItem("projectId") !== null && sessionStorage.getItem("projectId").toUpperCase() !== "UNDEFINED") {
                tempProjectId = JSON.parse(sessionStorage.getItem("projectId"));
                setProjectId(tempProjectId);
            }
            sessionStorage.clear();
        }
    }, []);
    
    
    useEffect(() => {
        if (editIndex && editIndex !== "") {
            if (isLoggedIn) {
                getProjectDetail(editIndex);
            } else {
                if (localStorage.getItem("cart") !== null) {
                    if (JSON.parse(localStorage.getItem("cart"))["drapery"] !== undefined) {
                        setProjectDetails(JSON.parse(localStorage.getItem("cart"))["drapery"][editIndex], editIndex);
                    } else {
                        navigate("/" + pageLanguage + "/Curtain/" + catID + "/" + modelID);
                    }
                } else {
                    navigate("/" + pageLanguage + "/Curtain/" + catID + "/" + modelID);
                }
            }
        } else if (projectId && projectId !== "") {
            getProjectDetail();
        } else if (Object.keys(cartValues).length !== 0) {
            setStepSelectedLabel({});
            setWindowSize("");
            setProjectDetails(cartValues, undefined, true)
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
                                <ContextAwareToggle eventKey="1" stepNum={t("1")} stepTitle={t("DK_step1")} stepRef="1" type="1" required={requiredStep["1"]}
                                                    stepSelected={stepSelectedLabel["1"] === undefined ? "" : stepSelectedLabel["1"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/zebra/mount_inside.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("mount_Inside")} value="1" name="step1" ref-num="1" id="11" checked={step1 === "Inside"}
                                                   onChange={e => {
                                                       selectChanged(e, "");
                                                       setStep1("Inside");
                                                       setStep11("");
                                                       setMeasurementsNextStep("3");
                                                       if (stepSelectedValue["2"] === "2") {
                                                           setDeps("21", "2,3AOut,3BOut1,3BOut2,3COut,3DOut");
                                                           deleteSpecialSelects(2);
                                                           setCart("Mount", "Inside", "Mount2");
                                                           setStep2("");
                                                       } else {
                                                           setDeps("21", "2");
                                                           setCart("Mount", "Inside", "Mount2");
                                                       }
                                                
                                                   }} ref={ref => (inputs.current["11"] = ref)}/>
                                            <label htmlFor="11">{t("mount_Inside")}</label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/zebra/mount_outside.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("mount_Outside")} value="2" name="step1" ref-num="1" id="12" checked={step1 === "Outside"}
                                                   onChange={e => {
                                                       selectChanged(e, "");
                                                       setStep1("Outside");
                                                       setStep11("");
                                                       if (stepSelectedValue["2"] === "2") {
                                                           setDeps("3AOut,3BOut1,3BOut2,3COut,3DOut", "2,21,3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3");
                                                           deleteSpecialSelects(1);
                                                           setCart("", "", "Mount,Mount2,Width1,Width2,Width3,Height1,Height2,Height3");
                                                       } else {
                                                           setDeps("", "2,21");
                                                           setCart("", "", "Mount,Mount2,Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount");
                                                       }
                                                       setSelectedMountOutsideType([]);
                                                   }} ref={ref => (inputs.current["12"] = ref)}/>
                                            <label htmlFor="12">{t("mount_Outside")}</label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/zebra/mount_outside.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("mount_Arc")} value="3" name="step1" ref-num="1" id="13" checked={step1 === "HiddenMouldingMount"}
                                                   onChange={e => {
                                                       selectChanged(e, "3AIn,3BIn");
                                                       setStep1("HiddenMouldingMount");
                                                       setStep11("");
                                                       if (stepSelectedValue["2"] === "2") {
                                                           setDeps("3AOut,3BOut1,3BOut2,3COut,3DOut", "2,21,3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3");
                                                           deleteSpecialSelects(1);
                                                           setCart("Mount2", "HiddenMouldingMount", "Mount,Width1,Width2,Width3,Height1,Height2,Height3");
                                                       } else {
                                                           setDeps("", "2,21");
                                                           setCart("Mount2", "HiddenMouldingMount", "Mount,Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount");
                                                       }
                                                   }} ref={ref => (inputs.current["13"] = ref)}/>
                                            <label htmlFor="13">{t("mount_Arc")}</label>
                                        </div>
                                        
                                        {stepSelectedValue["1"] === "1" &&
                                            <div className="secondary_options">
                                                <div className="card-body-display-flex">
                                                    <div className="checkbox_style checkbox_style_step2">
                                                        <input type="checkbox" value="1" name="step11" ref-num="11" checked={step11 === "true"} onChange={(e) => {
                                                            if (e.target.checked) {
                                                                selectChanged(e);
                                                                setStep11("true");
                                                                let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                                                                let refIndex = inputs.current["11"].getAttribute('ref-num');
                                                                tempLabels[refIndex] = inputs.current["11"].getAttribute('text');
                                                                setStepSelectedLabel(tempLabels);
                                                                if (stepSelectedValue["2"] === "2") {
                                                                    setDeps("3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3", "21");
                                                                } else {
                                                                    setDeps("", "21");
                                                                }
                                                            } else {
                                                                setStep11("");
                                                                if (stepSelectedValue["2"] === "2") {
                                                                    setStep2("");
                                                                    setDeps("21,3", "3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3");
                                                                } else {
                                                                    setDeps("21", "3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3");
                                                                }
                                                            }
                                                        }} id="111" ref={ref => (inputs.current["111"] = ref)}/>
                                                        <label htmlFor="111" className="checkbox_label">
                                                            <img className="checkbox_label_img checkmark1 img-fluid"
                                                                 src={require('../Images/public/checkmark1_checkbox.png')}
                                                                 alt=""/>
                                                        </label>
                                                        <span className="checkbox_text">
                                                        {t("inside_checkbox_title")}
                                                    </span>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {stepSelectedValue["1"] === "2" &&
                                            <div className="selection_section">
                                                <div className="select_container">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        values={selectedMountOutsideType}
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
                                                                setSelectedMountOutsideType(selected);
                                                                setDeps("", "11");
                                                                setCart("Mount2", selected[0].value);
                                                                let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                                                                tempLabels["1"] = t("mount_Outside") + "/" + selected[0].label;
                                                                setStepSelectedLabel(tempLabels);
                                                            }
                                                        }}
                                                        options={optionsOutside[pageLanguage]}
                                                    />
                                                </div>
                                            </div>
                                        }
                                        {stepSelectedValue["1"] === "3" &&
                                            <div className="secondary_options">
                                                <div className="card-body-display-flex">
                                                    <div className="checkbox_style checkbox_style_step2">
                                                        <input type="checkbox" value="1" name="step11" ref-num="11" checked={step11 === "true"} onChange={(e) => {
                                                            if (e.target.checked) {
                                                                selectChanged(e);
                                                                setStep11("true");
                                                                let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                                                                let refIndex = inputs.current["13"].getAttribute('ref-num');
                                                                tempLabels[refIndex] = inputs.current["13"].getAttribute('text');
                                                                setStepSelectedLabel(tempLabels);
                                                                if (stepSelectedValue["2"] === "2") {
                                                                    setDeps("3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3", "21");
                                                                } else {
                                                                    setDeps("", "21");
                                                                }
                                                            } else {
                                                                setStep11("");
                                                                // modalHandleShow("noPower");
                                                                
                                                                if (stepSelectedValue["2"] === "2") {
                                                                    setStep2("");
                                                                    setDeps("21,3", "3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3");
                                                                } else {
                                                                    setDeps("21", "3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3");
                                                                }
                                                            }
                                                        }} id="111" ref={ref => (inputs.current["111"] = ref)}/>
                                                        <label htmlFor="111" className="checkbox_label">
                                                            <img className="checkbox_label_img checkmark1 img-fluid"
                                                                 src={require('../Images/public/checkmark1_checkbox.png')}
                                                                 alt=""/>
                                                        </label>
                                                        <span className="checkbox_text">
                                                        {t("Arc_checkbox_title")}
                                                    </span>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        <NextStep
                                            eventKey={(stepSelectedValue["1"] === "1" && step11 !== "true") || (stepSelectedValue["1"] === "3" && step11 !== "true") ? "1" : "2"}
                                            onClick={() => {
                                                if ((stepSelectedValue["1"] === "1" && step11 !== "true") || (stepSelectedValue["1"] === "3" && step11 !== "true"))
                                                    modalHandleShow("noInsideUnderstand");
                                            }}>{t("NEXT STEP")}</NextStep>
                                    </div>
                                    {/*<div className="accordion_help accordion_help_three">*/}
                                    {/*    <div className="help_container">*/}
                                    {/*        <div className="help_column help_left_column help_left_column_mount_type">*/}
                                    {/*            <p className="help_column_header">{t("step2_help_1")}</p>*/}
                                    {/*            <ul className="help_column_list">*/}
                                    {/*                <li>{t("step2_help_2")}</li>*/}
                                    {/*                /!*<li>{t("step2_help_3")}</li>*!/*/}
                                    {/*                <li>{t("step2_help_4")}</li>*/}
                                    {/*                <li>{t("step2_help_5")}</li>*/}
                                    {/*            </ul>*/}
                                    {/*        </div>*/}
                                    {/*        <div className="help_column help_right_column help_right_column_mount_type">*/}
                                    {/*            <p className="help_column_header">{t("step2_help_6")}</p>*/}
                                    {/*            <ul className="help_column_list">*/}
                                    {/*                <li>{t("step2_help_7")}</li>*/}
                                    {/*                <li>{t("step2_help_8")}</li>*/}
                                    {/*                <li>{t("step2_help_9")}</li>*/}
                                    {/*            </ul>*/}
                                    {/*        </div>*/}
                                    {/*        <div className="help_column help_left_column help_right_column_mount_type">*/}
                                    {/*            <p className="help_column_header">{t("dk_step2_help_10")}</p>*/}
                                    {/*            <ul className="help_column_list">*/}
                                    {/*                <li>{t("dk_step2_help_11")}</li>*/}
                                    {/*                <li>{t("dk_step2_help_12")}</li>*/}
                                    {/*                <li>{t("dk_step2_help_13")}</li>*/}
                                    {/*            </ul>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"></p>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle"><b>{t("dk_step2_help_1")}</b>{t("dk_step2_help_2")}</li>
                                                    <li className="no_listStyle"><b>{t("dk_step2_help_3")}</b>{t("dk_step2_help_4")}</li>
                                                    <li className="no_listStyle"><b>{t("dk_step2_help_5")}</b>{t("dk_step2_help_6")}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 2 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="2" stepNum={t("2")} stepTitle={t("zebra_step3")} stepRef="2" type="2" required={requiredStep["2"]}
                                                    stepSelected={windowSizeBool ? windowSize : (stepSelectedLabel["2"] === undefined ? "" : stepSelectedLabel["2"])}
                                                    cartCustomText={t("zebra_step3_custom_cart_text")}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("I have my own measurements")} value="1" name="step2" ref-num="2" id="21"
                                                   checked={step2 === "false"}
                                                   onChange={e => {
                                                       setStep2("false");
                                                       selectChanged(e, "");
                                                       setMeasurementsNextStep("3");
                                                       setDeps("21,22", "2");
                                                       deleteSpecialSelects();
                                                       setCart("calcMeasurements", false, "WidthCart,HeightCart,Width1,Width2,Width3,Height1,Height2,Height3,Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount");
                                                   }} ref={ref => (inputs.current["21"] = ref)}/>
                                            <label htmlFor="21">{t("I have my own measurements.")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("Calculate my measurements")} value="2" name="step2" checked={step2 === "true"}
                                                   ref-num="2" id="22" ref={ref => (inputs.current["22"] = ref)}
                                                   onChange={e => {
                                                       if (stepSelectedValue["1"] === undefined) {
                                                           setStep2("");
                                                           selectUncheck(e);
                                                           modalHandleShow("noMount");
                                                           setDeps("2", "21,22");
                                                           setCart("calcMeasurements", true, "Width,height,calcMeasurements");
                                                       } else if (stepSelectedValue["1"] === "1") {
                                                           if (step11 !== "true") {
                                                               modalHandleShow("noInsideUnderstand");
                                                               setStep2("");
                                                               selectUncheck(e);
                                                               setDeps("2", "21,22");
                                                               setCart("calcMeasurements", true, "Width,height,calcMeasurements");
                                                           } else {
                                                               setStep2("true");
                                                               deleteSpecialSelects(2);
                                                               selectChanged(e);
                                                               setMeasurementsNextStep("2A");
                                                               setDeps("");
                                                               setCart("calcMeasurements", true, "Width,Height,Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount");
                                                           }
                                                       } else if (stepSelectedValue["1"] === "3") {
                                                           if (step11 !== "true") {
                                                               modalHandleShow("noInsideUnderstand");
                                                               setStep2("");
                                                               selectUncheck(e);
                                                               setDeps("2", "21,22");
                                                               setCart("calcMeasurements", true, "Width,height,calcMeasurements");
                                                           } else {
                                                               setStep2("true");
                                                               deleteSpecialSelects(2);
                                                               selectChanged(e);
                                                               setMeasurementsNextStep("2A");
                                                               setDeps("");
                                                               setCart("calcMeasurements", true, "Width,Height,Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount");
                                                           }
                                                       } else {
                                                           if (!selectedMountOutsideType.length) {
                                                               modalHandleShow("noInsideUnderstand");
                                                               setStep2("");
                                                               selectUncheck(e);
                                                               setDeps("2", "21,22");
                                                               setCart("calcMeasurements", true, "Width,height,calcMeasurements");
                                                           } else {
                                                               setStep2("true");
                                                               deleteSpecialSelects(2);
                                                               selectChanged(e);
                                                               setMeasurementsNextStep("2A");
                                                               setDeps("");
                                                               setCart("calcMeasurements", true, "Width,Height,Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount");
                                                           }
                                                       }
                                                   }}/>
                                            <label htmlFor="22">{t("Calculate my measurements.")}</label>
                                        
                                        </div>
                                        
                                        {stepSelectedValue["2"] === "1" &&
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
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                optionSelectChanged_WidthLength(selected[0], "2", true, "cm", "س\u200Cم", pageLanguage);
                                                                let temp = selectCustomValues;
                                                                temp.width = selected;
                                                                setSelectCustomValues(temp);
                                                                setDeps("", "21");
                                                                setCart("Width", selected[0].value);
                                                            }}
                                                            options={SelectOptionRange(30, 300, 1, "cm", "", pageLanguage)}
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
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                optionSelectChanged_WidthLength(selected[0], "2", false, "cm", "س\u200Cم", pageLanguage);
                                                                let temp = selectCustomValues;
                                                                temp.length = selected;
                                                                setSelectCustomValues(temp);
                                                                setDeps("", "22");
                                                                setCart("Height", selected[0].value);
                                                            }}
                                                            options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        
                                        <NextStep eventKey={measurementsNextStep}>{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    {(stepSelectedValue["2"] === "1") &&
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
                                    {(stepSelectedValue["2"] === "2") &&
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
                        
                        {/* step 2A */}
                        {stepSelectedValue["2"] === "2" && ((stepSelectedValue["1"] === "3" && step11 === "true") || (stepSelectedValue["1"] === "2" && selectedMountOutsideType.length)) &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="2A" stepNum={t("2A")} stepTitle={t("dk_step2A")} stepRef="2A" type="1" required={requiredStep["2A"]}
                                                        stepSelected={stepSelectedLabel["2A"] === undefined ? "" : stepSelectedLabel["2A"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2A">
                                    <Card.Body>
                                        <div className="card_body card_body_radio">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("dk_step2A_title")}</p>
                                                {/* <img src={pageLanguage === 'fa' ? require('../Images/drapery/zebra/width_inside_3_fa.svg').default : require('../Images/drapery/zebra/width_inside_3.svg').default}
                                                className="img-fluid" alt=""/> */}
                                            </div>
                                            <div className="box33 radio_style">
                                                <img src={require('../Images/drapery/dualRoller/Sill_track.svg').default} className="img-fluid height_auto" alt=""/>
                                                <input className="radio" type="radio" text={t("Sill")} value="1" name="step2A" ref-num="2A" id="2A1" checked={step2A === "Sill"}
                                                       onChange={e => {
                                                           selectChanged(e, "");
                                                           setStep2A("Sill");
                                                           setDeps("21", "2,3AOut,3BOut1,3BOut2,3COut,3DOut");
                                                           setCart("FinishedLengthType", "Sill");
                                                    
                                                       }} ref={ref => (inputs.current["2A1"] = ref)}/>
                                                <label htmlFor="2A1">{t("Sill")}</label>
                                            </div>
                                            <div className="box33 radio_style">
                                                <img src={require('../Images/drapery/dualRoller/small_track.svg').default} className="img-fluid height_auto" alt=""/>
                                                <input className="radio" type="radio" text={t("Apron")} value="2" name="step2A" ref-num="2A" id="2A2" checked={step2A === "Apron"}
                                                       onChange={e => {
                                                           selectChanged(e, "");
                                                           setStep2A("Apron");
                                                           setCart("FinishedLengthType", "Apron");
                                                       }} ref={ref => (inputs.current["2A2"] = ref)}/>
                                                <label htmlFor="2A2">{t("Apron")}</label>
                                            </div>
                                            <div className="box33 radio_style">
                                                <img src={require('../Images/drapery/dualRoller/medium_track.svg').default} className="img-fluid height_auto" alt=""/>
                                                <input className="radio" type="radio" text={t("Floor")} value="3" name="step2A" ref-num="2A" id="2A3" checked={step2A === "Floor"}
                                                       onChange={e => {
                                                           selectChanged(e, "");
                                                           setStep2A("Floor");
                                                           setCart("FinishedLengthType", "Floor");
                                                       }} ref={ref => (inputs.current["2A3"] = ref)}/>
                                                <label htmlFor="2A3">{t("Floor")}</label>
                                            </div>
                                            <NextStep eventKey="2B">{t("NEXT STEP")}</NextStep>
                                        </div>
                                        
                                        <div className="accordion_help">
                                            <div className="help_container">
                                                <div className="help_column help_left_column">
                                                    <p className="help_column_header"></p>
                                                    <ul className="help_column_list">
                                                        <li className="no_listStyle"><b>Sill:</b> 1cm above window sill.</li>
                                                        <li className="no_listStyle"><b>Apron:</b> 10cm below the window. We recommend this length type for windows where radiators
                                                            or
                                                            furniture will block full-length shades.
                                                        </li>
                                                        <li className="no_listStyle"><b>Floor:</b> 1.5cm above the floor. We recommend this length type for windows that do not have
                                                            any
                                                            obstruction for full length shades.
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        }
                        
                        
                        {/* step 2B*/}
                        {stepSelectedValue["2"] === "2" && stepSelectedValue["2A"] && ((stepSelectedValue["1"] === "3" && step11 === "true") || (stepSelectedValue["1"] === "2" && selectedMountOutsideType.length)) &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="2B" stepNum={t("2B")} stepTitle={t("dk_step2B")} stepRef="2B" type="2" required={requiredStep["2B"]}
                                                        stepSelected={stepSelectedLabel["2B"] === undefined ? "" : stepSelectedLabel["2B"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2B">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("dk_step2B_title")}</p>
                                                <img src={require('../Images/drapery/dualRoller/FrameSize.svg').default} className="img-fluid" alt=""/>
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.Width2B}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged("2B", selected[0], "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.Width2B = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2B");
                                                                    setCart("Width2B", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(30, 360, 1, "cm", "", pageLanguage)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <NextStep eventKey="2C">{t("NEXT STEP")}</NextStep>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        }
                        
                        {/* step 2C */}
                        {stepSelectedValue["2"] === "2" && stepSelectedValue["2A"] && ((stepSelectedValue["1"] === "3" && step11 === "true")) &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="2C" stepNum={t("2C")} stepTitle={t("zebra_step3BOutside")} stepRef="2C" type="2" required={requiredStep["2C"]}
                                                        stepSelected={stepSelectedLabel["2C"] === undefined ? "" : stepSelectedLabel["2C"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2C">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("dk_step2c_out_title")}</p>
                                                <img src={require('../Images/drapery/zebra/wall_cover.svg').default} className="img-fluid" alt=""/>
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.left}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged_LeftRight(selected[0], "2C", true, "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.left = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2C1");
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.right}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged_LeftRight(selected[0], "2C", false, "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.right = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2C");
                                                                    setCart("ExtensionRight", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(1, 10, 1, "cm", "", pageLanguage)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <NextStep eventKey="2D">{t("NEXT STEP")}</NextStep>
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
                        
                        {/* step 2CCeiling and wall*/}
                        {stepSelectedValue["2"] === "2" && stepSelectedValue["2A"] && ((stepSelectedValue["1"] === "2" && selectedMountOutsideType.length)) &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="2C" stepNum={t("2C")} stepTitle={t("dk_step2CCeiling")} stepRef="2CCeiling" type="2"
                                                        required={requiredStep["2CCeiling"]}
                                                        stepSelected={stepSelectedLabel["2CCeiling"] === undefined ? "" : stepSelectedLabel["2CCeiling"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2C">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("dk_step2c_out_title")}</p>
                                                <img src={require('../Images/drapery/dk/fullRod_track.svg').default} className="img-fluid" alt=""/>
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.left}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged_LeftRight(selected[0], "2CCeiling", true, "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.left = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2CCeiling1");
                                                                    setCart("StackWidthLeft", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(1, 50, 1, "cm", "", pageLanguage)}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.right}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged_LeftRight(selected[0], "2CCeiling", false, "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.right = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2CCeiling2");
                                                                    setCart("StackWidthRight", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(1, 10, 1, "cm", "", pageLanguage)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <NextStep eventKey="2D">{t("NEXT STEP")}</NextStep>
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
                        
                        {/* step 2D */}
                        {stepSelectedValue["2"] === "2" && (stepSelectedValue["2A"] === "1" || stepSelectedValue["2A"] === "2") && ((stepSelectedValue["1"] === "3" && step11 === "true") || (stepSelectedValue["1"] === "2" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Ceiling")) &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="2D" stepNum={t("2D")} stepTitle={t("dk_step2D")} stepRef="2D" type="2" required={requiredStep["2D"]}
                                                        stepSelected={stepSelectedLabel["2D"] === undefined ? "" : stepSelectedLabel["2D"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2D">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("dk_step2D_title")}</p>
                                                <img
                                                    src={pageLanguage === 'fa' ? require('../Images/drapery/dk/ceiling_to_window_3.svg').default : require('../Images/drapery/dk/ceiling_to_window_3.svg').default}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.CeilingToWindow1}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged_three(selected[0], "2D", 0, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.CeilingToWindow1 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2D1");
                                                                    setCart("CeilingToWindow1", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.CeilingToWindow2}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged_three(selected[0], "2D", 1, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.CeilingToWindow2 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2D2");
                                                                    setCart("CeilingToWindow2", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.CeilingToWindow3}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged_three(selected[0], "2D", 2, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.CeilingToWindow3 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2D3");
                                                                    setCart("CeilingToWindow3", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <NextStep eventKey="2E">{t("NEXT STEP")}</NextStep>
                                        </div>
                                        
                                        <div className="accordion_help">
                                            <div className="help_container">
                                                <div className="help_column help_left_column">
                                                    <p className="help_column_header"/>
                                                    <ul className="help_column_list">
                                                        <li className="no_listStyle single_line_height">{t("dk_step2D_help_1")}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        }
                        
                        {/* step 2E*/}
                        {stepSelectedValue["2"] === "2" && (stepSelectedValue["2A"] === "1" || stepSelectedValue["2A"] === "2") && ((stepSelectedValue["1"] === "3" && step11 === "true") || (stepSelectedValue["1"] === "2" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Ceiling")) &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="2E" stepNum={t("2E")} stepTitle={t("dk_step2E")} stepRef="2E" type="2" required={requiredStep["2E"]}
                                                        stepSelected={stepSelectedLabel["2E"] === undefined ? "" : stepSelectedLabel["2E"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2E">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("dk_step2E_title")}</p>
                                                <img src={require('../Images/drapery/dk/CeilingToFloor_noRod.svg').default} className="img-fluid" alt=""/>
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.CeilingToFloor}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged("3E", selected[0], "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.CeilingToFloor = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "3E");
                                                                    setCart("CeilingToFloor", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(100, 500, 1, "cm", "", pageLanguage)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <NextStep eventKey="3">{t("NEXT STEP")}</NextStep>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        }
                        
                        {/* step 2DFloor */}
                        {stepSelectedValue["2"] === "2" && stepSelectedValue["2A"] === "3" && ((stepSelectedValue["1"] === "3" && step11 === "true") || (stepSelectedValue["1"] === "2" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Ceiling")) &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="2D" stepNum={t("2D")} stepTitle={t("dk_step2E")} stepRef="2DFloor" type="2" required={requiredStep["2DFloor"]}
                                                        stepSelected={stepSelectedLabel["2DFloor"] === undefined ? "" : stepSelectedLabel["2DFloor"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2D">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("dk_step2E_title")}</p>
                                                <img
                                                    src={pageLanguage === 'fa' ? require('../Images/drapery/dk/ceiling_to_floor_3.svg').default : require('../Images/drapery/dk/ceiling_to_floor_3.svg').default}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.CeilingToFloor1}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged_three(selected[0], "2DFloor", 0, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.CeilingToFloor1 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2DFloor1");
                                                                    setCart("CeilingToFloor1", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(100, 500, 1, "cm", "", pageLanguage)}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.CeilingToFloor2}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged_three(selected[0], "2DFloor", 1, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.CeilingToFloor2 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2DFloor2");
                                                                    setCart("CeilingToFloor2", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(100, 500, 1, "cm", "", pageLanguage)}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.CeilingToFloor3}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged_three(selected[0], "2DFloor", 2, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.CeilingToFloor3 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2DFloor3");
                                                                    setCart("CeilingToFloor3", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(100, 500, 1, "cm", "", pageLanguage)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <NextStep eventKey="3">{t("NEXT STEP")}</NextStep>
                                        </div>
                                        
                                        <div className="accordion_help">
                                            <div className="help_container">
                                                <div className="help_column help_left_column">
                                                    <p className="help_column_header"/>
                                                    <ul className="help_column_list">
                                                        <li className="no_listStyle single_line_height">{t("dk_step2D_help_2")}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        }
                        
                        {/* step 2DWall */}
                        {stepSelectedValue["2"] === "2" && (stepSelectedValue["2A"] === "1" || stepSelectedValue["2A"] === "2" || stepSelectedValue["2A"] === "3") && ((stepSelectedValue["1"] === "2" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Wall")) &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="2D" stepNum={t("2D")} stepTitle={t("dk_step2DWall")} stepRef="2DWall" type="2" required={requiredStep["2DWall"]}
                                                        stepSelected={stepSelectedLabel["2DWall"] === undefined ? "" : stepSelectedLabel["2DWall"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2D">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("dk_step2DWall_title")}</p>
                                                <img
                                                    src={pageLanguage === 'fa' ? require('../Images/drapery/dk/WindowtoFloor.svg').default : require('../Images/drapery/dk/WindowtoFloor.svg').default}
                                                    className="img-fluid" alt=""/>
                                            </div>
                                            <div className="box100 Three_selection_container">
                                                <div className="box100">
                                                    {/*<label className="select_label">{t("Width")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.WindowToFloor}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged("2DWall", selected[0], "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.WindowToFloor = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2DWall");
                                                                    setCart("WindowToFloor", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(100, 350, 1, "cm", "", pageLanguage)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <NextStep eventKey="2E">{t("NEXT STEP")}</NextStep>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        }
                        
                        {/* step 2EWall*/}
                        {stepSelectedValue["2"] === "2" && (stepSelectedValue["2A"] === "1" || stepSelectedValue["2A"] === "2") && ((stepSelectedValue["1"] === "2" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Wall")) &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="2E" stepNum={t("2E")} stepTitle={t("dk_step2EWall")} stepRef="2EWall" type="2" required={requiredStep["2EWall"]}
                                                        stepSelected={stepSelectedLabel["2EWall"] === undefined ? "" : stepSelectedLabel["2EWall"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2E">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("dk_step2EWall_title")}</p>
                                                <img src={require('../Images/drapery/dk/frame_height.svg').default} className="img-fluid" alt=""/>
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.Height2E}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged("2EWall", selected[0], "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.Height2E = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2EWall");
                                                                    setCart("Height2E", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(30, 500, 1, "cm", "", pageLanguage)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <NextStep eventKey="2F">{t("NEXT STEP")}</NextStep>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        }
                        
                        {/* step 2FWall */}
                        {stepSelectedValue["2"] === "2" && (stepSelectedValue["2A"] === "1" || stepSelectedValue["2A"] === "2") && ((stepSelectedValue["1"] === "2" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Wall")) &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="2F" stepNum={t("2F")} stepTitle={t("dk_step2FWall")} stepRef="2FWall" type="2" required={requiredStep["2FWall"]}
                                                        stepSelected={stepSelectedLabel["2FWall"] === undefined ? "" : stepSelectedLabel["2FWall"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2F">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("dk_step2FWall_title")}</p>
                                                <img
                                                    src={pageLanguage === 'fa' ? require('../Images/drapery/dk/RodtoFrame_track_full.svg').default : require('../Images/drapery/dk/RodtoFrame_track_full.svg').default}
                                                    className="img-fluid" alt=""/>
                                            </div>
                                            <div className="box100 Three_selection_container">
                                                <div className="box100">
                                                    {/*<label className="select_label">{t("Width")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.ShadeMount}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged("2FWall", selected[0], "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.ShadeMount = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2FWall");
                                                                    setCart("ShadeMount", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(10, 50, 1, "cm", "", pageLanguage)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <NextStep eventKey="2G">{t("NEXT STEP")}</NextStep>
                                        </div>
                                        <div className="accordion_help">
                                            <div className="help_container">
                                                <div className="help_column help_left_column">
                                                    <p className="help_column_header"/>
                                                    <ul className="help_column_list">
                                                        <li className="no_listStyle single_line_height">{t("dk_step2F_help_1")}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        }
                        
                        {/* step 2GWall*/}
                        {stepSelectedValue["2"] === "2" && (stepSelectedValue["2A"] === "1" || stepSelectedValue["2A"] === "2") && ((stepSelectedValue["1"] === "2" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Wall")) &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="2G" stepNum={t("2G")} stepTitle={t("dk_step2GWall")} stepRef="2GWall" type="2" required={requiredStep["2GWall"]}
                                                        stepSelected={stepSelectedLabel["2GWall"] === undefined ? "" : stepSelectedLabel["2GWall"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2G">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("dk_step2GWall_title")}</p>
                                                <img src={require('../Images/drapery/dk/CeilingToFloor1_track_full.svg').default} className="img-fluid" alt=""/>
                                            </div>
                                            <div className="box100 Three_selection_container">
                                                <div className="box100">
                                                    {/*<label className="select_label">{t("Height")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.CeilingToFloor}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged("2GWall", selected[0], "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.CeilingToFloor = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2GWall");
                                                                    setCart("CeilingToFloor", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(100, 500, 1, "cm", "", pageLanguage)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <NextStep eventKey="3">{t("NEXT STEP")}</NextStep>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        }
                        
                        {/* step 2EWallFloor */}
                        {stepSelectedValue["2"] === "2" && (stepSelectedValue["2A"] === "3") && ((stepSelectedValue["1"] === "2" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Wall")) &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="2E" stepNum={t("2E")} stepTitle={t("dk_step2FWall")} stepRef="2EWallFloor" type="2"
                                                        required={requiredStep["2EWallFloor"]}
                                                        stepSelected={stepSelectedLabel["2EWallFloor"] === undefined ? "" : stepSelectedLabel["2EWallFloor"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2E">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("dk_step2FWall_title")}</p>
                                                <img
                                                    src={pageLanguage === 'fa' ? require('../Images/drapery/dk/RodtoFrame_track_full.svg').default : require('../Images/drapery/dk/RodtoFrame_track_full.svg').default}
                                                    className="img-fluid" alt=""/>
                                            </div>
                                            <div className="box100 Three_selection_container">
                                                <div className="box100">
                                                    {/*<label className="select_label">{t("Width")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.ShadeMount}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged("2EWallFloor", selected[0], "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.ShadeMount = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2EWallFloor");
                                                                    setCart("ShadeMount", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(10, 50, 1, "cm", "", pageLanguage)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <NextStep eventKey="2G">{t("NEXT STEP")}</NextStep>
                                        </div>
                                        <div className="accordion_help">
                                            <div className="help_container">
                                                <div className="help_column help_left_column">
                                                    <p className="help_column_header"/>
                                                    <ul className="help_column_list">
                                                        <li className="no_listStyle single_line_height">{t("dk_step2F_help_1")}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        }
                        
                        {/* step 2FWallFloor*/}
                        {stepSelectedValue["2"] === "2" && (stepSelectedValue["2A"] === "3") && ((stepSelectedValue["1"] === "2" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Wall")) &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="2F" stepNum={t("2F")} stepTitle={t("dk_step2GWall")} stepRef="2FWallFloor" type="2"
                                                        required={requiredStep["2FWallFloor"]}
                                                        stepSelected={stepSelectedLabel["2FWallFloor"] === undefined ? "" : stepSelectedLabel["2FWallFloor"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2F">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("dk_step2GWall_title")}</p>
                                                <img src={require('../Images/drapery/dk/CeilingToFloor1_track_full.svg').default} className="img-fluid" alt=""/>
                                            </div>
                                            <div className="box100 Three_selection_container">
                                                <div className="box100">
                                                    {/*<label className="select_label">{t("Height")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.CeilingToFloor}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged("2FWallFloor", selected[0], "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.CeilingToFloor = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2FWallFloor");
                                                                    setCart("CeilingToFloor", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(100, 500, 1, "cm", "", pageLanguage)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <NextStep eventKey="3">{t("NEXT STEP")}</NextStep>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        }
                        
                        {/* step 2A inside */}
                        {stepSelectedValue["2"] === "2" && stepSelectedValue["1"] === "1" && step11 === "true" &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="2A" stepNum={t("2A")} stepTitle={t("zebra_step3AInside")} stepRef="2AIn" type="2" required={requiredStep["2AIn"]}
                                                        stepSelected={stepSelectedLabel["2AIn"] === undefined ? "" : stepSelectedLabel["2AIn"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2A">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("step3A_title")}</p>
                                                <img
                                                    src={pageLanguage === 'fa' ? require('../Images/drapery/zebra/width_inside_3_fa.svg').default : require('../Images/drapery/zebra/width_inside_3.svg').default}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.width1}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged_three(selected[0], "2AIn", 0, true, "widthDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.width1 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2AIn1");
                                                                    setCart("Width1", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(30, 300, 1, "cm", "", pageLanguage)}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.width2}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged_three(selected[0], "2AIn", 1, true, "widthDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.width2 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2AIn2");
                                                                    setCart("Width2", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(30, 300, 1, "cm", "", pageLanguage)}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.width3}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged_three(selected[0], "2AIn", 2, true, "widthDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.width3 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2AIn3");
                                                                    setCart("Width3", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(30, 300, 1, "cm", "", pageLanguage)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <NextStep eventKey="2B">{t("NEXT STEP")}</NextStep>
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
                        
                        {/* step 2B inside */}
                        {stepSelectedValue["2"] === "2" && stepSelectedValue["1"] === "1" && step11 === "true" &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="2B" stepNum={t("2B")} stepTitle={t("zebra_step3BInside")} stepRef="2BIn" type="2" required={requiredStep["2BIn"]}
                                                        stepSelected={stepSelectedLabel["2BIn"] === undefined ? "" : stepSelectedLabel["2BIn"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2B">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("step3B_title")}</p>
                                                <img
                                                    src={pageLanguage === 'fa' ? require('../Images/drapery/zebra/height_inside_3_fa.svg').default : require('../Images/drapery/zebra/height_inside_3.svg').default}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.height1}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged_three(selected[0], "2BIn", 0, false, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.height1 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2BIn1");
                                                                    setCart("Height1", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.height2}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged_three(selected[0], "2BIn", 1, false, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.height2 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2BIn2");
                                                                    setCart("Height2", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.height3}
                                                            dropdownRenderer={
                                                                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                            }
                                                            contentRenderer={
                                                                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"
                                                                                                               postfixFa=""/>
                                                            }
                                                            // optionRenderer={
                                                            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                            // }
                                                            onChange={(selected) => {
                                                                if (selected[0] !== undefined) {
                                                                    optionSelectChanged_three(selected[0], "2BIn", 2, false, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.height3 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "2BIn3");
                                                                    setCart("Height3", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <NextStep eventKey="3">{t("NEXT STEP")}</NextStep>
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
                        
                        {/* step 3 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="3" stepNum={t("3")} stepTitle={t("zebra_step1")} stepRef="3" type="1" required={requiredStep["3"]}
                                                    stepSelected={stepSelectedLabel["3"] === undefined ? "" : stepSelectedLabel["3"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3">
                                <Card.Body>
                                    <div className="card_body card-body-dk">
                                        {/*<h1 className="dk_no_width">Please complete previous steps to continue</h1>*/}
                                        <div className="dk_curtain_container">
                                            <div className="dk_curtain_button_container">
                                                {/*<button className="dk_curtain_symmetric btn" onClick={() => setSymmetric(false)}>*/}
                                                {/*    <img className="checkmark1 img-fluid" src={require('../Images/public/checkmark1.png')}*/}
                                                {/*         alt=""/>Deactivate symmetric coloring*/}
                                                {/*</button>*/}
                                                {/*<button className="dk_curtain_not_symmetric btn" onClick={() => setSymmetric(true)}>*/}
                                                {/*    <button className="btn-close"></button>*/}
                                                {/*    <h1>Activate symmetric coloring</h1></button>*/}
                                                <div className="dk_curtain_symmetric_buttons">
                                                    <button className={`dk_curtain_symmetric_button_left btn ${symmetric ? "dk_curtain_symmetric_button_on" : ""}`}
                                                            onClick={() => setSymmetric(true)}>
                                                        SYMMETRIC COLORING
                                                    </button>
                                                    <button className={`dk_curtain_symmetric_button_right btn ${!symmetric ? "dk_curtain_symmetric_button_on" : ""}`}
                                                            onClick={() => setSymmetric(false)}>
                                                        INDIVIDUAL COLORING
                                                    </button>
                                                </div>
                                                <button className="dk_curtain_clear btn" onClick={() => setDkCurtainArr([])}>CLEAR</button>
                                            </div>
                                            <div className="dk_curtain">
                                                <div className="dk_curtain_inside">
                                                    {dkCurtainList}
                                                </div>
                                            </div>
                                            {dkCurtainArr.length > 0 &&
                                                <div className={`dk_curtain_preview_container`}>
                                                    <Dropdown autoClose="outside" title="" align={pageLanguage === "fa" ? "end" : "start"}>
                                                        <Dropdown.Toggle className="basket_item_title_dropdown_btn">
                                                            <h4 className="dk_curtain_preview_item_details">{t("Selection Fabric Preview")}</h4>
                                                            <img className="select_control_handle_close img-fluid" src={require('../Images/public/arrow_down.svg').default}
                                                                 alt=""/>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu className="basket_item_title_dropdown dk_curtain_preview_dropdown">
                                                            <div className="dk_curtain_preview_detail_container">
                                                                {dkCurtainPreviewList}
                                                            </div>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            }
                                            <div className="dk_curtain_text_container">
                                                <h1 className="dk_curtain_text">
                                                    To create the color combination you want, you can customize by first clicking on the fabric color you want to use and then
                                                    clicking on the slides above.
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                    {/*<div className="card_body card-body-fabric card-body-dk-fabric">*/}
                                    <div className="card_body card-body-fabric">
                                        <div className="search_filter_container">
                                            <div className="search_container">
                                                <div className="search_box">
                                                    <input type="text" placeholder={t("Search for product Name/Code")}
                                                           className="form-control search_input"
                                                           name="search_input" value={searchText}
                                                           ref={search_input}
                                                           onChange={(e) => {
                                                               if (e.target.value !== "")
                                                                   setSearchShow(true);
                                                               else
                                                                   setSearchShow(false);
                                                               setSearchText(e.target.value);
                                                           }}/>
                                                    {searchShow &&
                                                        <div className="clear-icon-container" onClick={() => {
                                                            search_input.current.value = "";
                                                            setSearchText("");
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
                                                                {sewingColors}
                                                            </div>
                                                            <div className="filter_inside_button_section">
                                                                <div className="clear_inside_filter" text="colors"
                                                                     onClick={(e) => clearFilters(e)}>{t("filter_Clear Filters")}</div>
                                                                <Dropdown.Toggle as="div" className="done_inside_filter">{t("filter_Done")}</Dropdown.Toggle>
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
                                                                {sewingPatterns}
                                                            </div>
                                                            <div className="filter_inside_button_section">
                                                                <div className="clear_inside_filter" text="patterns"
                                                                     onClick={(e) => clearFilters(e)}>{t("filter_Clear Filters")}</div>
                                                                <Dropdown.Toggle as="div" className="done_inside_filter">{t("filter_Done")}</Dropdown.Toggle>
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
                                                                {sewingTypes}
                                                            </div>
                                                            <div className="filter_inside_button_section">
                                                                <div className="clear_inside_filter" text="types" onClick={(e) => clearFilters(e)}>{t("filter_Clear Filters")}</div>
                                                                <Dropdown.Toggle as="div" className="done_inside_filter">{t("filter_Done")}</Dropdown.Toggle>
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
                                                                {/*<div className="price_filter_description">{t("filter_price_title")}</div>*/}
                                                                {sewingPrices}
                                                            </div>
                                                            <div className="filter_inside_button_section">
                                                                <div className="clear_inside_filter" text="prices"
                                                                     onClick={(e) => clearFilters(e)}>{t("filter_Clear Filters")}</div>
                                                                <Dropdown.Toggle as="div" className="done_inside_filter">{t("filter_Done")}</Dropdown.Toggle>
                                                            </div>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="fabrics_list_container">
                                            {fabricsList}
                                        </div>
                                        <Modal dialogClassName="zoomModal" show={show} onHide={() => handleClose()}>
                                            <Modal.Header closeButton>
                                                {zoomModalHeader}
                                            </Modal.Header>
                                            <Modal.Body>{zoomModalBody}</Modal.Body>
                                            <Modal.Footer>
                                                <button className={`swatchButton ${hasSwatchId ? "activeSwatch" : ""} ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                                                        current-state={hasSwatchId ? "1" : "0"}
                                                        onClick={(e) => {
                                                            fabricSwatch(e, swatchId, swatchDetailId, swatchPhotoPath);
                                                        }}
                                                        disabled={swatchId === -1}>{hasSwatchId ? t("SWATCH IN CART") : t("ORDER SWATCH")}</button>
                                            </Modal.Footer>
                                        </Modal>
                                        <NextStep eventKey="4">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 4 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="4" stepNum={t("4")} stepTitle={t("DK_step4")} stepRef="4" type="1" required={requiredStep["4"]}
                                                    stepSelected={stepSelectedLabel["4"] === undefined ? "" : stepSelectedLabel["4"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="4">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/zebra/mount_inside.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("Left")} value="1" name="step4" ref-num="4" id="41" checked={step4 === "Left"}
                                                   onChange={e => {
                                                       selectChanged(e, "");
                                                       setStep4("Left");
                                                       setDeps("", "4");
                                                       setCart("StackPosition", "Left");
                                                   }} ref={ref => (inputs.current["41"] = ref)}/>
                                            <label htmlFor="41">{t("Left")}</label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/zebra/mount_inside.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("Right")} value="2" name="step4" ref-num="4" id="42" checked={step4 === "Right"}
                                                   onChange={e => {
                                                       selectChanged(e, "");
                                                       setStep4("Right");
                                                       setDeps("", "4");
                                                       setCart("StackPosition", "Right");
                                                   }} ref={ref => (inputs.current["42"] = ref)}/>
                                            <label htmlFor="42">{t("Right")}</label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/zebra/mount_inside.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("Center Split")} value="3" name="step4" ref-num="4" id="43"
                                                   checked={step4 === "CenterSplit"}
                                                   onChange={e => {
                                                       selectChanged(e, "");
                                                       setStep4("CenterSplit");
                                                       setDeps("", "4");
                                                       setCart("StackPosition", "CenterSplit");
                                                   }} ref={ref => (inputs.current["43"] = ref)}/>
                                            <label htmlFor="43">{t("Center Split")}</label>
                                        </div>
                                        <NextStep
                                            eventKey="5">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">
                                                        {t("dk_step4_help_1")}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 5 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="5" stepNum={t("5")} stepTitle={t("DK_step5")} stepRef="5" type="1" required={requiredStep["5"]}
                                                    stepSelected={stepSelectedLabel["5"] === undefined ? "" : stepSelectedLabel["5"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="5">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/zebra/mount_inside.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("Left")} value="1" name="step5" ref-num="5" id="51" checked={step5 === "Left"}
                                                   onChange={e => {
                                                       selectChanged(e, "");
                                                       setStep5("Left");
                                                       setDeps("", "5");
                                                       setCart("ControlPosition", "Left");
                                                   }} ref={ref => (inputs.current["51"] = ref)}/>
                                            <label htmlFor="51">{t("Left")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/zebra/mount_inside.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("Right")} value="5" name="step5" ref-num="5" id="52" checked={step5 === "Right"}
                                                   onChange={e => {
                                                       selectChanged(e, "");
                                                       setStep5("Right");
                                                       setDeps("", "5");
                                                       setCart("ControlPosition", "Right");
                                                   }} ref={ref => (inputs.current["52"] = ref)}/>
                                            <label htmlFor="52">{t("Right")}</label>
                                        </div>
                                        <NextStep eventKey="6">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">
                                                        {t("dk_step5_help_1")}
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
                                <ContextAwareToggle eventKey="7" stepNum={t("6")} stepTitle={t("zebra_step6")} stepRef="7" type="2" required={requiredStep["7"]}
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
            
            <Modal dialogClassName={`noMeasurements_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["noMeasurements"] === undefined ? false : modals["noMeasurements"]}
                   onHide={() => modalHandleClose("noMeasurements")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("modal_noMeasurements")}</p>
                    
                    <br/>
                    <div className=" text_center">
                        <button className=" btn btn-new-dark" onClick={() => modalHandleClose(" noPower")}>{t("CONTINUE")}</button>
                    </div>
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            <Modal dialogClassName={`noInsideUnderstand_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["noInsideUnderstand"] === undefined ? false : modals["noInsideUnderstand"]}
                   onHide={() => modalHandleClose(" noInsideUnderstand")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("modal_select_mount")}</p>
                    
                    {/*<br/>*/}
                    {/*<div className=" text_center">*/}
                    {/*    <button className=" btn btn-new-dark" onClick={() => modalHandleClose(" noMount")}>{t("CONTINUE")}</button>*/}
                    {/*</div>*/}
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
                   onHide={() => modalHandleClose("measurementsHelp")} scrollable={true}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <div className="measurementsHelp_modal_img_section">
                        <p className="measurementsHelp_modal_title">{t("HOW TO MEASURE FOR ZEBRA SHADES")}</p>
                        <p className="measurementsHelp_modal_img_title">{t("Inside Mount")}</p>
                        <object className="measurementsHelp_modal_img" type="image/svg+xml"
                                data={pageLanguage === 'fa' ? require('../Images/drapery/zebra/step3_help_inside_fa.svg').default : require('../Images/drapery/zebra/step3_help_inside.svg').default}/>
                    </div>
                    <div className="accordion_help measurementsHelp_modal_help_section">
                        <div className="help_container">
                            <div className="help_column help_left_column">
                                <p className="help_column_header">{t("TO DETERMINE INSIDE MOUNT")}</p>
                                <ul className="help_column_list">
                                    <li>{t("modal_help_1")}</li>
                                    <li>{t("modal_help_2")}</li>
                                    <li>{t("modal_help_2.5")}</li>
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
                                data={pageLanguage === 'fa' ? require('../Images/drapery/zebra/step3_help_outside_fa.svg').default : require('../Images/drapery/zebra/step3_help_outside.svg').default}/>
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
            
            <Modal dialogClassName={`upload_modal uploadImg_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["uploadImg"] === undefined ? false : modals["uploadImg"]}
                   onHide={() => {
                       setSelectedFile(undefined);
                       setSelectedFileName("");
                       setEditedFileName("");
                       modalHandleClose(" uploadImg");
                       setDetailsShow(false)
                   }}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <div onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                         onDrop={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                        
                             const {files} = e.dataTransfer;
                        
                             if (files && files.length && (files[0].type === "image/jpg" || files[0].type === "image/jpeg" || files[0].type === "image/png")) {
                                 uploadImg(files[0]);
                             } else {
                                 setSelectedFile(undefined);
                                 setSelectedFileName("");
                             }
                         }}>
                        <h2>{t("upload_img1")}</h2>
                        <p className="file_size_description">{t("upload_img2")}</p>
                        <div className="controls">
                            <div className="modal_upload_section">
                                <div className="modal_upload_item">
                                    <label htmlFor="image-upload-btn" className="btn btn-new-gray file-upload-btn">
                                        {t("upload_img3")}
                                        <input type="file" className="custom-file file-upload" id="image-upload-btn" name="file" accept="image/png,image/jpeg,image/jpg"
                                               onChange={(e) => {
                                                   if (e.target.files && e.target.files.length) {
                                                       uploadImg(e.target.files[0]);
                                                   } else {
                                                       setSelectedFile(undefined);
                                                       setSelectedFileName("");
                                                   }
                                               }}
                                               onDragOver={(e) => {
                                                   e.preventDefault();
                                                   e.stopPropagation();
                                               }}
                                               onDrop={(e) => {
                                                   e.preventDefault();
                                                   e.stopPropagation();
                                            
                                                   const {files} = e.dataTransfer;
                                            
                                                   if (files && files.length && (files[0].type === "image/jpg" || files[0].type === "image/jpeg" || files[0].type === "image/png")) {
                                                       uploadImg(files[0]);
                                                   } else {
                                                       setSelectedFile(undefined);
                                                       setSelectedFileName("");
                                                   }
                                               }}
                                        />
                                    </label>
                                    <div className="file-name file-upload-btn">{selectedFileName === "" ? t("upload_img5") : selectedFileName}</div>
                                </div>
                                <div className="modal_upload_item">
                                    <input className="file_name_text" type="text" value={editedFileName} onChange={(e) => setEditedFileName(e.target.value)}
                                           placeholder={t("upload_img4")}/>
                                </div>
                            </div>
                        </div>
                        <div className="controls">
                            <div className="modal_button_section">
                                <button className="btn btn-new-gray" onClick={() => {
                                    setSelectedFile(undefined);
                                    setSelectedFileName("");
                                    setEditedFileName("");
                                    modalHandleClose("uploadImg");
                                    setDetailsShow(false)
                                }}>{t("Cancel")}
                                </button>
                                <div className="btn btn-new-dark image_submit file-upload-btn btn-disabled" onClick={() => {
                                    submitUploadedFile(2);
                                }} disabled={selectedFileName === "" || isUploading}>{isUploading ? t("UPLOADING...") : t("Upload Image")}
                                </div>
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
                    <div onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                         onDrop={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                        
                             const {files} = e.dataTransfer;
                        
                             if (files && files.length && files[0].type === "application/pdf") {
                                 uploadImg(files[0]);
                             } else {
                                 setSelectedFile(undefined);
                                 setSelectedFileName("");
                             }
                         }}>
                        <h2>{t("upload_pdf1")}</h2>
                        <p className="file_size_description">{t("upload_pdf2")}</p>
                        <div className="controls">
                            <div className="modal_upload_section">
                                <div className="modal_upload_item">
                                    <label htmlFor="file-upload-btn" className="btn btn-new-gray file-upload-btn">
                                        {t("upload_pdf3")}
                                        <input type="file" className="custom-file file-upload" name="file" id="file-upload-btn" accept="application/pdf"
                                               onChange={(e) => {
                                                   if (e.target.files && e.target.files.length) {
                                                       uploadImg(e.target.files[0]);
                                                   } else {
                                                       setSelectedFile(undefined);
                                                       setSelectedFileName("");
                                                   }
                                               }}
                                               onDragOver={(e) => {
                                                   e.preventDefault();
                                                   e.stopPropagation();
                                               }}
                                               onDrop={(e) => {
                                                   e.preventDefault();
                                                   e.stopPropagation();
                                            
                                                   const {files} = e.dataTransfer;
                                            
                                                   if (files && files.length && files[0].type === "application/pdf") {
                                                       uploadImg(files[0]);
                                                   } else {
                                                       setSelectedFile(undefined);
                                                       setSelectedFileName("");
                                                   }
                                               }}/>
                                    </label>
                                    <div className="file-name file-upload-btn">{selectedFileName === "" ? t("upload_pdf5") : selectedFileName}</div>
                                </div>
                                <div className="modal_upload_item">
                                    <input className="file_name_text" type="text" value={editedFileName} onChange={(e) => setEditedFileName(e.target.value)}
                                           placeholder={t("upload_pdf4")}/>
                                </div>
                            </div>
                        </div>
                        <div className="controls">
                            <div className="modal_button_section">
                                <button className="btn btn-new-gray" onClick={() => {
                                    setSelectedFile(undefined);
                                    setSelectedFileName("");
                                    setEditedFileName("");
                                    modalHandleClose("uploadPdf");
                                    setDetailsShow(false)
                                }}>{t("Cancel")}
                                </button>
                                <div className="btn btn-new-dark image_submit file-upload-btn btn-disabled" onClick={() => {
                                    submitUploadedFile(1);
                                }} disabled={selectedFileName === "" || isUploading}>{isUploading ? t("UPLOADING...") : t("Upload PDF")}
                                </div>
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
                       modalHandleClose("widthDifferent");
                   }}>
                <Modal.Header>
                    {/*<div className="required"/>*/}
                    <p>{t("WIDTH DISCREPANCIES")}</p>
                </Modal.Header>
                <Modal.Body>
                    <p>{t("WIDTH DISCREPANCIES_1")}</p>
                    <br/>
                    <p>{t("WIDTH DISCREPANCIES_2")}</p>
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
                        <button className="btn white_btn" onClick={() => {
                            modalHandleClose("widthDifferent");
                            setAccordionActiveKey("3B");
                        }}>{t("I AGREE, CONTINUE ANYWAY")}
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
                    <br/>
                    <span>{t("addToCartErr1")}</span>
                    {/*<span>{t("addToCartErr2")}</span>*/}
                    <span>{t("addToCartErr3")}</span>
                    
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
                    {/*<div className="required"/>*/}
                    <p>{t("HEIGHT DISCREPANCIES")}</p>
                </Modal.Header>
                <Modal.Body>
                    <p>{t("HEIGHT DISCREPANCIES_1")}</p>
                    <br/>
                    <p>{t("HEIGHT DISCREPANCIES_2")}</p>
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
                        <button className="btn white_btn" onClick={() => {
                            modalHandleClose("heightDifferent");
                            setAccordionActiveKey("4");
                        }}>{t("I AGREE, CONTINUE ANYWAY")}
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
                        <h1 className="cart_agree_title1">{t("REVIEW ORDER")}</h1>
                    }
                    {!cartStateAgree &&
                        <h2 className="cart_agree_title2">{t("TERMS OF SALE")}</h2>
                    }
                    {!cartStateAgree &&
                        <div>{cartAgree}</div>
                    }
                    {!cartStateAgree &&
                        <span className="cart_agree_desc">
                        <div className="checkbox_style">
                            <input type="checkbox" checked={cartAgreeDescription} onChange={(e) => {
                                setCartAgreeDescription(e.target.checked);
                            }} id="cartAgreeDescription"/>
                            <label htmlFor="cartAgreeDescription" className="checkbox_label">
                                <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')}
                                     alt=""/>
                            </label>
                            <span className="checkbox_text">
                                {t("cart_agree_desc")}
                                <p className="return_policy">{t("Return Policy")}</p>.
                            </span>
                        </div>
                    </span>
                    }
                    {!cartStateAgree &&
                        <div className="go_to_checkout">
                            <button className="basket_checkout" onClick={() => {
                                setAddingLoading(true);
                                addToCart_agreed();
                            }} disabled={addingLoading || !cartAgreeDescription}>{addingLoading ? t("ADDING...") : t("AGREE & ADD TO BAG")}
                            </button>
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    {cartStateAgree &&
                        <div className="go_to_checkout">
                            <div className="checkout_button_section small_checkout_button_section">
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
                                            //     window.scrollTo(window.scrollX, window.scrollY + 1);
                                            //     setTimeout(() => {
                                            //         let temp2 = window.scrollY;
                                            //         if (temp2 === temp1)
                                            //             window.scrollTo(window.scrollX, window.scrollY - 1);
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
                                                setSavingLoading(true);
                                                if (projectId && projectId !== "") {
                                                    SaveUserProject(depSet, cartValues, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], `${modelID}`, price, defaultModelName, defaultModelNameFa, projectData).then((temp) => {
                                                        if (temp === 401) {
                                                            setSaveProjectCount(saveProjectCount + 1);
                                                        } else if (temp) {
                                                            modalHandleShow("add_to_project_modal");
                                                            setProjectModalState(1);
                                                            setSavingLoading(false);
                                                        } else {
                                                            console.log("project not saved!");
                                                            setSavingLoading(false);
                                                        }
                                                    }).catch(() => {
                                                        // console.log("hi4");
                                                        setProjectModalState(2);
                                                        setSavingLoading(false);
                                                    });
                                                } else {
                                                    SaveUserProject(depSet, cartValues, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], `${modelID}`, price, defaultModelName, defaultModelNameFa).then((temp) => {
                                                        if (temp === 401) {
                                                            setSaveProjectCount(saveProjectCount + 1);
                                                        } else if (temp) {
                                                            setProjectModalState(1);
                                                            setSavingLoading(false);
                                                        } else {
                                                            console.log("project not saved!");
                                                            setSavingLoading(false);
                                                        }
                                                    }).catch((err) => {
                                                        // console.log("hi3",);
                                                        setProjectModalState(2);
                                                        setSavingLoading(false);
                                                    });
                                                }
                                            } else {
                                                setProjectModalState(0);
                                            }
                                        }} disabled={savingLoading}>{savingLoading ? t("SAVING...") : t("SAVE ITEM")}
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
            
            <Modal backdrop="static" keyboard={false}
                   className={`cart_modal_container cart_agree_container add_to_project_modal side_login_modal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   dialogClassName={`cart_modal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["side_login_modal"] === undefined ? false : modals["side_login_modal"]}
                   onHide={() => {
                       modalHandleClose("side_login_modal");
                       setSwatchLogin(false);
                   }} id="side_login_modal">
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <ModalLogin/>
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
                                setSavingLoading(true);
                                if (projectId && projectId !== "") {
                                    SaveUserProject(depSet, cartValues, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], `${modelID}`, price, defaultModelName, defaultModelNameFa, projectData).then((temp) => {
                                        if (temp === 401) {
                                            setSaveProjectCount(saveProjectCount + 1);
                                        } else if (temp) {
                                            modalHandleShow("add_to_project_modal");
                                            setProjectModalState(1);
                                            setSavingLoading(false);
                                        } else {
                                            console.log("project not saved!");
                                            setSavingLoading(false);
                                        }
                                    }).catch(() => {
                                        // console.log("hi2");
                                        setProjectModalState(2);
                                        modalHandleShow("add_to_project_modal");
                                        setSavingLoading(false);
                                    });
                                } else {
                                    SaveUserProject(depSet, cartValues, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], `${modelID}`, price, defaultModelName, defaultModelNameFa).then((temp) => {
                                        if (temp === 401) {
                                            console.log("hi1");
                                            setSaveProjectCount(saveProjectCount + 1);
                                        } else if (temp) {
                                            modalHandleShow("add_to_project_modal");
                                            setProjectModalState(1);
                                            setSavingLoading(false);
                                        } else {
                                            console.log("project not saved!");
                                            setSavingLoading(false);
                                        }
                                    }).catch(() => {
                                        // console.log("hi1");
                                        setProjectModalState(2);
                                        modalHandleShow("add_to_project_modal");
                                        setSavingLoading(false);
                                    });
                                }
                            } else {
                                setProjectModalState(0);
                                modalHandleShow("add_to_project_modal");
                            }
                        }} disabled={savingLoading}>{savingLoading ? t("SAVING...") : t("footer_Save To")}<br/>{savingLoading ? "" : t("footer_My Account")}</button>
                    </div>
                    <div className="hidden_inner_footer">&nbsp;</div>
                    <div className="footer_price_section">
                        <div className="showPrice">{t("footer_Price")}</div>
                        <div className="price">{GetPrice(price, pageLanguage, t("TOMANS"))}</div>
                    </div>
                    <div className="right_footer">
                        <input type="submit" onClick={() => {
                            setAddingLoading(true);
                            addToCart();
                        }} className="btn add_to_cart" disabled={addingLoading} value={addingLoading ? t("ADDING...") : t("footer_Add" +
                            " To Cart")} readOnly/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DK;