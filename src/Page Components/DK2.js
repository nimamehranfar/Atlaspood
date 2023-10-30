import {Link, useLocation, useNavigate} from "react-router-dom";
import React, {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import {Accordion, AccordionContext, Card, useAccordionButton} from "react-bootstrap"
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
// import Select from 'react-select';
import Select from "react-dropdown-select";
import ReactImageMagnify from '@blacklab/react-image-magnify';
import * as qs from 'qs'
import PopoverStickOnHover from "../Components/PopoverStickOnHover";
import CustomControl from "../Components/CustomControl";
import CustomDropdown from "../Components/CustomDropdown";
import SelectOptionRange from "../Components/SelectOptionRange";
import CustomDropdownWithSearch from "../Components/CustomDropdownWithSearch";
import CustomControlNum from "../Components/CustomControlNum";
import NumberToPersianWord from "number_to_persian_word";
// import CartInfo from "../Components/CartInfo"
import UserProjects from "../Components/UserProjects";
import GetPrice from "../Components/GetPrice";
import {useDispatch, useSelector} from "react-redux";
import {CartUpdatedTrue, ShowLogin2Modal} from "../Actions/types";
import authHeader from "../Services/auth-header";
import SaveUserProject from "../Components/SaveUserProject";
import {refreshToken} from "../Services/auth.service";
import GetUserProjectData from "../Components/GetUserProjectData";
import setGetDeps from "../Components/setGetDeps";
import ModalLogin from "../Components/ModalLogin";
import AddProjectToCart from "../Components/AddProjectToCart";
import GetMeasurementArray from "../Components/GetMeasurementArray";
import GetSewingFilters from "../Components/GetSewingFilters";
import TruncateMarkup from "react-truncate-markup";
import {Capitalize, CapitalizeAllWords, NumToFa, Uppercase} from "../Components/TextTransform";
import {DebounceInput} from "react-debounce-input";
import {convertToPersian} from "../Components/TextTransform";
import GetBasketZipcode from "../Components/GetBasketZipcode";
import {rooms} from "../Components/Static_Labels";


const baseURLCats = "https://api.atlaspood.ir/WebsitePage/GetDetailByName";
const baseURLPageItem = "https://api.atlaspood.ir/WebsitePageItem/GetById";
const baseURLModel = "https://api.atlaspood.ir/SewingModel/GetById";
const baseURLFabrics = "https://api.atlaspood.ir/Sewing/GetModelFabric";
const baseURLWindowSize = "https://api.atlaspood.ir/Sewing/GetWindowSize";
const baseURLPrice = "https://api.atlaspood.ir/Sewing/GetSewingOrderPrice";
const baseURLZipCode = "https://api.atlaspood.ir/Sewing/HasInstall";
const baseURLHasZipCode = "https://api.atlaspood.ir/Cart/GetAlreadyZipCode/1";
const baseURLFreeShipping = "https://api.atlaspood.ir/WebsiteSetting/GetFreeShippingAmount";
const baseURGetProject = "https://api.atlaspood.ir/SewingOrder/GetById";
const baseURLGetCart = "https://api.atlaspood.ir/cart/GetAll";
const baseURLUploadImg = "https://api.atlaspood.ir/SewingOrderAttachment/ImageUpload";
const baseURLUploadPdf = "https://api.atlaspood.ir/SewingOrderAttachment/PdfUpload";
const baseURLDeleteFile = "https://api.atlaspood.ir/SewingOrderAttachment/Delete";
const baseURLEditProject = "https://api.atlaspood.ir/SewingOrder/Edit";
const baseURLDeleteBasketProject = "https://api.atlaspood.ir/Cart/DeleteItem";
const baseURLAddSwatch = "https://api.atlaspood.ir/Cart/Add";
const baseURLFilterPattern = "https://api.atlaspood.ir/Sewing/GetModelPatternType";
const baseURLFilterType = "https://api.atlaspood.ir/Sewing/GetModelDesignType";
const baseURLFilterPrice = "https://api.atlaspood.ir/BaseType/GetPriceLevel";


function DK2({CatID, ModelID, PageType, ProjectId, EditIndex, PageItem, QueryString, Parameters, PageId}) {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const firstRender = useRef(true);
    const firstRenderDK = useRef(true);
    const [catID, setCatID] = useState(CatID);
    const [modelID, setModelID] = useState(ModelID);
    const [pageType, setPageType] = useState(PageType);
    const [projectId, setProjectId] = useState(ProjectId);
    const [editIndex, setEditIndex] = useState(EditIndex);
    const [pageItem, setPageItem] = useState(PageItem);
    const [queryString, setQueryString] = useState(QueryString);
    const [parameters, setParameters] = useState(Parameters);
    const [pageId, setPageId] = useState(PageId);
    const {isLoggedIn, isRegistered, user, showLogin} = useSelector((state) => state.auth);
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageLoad, setPageLoad] = useState(undefined);
    const [pageLoadDK, setPageLoadDK] = useState(undefined);
    const [motorLoad, setMotorLoad] = useState(false);
    const [motorLoad2, setMotorLoad2] = useState(false);
    const [models, setModels] = useState([]);
    const [projectData, setProjectData] = useState({});
    const [model, setModel] = useState({});
    const [modelAccessories, setModelAccessories] = useState({});
    const [noWidth, setNoWidth] = useState({});
    const [fabrics, setFabrics] = useState({});
    const [fabricsList, setFabricsList] = useState([]);
    const [fabricsList2, setFabricsList2] = useState([]);
    const [baseOneArr, setBaseOneArr] = useState([]);
    const [decorativeOneArr, setDecorativeOneArr] = useState([]);
    const [baseMore, setBaseMore] = useState(true);
    const [decorativeMore, setDecorativeMore] = useState(true);
    const [baseActive, setBaseActive] = useState(null);
    const [decorativeActive, setDecorativeActive] = useState(null);
    const [fabricColorHtmlCode, setFabricColorHtmlCode] = useState("#000");
    const [dkCurtainList, setDkCurtainList] = useState([]);
    const [dkCurtainPreviewList, setDkCurtainPreviewList] = useState([]);
    const [showMoreFabric, setShowMoreFabric] = useState("");
    const [showLessFabric, setShowLessFabric] = useState("");
    const [dkCurtainArr, setDkCurtainArr] = useState([]);
    const [curtainChangeId, setCurtainChangeId] = useState(-1);
    const [dkCurtainArrComplete, setDkCurtainArrComplete] = useState(false);
    const [dkCurtainArrCount, setDkCurtainArrCount] = useState(0);
    const [sodFabrics, setSodFabrics] = useState([]);
    const [symmetric, setSymmetric] = useState(true);
    const [defaultFabricPhoto, setDefaultFabricPhoto] = useState(null);
    const [defaultModelName, setDefaultModelName] = useState("");
    const [defaultModelNameFa, setDefaultModelNameFa] = useState("");
    const [defaultModelDesc, setDefaultModelDesc] = useState("");
    const [defaultModelDescFa, setDefaultModelDescFa] = useState("");
    const [price, setPrice] = useState(0);
    const [bagPrice, setBagPrice] = useState(0);
    const [fabricQty, setFabricQty] = useState(0);
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [freeShipPrice, setFreeShipPrice] = useState(0);
    const [show, setShow] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchShow, setSearchShow] = useState(false);
    const [measurementsNextStep, setMeasurementsNextStep] = useState("3");
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
    const [bag, setBag] = useState({});
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
    const [headerTruncated, setHeaderTruncated] = useState([]);
    const [detailsShow, setDetailsShow] = useState(false);
    const [filtersShow, setFiltersShow] = useState(false);
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
        "Width2B": [],
        "height3C": [],
        "shadeMount": []
    });
    const [width, setWidth] = useState(undefined);
    const [height, setHeight] = useState(undefined);
    const [width1, setWidth1] = useState(undefined);
    const [width2, setWidth2] = useState(undefined);
    const [width3, setWidth3] = useState(undefined);
    const [height1, setHeight1] = useState(undefined);
    const [height2, setHeight2] = useState(undefined);
    const [height3, setHeight3] = useState(undefined);
    const [windowToFloor, setWindowToFloor] = useState(undefined);
    const [ceilingToWindow1, setCeilingToWindow1] = useState(undefined);
    const [ceilingToWindow2, setCeilingToWindow2] = useState(undefined);
    const [ceilingToWindow3, setCeilingToWindow3] = useState(undefined);
    const [ceilingToFloor, setCeilingToFloor] = useState(undefined);
    const [ceilingToFloor1, setCeilingToFloor1] = useState(undefined);
    const [ceilingToFloor2, setCeilingToFloor2] = useState(undefined);
    const [ceilingToFloor3, setCeilingToFloor3] = useState(undefined);
    const [width2B, setWidth2B] = useState(undefined);
    const [left, setLeft] = useState(undefined);
    const [right, setRight] = useState(undefined);
    const [height2D, setHeight2D] = useState(undefined);
    const [mount, setMount] = useState(undefined);
    
    const [requiredStep, setRequiredStep] = useState({});
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
    
    const [depSet, setDepSet] = useState(new Set(['1', '2', '3', '4', '61', '62']));
    
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
    const stepHeaders = useRef([]);
    const draperyRef = useRef([]);
    
    const [filterChanged, setFilterChanged] = useState({
        filter: 0,
        filter_id: undefined,
        isDelete: false
    });
    
    const [filterColors, setFilterColors] = useState([...queryString["colors"]]);
    const [filterPatterns, setFilterPatterns] = useState([...queryString["patterns"]]);
    const [filterTypes, setFilterTypes] = useState([...queryString["types"]]);
    const [filterPrices, setFilterPrices] = useState([...queryString["prices"]]);
    const [filterDesigns, setFilterDesigns] = useState([...queryString["designs"]]);
    const [selectedMountOutsideType, setSelectedMountOutsideType] = useState([]);
    
    const [isClearAll, setIsClearAll] = useState(false);
    
    const [step1, setStep1] = useState("");
    const [step11, setStep11] = useState("");
    const [step2, setStep2] = useState("");
    const [step2A, setStep2A] = useState("");
    const [step3, setStep3] = useState("");
    const [step4, setStep4] = useState("");
    const [step4A, setStep4A] = useState("");
    const [step5, setStep5] = useState("");
    const [step51, setStep51] = useState("");
    const [zipcodeChecked, setZipcodeChecked] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [zipcodeButton, setZipcodeButton] = useState(false);
    const [hasZipcode, setHasZipcode] = useState(null);
    const [hasInstall, setHasInstall] = useState(null);
    const [installPrice, setInstallPrice] = useState(-1);
    const [transportPrice, setTransportPrice] = useState(-1);
    const [selectedRoomLabel, setSelectedRoomLabel] = useState([]);
    
    const [step21Err1, setStep21Err1] = useState(false);
    const [step21Err2, setStep21Err2] = useState(false);
    const [step21Err3, setStep21Err3] = useState(false);
    const [motorErr1, setMotorErr1] = useState(false);
    
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
    const [cartLoading, setCartLoading] = useState(false);
    const [savingLoading, setSavingLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [swatchLogin, setSwatchLogin] = useState(false);
    const [swatchLoginSwatchId, setSwatchLoginSwatchId] = useState(null);
    const [swatchLoginSwatchDetailId, setSwatchLoginSwatchDetailId] = useState(null);
    
    const [helpMeasure, setHelpMeasure] = useState("Inside");
    const [helpMeasureLengthType, setHelpMeasureLengthType] = useState("Sill");
    const [customMotorAcc, setCustomMotorAcc] = useState({});
    
    const [MotorType, setMotorType] = useState({
        "en": [
            {value: 'Angle Rotation Motor', label: 'Angle Rotation Motor'},
            {value: 'Open & Close Motor', label: 'Open & Close Motor'},
            {value: 'Angle Rotation and Open & Close Motor', label: 'Angle Rotation and Open & Close Motor'}
        ],
        "fa": [
            {value: 'Angle Rotation Motor', label: 'موتور سايه روشن'},
            {value: 'Open & Close Motor', label: 'موتور جمع و باز'},
            {value: 'Angle Rotation and Open & Close Motor', label: 'موتور سايه روشن و جمع و باز'}
        ],
    });
    
    useEffect(() => {
        if (Object.keys(modelAccessories).length > 0) {
            let tempObj = {
                "en": [
                    {
                        value: 'Angle Rotation Motor',
                        label: "Angle Rotation Motor (" + GetPrice(modelAccessories["24"]["41"]["Price"], pageLanguage, t("TOMANS")) + ")",
                        apiAccValue: {
                            "SewingAccessoryId": 24,
                            "SewingModelAccessoryId": 0,
                            "SewingAccessoryValue": "90908101",
                            "Qty": 1
                        }
                    },
                    {
                        value: 'Open & Close Motor',
                        label: "Open & Close Motor  (" + GetPrice(modelAccessories["24"]["42"]["Price"], pageLanguage, t("TOMANS")) + ")",
                        apiAccValue: {
                            "SewingAccessoryId": 24,
                            "SewingModelAccessoryId": 0,
                            "SewingAccessoryValue": "90908102",
                            "Qty": 1
                        }
                    },
                    {
                        value: 'Angle Rotation and Open & Close Motor',
                        label: "Angle Rotation and\nOpen & Close Motor  (" + GetPrice(modelAccessories["24"]["43"]["Price"], pageLanguage, t("TOMANS")) + ")",
                        apiAccValue: {
                            "SewingAccessoryId": 24,
                            "SewingModelAccessoryId": 0,
                            "SewingAccessoryValue": "90908103",
                            "Qty": 1
                        }
                    },
                ],
                "fa": [
                    {
                        value: 'Angle Rotation Motor',
                        label: "موتور سايه روشن (" + GetPrice(modelAccessories["24"]["41"]["Price"], pageLanguage, t("TOMANS")) + ")",
                        apiAccValue: {
                            "SewingAccessoryId": 24,
                            "SewingModelAccessoryId": 0,
                            "SewingAccessoryValue": "90908101",
                            "Qty": 1
                        }
                    },
                    {
                        value: 'Open & Close Motor',
                        label: "موتور جمع و باز (" + GetPrice(modelAccessories["24"]["42"]["Price"], pageLanguage, t("TOMANS")) + ")",
                        apiAccValue: {
                            "SewingAccessoryId": 24,
                            "SewingModelAccessoryId": 0,
                            "SewingAccessoryValue": "90908102",
                            "Qty": 1
                        }
                    },
                    {
                        value: 'Angle Rotation and Open & Close Motor',
                        label: "موتور سايه روشن و جمع و باز (" + GetPrice(modelAccessories["24"]["43"]["Price"], pageLanguage, t("TOMANS")) + ")",
                        apiAccValue: {
                            "SewingAccessoryId": 24,
                            "SewingModelAccessoryId": 0,
                            "SewingAccessoryValue": "90908103",
                            "Qty": 1
                        }
                    },
                ],
                
            }
            setMotorType(tempObj);
            if (selectedMotorType.length) {
                if (!motorLoad2) {
                    setMotorLoad2(true);
                }
                setSelectedMotorType(selectedMotorType[0].value ? [{
                    value: selectedMotorType[0].value,
                    label: tempObj[pageLanguage].find(opt => opt.value === selectedMotorType[0].value).label
                }] : []);
                if (motorLoad) {
                    setTimeout(() => {
                        setMotorLoad(false);
                    }, 500);
                }
            }
            setSelectedMotorMinPrice(Math.min(modelAccessories["24"]["41"]["Price"] || 0, modelAccessories["24"]["42"]["Price"] || 0, modelAccessories["24"]["43"]["Price"] || 0));
        }
    }, [JSON.stringify(modelAccessories), pageLanguage]);
    
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
            setTimeout(() => {
                setIsClearAll(false);
            }, 1000);
        }).catch(err => {
            console.log(err);
            setTimeout(() => {
                setIsClearAll(false);
            }, 1000);
        });
    };
    
    function getFabricsWithFilter(clearAll) {
        if (clearAll) {
            getFabrics();
        } else {
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
            let promise5 = new Promise((resolve, reject) => {
                if (filterDesigns.length > 0) {
                    paramObj["designs"] = [];
                    filterDesigns.forEach((filter_id, index) => {
                        paramObj["designs"] = [...paramObj["designs"], filter_id];
                        if (index === filterDesigns.length - 1) {
                            resolve();
                        }
                    });
                } else {
                    resolve();
                }
            });
            
            Promise.all([promise1, promise2, promise3, promise4, promise5]).then(() => {
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
                    setShowLessFabric("");
                    setFabrics(tempFabrics);
                    // console.log(tempFabrics);
                }).catch(err => {
                    console.log(err);
                });
            })
        }
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
        const fabricList2 = [];
        let count = 0;
        let cartObj = {};
        let temp = [];
        let pageLanguage1 = location.pathname.split('').slice(1, 3).join('');
        
        let baseOneArr = [];
        let decorativeOneArr = [];
        
        let params = parameters === undefined || parameters === null || parameters === "undefined" || parameters === "null" || parameters === "" ? "{}" : JSON.parse(JSON.stringify(parameters));
        
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
            let DesignCode = fabrics[key][0]["DesignCode"].toString();
            let designOrderSelected = params["Designs"] && params["Designs"][DesignCode] && (params["Designs"][DesignCode]["order"] && params["Designs"][DesignCode]["order"] >= 0) ? params["Designs"][DesignCode]["order"] : -1;
            let designTypeSelected = params["Designs"] && params["Designs"][DesignCode] && params["Designs"][DesignCode]["type"] ? params["Designs"][DesignCode]["type"] : "none";
            let designOnlyOneSelected = params["Designs"] && params["Designs"][DesignCode] && params["Designs"][DesignCode]["onlyOne"] ? params["Designs"][DesignCode]["onlyOne"] : false;
            let showMoreCount = designTypeSelected === "Base" ? 4 : 8;
            let SamplePrice = fabrics[key][0]["SamplePrice"];
            
            const fabric = [];
            for (let j = 0; j < fabrics[key].length; j++) {
                if (j === showMoreCount && !fabrics[key][j]["ShowMore"]) {
                    fabric.push(
                        <div key={j} className="dk_fabric_show_more_button_container">
                            <button className="dk_fabric_show_more_button btn"
                                    onClick={() => setShowMoreFabric(key)}>{pageLanguage1 === 'fa' ? "رنگ های بیشتری را ببینید" : "VIEW ALL COLOR OPTIONS"}</button>
                        </div>
                    );
                } else if (j > showMoreCount && !fabrics[key][j]["ShowMore"]) {
                
                } else {
                    let FabricId = fabrics[key][j].FabricId;
                    let fabricOrderSelected = params["Fabrics"] && params["Fabrics"][FabricId] && (params["Fabrics"][FabricId]["order"] || params["Fabrics"][FabricId]["order"] === 0) ? params["Fabrics"][FabricId]["order"] : -1;
                    
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
                    let pushIndex = 0;
                    if (fabricOrderSelected !== -1 && !fabric[fabricOrderSelected]) {
                        pushIndex = fabricOrderSelected;
                    } else if (fabricOrderSelected !== -1 && fabric[fabricOrderSelected]) {
                        fabric[fabric.length] = JSON.parse(JSON.stringify(fabric[fabricOrderSelected]));
                        pushIndex = fabricOrderSelected;
                    } else {
                        pushIndex = fabric.length;
                    }
                    fabric[pushIndex] =
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
                                    }} disabled={SwatchId === -1}>{HasSwatchId ? (pageLanguage1 === 'en' ? "SWATCH IN CART" : "نمونه در سبد") : (pageLanguage1 === 'en' ? "ORDER" +
                                " SWATCH" : "سفارش نمونه")}</button>
                        </div>;
                    if (j === fabrics[key].length - 1 && fabrics[key][j]["ShowMore"]) {
                        fabric.push(
                            <div key={j} className="dk_fabric_show_more_button_container">
                                <button className="dk_fabric_show_more_button btn"
                                        onClick={() => setShowLessFabric(key)}>{pageLanguage1 === 'fa' ? "رنگ های کمتری را ببینید" : "VIEW LESS COLOR OPTIONS"}</button>
                            </div>
                        );
                    }
                }
            }
            
            let pushIndex = 0;
            
            if (designTypeSelected === "Base") {
                if (designOrderSelected !== -1 && !fabricList[designOrderSelected]) {
                    pushIndex = designOrderSelected;
                } else if (designOrderSelected !== -1 && fabricList[designOrderSelected]) {
                    fabricList[fabricList.length] = JSON.parse(JSON.stringify(fabricList[designOrderSelected]));
                    pushIndex = designOrderSelected;
                } else {
                    let index = fabricList.findIndex(Object.is.bind(null, undefined));
                    pushIndex = index === -1 ? fabricList.length : index;
                }
                
                baseOneArr.push(DesignCode);
                fabricList[pushIndex] =
                    <div className={`material_detail ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`} key={"fabric" + key}>
                        <div className={`material_traits ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`}>
                            <hr/>
                            <span><p>{pageLanguage1 === 'en' ? "DESIGN NAME" : "نام طرح"}: {pageLanguage1 === 'en' ? DesignEnName : DesignName}</p><span className="fabric_seperator">&nbsp;|&nbsp;</span><p>{pageLanguage1 === 'en' ? "FROM" : "شروع از"}: {GetPrice(SamplePrice, pageLanguage1, pageLanguage1 === "en" ? "Tomans" : "تومان")}</p></span>
                        </div>
                        {fabric}
                    </div>;
            } else {
                if (designOrderSelected !== -1 && !fabricList2[designOrderSelected]) {
                    pushIndex = designOrderSelected;
                } else if (designOrderSelected !== -1 && fabricList2[designOrderSelected]) {
                    fabricList2[fabricList2.length] = JSON.parse(JSON.stringify(fabricList2[designOrderSelected]));
                    pushIndex = designOrderSelected;
                } else {
                    let index = fabricList2.findIndex(Object.is.bind(null, undefined));
                    pushIndex = index === -1 ? fabricList2.length : index;
                }
                
                decorativeOneArr.push(DesignCode);
                fabricList2[pushIndex] =
                    <div className={`material_detail ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`} key={"fabric" + key}>
                        <div className={`material_traits ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`}>
                            <hr/>
                            <span><p>{pageLanguage1 === 'en' ? "DESIGN NAME" : "نام طرح"}: {pageLanguage1 === 'en' ? DesignEnName : DesignName}</p><span className="fabric_seperator">&nbsp;|&nbsp;</span><p>{pageLanguage1 === 'en' ? "FROM" : "شروع از"}: {GetPrice(SamplePrice, pageLanguage1, pageLanguage1 === "en" ? "Tomans" : "تومان")}</p></span>
                        </div>
                        {fabric}
                    </div>;
                
            }
        });
        // console.log(fabricList,fabricList2);
        if (fabricList.filter(el => el).length < 2) {
            setBaseActive(false);
        } else {
            setBaseActive(true);
        }
        
        if (fabricList2.filter(el => el).length < 2) {
            setDecorativeActive(false);
        } else {
            setDecorativeActive(true);
        }
        
        if (!baseMore) {
            setFabricsList(fabricList.filter(el => el).slice(0, 1))
        } else {
            setFabricsList(fabricList);
        }
        
        if (!decorativeMore) {
            setFabricsList2(fabricList2.filter(el => el).slice(0, 1));
        } else {
            setFabricsList2(fabricList2);
        }
        
        // console.log(baseMore,fabricList.filter(el => el).slice(0, 1),decorativeMore,fabricList2.filter(el => el).slice(0, 1));
        setBaseOneArr(baseOneArr);
        setDecorativeOneArr(decorativeOneArr);
        // console.log(fabricList)
    }
    
    function renderDkCurtains(curtainWidth) {
        const curtainList = [];
        let count = Math.floor(curtainWidth / 11.5);
        let DkCurtainArr = JSON.parse(JSON.stringify(dkCurtainArr));
        // if (dkCurtainArrCount !== count && !pageLoad) {
        //     setDkCurtainArr([]);
        //     DkCurtainArr = []
        //     setDkCurtainArrCount(count);
        // }
        // console.log(dkCurtainArr,DkCurtainArr.filter(el => el).length,count);
        
        let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
        let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
        if (DkCurtainArr.filter(el => el).length === count) {
            let baseFound = baseOneArr.some(r => DkCurtainArr.map(el => el ? el.DesignCode : null).indexOf(r) >= 0);
            if (baseFound) {
                tempLabels["3"] = t('Completed');
                tempValue["3"] = "Completed";
            } else {
                tempLabels["3"] = "";
                tempValue["3"] = "";
            }
            let decorFound = decorativeOneArr.some(r => DkCurtainArr.map(el => el ? el.DesignCode : null).indexOf(r) >= 0);
            if (decorFound) {
                tempLabels["35"] = t('Completed');
                tempValue["35"] = "Completed";
            } else {
                tempLabels["35"] = "";
                tempValue["35"] = "";
            }
            setDkCurtainArrComplete(true);
            setDeps("", "3");
        } else {
            tempLabels["3"] = undefined;
            tempValue["3"] = undefined;
            setDkCurtainArrComplete(false);
            // setCart("","","SodFabrics");
            setDeps("3", "");
        }
        setStepSelectedLabel(tempLabels);
        setStepSelectedValue(tempValue);
        
        let promiseArr = [];
        for (let i = 0; i < count; i++) {
            promiseArr[i] = new Promise((resolve, reject) => {
                let tempColor = DkCurtainArr[i] ? (DkCurtainArr[i]["ColorHtmlCode"] ? DkCurtainArr[i]["ColorHtmlCode"] : "#e2e2e2") : "#e2e2e2";
                let obj = (DkCurtainArr[i] ? DkCurtainArr[i]["FabricPhotos"] || [] : []).find(o => o.PhotoTypeId === 4702);
                let tempImg = obj && obj["PhotoUrl"] ? `https://api.atlaspood.ir/${obj["PhotoUrl"]}` : null;
                let ImgOrColor = !!(DkCurtainArr[i] && !DkCurtainArr[i]["UseColorOnSewingModel"] && tempImg)
                curtainList.push(
                    <div key={i} className="dk_curtain_inside_part" onClick={() => {
                        setCurtainChangeId(i);
                    }} style={ImgOrColor ? {backgroundImage: `url(${tempImg})`, backgroundPosition: "top center"} : {backgroundColor: tempColor}}>
                        {/*<div className="dk_curtain_inside_part_top"/>*/}
                        {/*<div className="dk_curtain_inside_part_bottom"/>*/}
                    </div>
                );
                resolve();
            });
        }
        
        Promise.all(promiseArr).then(() => {
            curtainList.push(
                <div key={"dk_curtain_end_line"} className="dk_curtain_end_line"/>
            );
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
        let FabricWidth = fabricObj["FabricWidth"] || 0;
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
                <div className="zoom_modal_header_Contents_container">
                    <h1 className="zoom_modal_header_Contents">{t("Fabric Width")}</h1>
                    {FabricWidth > 0 && <p className="zoom_modal_header_Contents_item">{FabricWidth + "cm"}</p>}
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
    
    function ContextAwareToggle({stepNum, stepTitle, stepTitle2, stepSelected, eventKey, callback, stepRef, type, required, cartCustomText}) {
        const {activeEventKey} = useContext(AccordionContext);
        
        const decoratedOnClick = useAccordionButton(eventKey, () => {
            callback && callback(eventKey);
            activeEventKey === eventKey ? setAccordionActiveKey("") : setAccordionActiveKey(eventKey);
            
            setTimeout(() => {
                if (stepHeaders.current[stepRef] !== undefined && stepHeaders.current[stepRef] !== null)
                    stepHeaders.current[stepRef].scrollIntoView();
            }, 500);
        },);
        
        const isCurrentEventKey = activeEventKey === eventKey;
        
        // if (stepSelected !== "" && required) {
        //     let temp = JSON.parse(JSON.stringify(requiredStep));
        //     setTimeout(() => {
        //         temp[stepRef] = false;
        //         setRequiredStep(temp);
        //     }, 1000);
        // }
        
        return (
            <div className={`w-100 h-100 steps_header ${isCurrentEventKey ? 'steps_header_active' : ''}`}
                 onClick={decoratedOnClick} ref={ref => (stepHeaders.current[stepRef] = ref)}>
                <div className="steps_header_num_container">
                    <div className="steps_header_num">{stepNum}</div>
                </div>
                <div className="steps_header_title_container">
                    <div className={"steps_header_title " + stepTitle2 ? "steps_header_title_max_content" : ""} type-of-step={type}
                         cart-custom-text={cartCustomText === undefined ? stepTitle : cartCustomText}
                         ref={ref => (steps.current[stepRef] = ref)}>{stepTitle}<h5>{stepTitle2}</h5></div>
                </div>
                {/*<div className="steps_header_selected_container">*/}
                {/*    <PopoverStickOnHover classNames="step_label_popover"*/}
                {/*                         placement="bottom"*/}
                {/*                         children={<div className={"steps_header_selected"+ (stepSelected===t("Invalid Measurements")?" steps_header_selected_red":"")}*/}
                {/*                                        ref={ref => (selectedTitle.current[stepNum] = ref)}>{stepSelected}</div>}*/}
                {/*                         component={*/}
                {/*                             <div className="step_label_popover_container">*/}
                {/*                                 <div className={"steps_header_selected"+ (stepSelected===t("Invalid Measurements")?" steps_header_selected_red":"")} ref={ref => (selectedTitle.current[stepNum] = ref)}>{stepSelected}</div>*/}
                {/*                             </div>*/}
                {/*                         }/>*/}
                {/*</div>*/}
                <div className="steps_header_selected_container">
                    <div className="steps_header_selected_title_container">
                        <div className={"steps_header_selected" + (stepSelected === t("Invalid Measurements") ? " steps_header_selected_red" : "")} onMouseEnter={() => {
                            if (selectedTitle.current[stepNum].clientWidth < selectedTitle.current[stepNum].scrollWidth) {
                                let temp = JSON.parse(JSON.stringify(headerTruncated))
                                temp[stepNum] = true;
                                setHeaderTruncated(temp);
                            }
                        }} onMouseLeave={() => {
                            let temp = JSON.parse(JSON.stringify(headerTruncated))
                            temp[stepNum] = false;
                            setHeaderTruncated(temp);
                        }} ref={ref => (selectedTitle.current[stepNum] = ref)}>{stepSelected}</div>
                        {headerTruncated[stepNum] && <div className="header_tooltip">{stepSelected}</div>}
                    </div>
                    {required && <div className="stepRequired"/>}
                </div>
            </div>
        );
    }
    
    function ContextAwareToggleViewDetails({eventKey, callback, textOnHide, textOnShow, customClass, customClass2}) {
        const {activeEventKey} = useContext(AccordionContext);
        
        const decoratedOnClick = useAccordionButton(
            eventKey,
            () => callback && callback(eventKey),
        );
        
        const isCurrentEventKey = activeEventKey === eventKey;
        
        return (
            <button
                className={(customClass ? customClass : "basket_item_title_dropdown_btn") + " accordion_toggle_button"}
                aria-expanded={`${isCurrentEventKey}`}
                type="button"
                onClick={decoratedOnClick}
            >
                <h4 className={customClass2 ? customClass2 : "dk_curtain_preview_item_details"}>{isCurrentEventKey ? textOnShow : textOnHide}</h4>
            </button>
        );
    }
    
    function NextStep({children, eventKey, callback, onClick, currentStep}) {
        const decoratedOnClick = useAccordionButton(
            eventKey,
            () => {
                callback && callback(eventKey);
                setAccordionActiveKey(eventKey);
                setTimeout(() => {
                    if (currentStep && stepHeaders.current[currentStep] !== undefined && stepHeaders.current[currentStep] !== null)
                        stepHeaders.current[currentStep].scrollIntoView();
                }, 800);
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
    
    useEffect(() => {
        if (isClearAll) {
            clearAllFilters();
            getFabricsWithFilter(true);
        }
    }, [isClearAll]);
    
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
        if (obj !== undefined && typeof obj === 'object') {
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
                    let tempMax = temp.values[refIndex][temp.values[refIndex].indexOf(Math.min(...temp.values[refIndex]))];
                    tempLabels[refIndex] = pageLang === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMax}`) + postfixFa : tempMax + postfixEn;
                }
                setStepSelectedLabel(tempLabels);
                let minValue = Math.min(...temp.values[refIndex]);
                let maxValue = Math.max(...temp.values[refIndex]);
                if (maxValue - minValue >= 2) {
                    modalHandleShow(modalRef);
                }
            }
        } else if (obj !== undefined) {
            let temp = JSON.parse(JSON.stringify(stepSelectedOptions));
            if (temp.labels[refIndex] === undefined)
                temp.labels[refIndex] = [];
            if (temp.values[refIndex] === undefined)
                temp.values[refIndex] = [];
            temp.labels[refIndex][position] = obj;
            temp.values[refIndex][position] = parseFloat(obj);
            setStepSelectedOptions(temp);
            
            if (temp.values[refIndex].filter(function (e) {
                return e
            }).length === 3) {
                let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                if (isMin) {
                    let tempMin = temp.values[refIndex][temp.values[refIndex].indexOf(Math.min(...temp.values[refIndex]))];
                    tempLabels[refIndex] = pageLang === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMin}`) + postfixFa : tempMin + postfixEn;
                } else {
                    let tempMax = temp.values[refIndex][temp.values[refIndex].indexOf(Math.min(...temp.values[refIndex]))];
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
        let temp = JSON.parse(JSON.stringify(requiredStep));
        if (requiredStep[refIndex]) {
            temp[refIndex] = false;
        }
        setRequiredStep(temp);
    }
    
    function optionSelectChanged_WidthLength(obj, refIndex, isWidth, postfixEn, postfixFa, pageLang) {
        if (obj !== undefined && typeof obj === 'object') {
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
        } else if (obj !== undefined) {
            
        }
    }
    
    function optionSelectChanged_LeftRight(obj, refIndex, isLeft, postfixEn, postfixFa, pageLang, secondVal) {
        if (obj !== undefined && typeof obj === 'object') {
            if (isLeft) {
                let temp = JSON.parse(JSON.stringify(leftRight));
                temp.left = obj.value;
                if (secondVal !== undefined) {
                    temp.right = secondVal;
                }
                setLeftRight(temp);
                
                if (temp.right !== "" && temp.left !== "") {
                    let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                    tempLabels[refIndex] = pageLang === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp.right}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp.left}`) + postfixFa}` : `Left: ${temp.left + postfixEn}\u00A0\u00A0\u00A0Right: ${temp.right + postfixEn}`;
                    setStepSelectedLabel(tempLabels);
                }
            } else {
                let temp = JSON.parse(JSON.stringify(leftRight));
                temp.right = obj.value;
                if (secondVal !== undefined) {
                    temp.left = secondVal;
                }
                setLeftRight(temp);
                
                if (temp.right !== "" && temp.left !== "") {
                    let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                    tempLabels[refIndex] = pageLang === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp.right}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp.left}`) + postfixFa}` : `Left: ${temp.left + postfixEn}\u00A0\u00A0\u00A0Right: ${temp.right + postfixEn}`;
                    setStepSelectedLabel(tempLabels);
                }
            }
        } else if (obj !== undefined) {
            if (isLeft) {
                let temp = JSON.parse(JSON.stringify(leftRight));
                temp.left = obj;
                if (secondVal !== undefined) {
                    temp.right = secondVal;
                }
                setLeftRight(temp);
                
                if (temp.right !== "" && temp.left !== "") {
                    let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                    tempLabels[refIndex] = pageLang === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp.right}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp.left}`) + postfixFa}` : `Left: ${temp.left + postfixEn}\u00A0\u00A0\u00A0Right: ${temp.right + postfixEn}`;
                    setStepSelectedLabel(tempLabels);
                }
            } else {
                let temp = JSON.parse(JSON.stringify(leftRight));
                temp.right = obj;
                if (secondVal !== undefined) {
                    temp.left = secondVal;
                }
                setLeftRight(temp);
                
                if (temp.right !== "" && temp.left !== "") {
                    let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                    tempLabels[refIndex] = pageLang === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp.right}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp.left}`) + postfixFa}` : `Left: ${temp.left + postfixEn}\u00A0\u00A0\u00A0Right: ${temp.right + postfixEn}`;
                    setStepSelectedLabel(tempLabels);
                }
            }
        }
        let temp = JSON.parse(JSON.stringify(requiredStep));
        if (requiredStep[refIndex]) {
            temp[refIndex] = false;
        }
        setRequiredStep(temp);
    }
    
    function optionSelectChanged(refIndex, selected, postfixEn, postfixFa, pageLang) {
        if (selected !== undefined && typeof selected === 'object') {
            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
            tempLabels[refIndex] = pageLang === "fa" ? `${NumberToPersianWord.convertEnToPe(`${selected.value}`) + postfixFa}` : `${selected.value + postfixEn}`;
            setStepSelectedLabel(tempLabels);
            
            let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
            tempValue[refIndex] = selected.value;
            // console.log(tempValue);
            setStepSelectedValue(tempValue);
        } else if (selected !== undefined) {
            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
            tempLabels[refIndex] = pageLang === "fa" ? `${NumberToPersianWord.convertEnToPe(`${selected}`) + postfixFa}` : `${selected + postfixEn}`;
            setStepSelectedLabel(tempLabels);
            
            let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
            tempValue[refIndex] = selected;
            // console.log(tempValue);
            setStepSelectedValue(tempValue);
        }
        let temp = JSON.parse(JSON.stringify(requiredStep));
        if (requiredStep[refIndex]) {
            temp[refIndex] = false;
        }
        setRequiredStep(temp);
    }
    
    function selectChanged(e, nums, customText, secondRefIndex, secText) {
        let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
        let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
        let temp = JSON.parse(JSON.stringify(requiredStep));
        if (e && customText) {
            tempLabels[e] = customText;
            
            if (secondRefIndex !== undefined) {
                let tempArr1 = secondRefIndex.split(',');
                tempArr1.forEach((ref, index) => {
                    if (ref !== undefined) {
                        tempLabels[ref] = secText[index]
                    }
                });
            }
            if (tempLabels[e] !== "" && requiredStep[e]) {
                temp[e] = false;
            }
        } else if (e) {
            // console.log(e.target.value);
            let refIndex = e.target.getAttribute('ref-num');
            // selectedTitle.current[refIndex].innerHTML = e.target.getAttribute('text');
            tempLabels[refIndex] = e.target.getAttribute('text');
            tempValue[refIndex] = e.target.value;
            
            if (requiredStep[refIndex]) {
                temp[refIndex] = false;
            }
        }
        if (nums !== undefined) {
            let tempArr = nums.split(',');
            tempArr.forEach(num => {
                if (num !== undefined) {
                    if (tempValue[num] !== undefined) delete tempValue[num];
                    if (tempLabels[num] !== undefined) delete tempLabels[num];
                    if (tempLabels[num] !== "" && requiredStep[num]) {
                        temp[num] = false;
                    }
                }
            });
        }
        // console.log(tempValue);
        setStepSelectedLabel(tempLabels);
        setStepSelectedValue(tempValue);
        setRequiredStep(temp);
    }
    
    function setBasketNumber(cart, refIndex, numValue, type, minusPlus) {
        // console.log(cart,refIndex, numValue, type, minusPlus);
        if (isLoggedIn) {
            let temp = JSON.parse(JSON.stringify(cart))["CartDetails"];
            let tempProjectContainer = temp.find(opt => opt["CartDetailId"] === refIndex);
            
            if (Object.keys(tempProjectContainer).length !== 0) {
                let tempProject = tempProjectContainer["SewingOrder"];
                tempProject["Count"] = tempProject["WindowCount"];
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
                            temp[refIndex]["WindowCount"] = temp[refIndex]["Count"];
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
                            temp[refIndex]["WindowCount"] = temp[refIndex]["Count"];
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
                            temp[refIndex]["WindowCount"] = temp[refIndex]["Count"];
                            temp[refIndex]["PreorderText"]["WindowCount"] = temp[refIndex]["Count"];
                            cartObj[typeString] = temp;
                            localStorage.setItem('cart', JSON.stringify(cartObj));
                            renderCart(cartObj);
                        }
                    } else {
                        temp[refIndex]["Count"] = 1;
                        temp[refIndex]["WindowCount"] = temp[refIndex]["Count"];
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
        projectObj["WindowCount"] = projectObj["Count"];
        projectObj["PreorderText"]["WindowCount"] = projectObj["Count"];
        projectObj["PreorderText"]["Count"] = projectObj["Count"];
        axios.post(baseURLEditProject, projectObj, {
            headers: authHeader()
        })
            .then(() => {
                renderCart();
            }).catch(err => {
            console.log(err);
            if (err.response && err.response.status === 401) {
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
        if (draperyRef.current[refIndex]) {
            draperyRef.current[refIndex].className = "custom_cart_item is_loading";
        }
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
            console.log(err);
            if (err.response && err.response.status === 401) {
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
    
    function setCart(refIndex, cartValue, delRefs, secondRefIndex, secondCartValue) {
        // console.log(refIndex, cartValue, delRefs, secondRefIndex, secondCartValue);
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
        if (secondRefIndex !== undefined) {
            let tempArr1 = secondRefIndex.split(',');
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
            if (temp[key] !== undefined && temp[key] !== null && temp[key] !== "") {
                let tempObj = userProjects.find(obj => obj["cart"] === key);
                if (tempObj === undefined) {
                    console.log(key);
                    // window.location.reload();
                } else {
                    if (tempObj && tempObj["apiLabel"] !== "") {
                        if (tempObj["apiValue"] === null) {
                            tempPostObj[tempObj["apiLabel"]] = temp[key];
                        } else {
                            tempPostObj[tempObj["apiLabel"]] = tempObj["apiValue"][temp[key]];
                            // console.log(key,tempObj["apiLabel"],tempPostObj);
                        }
                    }
                }
            }
        });
        
        tempPostObj["SewingOrderDetails"] = [];
        for (let i = 0; i < 3; i++) {
            tempPostObj["SewingOrderDetails"][i] = {};
            tempPostObj["SewingOrderDetails"][i]["IsLowWrinkle"] = true;
            tempPostObj["SewingOrderDetails"][i]["IsCoverAll"] = true;
            tempPostObj["SewingOrderDetails"][i]["IsAltogether"] = true;
        }
        
        
        tempPostObj["SewingOrderDetails"][0]["CurtainPartId"] = 2303;
        tempPostObj["SewingOrderDetails"][0]["SewingModelId"] = `${modelID}`;
        
        tempPostObj["SewingOrderDetails"][1]["CurtainPartId"] = 2302;
        tempPostObj["SewingOrderDetails"][1]["SewingModelId"] = `0002`;
        
        tempPostObj["SewingOrderDetails"][2]["CurtainPartId"] = 2301;
        tempPostObj["SewingOrderDetails"][2]["SewingModelId"] = `0002`;
        
        Object.keys(temp).forEach(key => {
            if (temp[key] !== undefined && temp[key] !== null && temp[key] !== "") {
                let tempObj = userProjects.find(obj => obj["cart"] === key);
                // console.log(key,userProjects.find(obj => obj["cart"] === key));
                if (tempObj) {
                    for (let i = 0; i < 3; i++) {
                        let j = +i + +2;
                        if (tempObj["apiLabel" + j] !== undefined) {
                            if (tempObj["apiValue" + j] === null) {
                                tempPostObj["SewingOrderDetails"][i][tempObj["apiLabel" + j]] = temp[key];
                                // console.log(i,tempObj["cart"],tempPostObj["SewingOrderDetails"],tempPostObj["SewingOrderDetails"][i]);
                            } else {
                                tempPostObj["SewingOrderDetails"][i][tempObj["apiLabel" + j]] = tempObj["apiValue" + j][temp[key]];
                            }
                        }
                    }
                }
            }
        });
        // console.log(tempPostObj["SewingOrderDetails"]);
        tempPostObj["SewingOrderDetails"][0]["Accessories"] = [];
        tempPostObj["SewingOrderDetails"][1]["Accessories"] = [];
        tempPostObj["SewingOrderDetails"][2]["Accessories"] = [];
        Object.keys(temp).forEach(key => {
            if (temp[key] !== undefined && temp[key] !== null && temp[key] !== "") {
                let tempObj = userProjects.find(obj => obj["cart"] === key);
                if (tempObj) {
                    if (tempObj["apiAcc"] !== undefined) {
                        if (tempObj["apiAcc"] === true && tempObj["apiAccValue"][temp[key]]) {
                            tempPostObj["SewingOrderDetails"][0]["Accessories"].push(tempObj["apiAccValue"][temp[key]]);
                        } else {
                        
                        }
                    }
                    if (tempObj["apiAcc2"] !== undefined) {
                        if (tempObj["apiAcc2"] === true && tempObj["apiAccValue2"][temp[key]]) {
                            tempPostObj["SewingOrderDetails"][1]["Accessories"].push(tempObj["apiAccValue2"][temp[key]]);
                        } else {
                        
                        }
                    }
                    if (tempObj["apiAcc3"] !== undefined) {
                        if (tempObj["apiAcc3"] === true && tempObj["apiAccValue3"][temp[key]]) {
                            tempPostObj["SewingOrderDetails"][2]["Accessories"].push(tempObj["apiAccValue3"][temp[key]]);
                        } else {
                        
                        }
                    }
                }
            }
        });
        tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
            return el != null;
        });
        
        let promise2 = new Promise((resolve, reject) => {
            let count = temp["WidthCart"] ? Math.floor(temp["WidthCart"] / 11.5) : 16;
            if (stepSelectedValue["2"] !== undefined && !pageLoad && !(motorLoad && refIndex === "MotorType") && refIndex !== "FabricId" && !(refIndex === "CurtainArr" && (temp["CurtainArr"] ? temp["CurtainArr"] : []).filter(el => el).length !== count)) {
                for (let i = tempPostObj["SewingOrderDetails"].length - 1; i >= 0; i--) {
                    if (tempPostObj["SewingOrderDetails"] && tempPostObj["SewingOrderDetails"][i] && tempPostObj["SewingOrderDetails"][i]["FabricId"] === undefined) {
                        tempPostObj["SewingOrderDetails"].splice(i, 1);
                    }
                }
                if ((temp["CurtainArr"] ? temp["CurtainArr"] : []).filter(el => el).length !== count) {
                    delete tempPostObj["SewingOrderDetails"];
                }
                if (zipcode && zipcode !== "") {
                    tempPostObj["ZipCode"] = zipcode;
                }
                // if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined && stepSelectedValue["2"] !== undefined && stepSelectedValue["3"] !== undefined) {
                // console.log(tempPostObj);
                axios.post(baseURLPrice, tempPostObj)
                    .then((response) => {
                        setPrice(response.data["price"]);
                        setFabricQty(response.data["FabricQty"]);
                        
                        if (response.data["price"]) {
                            setInstallPrice(response.data["InstallAmount"] ? response.data["InstallAmount"] : 0);
                            setTransportPrice(response.data["TransportationAmount"] ? response.data["TransportationAmount"] : 0);
                            setHasInstall(!!(response.data["TransportationAmount"]))
                        }
                        
                        getWindowSize(response.data["WindowWidth"], response.data["WindowHeight"]);
                        temp["WindowWidth"] = response.data["WindowWidth"];
                        temp["WindowHeight"] = response.data["WindowHeight"];
                        temp["WidthCart"] = response.data["Width"];
                        temp["HeightCart"] = response.data["Height"];
                        resolve();
                    }).catch(err => {
                    setPrice(0);
                    setFabricQty(0);
                    resolve(1);
                    // console.log(err);
                });
            } else {
                resolve();
            }
        });
        promise2.then((res) => {
            if (!pageLoad) {
                if (res === undefined) {
                    setCartValues(temp);
                } else if (res === 1) {
                    if (temp["HeightCart"] !== undefined)
                        delete temp["HeightCart"];
                    if (temp["WidthCart"] !== undefined)
                        delete temp["WidthCart"];
                    
                    if (temp["WindowHeight"] !== undefined)
                        delete temp["WindowHeight"];
                    if (temp["WindowWidth"] !== undefined)
                        delete temp["WindowWidth"];
                    
                    setCartValues(temp);
                }
                
                setTimeout(() => {
                    if (Math.floor(cartValues["WidthCart"] / 11.5) !== Math.floor(temp["WidthCart"] / 11.5)) {
                        setDkCurtainArr([]);
                        setStep3("");
                    }
                }, 200);
            }
            setCartLoading(false);
        });
    }
    
    function measureWindowSize(zipcode) {
        let promise2 = new Promise((resolve, reject) => {
            let temp = JSON.parse(JSON.stringify(cartValues));
            let tempPostObj = {};
            tempPostObj["WindowCount"] = 1;
            tempPostObj["SewingModelId"] = `${modelID}`;
            
            let userProjects = JSON.parse(JSON.stringify(UserProjects))[`${modelID}`]["data"];
            
            Object.keys(temp).forEach(key => {
                if (temp[key] !== undefined && temp[key] !== null && temp[key] !== "") {
                    let tempObj = userProjects.find(obj => obj["cart"] === key);
                    if (tempObj === undefined) {
                        // window.location.reload();
                        console.log(key);
                    } else {
                        if (tempObj && tempObj["apiLabel"] !== "") {
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
            for (let i = 0; i < 3; i++) {
                tempPostObj["SewingOrderDetails"][i] = {};
                tempPostObj["SewingOrderDetails"][i]["IsLowWrinkle"] = true;
                tempPostObj["SewingOrderDetails"][i]["IsCoverAll"] = true;
                tempPostObj["SewingOrderDetails"][i]["IsAltogether"] = true;
            }
            
            
            tempPostObj["SewingOrderDetails"][0]["CurtainPartId"] = 2303;
            tempPostObj["SewingOrderDetails"][0]["SewingModelId"] = `${modelID}`;
            
            tempPostObj["SewingOrderDetails"][1]["CurtainPartId"] = 2302;
            tempPostObj["SewingOrderDetails"][1]["SewingModelId"] = `0002`;
            
            tempPostObj["SewingOrderDetails"][2]["CurtainPartId"] = 2301;
            tempPostObj["SewingOrderDetails"][2]["SewingModelId"] = `0002`;
            
            Object.keys(temp).forEach(key => {
                if (temp[key] !== undefined && temp[key] !== null && temp[key] !== "") {
                    let tempObj = userProjects.find(obj => obj["cart"] === key);
                    // console.log(key,userProjects.find(obj => obj["cart"] === key));
                    if (tempObj) {
                        for (let i = 0; i < 3; i++) {
                            let j = +i + +2;
                            if (tempObj["apiLabel" + j] !== undefined) {
                                if (tempObj["apiValue" + j] === null) {
                                    tempPostObj["SewingOrderDetails"][i][tempObj["apiLabel" + j]] = temp[key];
                                    // console.log(i,tempObj["cart"],tempPostObj["SewingOrderDetails"],tempPostObj["SewingOrderDetails"][i]);
                                } else {
                                    tempPostObj["SewingOrderDetails"][i][tempObj["apiLabel" + j]] = tempObj["apiValue" + j][temp[key]];
                                }
                            }
                        }
                    }
                }
            });
            // console.log(tempPostObj["SewingOrderDetails"]);
            tempPostObj["SewingOrderDetails"][0]["Accessories"] = [];
            tempPostObj["SewingOrderDetails"][1]["Accessories"] = [];
            tempPostObj["SewingOrderDetails"][2]["Accessories"] = [];
            Object.keys(temp).forEach(key => {
                if (temp[key] !== undefined && temp[key] !== null && temp[key] !== "") {
                    let tempObj = userProjects.find(obj => obj["cart"] === key);
                    if (tempObj) {
                        if (tempObj["apiAcc"] !== undefined) {
                            if (tempObj["apiAcc"] === true && tempObj["apiAccValue"][temp[key]]) {
                                tempPostObj["SewingOrderDetails"][0]["Accessories"].push(tempObj["apiAccValue"][temp[key]]);
                            } else {
                            
                            }
                        }
                        if (tempObj["apiAcc2"] !== undefined) {
                            if (tempObj["apiAcc2"] === true && tempObj["apiAccValue2"][temp[key]]) {
                                tempPostObj["SewingOrderDetails"][1]["Accessories"].push(tempObj["apiAccValue2"][temp[key]]);
                            } else {
                            
                            }
                        }
                        if (tempObj["apiAcc3"] !== undefined) {
                            if (tempObj["apiAcc3"] === true && tempObj["apiAccValue3"][temp[key]]) {
                                tempPostObj["SewingOrderDetails"][2]["Accessories"].push(tempObj["apiAccValue3"][temp[key]]);
                            } else {
                            
                            }
                        }
                    }
                }
            });
            tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
                return el != null;
            });
            
            // tempPostObj["SewingOrderDetails"][0]["SodFabrics"] = JSON.parse(JSON.stringify(sodFabrics));
            
            if (stepSelectedValue["2"] !== undefined) {
                for (let i = tempPostObj["SewingOrderDetails"].length - 1; i >= 0; i--) {
                    if (tempPostObj["SewingOrderDetails"] && tempPostObj["SewingOrderDetails"][i] && tempPostObj["SewingOrderDetails"][i]["FabricId"] === undefined) {
                        tempPostObj["SewingOrderDetails"].splice(i, 1);
                    }
                }
                if (!dkCurtainArrComplete) {
                    delete tempPostObj["SewingOrderDetails"];
                }
                // if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined && stepSelectedValue["2"] !== undefined && stepSelectedValue["3"] !== undefined) {
                // console.log(JSON.stringify(tempPostObj));
                if (zipcode && zipcode !== "") {
                    tempPostObj["ZipCode"] = zipcode;
                }
                
                axios.post(baseURLPrice, tempPostObj)
                    .then((response) => {
                        if (zipcode && zipcode !== "") {
                            if (response.data["price"]) {
                                setInstallPrice(response.data["InstallAmount"] ? response.data["InstallAmount"] : 0);
                                setTransportPrice(response.data["TransportationAmount"] ? response.data["TransportationAmount"] : 0);
                                setHasInstall(!!(response.data["TransportationAmount"]));
                                setZipcodeButton(true);
                            } else {
                                HasInstall(zipcode);
                            }
                        } else {
                            setPrice(response.data["price"]);
                            setFabricQty(response.data["FabricQty"]);
                            
                            // setCart("HeightCart", totalHeight, "", "WidthCart", [totalWidth]);
                            getWindowSize(response.data["WindowWidth"], response.data["WindowHeight"]);
                            temp["WindowWidth"] = response.data["WindowWidth"];
                            temp["WindowHeight"] = response.data["WindowHeight"];
                            temp["WidthCart"] = response.data["Width"];
                            temp["HeightCart"] = response.data["Height"];
                            setCartValues(temp);
                            setTimeout(() => {
                                resolve();
                            }, 1000);
                        }
                    }).catch(err => {
                    if (zipcode && zipcode !== "") {
                        setInstallPrice(-1);
                        setTransportPrice(-1);
                        HasInstall(zipcode);
                        setTimeout(() => {
                            reject();
                        }, 1000);
                    } else {
                        setPrice(0);
                        if (temp["HeightCart"] !== undefined)
                            delete temp["HeightCart"];
                        if (temp["WidthCart"] !== undefined)
                            delete temp["WidthCart"];
                        
                        if (temp["WindowHeight"] !== undefined)
                            delete temp["WindowHeight"];
                        if (temp["WindowWidth"] !== undefined)
                            delete temp["WindowWidth"];
                        // console.log(err);
                        setCartValues(temp);
                        setTimeout(() => {
                            reject();
                        }, 1000);
                    }
                });
            } else {
                HasInstall(zipcode);
                reject();
            }
            
        });
        promise2.then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }
    
    function HasInstall(zipcode) {
        axios.post(baseURLZipCode, {}, {
            params: {
                zipCode: zipcode
            }
        }).then((response) => {
            setHasInstall(response.data);
            setZipcodeButton(true);
        }).catch(err => {
            setHasInstall(false);
            setZipcodeChecked("false");
            setCart("", "", "ZipCode");
            setZipcodeButton(true);
        });
    }
    
    function deleteSpecialSelects(InOut) {
        let temp = JSON.parse(JSON.stringify(selectCustomValues));
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
            Object.keys(temp).forEach((key, index) => {
                temp[key] = [];
            });
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
    
    // const doNotShow = ["ModelId", "qty", "Width1", "Height1", "Width2", "Height2", "Width3", "Height3", "RoomNameEn", "RoomNameFa", "calcMeasurements,Width,Height,WidthCart,HeightCart,WindowWidth,WindowHeight", "FabricId", "PhotoUrl", "RemoteName",
    //     "hasPower", "WindowName", "ExtensionLeft", "ExtensionRight", "Height3C", "Width3A", "ShadeMount", "ModelNameEn", "ModelNameFa", "FabricColorEn", "FabricColorFa", "FabricDesignEn", "FabricDesignFa"];
    
    function addToCart() {
        let tempDepSet = [...depSet];
        console.log(tempDepSet);
        let tempNewSet = new Set();
        let tempErr = [];
        let promiseArr = [];
        tempDepSet.forEach((dependency, index) => {
            promiseArr[index] = new Promise((resolve, reject) => {
                if (dependency.split('')[1] === '0') {
                    tempNewSet.add(dependency.slice(0, 3));
                } else {
                    tempNewSet.add(dependency.split('')[0]);
                }
                // tempNewSet.add(dependency);
                resolve();
            });
        });
        
        Promise.all(promiseArr).then(() => {
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
                    if (steps.current[dependency] !== undefined && steps.current[dependency] !== null) {
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
                    if (steps.current[dependency] !== undefined && steps.current[dependency] !== null) {
                        temp[dependency] = true;
                        // delete tempLabels[dependency];
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
                if (price) {
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
                        if (temp[key] !== undefined && temp[key] !== null && temp[key] !== "") {
                            let tempObj = userProjects.find(obj => obj["cart"] === key);
                            // console.log(key,tempObj);
                            if (tempObj && tempObj["apiLabel"] !== "") {
                                if (tempObj["apiValue"] === null) {
                                    tempPostObj[tempObj["apiLabel"]] = temp[key];
                                } else {
                                    tempPostObj[tempObj["apiLabel"]] = tempObj["apiValue"][temp[key]];
                                }
                            }
                        }
                    });
                    
                    tempPostObj["SewingOrderDetails"] = [];
                    for (let i = 0; i < 3; i++) {
                        tempPostObj["SewingOrderDetails"][i] = {};
                        tempPostObj["SewingOrderDetails"][i]["IsLowWrinkle"] = true;
                        tempPostObj["SewingOrderDetails"][i]["IsCoverAll"] = true;
                        tempPostObj["SewingOrderDetails"][i]["IsAltogether"] = true;
                    }
                    
                    
                    tempPostObj["SewingOrderDetails"][0]["CurtainPartId"] = 2303;
                    tempPostObj["SewingOrderDetails"][0]["SewingModelId"] = `${modelID}`;
                    
                    tempPostObj["SewingOrderDetails"][1]["CurtainPartId"] = 2302;
                    tempPostObj["SewingOrderDetails"][1]["SewingModelId"] = `0002`;
                    
                    tempPostObj["SewingOrderDetails"][2]["CurtainPartId"] = 2301;
                    tempPostObj["SewingOrderDetails"][2]["SewingModelId"] = `0002`;
                    
                    Object.keys(temp).forEach(key => {
                        if (temp[key] !== undefined && temp[key] !== null && temp[key] !== "") {
                            let tempObj = userProjects.find(obj => obj["cart"] === key);
                            // console.log(key,userProjects.find(obj => obj["cart"] === key));
                            if (tempObj) {
                                for (let i = 0; i < 3; i++) {
                                    let j = +i + +2;
                                    if (tempObj["apiLabel" + j] !== undefined) {
                                        if (tempObj["apiValue" + j] === null) {
                                            tempPostObj["SewingOrderDetails"][i][tempObj["apiLabel" + j]] = temp[key];
                                            // console.log(i,tempObj["cart"],tempPostObj["SewingOrderDetails"],tempPostObj["SewingOrderDetails"][i]);
                                        } else {
                                            tempPostObj["SewingOrderDetails"][i][tempObj["apiLabel" + j]] = tempObj["apiValue" + j][temp[key]];
                                        }
                                    }
                                }
                            }
                        }
                    });
                    // console.log(tempPostObj["SewingOrderDetails"]);
                    tempPostObj["SewingOrderDetails"][0]["Accessories"] = [];
                    tempPostObj["SewingOrderDetails"][1]["Accessories"] = [];
                    tempPostObj["SewingOrderDetails"][2]["Accessories"] = [];
                    Object.keys(temp).forEach(key => {
                        if (temp[key] !== undefined && temp[key] !== null && temp[key] !== "") {
                            let tempObj = userProjects.find(obj => obj["cart"] === key);
                            if (tempObj) {
                                if (tempObj["apiAcc"] !== undefined) {
                                    if (tempObj["apiAcc"] === true && tempObj["apiAccValue"][temp[key]]) {
                                        tempPostObj["SewingOrderDetails"][0]["Accessories"].push(tempObj["apiAccValue"][temp[key]]);
                                    } else {
                                    
                                    }
                                }
                                if (tempObj["apiAcc2"] !== undefined) {
                                    if (tempObj["apiAcc2"] === true && tempObj["apiAccValue2"][temp[key]]) {
                                        tempPostObj["SewingOrderDetails"][1]["Accessories"].push(tempObj["apiAccValue2"][temp[key]]);
                                    } else {
                                    
                                    }
                                }
                                if (tempObj["apiAcc3"] !== undefined) {
                                    if (tempObj["apiAcc3"] === true && tempObj["apiAccValue3"][temp[key]]) {
                                        tempPostObj["SewingOrderDetails"][2]["Accessories"].push(tempObj["apiAccValue3"][temp[key]]);
                                    } else {
                                    
                                    }
                                }
                            }
                        }
                    });
                    tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
                        return el != null;
                    });
                    // console.log(tempPostObj);
                    for (let i = tempPostObj["SewingOrderDetails"].length - 1; i >= 0; i--) {
                        if (tempPostObj["SewingOrderDetails"] && tempPostObj["SewingOrderDetails"][i] && tempPostObj["SewingOrderDetails"][i]["FabricId"] === undefined) {
                            tempPostObj["SewingOrderDetails"].splice(i, 1);
                        }
                    }
                    if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined) {
                        // console.log(JSON.stringify(tempPostObj));
                        axios.post(baseURLPrice, tempPostObj)
                            .then((response) => {
                                setBagPrice(response.data["price"]);
                                tempBagPrice = response.data["price"];
                                temp["Price"] = response.data["price"];
                                if (zipcodeChecked && response.data["InstallAmount"]) {
                                    temp["InstallAmount"] = response.data["InstallAmount"];
                                    temp["TransportationAmount"] = response.data["TransportationAmount"];
                                }
                                // console.log(response.data);
                                
                                let roomNameFa = cartValues["RoomNameFa"];
                                let roomName = cartValues["RoomNameEn"];
                                let WindowName = cartValues["WindowName"] === undefined ? "" : cartValues["WindowName"];
                                Object.keys(cartValues).forEach(key => {
                                    let tempObj = userProjects.find(obj => obj["cart"] === key);
                                    if (tempObj === undefined) {
                                        // window.location.reload();
                                        console.log(key);
                                    } else {
                                        if (key === "WindowHeight" || key === "WindowWidth") {
                                        
                                        } else if (tempObj["title"] !== "" && tempObj["lang"].indexOf(pageLanguage) > -1) {
                                            let objLabel = "";
                                            if (key === "ControlType" && cartValues["ControlType"] === "Motorized") {
                                                objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${t(cartValues[key].toString())} / ${t(cartValues["MotorType"].toString())}`).toString() : `${t(cartValues[key].toString())} / ${t(cartValues["MotorType"].toString())}`;
                                            } else if (tempObj["titleValue"] === null || true) {
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
                                        <h2 className="cart_agree_title">{pageLanguage === 'fa' ? convertToPersian(defaultModelNameFa) + " سفارشی " : "Custom " + defaultModelName}</h2>
                                        <ul className="cart_agree_items_container">
                                            <GetMeasurementArray modelId={`${modelID}`} cartValues={cartValues}/>
                                            <li className="cart_agree_item">
                                                <h1 className="cart_agree_item_title">{t("Fabric")}</h1>
                                                <h2 className="cart_agree_item_desc">
                                                    <div className={`dk_curtain_preview_container`}>
                                                        <Accordion>
                                                            <Accordion.Item eventKey="0">
                                                                <ContextAwareToggleViewDetails eventKey="0" textOnHide={t("View Details")} textOnShow={t("Hide Details")}/>
                                                                <Accordion.Body className="basket_item_title_dropdown dk_curtain_preview_dropdown">
                                                                    <div className="dk_curtain_preview_detail_container">
                                                                        {/*{dkCurtainPreviewList}*/}
                                                                        {temp["SodFabrics"].map((item, i) =>
                                                                            <div key={i}
                                                                                 className="dk_curtain_preview_detail">
                                                                                <h2>{(pageLanguage === 'en' ? CapitalizeAllWords(item["FabricObj"]["DesignEnName"]) : item["FabricObj"]["DesignName"]).toString() + " / " + (pageLanguage === 'en' ? CapitalizeAllWords(item["FabricObj"]["ColorEnName"]) : item["FabricObj"]["ColorName"]).toString()}</h2>
                                                                                <h5>&nbsp;X</h5><h3>{NumToFa(item["Qty"], pageLanguage)}</h3>
                                                                            </div>)}
                                                                    </div>
                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                        </Accordion>
                                                    </div>
                                                </h2>
                                            </li>
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
                            console.log(err);
                            if (err.response && err.response.status === 401) {
                                refreshToken().then((response2) => {
                                    if (response2 !== false) {
                                        addToCart();
                                    } else {
                                        setPrice(0);
                                        setBagPrice(0);
                                        temp["Price"] = 0;
                                        setCartValues(temp);
                                        setAddingLoading(false);
                                        navigate("/" + pageLanguage + "/User");
                                    }
                                });
                            } else {
                                setPrice(0);
                                setBagPrice(0);
                                temp["Price"] = 0;
                                setCartValues(temp);
                                setAddingLoading(false);
                            }
                            
                        });
                    } else {
                        setAddingLoading(false);
                    }
                    // console.log(cartValues);
                }
            }
            // modalHandleShow("cart_modal");
            // renderCart();
            // setCartStateAgree(true);
        });
    }
    
    function addToCart_agreed() {
        AddProjectToCart(cartValues, `${modelID}`, price, defaultModelName, defaultModelNameFa, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], (projectId && projectId !== "") ? projectId : cartProjectIndex, editIndex, navigate, isLoggedIn).then((temp) => {
            if (temp === 401) {
                addToCart_agreed();
            } else if (temp) {
                setCartAgreeDescription(false);
                renderCart(temp);
                setBag(temp);
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
                        cartObjects = response.data ? response.data : {};
                        resolve();
                    }).catch(err => {
                        console.log(err);
                        if (err.response && err.response.status === 401) {
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
                    return object1["TypeId"] === 6403;
                });
                
                let swatches = cartObjects["CartDetails"].filter((object1) => {
                    return object1["TypeId"] === 6402;
                });
                
                let promise1 = new Promise((resolve, reject) => {
                    if (draperies.length) {
                        draperies.sort(function (a, b) {
                            return b["CartDetailId"] - a["CartDetailId"] || b["SewingOrderId"] - a["SewingOrderId"];
                        }).forEach((tempObj, i) => {
                            let obj = draperies[i]["SewingOrder"]["PreorderText"] || {};
                            let sodFabrics = obj["SodFabrics"] ? obj["SodFabrics"] : [];
                            let roomName = (obj["WindowName"] === undefined || obj["WindowName"] === "") ? "" : " / " + obj["WindowName"];
                            if (obj["SewingModelId"] === "0326") {
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
                                                <h2 className="custom_cart_item_desc_detail">
                                                    <div className={`dk_curtain_preview_container`}>
                                                        <Accordion>
                                                            <Accordion.Item eventKey="0">
                                                                <ContextAwareToggleViewDetails eventKey="0" textOnHide={t("View Details")} textOnShow={t("Hide Details")}/>
                                                                <Accordion.Body className="basket_item_title_dropdown dk_curtain_preview_dropdown">
                                                                    <div className="dk_curtain_preview_detail_container">
                                                                        {sodFabrics.map((item, i) =>
                                                                            <div key={i}
                                                                                 className="dk_curtain_preview_detail">
                                                                                <h2>{(pageLanguage === 'en' ? CapitalizeAllWords(item["FabricObj"]["DesignEnName"]) : item["FabricObj"]["DesignName"]).toString() + "/" + (pageLanguage === 'en' ? CapitalizeAllWords(item["FabricObj"]["ColorEnName"]) : item["FabricObj"]["ColorName"]).toString()}</h2>
                                                                                <h5>&nbsp;X</h5><h3>{NumToFa(item["Qty"], pageLanguage)}</h3>
                                                                            </div>)}
                                                                    </div>
                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                        </Accordion>
                                                    </div>
                                                </h2>
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
                                                           value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${draperies[i]["SewingOrder"]["WindowCount"]}`) : draperies[i]["SewingOrder"]["WindowCount"]}
                                                           onChange={(e) => setBasketNumber(cartObjects, draperies[i]["CartDetailId"], NumberToPersianWord.convertPeToEn(`${e.target.value}`))}/>
                                                    <button type="text" className="basket_qty_plus"
                                                            onClick={() => setBasketNumber(cartObjects, draperies[i]["CartDetailId"], 0, 0, 1)}>+
                                                    </button>
                                                </div>
                                                <p className="custom_cart_item_end_price">{GetPrice(obj["Price"], pageLanguage, t("TOMANS"))}</p>
                                            </div>
                                        </div>
                                    </li>;
                                if (i === draperies.length - 1) {
                                    resolve();
                                }
                            } else {
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
                                                           value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${draperies[i]["SewingOrder"]["WindowCount"]}`) : draperies[i]["SewingOrder"]["WindowCount"]}
                                                           onChange={(e) => setBasketNumber(cartObjects, draperies[i]["CartDetailId"], NumberToPersianWord.convertPeToEn(`${e.target.value}`))}/>
                                                    <button type="text" className="basket_qty_plus"
                                                            onClick={() => setBasketNumber(cartObjects, draperies[i]["CartDetailId"], 0, 0, 1)}>+
                                                    </button>
                                                </div>
                                                <p className="custom_cart_item_end_price">{GetPrice(obj["Price"], pageLanguage, t("TOMANS"))}</p>
                                            </div>
                                        </div>
                                    </li>;
                                if (i === draperies.length - 1) {
                                    resolve();
                                }
                            }
                        })
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
                                            <h1 className="custom_cart_item_desc_name">{t("FABRIC SWATCH")}</h1>
                                            <button type="button" className="btn-close" aria-label="Close"
                                                    onClick={() => deleteBasketProject(swatches[i]["CartDetailId"])}/>
                                        </div>
                                        <div className="custom_cart_item_desc_container">
                                            <h2 className="custom_cart_item_desc_detail">{(pageLanguage === 'en' ? CapitalizeAllWords(obj["ProductDesignEnName"]) : obj["ProductDesignName"]).toString() + " / " + (pageLanguage === 'en' ? CapitalizeAllWords(obj["ProductColorEnName"]) : obj["ProductColorName"]).toString()}</h2>
                                        </div>
                                        <div className="custom_cart_item_desc_container">
                                            <h2 className="custom_cart_item_desc_detail">{t("Qty: ")}{obj["Count"]}</h2>
                                        </div>
                                        <div className="custom_cart_item_desc_container">
                                            <div className="custom_cart_item_desc_qty">
                                                {/*<button type="text" className="basket_qty_minus"*/}
                                                {/*        onClick={() => setBasketNumber(cartObjects, swatches[i]["CartDetailId"], 0, 0, -1)}>–*/}
                                                {/*</button>*/}
                                                {/*<input type="text" className="basket_qty_num"*/}
                                                {/*       value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${swatches[i]["Count"]}`) : swatches[i]["Count"]}*/}
                                                {/*       onChange={(e) => setBasketNumber(cartObjects, swatches[i]["CartDetailId"], NumberToPersianWord.convertPeToEn(`${e.target.value}`))}/>*/}
                                                {/*<button type="text" className="basket_qty_plus"*/}
                                                {/*        onClick={() => setBasketNumber(cartObjects, swatches[i]["CartDetailId"], 0, 0, 1)}>+*/}
                                                {/*</button>*/}
                                            </div>
                                            <p className="custom_cart_item_end_price">{obj["PayableAmount"] === 0 ? t("Free") : GetPrice(obj["PayableAmount"], pageLanguage, t("TOMANS"))}</p>
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
                                        tempPostObj["SewingModelId"] = obj["PreorderText"]["SewingModelId"];
                                        Object.keys(temp).forEach(key => {
                                            if (temp[key] !== undefined && temp[key] !== null && temp[key] !== "") {
                                                let tempObj = userProjects.find(obj => obj["cart"] === key);
                                                // console.log(key,tempObj);
                                                if (tempObj && tempObj["apiLabel"] !== "") {
                                                    if (tempObj["apiValue"] === null) {
                                                        tempPostObj[tempObj["apiLabel"]] = temp[key];
                                                    } else {
                                                        tempPostObj[tempObj["apiLabel"]] = tempObj["apiValue"][temp[key]];
                                                    }
                                                }
                                            }
                                        });
                                        
                                        tempPostObj["SewingOrderDetails"] = [];
                                        for (let i = 0; i < 3; i++) {
                                            tempPostObj["SewingOrderDetails"][i] = {};
                                            tempPostObj["SewingOrderDetails"][i]["IsLowWrinkle"] = true;
                                            tempPostObj["SewingOrderDetails"][i]["IsCoverAll"] = true;
                                            tempPostObj["SewingOrderDetails"][i]["IsAltogether"] = true;
                                        }
                                        
                                        
                                        tempPostObj["SewingOrderDetails"][0]["CurtainPartId"] = 2303;
                                        tempPostObj["SewingOrderDetails"][0]["SewingModelId"] = tempPostObj["SewingModelId"];
                                        
                                        tempPostObj["SewingOrderDetails"][1]["CurtainPartId"] = 2302;
                                        tempPostObj["SewingOrderDetails"][1]["SewingModelId"] = `0002`;
                                        
                                        tempPostObj["SewingOrderDetails"][2]["CurtainPartId"] = 2301;
                                        tempPostObj["SewingOrderDetails"][2]["SewingModelId"] = `0002`;
                                        
                                        Object.keys(temp).forEach(key => {
                                            if (temp[key] !== undefined && temp[key] !== null && temp[key] !== "") {
                                                let tempObj = userProjects.find(obj => obj["cart"] === key);
                                                // console.log(key,userProjects.find(obj => obj["cart"] === key));
                                                if (tempObj) {
                                                    for (let i = 0; i < 3; i++) {
                                                        let j = +i + +2;
                                                        if (tempObj["apiLabel" + j] !== undefined) {
                                                            if (tempObj["apiValue" + j] === null) {
                                                                tempPostObj["SewingOrderDetails"][i][tempObj["apiLabel" + j]] = temp[key];
                                                                // console.log(i,tempObj["cart"],tempPostObj["SewingOrderDetails"],tempPostObj["SewingOrderDetails"][i]);
                                                            } else {
                                                                tempPostObj["SewingOrderDetails"][i][tempObj["apiLabel" + j]] = tempObj["apiValue" + j][temp[key]];
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                        // console.log(tempPostObj["SewingOrderDetails"]);
                                        tempPostObj["SewingOrderDetails"][0]["Accessories"] = [];
                                        tempPostObj["SewingOrderDetails"][1]["Accessories"] = [];
                                        tempPostObj["SewingOrderDetails"][2]["Accessories"] = [];
                                        Object.keys(temp).forEach(key => {
                                            if (temp[key] !== undefined && temp[key] !== null && temp[key] !== "") {
                                                let tempObj = userProjects.find(obj => obj["cart"] === key);
                                                if (tempObj) {
                                                    if (tempObj["apiAcc"] !== undefined) {
                                                        if (tempObj["apiAcc"] === true && tempObj["apiAccValue"][temp[key]]) {
                                                            tempPostObj["SewingOrderDetails"][0]["Accessories"].push(tempObj["apiAccValue"][temp[key]]);
                                                        } else {
                                                        
                                                        }
                                                    }
                                                    if (tempObj["apiAcc2"] !== undefined) {
                                                        if (tempObj["apiAcc2"] === true && tempObj["apiAccValue2"][temp[key]]) {
                                                            tempPostObj["SewingOrderDetails"][1]["Accessories"].push(tempObj["apiAccValue2"][temp[key]]);
                                                        } else {
                                                        
                                                        }
                                                    }
                                                    if (tempObj["apiAcc3"] !== undefined) {
                                                        if (tempObj["apiAcc3"] === true && tempObj["apiAccValue3"][temp[key]]) {
                                                            tempPostObj["SewingOrderDetails"][2]["Accessories"].push(tempObj["apiAccValue3"][temp[key]]);
                                                        } else {
                                                        
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                        if (obj["PreorderText"]["Accessories"] && obj["PreorderText"]["Accessories"].filter(n => n).length > 0) {
                                            tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].concat(obj["PreorderText"]["Accessories"])
                                            let uniqueAcc = [...tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(n => n).reduce((map, obj) => map.set(obj.SewingAccessoryValue, obj), new Map()).values()];
                                            tempPostObj["SewingOrderDetails"][0]["Accessories"] = uniqueAcc.filter(function (el) {
                                                return el != null;
                                            });
                                        } else {
                                            tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
                                                return el != null;
                                            });
                                        }
                                        
                                        // delete tempPostObj["SewingOrderDetails"][0]["SewingModelId"];
                                        // delete tempPostObj["SewingModelId"];
                                        tempPostObj["SewingModelId"] = tempPostObj["SewingOrderDetails"][0]["SewingModelId"];
                                        // console.log(tempPostObj);
                                        for (let i = tempPostObj["SewingOrderDetails"].length - 1; i >= 0; i--) {
                                            if (tempPostObj["SewingOrderDetails"] && tempPostObj["SewingOrderDetails"][i] && tempPostObj["SewingOrderDetails"][i]["FabricId"] === undefined) {
                                                tempPostObj["SewingOrderDetails"].splice(i, 1);
                                            }
                                        }
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
                                obj["Price"] = values[index].data["price"] / obj1["WindowCount"];
                                obj1["Price"] = values[index].data["price"] / obj1["WindowCount"];
                                draperiesTotalPrice += values[index].data["price"];
                                let sodFabrics = obj["SodFabrics"] ? obj["SodFabrics"] : [];
                                let roomName = (obj["WindowName"] === undefined || obj["WindowName"] === "") ? "" : " / " + obj["WindowName"];
                                if (obj["SewingModelId"] === "0326") {
                                    temp1[cartObjects["drapery"].length - index - 1] =
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
                                                    <h2 className="custom_cart_item_desc_detail">
                                                        <div className={`dk_curtain_preview_container`}>
                                                            <Accordion>
                                                                <Accordion.Item eventKey="0">
                                                                    <ContextAwareToggleViewDetails eventKey="0" textOnHide={t("View Details")} textOnShow={t("Hide Details")}/>
                                                                    <Accordion.Body className="basket_item_title_dropdown dk_curtain_preview_dropdown">
                                                                        <div className="dk_curtain_preview_detail_container">
                                                                            {sodFabrics.map((item, i) =>
                                                                                <div key={i}
                                                                                     className="dk_curtain_preview_detail">
                                                                                    <h2>{(pageLanguage === 'en' ? CapitalizeAllWords(item["FabricObj"]["DesignEnName"]) : item["FabricObj"]["DesignName"]).toString() + "/" + (pageLanguage === 'en' ? CapitalizeAllWords(item["FabricObj"]["ColorEnName"]) : item["FabricObj"]["ColorName"]).toString()}</h2>
                                                                                    <h5>&nbsp;X</h5><h3>{NumToFa(item["Qty"], pageLanguage)}</h3>
                                                                                </div>)}
                                                                        </div>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>
                                                            </Accordion>
                                                        </div>
                                                    </h2>
                                                </div>
                                                <div className="custom_cart_item_desc_container">
                                                    <h2 className="custom_cart_item_desc_detail">{pageLanguage === 'fa' ? obj["RoomNameFa"] + roomName : obj["RoomNameEn"] + roomName}</h2>
                                                </div>
                                                <div className="custom_cart_item_desc_container">
                                                    <div className="custom_cart_item_desc_qty">
                                                        <button type="text" className="basket_qty_minus" onClick={() => setBasketNumber(undefined, index, 0, 0, -1)}>–</button>
                                                        <input type="text" className="basket_qty_num"
                                                               value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj1["WindowCount"]}`) : obj1["WindowCount"]}
                                                               onChange={(e) => setBasketNumber(undefined, index, NumberToPersianWord.convertPeToEn(`${e.target.value}`), 0)}/>
                                                        <button type="text" className="basket_qty_plus" onClick={() => setBasketNumber(undefined, index, 0, 0, 1)}>+</button>
                                                    </div>
                                                    <p className="custom_cart_item_end_price">{GetPrice(obj1["Price"] * obj1["WindowCount"], pageLanguage, t("TOMANS"))}</p>
                                                </div>
                                            </div>
                                        </li>;
                                } else {
                                    temp1[cartObjects["drapery"].length - index - 1] =
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
                                                               value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj1["WindowCount"]}`) : obj1["WindowCount"]}
                                                               onChange={(e) => setBasketNumber(undefined, index, NumberToPersianWord.convertPeToEn(`${e.target.value}`), 0)}/>
                                                        <button type="text" className="basket_qty_plus" onClick={() => setBasketNumber(undefined, index, 0, 0, 1)}>+</button>
                                                    </div>
                                                    <p className="custom_cart_item_end_price">{GetPrice(obj1["Price"] * obj1["WindowCount"], pageLanguage, t("TOMANS"))}</p>
                                                </div>
                                            </div>
                                        </li>;
                                }
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
                    setBag(response.data ? response.data : {});
                    renderFabrics(response.data || {});
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
                    console.log(err);
                    if (err.response && err.response.status === 401) {
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
                    axios.post(baseURLDeleteBasketProject + "/" + SwatchDetailId, {}, {
                        headers: authHeader()
                    }).then((response) => {
                        setCartChanged(cartChanged + 1);
                    }).catch(err => {
                        console.log(err);
                        if (err.response && err.response.status === 401) {
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
            setSwatchLoginSwatchId(SwatchId);
            setSwatchLoginSwatchDetailId(SwatchDetailId);
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
        let pageLanguage = location.pathname.split('').slice(1, 3).join('');
        let tempWindowSize = pageLanguage === "fa" ? `عرض: ${NumberToPersianWord.convertEnToPe(totalWidth.toString())}س\u200Cم\u00A0\u00A0\u00A0ارتفاع: ${NumberToPersianWord.convertEnToPe(totalHeight.toString())}س\u200Cم` : `Width: ${totalWidth}cm\u00A0\u00A0\u00A0Height: ${totalHeight}cm`;
        setWindowSize(tempWindowSize);
        setWindowSizeBool(true);
        // console.log(totalWidth,totalHeight);
    }
    
    function roomLabelChanged(changedValue, refIndex, isText) {
        let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
        let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
        let tempSelect = JSON.parse(JSON.stringify(roomLabelSelect));
        let temp = JSON.parse(JSON.stringify(requiredStep));
        if (isText) {
            if (roomLabelSelect.label !== "") {
                if (changedValue === "") {
                    tempLabels[refIndex] = roomLabelSelect.label;
                } else {
                    tempLabels[refIndex] = roomLabelSelect.label + " - " + changedValue;
                }
            }
        } else {
            tempSelect.label = changedValue.label;
            tempSelect.value = changedValue.value;
            
            tempValue[refIndex] = changedValue.value;
            
            if (changedValue.label !== "") {
                if (roomLabelText === "") {
                    tempLabels[refIndex] = changedValue.label;
                } else {
                    tempLabels[refIndex] = changedValue.label + " - " + roomLabelText;
                }
            }
        }
        if (tempLabels[refIndex] !== "" && requiredStep[refIndex]) {
            temp[refIndex] = false;
        }
    
        setStepSelectedLabel(tempLabels);
        setStepSelectedValue(tempValue);
        setRoomLabelSelect(tempSelect);
        setRequiredStep(temp);
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
                console.log(err);
                if (err.response && err.response.status === 401) {
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
                    modalHandleClose("uploadImg");
                    setDetailsShow(false);
                }).catch(err => {
                console.log(err);
                if (err.response && err.response.status === 401) {
                    refreshToken().then((response2) => {
                        if (response2 !== false) {
                            submitUploadedFile(PDFOrImg);
                        } else {
                            setIsUploading(false);
                            setSelectedFile(undefined);
                            setSelectedFileName("");
                            setEditedFileName("");
                            modalHandleClose("uploadImg");
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
                    console.log(err);
                    if (err.response && err.response.status === 401) {
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
                    console.log(err);
                    if (err.response && err.response.status === 401) {
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
            tempArr = tempArr.slice(0, count);
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
                console.log(step3, fabricObject);
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
            console.log(err);
            if (err.response && err.response.status === 401) {
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
        setPageLoad(true);
        setPageLoadDK(true);
        if (data && Object.keys(data).length !== 0) {
            setProjectData(data);
        }
        
        let pageLanguage = location.pathname.split('').slice(1, 3).join('');
        // let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
        // let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
        let tempLabels = {};
        let tempValue = {};
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
            // setDkCurtainArr([]);
            // setDkCurtainPreviewList([]);
            
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
                if (Object.keys(tempFabric).length > 0) {
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
                    
                    if (temp["WidthCart"] && temp["CurtainArr"].filter(el => el).length === Math.floor(temp["WidthCart"] / 11.5)) {
                        tempLabels["3"] = t('Completed');
                        tempValue["3"] = "Completed";
                        tempLabels["35"] = t('Completed');
                        tempValue["35"] = "Completed";
                        setDkCurtainArrComplete(true);
                        depSetTempArr = new Set([...setGetDeps("", "3", depSetTempArr)]);
                        setDkCurtainArr(temp["CurtainArr"]);
                    } else {
                        tempLabels["3"] = undefined;
                        tempValue["3"] = undefined;
                        setDkCurtainArrComplete(false);
                        depSetTempArr = new Set([...setGetDeps("3", "", depSetTempArr)]);
                        setDkCurtainArr(temp["CurtainArr"]);
                    }
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
                            let refIndex = inputs.current["111"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["111"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["111"].value;
                            depSetTempArr = new Set([...setGetDeps("", "1", depSetTempArr)]);
                        } else if (temp["Mount"] === "Outside") {
                            let refIndex = inputs.current["12"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["12"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["12"].value;
                            if (temp["IsWalled"]) {
                                setSelectedMountOutsideType([{
                                    value: temp["IsWalled"],
                                    label: optionsOutside[pageLanguage].find(opt => opt.value === temp["IsWalled"]).label
                                }]);
                            }
                            depSetTempArr = new Set([...setGetDeps((temp["IsWalled"] ? "" : "11,"), "1", depSetTempArr)]);
                        } else {
                            setStep11("true");
                            let refIndex = inputs.current["131"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["131"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["131"].value;
                            depSetTempArr = new Set([...setGetDeps("", "1", depSetTempArr)]);
                        }
                        setStepSelectedLabel(tempLabels);
                        setStepSelectedValue(tempValue);
                    }
                    
                    if (temp["calcMeasurements"] !== undefined) {
                        // console.log(temp["calcMeasurements"].toString());
                        setStep2(temp["calcMeasurements"].toString());
                        
                        if (!temp["calcMeasurements"]) {
                            let refIndex = inputs.current["21"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["21"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["21"].value;
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            
                            selectValues["width"] = temp["Width"] ? [{value: temp["Width"]}] : [];
                            selectValues["length"] = temp["Height"] ? [{value: temp["Height"]}] : [];
                            depSetTempArr = new Set([...setGetDeps((temp["Width"] ? "" : "21,") + (temp["Height"] ? "" : "22,"), "2", depSetTempArr)]);
                            setSelectCustomValues(selectValues);
                        } else {
                            let refIndex = inputs.current["22"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["22"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["22"].value;
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            if (temp["Mount"]) {
                                if (temp["Mount"] === "Inside") {
                                    // console.log(temp);
                                    let tempWidth = changeLang ? temp["Width1"] : temp["Width"];
                                    let tempHeight = changeLang ? temp["Height1"] : temp["Height"];
                                    
                                    selectValues["width1"] = tempWidth ? [{value: tempWidth}] : [];
                                    selectValues["width2"] = temp["Width2"] ? [{value: temp["Width2"]}] : [];
                                    selectValues["width3"] = temp["Width3"] ? [{value: temp["Width3"]}] : [];
                                    selectValues["height1"] = tempHeight ? [{value: tempHeight}] : [];
                                    selectValues["height2"] = temp["Height2"] ? [{value: temp["Height2"]}] : [];
                                    selectValues["height3"] = temp["Height3"] ? [{value: temp["Height3"]}] : [];
                                    if (tempWidth && temp["Width2"] && temp["Width3"]) {
                                        let tempMin = Math.min(tempWidth, temp["Width2"], temp["Width3"]);
                                        tempLabels["2AIn"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMin}`) + postfixFa : tempMin + postfixEn;
                                    }
                                    if (tempHeight && temp["Height2"] && temp["Height3"]) {
                                        let tempMax = Math.min(tempHeight, temp["Height2"], temp["Height3"]);
                                        tempLabels["2BIn"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMax}`) + postfixFa : tempMax + postfixEn;
                                    }
                                    
                                    depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "2AIn1,") + (temp["Width2"] ? "" : "2AIn2,") + (temp["Width3"] ? "" : "2AIn3,") + (tempHeight ? "" : "2BIn1,") + (temp["Height2"] ? "" : "2BIn2,") + (temp["Height3"] ? "" : "2BIn3,"), "2", depSetTempArr)]);
                                    setSelectCustomValues(selectValues);
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                } else if (temp["Mount"] === "HiddenMoulding") {
                                    if (temp["FinishedLengthType"]) {
                                        setTimeout(() => {
                                            setStep2A(temp["FinishedLengthType"]);
                                            
                                            if (temp["FinishedLengthType"] === "Sill") {
                                                let refIndex = inputs.current["2A1"].getAttribute('ref-num');
                                                tempLabels[refIndex] = inputs.current["2A1"].getAttribute('text');
                                                tempValue[refIndex] = inputs.current["2A1"].value;
                                                setStepSelectedLabel(tempLabels);
                                                setStepSelectedValue(tempValue);
                                                
                                                let tempWidth = changeLang ? temp["Width2B"] : temp["Width"];
                                                // let tempHeight = changeLang ? temp["Height2D"] : temp["Height"];
                                                // console.log(temp,tempWidth,tempHeight);
                                                
                                                selectValues["Width2B"] = tempWidth ? [{value: tempWidth}] : [];
                                                if (tempWidth) {
                                                    tempLabels["2B"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                }
                                                selectValues["left"] = temp["ExtensionLeft"] ? [{value: temp["ExtensionLeft"]}] : [];
                                                selectValues["right"] = temp["ExtensionRight"] ? [{value: temp["ExtensionRight"]}] : [];
                                                if (temp["ExtensionLeft"] !== undefined && temp["ExtensionRight"] !== undefined) {
                                                    tempLabels["2C"] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionRight"]}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionLeft"]}`) + postfixFa}` : `Left: ${temp["ExtensionLeft"] + postfixEn}\u00A0\u00A0\u00A0Right: ${temp["ExtensionRight"] + postfixEn}`;
                                                }
                                                
                                                temp["CeilingToWindow1"] = changeLang ? temp["CeilingToWindow1"] : temp["Height"];
                                                temp["CeilingToWindow2"] = changeLang ? temp["CeilingToWindow2"] : temp["Height2"];
                                                temp["CeilingToWindow3"] = changeLang ? temp["CeilingToWindow3"] : temp["Height3"];
                                                selectValues["CeilingToWindow1"] = temp["CeilingToWindow1"] ? [{value: temp["CeilingToWindow1"]}] : [];
                                                selectValues["CeilingToWindow2"] = temp["CeilingToWindow2"] ? [{value: temp["CeilingToWindow2"]}] : [];
                                                selectValues["CeilingToWindow3"] = temp["CeilingToWindow3"] ? [{value: temp["CeilingToWindow3"]}] : [];
                                                if (temp["CeilingToWindow1"] && temp["CeilingToWindow2"] && temp["CeilingToWindow3"]) {
                                                    let tempMin = Math.min(temp["CeilingToWindow1"], temp["CeilingToWindow2"], temp["CeilingToWindow3"]);
                                                    tempLabels["2D"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMin}`) + postfixFa : tempMin + postfixEn;
                                                }
                                                // selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                // if (temp["CeilingToFloor"]) {
                                                //     tempLabels["2E"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                // }
                                                
                                                depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "2B,") + (temp["ExtensionLeft"] !== undefined ? "" : "2C1,") + (temp["ExtensionRight"] !== undefined ? "" : "2C2,") + (temp["CeilingToWindow1"] !== undefined ? "" : "2D1,") + (temp["CeilingToWindow2"] !== undefined ? "" : "2D2,") + (temp["CeilingToWindow3"] !== undefined ? "" : "2D3,"), "2,2A", depSetTempArr)]);
                                                setSelectCustomValues(selectValues);
                                                setStepSelectedLabel(tempLabels);
                                                setStepSelectedValue(tempValue);
                                            } else if (temp["FinishedLengthType"] === "Apron") {
                                                let refIndex = inputs.current["2A2"].getAttribute('ref-num');
                                                tempLabels[refIndex] = inputs.current["2A2"].getAttribute('text');
                                                tempValue[refIndex] = inputs.current["2A2"].value;
                                                setStepSelectedLabel(tempLabels);
                                                setStepSelectedValue(tempValue);
                                                
                                                let tempWidth = changeLang ? temp["Width2B"] : temp["Width"];
                                                // let tempHeight = changeLang ? temp["Height2D"] : temp["Height"];
                                                // console.log(temp,tempWidth,tempHeight);
                                                
                                                selectValues["Width2B"] = tempWidth ? [{value: tempWidth}] : [];
                                                if (tempWidth) {
                                                    tempLabels["2B"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                }
                                                selectValues["left"] = temp["ExtensionLeft"] ? [{value: temp["ExtensionLeft"]}] : [];
                                                selectValues["right"] = temp["ExtensionRight"] ? [{value: temp["ExtensionRight"]}] : [];
                                                if (temp["ExtensionLeft"] !== undefined && temp["ExtensionRight"] !== undefined) {
                                                    tempLabels["2C"] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionRight"]}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionLeft"]}`) + postfixFa}` : `Left: ${temp["ExtensionLeft"] + postfixEn}\u00A0\u00A0\u00A0Right: ${temp["ExtensionRight"] + postfixEn}`;
                                                }
                                                
                                                temp["CeilingToWindow1"] = changeLang ? temp["CeilingToWindow1"] : temp["Height"];
                                                temp["CeilingToWindow2"] = changeLang ? temp["CeilingToWindow2"] : temp["Height2"];
                                                temp["CeilingToWindow3"] = changeLang ? temp["CeilingToWindow3"] : temp["Height3"];
                                                selectValues["CeilingToWindow1"] = temp["CeilingToWindow1"] ? [{value: temp["CeilingToWindow1"]}] : [];
                                                selectValues["CeilingToWindow2"] = temp["CeilingToWindow2"] ? [{value: temp["CeilingToWindow2"]}] : [];
                                                selectValues["CeilingToWindow3"] = temp["CeilingToWindow3"] ? [{value: temp["CeilingToWindow3"]}] : [];
                                                if (temp["CeilingToWindow1"] && temp["CeilingToWindow2"] && temp["CeilingToWindow3"]) {
                                                    let tempMin = Math.min(temp["CeilingToWindow1"], temp["CeilingToWindow2"], temp["CeilingToWindow3"]);
                                                    tempLabels["2D"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMin}`) + postfixFa : tempMin + postfixEn;
                                                }
                                                // selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                // if (temp["CeilingToFloor"]) {
                                                //     tempLabels["2E"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                // }
                                                
                                                depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "2B,") + (temp["ExtensionLeft"] !== undefined ? "" : "2C1,") + (temp["ExtensionRight"] !== undefined ? "" : "2C2,") + (temp["CeilingToWindow1"] !== undefined ? "" : "2D1,") + (temp["CeilingToWindow2"] !== undefined ? "" : "2D2,") + (temp["CeilingToWindow3"] !== undefined ? "" : "2D3,"), "2,2A", depSetTempArr)]);
                                                setSelectCustomValues(selectValues);
                                                setStepSelectedLabel(tempLabels);
                                                setStepSelectedValue(tempValue);
                                            } else {
                                                let refIndex = inputs.current["2A3"].getAttribute('ref-num');
                                                tempLabels[refIndex] = inputs.current["2A3"].getAttribute('text');
                                                tempValue[refIndex] = inputs.current["2A3"].value;
                                                setStepSelectedLabel(tempLabels);
                                                setStepSelectedValue(tempValue);
                                                
                                                let tempWidth = changeLang ? temp["Width2B"] : temp["Width"];
                                                // let tempHeight = changeLang ? temp["Height2D"] : temp["Height"];
                                                // console.log(temp,tempWidth,tempHeight);
                                                
                                                selectValues["Width2B"] = tempWidth ? [{value: tempWidth}] : [];
                                                if (tempWidth) {
                                                    tempLabels["2B"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                }
                                                selectValues["left"] = temp["ExtensionLeft"] ? [{value: temp["ExtensionLeft"]}] : [];
                                                selectValues["right"] = temp["ExtensionRight"] ? [{value: temp["ExtensionRight"]}] : [];
                                                if (temp["ExtensionLeft"] !== undefined && temp["ExtensionRight"] !== undefined) {
                                                    tempLabels["2C"] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionRight"]}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionLeft"]}`) + postfixFa}` : `Left: ${temp["ExtensionLeft"] + postfixEn}\u00A0\u00A0\u00A0Right: ${temp["ExtensionRight"] + postfixEn}`;
                                                }
                                                
                                                temp["CeilingToFloor1"] = changeLang ? temp["CeilingToFloor1"] : temp["Height"];
                                                temp["CeilingToFloor2"] = changeLang ? temp["CeilingToFloor2"] : temp["Height2"];
                                                temp["CeilingToFloor3"] = changeLang ? temp["CeilingToFloor3"] : temp["Height3"];
                                                selectValues["CeilingToFloor1"] = temp["CeilingToFloor1"] ? [{value: temp["CeilingToFloor1"]}] : [];
                                                selectValues["CeilingToFloor2"] = temp["CeilingToFloor2"] ? [{value: temp["CeilingToFloor2"]}] : [];
                                                selectValues["CeilingToFloor3"] = temp["CeilingToFloor3"] ? [{value: temp["CeilingToFloor3"]}] : [];
                                                if (temp["CeilingToFloor1"] && temp["CeilingToFloor2"] && temp["CeilingToFloor3"]) {
                                                    let tempMin = Math.min(temp["CeilingToFloor1"], temp["CeilingToFloor2"], temp["CeilingToFloor3"]);
                                                    tempLabels["2DFloor"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMin}`) + postfixFa : tempMin + postfixEn;
                                                }
                                                
                                                depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "2B,") + (temp["ExtensionLeft"] !== undefined ? "" : "2C1,") + (temp["ExtensionRight"] !== undefined ? "" : "2C2,") + (temp["CeilingToFloor1"] !== undefined ? "" : "2DFloor1,") + (temp["CeilingToFloor2"] !== undefined ? "" : "2DFloor2,") + (temp["CeilingToFloor3"] !== undefined ? "" : "2DFloor3,"), "2,2A", depSetTempArr)]);
                                                setSelectCustomValues(selectValues);
                                                setStepSelectedLabel(tempLabels);
                                                setStepSelectedValue(tempValue);
                                            }
                                        }, 200);
                                    }
                                } else {
                                    if (temp["IsWalled"]) {
                                        // console.log([{value: temp["IsWalled"]}]);
                                        if (temp["IsWalled"] === "Ceiling") {
                                            if (temp["FinishedLengthType"]) {
                                                setTimeout(() => {
                                                    setStep2A(temp["FinishedLengthType"]);
                                                    
                                                    if (temp["FinishedLengthType"] === "Sill") {
                                                        let refIndex = inputs.current["2A1"].getAttribute('ref-num');
                                                        tempLabels[refIndex] = inputs.current["2A1"].getAttribute('text');
                                                        tempValue[refIndex] = inputs.current["2A1"].value;
                                                        setStepSelectedLabel(tempLabels);
                                                        setStepSelectedValue(tempValue);
                                                        
                                                        let tempWidth = changeLang ? temp["Width2B"] : temp["Width"];
                                                        // let tempHeight = changeLang ? temp["Height2D"] : temp["Height"];
                                                        // console.log(temp,tempWidth,tempHeight);
                                                        
                                                        selectValues["Width2B"] = tempWidth ? [{value: tempWidth}] : [];
                                                        if (tempWidth) {
                                                            tempLabels["2B"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                        }
                                                        selectValues["left"] = temp["ExtensionLeft"] ? [{value: temp["ExtensionLeft"]}] : [];
                                                        selectValues["right"] = temp["ExtensionRight"] ? [{value: temp["ExtensionRight"]}] : [];
                                                        if (temp["ExtensionLeft"] !== undefined && temp["ExtensionRight"] !== undefined) {
                                                            tempLabels["2CCeiling"] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionRight"]}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionLeft"]}`) + postfixFa}` : `Left: ${temp["ExtensionLeft"] + postfixEn}\u00A0\u00A0\u00A0Right: ${temp["ExtensionRight"] + postfixEn}`;
                                                        }
                                                        
                                                        temp["CeilingToWindow1"] = changeLang ? temp["CeilingToWindow1"] : temp["Height"];
                                                        temp["CeilingToWindow2"] = changeLang ? temp["CeilingToWindow2"] : temp["Height2"];
                                                        temp["CeilingToWindow3"] = changeLang ? temp["CeilingToWindow3"] : temp["Height3"];
                                                        selectValues["CeilingToWindow1"] = temp["CeilingToWindow1"] ? [{value: temp["CeilingToWindow1"]}] : [];
                                                        selectValues["CeilingToWindow2"] = temp["CeilingToWindow2"] ? [{value: temp["CeilingToWindow2"]}] : [];
                                                        selectValues["CeilingToWindow3"] = temp["CeilingToWindow3"] ? [{value: temp["CeilingToWindow3"]}] : [];
                                                        if (temp["CeilingToWindow1"] && temp["CeilingToWindow2"] && temp["CeilingToWindow3"]) {
                                                            let tempMin = Math.min(temp["CeilingToWindow1"], temp["CeilingToWindow2"], temp["CeilingToWindow3"]);
                                                            tempLabels["2D"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMin}`) + postfixFa : tempMin + postfixEn;
                                                        }
                                                        // selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                        // if (temp["CeilingToFloor"]) {
                                                        //     tempLabels["2E"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                        // }
                                                        
                                                        depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "2B,") + (temp["ExtensionLeft"] !== undefined ? "" : "2CCeiling1,") + (temp["ExtensionRight"] !== undefined ? "" : "2CCeiling2,") + (temp["CeilingToWindow1"] !== undefined ? "" : "2D1,") + (temp["CeilingToWindow2"] !== undefined ? "" : "2D2,") + (temp["CeilingToWindow3"] !== undefined ? "" : "2D3,"), "2,2A", depSetTempArr)]);
                                                        setSelectCustomValues(selectValues);
                                                        setStepSelectedLabel(tempLabels);
                                                        setStepSelectedValue(tempValue);
                                                    } else if (temp["FinishedLengthType"] === "Apron") {
                                                        let refIndex = inputs.current["2A2"].getAttribute('ref-num');
                                                        tempLabels[refIndex] = inputs.current["2A2"].getAttribute('text');
                                                        tempValue[refIndex] = inputs.current["2A2"].value;
                                                        setStepSelectedLabel(tempLabels);
                                                        setStepSelectedValue(tempValue);
                                                        
                                                        let tempWidth = changeLang ? temp["Width2B"] : temp["Width"];
                                                        // let tempHeight = changeLang ? temp["Height2D"] : temp["Height"];
                                                        // console.log(temp,tempWidth,tempHeight);
                                                        
                                                        selectValues["Width2B"] = tempWidth ? [{value: tempWidth}] : [];
                                                        if (tempWidth) {
                                                            tempLabels["2B"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                        }
                                                        selectValues["left"] = temp["ExtensionLeft"] ? [{value: temp["ExtensionLeft"]}] : [];
                                                        selectValues["right"] = temp["ExtensionRight"] ? [{value: temp["ExtensionRight"]}] : [];
                                                        if (temp["ExtensionLeft"] !== undefined && temp["ExtensionRight"] !== undefined) {
                                                            tempLabels["2CCeiling"] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionRight"]}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionLeft"]}`) + postfixFa}` : `Left: ${temp["ExtensionLeft"] + postfixEn}\u00A0\u00A0\u00A0Right: ${temp["ExtensionRight"] + postfixEn}`;
                                                        }
                                                        
                                                        temp["CeilingToWindow1"] = changeLang ? temp["CeilingToWindow1"] : temp["Height"];
                                                        temp["CeilingToWindow2"] = changeLang ? temp["CeilingToWindow2"] : temp["Height2"];
                                                        temp["CeilingToWindow3"] = changeLang ? temp["CeilingToWindow3"] : temp["Height3"];
                                                        selectValues["CeilingToWindow1"] = temp["CeilingToWindow1"] ? [{value: temp["CeilingToWindow1"]}] : [];
                                                        selectValues["CeilingToWindow2"] = temp["CeilingToWindow2"] ? [{value: temp["CeilingToWindow2"]}] : [];
                                                        selectValues["CeilingToWindow3"] = temp["CeilingToWindow3"] ? [{value: temp["CeilingToWindow3"]}] : [];
                                                        if (temp["CeilingToWindow1"] && temp["CeilingToWindow2"] && temp["CeilingToWindow3"]) {
                                                            let tempMin = Math.min(temp["CeilingToWindow1"], temp["CeilingToWindow2"], temp["CeilingToWindow3"]);
                                                            tempLabels["2D"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMin}`) + postfixFa : tempMin + postfixEn;
                                                        }
                                                        // selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                        // if (temp["CeilingToFloor"]) {
                                                        //     tempLabels["2E"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                        // }
                                                        
                                                        depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "2B,") + (temp["ExtensionLeft"] !== undefined ? "" : "2CCeiling1,") + (temp["ExtensionRight"] !== undefined ? "" : "2CCeiling2,") + (temp["CeilingToWindow1"] !== undefined ? "" : "2D1,") + (temp["CeilingToWindow2"] !== undefined ? "" : "2D2,") + (temp["CeilingToWindow3"] !== undefined ? "" : "2D3,"), "2,2A", depSetTempArr)]);
                                                        setSelectCustomValues(selectValues);
                                                        setStepSelectedLabel(tempLabels);
                                                        setStepSelectedValue(tempValue);
                                                    } else {
                                                        let refIndex = inputs.current["2A3"].getAttribute('ref-num');
                                                        tempLabels[refIndex] = inputs.current["2A3"].getAttribute('text');
                                                        tempValue[refIndex] = inputs.current["2A3"].value;
                                                        setStepSelectedLabel(tempLabels);
                                                        setStepSelectedValue(tempValue);
                                                        
                                                        let tempWidth = changeLang ? temp["Width2B"] : temp["Width"];
                                                        // let tempHeight = changeLang ? temp["Height2D"] : temp["Height"];
                                                        // console.log(temp,tempWidth,tempHeight);
                                                        
                                                        selectValues["Width2B"] = tempWidth ? [{value: tempWidth}] : [];
                                                        if (tempWidth) {
                                                            tempLabels["2B"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                        }
                                                        selectValues["left"] = temp["ExtensionLeft"] ? [{value: temp["ExtensionLeft"]}] : [];
                                                        selectValues["right"] = temp["ExtensionRight"] ? [{value: temp["ExtensionRight"]}] : [];
                                                        if (temp["ExtensionLeft"] !== undefined && temp["ExtensionRight"] !== undefined) {
                                                            tempLabels["2CCeiling"] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionRight"]}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionLeft"]}`) + postfixFa}` : `Left: ${temp["ExtensionLeft"] + postfixEn}\u00A0\u00A0\u00A0Right: ${temp["ExtensionRight"] + postfixEn}`;
                                                        }
                                                        
                                                        temp["CeilingToFloor1"] = changeLang ? temp["CeilingToFloor1"] : temp["Height"];
                                                        temp["CeilingToFloor2"] = changeLang ? temp["CeilingToFloor2"] : temp["Height2"];
                                                        temp["CeilingToFloor3"] = changeLang ? temp["CeilingToFloor3"] : temp["Height3"];
                                                        selectValues["CeilingToFloor1"] = temp["CeilingToFloor1"] ? [{value: temp["CeilingToFloor1"]}] : [];
                                                        selectValues["CeilingToFloor2"] = temp["CeilingToFloor2"] ? [{value: temp["CeilingToFloor2"]}] : [];
                                                        selectValues["CeilingToFloor3"] = temp["CeilingToFloor3"] ? [{value: temp["CeilingToFloor3"]}] : [];
                                                        if (temp["CeilingToFloor1"] && temp["CeilingToFloor2"] && temp["CeilingToFloor3"]) {
                                                            let tempMin = Math.min(temp["CeilingToFloor1"], temp["CeilingToFloor2"], temp["CeilingToFloor3"]);
                                                            tempLabels["2DFloor"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMin}`) + postfixFa : tempMin + postfixEn;
                                                        }
                                                        
                                                        depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "2B,") + (temp["ExtensionLeft"] !== undefined ? "" : "2CCeiling1,") + (temp["ExtensionRight"] !== undefined ? "" : "2CCeiling2,") + (temp["CeilingToFloor1"] !== undefined ? "" : "2DFloor1,") + (temp["CeilingToFloor2"] !== undefined ? "" : "2DFloor2,") + (temp["CeilingToFloor3"] !== undefined ? "" : "2DFloor3,"), "2,2A", depSetTempArr)]);
                                                        setSelectCustomValues(selectValues);
                                                        setStepSelectedLabel(tempLabels);
                                                        setStepSelectedValue(tempValue);
                                                    }
                                                }, 200);
                                            }
                                        } else {
                                            if (temp["FinishedLengthType"]) {
                                                setTimeout(() => {
                                                    setStep2A(temp["FinishedLengthType"]);
                                                    
                                                    if (temp["FinishedLengthType"] === "Sill") {
                                                        let refIndex = inputs.current["2A1"].getAttribute('ref-num');
                                                        tempLabels[refIndex] = inputs.current["2A1"].getAttribute('text');
                                                        tempValue[refIndex] = inputs.current["2A1"].value;
                                                        setStepSelectedLabel(tempLabels);
                                                        setStepSelectedValue(tempValue);
                                                        
                                                        let tempWidth = changeLang ? temp["Width2B"] : temp["Width"];
                                                        let tempHeight = changeLang ? temp["Height2D"] : temp["Height"];
                                                        // console.log(temp,tempWidth,tempHeight);
                                                        
                                                        selectValues["Width2B"] = tempWidth ? [{value: tempWidth}] : [];
                                                        if (tempWidth) {
                                                            tempLabels["2B"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                        }
                                                        selectValues["Height2D"] = tempHeight ? [{value: tempHeight}] : [];
                                                        if (tempHeight) {
                                                            tempLabels["2DWall"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempHeight}`) + postfixFa : tempHeight + postfixEn;
                                                        }
                                                        selectValues["left"] = temp["ExtensionLeft"] ? [{value: temp["ExtensionLeft"]}] : [];
                                                        selectValues["right"] = temp["ExtensionRight"] ? [{value: temp["ExtensionRight"]}] : [];
                                                        if (temp["ExtensionLeft"] !== undefined && temp["ExtensionRight"] !== undefined) {
                                                            tempLabels["2CCeiling"] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionRight"]}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionLeft"]}`) + postfixFa}` : `Left: ${temp["ExtensionLeft"] + postfixEn}\u00A0\u00A0\u00A0Right: ${temp["ExtensionRight"] + postfixEn}`;
                                                        }
                                                        // selectValues["WindowToFloor"] = temp["WindowToFloor"] ? [{value: temp["WindowToFloor"]}] : [];
                                                        // if (temp["WindowToFloor"]) {
                                                        //     tempLabels["2DWallFloor"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["WindowToFloor"]}`) + postfixFa : temp["WindowToFloor"] + postfixEn;
                                                        // }
                                                        selectValues["ShadeMount"] = temp["ShadeMount"] ? [{value: temp["ShadeMount"]}] : [];
                                                        if (temp["ShadeMount"] !== undefined) {
                                                            tempLabels["2EWall"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["ShadeMount"]}`) + postfixFa : temp["ShadeMount"] + postfixEn;
                                                        }
                                                        selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                        if (temp["CeilingToFloor"]) {
                                                            tempLabels["2FWall"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                        }
                                                        
                                                        depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "2B,") + (tempHeight ? "" : "2DWall,") + (temp["ExtensionLeft"] !== undefined ? "" : "2CCeiling1,") + (temp["ExtensionRight"] !== undefined ? "" : "2CCeiling2,") + (temp["ShadeMount"] !== undefined ? "" : "2EWall,") + (temp["CeilingToFloor"] !== undefined ? "" : "2FWall,"), "2,2A", depSetTempArr)]);
                                                        setSelectCustomValues(selectValues);
                                                        setStepSelectedLabel(tempLabels);
                                                        setStepSelectedValue(tempValue);
                                                    } else if (temp["FinishedLengthType"] === "Apron") {
                                                        let refIndex = inputs.current["2A2"].getAttribute('ref-num');
                                                        tempLabels[refIndex] = inputs.current["2A2"].getAttribute('text');
                                                        tempValue[refIndex] = inputs.current["2A2"].value;
                                                        setStepSelectedLabel(tempLabels);
                                                        setStepSelectedValue(tempValue);
                                                        
                                                        let tempWidth = changeLang ? temp["Width2B"] : temp["Width"];
                                                        let tempHeight = changeLang ? temp["Height2D"] : temp["Height"];
                                                        // console.log(temp,tempWidth,tempHeight);
                                                        
                                                        selectValues["Width2B"] = tempWidth ? [{value: tempWidth}] : [];
                                                        if (tempWidth) {
                                                            tempLabels["2B"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                        }
                                                        selectValues["Height2D"] = tempHeight ? [{value: tempHeight}] : [];
                                                        if (tempHeight) {
                                                            tempLabels["2DWall"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempHeight}`) + postfixFa : tempHeight + postfixEn;
                                                        }
                                                        selectValues["left"] = temp["ExtensionLeft"] ? [{value: temp["ExtensionLeft"]}] : [];
                                                        selectValues["right"] = temp["ExtensionRight"] ? [{value: temp["ExtensionRight"]}] : [];
                                                        if (temp["ExtensionLeft"] !== undefined && temp["ExtensionRight"] !== undefined) {
                                                            tempLabels["2CCeiling"] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionRight"]}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionLeft"]}`) + postfixFa}` : `Left: ${temp["ExtensionLeft"] + postfixEn}\u00A0\u00A0\u00A0Right: ${temp["ExtensionRight"] + postfixEn}`;
                                                        }
                                                        // selectValues["WindowToFloor"] = temp["WindowToFloor"] ? [{value: temp["WindowToFloor"]}] : [];
                                                        // if (temp["WindowToFloor"]) {
                                                        //     tempLabels["2DWallFloor"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["WindowToFloor"]}`) + postfixFa : temp["WindowToFloor"] + postfixEn;
                                                        // }
                                                        selectValues["ShadeMount"] = temp["ShadeMount"] ? [{value: temp["ShadeMount"]}] : [];
                                                        if (temp["ShadeMount"] !== undefined) {
                                                            tempLabels["2EWall"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["ShadeMount"]}`) + postfixFa : temp["ShadeMount"] + postfixEn;
                                                        }
                                                        selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                        if (temp["CeilingToFloor"]) {
                                                            tempLabels["2FWall"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                        }
                                                        
                                                        depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "2B,") + (tempHeight ? "" : "2DWall,") + (temp["ExtensionLeft"] !== undefined ? "" : "2CCeiling1,") + (temp["ExtensionRight"] !== undefined ? "" : "2CCeiling2,") + (temp["ShadeMount"] !== undefined ? "" : "2EWall,") + (temp["CeilingToFloor"] !== undefined ? "" : "2FWall,"), "2,2A", depSetTempArr)]);
                                                        setSelectCustomValues(selectValues);
                                                        setStepSelectedLabel(tempLabels);
                                                        setStepSelectedValue(tempValue);
                                                    } else {
                                                        let refIndex = inputs.current["2A3"].getAttribute('ref-num');
                                                        tempLabels[refIndex] = inputs.current["2A3"].getAttribute('text');
                                                        tempValue[refIndex] = inputs.current["2A3"].value;
                                                        setStepSelectedLabel(tempLabels);
                                                        setStepSelectedValue(tempValue);
                                                        
                                                        let tempWidth = changeLang ? temp["Width2B"] : temp["Width"];
                                                        let tempHeight = changeLang ? temp["WindowToFloor"] : temp["Height"];
                                                        // console.log(temp,tempWidth,tempHeight);
                                                        
                                                        selectValues["Width2B"] = tempWidth ? [{value: tempWidth}] : [];
                                                        if (tempWidth) {
                                                            tempLabels["2B"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                        }
                                                        selectValues["left"] = temp["ExtensionLeft"] ? [{value: temp["ExtensionLeft"]}] : [];
                                                        selectValues["right"] = temp["ExtensionRight"] ? [{value: temp["ExtensionRight"]}] : [];
                                                        if (temp["ExtensionLeft"] !== undefined && temp["ExtensionRight"] !== undefined) {
                                                            tempLabels["2CCeiling"] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionRight"]}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionLeft"]}`) + postfixFa}` : `Left: ${temp["ExtensionLeft"] + postfixEn}\u00A0\u00A0\u00A0Right: ${temp["ExtensionRight"] + postfixEn}`;
                                                        }
                                                        selectValues["WindowToFloor"] = tempHeight ? [{value: tempHeight}] : [];
                                                        if (tempHeight) {
                                                            tempLabels["2DWallFloor"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempHeight}`) + postfixFa : tempHeight + postfixEn;
                                                        }
                                                        selectValues["ShadeMount"] = temp["ShadeMount"] ? [{value: temp["ShadeMount"]}] : [];
                                                        if (temp["ShadeMount"] !== undefined) {
                                                            tempLabels["2EWallFloor"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["ShadeMount"]}`) + postfixFa : temp["ShadeMount"] + postfixEn;
                                                        }
                                                        selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                        if (temp["CeilingToFloor"]) {
                                                            tempLabels["2FWallFloor"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                        }
                                                        
                                                        depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "2B,") + (temp["ExtensionLeft"] !== undefined ? "" : "2CCeiling1,") + (temp["ExtensionRight"] !== undefined ? "" : "2CCeiling2,") + (tempHeight !== undefined ? "" : "2DWallFloor,") + (temp["ShadeMount"] !== undefined ? "" : "2EWallFloor,") + (temp["CeilingToFloor"] !== undefined ? "" : "2FWallFloor,"), "2,2A", depSetTempArr)]);
                                                        setSelectCustomValues(selectValues);
                                                        setStepSelectedLabel(tempLabels);
                                                        setStepSelectedValue(tempValue);
                                                    }
                                                }, 200);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (temp["WindowWidth"] && temp["WindowHeight"]) {
                        getWindowSize(temp["WindowWidth"], temp["WindowHeight"]);
                    }
                    
                    if (temp["StackPosition"]) {
                        setStep4(temp["StackPosition"]);
                        if (temp["StackPosition"] === "Left") {
                            let refIndex = inputs.current["41"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["41"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["41"].value;
                            depSetTempArr = new Set([...setGetDeps("", "4,4A", depSetTempArr)]);
                        } else if (temp["StackPosition"] === "Right") {
                            let refIndex = inputs.current["42"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["42"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["42"].value;
                            depSetTempArr = new Set([...setGetDeps("", "4,4A", depSetTempArr)]);
                        } else {
                            let refIndex = inputs.current["43"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["43"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["43"].value;
                            depSetTempArr = new Set([...setGetDeps("4A", "4", depSetTempArr)]);
                        }
                        setStepSelectedLabel(tempLabels);
                        setStepSelectedValue(tempValue);
                    }
                    
                    if (temp["ControlPosition"]) {
                        setStep4A(temp["ControlPosition"]);
                        if (temp["ControlPosition"] === "Left") {
                            let refIndex = inputs.current["4A1"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["4A1"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["4A1"].value;
                            depSetTempArr = new Set([...setGetDeps("", "4A", depSetTempArr)]);
                        } else {
                            let refIndex = inputs.current["4A2"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["4A2"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["4A2"].value;
                            depSetTempArr = new Set([...setGetDeps("", "4A", depSetTempArr)]);
                        }
                        setStepSelectedLabel(tempLabels);
                        setStepSelectedValue(tempValue);
                    }
                    
                    if (temp["ControlType"]) {
                        setStep5(temp["ControlType"]);
                        if (temp["ControlType"] === "Chain & Cord") {
                            let refIndex = inputs.current["51"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["51"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["51"].value;
                            
                            depSetTempArr = new Set([...setGetDeps("", "5", depSetTempArr)]);
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                        } else {
                            let refIndex = inputs.current["52"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["52"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["52"].value;
                            
                            depSetTempArr = new Set([...setGetDeps((temp["hasPower"] ? (temp["MotorType"] ? "" : "511,") : "51,"), "5", depSetTempArr)]);
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            if (temp["hasPower"] !== undefined) {
                                setStep51(temp["hasPower"].toString());
                                
                                setTimeout(() => {
                                    let refIndex = inputs.current["511"].getAttribute('ref-num');
                                    tempLabels[refIndex] = inputs.current["511"].getAttribute('text');
                                    tempValue[refIndex] = inputs.current["511"].value;
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                    
                                    if (temp["Accessories"] && temp["Accessories"].length) {
                                        // setMotorLoad(true);
                                        setCustomMotorAcc(temp["Accessories"][0]);
                                    }
                                    
                                    setSelectedMotorType(temp["MotorType"] ? [{
                                        value: temp["MotorType"],
                                        label: MotorType[pageLanguage].find(opt => opt.value === temp["MotorType"]).label
                                    }] : []);
                                }, 200);
                            }
                        }
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
                    
                    if (temp["ZipCode"] && temp["ZipCode"] !== "" && temp["InstallAmount"] && temp["InstallAmount"] > 0 && temp["TransportationAmount"] && temp["TransportationAmount"] > 0) {
                        setZipcode(temp["ZipCode"]);
                        setZipcodeButton(true);
                        setHasInstall(true);
                        setZipcodeChecked("true");
                        setInstallPrice(temp["InstallAmount"]);
                        setTransportPrice(temp["TransportationAmount"]);
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
                        setPageLoad(false);
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
    
    function checkMaxWidth(width, left, right) {
        if (width.length && left.length && right.length && (+parseInt(width[0].value) + +parseInt(left[0].value) + +parseInt(right[0].value)) > 300) {
            modalHandleShow("widthLimit");
            let temp = JSON.parse(JSON.stringify(selectCustomValues));
            temp.left = [];
            temp.right = [];
            setSelectCustomValues(temp);
            setLeftRight({
                "left": "",
                "right": ""
            });
            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
            delete tempLabels["2CCeiling"];
            delete tempLabels["2C"];
            setStepSelectedLabel(tempLabels);
            setCart("", "", "ExtensionLeft,ExtensionRight");
        } else {
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
    const [selectedMotorType, setSelectedMotorType] = useState([]);
    const [selectedMotorMinPrice, setSelectedMotorMinPrice] = useState(0);
    
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
    
    useEffect(() => {
        if (fabricSelected.selectedFabricId && fabricSelected.selectedFabricId !== 0) {
            // fabricClicked(fabricSelected.selectedPhoto, fabricSelected.selectedHasTrim);
            // let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
            // tempLabels["3"] = location.pathname.split('').slice(1, 3).join('') === "fa" ? fabricSelected.selectedTextFa + "/" + fabricSelected.selectedColorFa : fabricSelected.selectedTextEn + "/" + fabricSelected.selectedColorEn;
            // let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
            // tempValue["3"] = fabricSelected.selectedFabricId;
            // setStepSelectedLabel(tempLabels);
            // setStepSelectedValue(tempValue);
            setCart("FabricId", fabricSelected.selectedFabricId);
            // setCart("FabricId", `${fabricSelected.selectedFabricId}`, "", "FabricDesignFa,FabricDesignEn,FabricColorEn,FabricColorFa,PhotoUrl", [fabricSelected.selectedTextFa, fabricSelected.selectedTextEn, fabricSelected.selectedColorEn, fabricSelected.selectedColorFa, fabricSelected.selectedPhoto]);
            // setCart("PhotoUrl", fabricSelected.selectedPhoto);
            setStep3(fabricSelected.selectedFabricId.toString());
            setFabricColorHtmlCode(fabricSelected.ColorHtmlCode);
            let temp = JSON.parse(JSON.stringify(requiredStep));
            if (requiredStep["1"]) {
                temp["1"] = false;
            }
            setRequiredStep(temp);
    
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
        }).catch(() => {
            if (Object.keys(fabrics).length) {
                setTimeout(() => {
                    renderFabrics({});
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
    //                         let tempMax = temp.values[objKey][temp.values[objKey].indexOf(Math.min(...temp.values[objKey]))];
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
            setTimeout(() => {
                fabricSwatch("0", swatchLoginSwatchId, swatchLoginSwatchDetailId);
            }, 500);
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
            // setDefaultFabricPhoto(model["DefaultFabricPhotoUrl"]);
            // setCart("PhotoUrl", model["DefaultFabricPhotoUrl"]);
            // setDefaultModelName(model["ModelENName"]);
            // setDefaultModelNameFa(model["ModelName"]);
        }
    }, [model]);
    
    useEffect(() => {
        checkMaxWidth(selectCustomValues.Width2B, selectCustomValues.left, selectCustomValues.right)
    }, [selectCustomValues]);
    
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
        // console.log(Object.keys(model).length !== 0 , cartValues["WidthCart"] !== undefined);
        if (Object.keys(model).length !== 0 && cartValues["WidthCart"] !== undefined) {
            let tempObj = {};
            model["Accessories"].forEach(obj => {
                let tempObj2 = {};
                obj["SewingAccessoryDetails"].forEach(el => {
                    tempObj2[el["SewingAccessoryDetailId"]] = JSON.parse(JSON.stringify(el));
                    tempObj2[el["SewingAccessoryDetailId"]]["Price"] = obj["CalcMethodId"] === 5602 ? el["Price"] * cartValues["WidthCart"] / 100 : el["Price"];
                });
                tempObj[obj["SewingAccessoryId"]] = tempObj2;
            });
            setModelAccessories(tempObj);
            // console.log(model["Accessories"]);
        } else {
            setModelAccessories({});
        }
    }, [JSON.stringify(cartValues)]);
    
    useEffect(() => {
        if (Object.keys(model).length !== 0 && cartValues["WidthCart"] !== undefined) {
            // let tempObj = {};
            // model["Accessories"].forEach(obj => {
            //     let tempObj2 = {};
            //     obj["SewingAccessoryDetails"].forEach(el => {
            //         tempObj2[el["SewingAccessoryDetailId"]] = JSON.parse(JSON.stringify(el));
            //         tempObj2[el["SewingAccessoryDetailId"]]["Price"] = el["Price"] * cartValues["WidthCart"] / 100;
            //     });
            //     tempObj[obj["SewingAccessoryId"]] = tempObj2;
            // });
            // setModelAccessories(tempObj);
            // setNoWidth(false);
            
            renderDkCurtains(cartValues["WidthCart"]);
        } else {
            // setModelAccessories({});
            // setNoWidth(true);
            renderDkCurtains(184);
        }
    }, [JSON.stringify(cartValues["WidthCart"])]);
    
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
        if (firstRenderDK.current) {
            firstRenderDK.current = false;
        } else {
            if (cartValues["WidthCart"] !== undefined) {
                renderDkCurtains(cartValues["WidthCart"]);
                
                let pageLanguage = location.pathname.split('').slice(1, 3).join('');
                let tempArr = [];
                let tempObj = [];
                let tempObjFabric = [];
                let promiseArr = [];
                if (dkCurtainArr.length) {
                    for (let i = 0; i <= dkCurtainArr.length; i++) {
                        if (dkCurtainArr[i] && Object.keys(dkCurtainArr[i]).length > 0) {
                            promiseArr[i] = new Promise((resolve, reject) => {
                                // console.log(dkCurtainArr[i]);
                                let objKey = (pageLanguage === 'en' ? Uppercase(dkCurtainArr[i]["DesignEnName"]) : dkCurtainArr[i]["DesignName"]).toString() + "/" + (pageLanguage === 'en' ? Uppercase(dkCurtainArr[i]["ColorEnName"]) : dkCurtainArr[i]["ColorName"]).toString();
                                tempObj[i] = objKey;
                                // tempObjFabric[i] = dkCurtainArr[i]["FabricId"];
                                tempObjFabric[i] = dkCurtainArr[i];
                                // console.log(tempObjFabric);
                                resolve();
                            });
                        }
                    }
                    
                    Promise.all(promiseArr).then(() => {
                        let promiseArr2 = [];
                        let lastString = tempObj[0];
                        let lastFabric = tempObjFabric[0] ? tempObjFabric[0]["FabricId"] : undefined;
                        let lastFabricObj = tempObjFabric[0] ? tempObjFabric[0] : undefined;
                        let tempObjCount = {};
                        let count = 0;
                        let lastRef = 0;
                        
                        const doPush = (refIndex) => {
                            tempObjCount[refIndex] = {
                                "count": count,
                                "string": lastString,
                                "fabricId": lastFabric,
                                "fabricObj": lastFabricObj
                            };
                        };
                        for (let i = 0; i < tempObj.length; i++) {
                            let string = tempObj[i];
                            promiseArr2[i] = new Promise((resolve, reject) => {
                                if (string !== lastString) {
                                    doPush(lastRef);
                                    lastString = string;
                                    lastFabric = tempObjFabric[i] ? tempObjFabric[i]["FabricId"] : undefined;
                                    lastFabricObj = tempObjFabric[i] ? tempObjFabric[i] : undefined;
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
                                                 className="dk_curtain_preview_detail"><h2>{tempObjCount[key]["string"]}</h2><h5>&nbsp;X</h5>
                                                <h3>{pageLanguage === 'en' ? tempObjCount[key]["count"] : NumberToPersianWord.convertEnToPe(`${tempObjCount[key]["count"]}`)}</h3>
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
                                                    "FabricOrder": (+key + +1).toString(),
                                                    "FabricObj": tempObjCount[key]["fabricObj"]
                                                });
                                        }
                                        resolve();
                                    });
                                });
                                
                                Promise.all(promiseArr4).then(() => {
                                    setSodFabrics(tempSodFabrics);
                                    setCart("CurtainArr", dkCurtainArr, "", "SodFabrics", [tempSodFabrics]);
                                    // console.log(tempSodFabrics);
                                    if (pageLoadDK) {
                                        setPageLoadDK(false);
                                    }
                                });
                            });
                            // console.log(curtainList)
                        });
                    });
                } else {
                    setDkCurtainPreviewList([]);
                    setSodFabrics([]);
                    setCart("", "", "CurtainArr,SodFabrics");
                }
            }
        }
    }, [JSON.stringify(dkCurtainArr), symmetric, pageLanguage]);
    
    useEffect(() => {
        if (curtainChangeId !== -1) {
            if (cartValues["WidthCart"] !== undefined) {
                let tempArr = JSON.parse(JSON.stringify(dkCurtainArr));
                let count = Math.floor(cartValues["WidthCart"] / 11.5);
                tempArr = tempArr.slice(0, count);
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
                    let params = parameters === undefined || parameters === null || parameters === "undefined" || parameters === "null" || parameters === "" ? "{}" : JSON.parse(JSON.stringify(parameters));
                    
                    let DesignCode = fabricObject["DesignCode"].toString();
                    let designOnlyOneSelected = params["Designs"] && params["Designs"][DesignCode] && params["Designs"][DesignCode]["onlyOne"] ? params["Designs"][DesignCode]["onlyOne"] : false;
                    console.log(params, params["Designs"], designOnlyOneSelected);
                    
                    let baseNotOne = false;
                    let decorNotOne = false;
                    let promise2 = new Promise((resolve, reject) => {
                        let tempArr2 = JSON.parse(JSON.stringify(tempArr));
                        if (symmetric) {
                            tempArr2[curtainChangeId] = fabricObject;
                            tempArr2[count - curtainChangeId - 1] = fabricObject;
                        } else {
                            tempArr2[curtainChangeId] = fabricObject;
                        }
                        
                        if (designOnlyOneSelected) {
                            if (baseOneArr.includes(DesignCode)) {
                                if (tempArr2.filter(n => n).find(item => item["DesignCode"] !== DesignCode && baseOneArr.includes(item["DesignCode"]))) {
                                    // console.log("1");
                                    baseNotOne = true;
                                    resolve(tempArr);
                                } else {
                                    // console.log("2");
                                    baseNotOne = false;
                                    resolve(tempArr2);
                                }
                            } else if (decorativeOneArr.includes(DesignCode)) {
                                if (tempArr2.filter(n => n).find(item => item["DesignCode"] !== DesignCode && decorativeOneArr.includes(item["DesignCode"]))) {
                                    // console.log("3");
                                    decorNotOne = true;
                                    resolve(tempArr);
                                } else {
                                    // console.log("4");
                                    decorNotOne = false;
                                    resolve(tempArr2);
                                }
                            } else {
                                // console.log("5");
                                baseNotOne = false;
                                decorNotOne = false;
                                resolve(tempArr2);
                            }
                        } else {
                            // console.log("6");
                            baseNotOne = false;
                            decorNotOne = false;
                            resolve(tempArr2);
                        }
                    });
                    
                    promise2.then((tempArr3) => {
                        // console.log(tempArr, baseMore,decorativeMore,baseOneArr,decorativeOneArr,designOnlyOneSelected);
                        
                        // console.log(tempArr3, baseNotOne, decorNotOne)
                        if (baseNotOne) {
                            modalHandleShow("onlyOneBase");
                        } else if (decorNotOne) {
                            modalHandleShow("onlyOneDecor");
                        }
                        setDkCurtainArr(tempArr3);
                        setCurtainChangeId(-1);
                    });
                });
            } else {
                modalHandleShow("noMeasurements");
                setCurtainChangeId(-1);
            }
        }
    }, [curtainChangeId]);
    
    // useEffect(() => {
    //     if (sodFabrics.length) {
    //         let count = Math.floor(cartValues["WidthCart"] / 11.5);
    //         let DkCurtainArr = JSON.parse(JSON.stringify(dkCurtainArr));
    //         if (DkCurtainArr.filter(el => el).length === count) {
    //             measureWindowSize(true);
    //         }
    //     } else {
    //         measureWindowSize(true);
    //     }
    // }, [JSON.stringify(sodFabrics)]);
    
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
                setShowMoreFabric("");
                setShowLessFabric("");
                // console.log(tempFabrics);
            });
        }
    }, [showMoreFabric]);
    
    useEffect(() => {
        if (showLessFabric !== "") {
            let tempFabrics = JSON.parse(JSON.stringify(fabrics));
            
            let promiseArr = [];
            if (fabrics[showLessFabric]) {
                tempFabrics[showLessFabric].forEach((el, index) => {
                    promiseArr[index] = new Promise((resolve, reject) => {
                        el["ShowMore"] = false;
                        // console.log(fabrics[showMoreFabric],el,index);
                        resolve();
                    });
                })
            }
            
            Promise.all(promiseArr).then(() => {
                setFabrics(tempFabrics);
                setShowMoreFabric("");
                setShowLessFabric("");
                // console.log(tempFabrics);
            });
        }
    }, [showLessFabric]);
    
    // useEffect(() => {
    //     if ((baseMore || baseMore === false) || (decorativeMore || decorativeMore === false)) {
    //         if (Object.keys(fabrics).length) {
    //             renderFabrics(bag);
    //         } else {
    //             setFabricsList([]);
    //             setFabricsList2([]);
    //         }
    //     }
    // }, [baseMore, decorativeMore]);
    
    useEffect(() => {
        if (pageLoad === false && pageLoadDK === false) {
            setCart(undefined, undefined);
        }
    }, [pageLoad, pageLoadDK]);
    
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
    
    useEffect(() => {
        if (pageItem) {
            setDefaultFabricPhoto(pageItem["MainImageUrl"]);
            if (pageType) {
                setCart("PhotoUrl", pageItem["MainImageUrl"], "", "PageType,PageId", [pageType, pageId]);
            } else {
                setCart("PhotoUrl", pageItem["MainImageUrl"], "", "PageId", [pageId]);
            }
            setDefaultModelName(pageItem["EnTitle"]);
            setDefaultModelNameFa(pageItem["Title"]);
            setDefaultModelDesc(pageItem["DescriptionEn"]);
            setDefaultModelDescFa(pageItem["Description"]);
        }
    }, [pageItem]);
    
    async function setLang() {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
    }
    
    function getHasZipcode() {
        GetBasketZipcode(isLoggedIn).then((temp) => {
            if (temp === 401) {
                getHasZipcode();
            } else if (temp && temp !== "") {
                setHasZipcode(temp);
                setZipcode(temp);
                setZipcodeButton(true);
                setHasInstall(true);
               // setCart("", "", "ZipCode");
            } else {
                setHasZipcode("");
                setZipcode("");
                setZipcodeButton(false);
                setHasInstall(false);
            }
        }).catch((err) => {
            console.log(err);
            setHasZipcode("");
            setZipcode("");
            setZipcodeButton(false);
            setHasInstall(false);
        });
    }
    
    async function getCart() {
        return await new Promise((resolve, reject) => {
            if (isLoggedIn) {
                axios.get(baseURLGetCart, {
                    headers: authHeader()
                }).then((response) => {
                    setBag(response.data ? response.data : {});
                    resolve(response.data ? response.data : {});
                }).catch(err => {
                    console.log(err);
                    if (err.response && err.response.status === 401) {
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
                        // setCartChanged(cartChanged + 1);
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
                        getHasZipcode();
                        setTimeout(() => {
                            renderFabrics(temp);
                        }, 100);
                    }).catch(() => {
                        getHasZipcode();
                        setTimeout(() => {
                            renderFabrics({});
                        }, 100);
                    });
                } else {
                    let pageLanguage1 = location.pathname.split('').slice(1, 3).join('');
                    setFabricsList([<div className={`material_detail ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`} key={"fabric" + "empty"}>
                        <div className={`material_traits ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`}>
                            <h5 className="empty_fabrics">{pageLanguage1 === 'en' ? "Sorry, no matching fabrics.\nTo view more results, try clearing your filters." : ""}</h5>
                            <button className="empty_fabrics_btn white_btn btn" onClick={() => {
                                setFabricsList([<div className={`material_detail ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`} key={"fabric" + "empty"}>
                                    <div className={`material_traits ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`}>
                                        <h5 className="empty_fabrics">{pageLanguage1 === 'en' ? "Sorry, no matching fabrics.\nTo view more results, try clearing your filters." : ""}</h5>
                                        <button className="empty_fabrics_btn white_btn btn">{pageLanguage1 === 'fa' ? "" : "CLEARING"}</button>
                                    </div>
                                </div>]);
                                setTimeout(() => {
                                    setIsClearAll(true);
                                }, 300);
                            }}>{pageLanguage1 === 'fa' ? "" : "CLEAR ALL FILTERS"}</button>
                        </div>
                    </div>]);
                }
            }
        });
    }, [fabrics, cartChanged, isLoggedIn, location.pathname]);
    
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
        } else {
            dispatch({
                type: CartUpdatedTrue,
                payload: {mainCart: bag}
            });
        }
    }, [bag]);
    
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
        if (!isClearAll) {
            getFabricsWithFilter();
        }
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
                        <input type="checkbox" filter-id={obj.value} defaultChecked={queryString["colors"].includes(obj.value.toString())}
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
        // GetSewingFilters(2, `${modelID}`).then((temp) => {
        //     setSewingPatterns(temp[location.pathname.split('').slice(1, 3).join('')].map((obj, index) => (
        //         <Dropdown.Item as={Button} key={index}>
        //             <label className="dropdown_label">
        //                 <input type="checkbox" filter-id={obj.value} defaultChecked={queryString["patterns"].includes(obj.value.toString())}
        //                        ref={ref => (filterCheckboxes.current["patterns"] = [...filterCheckboxes.current["patterns"], ref])}
        //                        onChange={(e) => {
        //                            setFilterChanged({
        //                                filter: 2,
        //                                filter_id: e.target.getAttribute("filter-id"),
        //                                isDelete: e.target.checked
        //                            });
        //                        }} id={"dropdown_pattern" + obj.value + index}/>
        //                 <label htmlFor={"dropdown_pattern" + obj.value + index} className="checkbox_label">
        //                     <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')} alt=""/>
        //                 </label>
        //                 {obj.label}
        //             </label>
        //         </Dropdown.Item>
        //     )));
        // });
        
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
                        setSewingPatterns(tempArr.map((obj, index) => (
                            <Dropdown.Item as={Button} key={index}>
                                <label className="dropdown_label" onClick={() => {
                                    navigate("/" + pageLanguage + "/Curtain/" + catID + "/" + obj.Link + "/Page-ID/" + obj.WebsitePageItemId);
                                    window.location.reload();
                                }}>
                                    <input type="checkbox" disabled
                                           onChange={(e) => {
                                           }} id={"dropdown_pattern" + index}/>
                                    <label htmlFor={"dropdown_pattern" + index} className="checkbox_label">
                                        <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')} alt=""/>
                                    </label>
                                    {location.pathname.split('').slice(1, 3).join('') === "fa" ? obj.Title : obj.EnTitle}
                                </label>
                            </Dropdown.Item>
                        )));
                    });
                } else {
                    setSewingPatterns(response.data["WebsitePageItems"].map((obj, index) => (
                        <Dropdown.Item as={Button} key={index}>
                            <label className="dropdown_label" onClick={() => {
                                navigate("/" + pageLanguage + "/Curtain/" + catID + "/" + obj.Link + "/Page-ID/" + obj.WebsitePageItemId);
                                window.location.reload();
                            }}>
                                <input type="checkbox" disabled
                                       onChange={(e) => {
                                       }} id={"dropdown_pattern" + index}/>
                                <label htmlFor={"dropdown_pattern" + index} className="checkbox_label">
                                    <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')} alt=""/>
                                </label>
                                {location.pathname.split('').slice(1, 3).join('') === "fa" ? obj.Title : obj.EnTitle}
                            </label>
                        </Dropdown.Item>
                    )));
                }
            } else {
                setSewingPatterns([]);
            }
        }).catch(err => {
            console.log(err);
            setSewingPatterns([]);
        });
        
        GetSewingFilters(3, `${modelID}`).then((temp) => {
            setSewingTypes(temp[location.pathname.split('').slice(1, 3).join('')].map((obj, index) => (
                <Dropdown.Item as={Button} key={index}>
                    <label className="dropdown_label">
                        <input type="checkbox" filter-id={obj.value} defaultChecked={queryString["types"].includes(obj.value.toString())}
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
                        <input type="checkbox" filter-id={obj.value} defaultChecked={queryString["prices"].includes(obj.value.toString())}
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
        // console.log(cartValues);
    }, [JSON.stringify(cartValues)]);
    
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
        } else if (sessionStorage.getItem("cartCopy") !== null) {
            let tempCartValues = JSON.parse(sessionStorage.getItem("cartCopy"));
            if (Object.keys(tempCartValues).length !== 0) {
                if (tempCartValues["SewingModelId"] && tempCartValues["SewingModelId"] === `${modelID}`) {
                    setStepSelectedLabel({});
                    setWindowSize("");
                    setProjectDetails(tempCartValues);
                }
            }
            sessionStorage.clear();
        } else if (Object.keys(cartValues).length !== 0) {
            setStepSelectedLabel({});
            setWindowSize("");
            setTimeout(() => {
                setProjectDetails(cartValues, undefined, true);
            }, 700);
        }
    }, [location.pathname]);
    
    const fixedDiv = useRef(null);
    const [offset, setOffset] = useState(false);
    
    useEffect(() => {
        const onScroll = () => {
            if (fixedDiv.current.offsetTop < window.pageYOffset + 92) {
                setOffset(true);
            } else {
                setOffset(false);
            }
        };
        
        // clean up code
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    
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
                <h1>{defaultModelName === undefined || defaultModelName === "" ? " " : pageLanguage === 'fa' ? convertToPersian(defaultModelNameFa) + " سفارشی " : "Custom " + defaultModelName}</h1>
                {defaultModelDesc && defaultModelDesc !== "" &&
                    <h2>{pageLanguage === 'fa' ? convertToPersian(defaultModelDescFa) : defaultModelDesc}</h2>
                }
            </div>
            <div className="model_customize_container">
                <div className={offset ? "model_customize_image model_customize_image_fixed" : "model_customize_image"} ref={fixedDiv}>
                    {(accordionActiveKey !== "3" && accordionActiveKey !== "35") &&
                        <div>
                            {defaultFabricPhoto &&
                                <img src={`https://api.atlaspood.ir/${defaultFabricPhoto}`} className="img-fluid" alt=""/>
                            }
                        </div>
                    }
                    {(accordionActiveKey === "3" || accordionActiveKey === "35") &&
                        <div className="dk_left_side_curtain">
                            <div className="card_body card-body-dk">
                                <div className="dk_curtain_container">
                                    <div className="dk_curtain_button_container">
                                        <div className="dk_curtain_symmetric_buttons">
                                            <button className={`dk_curtain_symmetric_button_left btn ${symmetric ? "dk_curtain_symmetric_button_on" : ""}`}
                                                    onClick={() => setSymmetric(true)}>
                                                {t("SYMMETRIC COLORING")}
                                            </button>
                                            <button className={`dk_curtain_symmetric_button_right btn ${!symmetric ? "dk_curtain_symmetric_button_on" : ""}`}
                                                    onClick={() => setSymmetric(false)}>
                                                {t("INDIVIDUAL COLORING")}
                                            </button>
                                        </div>
                                        <button className="dk_curtain_clear btn" onClick={() => setDkCurtainArr([])}>{t("CLEAR")}</button>
                                    </div>
                                    <div className="dk_curtain">
                                        <div className="dk_curtain_inside">
                                            {dkCurtainList}
                                        </div>
                                    </div>
                                    {dkCurtainArr.length > 0 &&
                                        <div className={`dk_curtain_preview_container`}>
                                            <Accordion>
                                                <Accordion.Item eventKey="0">
                                                    <ContextAwareToggleViewDetails eventKey="0" textOnHide={t("Selection Fabric Preview")} textOnShow={t("Hide Preview")}/>
                                                    {/*<Accordion.Header className="basket_item_title_dropdown_btn">*/}
                                                    {/*    <h4 className="dk_curtain_preview_item_details">{t("Selection Fabric Preview")}</h4>*/}
                                                    {/*    /!*<img className="select_control_handle_close img-fluid" src={require('../Images/public/arrow_down.svg').default} alt=""/>*!/*/}
                                                    {/*</Accordion.Header>*/}
                                                    <Accordion.Body className="basket_item_title_dropdown dk_curtain_preview_dropdown">
                                                        <div className="dk_curtain_preview_detail_container">
                                                            {dkCurtainPreviewList}
                                                        </div>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
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
                                    <div className="card_body card_body_radio tall_img_card_body">
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/dk/window-Inside.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" value="1" name="step1" ref-num="1" id="11" checked={step1 === "Inside"}
                                                   onChange={e => {
                                                       setStep1("Inside");
                                                       setStep11("");
                                                       setStep21Err2(false);
                                                       setStep21Err3(false);
                                                       setMeasurementsNextStep("3");
                                                       if (step2 !== "") {
                                                           setDeps("11,2", "1,2AIn1,2AIn2,2AIn3,2BIn1,2BIn2,2BIn3,2A,2B,2E,2DWallFloor,2DWall,2EWall,2FWall,2EWallFloor,2FWallFloor,2C1,2C2,2CCeiling1,2CCeiling2,2D1,2D2,2D3,2DFloor1,2DFloor2,2DFloor3");
                                                           deleteSpecialSelects();
                                                           setCart("Mount", "Inside", "IsWalled,calcMeasurements,Width1,Width2,Width3,Height1,Height2,Height3,FinishedLengthType,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                           setStep2("");
                                                           selectChanged(e, "2,2AIn,2BIn,2A,2B,2E,2DWallFloor,2DWall,2EWall,2FWall,2EWallFloor,2FWallFloor,2C,2CCeiling,2D,2DFloor");
                                                       } else {
                                                           setDeps("11", "1");
                                                           setCart("Mount", "Inside", "IsWalled");
                                                           selectChanged(e, "");
                                                       }
                                                
                                                   }} ref={ref => (inputs.current["11"] = ref)}/>
                                            <label htmlFor="11">{t("mount_Inside")}</label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/dk/window-Outside.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("mount_Outside")} value="2" name="step1" ref-num="1" id="12" checked={step1 === "Outside"}
                                                   onChange={e => {
                                                       setStep1("Outside");
                                                       setStep11("");
                                                       setStep21Err1(false);
                                                       setStep21Err3(false);
                                                       if (step2 !== "") {
                                                           setDeps("2", "1,11,2AIn1,2AIn2,2AIn3,2BIn1,2BIn2,2BIn3,2A,2B,2E,2DWallFloor,2DWall,2EWall,2FWall,2EWallFloor,2FWallFloor,2C1,2C2,2CCeiling1,2CCeiling2,2D1,2D2,2D3,2DFloor1,2DFloor2,2DFloor3");
                                                           deleteSpecialSelects();
                                                           setCart("Mount", "Outside", "IsWalled,calcMeasurements,Width1,Width2,Width3,Height1,Height2,Height3,FinishedLengthType,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                           setStep2("");
                                                           selectChanged(e, "2,2AIn,2BIn,2A,2B,2E,2DWallFloor,2DWall,2EWall,2FWall,2EWallFloor,2FWallFloor,2C,2CCeiling,2D,2DFloor");
                                                       } else {
                                                           setDeps("", "1,11");
                                                           setCart("Mount", "Outside", "IsWalled,Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount");
                                                           selectChanged(e, "");
                                                       }
                                                       setSelectedMountOutsideType([]);
                                                   }} ref={ref => (inputs.current["12"] = ref)}/>
                                            <label htmlFor="12">{t("mount_Outside")}</label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/dk/window-Arc.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" value="3" name="step1" ref-num="1" id="13"
                                                   checked={step1 === "HiddenMoulding"}
                                                   onChange={e => {
                                                       setStep1("HiddenMoulding");
                                                       setStep11("");
                                                       setStep21Err1(false);
                                                       setStep21Err2(false);
                                                       setMeasurementsNextStep("3");
                                                       if (step2 !== "") {
                                                           setDeps("11,2", "1,2AIn1,2AIn2,2AIn3,2BIn1,2BIn2,2BIn3,2A,2B,2E,2DWallFloor,2DWall,2EWall,2FWall,2EWallFloor,2FWallFloor,2C1,2C2,2CCeiling1,2CCeiling2,2D1,2D2,2D3,2DFloor1,2DFloor2,2DFloor3");
                                                           deleteSpecialSelects();
                                                           setCart("Mount", "HiddenMoulding", "IsWalled,calcMeasurements,Width1,Width2,Width3,Height1,Height2,Height3,FinishedLengthType,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                           setStep2("");
                                                           selectChanged(e, "2,2AIn,2BIn,2A,2B,2E,2DWallFloor,2DWall,2EWall,2FWall,2EWallFloor,2FWallFloor,2C,2CCeiling,2D,2DFloor");
                                                       } else {
                                                           setDeps("11", "1");
                                                           setCart("Mount", "HiddenMoulding", "IsWalled,Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount");
                                                           selectChanged(e, "2AIn,2BIn");
                                                       }
                                                   }} ref={ref => (inputs.current["13"] = ref)}/>
                                            <label htmlFor="13">{t("mount_Arc")}</label>
                                        </div>
                                        <div className={step1 === "Inside" ? (step21Err1 ? "secondary_options secondary_options_err" : "secondary_options") : "noDisplay"}>
                                            <div className="card-body-display-flex">
                                                <div className="checkbox_style checkbox_style_step2">
                                                    <input type="checkbox" text={t("mount_Inside")} value="1" name="step11" ref-num="1" checked={step11 === "true"}
                                                           onChange={(e) => {
                                                               if (e.target.checked) {
                                                                   selectChanged(e);
                                                                   setStep11("true");
                                                                   setStep21Err1(false);
                                                                   // let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                                                                   // let refIndex = inputs.current["11"].getAttribute('ref-num');
                                                                   // tempLabels[refIndex] = inputs.current["11"].getAttribute('text');
                                                                   // setStepSelectedLabel(tempLabels);
                                                                   setDeps("", "11");
                                                               } else {
                                                                   setStep11("");
                                                                   // modalHandleShow("noPower");
                                                                   if (step2 !== "") {
                                                                       setDeps("11,2", "2AIn1,2AIn2,2AIn3,2BIn1,2BIn2,2BIn3,2A,2B,2E,2DWallFloor,2DWall,2EWall,2FWall,2EWallFloor,2FWallFloor,2C1,2C2,2CCeiling1,2CCeiling2,2D1,2D2,2D3,2DFloor1,2DFloor2,2DFloor3");
                                                                       deleteSpecialSelects();
                                                                       setCart("", "", "calcMeasurements,Width,Height,WidthCart,HeightCart,WindowWidth,WindowHeight,Width1,Width2,Width3,Height1,Height2,Height3,FinishedLengthType,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                                       setStep2("");
                                                                       selectChanged(undefined, "1,2,2AIn,2BIn,2A,2B,2E,2DWallFloor,2DWall,2EWall,2FWall,2EWallFloor,2FWallFloor,2C,2CCeiling,2D,2DFloor");
                                                                   } else {
                                                                       setDeps("11", "");
                                                                       selectChanged(undefined, "1");
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
                                        {step21Err1 &&
                                            <div className="input_not_valid">{t("step21Err1")}</div>
                                        }
                                        <div className={step1 === "Outside" ? "selection_section" : "noDisplay"}>
                                            <div className={step21Err2 ? "select_container select_container_red" : "select_container"}>
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
                                                            setStep21Err2(false);
                                                            // setDeps("", "11");
                                                            // setCart("IsWalled", selected[0].value);
                                                            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                                                            tempLabels["1"] = t("mount_Outside") + "/" + selected[0].label;
                                                            setStepSelectedLabel(tempLabels);
                                                            if (step2 !== "") {
                                                                setDeps("2", "1,11,2AIn1,2AIn2,2AIn3,2BIn1,2BIn2,2BIn3,2A,2B,2E,2DWallFloor,2DWall,2EWall,2FWall,2EWallFloor,2FWallFloor,2C1,2C2,2CCeiling1,2CCeiling2,2D1,2D2,2D3,2DFloor1,2DFloor2,2DFloor3");
                                                                deleteSpecialSelects();
                                                                setCart("IsWalled", selected[0].value, "calcMeasurements,Width,Height,WidthCart,HeightCart,WindowWidth,WindowHeight,Width1,Width2,Width3,Height1,Height2,Height3,FinishedLengthType,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                                setStep2("");
                                                                // selectChanged(undefined, "2,2AIn,2BIn,2A,2B,2E,2DWallFloor,2DWall,2EWall,2FWall,2EWallFloor,2FWallFloor,2C,2CCeiling,2D,2DFloor");
                                                            } else {
                                                                setDeps("", "1,11");
                                                                setCart("IsWalled", selected[0].value, "Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount");
                                                                // selectChanged(undefined, "");
                                                            }
                                                        }
                                                    }}
                                                    options={optionsOutside[pageLanguage]}
                                                />
                                            </div>
                                        </div>
                                        <div className={step1 === "HiddenMoulding" ? (step21Err3 ? "secondary_options secondary_options_err" : "secondary_options") : "noDisplay"}>
                                            <div className="card-body-display-flex">
                                                <div className="checkbox_style checkbox_style_step2">
                                                    <input type="checkbox" text={t("mount_Arc")} value="3" name="step11" ref-num="1" checked={step11 === "true"}
                                                           onChange={(e) => {
                                                               if (e.target.checked) {
                                                                   selectChanged(e);
                                                                   setStep11("true");
                                                                   setStep21Err3(false);
                                                                   // let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                                                                   // let refIndex = inputs.current["13"].getAttribute('ref-num');
                                                                   // tempLabels[refIndex] = inputs.current["13"].getAttribute('text');
                                                                   // setStepSelectedLabel(tempLabels);
                                                                   setDeps("", "11");
                                                               } else {
                                                                   setStep11("");
                                                                   // modalHandleShow("noPower");
                                                            
                                                                   if (step2 !== "") {
                                                                       setDeps("11,2", "2AIn1,2AIn2,2AIn3,2BIn1,2BIn2,2BIn3,2A,2B,2E,2DWallFloor,2DWall,2EWall,2FWall,2EWallFloor,2FWallFloor,2C1,2C2,2CCeiling1,2CCeiling2,2D1,2D2,2D3,2DFloor1,2DFloor2,2DFloor3");
                                                                       deleteSpecialSelects();
                                                                       setCart("", "", "calcMeasurements,Width,Height,WidthCart,HeightCart,WindowWidth,WindowHeight,Width1,Width2,Width3,Height1,Height2,Height3,FinishedLengthType,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                                       setStep2("");
                                                                       selectChanged(undefined, "1,2,2AIn,2BIn,2A,2B,2E,2DWallFloor,2DWall,2EWall,2FWall,2DWallFloor,2FWallFloor,2C,2CCeiling,2D,2DFloor");
                                                                   } else {
                                                                       setDeps("11", "");
                                                                       selectChanged(undefined, "1");
                                                                   }
                                                               }
                                                           }} id="131" ref={ref => (inputs.current["131"] = ref)}/>
                                                    <label htmlFor="131" className="checkbox_label">
                                                        <img className="checkbox_label_img checkmark1 img-fluid"
                                                             src={require('../Images/public/checkmark1_checkbox.png')}
                                                             alt=""/>
                                                    </label>
                                                    <span className="checkbox_text">
                                                        {t("dk_Arc_checkbox_title")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {step21Err3 &&
                                            <div className="input_not_valid">{t("step21Err3")}</div>
                                        }
                                        <NextStep
                                            eventKey={(step1 === "Inside" && step11 !== "true") || (step1 === "HiddenMoulding" && step11 !== "true") || (step1 === "Outside" && !selectedMountOutsideType.length) ? "1" : "2"}
                                            onClick={() => {
                                                if ((step1 === "Inside" && step11 !== "true") || (step1 === "HiddenMoulding" && step11 !== "true")) {
                                                    if (step1 === "Inside") {
                                                        setStep21Err1(true);
                                                    } else {
                                                        setStep21Err3(true);
                                                    }
                                                } else if (step1 === "Outside" && !selectedMountOutsideType.length) {
                                                    setStep21Err2(true);
                                                }
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
                                                       if (step1 === "" || (step1 === "Inside" && step11 !== "true") || (step1 === "HiddenMoulding" && step11 !== "true")) {
                                                           setStep2("");
                                                           selectUncheck(e);
                                                           modalHandleShow("noMount");
                                                           setDeps("2", "21,22");
                                                           setCart("", "", "Width,Height,WidthCart,HeightCart,WindowWidth,WindowHeight,calcMeasurements");
                                                       } else {
                                                           setStep2("false");
                                                           selectChanged(e, "");
                                                           setMeasurementsNextStep("3");
                                                           setDeps("21,22", "2,2AIn1,2AIn2,2AIn3,2BIn1,2BIn2,2BIn3,2A,2B,2E,2DWallFloor,2DWall,2EWall,2FWall,2DWallFloor,2FWallFloor,2C1,2C2,2CCeiling1,2CCeiling2,2D1,2D2,2D3,2DFloor1,2DFloor2,2DFloor3");
                                                           deleteSpecialSelects();
                                                           setCart("calcMeasurements", false, "WidthCart,HeightCart,Width1,Width2,Width3,Height1,Height2,Height3,FinishedLengthType,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                       }
                                                   }} ref={ref => (inputs.current["21"] = ref)}/>
                                            <label htmlFor="21">{t("I have my own measurements.")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("Calculate my measurements")} value="2" name="step2" checked={step2 === "true"}
                                                   ref-num="2" id="22" ref={ref => (inputs.current["22"] = ref)}
                                                   onChange={e => {
                                                       setStep2A("");
                                                       if (stepSelectedValue["1"] === undefined) {
                                                           setStep2("");
                                                           selectUncheck(e);
                                                           modalHandleShow("noMount");
                                                           setDeps("2", "21,22");
                                                           setCart("", "", "Width,Height,WidthCart,HeightCart,WindowWidth,WindowHeight,calcMeasurements");
                                                       } else if (stepSelectedValue["1"] === "1") {
                                                           if (step11 !== "true") {
                                                               modalHandleShow("noInsideUnderstand");
                                                               setStep2("");
                                                               selectUncheck(e);
                                                               setDeps("2", "21,22");
                                                               setCart("", "", "Width,Height,WidthCart,HeightCart,WindowWidth,WindowHeight,calcMeasurements");
                                                           } else {
                                                               setStep2("true");
                                                               deleteSpecialSelects();
                                                               selectChanged(e);
                                                               setMeasurementsNextStep("2A");
                                                               setDeps("2AIn1,2AIn2,2AIn3,2BIn1,2BIn2,2BIn3", "2,21,22");
                                                               setCart("calcMeasurements", true, "Width,Height,WidthCart,HeightCart,WindowWidth,WindowHeight,FinishedLengthType,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                           }
                                                       } else if (stepSelectedValue["1"] === "3") {
                                                           if (step11 !== "true") {
                                                               modalHandleShow("noInsideUnderstand");
                                                               setStep2("");
                                                               selectUncheck(e);
                                                               setDeps("2", "21,22");
                                                               setCart("", "", "Width,Height,WidthCart,HeightCart,WindowWidth,WindowHeight,calcMeasurements");
                                                           } else {
                                                               setStep2("true");
                                                               deleteSpecialSelects();
                                                               selectChanged(e);
                                                               setMeasurementsNextStep("2A");
                                                               setDeps("2A", "2,21,22");
                                                               setCart("calcMeasurements", true, "Width,Height,WidthCart,HeightCart,WindowWidth,WindowHeight,FinishedLengthType");
                                                           }
                                                       } else {
                                                           if (!selectedMountOutsideType.length) {
                                                               modalHandleShow("noInsideUnderstand");
                                                               setStep2("");
                                                               selectUncheck(e);
                                                               setDeps("2", "21,22");
                                                               setCart("", "", "Width,Height,WidthCart,HeightCart,WindowWidth,WindowHeight,calcMeasurements");
                                                           } else {
                                                               setStep2("true");
                                                               deleteSpecialSelects();
                                                               selectChanged(e);
                                                               setMeasurementsNextStep("2A");
                                                               setDeps("2A", "2,21,22");
                                                               setCart("calcMeasurements", true, "Width,Height,WidthCart,HeightCart,WindowWidth,WindowHeight,FinishedLengthType");
                                                           }
                                                       }
                                                   }}/>
                                            <label htmlFor="22">{t("Calculate my measurements.")}</label>
                                        
                                        </div>
                                        
                                        <div className={step2 === "false" ? "own_measurements_container" : "own_measurements_container noDisplay"}>
                                            {/*<div className="own_measurements_width">*/}
                                            {/*    <label className="select_label">{t("Width")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                            {/*    <div className="select_container select_container_num">*/}
                                            {/*        <Select*/}
                                            {/*            className="select"*/}
                                            {/*            placeholder={t("Please Select")}*/}
                                            {/*            portal={document.body}*/}
                                            {/*            dropdownPosition="bottom"*/}
                                            {/*            dropdownHandle={false}*/}
                                            {/*            dropdownGap={0}*/}
                                            {/*            values={selectCustomValues.width}*/}
                                            {/*            onDropdownOpen={() => {*/}
                                            {/*                let temp1 = window.scrollY;*/}
                                            {/*                window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                            {/*                setTimeout(() => {*/}
                                            {/*                    let temp2 = window.scrollY;*/}
                                            {/*                    if (temp2 === temp1)*/}
                                            {/*                        window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                            {/*                }, 100);*/}
                                            {/*            }}*/}
                                            {/*            dropdownRenderer={*/}
                                            {/*                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                            {/*            }*/}
                                            {/*            contentRenderer={*/}
                                            {/*                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                            {/*                                                               postfixFa=""/>*/}
                                            {/*            }*/}
                                            {/*            // optionRenderer={*/}
                                            {/*            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                            {/*            // }*/}
                                            {/*            onChange={(selected) => {*/}
                                            {/*                if (selected.length) {*/}
                                            {/*                    optionSelectChanged_WidthLength(selected[0], "2", true, "cm", "س\u200Cم", pageLanguage);*/}
                                            {/*                    let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                            {/*                    temp.width = selected;*/}
                                            {/*                    setSelectCustomValues(temp);*/}
                                            {/*                    setDeps("", "21");*/}
                                            {/*                    setCart("Width", selected[0].value);*/}
                                            {/*                }*/}
                                            {/*            }}*/}
                                            {/*            options={SelectOptionRange(30, 300, 1, "cm", "", pageLanguage)}*/}
                                            {/*        />*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}
                                            {/*<div className="own_measurements_Length">*/}
                                            {/*    <label className="select_label">{t("Length_step3")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                            {/*    <div className="select_container select_container_num">*/}
                                            {/*        <Select*/}
                                            {/*            className="select"*/}
                                            {/*            placeholder={t("Please Select")}*/}
                                            {/*            portal={document.body}*/}
                                            {/*            dropdownPosition="bottom"*/}
                                            {/*            dropdownHandle={false}*/}
                                            {/*            dropdownGap={0}*/}
                                            {/*            values={selectCustomValues.length}*/}
                                            {/*            onDropdownOpen={() => {*/}
                                            {/*                let temp1 = window.scrollY;*/}
                                            {/*                window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                            {/*                setTimeout(() => {*/}
                                            {/*                    let temp2 = window.scrollY;*/}
                                            {/*                    if (temp2 === temp1)*/}
                                            {/*                        window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                            {/*                }, 100);*/}
                                            {/*            }}*/}
                                            {/*            dropdownRenderer={*/}
                                            {/*                ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                            {/*            }*/}
                                            {/*            contentRenderer={*/}
                                            {/*                ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                            {/*                                                               postfixFa=""/>*/}
                                            {/*            }*/}
                                            {/*            // optionRenderer={*/}
                                            {/*            //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                            {/*            // }*/}
                                            {/*            onChange={(selected) => {*/}
                                            {/*                if (selected.length) {*/}
                                            {/*                    optionSelectChanged_WidthLength(selected[0], "2", false, "cm", "س\u200Cم", pageLanguage);*/}
                                            {/*                    let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                            {/*                    temp.length = selected;*/}
                                            {/*                    setSelectCustomValues(temp);*/}
                                            {/*                    setDeps("", "22");*/}
                                            {/*                    setCart("Height", selected[0].value);*/}
                                            {/*                }*/}
                                            {/*            }}*/}
                                            {/*            options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}*/}
                                            {/*        />*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}
                                            <div className="own_measurements_width">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Width")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                inputs.current["Height"].focus();
                                                            } else if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (width !== undefined && (width < 30 || width > 300) ? " measure_input_err" : "")} type="text"
                                                                       name="width" value={NumToFa(`${width || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 300) {
                                                                                   setCartLoading(true);
                                                                                   setCart("Width", parseInt(newValue));
                                                                                   setDeps("", "21");
                                                                                   setWidth(parseInt(newValue));
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "Width");
                                                                                   setDeps("21", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setWidth(undefined);
                                                                                   } else {
                                                                                       setWidth(parseInt(newValue));
                                                                                   }
                                                                                   setWindowSize("");
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (width !== undefined && (width < 30 || width > 300) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 300`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                            <div className="own_measurements_Length">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Height")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["Height"] = ref)} debounceTimeout={1500} onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (height !== undefined && (height < 30 || height > 400) ? " measure_input_err" : "")} type="text"
                                                                       name="height" value={NumToFa(`${height || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 400) {
                                                                                   setCartLoading(true);
                                                                                   setCart("Height", parseInt(newValue));
                                                                                   setDeps("", "22");
                                                                                   setHeight(parseInt(newValue));
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "Height");
                                                                                   setDeps("22", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setHeight(undefined);
                                                                                   } else {
                                                                                       setHeight(parseInt(newValue));
                                                                                   }
                                                                                   setWindowSize("");
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (height !== undefined && (height < 30 || height > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <NextStep currentStep="2" eventKey={measurementsNextStep} onClick={() =>
                                            console.log("click1")}>{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    {(step2 === "false") &&
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
                                                        {/*<li className="no_listStyle single_line_height">*/}
                                                        {/*    <b>{t("Note:&nbsp;")}</b>*/}
                                                        {/*    {t("step3_help_2")}*/}
                                                        {/*</li>*/}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {(step2 === "true") &&
                                        <div className="accordion_help">
                                            <div className="help_container">
                                                <div className="help_column help_left_column">
                                                    <p className="help_column_header"/>
                                                    <ul className="help_column_list">
                                                        <li className="no_listStyle single_line_height">
                                                            {t("step3_help_2.5")}
                                                        </li>
                                                        {/*<li className="no_listStyle single_line_height">*/}
                                                        {/*    <b>{t("Note:&nbsp;")}</b>*/}
                                                        {/*    {t("step3_help_3")}*/}
                                                        {/*</li>*/}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 2A */}
                        <Card
                            className={step2 === "true" && !!((stepSelectedValue["1"] === "3" && step11 === "true") || (step1 === "Outside" && selectedMountOutsideType.length)) ? "" : "noDisplay"}>
                            <Card.Header>
                                <ContextAwareToggle eventKey="2A" stepNum={t("2A")} stepTitle={t("dk_step2A")} stepRef="2A" type="1" required={requiredStep["2A"]}
                                                    stepSelected={stepSelectedLabel["2A"] === undefined ? "" : stepSelectedLabel["2A"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2A">
                                <Card.Body>
                                    <div className="card_body card_body_radio card_body_finished_length">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("dk_step2A_title")}</p>
                                            {/* <img src={pageLanguage === 'fa' ? require('../Images/drapery/zebra/width_inside_3_fa.svg').default : require('../Images/drapery/zebra/new_width_inside_3.svg').default}
                                                className="img-fluid" alt=""/> */}
                                        </div>
                                        <div className="box33 radio_style">
                                            <img
                                                src={pageLanguage === "fa" ? require('../Images/drapery/dk/small_height_fa.svg').default : require('../Images/drapery/dk/small_height.svg').default}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" text={t("Sill")} value="1" name="step2A" ref-num="2A" id="2A1" checked={step2A === "Sill"}
                                                   onChange={e => {
                                                       setStep2A("Sill");
                                                       deleteSpecialSelects();
                                                       if (stepSelectedValue["1"] === "3") {
                                                           setCart("FinishedLengthType", "Sill", "Width1,Width2,Width3,Height1,Height2,Height3,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                           setDeps("2B,2C1,2C2,2D1,2D2,2D3", "2A,2DFloor1,2DFloor2,2DFloor3");
                                                           selectChanged(e, "2B,2C,2D,2E");
                                                       } else {
                                                           if (selectedMountOutsideType[0].value === "Ceiling") {
                                                               setCart("FinishedLengthType", "Sill", "Width1,Width2,Width3,Height1,Height2,Height3,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                               setDeps("2B,2CCeiling1,2CCeiling2,2D1,2D2,2D3", "2A,2DFloor1,2DFloor2,2DFloor3");
                                                               selectChanged(e, "2B,2CCeiling,2D,2E");
                                                           } else {
                                                               setCart("FinishedLengthType", "Sill", "Width1,Width2,Width3,Height1,Height2,Height3,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                               setDeps("2B,2CCeiling1,2CCeiling2,2DWall,2EWall,2FWall", "2A,2DWallFloor,2FWallFloor");
                                                               selectChanged(e, "2B,2CCeiling,2EWallFloor,2DWall,2EWall,2FWall");
                                                           }
                                                    
                                                       }
                                                
                                                   }} ref={ref => (inputs.current["2A1"] = ref)}/>
                                            <label htmlFor="2A1">{t("Sill")}</label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <img
                                                src={pageLanguage === "fa" ? require('../Images/drapery/dk/medium_height_fa.svg').default : require('../Images/drapery/dk/medium_height.svg').default}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" text={t("Apron")} value="2" name="step2A" ref-num="2A" id="2A2" checked={step2A === "Apron"}
                                                   onChange={e => {
                                                       setStep2A("Apron");
                                                       deleteSpecialSelects();
                                                       if (stepSelectedValue["1"] === "3") {
                                                           setCart("FinishedLengthType", "Apron", "Width1,Width2,Width3,Height1,Height2,Height3,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                           setDeps("2B,2C1,2C2,2D1,2D2,2D3", "2A,2DFloor1,2DFloor2,2DFloor3");
                                                           selectChanged(e, "2B,2C,2D,2E");
                                                       } else {
                                                           if (selectedMountOutsideType[0].value === "Ceiling") {
                                                               setCart("FinishedLengthType", "Apron", "Width1,Width2,Width3,Height1,Height2,Height3,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                               setDeps("2B,2CCeiling1,2CCeiling2,2D1,2D2,2D3", "2A,2DFloor1,2DFloor2,2DFloor3");
                                                               selectChanged(e, "2B,2CCeiling,2D,2E");
                                                           } else {
                                                               setCart("FinishedLengthType", "Apron", "Width1,Width2,Width3,Height1,Height2,Height3,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                               setDeps("2B,2CCeiling1,2CCeiling2,2DWall,2EWall,2FWall", "2A,2EWallFloor,2FWallFloor");
                                                               selectChanged(e, "2B,2CCeiling,2EWallFloor,2DWall,2EWall,2FWall");
                                                           }
                                                    
                                                       }
                                                   }} ref={ref => (inputs.current["2A2"] = ref)}/>
                                            <label htmlFor="2A2">{t("Apron")}</label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <img
                                                src={pageLanguage === "fa" ? require('../Images/drapery/dk/large_height_fa.svg').default : require('../Images/drapery/dk/large_height.svg').default}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" text={t("Floor")} value="3" name="step2A" ref-num="2A" id="2A3" checked={step2A === "Floor"}
                                                   onChange={e => {
                                                       setStep2A("Floor");
                                                       deleteSpecialSelects();
                                                       if (stepSelectedValue["1"] === "3") {
                                                           setCart("FinishedLengthType", "Floor", "Width1,Width2,Width3,Height1,Height2,Height3,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                           setDeps("2B,2C1,2C2,2DFloor1,2DFloor2,2DFloor3", "2A,2D1,2D2,2D3,2E");
                                                           selectChanged(e, "2B,2C,2DFloor");
                                                       } else {
                                                           if (selectedMountOutsideType[0].value === "Ceiling") {
                                                               setCart("FinishedLengthType", "Floor", "Width1,Width2,Width3,Height1,Height2,Height3,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                               setDeps("2B,2CCeiling1,2CCeiling2,2DFloor1,2DFloor2,2DFloor3", "2A,2D1,2D2,2D3,2E");
                                                               selectChanged(e, "2B,2CCeiling,2DFloor");
                                                           } else {
                                                               setCart("FinishedLengthType", "Floor", "Width1,Width2,Width3,Height1,Height2,Height3,Width2B,Height2D,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3,WindowToFloor");
                                                               setDeps("2B,2CCeiling1,2CCeiling2,2DWallFloor,2EWallFloor,2FWallFloor", "2A,2DWall,2EWall,2FWall");
                                                               selectChanged(e, "2B,2CCeiling,2DWallFloor,2EWallFloor,2FWallFloor");
                                                           }
                                                    
                                                       }
                                                   }} ref={ref => (inputs.current["2A3"] = ref)}/>
                                            <label htmlFor="2A3">{t("Floor")}</label>
                                        </div>
                                        <NextStep currentStep="2A" eventKey="2B">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"></p>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle"><b>{t("dk_step2a_help1")}</b>{t("dk_step2a_help2")}</li>
                                                    <li className="no_listStyle"><b>{t("dk_step2a_help3")}</b>{t("dk_step2a_help4")}</li>
                                                    <li className="no_listStyle"><b>{t("dk_step2a_help5")}</b>{t("dk_step2a_help6")}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        
                        {/* step 2B*/}
                        <Card
                            className={step2 === "true" && stepSelectedValue["2A"] && !!((stepSelectedValue["1"] === "3" && step11 === "true") || (step1 === "Outside" && selectedMountOutsideType.length)) ? "" : "noDisplay"}>
                            <Card.Header>
                                <ContextAwareToggle eventKey="2B" stepNum={t("2B")} stepTitle={t("dk_step2B")} stepRef="2B" type="2" required={requiredStep["2B"]}
                                                    stepSelected={stepSelectedLabel["2B"] === undefined ? "" : stepSelectedLabel["2B"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2B">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("dk_step2B_title")}</p>
                                            <img src={require('../Images/drapery/zebra/new_FrameSize.svg').default} className="img-fluid frame_with_top" alt=""/>
                                        </div>
                                        {/*<div className="box100 Three_selection_container">*/}
                                        {/*    <div className="box100">*/}
                                        {/*        <label className="select_label">{t("Width")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.Width2B}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged("2B", selected[0], "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.Width2B = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2B");*/}
                                        {/*                        setCart("Width2B", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(30, 300, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Width")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (width2B !== undefined && (width2B < 30 || width2B > 290) ? " measure_input_err" : "")} type="text"
                                                                       name="Width2B" value={NumToFa(`${width2B || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 290) {
                                                                                   setCartLoading(true);
                                                                                   setCart("Width2B", parseInt(newValue));
                                                                                   setDeps("", "2B");
                                                                                   setWidth2B(parseInt(newValue));
                                                                                   optionSelectChanged("2B", parseInt(newValue), "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "Width2B");
                                                                                   setDeps("2B", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setWidth2B(undefined);
                                                                                       selectChanged(undefined, "2B");
                                                                                   } else {
                                                                                       setWidth2B(parseInt(newValue));
                                                                                       selectChanged("2B", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (width2B !== undefined && (width2B < 30 || width2B > 290) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 290`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="2B" eventKey="2C">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 2C */}
                        <Card className={step2 === "true" && stepSelectedValue["2A"] && ((stepSelectedValue["1"] === "3" && step11 === "true")) ? "" : "noDisplay"}>
                            <Card.Header>
                                <ContextAwareToggle eventKey="2C" stepNum={t("2C")} stepTitle={t("dk_step2CCeiling")} stepRef="2C" type="2" required={requiredStep["2C"]}
                                                    stepSelected={stepSelectedLabel["2C"] === undefined ? "" : stepSelectedLabel["2C"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2C">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("dk_step2c_out_title")}</p>
                                            <img src={require('../Images/drapery/dk/new_fullRod_track.svg').default} className="img-fluid frame_with_top2" alt=""/>
                                        </div>
                                        {/*<div className="box100 Three_selection_container dir_ltr">*/}
                                        {/*    <div className="box50">*/}
                                        {/*        <label className="select_label"><p className="farsi_cm">{t("select_cm")}</p>{t("Left")}</label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.left}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_LeftRight(selected[0], "2C", true, "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.left = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2C1");*/}
                                        {/*                        setCart("ExtensionLeft", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(1, 50, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*    <div className="box50">*/}
                                        {/*        <label className="select_label"><p className="farsi_cm">{t("select_cm")}</p>{t("Right")}</label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.right}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_LeftRight(selected[0], "2C", false, "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.right = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2C2");*/}
                                        {/*                        setCart("ExtensionRight", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(1, 50, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="box100 Three_selection_container dir_ltr">
                                            <div className="box50">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Left")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                inputs.current["Right"].focus();
                                                            } else if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (left !== undefined && (left < 1 || left > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="Left" value={NumToFa(`${left || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("ExtensionLeft", parseInt(newValue));
                                                                                   setDeps("", "2C1");
                                                                                   setLeft(parseInt(newValue));
                                                                                   optionSelectChanged_LeftRight(parseInt(newValue), "2C", true, "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "ExtensionLeft");
                                                                                   setDeps("2C1", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setLeft(undefined);
                                                                                       selectChanged(undefined, "2C");
                                                                                   } else {
                                                                                       setLeft(parseInt(newValue));
                                                                                       selectChanged("2C", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (left !== undefined && (left < 1 || left > 10) ? " measure_input_desc_err" : "")}>Max. 10cm</h2>*/}
                                                </div>
                                            </div>
                                            <div className="box50">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Right")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["Right"] = ref)} debounceTimeout={1500} onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (right !== undefined && (right < 1 || right > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="Right" value={NumToFa(`${right || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("ExtensionRight", parseInt(newValue));
                                                                                   setDeps("", "2C2");
                                                                                   setRight(parseInt(newValue));
                                                                                   optionSelectChanged_LeftRight(parseInt(newValue), "2C", false, "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "ExtensionRight");
                                                                                   setDeps("2C2", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setRight(undefined);
                                                                                       selectChanged(undefined, "2C");
                                                                                   } else {
                                                                                       setRight(parseInt(newValue));
                                                                                       selectChanged("2C", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (right !== undefined && (right < 1 || right > 10) ? " measure_input_desc_err" : "")}>Max. 10cm</h2>*/}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <NextStep currentStep="2C" eventKey="2D">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">{t("dk_step3C_out_help_1")}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 2CCeiling and wall*/}
                        <Card
                            className={step2 === "true" && stepSelectedValue["2A"] && !!((step1 === "Outside" && selectedMountOutsideType.length)) ? "" : "noDisplay"}>
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
                                            <img src={require('../Images/drapery/dk/new_fullRod_track.svg').default} className="img-fluid frame_with_top2" alt=""/>
                                        </div>
                                        {/*<div className="box100 Three_selection_container dir_ltr">*/}
                                        {/*    <div className="box50">*/}
                                        {/*        <label className="select_label"><p className="farsi_cm">{t("select_cm")}</p>{t("Left")}</label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.left}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_LeftRight(selected[0], "2CCeiling", true, "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.left = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2CCeiling1");*/}
                                        {/*                        setCart("ExtensionLeft", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(1, 50, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*    <div className="box50">*/}
                                        {/*        <label className="select_label"><p className="farsi_cm">{t("select_cm")}</p>{t("Right")}</label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.right}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_LeftRight(selected[0], "2CCeiling", false, "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.right = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2CCeiling2");*/}
                                        {/*                        setCart("ExtensionRight", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(1, 50, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="box100 Three_selection_container dir_ltr">
                                            <div className="box50">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Left")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                inputs.current["Right1"].focus();
                                                            } else if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (left !== undefined && (left < 1 || left > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="Left" value={NumToFa(`${left || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("ExtensionLeft", parseInt(newValue));
                                                                                   setDeps("", "2CCeiling1");
                                                                                   setLeft(parseInt(newValue));
                                                                                   optionSelectChanged_LeftRight(parseInt(newValue), "2CCeiling", true, "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "ExtensionLeft");
                                                                                   setDeps("2CCeiling1", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setLeft(undefined);
                                                                                       selectChanged(undefined, "2CCeiling");
                                                                                   } else {
                                                                                       setLeft(parseInt(newValue));
                                                                                       selectChanged("2CCeiling", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (left !== undefined && (left < 1 || left > 10) ? " measure_input_desc_err" : "")}>Max. 10cm</h2>*/}
                                                </div>
                                            </div>
                                            <div className="box50">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Right")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["Right1"] = ref)} debounceTimeout={1500} onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (right !== undefined && (right < 1 || right > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="Right" value={NumToFa(`${right || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("ExtensionRight", parseInt(newValue));
                                                                                   setDeps("", "2CCeiling2");
                                                                                   setRight(parseInt(newValue));
                                                                                   optionSelectChanged_LeftRight(parseInt(newValue), "2CCeiling", false, "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "ExtensionRight");
                                                                                   setDeps("2CCeiling2", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setRight(undefined);
                                                                                       selectChanged(undefined, "2CCeiling");
                                                                                   } else {
                                                                                       setRight(parseInt(newValue));
                                                                                       selectChanged("2CCeiling", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (right !== undefined && (right < 1 || right > 10) ? " measure_input_desc_err" : "")}>Max. 10cm</h2>*/}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <NextStep currentStep="2CCeiling" eventKey="2D">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">{t("dk_step3C_out_help_1")}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 2D */}
                        <Card
                            className={step2 === "true" && (stepSelectedValue["2A"] === "1" || stepSelectedValue["2A"] === "2") && !!((stepSelectedValue["1"] === "3" && step11 === "true") || (step1 === "Outside" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Ceiling")) ? "" : "noDisplay"}>
                            <Card.Header>
                                <ContextAwareToggle eventKey="2D" stepNum={t("2D")} stepTitle={t("dk_step2D_sill")} stepRef="2D" type="2" required={requiredStep["2D"]}
                                                    stepSelected={stepSelectedLabel["2D"] === undefined ? "" : stepSelectedLabel["2D"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2D">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{step1 === "Outside" ? t("dk_step2D_title") : t("arc_step2D_title")}</p>
                                            <img
                                                src={stepSelectedValue["1"] === "3" ? pageLanguage === 'fa' ? require('../Images/drapery/dk/new_ceiling_to_window_3_arc_fa.svg').default : require('../Images/drapery/dk/new_ceiling_to_window_3_arc.svg').default : pageLanguage === 'fa' ? require('../Images/drapery/dk/new_ceiling_to_window_3_fa.svg').default : require('../Images/drapery/dk/new_ceiling_to_window_3.svg').default}
                                                className="img-fluid tall_curtain_image" alt=""/>
                                        </div>
                                        {/*<div className="box100 Three_selection_container">*/}
                                        {/*    <div className="Three_select_container">*/}
                                        {/*        <label className="select_label">{t("step3AIn_A")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.CeilingToWindow1}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "2D", 0, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.CeilingToWindow1 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2D1");*/}
                                        {/*                        setCart("CeilingToWindow1", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*    <div className="Three_select_container">*/}
                                        {/*        <label className="select_label">{t("step3AIn_B")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.CeilingToWindow2}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "2D", 1, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.CeilingToWindow2 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2D2");*/}
                                        {/*                        setCart("CeilingToWindow2", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*    <div className="Three_select_container">*/}
                                        {/*        <label className="select_label">{t("step3AIn_C")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.CeilingToWindow3}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "2D", 2, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.CeilingToWindow3 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2D3");*/}
                                        {/*                        setCart("CeilingToWindow3", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="box100 Three_selection_container">
                                            <div className="Three_select_container">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("step3AIn_A")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                inputs.current["ceilingToWindow2"].focus();
                                                            } else if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (ceilingToWindow1 !== undefined && (ceilingToWindow1 < 30 || ceilingToWindow1 > 400) ? " measure_input_err" : "")} type="text"
                                                                       name="ceilingToWindow1" value={NumToFa(`${ceilingToWindow1 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 400) {
                                                                                   setCartLoading(true);
                                                                                   setCart("CeilingToWindow1", parseInt(newValue));
                                                                                   setDeps("", "2D1");
                                                                                   setCeilingToWindow1(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "2D", 0, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "CeilingToWindow1");
                                                                                   setDeps("2D1", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setCeilingToWindow1(undefined);
                                                                                       selectChanged(undefined, "2D");
                                                                                   } else {
                                                                                       setCeilingToWindow1(parseInt(newValue));
                                                                                       selectChanged("2D", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (ceilingToWindow1 !== undefined && (ceilingToWindow1 < 30 || ceilingToWindow1 > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("step3AIn_B")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["ceilingToWindow2"] = ref)} debounceTimeout={1500} onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                inputs.current["ceilingToWindow3"].focus();
                                                            } else if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (ceilingToWindow2 !== undefined && (ceilingToWindow2 < 30 || ceilingToWindow2 > 400) ? " measure_input_err" : "")} type="text"
                                                                       name="ceilingToWindow2" value={NumToFa(`${ceilingToWindow2 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 400) {
                                                                                   setCartLoading(true);
                                                                                   setCart("CeilingToWindow2", parseInt(newValue));
                                                                                   setDeps("", "2D2");
                                                                                   setCeilingToWindow2(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "2D", 1, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "CeilingToWindow2");
                                                                                   setDeps("2D2", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setCeilingToWindow2(undefined);
                                                                                       selectChanged(undefined, "2D");
                                                                                   } else {
                                                                                       setCeilingToWindow2(parseInt(newValue));
                                                                                       selectChanged("2D", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (ceilingToWindow2 !== undefined && (ceilingToWindow2 < 30 || ceilingToWindow2 > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("step3AIn_C")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["ceilingToWindow3"] = ref)} debounceTimeout={1500} onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (ceilingToWindow3 !== undefined && (ceilingToWindow3 < 30 || ceilingToWindow3 > 400) ? " measure_input_err" : "")} type="text"
                                                                       name="ceilingToWindow3" value={NumToFa(`${ceilingToWindow3 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 400) {
                                                                                   setCartLoading(true);
                                                                                   setCart("CeilingToWindow3", parseInt(newValue));
                                                                                   setDeps("", "2D3");
                                                                                   setCeilingToWindow3(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "2D", 2, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "CeilingToWindow3");
                                                                                   setDeps("2D3", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setCeilingToWindow3(undefined);
                                                                                       selectChanged(undefined, "2D");
                                                                                   } else {
                                                                                       setCeilingToWindow3(parseInt(newValue));
                                                                                       selectChanged("2D", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (ceilingToWindow3 !== undefined && (ceilingToWindow3 < 30 || ceilingToWindow3 > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="2D" eventKey="3">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">
                                                        <span className="popover_indicator">
                                                            {<PopoverStickOnHover placement={`${pageLanguage === 'fa' ? "right" : "left"}`}
                                                                                  children={<object className="popover_camera" type="image/svg+xml"
                                                                                                    data={require('../Images/public/camera.svg').default}/>}
                                                                                  component={
                                                                                      <div className="clearfix">
                                                                                          <div className="popover_image clearfix">
                                                                                              <img
                                                                                                  src={popoverImages["step2d"] === undefined ? require('../Images/drapery/dk/mouldinghelpphoto1.jpg') : popoverImages["step2d"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">{t("dk_step_help_camera_title")}</span>
                                                                                              <span className="popover_thumbnails">
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/dk/mouldinghelpphoto1.jpg')}
                                                                                                           text="step2d"
                                                                                                           onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                           className="popover_thumbnail_img img-fluid"
                                                                                                           alt=""/>
                                                                                                  </div>
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/dk/mouldinghelpphoto2.jpg')}
                                                                                                           text="step2d"
                                                                                                           onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                           className="popover_thumbnail_img img-fluid"
                                                                                                           alt=""/>
                                                                                                  </div>
                                                                                              </span>
                                                                                          </div>
                                                                                      </div>
                                                                                  }/>
                                                            }
                                                        </span>{t("dk_step2D_help_1")}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 2E*/}
                        {/*{step2 === "true" && (stepSelectedValue["2A"] === "1" || stepSelectedValue["2A"] === "2") && !!((stepSelectedValue["1"] === "3" && step11 === "true") || (step1 === "Outside" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Ceiling")) &&*/}
                        {/*    <Card>*/}
                        {/*        <Card.Header>*/}
                        {/*            <ContextAwareToggle eventKey="2E" stepNum={t("2E")} stepTitle={t("dk_step2E_sill")} stepRef="2E" type="2" required={requiredStep["2E"]}*/}
                        {/*                                stepSelected={stepSelectedLabel["2E"] === undefined ? "" : stepSelectedLabel["2E"]}/>*/}
                        {/*        </Card.Header>*/}
                        {/*        <Accordion.Collapse eventKey="2E">*/}
                        {/*            <Card.Body>*/}
                        {/*                <div className="card_body">*/}
                        {/*                    <div className="box100">*/}
                        {/*                        <p className="step_selection_title">{t("arc_step2E_title")}</p>*/}
                        {/*                        <img src={require('../Images/drapery/dk/new_CeilingToFloor_noRod.svg').default} className="img-fluid tall_curtain_image" alt=""/>*/}
                        {/*                    </div>*/}
                        {/*                    <div className="box100 Three_selection_container">*/}
                        {/*                        <div className="box100">*/}
                        {/*                            <label className="select_label">{t("Width")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                        {/*                            <div className="select_container select_container_num">*/}
                        {/*                                <Select*/}
                        {/*                                    className="select"*/}
                        {/*                                    placeholder={t("Please Select")}*/}
                        {/*                                    portal={document.body}*/}
                        {/*                                    dropdownPosition="bottom"*/}
                        {/*                                    dropdownHandle={false}*/}
                        {/*                                    dropdownGap={0}*/}
                        {/*                                    onDropdownOpen={() => {*/}
                        {/*                                        let temp1 = window.scrollY;*/}
                        {/*                                        window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                        {/*                                        setTimeout(() => {*/}
                        {/*                                            let temp2 = window.scrollY;*/}
                        {/*                                            if (temp2 === temp1)*/}
                        {/*                                                window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                        {/*                                        }, 100);*/}
                        {/*                                    }}*/}
                        {/*                                    values={selectCustomValues.CeilingToFloor}*/}
                        {/*                                    dropdownRenderer={*/}
                        {/*                                        ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                        {/*                                    }*/}
                        {/*                                    contentRenderer={*/}
                        {/*                                        ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                        {/*                                                                                       postfixFa=""/>*/}
                        {/*                                    }*/}
                        {/*                                    // optionRenderer={*/}
                        {/*                                    //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                        {/*                                    // }*/}
                        {/*                                    onChange={(selected) => {*/}
                        {/*                                        if (selected[0] !== undefined) {*/}
                        {/*                                            optionSelectChanged("2E", selected[0], "cm", "س\u200Cم", pageLanguage);*/}
                        {/*                                            let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                        {/*                                            temp.CeilingToFloor = selected;*/}
                        {/*                                            setSelectCustomValues(temp);*/}
                        {/*                                            setDeps("", "2E");*/}
                        {/*                                            setCart("CeilingToFloor", selected[0].value);*/}
                        {/*                                        }*/}
                        {/*                                    }}*/}
                        {/*                                    options={SelectOptionRange(100, 500, 1, "cm", "", pageLanguage)}*/}
                        {/*                                />*/}
                        {/*                            </div>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                    <NextStep eventKey="3">{t("NEXT STEP")}</NextStep>*/}
                        {/*                </div>*/}
                        {/*            </Card.Body>*/}
                        {/*        </Accordion.Collapse>*/}
                        {/*    </Card>*/}
                        {/*}*/}
                        
                        {/* step 2DFloor */}
                        <Card
                            className={step2 === "true" && stepSelectedValue["2A"] === "3" && !!((stepSelectedValue["1"] === "3" && step11 === "true") || (step1 === "Outside" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Ceiling")) ? "" : "noDisplay"}>
                            <Card.Header>
                                <ContextAwareToggle eventKey="2D" stepNum={t("2D")} stepTitle={t("dk_step2E")} stepRef="2DFloor" type="2" required={requiredStep["2DFloor"]}
                                                    stepSelected={stepSelectedLabel["2DFloor"] === undefined ? "" : stepSelectedLabel["2DFloor"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2D">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{step1 === "Outside" ? t("dk_step2E_title") : t("arc_step2E_title")}</p>
                                            <img
                                                src={stepSelectedValue["1"] === "3" ? pageLanguage === 'fa' ? require('../Images/drapery/dk/new_ceiling_to_floor_3_arc_fa.svg').default : require('../Images/drapery/dk/new_ceiling_to_floor_3_arc.svg').default : pageLanguage === 'fa' ? require('../Images/drapery/dk/new_ceiling_to_floor_3_fa.svg').default : require('../Images/drapery/dk/new_ceiling_to_floor_3.svg').default}
                                                className="img-fluid tall_curtain_image" alt=""/>
                                        </div>
                                        {/*<div className="box100 Three_selection_container">*/}
                                        {/*    <div className="Three_select_container">*/}
                                        {/*        <label className="select_label">{t("step3AIn_A")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.CeilingToFloor1}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "2DFloor", 0, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.CeilingToFloor1 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2DFloor1");*/}
                                        {/*                        setCart("CeilingToFloor1", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(100, 500, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*    <div className="Three_select_container">*/}
                                        {/*        <label className="select_label">{t("step3AIn_B")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.CeilingToFloor2}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "2DFloor", 1, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.CeilingToFloor2 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2DFloor2");*/}
                                        {/*                        setCart("CeilingToFloor2", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(100, 500, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*    <div className="Three_select_container">*/}
                                        {/*        <label className="select_label">{t("step3AIn_C")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.CeilingToFloor3}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "2DFloor", 2, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.CeilingToFloor3 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2DFloor3");*/}
                                        {/*                        setCart("CeilingToFloor3", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(100, 500, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="box100 Three_selection_container">
                                            <div className="Three_select_container">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("step3AIn_A")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                inputs.current["ceilingToFloor2"].focus();
                                                            } else if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (ceilingToFloor1 !== undefined && (ceilingToFloor1 < 30 || ceilingToFloor1 > 400) ? " measure_input_err" : "")} type="text"
                                                                       name="ceilingToFloor1" value={NumToFa(`${ceilingToFloor1 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 400) {
                                                                                   setCartLoading(true);
                                                                                   setCart("CeilingToFloor1", parseInt(newValue));
                                                                                   setDeps("", "2DFloor1");
                                                                                   setCeilingToFloor1(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "2DFloor", 0, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "CeilingToFloor1");
                                                                                   setDeps("2DFloor1", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setCeilingToFloor1(undefined);
                                                                                       selectChanged(undefined, "2DFloor");
                                                                                   } else {
                                                                                       setCeilingToFloor1(parseInt(newValue));
                                                                                       selectChanged("2DFloor", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (ceilingToFloor1 !== undefined && (ceilingToFloor1 < 30 || ceilingToFloor1 > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("step3AIn_B")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["ceilingToFloor2"] = ref)} debounceTimeout={1500} onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                inputs.current["ceilingToFloor3"].focus();
                                                            } else if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (ceilingToFloor2 !== undefined && (ceilingToFloor2 < 30 || ceilingToFloor2 > 400) ? " measure_input_err" : "")} type="text"
                                                                       name="ceilingToFloor2" value={NumToFa(`${ceilingToFloor2 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 400) {
                                                                                   setCartLoading(true);
                                                                                   setCart("CeilingToFloor2", parseInt(newValue));
                                                                                   setDeps("", "2DFloor2");
                                                                                   setCeilingToFloor2(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "2DFloor", 1, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "CeilingToFloor2");
                                                                                   setDeps("2DFloor2", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setCeilingToFloor2(undefined);
                                                                                       selectChanged(undefined, "2DFloor");
                                                                                   } else {
                                                                                       setCeilingToFloor2(parseInt(newValue));
                                                                                       selectChanged("2DFloor", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (ceilingToFloor2 !== undefined && (ceilingToFloor2 < 30 || ceilingToFloor2 > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("step3AIn_C")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["ceilingToFloor3"] = ref)} debounceTimeout={1500} onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (ceilingToFloor3 !== undefined && (ceilingToFloor3 < 30 || ceilingToFloor3 > 400) ? " measure_input_err" : "")} type="text"
                                                                       name="ceilingToFloor3" value={NumToFa(`${ceilingToFloor3 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 400) {
                                                                                   setCartLoading(true);
                                                                                   setCart("CeilingToFloor3", parseInt(newValue));
                                                                                   setDeps("", "2DFloor3");
                                                                                   setCeilingToFloor3(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "2DFloor", 2, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "CeilingToFloor3");
                                                                                   setDeps("2DFloor3", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setCeilingToFloor3(undefined);
                                                                                       selectChanged(undefined, "2DFloor");
                                                                                   } else {
                                                                                       setCeilingToFloor3(parseInt(newValue));
                                                                                       selectChanged("2DFloor", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (ceilingToFloor3 !== undefined && (ceilingToFloor3 < 30 || ceilingToFloor3 > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="2DFloor" eventKey="3">{t("NEXT STEP")}</NextStep>
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
                        
                        {/* step 2DWall*/}
                        <Card
                            className={step2 === "true" && (stepSelectedValue["2A"] === "1" || stepSelectedValue["2A"] === "2") && !!((step1 === "Outside" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Wall")) ? "" : "noDisplay"}>
                            <Card.Header>
                                <ContextAwareToggle eventKey="2D" stepNum={t("2D")} stepTitle={t("dk_step2EWall")} stepRef="2DWall" type="2" required={requiredStep["2DWall"]}
                                                    stepSelected={stepSelectedLabel["2DWall"] === undefined ? "" : stepSelectedLabel["2DWall"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2D">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("dk_step2EWall_title")}</p>
                                            <img src={require('../Images/drapery/zebra/new_frame_height.svg').default} className="img-fluid just_frame" alt=""/>
                                        </div>
                                        {/*<div className="box100 Three_selection_container">*/}
                                        {/*    <div className="box100">*/}
                                        {/*        <label className="select_label">{t("Height")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.Height2D}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged("2DWall", selected[0], "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.Height2D = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2DWall");*/}
                                        {/*                        setCart("Height2D", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(30, 500, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Height")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (height2D !== undefined && (height2D < 30 || height2D > 400) ? " measure_input_err" : "")} type="text"
                                                                       name="height2D" value={NumToFa(`${height2D || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 400) {
                                                                                   setCartLoading(true);
                                                                                   setCart("Height2D", parseInt(newValue));
                                                                                   setDeps("", "2DWall");
                                                                                   setHeight2D(parseInt(newValue));
                                                                                   optionSelectChanged("2DWall", parseInt(newValue), "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "Height2D");
                                                                                   setDeps("2DWall", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setHeight2D(undefined);
                                                                                       selectChanged(undefined, "2DWall");
                                                                                   } else {
                                                                                       setHeight2D(parseInt(newValue));
                                                                                       selectChanged("2DWall", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (height2D !== undefined && (height2D < 30 || height2D > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="2DWall" eventKey="2E">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 2EWall */}
                        <Card
                            className={step2 === "true" && (stepSelectedValue["2A"] === "1" || stepSelectedValue["2A"] === "2") && !!((step1 === "Outside" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Wall")) ? "" : "noDisplay"}>
                            <Card.Header>
                                <ContextAwareToggle eventKey="2E" stepNum={t("2E")} stepTitle={t("dk_step2FWall")} stepRef="2EWall" type="2" required={requiredStep["2EWall"]}
                                                    stepSelected={stepSelectedLabel["2EWall"] === undefined ? "" : stepSelectedLabel["2EWall"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2E">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("dk_step2FWall_title")}</p>
                                            <img
                                                src={pageLanguage === 'fa' ? require('../Images/drapery/dk/new_RodtoFrame_track_full.svg').default : require('../Images/drapery/dk/new_RodtoFrame_track_full.svg').default}
                                                className="img-fluid frame_with_top2" alt=""/>
                                        </div>
                                        {/*<div className="box100 Three_selection_container">*/}
                                        {/*    <div className="box100">*/}
                                        {/*        /!*<label className="select_label">{t("Width")}<p className="farsi_cm">{t("select_cm")}</p></label>*!/*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.ShadeMount}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged("2EWall", selected[0], "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.ShadeMount = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2EWall");*/}
                                        {/*                        setCart("ShadeMount", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(10, 50, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Height")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (mount !== undefined && (mount < 10 || mount > 100) ? " measure_input_err" : "")} type="text"
                                                                       name="mount" value={NumToFa(`${mount || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 10 && parseInt(newValue) <= 100) {
                                                                                   setCartLoading(true);
                                                                                   setCart("ShadeMount", parseInt(newValue));
                                                                                   setDeps("", "2EWall");
                                                                                   setMount(parseInt(newValue));
                                                                                   optionSelectChanged("2EWall", parseInt(newValue), "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "ShadeMount");
                                                                                   setDeps("2EWall", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setMount(undefined);
                                                                                       selectChanged(undefined, "2EWall");
                                                                                   } else {
                                                                                       setMount(parseInt(newValue));
                                                                                       selectChanged("2EWall", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (mount !== undefined && (mount < 10 || mount > 100) ? " measure_input_desc_err" : "")}>{t("Min: ")} {NumToFa(`10`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="2EWall" eventKey="2F">{t("NEXT STEP")}</NextStep>
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
                        
                        {/* step 2FWall*/}
                        <Card
                            className={step2 === "true" && (stepSelectedValue["2A"] === "1" || stepSelectedValue["2A"] === "2") && !!((step1 === "Outside" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Wall")) ? "" : "noDisplay"}>
                            <Card.Header>
                                <ContextAwareToggle eventKey="2F" stepNum={t("2F")} stepTitle={t("dk_step2FWall2")} stepRef="2FWall" type="2" required={requiredStep["2FWall"]}
                                                    stepSelected={stepSelectedLabel["2FWall"] === undefined ? "" : stepSelectedLabel["2FWall"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2F">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("dk_step2GWall_title")}</p>
                                            <img
                                                src={pageLanguage === 'fa' ? require('../Images/drapery/dk/new_CeilingToFloor1_track_full_fa.svg').default : require('../Images/drapery/dk/new_CeilingToFloor1_track_full.svg').default}
                                                className="img-fluid tall_curtain_image" alt=""/>
                                        </div>
                                        {/*<div className="box100 Three_selection_container">*/}
                                        {/*    <div className="box100">*/}
                                        {/*        /!*<label className="select_label">{t("Height")}<p className="farsi_cm">{t("select_cm")}</p></label>*!/*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.CeilingToFloor}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged("2FWall", selected[0], "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.CeilingToFloor = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2FWall");*/}
                                        {/*                        setCart("CeilingToFloor", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(100, 500, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                <div className="measure_input_container">
                                                    {/*<h1 className="measure_input_label">{t("step3AIn_A")}</h1>*/}
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (ceilingToFloor !== undefined && (ceilingToFloor < 30 || ceilingToFloor > 1000 || (cartValues["HeightCart"] && (ceilingToFloor > +cartValues["HeightCart"]))) ? " measure_input_err" : "")} type="text"
                                                                       name="ceilingToFloor" value={NumToFa(`${ceilingToFloor || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 1000 && !(cartValues["HeightCart"] && (ceilingToFloor > +cartValues["HeightCart"]))) {
                                                                                   setCartLoading(true);
                                                                                   setCart("CeilingToFloor", parseInt(newValue));
                                                                                   setDeps("", "2FWall");
                                                                                   setCeilingToFloor(parseInt(newValue));
                                                                                   optionSelectChanged("2FWall", parseInt(newValue), "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "CeilingToFloor");
                                                                                   setDeps("2FWall", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setCeilingToFloor(undefined);
                                                                                       selectChanged(undefined, "2FWall");
                                                                                   } else {
                                                                                       setCeilingToFloor(parseInt(newValue));
                                                                                       selectChanged("2FWall", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (ceilingToFloor !== undefined && (ceilingToFloor < 30 || ceilingToFloor > 1000 || (cartValues["HeightCart"] && (ceilingToFloor > +cartValues["HeightCart"]))) ? " measure_input_desc_err" : "")}>{(cartValues["HeightCart"] && (ceilingToFloor > +cartValues["HeightCart"])) ? t("roomHeight_more_than_height") : ""}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="2FWall" eventKey="3">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 2DWallFloor */}
                        <Card
                            className={step2 === "true" && stepSelectedValue["2A"] === "3" && !!((step1 === "Outside" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Wall")) ? "" : "noDisplay"}>
                            <Card.Header>
                                <ContextAwareToggle eventKey="2D" stepNum={t("2D")} stepTitle={t("dk_step2DWall")} stepRef="2DWallFloor" type="2"
                                                    required={requiredStep["2DWallFloor"]}
                                                    stepSelected={stepSelectedLabel["2DWallFloor"] === undefined ? "" : stepSelectedLabel["2DWallFloor"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2D">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("dk_step2DWall_title")}</p>
                                            <img
                                                src={pageLanguage === 'fa' ? require('../Images/drapery/dk/new_WindowtoFloor_fa.svg').default : require('../Images/drapery/dk/new_WindowtoFloor.svg').default}
                                                className="img-fluid tall_curtain_image" alt=""/>
                                        </div>
                                        {/*<div className="box100 Three_selection_container">*/}
                                        {/*    <div className="box100">*/}
                                        {/*        /!*<label className="select_label">{t("Width")}<p className="farsi_cm">{t("select_cm")}</p></label>*!/*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.WindowToFloor}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged("2DWallFloor", selected[0], "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.WindowToFloor = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2DWallFloor");*/}
                                        {/*                        setCart("WindowToFloor", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(100, 350, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                <div className="measure_input_container">
                                                    {/*<h1 className="measure_input_label">{t("step3AIn_A")}</h1>*/}
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (windowToFloor !== undefined && (windowToFloor < 30 || windowToFloor > 400) ? " measure_input_err" : "")} type="text"
                                                                       name="windowToFloor1" value={NumToFa(`${windowToFloor || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 400) {
                                                                                   setCartLoading(true);
                                                                                   setCart("WindowToFloor", parseInt(newValue));
                                                                                   setDeps("", "2DWallFloor");
                                                                                   setWindowToFloor(parseInt(newValue));
                                                                                   optionSelectChanged("2DWallFloor", parseInt(newValue), "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "WindowToFloor");
                                                                                   setDeps("2DWallFloor", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setWindowToFloor(undefined);
                                                                                       selectChanged(undefined, "2DWallFloor");
                                                                                   } else {
                                                                                       setWindowToFloor(parseInt(newValue));
                                                                                       selectChanged("2DWallFloor", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (windowToFloor !== undefined && (windowToFloor < 30 || windowToFloor > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="2DWallFloor" eventKey="2E">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 2EWallFloor */}
                        <Card
                            className={step2 === "true" && (stepSelectedValue["2A"] === "3") && !!((step1 === "Outside" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Wall")) ? "" : "noDisplay"}>
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
                                                src={pageLanguage === 'fa' ? require('../Images/drapery/dk/new_RodtoFrame_track_full.svg').default : require('../Images/drapery/dk/new_RodtoFrame_track_full.svg').default}
                                                className="img-fluid frame_with_top2" alt=""/>
                                        </div>
                                        {/*<div className="box100 Three_selection_container">*/}
                                        {/*    <div className="box100">*/}
                                        {/*        /!*<label className="select_label">{t("Width")}<p className="farsi_cm">{t("select_cm")}</p></label>*!/*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.ShadeMount}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged("2EWallFloor", selected[0], "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.ShadeMount = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2EWallFloor");*/}
                                        {/*                        setCart("ShadeMount", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(10, 50, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Height")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (mount !== undefined && (mount < 10 || mount > 100) ? " measure_input_err" : "")} type="text"
                                                                       name="mount" value={NumToFa(`${mount || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 10 && parseInt(newValue) <= 100) {
                                                                                   setCartLoading(true);
                                                                                   setCart("ShadeMount", parseInt(newValue));
                                                                                   setDeps("", "2EWallFloor");
                                                                                   setMount(parseInt(newValue));
                                                                                   optionSelectChanged("2EWallFloor", parseInt(newValue), "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "ShadeMount");
                                                                                   setDeps("2EWallFloor", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setMount(undefined);
                                                                                       selectChanged(undefined, "2EWallFloor");
                                                                                   } else {
                                                                                       setMount(parseInt(newValue));
                                                                                       selectChanged("2EWallFloor", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (mount !== undefined && (mount < 10 || mount > 100) ? " measure_input_desc_err" : "")}>{t("Min: ")} {NumToFa(`10`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="2EWallFloor" eventKey="2F">{t("NEXT STEP")}</NextStep>
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
                        
                        {/* step 2FWallFloor*/}
                        <Card
                            className={step2 === "true" && (stepSelectedValue["2A"] === "3") && !!((step1 === "Outside" && selectedMountOutsideType.length && selectedMountOutsideType[0].value === "Wall")) ? "" : "noDisplay"}>
                            <Card.Header>
                                <ContextAwareToggle eventKey="2F" stepNum={t("2F")} stepTitle={t("dk_step2FWall2")} stepRef="2FWallFloor" type="2"
                                                    required={requiredStep["2FWallFloor"]}
                                                    stepSelected={stepSelectedLabel["2FWallFloor"] === undefined ? "" : stepSelectedLabel["2FWallFloor"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2F">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("dk_step2GWall_title")}</p>
                                            <img
                                                src={pageLanguage === 'fa' ? require('../Images/drapery/dk/new_CeilingToFloor1_track_full_fa.svg').default : require('../Images/drapery/dk/new_CeilingToFloor1_track_full.svg').default}
                                                className="img-fluid tall_curtain_image" alt=""/>
                                        </div>
                                        {/*<div className="box100 Three_selection_container">*/}
                                        {/*    <div className="box100">*/}
                                        {/*        /!*<label className="select_label">{t("Height")}<p className="farsi_cm">{t("select_cm")}</p></label>*!/*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.CeilingToFloor}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged("2FWallFloor", selected[0], "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.CeilingToFloor = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2FWallFloor");*/}
                                        {/*                        setCart("CeilingToFloor", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(100, 500, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                <div className="measure_input_container">
                                                    {/*<h1 className="measure_input_label">{t("step3AIn_A")}</h1>*/}
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (ceilingToFloor !== undefined && (ceilingToFloor < 30 || ceilingToFloor > 1000 || (cartValues["HeightCart"] && (ceilingToFloor > +cartValues["HeightCart"]))) ? " measure_input_err" : "")} type="text"
                                                                       name="ceilingToFloor" value={NumToFa(`${ceilingToFloor || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 1000 && !(cartValues["HeightCart"] && (ceilingToFloor > +cartValues["HeightCart"]))) {
                                                                                   setCartLoading(true);
                                                                                   setCart("CeilingToFloor", parseInt(newValue));
                                                                                   setDeps("", "2FWallFloor");
                                                                                   setCeilingToFloor(parseInt(newValue));
                                                                                   optionSelectChanged("2FWallFloor", parseInt(newValue), "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "CeilingToFloor");
                                                                                   setDeps("2FWallFloor", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setCeilingToFloor(undefined);
                                                                                       selectChanged(undefined, "2FWallFloor");
                                                                                   } else {
                                                                                       setCeilingToFloor(parseInt(newValue));
                                                                                       selectChanged("2FWallFloor", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (ceilingToFloor !== undefined && (ceilingToFloor < 30 || ceilingToFloor > 1000 || (cartValues["HeightCart"] && (ceilingToFloor > +cartValues["HeightCart"]))) ? " measure_input_desc_err" : "")}>{(cartValues["HeightCart"] && (ceilingToFloor > +cartValues["HeightCart"])) ? t("roomHeight_more_than_height") : ""}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="2FWallFloor" eventKey="3">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 2A inside */}
                        <Card className={step2 === "true" && stepSelectedValue["1"] === "1" && step11 === "true" ? "" : "noDisplay"}>
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
                                                src={pageLanguage === 'fa' ? require('../Images/drapery/zebra/new_width_inside_3_fa.svg').default : require('../Images/drapery/zebra/new_width_inside_3.svg').default}
                                                className="img-fluid frame_with_top" alt=""/>
                                        </div>
                                        {/*<div className="box100 Three_selection_container">*/}
                                        {/*    <div className="Three_select_container">*/}
                                        {/*        <label className="select_label">{t("step3AIn_A")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.width1}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "2AIn", 0, true, "widthDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.width1 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2AIn1");*/}
                                        {/*                        setCart("Width1", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(30, 300, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*    <div className="Three_select_container">*/}
                                        {/*        <label className="select_label">{t("step3AIn_B")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.width2}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "2AIn", 1, true, "widthDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.width2 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2AIn2");*/}
                                        {/*                        setCart("Width2", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(30, 300, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*    <div className="Three_select_container">*/}
                                        {/*        <label className="select_label">{t("step3AIn_C")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.width3}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "2AIn", 2, true, "widthDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.width3 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2AIn3");*/}
                                        {/*                        setCart("Width3", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(30, 300, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="box100 Three_selection_container">
                                            <div className="Three_select_container">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("step3AIn_A")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                inputs.current["width2"].focus();
                                                            } else if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (width1 !== undefined && (width1 < 30 || width1 > 300) ? " measure_input_err" : "")} type="text"
                                                                       name="width1" value={NumToFa(`${width1 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 300) {
                                                                                   setCartLoading(true);
                                                                                   setCart("Width1", parseInt(newValue));
                                                                                   setDeps("", "2AIn1");
                                                                                   setWidth1(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "2AIn", 0, true, "widthDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "Width1");
                                                                                   setDeps("2AIn1", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setWidth1(undefined);
                                                                                       selectChanged(undefined, "2AIn");
                                                                                   } else {
                                                                                       setWidth1(parseInt(newValue));
                                                                                       selectChanged("2AIn", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (width1 !== undefined && (width1 < 30 || width1 > 300) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 300`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("step3AIn_B")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["width2"] = ref)} debounceTimeout={1500} onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                inputs.current["width3"].focus();
                                                            } else if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (width2 !== undefined && (width2 < 30 || width2 > 300) ? " measure_input_err" : "")} type="text"
                                                                       name="width2" value={NumToFa(`${width2 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 300) {
                                                                                   setCartLoading(true);
                                                                                   setCart("Width2", parseInt(newValue));
                                                                                   setDeps("", "2AIn2");
                                                                                   setWidth2(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "2AIn", 1, true, "widthDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "Width2");
                                                                                   setDeps("2AIn2", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setWidth2(undefined);
                                                                                       selectChanged(undefined, "2AIn");
                                                                                   } else {
                                                                                       setWidth2(parseInt(newValue));
                                                                                       selectChanged("2AIn", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (width2 !== undefined && (width2 < 30 || width2 > 300) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 300`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("step3AIn_C")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["width3"] = ref)} inputRef={ref => (inputs.current["width3"] = ref)} debounceTimeout={1500} onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (width3 !== undefined && (width3 < 30 || width3 > 300) ? " measure_input_err" : "")} type="text"
                                                                       name="width3" value={NumToFa(`${width3 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 300) {
                                                                                   setCartLoading(true);
                                                                                   setCart("Width3", parseInt(newValue));
                                                                                   setDeps("", "2AIn3");
                                                                                   setWidth3(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "2AIn", 2, true, "widthDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "Width3");
                                                                                   setDeps("2AIn3", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setWidth3(undefined);
                                                                                       selectChanged(undefined, "2AIn");
                                                                                   } else {
                                                                                       setWidth3(parseInt(newValue));
                                                                                       selectChanged("2AIn", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (width3 !== undefined && (width3 < 30 || width3 > 300) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 300`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="2AIn" eventKey="2B">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">{t("step3A_help_dk_1")}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 2B inside */}
                        <Card className={step2 === "true" && stepSelectedValue["1"] === "1" && step11 === "true" ? "" : "noDisplay"}>
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
                                                src={pageLanguage === 'fa' ? require('../Images/drapery/zebra/new_height_inside_3_fa.svg').default : require('../Images/drapery/zebra/new_height_inside_3.svg').default}
                                                className="img-fluid frame_with_top" alt=""/>
                                        </div>
                                        {/*<div className="box100 Three_selection_container">*/}
                                        {/*    <div className="Three_select_container">*/}
                                        {/*        <label className="select_label">{t("step3BIn_A")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.height1}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "2BIn", 0, false, "heightDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.height1 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2BIn1");*/}
                                        {/*                        setCart("Height1", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*    <div className="Three_select_container">*/}
                                        {/*        <label className="select_label">{t("step3BIn_B")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.height2}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "2BIn", 1, false, "heightDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.height2 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2BIn2");*/}
                                        {/*                        setCart("Height2", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*    <div className="Three_select_container">*/}
                                        {/*        <label className="select_label">{t("step3BIn_C")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                        {/*        <div className="select_container select_container_num">*/}
                                        {/*            <Select*/}
                                        {/*                className="select"*/}
                                        {/*                placeholder={t("Please Select")}*/}
                                        {/*                portal={document.body}*/}
                                        {/*                dropdownPosition="bottom"*/}
                                        {/*                dropdownHandle={false}*/}
                                        {/*                dropdownGap={0}*/}
                                        {/*                onDropdownOpen={() => {*/}
                                        {/*                    let temp1 = window.scrollY;*/}
                                        {/*                    window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                        {/*                    setTimeout(() => {*/}
                                        {/*                        let temp2 = window.scrollY;*/}
                                        {/*                        if (temp2 === temp1)*/}
                                        {/*                            window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.height3}*/}
                                        {/*                dropdownRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>*/}
                                        {/*                }*/}
                                        {/*                contentRenderer={*/}
                                        {/*                    ({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                   postfixFa=""/>*/}
                                        {/*                }*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "2BIn", 2, false, "heightDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.height3 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "2BIn3");*/}
                                        {/*                        setCart("Height3", selected[0].value);*/}
                                        {/*                    }*/}
                                        {/*                }}*/}
                                        {/*                options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="box100 Three_selection_container">
                                            <div className="Three_select_container">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("step3BIn_A")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                inputs.current["height2"].focus();
                                                            } else if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (height1 !== undefined && (height1 < 30 || height1 > 400) ? " measure_input_err" : "")} type="text"
                                                                       name="height1" value={NumToFa(`${height1 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 400) {
                                                                                   setCartLoading(true);
                                                                                   setCart("Height1", parseInt(newValue));
                                                                                   setDeps("", "2BIn1");
                                                                                   setHeight1(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "2BIn", 0, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "Height1");
                                                                                   setDeps("2BIn1", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setHeight1(undefined);
                                                                                       selectChanged(undefined, "2BIn");
                                                                                   } else {
                                                                                       setHeight1(parseInt(newValue));
                                                                                       selectChanged("2BIn", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (height1 !== undefined && (height1 < 30 || height1 > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("step3BIn_B")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["height2"] = ref)} debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                inputs.current["height3"].focus();
                                                            } else if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (height2 !== undefined && (height2 < 30 || height2 > 400) ? " measure_input_err" : "")} type="text"
                                                                       name="height2" value={NumToFa(`${height2 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 400) {
                                                                                   setCartLoading(true);
                                                                                   setCart("Height2", parseInt(newValue));
                                                                                   setDeps("", "2BIn2");
                                                                                   setHeight2(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "2BIn", 1, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "Height2");
                                                                                   setDeps("2BIn2", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setHeight2(undefined);
                                                                                       selectChanged(undefined, "2BIn");
                                                                                   } else {
                                                                                       setHeight2(parseInt(newValue));
                                                                                       selectChanged("2BIn", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (height2 !== undefined && (height2 < 30 || height2 > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("step3BIn_C")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["height3"] = ref)} debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (height3 !== undefined && (height3 < 30 || height3 > 400) ? " measure_input_err" : "")} type="text"
                                                                       name="height3" value={NumToFa(`${height3 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 30 && parseInt(newValue) <= 400) {
                                                                                   setCartLoading(true);
                                                                                   setCart("Height3", parseInt(newValue));
                                                                                   setDeps("", "2BIn3");
                                                                                   setHeight3(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "2BIn", 2, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "Height3");
                                                                                   setDeps("2BIn3", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setHeight3(undefined);
                                                                                       selectChanged(undefined, "2BIn");
                                                                                   } else {
                                                                                       setHeight3(parseInt(newValue));
                                                                                       selectChanged("2BIn", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (height3 !== undefined && (height3 < 30 || height3 > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="2BIn" eventKey="3">{t("NEXT STEP")}</NextStep>
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
                        
                        {/* step 3 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="3" stepNum={t("3")} stepTitle={t("dk_base_fabric_step_title")} stepRef="3" type="1" required={requiredStep["3"]}
                                                    stepSelected={stepSelectedLabel["3"] === undefined ? "" : stepSelectedLabel["3"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3">
                                <Card.Body>
                                    {/*<div className="card_body card-body-fabric card-body-dk-fabric">*/}
                                    <div className="card_body card-body-fabric">
                                        <div className="dk_curtain_text_container">
                                            <h1 className="dk_curtain_text">
                                                {t("dk_curtain_preview_help")}
                                            </h1>
                                        </div>
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
                                                <div className="filters_show_hide_container" onClick={() => {
                                                    if (filtersShow) {
                                                        setFiltersShow(false);
                                                    } else {
                                                        setFiltersShow(true);
                                                    }
                                                }}>
                                                    <span className="filters_toggle">{t("Filters")}</span>
                                                    <span className="filters_indicator">
                                                        {filtersShow && <img className="arrow_down img-fluid" src={require('../Images/public/arrow_up.svg').default} alt=""/>}
                                                        {!filtersShow &&
                                                            <img className="arrow_down img-fluid" src={require('../Images/public/arrow_down.svg').default} alt=""/>}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={filtersShow ? "filters_container" : "filters_container filters_container_hidden"}>
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
                                        <div className="fabrics_list_container dk2_fabrics_list_container">
                                            {/*<div className="fabric_design_type">*/}
                                            {/*    <h1>{t("BASE FABRIC SELECTION")}</h1>*/}
                                            {/*    {baseActive && !baseMore && <span onClick={() => setBaseMore(true)}>{t("View More")}<h6>&nbsp;&nbsp;+</h6></span>}*/}
                                            {/*    {baseActive && baseMore && <span onClick={() => setBaseMore(false)}>{t("View Less")}<h6>&nbsp;&nbsp;&#8722;</h6></span>}*/}
                                            {/*</div>*/}
                                            {fabricsList}
                                            
                                            {/*<div className="fabric_design_type">*/}
                                            {/*    <h1>{t("DECORATIVE FABRIC SELECTION")}</h1>*/}
                                            {/*    {decorativeActive && !decorativeMore && <span onClick={() => setDecorativeMore(true)}>{t("View More")}<h6>&nbsp;&nbsp;+</h6></span>}*/}
                                            {/*    {decorativeActive && decorativeMore &&*/}
                                            {/*        <span onClick={() => setDecorativeMore(false)}>{t("View Less")}<h6>&nbsp;&nbsp;&#8722;</h6></span>}*/}
                                            {/*</div>*/}
                                            {/*{fabricsList2}*/}
                                        </div>
                                        <NextStep currentStep="3" eventKey="35">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 4 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="35" stepNum={t("4")} stepTitle={pageLanguage === 'fa' ? t("dk_decor_fabric_step_title") + convertToPersian(defaultModelNameFa) : defaultModelName + t("dk_decor_fabric_step_title")} stepRef="35" type="1" required={requiredStep["35"]}
                                                    stepSelected={stepSelectedLabel["35"] === undefined ? "" : stepSelectedLabel["35"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="35">
                                <Card.Body>
                                    <div className="card_body card-body-fabric">
                                        <div className="dk_curtain_text_container">
                                            <h1 className="dk_curtain_text">
                                                {t("dk_curtain_preview_help")}
                                            </h1>
                                        </div>
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
                                                <div className="filters_show_hide_container" onClick={() => {
                                                    if (filtersShow) {
                                                        setFiltersShow(false);
                                                    } else {
                                                        setFiltersShow(true);
                                                    }
                                                }}>
                                                    <span className="filters_toggle">{t("Filters")}</span>
                                                    <span className="filters_indicator">
                                                        {filtersShow && <img className="arrow_down img-fluid" src={require('../Images/public/arrow_up.svg').default} alt=""/>}
                                                        {!filtersShow &&
                                                            <img className="arrow_down img-fluid" src={require('../Images/public/arrow_down.svg').default} alt=""/>}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={filtersShow ? "filters_container" : "filters_container filters_container_hidden"}>
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
                                        <div className="fabrics_list_container dk2_fabrics_list_container">
                                            {/*<div className="fabric_design_type">*/}
                                            {/*    <h1>{t("BASE FABRIC SELECTION")}</h1>*/}
                                            {/*    {baseActive && !baseMore && <span onClick={() => setBaseMore(true)}>{t("View More")}<h6>&nbsp;&nbsp;+</h6></span>}*/}
                                            {/*    {baseActive && baseMore && <span onClick={() => setBaseMore(false)}>{t("View Less")}<h6>&nbsp;&nbsp;&#8722;</h6></span>}*/}
                                            {/*</div>*/}
                                            {/*{fabricsList}*/}
                                            
                                            {/*<div className="fabric_design_type">*/}
                                            {/*    <h1>{t("DECORATIVE FABRIC SELECTION")}</h1>*/}
                                            {/*    {decorativeActive && !decorativeMore && <span onClick={() => setDecorativeMore(true)}>{t("View More")}<h6>&nbsp;&nbsp;+</h6></span>}*/}
                                            {/*    {decorativeActive && decorativeMore &&*/}
                                            {/*        <span onClick={() => setDecorativeMore(false)}>{t("View Less")}<h6>&nbsp;&nbsp;&#8722;</h6></span>}*/}
                                            {/*</div>*/}
                                            {fabricsList2}
                                        </div>
                                        <NextStep currentStep="3" eventKey="4">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 5 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="4" stepNum={t("5")} stepTitle={t("DK_step4")} stepRef="4" type="1" required={requiredStep["4"]}
                                                    stepSelected={stepSelectedLabel["4"] === undefined ? "" : stepSelectedLabel["4"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="4">
                                <Card.Body>
                                    <div className="card_body card_body_radio special_farsi_card_body">
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/dk/length_type_left.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("Left")} value="1" name="step4" ref-num="4" id="41" checked={step4 === "Left"}
                                                   onChange={e => {
                                                       selectChanged(e, "");
                                                       setStep4("Left");
                                                       setDeps("", "4,5");
                                                       setCart("StackPosition", "Left");
                                                   }} ref={ref => (inputs.current["41"] = ref)}/>
                                            <label htmlFor="41">{t("Left")}</label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/dk/length_type_right.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("Right")} value="2" name="step4" ref-num="4" id="42" checked={step4 === "Right"}
                                                   onChange={e => {
                                                       selectChanged(e, "");
                                                       setStep4("Right");
                                                       setDeps("", "4,4A");
                                                       setCart("StackPosition", "Right");
                                                   }} ref={ref => (inputs.current["42"] = ref)}/>
                                            <label htmlFor="42">{t("Right")}</label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/dk/length_type_both.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("Center Split")} value="3" name="step4" ref-num="4" id="43"
                                                   checked={step4 === "CenterSplit"}
                                                   onChange={e => {
                                                       selectChanged(e, "");
                                                       setStep4("CenterSplit");
                                                       setDeps("4A", "4");
                                                       setCart("StackPosition", "CenterSplit");
                                                   }} ref={ref => (inputs.current["43"] = ref)}/>
                                            <label htmlFor="43">{t("Center Split")}</label>
                                        </div>
                                        <NextStep
                                            eventKey={step4 === "CenterSplit" || step4 === "" ? "4A" : "5"}>{t("NEXT STEP")}</NextStep>
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
                        
                        {/* step 5A */}
                        <Card className={step4 === "CenterSplit" ? "" : "noDisplay"}>
                            <Card.Header className={[...depSet].findIndex(el => el.startsWith("4")) === -1 && (!accordionActiveKey.startsWith("4")) ? "hidden" : ""}>
                                <ContextAwareToggle eventKey="4A" stepNum={t("5A")} stepTitle={t("DK_step5")} stepRef="4A" type="1" required={requiredStep["4A"]}
                                                    stepSelected={stepSelectedLabel["4A"] === undefined ? "" : stepSelectedLabel["4A"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="4A">
                                <Card.Body>
                                    <div className="card_body card_body_radio special_farsi_card_body">
                                        <div className="box50 radio_style radio_middle">
                                            <img src={require('../Images/drapery/dk/controlposition_left.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("Left")} value="1" name="step4A" ref-num="4A" id="4A1" checked={step4A === "Left"}
                                                   onChange={e => {
                                                       selectChanged(e, "");
                                                       setStep4A("Left");
                                                       setDeps("", "4A");
                                                       setCart("ControlPosition", "Left");
                                                   }} ref={ref => (inputs.current["4A1"] = ref)}/>
                                            <label htmlFor="4A1">{t("Left")}</label>
                                        </div>
                                        <div className="box50 radio_style radio_middle">
                                            <img src={require('../Images/drapery/dk/controlposition_right.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("Right")} value="2" name="step4A" ref-num="4A" id="4A2" checked={step4A === "Right"}
                                                   onChange={e => {
                                                       selectChanged(e, "");
                                                       setStep4A("Right");
                                                       setDeps("", "4A");
                                                       setCart("ControlPosition", "Right");
                                                   }} ref={ref => (inputs.current["4A2"] = ref)}/>
                                            <label htmlFor="4A2">{t("Right")}</label>
                                        </div>
                                        <NextStep currentStep={[...depSet].findIndex(el => el.startsWith("4")) === -1 ? "4" : "4A"} eventKey="5">{t("NEXT STEP")}</NextStep>
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
                                <ContextAwareToggle eventKey="5" stepNum={t("6")} stepTitle={t("zebra_step4")} stepRef="5" type="1" required={requiredStep["5"]}
                                                    stepSelected={stepSelectedLabel["5"] === undefined ? "" : stepSelectedLabel["5"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="5">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("Chain & Cord")} value="1" name="step5" ref-num="5" id="51"
                                                   checked={step5 === "Chain & Cord"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep5("Chain & Cord");
                                                       setStep51("false");
                                                       setMotorErr1(false);
                                                       setDeps("", "5,51");
                                                       setCart("ControlType", "Chain & Cord", "hasPower,MotorType");
                                                       setCustomMotorAcc({});
                                                   }} ref={ref => (inputs.current["51"] = ref)}/>
                                            <label htmlFor="51">{t("Chain & Cord")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" value="2" name="step5" checked={step5 === "Motorized"}
                                                   ref-num="5" id="52"
                                                   onChange={e => {
                                                       selectChanged(e, "51");
                                                       setStep5("Motorized");
                                                       setDeps("51", "5");
                                                   }} ref={ref => (inputs.current["52"] = ref)}/>
                                            <label htmlFor="52">{t("Motorized")}<br/><p
                                                className="surcharge_price">{Object.keys(modelAccessories).length !== 0 || selectedMotorMinPrice > 0 ? t("Starts at ") + GetPrice(selectedMotorMinPrice, pageLanguage, t("TOMANS")) : t("Surcharge Applies")}</p>
                                            </label>
                                        </div>
                                        <div className={step5 === "Motorized" ? (motorErr1 ? "secondary_options secondary_options_err" : "secondary_options") : "noDisplay"}>
                                            <div className="card-body-display-flex">
                                                <div className="width_max checkbox_style">
                                                    <input type="checkbox" text={t("Motorized")} value="2" name="step51" ref-num="5" checked={step51 === "true"}
                                                           onChange={(e) => {
                                                               if (e.target.checked) {
                                                                   selectChanged(e);
                                                                   setStep51("true");
                                                                   setMotorErr1(false);
                                                                   setDeps("511", "51");
                                                                   setCart("hasPower", true, "", "ControlType", ["Motorized"]);
                                                               } else {
                                                                   selectUncheck(e);
                                                                   setStep51("");
                                                                   setCustomMotorAcc({});
                                                                   setDeps("51", "511");
                                                                   setCart("", "", "ControlType,hasPower,MotorType");
                                                               }
                                                           }} id="511" ref={ref => (inputs.current["511"] = ref)}/>
                                                    <label htmlFor="511" className="checkbox_label">
                                                        <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')}
                                                             alt=""/>
                                                    </label>
                                                    <span className="checkbox_text">
                                                        {t("dk_Motor_title")}
                                                    </span>
                                                </div>
                                            
                                            </div>
                                        </div>
                                        {motorErr1 &&
                                            <div className="input_not_valid">{t("dk_motorErr1")}</div>
                                        }
                                        <div
                                            className={step51 === "true" && step5 === "Motorized" ? "motorized_options same_row_selection" : "motorized_options same_row_selection noDisplay"}>
                                            <div className="motorized_option_left">
                                                <p>{t("Motor Type")}</p>
                                                &nbsp;
                                                <span onClick={() => modalHandleShow("learnMore1")}>{t("(Learn More)")}</span>
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
                                                        values={selectedMotorType}
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
                                                            // if (selected[0] && cartValues["WidthCart"] && cartValues["HeightCart"]) {
                                                            if (selected[0] && !motorLoad2) {
                                                                // console.log(MotorType);
                                                                setDeps("", "511");
                                                                setSelectedMotorType(selected);
                                                                if (motorLoad2) {
                                                                    setMotorLoad2(false);
                                                                } else {
                                                                    if (selected[0]["apiAccValue"]) {
                                                                        setCustomMotorAcc(selected[0]["apiAccValue"]);
                                                                        setCart("MotorType", selected[0].value, undefined, undefined, undefined, selected[0]["apiAccValue"]);
                                                                    } else {
                                                                        setCart("MotorType", selected[0].value);
                                                                    }
                                                                }
                                                            }
                                                            if (motorLoad2) {
                                                                setMotorLoad2(false);
                                                            }
                                                        }}
                                                        options={MotorType[pageLanguage]}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <NextStep currentStep="5" eventKey={step5 === "Motorized" && step51 !== "true" ? "5" : "6"} onClick={() => {
                                            if (step5 === "Motorized" && step51 !== "true") {
                                                setMotorErr1(true);
                                            }
                                        }}>{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    {/*{(step5 === undefined) &&*/}
                                    {/*    <div className="accordion_help">*/}
                                    {/*        <div className="help_container">*/}
                                    {/*            <div className="help_column help_left_column">*/}
                                    {/*                <p className="help_column_header">{t("step4_help_1")}</p>*/}
                                    {/*                <ul className="help_column_list">*/}
                                    {/*                    <li>{t("step4_help_2")}</li>*/}
                                    {/*                    <li>{t("step4_help_3")}</li>*/}
                                    {/*                </ul>*/}
                                    {/*            </div>*/}
                                    {/*            <div className="help_column help_right_column">*/}
                                    {/*                <p className="help_column_header">{t("step4_help_4")}</p>*/}
                                    {/*                <ul className="help_column_list">*/}
                                    {/*                    /!*<li>{t("step4_help_5")}</li>*!/*/}
                                    {/*                    <li className="no_listStyle">*/}
                                    {/*                    <span className="popover_indicator">*/}
                                    {/*                        {<PopoverStickOnHover placement={`${pageLanguage === 'fa' ? "right" : "left"}`}*/}
                                    {/*                                              children={<object className="popover_camera" type="image/svg+xml"*/}
                                    {/*                                                                data={require('../Images/public/camera.svg').default}/>}*/}
                                    {/*                                              component={*/}
                                    {/*                                                  <div className="clearfix">*/}
                                    {/*                                                      <div className="popover_image clearfix">*/}
                                    {/*                                                          <img*/}
                                    {/*                                                              src={popoverImages["step41"] === undefined ? require('../Images/drapery/zebra/motorized_control_type1.png.jpg') : popoverImages["step41"]}*/}
                                    {/*                                                              className="img-fluid" alt=""/>*/}
                                    {/*                                                      </div>*/}
                                    {/*                                                      <div className="popover_footer">*/}
                                    {/*                                                          <span className="popover_footer_title">{t("step4_popover_1")}</span>*/}
                                    {/*                                                          <span className="popover_thumbnails">*/}
                                    {/*                                                              <div>*/}
                                    {/*                                                                  <img src={require('../Images/drapery/zebra/motorized_control_type1.png.jpg')}*/}
                                    {/*                                                                       text="step41"*/}
                                    {/*                                                                       onMouseEnter={(e) => popoverThumbnailHover(e)}*/}
                                    {/*                                                                       className="popover_thumbnail_img img-fluid"*/}
                                    {/*                                                                       alt=""/>*/}
                                    {/*                                                              </div>*/}
                                    {/*                                                              /!*<div>*!/*/}
                                    {/*                                                              /!*    <img src={require('../Images/drapery/zebra/motorized_control_type2.png')}*!/*/}
                                    {/*                                                              /!*         text="step41"*!/*/}
                                    {/*                                                              /!*         onMouseEnter={(e) => popoverThumbnailHover(e)}*!/*/}
                                    {/*                                                              /!*         className="popover_thumbnail_img img-fluid"*!/*/}
                                    {/*                                                              /!*         alt=""/>*!/*/}
                                    {/*                                                              /!*</div>*!/*/}
                                    {/*                                                          </span>*/}
                                    {/*                                                      </div>*/}
                                    {/*                                                  </div>*/}
                                    {/*                                              }/>*/}
                                    {/*                        }*/}
                                    {/*                    </span>{t("step4_help_5")}</li>*/}
                                    {/*                    /!*<li>{t("step4_help_5.5")}</li>*!/*/}
                                    {/*                    <li>{t("step4_help_6")}</li>*/}
                                    {/*                </ul>*/}
                                    {/*            </div>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*}*/}
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 6 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="6" stepNum={t("6")} stepTitle={t("zebra_step6")} stepRef="6" type="2" required={requiredStep["6"]}
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
                                                        <span className="details-label unselectable">{detailsShow ? t("Hide Details") : t("Add Room Image")}</span>
                                                        <span className="details_indicator">
                                                            {/*<i className="arrow_down"/>*/}
                                                            {detailsShow && <img className="arrow_down img-fluid" src={require('../Images/public/arrow_up.svg').default} alt=""/>}
                                                            {!detailsShow &&
                                                                <img className="arrow_down img-fluid" src={require('../Images/public/arrow_down.svg').default} alt=""/>}
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
                                                            if (selected[0]) {
                                                                setDeps("", "61");
                                                                roomLabelChanged(selected[0], "6", false);
                                                                setSelectedRoomLabel(selected);
                                                                // setCart("RoomNameEn", selected[0].value);
                                                                setCart("RoomNameFa", rooms["fa"].find(opt => opt.value === selected[0].value).label, "", "RoomNameEn", [selected[0].value]);
                                                            }
                                                        }}
                                                        options={rooms[pageLanguage]}
                                                    />
                                                </div>
                                            </div>
                                            <div className="room_select">
                                                <label className="select_label">{t("Window Description")}</label>
                                                <DebounceInput debounceTimeout={1500} onKeyDown={() => setCartLoading(true)} type="text" placeholder={t("Window Description")}
                                                               className="form-control window_name" name="order_window_name"
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
                                        <NextStep currentStep="6" eventKey="7">{t("NEXT STEP")}</NextStep>
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
                        
                        {/* step 7 */}
                        <Card className={accordionActiveKey === "" ? "card_little_margin" : "card_big_margin"}>
                            <Card.Header>
                                <ContextAwareToggle eventKey="7" stepNum={t("7")} stepTitle={t("zebra_step7")} stepTitle2={t("(Optional)")} stepRef="7" type="2"
                                                    required={false}
                                                    stepSelected={stepSelectedLabel["7"] === undefined ? "" : stepSelectedLabel["7"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="7">
                                <Card.Body>
                                    <div className="card_body card_body_zipcode">
                                        <div className="zipcode_bag_section">
                                            <div className="zipcode_section_container">
                                                <div className="zipcode_text zipcode_section_title_container">
                                                    <img src={require('../Images/public/W_truck.png')} alt="" className="img-fluid"/>
                                                    <h3>{t("zipcode_text1")}</h3>
                                                </div>
                                                {hasZipcode === "" &&
                                                    <h3 className="zipcode_text">{t("zipcode_text1.5")}</h3>
                                                }
                                                {/*<div className="zipcode_selection_container">*/}
                                                {/*    <Accordion>*/}
                                                {/*        <Accordion.Item eventKey="0">*/}
                                                {/*            <ContextAwareToggleViewDetails eventKey="0" textOnHide={t("Zip code")} textOnShow={t("Zip code")} customClass={"Zipcode_accordion_button"}*/}
                                                {/*                                           customClass2={"Zipcode_accordion_button_text"}/>*/}
                                                {/*            <Accordion.Body className="zipcode_dropdown">*/}
                                                {/*                <div className="zipcode_dropdown_div_container">*/}
                                                {/*                    <div className="zipcode_input_container">*/}
                                                {/*                        <input className="zipcode_input form-control" type="text" name="zipcode_input" value={zipcode}*/}
                                                {/*                               placeholder={t("Enter Zip Code")} onChange={(e) => {*/}
                                                {/*                            setZipcode(e.target.value.replace(/\D+/g, ''));*/}
                                                {/*                        }}/>*/}
                                                {/*                        <button className="zipcode_input_button white_btn"*/}
                                                {/*                                onClick={() => {*/}
                                                {/*                                    setZipcodeButton(true);*/}
                                                {/*                                    measureWindowSize(zipcode);*/}
                                                {/*                                }}>*/}
                                                {/*                            <div/>*/}
                                                {/*                        </button>*/}
                                                {/*                    </div>*/}
                                                {/*                </div>*/}
                                                {/*            </Accordion.Body>*/}
                                                {/*        </Accordion.Item>*/}
                                                {/*    </Accordion>*/}
                                                {/*</div>*/}
                                                {hasZipcode === "" &&
                                                    <div className="zipcode_dropdown_div_container">
                                                        <div className="zipcode_input_container">
                                                            <input className="zipcode_input form-control" type="text" name="zipcode_input" value={zipcode}
                                                                   placeholder={t("Enter Zip Code")} onChange={(e) => {
                                                                setZipcode(e.target.value.replace(/\D+/g, ''));
                                                            }}/>
                                                            <button className="zipcode_input_button white_btn"
                                                                    onClick={() => {
                                                                        measureWindowSize(zipcode);
                                                                    }}>
                                                                <div/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                }
                                                {zipcodeButton &&
                                                    <h3 className="zipcode_text2">
                                                        {zipcodeButton && hasInstall === false &&
                                                            t("zipcode_text2")
                                                        }
                                                        {zipcodeButton && hasInstall && hasZipcode === "" &&
                                                            t("zipcode_text3")
                                                        }
                                                        {zipcodeButton && hasInstall && hasZipcode !== "" && installPrice === -1 &&
                                                            t("zipcode_text3")
                                                        }
                                                    </h3>
                                                }
                                                {zipcodeButton && hasInstall && installPrice === -1 &&
                                                    <h3 className="zipcode_text">{t("zipcode_text8")}</h3>
                                                }
                                                {zipcodeButton && hasInstall && !!installPrice && installPrice !== -1 && hasZipcode === "" &&
                                                    <div className="zipcode_available_container">
                                                        <div className="checkbox_style">
                                                            <input type="checkbox" value="1" name="zipcode" disabled={addingLoading} checked={zipcodeChecked === "true"}
                                                                   onChange={(e) => {
                                                                       if (e.target.checked) {
                                                                           setZipcodeChecked("true");
                                                                           setCart("ZipCode", zipcode);
                                                                       } else {
                                                                           setZipcodeChecked("false");
                                                                           setCart("", "", "ZipCode");
                                                                       }
                                                                   }} id="zipcode" ref={ref => (inputs.current["zipcode"] = ref)}/>
                                                            <label htmlFor="zipcode" className="checkbox_label">
                                                                <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')}
                                                                     alt=""/>
                                                            </label>
                                                            <span className="checkbox_text">
                                                                {t("zipcode_text4")}{GetPrice(installPrice, pageLanguage, t("TOMANS"))}{t("zipcode_text5")}
                                                                <br/>
                                                                {t("zipcode_text5.5")}{GetPrice(transportPrice, pageLanguage, t("TOMANS"))}{t("zipcode_text6")}
                                                            </span>
                                                        </div>
                                                        {/*<h3 className="zipcode_text3">{t("zipcode_text7")}</h3>*/}
                                                    </div>
                                                }
                                                {zipcodeButton && hasInstall && !!installPrice && installPrice !== -1 && hasZipcode !== "" &&
                                                    <div className="checkbox_style checkbox_style_hasZipcode">
                                                        <input type="checkbox" value="1" name="zipcode" disabled={addingLoading} checked={zipcodeChecked === "true"}
                                                               onChange={(e) => {
                                                                   if (e.target.checked) {
                                                                       setZipcodeChecked("true");
                                                                       setCart("ZipCode", zipcode);
                                                                   } else {
                                                                       setZipcodeChecked("false");
                                                                       setCart("", "", "ZipCode");
                                                                   }
                                                               }} id="zipcode" ref={ref => (inputs.current["zipcode"] = ref)}/>
                                                        <label htmlFor="zipcode" className="checkbox_label">
                                                            <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')}
                                                                 alt=""/>
                                                        </label>
                                                        <span className="checkbox_text">
                                                            {t("zipcode_text4")}{GetPrice(installPrice, pageLanguage, t("TOMANS"))}{t("zipcode_text5")}
                                                        </span>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" accordion_help">
                                        <div className=" help_container">
                                            <div className=" help_column help_left_column">
                                                <p className=" help_column_header"/>
                                                <ul className=" help_column_list">
                                                    <li>{t("stepZip_help_1")}</li>
                                                    <li>{t("stepZip_help_2")}</li>
                                                    <li>{t("stepZip_help_3")}<h5 className="text_underline pointer"
                                                                                 onClick={() => modalHandleShow("Zipcode_how_it_works")}>{t("zipcode_measure_verify")}</h5></li>
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
                   onHide={() => modalHandleClose("noPower")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("modal_no power")}</p>
                    
                    <br/>
                    <div className=" text_center">
                        <button className=" btn btn-new-dark" onClick={() => modalHandleClose("noPower")}>{t("CONTINUE")}</button>
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
                        <button className=" btn btn-new-dark" onClick={() => modalHandleClose("noPower")}>{t("CONTINUE")}</button>
                    </div>
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
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
            
            <Modal dialogClassName={`noInsideUnderstand_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["noInsideUnderstand"] === undefined ? false : modals["noInsideUnderstand"]}
                   onHide={() => modalHandleClose("noInsideUnderstand")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("modal_select_mount")}</p>
                    
                    {/*<br/>*/}
                    {/*<div className=" text_center">*/}
                    {/*    <button className=" btn btn-new-dark" onClick={() => modalHandleClose("noMount")}>{t("CONTINUE")}</button>*/}
                    {/*</div>*/}
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            <Modal dialogClassName={`noMount_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["noMount"] === undefined ? false : modals["noMount"]}
                   onHide={() => modalHandleClose("noMount")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("modal_select_mount")}</p>
                    
                    <br/>
                    <div className=" text_center">
                        <button className=" btn btn-new-dark" onClick={() => modalHandleClose("noMount")}>{t("CONTINUE")}</button>
                    </div>
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            <Modal dialogClassName={`learnMore_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["learnMore"] === undefined ? false : modals["learnMore"]}
                   onHide={() => modalHandleClose("learnMore")}>
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
            
            <Modal dialogClassName={`learnMore_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["widthLimit"] === undefined ? false : modals["widthLimit"]}
                   onHide={() => modalHandleClose("widthLimit")}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <p>{t("widthLimit")}</p>
                    <br/>
                    <div className="text_center">
                        <button className="btn btn-new-dark" onClick={() => modalHandleClose("widthLimit")}>{t("CONTINUE")}</button>
                    </div>
                </Modal.Body>
            </Modal>
            
            <Modal dialogClassName={`learnMore_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["onlyOneBase"] === undefined ? false : modals["onlyOneBase"]}
                   onHide={() => modalHandleClose("onlyOneBase")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("onlyOneBase")}</p>
                    
                    <br/>
                    {/*<div className="text_center dk2_btn">*/}
                    {/*    <button className="btn btn-new-dark" onClick={() => {*/}
                    {/*        setDkCurtainArr([]);*/}
                    {/*        modalHandleClose("onlyOneBase");*/}
                    {/*    }}>{t("CHANGE TO A NEW FABRIC")}</button>*/}
                    {/*    <button className="btn btn-new-dark" onClick={() => modalHandleClose("onlyOneBase")}>{t("CONTINUE WITH SAME FABRIC")}</button>*/}
                    {/*</div>*/}
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            <Modal dialogClassName={`learnMore_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["onlyOneBase"] === undefined ? false : modals["onlyOneDecor"]}
                   onHide={() => modalHandleClose("onlyOneDecor")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("onlyOneDecor")}</p>
                    
                    <br/>
                    <div className="text_center dk2_btn">
                        <button className="btn btn-new-dark" onClick={() => {
                            setDkCurtainArr([]);
                            modalHandleClose("onlyOneBase");
                        }}>{t("CHANGE TO A NEW FABRIC")}</button>
                        <button className="btn btn-new-dark" onClick={() => modalHandleClose("onlyOneBase")}>{t("CONTINUE WITH SAME FABRIC")}</button>
                    </div>
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            <Modal backdrop="static" keyboard={false}
                   dialogClassName={`measurementsHelp_modal dk_measurementsHelp_modal largeSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["measurementsHelp"] === undefined ? false : modals["measurementsHelp"]}
                   onHide={() => {
                       modalHandleClose("measurementsHelp");
                       setTimeout(() => {
                           setHelpMeasure("Inside");
                           setHelpMeasureLengthType("Floor");
                       }, 300);
                   }} scrollable={true}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p className="measurementsHelp_modal_title">{t("HOW TO MEASURE FOR DK CURTAIN")}</p>
                    <div className="help_options_container">
                        <ul className="help_options">
                            <li className={`help_option_item ${helpMeasure === "Inside" ? "help_option_item_on" : ""}`}
                                onClick={() => setHelpMeasure("Inside")}>{t("bold_Inside_mount")}</li>
                            <li className="help_option_item_separator"></li>
                            <li className={`help_option_item ${helpMeasure === "Wall" ? "help_option_item_on" : ""}`}
                                onClick={() => setHelpMeasure("Wall")}>{t("bold_Wall_mount")}</li>
                            <li className="help_option_item_separator"></li>
                            <li className={`help_option_item ${helpMeasure === "Ceiling" ? "help_option_item_on" : ""}`}
                                onClick={() => setHelpMeasure("Ceiling")}>{t("bold_Ceiling_mount")}</li>
                            <li className="help_option_item_separator"></li>
                            <li className={`help_option_item ${helpMeasure === "HiddenMoulding" ? "help_option_item_on" : ""}`}
                                onClick={() => setHelpMeasure("HiddenMoulding")}>{t("bold_Arc_mount")}</li>
                        </ul>
                    </div>
                    {helpMeasure === "Inside" &&
                        <div>
                            <div className="measurementsHelp_modal_img_section dk_measurementsHelp_modal_img_section">
                                {/*<p className="measurementsHelp_modal_img_title">{t("Inside Mount")}</p>*/}
                                <span>
                                    <object className="measurementsHelp_modal_img" type="image/svg+xml"
                                            data={pageLanguage === 'fa' ? require('../Images/drapery/dk/help_new_width_inside_3_fa.svg').default : require('../Images/drapery/dk/help_new_width_inside_3.svg').default}/>
                                </span>
                                <span>
                                    <object className="measurementsHelp_modal_img" type="image/svg+xml"
                                            data={pageLanguage === 'fa' ? require('../Images/drapery/dk/help_new_height_inside_3_fa.svg').default : require('../Images/drapery/dk/help_new_height_inside_3.svg').default}/>
                                </span>
                            </div>
                            <div className="accordion_help measurementsHelp_modal_help_section">
                                <div className="help_container">
                                    <div className="help_column help_left_column">
                                        <p className="help_column_header">{t("STEP 1: MEASURE WIDTH")}</p>
                                        <ul className="help_column_list">
                                            <li>{t("dk_modal_help_4")}</li>
                                            <li>{t("dk_modal_help_5")}</li>
                                        </ul>
                                    </div>
                                    
                                    <div className="help_column help_right_column">
                                        <p className="help_column_header">{t("STEP 2: MEASURE LENGTH")}</p>
                                        <ul className="help_column_list">
                                            <li>{t("modal_help_6")}</li>
                                            <li>{t("dk_modal_help_7")}</li>
                                        </ul>
                                    </div>
                                </div>
                                <br/>
                                <br/>
                                <div className="help_container">
                                    <div className="help_column help_right_column">
                                        <p className="help_column_header"/>
                                        <ul className="help_column_list">
                                            <li><b>{t("Note:&nbsp;")}</b>{t("dk_modal_help_8")}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {/*<br/>*/}
                    {/*<br/>*/}
                    {/*<br/>*/}
                    
                    {helpMeasure === "Wall" &&
                        <div>
                            <div className="measurementsHelp_modal_img_section dk_measurementsHelp_modal_img_section">
                                {/*<p className="measurementsHelp_modal_title">{t("HOW TO MEASURE FOR ZEBRA SHADES")}</p>*/}
                                {/*<p className="measurementsHelp_modal_img_title">{t("Outside Mount")}</p>*/}
                                <object className="measurementsHelp_modal_img help_img_margin_top" type="image/svg+xml"
                                        data={pageLanguage === 'fa' ? require('../Images/drapery/dk/new_dk_Help_wall_fa.svg').default : require('../Images/drapery/dk/new_dk_Help_wall.svg').default}/>
                            </div>
                            <div className="accordion_help measurementsHelp_modal_help_section">
                                <div className="help_container">
                                    <div className="help_column help_left_column">
                                        <p className="help_column_header">{t("TO DETERMINE PANEL HEIGHT")}</p>
                                        <ul className="help_column_list">
                                            <li><b>{t("Floor:&nbsp;")}</b>{t("dk_wall_modal_help_1")}</li>
                                            <li><b>{t("Sill/Apron:&nbsp;")}</b>{t("dk_wall_modal_help_2")}</li>
                                        </ul>
                                    </div>
                                    
                                    <div className="help_column help_right_column">
                                        <p className="help_column_header">{t("TO DETERMINE PANEL WIDTH")}</p>
                                        <ul className="help_column_list">
                                            <li>{t("dk_wall_modal_help_3")}</li>
                                        </ul>
                                    </div>
                                </div>
                                <br/>
                                <br/>
                                <div className="help_container">
                                    <div className="help_column help_right_column">
                                        <p className="help_column_header"/>
                                        <ul className="help_column_list">
                                            <li><b>{t("Note:&nbsp;")}</b>{t("dk_wall_modal_help_4")}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    
                    {helpMeasure === "Ceiling" &&
                        <div>
                            <br/>
                            <div className="help_options_container">
                                <ul className="help_options help_options_lengthType">
                                    <li className={`help_option_lengthType_item ${helpMeasureLengthType === "Floor" ? "help_option_lengthType_item_on" : ""}`}
                                        onClick={() => setHelpMeasureLengthType("Floor")}>{t("help_FLOOR")}</li>
                                    <li className={`help_option_lengthType_item ${helpMeasureLengthType === "Sill" ? "help_option_lengthType_item_on" : ""}`}
                                        onClick={() => setHelpMeasureLengthType("Sill")}>{t("help_SILL/APRON")}</li>
                                </ul>
                            </div>
                            <div className="measurementsHelp_modal_img_section dk_measurementsHelp_modal_img_section">
                                {/*<p className="measurementsHelp_modal_title">{t("HOW TO MEASURE FOR ZEBRA SHADES")}</p>*/}
                                {/*<p className="measurementsHelp_modal_img_title">{t("Outside Mount")}</p>*/}
                                {helpMeasureLengthType === "Sill" &&
                                    <span>
                                        <object className="measurementsHelp_modal_img" type="image/svg+xml"
                                                data={pageLanguage === 'fa' ? require('../Images/drapery/dk/help_new_ceiling_to_window_3_fa.svg').default : require('../Images/drapery/dk/help_new_ceiling_to_window_3.svg').default}/>
                                    </span>
                                }
                                {helpMeasureLengthType === "Floor" &&
                                    <span>
                                        <object className="measurementsHelp_modal_img" type="image/svg+xml"
                                                data={pageLanguage === 'fa' ? require('../Images/drapery/dk/help_new_ceiling_to_floor_3_fa.svg').default : require('../Images/drapery/dk/help_new_ceiling_to_floor_3.svg').default}/>
                                    </span>
                                }
                                <span>
                                    <object className="measurementsHelp_modal_img" type="image/svg+xml"
                                            data={pageLanguage === 'fa' ? require('../Images/drapery/dk/help_new_FrameSize.svg').default : require('../Images/drapery/dk/help_new_FrameSize.svg').default}/>
                                </span>
                            </div>
                            <div className="accordion_help measurementsHelp_modal_help_section">
                                <div className="help_container">
                                    <div className="help_column help_left_column">
                                        <p className="help_column_header">{t("TO DETERMINE PANEL HEIGHT")}</p>
                                        <ul className="help_column_list">
                                            {helpMeasureLengthType === "Floor" &&
                                                <li><b>{t("Floor:&nbsp;")}</b>{t("dk_ceiling_modal_help_1")}</li>
                                            }
                                            {helpMeasureLengthType === "Sill" &&
                                                <li><b>{t("Sill/Apron:&nbsp;")}</b>{t("dk_ceiling_modal_help_2")}</li>
                                            }
                                        </ul>
                                    </div>
                                    
                                    <div className="help_column help_right_column">
                                        <p className="help_column_header">{t("TO DETERMINE PANEL WIDTH")}</p>
                                        <ul className="help_column_list">
                                            <li>{t("dk_ceiling_modal_help_3")}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {helpMeasure === "HiddenMoulding" &&
                        <div>
                            <br/>
                            <div className="help_options_container">
                                <ul className="help_options help_options_lengthType">
                                    <li className={`help_option_lengthType_item ${helpMeasureLengthType === "Floor" ? "help_option_lengthType_item_on" : ""}`}
                                        onClick={() => setHelpMeasureLengthType("Floor")}>{t("help_FLOOR")}</li>
                                    <li className={`help_option_lengthType_item ${helpMeasureLengthType === "Sill" ? "help_option_lengthType_item_on" : ""}`}
                                        onClick={() => setHelpMeasureLengthType("Sill")}>{t("help_SILL/APRON")}</li>
                                </ul>
                            </div>
                            <div className="measurementsHelp_modal_img_section dk_measurementsHelp_modal_img_section">
                                {/*<p className="measurementsHelp_modal_title">{t("HOW TO MEASURE FOR ZEBRA SHADES")}</p>*/}
                                {/*<p className="measurementsHelp_modal_img_title">{t("Outside Mount")}</p>*/}
                                {helpMeasureLengthType === "Sill" &&
                                    <span>
                                        <object className="measurementsHelp_modal_img" type="image/svg+xml"
                                                data={pageLanguage === 'fa' ? require('../Images/drapery/dk/help_new_ceiling_to_window_3_arc_fa.svg').default : require('../Images/drapery/dk/help_new_ceiling_to_window_3_arc.svg').default}/>
                                    </span>
                                }
                                {helpMeasureLengthType === "Floor" &&
                                    <span>
                                        <object className="measurementsHelp_modal_img" type="image/svg+xml"
                                                data={pageLanguage === 'fa' ? require('../Images/drapery/dk/help_new_ceiling_to_floor_3_arc_fa.svg').default : require('../Images/drapery/dk/help_new_ceiling_to_floor_3_arc.svg').default}/>
                                    </span>
                                }
                                <span>
                                    <object className="measurementsHelp_modal_img" type="image/svg+xml"
                                            data={pageLanguage === 'fa' ? require('../Images/drapery/dk/help_new_FrameSize.svg').default : require('../Images/drapery/dk/help_new_FrameSize.svg').default}/>
                                </span>
                            </div>
                            <div className="accordion_help measurementsHelp_modal_help_section">
                                <div className="help_container">
                                    <div className="help_column help_left_column">
                                        <p className="help_column_header">{t("TO DETERMINE PANEL HEIGHT")}</p>
                                        <ul className="help_column_list">
                                            {helpMeasureLengthType === "Floor" &&
                                                <li><b>{t("Floor:&nbsp;")}</b>{t("dk_arc_modal_help_1")}</li>
                                            }
                                            {helpMeasureLengthType === "Sill" &&
                                                <li><b>{t("Sill/Apron:&nbsp;")}</b>{t("dk_arc_modal_help_2")}</li>
                                            }
                                        </ul>
                                    </div>
                                    
                                    <div className="help_column help_right_column">
                                        <p className="help_column_header">{t("TO DETERMINE PANEL WIDTH")}</p>
                                        <ul className="help_column_list">
                                            <li>{t("dk_arc_modal_help_3")}</li>
                                        </ul>
                                    </div>
                                </div>
                                <br/>
                                <br/>
                                <div className="help_container">
                                    <div className="help_column help_right_column">
                                        <p className="help_column_header"/>
                                        <ul className="help_column_list">
                                            <li><b>{t("Note:&nbsp;")}</b>{t("dk_arc_modal_help_4")}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <br/>
                    <div className="text_center">
                        <button className="btn btn-new-dark" onClick={() => {
                            modalHandleClose("measurementsHelp");
                            setTimeout(() => {
                                setHelpMeasure("Inside");
                                setHelpMeasureLengthType("Floor");
                            }, 300);
                        }}>{t("CONTINUE")}</button>
                    </div>
                </Modal.Body>
            </Modal>
            
            <Modal dialogClassName={`upload_modal uploadImg_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["uploadImg"] === undefined ? false : modals["uploadImg"]}
                   onHide={() => {
                       setSelectedFile(undefined);
                       setSelectedFileName("");
                       setEditedFileName("");
                       modalHandleClose("uploadImg");
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
                       modalHandleClose("uploadPdf");
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
                            let temp = JSON.parse(JSON.stringify(selectCustomValues));
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
                        }}>{t("CHANGE MEASUREMENTS")}
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
            
            <Modal keyboard={false} dialogClassName={`Zipcode_how_it_works customSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["Zipcode_how_it_works"] === undefined ? false : modals["Zipcode_how_it_works"]}
                   onHide={() => {
                       modalHandleClose("Zipcode_how_it_works");
                   }}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="zipcode_modal_title_container">
                        <h1 className="zipcode_modal_title">{t("zipcode_modal_text1")}</h1>
                    </div>
                    <div className="zipcode_modal_body">
                        <div className="zipcode_modal_item">
                            <div className="zipcode_modal_item_img_container">
                                <img src={require('../Images/public/zipcode_bag.png')} className="img-fluid" alt=""/>
                            </div>
                            <div className="zipcode_modal_item_title_container">
                                {t("zipcode_modal_text2")}
                            </div>
                            <div className="zipcode_modal_item_text_container">
                                {t("zipcode_modal_text3")}
                            </div>
                        </div>
                        <div className="zipcode_modal_item">
                            <div className="zipcode_modal_item_img_container">
                                <img src={require('../Images/public/zipcode_mark.png')} className="img-fluid" alt=""/>
                            </div>
                            <div className="zipcode_modal_item_title_container">
                                {t("zipcode_modal_text4")}
                            </div>
                            <div className="zipcode_modal_item_text_container">
                                {t("zipcode_modal_text5")}
                            </div>
                        </div>
                        <div className="zipcode_modal_item">
                            <div className="zipcode_modal_item_img_container">
                                <img src={require('../Images/public/zipcode_truck.png')} className="img-fluid" alt=""/>
                            </div>
                            <div className="zipcode_modal_item_title_container">
                                {t("zipcode_modal_text6")}
                            </div>
                            <div className="zipcode_modal_item_text_container">
                                {t("zipcode_modal_text7")}
                            </div>
                        </div>
                        <div className="zipcode_modal_item">
                            <div className="zipcode_modal_item_img_container">
                                <img src={require('../Images/public/zipcode_tools.png')} className="img-fluid" alt=""/>
                            </div>
                            <div className="zipcode_modal_item_title_container">
                                {t("zipcode_modal_text8")}
                            </div>
                            <div className="zipcode_modal_item_text_container">
                                {t("zipcode_modal_text9")}
                            </div>
                        </div>
                    </div>
                    <div className="zipcode_modal_footer">
                        <div className="zipcode_modal_item_text_container">{t("zipcode_modal_text10")}</div>
                    </div>
                    
                    {/*<br/>*/}
                    {/*<div className="text_center">*/}
                    {/*    <button className="btn btn-new-dark" onClick={() => modalHandleClose("Zipcode_how_it_works")}>{t("OK")}</button>*/}
                    {/*</div>*/}
                
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            <Modal backdrop="static" keyboard={false} dialogClassName={`warning_modal bigSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["heightDifferent"] === undefined ? false : modals["heightDifferent"]}
                   onHide={() => {
                       modalHandleClose("heightDifferent");
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
                            let temp = JSON.parse(JSON.stringify(selectCustomValues));
                            temp.height1 = [];
                            temp.height2 = [];
                            temp.height3 = [];
                            temp.CeilingToWindow1 = [];
                            temp.CeilingToWindow2 = [];
                            temp.CeilingToWindow3 = [];
                            temp.CeilingToFloor1 = [];
                            temp.CeilingToFloor2 = [];
                            temp.CeilingToFloor3 = [];
                            setSelectCustomValues(temp);
                            let temp2 = JSON.parse(JSON.stringify(stepSelectedOptions));
                            temp2.labels["3BIn"] = [];
                            temp2.values["3BIn"] = [];
                            temp2.labels["2D"] = [];
                            temp2.values["2D"] = [];
                            temp2.labels["2DFloor"] = [];
                            temp2.values["2DFloor"] = [];
                            setStepSelectedOptions(temp2);
                            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                            delete tempLabels["3BIn"];
                            delete tempLabels["2D"];
                            delete tempLabels["2DFloor"];
                            setStepSelectedLabel(tempLabels);
                        }}>{t("CHANGE MEASUREMENTS")}
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
                        setAddingLoading(false);
                        if (cartStateAgree) {
                            navigate("/" + pageLanguage);
                        }
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
                                    <DebounceInput debounceTimeout={1500} onKeyDown={() => setCartLoading(true)} type="text" placeholder={t("Window Description")}
                                                   className="form-control window_name" name="order_window_name"
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
                    <div className="bag_buttons_section_container">
                        <button className="btn add_to_cart" disabled={addingLoading || cartLoading} onClick={() => {
                            setAddingLoading(true);
                            addToCart();
                        }}>
                            {addingLoading ? t("ADDING...") : t("footer_Add To Cart")}
                        </button>
                        <button className="btn add_to_cart no_pointer">
                            {GetPrice(price, pageLanguage, t("TOMANS"))}
                        </button>
                        <button className="save_to_acc white_btn btn" onClick={() => {
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
                        }} disabled={savingLoading || cartLoading}>{savingLoading ? t("SAVING...") : t("footer_Save To")} {savingLoading ? "" : t("footer_My Account")}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DK2;