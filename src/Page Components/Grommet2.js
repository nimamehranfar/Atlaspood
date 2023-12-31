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

import {ReactComponent as MountInside} from '../Images/drapery/zebra/window-Inside.svg';
import {ReactComponent as MountOutside} from '../Images/drapery/zebra/window-Outside.svg';
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
import {CartUpdatedFalse, CartUpdatedTrue, HideLogin2Modal, HideLoginModal, LOGIN, LOGOUT, ShowLogin2Modal, ShowLoginModal} from "../Actions/types";
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
import {Capitalize, CapitalizeAllWords, convertToPersian, NumToFa, Uppercase} from "../Components/TextTransform";
import {DebounceInput} from "react-debounce-input";
import GetBasketZipcode from "../Components/GetBasketZipcode";
import {rooms} from "../Components/Static_Labels";
import OverlayContainer from "../Components/OverlayContainer";


const baseURLCats = "https://api.atlaspood.ir/WebsitePage/GetDetailByName";
const baseURLPageItem = "https://api.atlaspood.ir/WebsitePageItem/GetById";
const baseURLModel = "https://api.atlaspood.ir/SewingModel/GetById";
const baseURLFabrics = "https://api.atlaspood.ir/Sewing/GetModelFabric";
const baseURLWindowSize = "https://api.atlaspood.ir/Sewing/GetWindowSize";
const baseURLGetRail = "https://api.atlaspood.ir/Sewing/GetModelRail";
const baseURLPrice = "https://api.atlaspood.ir/Sewing/GetSewingOrderPrice";
const baseURLZipCode = "https://api.atlaspood.ir/Sewing/HasInstall";
const baseURLFreeShipping = "https://api.atlaspood.ir/WebsiteSetting/GetFreeShippingAmount";
const baseURGetProject = "https://api.atlaspood.ir/SewingOrder/GetById";
const baseURLGetCart = "https://api.atlaspood.ir/cart/GetAll";
const baseURLGetRemoteNames = "https://api.atlaspood.ir/cart/GetRemoteNames";
const baseURLUploadImg = "https://api.atlaspood.ir/SewingOrderAttachment/ImageUpload";
const baseURLUploadPdf = "https://api.atlaspood.ir/SewingOrderAttachment/PdfUpload";
const baseURLDeleteFile = "https://api.atlaspood.ir/SewingOrderAttachment/Delete";
const baseURLEditProject = "https://api.atlaspood.ir/SewingOrder/Edit";
const baseURLDeleteBasketProject = "https://api.atlaspood.ir/Cart/DeleteItem";
const baseURLAddSwatch = "https://api.atlaspood.ir/Cart/Add";
const baseURLFilterPattern = "https://api.atlaspood.ir/Sewing/GetModelPatternType";
const baseURLFilterType = "https://api.atlaspood.ir/Sewing/GetModelDesignType";
const baseURLFilterPrice = "https://api.atlaspood.ir/BaseType/GetPriceLevel";


function Grommet2({CatID, ModelID, PageType, ProjectId, EditIndex, PageItem, QueryString, Parameters, PageId}) {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const firstRender = useRef(true);
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
    const [rodsLoad, setRodsLoad] = useState(undefined);
    // const [rodsLoad2, setRodsLoad2] = useState(undefined);
    const [motorLoad, setMotorLoad] = useState(false);
    const [motorLoad2, setMotorLoad2] = useState(false);
    const [models, setModels] = useState([]);
    const [projectData, setProjectData] = useState({});
    const [model, setModel] = useState({});
    const [modelAccessories, setModelAccessories] = useState({});
    const [stepAccessories, setStepAccessories] = useState({});
    const [stepAccessoriesList, setStepAccessoriesList] = useState([]);
    const [trimAccessories, setTrimAccessories] = useState({});
    const [trimAccessoriesList, setTrimAccessoriesList] = useState([]);
    const [fabrics, setFabrics] = useState({});
    const [fabrics2, setFabrics2] = useState({});
    const [fabricsList, setFabricsList] = useState([]);
    const [rails, setRails] = useState([]);
    const [rods, setRods] = useState({});
    const [tracks, setTracks] = useState({});
    const [rodsList, setRodsList] = useState([]);
    const [rodsList2, setRodsList2] = useState([]);
    const [rodsList3, setRodsList3] = useState([]);
    const [rodsList4, setRodsList4] = useState([]);
    const [tracksList, setTracksList] = useState([]);
    const [tracksList2, setTracksList2] = useState([]);
    const [rodsColorList, setRodsColorList] = useState([]);
    const [defaultFabricPhoto, setDefaultFabricPhoto] = useState(null);
    const [defaultModelName, setDefaultModelName] = useState("");
    const [defaultModelNameFa, setDefaultModelNameFa] = useState("");
    const [defaultModelDesc, setDefaultModelDesc] = useState("");
    const [defaultModelDescFa, setDefaultModelDescFa] = useState("");
    const [price, setPrice] = useState(0);
    const [bagPrice, setBagPrice] = useState(0);
    const [fabricQty, setFabricQty] = useState(0);
    const [liningPrice, setLiningPrice] = useState(0);
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [freeShipPrice, setFreeShipPrice] = useState(0);
    const [show, setShow] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchShow, setSearchShow] = useState(false);
    const [measurementsNextStep, setMeasurementsNextStep] = useState("4");
    const [hardwareNextStep, setHardwareNextStep] = useState("9");
    const [controlTypeNextStep, setControlTypeNextStep] = useState("5");
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
    const [remoteNames, setRemoteNames] = useState([]);
    const [showRemoteName, setShowRemoteName] = useState(false);
    const [accordionActiveKey, setAccordionActiveKey] = useState("");
    const [roomLabelText, setRoomLabelText] = useState("");
    const [fabricSelected, setFabricSelected] = useState({
        selectedFabricId: 0, selectedTextEn: "", selectedTextFa: "", selectedDesignCode: "", selectedColorEn: "", selectedColorFa: "", selectedHasTrim: false, selectedPhoto: ""
    });
    const [fabricSelected2, setFabricSelected2] = useState({
        selectedFabricId: 0, selectedTextEn: "", selectedTextFa: "", selectedDesignCode: "", selectedColorEn: "", selectedColorFa: "", selectedHasTrim: false, selectedPhoto: ""
    });
    const [borderSelected, setBorderSelected] = useState({
        selectedFabricId: 0, selectedTextEn: "", selectedTextFa: "", selectedDesignCode: "", selectedColorEn: "", selectedColorFa: "", selectedHasTrim: false, selectedPhoto: ""
    });
    const [trimSelected, setTrimSelected] = useState({
        selectedFabricId: 0, selectedTextEn: "", selectedTextFa: "", selectedDesignCode: "", selectedColorEn: "", selectedColorFa: "", selectedHasTrim: false, selectedPhoto: ""
    });
    const [borderSelected2, setBorderSelected2] = useState({
        selectedFabricId: 0, selectedTextEn: "", selectedTextFa: "", selectedDesignCode: "", selectedColorEn: "", selectedColorFa: "", selectedHasTrim: false, selectedPhoto: ""
    });
    const [trimSelected2, setTrimSelected2] = useState({
        selectedFabricId: 0, selectedTextEn: "", selectedTextFa: "", selectedDesignCode: "", selectedColorEn: "", selectedColorFa: "", selectedHasTrim: false, selectedPhoto: ""
    });
    const [sheersSelected, setSheersSelected] = useState({
        selectedFabricId: 0, selectedTextEn: "", selectedTextFa: "", selectedColorEn: "", selectedColorFa: "", selectedHasTrim: false, selectedPhoto: ""
    });
    const [sheersSelected2, setSheersSelected2] = useState({
        selectedFabricId: 0, selectedTextEn: "", selectedTextFa: "", selectedColorEn: "", selectedColorFa: "", selectedHasTrim: false, selectedPhoto: ""
    });
    const [roomLabelSelect, setRoomLabelSelect] = useState({
        label: "",
        value: ""
    });
    const [mountTypeTemp, setMountTypeTemp] = useState({
        stepValue: "",
        id: "",
        cartValue: "",
        event: ""
    });
    const [curtainPosTemp, setCurtainPosTemp] = useState({
        stepValue: "",
        id: "",
        cartValue: "",
        event: ""
    });
    const [finishedLengthTemp, setFinishedLengthTemp] = useState({
        stepValue: "",
        id: "",
        cartValue: "",
        event: ""
    });
    const [hardwareSheerWarningTemp, setHardwareSheerWarningTemp] = useState({
        stepValue: "",
        id: "",
        cartValue: "",
        event: ""
    });
    const [hardwarePLWarningTemp, setHardwarePLWarningTemp] = useState({
        stepValue: "",
        id: "",
        cartValue: "",
        event: ""
    });
    const [panelSheerWarningTemp, setPanelSheerWarningTemp] = useState({
        stepValue: "",
        id: "",
        cartValue: "",
        event: ""
    });
    const [panelPLWarningTemp, setPanelPLWarningTemp] = useState({
        stepValue: "",
        id: "",
        cartValue: "",
        event: ""
    });
    const [roomLabelComplete, setRoomLabelComplete] = useState(false);
    const [stepSelectedValue, setStepSelectedValue] = useState({});
    const [hasTrim, setHasTrim] = useState(false);
    const [showLabels, setShowLabels] = useState(true);
    const [headerTruncated, setHeaderTruncated] = useState([]);
    const [extendedTitle, setExtendedTitle] = useState({
        "1": [],
        "2": [],
        "6": [],
        "8": [],
        "8A": [],
        "8B": [],
        "8C": [],
        "9": []
    });
    const [detailsShow, setDetailsShow] = useState(false);
    const [filtersShow, setFiltersShow] = useState(false);
    const [windowSize, setWindowSize] = useState("");
    const [windowSizeBool, setWindowSizeBool] = useState(false);
    const [stepSelectedLabel, setStepSelectedLabel] = useState({});
    const [modals, setModals] = useState([]);
    const [popoverImages, setPopoverImages] = useState([]);
    const [inputDifRef, setInputDifRef] = useState(undefined);
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
        "shadeMount": [],
        "RodWidth": [],
        "RodToBottom": []
    });
    const [width, setWidth] = useState(undefined);
    const [height, setHeight] = useState(undefined);
    const [depth, setDepth] = useState(undefined);
    const [mouldingHeight, setMouldingHeight] = useState(undefined);
    const [rodToBottom, setRodToBottom] = useState(undefined);
    const [rodToFloor, setRodToFloor] = useState(undefined);
    const [windowToFloor, setWindowToFloor] = useState(undefined);
    const [ceilingToWindow1, setCeilingToWindow1] = useState(undefined);
    const [ceilingToWindow2, setCeilingToWindow2] = useState(undefined);
    const [ceilingToWindow3, setCeilingToWindow3] = useState(undefined);
    const [ceilingToFloor, setCeilingToFloor] = useState(undefined);
    const [ceilingToFloor1, setCeilingToFloor1] = useState(undefined);
    const [ceilingToFloor2, setCeilingToFloor2] = useState(undefined);
    const [ceilingToFloor3, setCeilingToFloor3] = useState(undefined);
    const [width3C, setWidth3C] = useState(undefined);
    const [rodWidth, setRodWidth] = useState(undefined);
    const [left, setLeft] = useState(undefined);
    const [right, setRight] = useState(undefined);
    const [height3E, setHeight3E] = useState(undefined);
    const [mount, setMount] = useState(undefined);
    const [anyMeasurements, setAnyMeasurements] = useState(false);
    const [widthCart, setWidthCart] = useState(undefined);
    const [heightCart, setHeightCart] = useState(undefined);
    
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
    
    const [depSet, setDepSet] = useState(new Set(['1', '3', '4', '5', '61', '7', '8', '1001', '1002']));
    
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
    
    const [isClearAll, setIsClearAll] = useState(false);
    
    const [step1, setStep1] = useState("");
    const [step1Check, setStep1Check] = useState("");
    const [step1Border, setStep1Border] = useState("");
    const [step1BorderRadio, setStep1BorderRadio] = useState("");
    const [step1Trim, setStep1Trim] = useState("");
    const [step2Check, setStep2Check] = useState("");
    const [step2Border, setStep2Border] = useState("");
    const [step2BorderRadio, setStep2BorderRadio] = useState("");
    const [step2Trim, setStep2Trim] = useState("");
    const [step2, setStep2] = useState("");
    const [step2A, setStep2A] = useState("");
    const [step2B, setStep2B] = useState("");
    const [step3, setStep3] = useState("");
    const [step31, setStep31] = useState("");
    const [step3A0, setStep3A0] = useState("");
    const [step3A, setStep3A] = useState("");
    const [step3B, setStep3B] = useState("");
    const [step3ARod, setStep3ARod] = useState("");
    const [step3B1, setStep3B1] = useState("");
    const [step3ARod1, setStep3ARod1] = useState("");
    const [step4, setStep4] = useState("");
    const [step5, setStep5] = useState("");
    const [step6, setStep6] = useState("Same Style For All Curtains");
    const [step61, setStep61] = useState("");
    const [step6A, setStep6A] = useState("");
    const [step6B, setStep6B] = useState("");
    const [step6C, setStep6C] = useState("");
    const [step6BHead, setStep6BHead] = useState("Rod");
    const [step6CHead, setStep6CHead] = useState("Rod");
    const [step7, setStep7] = useState("");
    const [step8, setStep8] = useState("");
    const [step81, setStep81] = useState("");
    const [step82, setStep82] = useState("");
    const [step83, setStep83] = useState("");
    const [step84, setStep84] = useState("");
    const [zipcodeChecked, setZipcodeChecked] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [zipcodeButton, setZipcodeButton] = useState(false);
    const [hasZipcode, setHasZipcode] = useState(null);
    const [hasInstall, setHasInstall] = useState(null);
    const [installPrice, setInstallPrice] = useState(-1);
    const [transportPrice, setTransportPrice] = useState(-1);
    const [remoteName, setRemoteName] = useState("");
    const [selectedValanceColor1, setSelectedValanceColor1] = useState([]);
    const [selectedValanceColor2, setSelectedValanceColor2] = useState([]);
    const [selectedRoomLabel, setSelectedRoomLabel] = useState([]);
    
    const [is8BMotor, setIs8BMotor] = useState(false);
    const [is8CMotor, setIs8CMotor] = useState(false);
    
    const [motorErr1, setMotorErr1] = useState(false);
    const [step3BErr1, setStep3BErr1] = useState(false);
    const [step3ARodErr1, setStep3ARodErr1] = useState(false);
    const [mountErr1, setMountErr1] = useState(false);
    const [mountErr2, setMountErr2] = useState(false);
    
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
    
    const [helpMeasure, setHelpMeasure] = useState("hasRod");
    const [customAcc, setCustomAcc] = useState([]);
    const [customAccActive, setCustomAccActive] = useState({});
    
    const [accessoriesDesign, setAccessoriesDesign] = useState({
        "isPlus": undefined,
        "SewingAccessoryValue": "",
        "SewingAccessoryId": undefined,
        "SewingModelAccessoryId": undefined,
        "DesignCode": undefined,
        "DesignNameEn": undefined,
        "DesignNameFa": undefined,
        "ColorNameEn": undefined,
        "ColorNameFa": undefined,
        "qty": undefined
    });
    
    const [tiebackDrapery, setTiebackDrapery] = useState({
        "isPlus": undefined,
        "HandCurtainId": undefined,
        "HandCurtainNum": 0
    });
    const [tiebackDraperyQty, setTiebackDraperyQty] = useState(0);
    
    const [tiebackSheer, setTiebackSheer] = useState({
        "isPlus": undefined,
        "HandCurtainId": undefined,
        "HandCurtainNum": 0
    });
    const [tiebackSheerQty, setTiebackSheerQty] = useState(0);
    
    const getFabrics = () => {
        axios.get(baseURLFabrics, {
            params: {
                modelId: modelID
            }
        }).then((response) => {
            let tempFabrics = {};
            let tempFabrics2 = {};
            response.data.forEach(obj => {
                obj["ShowMore"] = false;
                if (obj["FabricGroupId"] === "100101") {
                    if (tempFabrics[obj["DesignEnName"]] === "" || tempFabrics[obj["DesignEnName"]] === undefined || tempFabrics[obj["DesignEnName"]] === null || tempFabrics[obj["DesignEnName"]] === [])
                        tempFabrics[obj["DesignEnName"]] = [];
                    tempFabrics[obj["DesignEnName"]].push(obj);
                } else if (obj["FabricGroupId"] === "100102") {
                    if (tempFabrics2[obj["DesignEnName"]] === "" || tempFabrics2[obj["DesignEnName"]] === undefined || tempFabrics2[obj["DesignEnName"]] === null || tempFabrics2[obj["DesignEnName"]] === [])
                        tempFabrics2[obj["DesignEnName"]] = [];
                    tempFabrics2[obj["DesignEnName"]].push(obj);
                }
            });
            setFabrics(tempFabrics);
            setFabrics2(tempFabrics2);
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
    
    function getRails(width) {
        let params = {};
        params["modelId"] = modelID;
        if (width) {
            params["width"] = width;
        }
        axios.get(baseURLGetRail, {
            params: params
        }).then((response) => {
            let temp = {};
            let temp2 = {};
            let temp3 = {};
            response.data.forEach(obj => {
                if (obj["RailCategoryId"] === 5303) {
                    if (temp[obj["DesignCode"]] === "" || temp[obj["DesignCode"]] === undefined || temp[obj["DesignCode"]] === null || temp[obj["DesignCode"]] === [])
                        temp[obj["DesignCode"]] = [];
                    temp[obj["DesignCode"]].push(obj);
                } else if (obj["RailCategoryId"] === 5301 || obj["RailCategoryId"] === 5302) {
                    if (temp2[obj["DesignCode"]] === "" || temp2[obj["DesignCode"]] === undefined || temp2[obj["DesignCode"]] === null || temp2[obj["DesignCode"]] === [])
                        temp2[obj["DesignCode"]] = [];
                    temp2[obj["DesignCode"]].push(obj);
                }
            });
            setRods(temp);
            setTracks(temp2);
            setRails(response.data || []);
        }).catch(err => {
            console.log(err);
            setRails([]);
            if (rodsLoad) {
                setRodsLoad(false);
            }
        });
    }
    
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
                    let tempFabrics2 = {};
                    response.data.forEach(obj => {
                        obj["ShowMore"] = false;
                        if (obj["FabricGroupId"] === "100101") {
                            if (tempFabrics[obj["DesignEnName"]] === "" || tempFabrics[obj["DesignEnName"]] === undefined || tempFabrics[obj["DesignEnName"]] === null || tempFabrics[obj["DesignEnName"]] === [])
                                tempFabrics[obj["DesignEnName"]] = [];
                            tempFabrics[obj["DesignEnName"]].push(obj);
                        } else if (obj["FabricGroupId"] === "100102") {
                            if (tempFabrics2[obj["DesignEnName"]] === "" || tempFabrics2[obj["DesignEnName"]] === undefined || tempFabrics2[obj["DesignEnName"]] === null || tempFabrics2[obj["DesignEnName"]] === [])
                                tempFabrics2[obj["DesignEnName"]] = [];
                            tempFabrics2[obj["DesignEnName"]].push(obj);
                        }
                    });
                    setFabrics(tempFabrics);
                    setFabrics2(tempFabrics2);
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
            let DesignName = convertToPersian(fabrics[key][0]["DesignName"]);
            let DesignEnName = fabrics[key][0]["DesignEnName"];
            let HasTrim = fabrics[key][0]["CanHasTrim"];
            let HasBorder = fabrics[key][0]["CanHasBorder"];
            let DesignCode = fabrics[key][0]["DesignCode"];
            let SamplePrice = fabrics[key][0]["SamplePrice"];
            
            const fabric = [];
            const fabric1 = [];
            for (let j = 0; j < fabrics[key].length; j++) {
                let FabricId = fabrics[key][j].FabricId;
                // console.log(fabrics,key);
                let PhotoPath = "";
                let PhotoPath2 = "";
                fabrics[key][j].FabricPhotos.forEach(obj => {
                    if (obj.PhotoTypeId === 4702) PhotoPath = obj.PhotoUrl;
                    if (obj.PhotoTypeId === 4709) PhotoPath2 = obj.PhotoUrl;
                });
                
                let FabricOnModelPhotoUrl = fabrics[key][j].FabricOnModelPhotoUrl;
                let DesignRaportLength = fabrics[key][j].DesignRaportLength;
                let DesignRaportWidth = fabrics[key][j].DesignRaportWidth;
                let PolyesterPercent = fabrics[key][j].PolyesterPercent;
                let ViscosePercent = fabrics[key][j].ViscosePercent;
                let NylonPercent = fabrics[key][j].NylonPercent;
                let ColorName = convertToPersian(fabrics[key][j].ColorName);
                let ColorEnName = fabrics[key][j].ColorEnName;
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
                // console.log(pageLanguage1,location.pathname);
                
                fabric.push(<div className={`radio_group ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`} key={"fabric" + key + j}>
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
                                   temp.selectedDesignCode = DesignCode;
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
                            <img className={`img-fluid ${`${FabricId}` === step1 ? "img-fluid_checked" : ""}`} src={`https://api.atlaspood.ir/${PhotoPath2}`} alt=""/>
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
                            }} disabled={SwatchId === -1}>{HasSwatchId ? (pageLanguage1 === 'en' ? "SWATCH IN CART" : "نمونه در سبد") : (pageLanguage1 === 'en' ? "ORDER" + " SWATCH" : "سفارش نمونه")}</button>
                </div>);
                
                fabric1.push(
                    <li className="fabric_design_border_list_item" key={"border" + key + j}>
                        <OverlayContainer classNames="Accessories_List_item_color"
                                          placement="middle"
                                          children={
                                              <div className={`radio_group ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`}>
                                                  <label>
                                                      <input className="radio" type="radio" outline="true"
                                                             onChange={e => {
                                                                 let temp = JSON.parse(JSON.stringify(borderSelected));
                                                                 temp.selectedFabricId = FabricId;
                                                                 temp.selectedTextEn = DesignEnName;
                                                                 temp.selectedTextFa = DesignName;
                                                                 temp.selectedDesignCode = DesignCode;
                                                                 temp.selectedColorEn = ColorEnName;
                                                                 temp.selectedColorFa = ColorName;
                                                                 setBorderSelected(temp);
                                                             }} name="border-trim"
                                                             model-id={modelID} value={FabricId} checked={`${FabricId}` === step1Border}
                                                             ref={ref => (inputs.current[`border-trim${FabricId}`] = ref)}/>
                                                      <div className="frame_img">
                                                          <img className={`img-fluid ${`${FabricId}` === step1Border ? "img-fluid_checked" : ""}`} src={`https://api.atlaspood.ir/${PhotoPath}`} alt=""/>
                                                      </div>
                                                  </label>
                                              </div>}
                                          component={
                                              <div className="Accessories_List_item_color_container">
                                                  <p className="Accessories_List_item_color_text">{pageLanguage1 === 'en' ? ColorEnName : ColorName}</p>
                                              </div>
                                          }/>
                    </li>);
            }
            
            fabricList.push(
                <React.Fragment key={"fabric" + key}>
                    <div className={`material_detail ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`}>
                        <div className={`material_traits ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`}>
                            <hr/>
                            <span><p>{pageLanguage1 === 'en' ? "DESIGN NAME" : "نام طرح"}: {pageLanguage1 === 'en' ? DesignEnName : DesignName}</p><span className="fabric_seperator">&nbsp;|&nbsp;</span><p>{pageLanguage1 === 'en' ? "FROM" : "شروع از"}: {GetPrice(SamplePrice, pageLanguage1, pageLanguage1 === "en" ? "Tomans" : "تومان")}</p></span>
                        </div>
                        {fabric}
                    </div>
                    {(HasTrim || HasBorder) &&
                        <div className={step1Check === `${DesignCode}` ? "fabric_design_checkbox_container width_max checkbox_style checkbox_style_inline active" : "fabric_design_checkbox_container width_max checkbox_style checkbox_style_inline"}>
                            <input type="checkbox" name="step1Check" checked={step1Check === `${DesignCode}`}
                                   onChange={(e) => {
                                       if (step1 !== "" && fabrics[DesignEnName].some(obj => obj["FabricId"] === step1)) {
                                           if (e.target.checked) {
                                               setStep1Check(`${DesignCode}`);
                                           } else {
                                               setStep1Check("");
                                           }
                                       } else {
                                           setStep1Check("");
                                           modalHandleShow("FabricDesignNotSelected");
                                       }
                                   }} id={`${DesignCode}`} ref={ref => (inputs.current[`trim-${DesignCode}`] = ref)}/>
                            <label htmlFor={`${DesignCode}`} className="checkbox_label">
                                <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')}
                                     alt=""/>
                                <span className="checkbox_text">
                                        {HasTrim && HasBorder ? (pageLanguage1 === 'en' ? "Add a Decorative Border / Trim" : "یک حاشیه / برش تزئینی اضافه کنید") : (HasTrim ? (pageLanguage1 === 'en' ? "Add a Trim" : "یک برش اضافه کنید") : (HasBorder ? (pageLanguage1 === 'en' ? "Add a Decorative Border" : "یک حاشیه تزئینی اضافه کنید") : ""))}
                                    </span>
                            </label>
                        </div>
                    }
                    <div className={step1Check === `${DesignCode}` ? "fabric_design_trim_border_container active" : "fabric_design_trim_border_container"}>
                        <div>
                            <h1 className="fabric_design_trim_border_title">{HasTrim && HasBorder ? (pageLanguage1 === 'en' ? "Select your Decorative Border / Trim Material" : "") : (HasTrim ? (pageLanguage1 === 'en' ? "Select your Trim Material" : "") : (HasBorder ? (pageLanguage1 === 'en' ? "Select your Decorative Border" : "") : ""))}</h1>
                            {HasBorder &&
                                <div className="fabric_design_border_container">
                                    <h2 className="fabric_design_trim_border_title2">{pageLanguage1 === 'en' ? "DECORATIVE BORDER" : "حاشیه تزئینی"}: {pageLanguage1 === 'en' ? DesignEnName : DesignName}</h2>
                                    <ul className="fabric_design_border_list">
                                        {fabric1}
                                    </ul>
                                    {step1Border !== "" &&
                                        <div className="fabric_design_border_checkbox_container">
                                            <h3 className="fabric_design_trim_border_title3">{pageLanguage1 === 'en' ? "Select a border position:" : "محل نصب حاشیه را مشخص کنید:"}</h3>
                                            <div className="box100 radio_style">
                                                <input className={step1BorderRadio === "10cm leading edge" ? "radio radio_checked" : "radio"} type="radio" text={t("10cm leading edge")} value="1" name="step1bordercheck" id="border1"
                                                       checked={step1BorderRadio === "10cm leading edge"}
                                                       onChange={e => {
                                                           setStep1BorderRadio("10cm leading edge");
                                                           // setCart("borderPosition", "10cm leading edge");
                                                       }} ref={ref => (inputs.current["border1"] = ref)}/>
                                                <label htmlFor="border1">{t("10cm leading edge")}</label>
                                            </div>
                                            <div className="box100 radio_style">
                                                <input className={step1BorderRadio === "60cm bottom border" ? "radio radio_checked" : "radio"} type="radio" text={t("60cm bottom border")} value="2" name="step1bordercheck" id="border2"
                                                       checked={step1BorderRadio === "60cm bottom border"}
                                                       onChange={e => {
                                                           setStep1BorderRadio("60cm bottom border");
                                                           // setCart("borderPosition", "60cm bottom border");
                                                       }} ref={ref => (inputs.current["border2"] = ref)}/>
                                                <label htmlFor="border2">{t("60cm bottom border")}</label>
                                            </div>
                                            <div className="box100 radio_style">
                                                <input className={step1BorderRadio === "10cm leading edge and 60cm bottom border" ? "radio radio_checked" : "radio"} type="radio" text={t("10cm leading edge and 60cm bottom border")} value="3" name="step1bordercheck" id="border3"
                                                       checked={step1BorderRadio === "10cm leading edge and 60cm bottom border"}
                                                       onChange={e => {
                                                           setStep1BorderRadio("10cm leading edge and 60cm bottom border");
                                                           // setCart("borderPosition", "10cm leading edge and 60cm bottom border");
                                                       }} ref={ref => (inputs.current["border3"] = ref)}/>
                                                <label htmlFor="border3">{t("10cm leading edge and 60cm bottom border")}</label>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }
                            {HasTrim &&
                                <>
                                    {Object.keys(trimAccessories).map((key, index) => {
                                        return (
                                            <div className="fabric_design_border_container" key={"trim" + key}>
                                                <h2 className="fabric_design_trim_border_title2">{pageLanguage1 === 'en' ? "DECORATIVE TRIM" : "برش تزئینی"}: {pageLanguage1 === 'en' ? Uppercase(trimAccessories[key][0]["DesignENName"]) : convertToPersian(trimAccessories[key][0]["DesignName"])}</h2>
                                                <ul className="fabric_design_border_list">
                                                    {trimAccessories[key].map((el, i) => {
                                                        let FabricId = el["DetailId"];
                                                        let DesignName = convertToPersian(el["DesignName"]);
                                                        let DesignEnName = el["DesignENName"];
                                                        let ColorName = convertToPersian(el["ColorName"]);
                                                        let ColorEnName = el["ColorENName"];
                                                        let PhotoPath = "";
                                                        el["Photos"].forEach(obj => {
                                                            if (obj.PhotoTypeId === 4702) PhotoPath = obj.PhotoUrl;
                                                        });
                                                        return (
                                                            <li className="fabric_design_border_list_item" key={"trim" + key + i}>
                                                                <OverlayContainer classNames="Accessories_List_item_color"
                                                                                  placement="middle"
                                                                                  children={
                                                                                      <div className={`radio_group ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`}>
                                                                                          <label>
                                                                                              {/*<ReactTooltip id={"fabric" + key + j} place="top" type="light" effect="float"/>*/}
                                                                                              <input className="radio" type="radio" outline="true"
                                                                                                     onChange={e => {
                                                                                                         let temp = JSON.parse(JSON.stringify(trimSelected));
                                                                                                         temp.selectedFabricId = FabricId;
                                                                                                         temp.selectedTextEn = DesignEnName;
                                                                                                         temp.selectedTextFa = DesignName;
                                                                                                         temp.selectedDesignCode = DesignCode;
                                                                                                         temp.selectedColorEn = ColorEnName;
                                                                                                         temp.selectedColorFa = ColorName;
                                                                                                         setTrimSelected(temp);
                                                                                                     }} name="border-trim"
                                                                                                     model-id={modelID} value={FabricId} checked={`${FabricId}` === step1Trim}
                                                                                                     ref={ref => (inputs.current[`border-trim${FabricId}`] = ref)}/>
                                                                                              <div className="frame_img">
                                                                                                  <img className={`img-fluid ${`${FabricId}` === step1Trim ? "img-fluid_checked" : ""}`} src={`https://api.atlaspood.ir/${PhotoPath}`} alt=""/>
                                                                                              </div>
                                                                                          </label>
                                                                                      </div>}
                                                                                  component={
                                                                                      <div className="Accessories_List_item_color_container">
                                                                                          <p className="Accessories_List_item_color_text">{pageLanguage1 === 'en' ? ColorEnName : ColorName}</p>
                                                                                      </div>
                                                                                  }/>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        )
                                    })}
                                </>
                            }
                        </div>
                    </div>
                </React.Fragment>);
            
        });
        setFabricsList(fabricList);
        // console.log(fabricList)
    }
    
    function renderStepAccessories() {
        const tempList = [];
        let pageLanguage1 = location.pathname.split('').slice(1, 3).join('');
        let temp2 = JSON.parse(JSON.stringify(customAccActive));
        let params = parameters === undefined || parameters === null || parameters === "undefined" || parameters === "null" || parameters === "" ? "{}" : JSON.parse(JSON.stringify(parameters));
        
        let promiseArr = [];
        Object.keys(stepAccessories).forEach((key, index) => {
            promiseArr[index] = new Promise((resolve, reject) => {
                let temp = [];
                let PhotoPath = "";
                let DesignENName = stepAccessories[key][0]["DesignENName"];
                let DesignName = stepAccessories[key][0]["DesignName"];
                
                let promiseArr2 = [];
                stepAccessories[key].forEach((obj, index) => {
                    if (obj["DetailId"] && obj["DetailId"] !== "" && obj["SewingAccessoryDetailId"] && obj["SewingAccessoryId"] && obj["ColorHtmlCode"]) {
                        promiseArr2[index] = new Promise((resolve, reject) => {
                            let tempColor = obj["ColorHtmlCode"] !== "" ? obj["ColorHtmlCode"] : "#e2e2e2";
                            let ColorENName = obj["ColorENName"];
                            let ColorName = obj["ColorName"];
                            let DetailId = obj["DetailId"];
                            let SewingModelAccessoryId = obj["SewingModelAccessoryId"];
                            let SewingAccessoryId = obj["SewingAccessoryId"];
                            let colorSelected = !!(temp2[key] && temp2[key]["SewingAccessoryValue"] === DetailId);
                            if (colorSelected) {
                                if (obj["Photos"] && obj["Photos"].length)
                                    obj["Photos"].forEach(obj => {
                                        if (obj["PhotoTypeId"] === 4702)
                                            PhotoPath = obj["PhotoUrl"];
                                    });
                            }
                            let fabricOrderSelected = params["AccColors"] && params["AccColors"][DetailId] && (params["AccColors"][DetailId]["order"] || params["AccColors"][DetailId]["order"] === 0) ? params["AccColors"][DetailId]["order"] : -1;
                            
                            let pushIndex = 0;
                            if (fabricOrderSelected !== -1 && !temp[fabricOrderSelected]) {
                                pushIndex = fabricOrderSelected;
                            } else if (fabricOrderSelected !== -1 && temp[fabricOrderSelected]) {
                                temp[temp.length] = JSON.parse(JSON.stringify(temp[fabricOrderSelected]));
                                pushIndex = fabricOrderSelected;
                            } else {
                                pushIndex = temp.length;
                            }
                            
                            temp[pushIndex] =
                                <li className={colorSelected ? "Accessories_List_item_colors_list_item colorSelected" : "Accessories_List_item_colors_list_item"} key={index}
                                    onClick={() => setAccessoriesDesign({
                                        "isPlus": undefined,
                                        "SewingAccessoryValue": DetailId,
                                        "SewingAccessoryId": SewingAccessoryId,
                                        "SewingModelAccessoryId": SewingModelAccessoryId,
                                        "DesignCode": key,
                                        "DesignNameEn": DesignENName,
                                        "DesignNameFa": DesignName,
                                        "ColorNameEn": ColorENName,
                                        "ColorNameFa": ColorName,
                                        "qty": undefined
                                    })}>
                                    <OverlayContainer classNames="Accessories_List_item_color"
                                                      placement="middle"
                                                      children={<div className="Accessories_List_item_colors_list_item_overlay" style={{backgroundColor: tempColor}}/>}
                                                      component={
                                                          <div className="Accessories_List_item_color_container">
                                                              <p className="Accessories_List_item_color_text">{pageLanguage1 === 'en' ? ColorENName : ColorName}</p>
                                                          </div>
                                                      }/>
                                </li>
                            ;
                            resolve();
                        });
                    } else if (obj["Photos"] && obj["Photos"].length) {
                        obj["Photos"].forEach(obj => {
                            if (obj["PhotoTypeId"] === 4702)
                                PhotoPath = obj["PhotoUrl"];
                        });
                    }
                });
                
                Promise.all(promiseArr2).then(() => {
                    let obj = stepAccessories[key][0];
                    let DesignCode = key;
                    let DetailId = temp2[key] ? temp2[key]["SewingAccessoryValue"] : obj["DetailId"];
                    let Price = obj["Price"];
                    
                    let designOrderSelected = params["Designs"] && params["Designs"][DesignCode] && (params["Designs"][DesignCode]["order"] && params["Designs"][DesignCode]["order"] >= 0) ? params["Designs"][DesignCode]["order"] : -1;
                    
                    let pushIndex = 0;
                    if (designOrderSelected !== -1 && !tempList[designOrderSelected]) {
                        pushIndex = designOrderSelected;
                    } else if (designOrderSelected !== -1 && tempList[designOrderSelected]) {
                        tempList[tempList.length] = JSON.parse(JSON.stringify(tempList[designOrderSelected]));
                        pushIndex = designOrderSelected;
                    } else {
                        let index = tempList.findIndex(Object.is.bind(null, undefined));
                        pushIndex = index === -1 ? tempList.length : index;
                    }
                    
                    tempList[pushIndex] =
                        <li className="Accessories_List_item" key={index}>
                            <div className="Accessories_List_item_image">
                                <img src={`https://api.atlaspood.ir/${PhotoPath}`} className="img-fluid" alt=""/>
                            </div>
                            <div className="Accessories_List_item_desc">
                                <h1 className="Accessories_List_item_title">{pageLanguage1 === 'en' ? DesignENName : DesignName}</h1>
                                <h2 className="Accessories_List_item_price">{GetPrice(Price, pageLanguage1, t("TOMANS"))}</h2>
                                <div className="Accessories_List_item_colors">
                                    <ul className="Accessories_List_item_colors_list">
                                        {temp}
                                    </ul>
                                </div>
                            </div>
                            <div className="Accessories_List_item_qty">
                                <div className="qty_numbers">
                                    <button type="text" className="qty_minus" onClick={() => setAccessoriesDesign({
                                        "isPlus": false,
                                        "SewingAccessoryValue": undefined,
                                        "SewingAccessoryId": undefined,
                                        "SewingModelAccessoryId": undefined,
                                        "DesignCode": key,
                                        "DesignNameEn": undefined,
                                        "DesignNameFa": undefined,
                                        "ColorNameEn": undefined,
                                        "ColorNameFa": undefined,
                                        "qty": undefined
                                    })}><img src={require('../Images/public/minus.svg').default} alt="" className="qty_math_icon"/></button>
                                    <input type="text" className="qty_num"
                                           value={getAccValue(customAcc, "SewingAccessoryValue", DetailId, pageLanguage)}
                                           onChange={(e) => setAccessoriesDesign({
                                               "isPlus": undefined,
                                               "SewingAccessoryValue": undefined,
                                               "SewingAccessoryId": undefined,
                                               "SewingModelAccessoryId": undefined,
                                               "DesignCode": key,
                                               "DesignNameEn": undefined,
                                               "DesignNameFa": undefined,
                                               "ColorNameEn": undefined,
                                               "ColorNameFa": undefined,
                                               "qty": e.target.value
                                           })}
                                           readOnly/>
                                    <button type="text" className="qty_plus" onClick={() => setAccessoriesDesign({
                                        "isPlus": true,
                                        "SewingAccessoryValue": undefined,
                                        "SewingAccessoryId": undefined,
                                        "SewingModelAccessoryId": undefined,
                                        "DesignCode": key,
                                        "DesignNameEn": undefined,
                                        "DesignNameFa": undefined,
                                        "ColorNameEn": undefined,
                                        "ColorNameFa": undefined,
                                        "qty": undefined
                                    })}><img src={require('../Images/public/plus.svg').default} alt="" className="qty_math_icon"/></button>
                                </div>
                            </div>
                        </li>
                    ;
                    resolve();
                    
                });
            });
        });
        
        Promise.all(promiseArr).then(() => {
            setStepAccessoriesList(tempList);
        });
    }
    
    function getAccValue(array, searchRef, id, lang) {
        let qty = 0;
        
        let tempObj = {};
        tempObj = array.filter(obj => {
            return obj[searchRef] === id
        })[0] || tempObj;
        
        if (Object.keys(tempObj).length > 0) {
            qty = tempObj["Qty"] ? tempObj["Qty"] : 0;
        }
        // console.log(tempObj,id,array)
        if (lang === "fa") {
            return NumberToPersianWord.convertEnToPe(`${qty}`)
        } else {
            return qty;
        }
    }
    
    function renderRods() {
        const rodList = [];
        const rodList2 = [];
        const rodList3 = [];
        const rodList4 = [];
        let pageLanguage1 = location.pathname.split('').slice(1, 3).join('');
        
        let promiseArr = [];
        let promiseArr2 = [];
        Object.keys(rods).forEach((key, index) => {
            promiseArr[index] = new Promise((resolve, reject) => {
                let obj = rods[key][0] || {};
                let DesignName = convertToPersian(obj["DesignName"]);
                let DesignEnName = obj["DesignENName"];
                let RailId = obj["RailId"];
                let Price = obj["Price"];
                let PhotoObj = {};
                PhotoObj = obj["Photos"].filter(obj => {
                    return obj["PhotoTypeId"] === 4701
                })[0] || PhotoObj;
                let PhotoPath = PhotoObj["PhotoUrl"] || "";
                
                rodList.push(<div className="box33 radio_style" key={index}>
                    <img
                        src={`https://api.atlaspood.ir/${PhotoPath}`} className="img-fluid height_auto" alt=""/>
                    <input className="radio" type="radio" text={pageLanguage1 === 'fa' ? DesignName : DesignEnName} value={index} name="step81" ref-num={"81"} id={"81" + index}
                           checked={step81 === `${RailId}`}
                           onChange={e => {
                               setStep81(`${RailId}`);
                           }} ref={ref => (inputs.current["81" + index] = ref)}/>
                    <label htmlFor={"81" + index}>{pageLanguage1 === 'fa' ? DesignName : DesignEnName}
                        <br/><p className="surcharge_price">{Price > 0 ? ((pageLanguage1 === "en" ? "Add " : "+ ") + GetPrice(Price, pageLanguage1, pageLanguage1 === "en" ? "Tomans" : "تومان")) : (pageLanguage1 === "en" ? "Surcharge Applies" : "+ شامل هزینه")}</p>
                    </label>
                </div>);
                resolve();
            });
        });
        
        Promise.all(promiseArr).then(() => {
            setRodsList(rodList);
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
        // console.log(fabricObj);
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
        // console.log(extendedTitle[stepRef]);
        
        return (
            <div className={`w-100 h-100 steps_header ${isCurrentEventKey ? 'steps_header_active' : ''}`}
                 onClick={decoratedOnClick} ref={ref => (stepHeaders.current[stepRef] = ref)}>
                <div className="steps_header_num_container">
                    <div className="steps_header_num">{stepNum}</div>
                </div>
                <div className="steps_header_title_container">
                    <div className={"steps_header_title " + stepTitle2 ? "steps_header_title_max_content" : ""} type-of-step={type}
                         cart-custom-text={cartCustomText === undefined ? stepTitle : cartCustomText}
                         ref={ref => (steps.current[stepRef] = ref)}>{stepTitle}<h5>{stepTitle2}</h5>
                    </div>
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
                            // if (selectedTitle.current[stepNum].clientWidth < selectedTitle.current[stepNum].scrollWidth || (stepRef in extendedTitle && extendedTitle[stepRef].length > 1)) {
                            if (stepRef in extendedTitle && extendedTitle[stepRef].length > 1) {
                                let temp = JSON.parse(JSON.stringify(headerTruncated))
                                temp[stepNum] = true;
                                setHeaderTruncated(temp);
                            }
                        }} onMouseLeave={() => {
                            let temp = JSON.parse(JSON.stringify(headerTruncated))
                            temp[stepNum] = false;
                            setHeaderTruncated(temp);
                        }} ref={ref => (selectedTitle.current[stepNum] = ref)}>
                            {showLabels ? (stepRef in extendedTitle && extendedTitle[stepRef].length > 0 ? (extendedTitle[stepRef][0]) : stepSelected) : null}{showLabels && stepRef in extendedTitle && extendedTitle[stepRef].length > 1 ? <h5> ...</h5> : ""}
                        </div>
                        {headerTruncated[stepNum] && <div className="header_tooltip">{stepRef in extendedTitle ? (stepRef === "1" || stepRef === "2" || stepRef === "6" || stepRef === "8" || stepRef === "8A" || stepRef === "8B" || stepRef === "8C" ? extendedTitle[stepRef].slice(1).filter(n => n) : extendedTitle[stepRef].slice(1).filter(n => n).join(', \n')) : stepSelected}</div>}
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
                    setInputDifRef(refIndex);
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
                    setInputDifRef(refIndex);
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
    
    function setCart(refIndex, cartValue, delRefs, secondRefIndex, secondCartValue, customAccCart) {
        // console.log(refIndex, ",", cartValue, ",", delRefs, ",", secondRefIndex, ",", secondCartValue);
        // let temp = {
        //     ...{
        //         "Mount": "Ceiling"
        //     }, ...JSON.parse(JSON.stringify(cartValues))
        // };
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
                        } else if (tempObj["apiAcc"] === "value") {
                            let pushObj = tempObj["apiAccValue"] || {};
                            pushObj["SewingAccessoryValue"] = temp[key].toString();
                            tempPostObj["SewingOrderDetails"][0]["Accessories"].push(pushObj);
                        }
                    }
                    if (tempObj["apiAcc2"] !== undefined) {
                        if (tempObj["apiAcc2"] === true && tempObj["apiAccValue2"][temp[key]]) {
                            tempPostObj["SewingOrderDetails"][1]["Accessories"].push(tempObj["apiAccValue2"][temp[key]]);
                        } else if (tempObj["apiAcc"] === "value") {
                            let pushObj = tempObj["apiAccValue2"] || {};
                            pushObj["SewingAccessoryValue"] = temp[key].toString();
                            tempPostObj["SewingOrderDetails"][1]["Accessories"].push(pushObj);
                        }
                    }
                    if (tempObj["apiAcc3"] !== undefined) {
                        if (tempObj["apiAcc3"] === true && tempObj["apiAccValue3"][temp[key]]) {
                            tempPostObj["SewingOrderDetails"][2]["Accessories"].push(tempObj["apiAccValue3"][temp[key]]);
                        } else if (tempObj["apiAcc"] === "value") {
                            let pushObj = tempObj["apiAccValue3"] || {};
                            pushObj["SewingAccessoryValue"] = temp[key].toString();
                            tempPostObj["SewingOrderDetails"][2]["Accessories"].push(pushObj);
                        }
                    }
                }
            }
        });
        if (customAccCart && customAccCart.length > 0) {
            tempPostObj["SewingOrderDetails"][0]["Accessories"].push(...customAccCart);
        } else if (customAcc.length > 0) {
            tempPostObj["SewingOrderDetails"][0]["Accessories"].push(...customAcc);
        }
        tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
            return el != null;
        });
        
        if (!pageLoad && !rodsLoad && !(refIndex === undefined && secondRefIndex === undefined)) {
            setCartValues(temp);
        }
        
        let promise2 = new Promise((resolve, reject) => {
            if (stepSelectedValue["3"] !== undefined && !pageLoad && !(motorLoad && refIndex === "MotorType") && refIndex !== "ZipCode") {
                
                for (let i = tempPostObj["SewingOrderDetails"].length - 1; i >= 0; i--) {
                    if (tempPostObj["SewingOrderDetails"] && tempPostObj["SewingOrderDetails"][i] && tempPostObj["SewingOrderDetails"][i]["FabricId"] === undefined) {
                        tempPostObj["SewingOrderDetails"].splice(i, 1);
                    }
                }
                if (zipcode && zipcode !== "") {
                    tempPostObj["ZipCode"] = zipcode;
                }
                // if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined && stepSelectedValue["2"] !== undefined && stepSelectedValue["3"] !== undefined) {
                // console.log(refIndex, cartValue,pageLoad,motorLoad,customAcc);
                axios.post(baseURLPrice, tempPostObj)
                    .then((response) => {
                        setPrice(response.data["price"]);
                        setFabricQty(response.data["FabricQty"]);
                        setLiningPrice(response.data["LiningPrice"]);
                        
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
                        setWidthCart(response.data["Width"]);
                        setHeightCart(response.data["Height"]);
                        resolve();
                    }).catch(err => {
                    setPrice(0);
                    setFabricQty(0);
                    setLiningPrice(0);
                    setWidthCart(undefined);
                    setHeightCart(undefined);
                    resolve(1);
                    // console.log(err);
                });
            } else {
                resolve();
            }
        });
        promise2.then((res) => {
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
                        window.location.reload();
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
            
            if (customAcc.length > 0) {
                tempPostObj["SewingOrderDetails"][0]["Accessories"].push(...customAcc);
            }
            tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
                return el != null;
            });
            
            if (stepSelectedValue["3"] !== undefined) {
                
                for (let i = tempPostObj["SewingOrderDetails"].length - 1; i >= 0; i--) {
                    if (tempPostObj["SewingOrderDetails"] && tempPostObj["SewingOrderDetails"][i] && tempPostObj["SewingOrderDetails"][i]["FabricId"] === undefined) {
                        tempPostObj["SewingOrderDetails"].splice(i, 1);
                    }
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
                            setLiningPrice(response.data["LiningPrice"]);
                            
                            // setCart("HeightCart", totalHeight, "", "WidthCart", [totalWidth]);
                            getWindowSize(response.data["WindowWidth"], response.data["WindowHeight"]);
                            temp["WindowWidth"] = response.data["WindowWidth"];
                            temp["WindowHeight"] = response.data["WindowHeight"];
                            temp["WidthCart"] = response.data["Width"];
                            temp["HeightCart"] = response.data["Height"];
                            setWidthCart(response.data["Width"]);
                            setHeightCart(response.data["Height"]);
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
                        setWidthCart(undefined);
                        setHeightCart(undefined);
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
    
    function clearInputs(e, nums, addNums, Scenario) {
        if (Scenario === undefined) {
            setWidth(undefined);
            setHeight(undefined);
            setRodToBottom(undefined);
            setRodToFloor(undefined);
            setWindowToFloor(undefined);
            setCeilingToWindow1(undefined);
            setCeilingToWindow2(undefined);
            setCeilingToWindow3(undefined);
            setCeilingToFloor(undefined);
            setCeilingToFloor1(undefined);
            setCeilingToFloor2(undefined);
            setCeilingToFloor3(undefined);
            setWidth3C(undefined);
            setRodWidth(undefined);
            setLeft(undefined);
            setRight(undefined);
            setHeight3E(undefined);
            setMount(undefined);
        } else if (Scenario === "HeightDif") {
            setCeilingToWindow1(undefined);
            setCeilingToWindow2(undefined);
            setCeilingToWindow3(undefined);
            setCeilingToFloor1(undefined);
            setCeilingToFloor2(undefined);
            setCeilingToFloor3(undefined);
        }
        
        setTimeout(() => {
            selectChanged(e, nums ? nums : ("3C,3D,3E,3EFloor,3EStandardCeiling,3EStandardCeilingFloor,3F,3G,3BRod,3CRod,3CRodFloor,3DRod" + (addNums ? ("," + addNums) : "")));
        }, 100);
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
        // console.log([...new Set(depSetTempArr)]);
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
                        if (dependency === "") break;
                    }
                    if (steps.current[dependency] !== undefined && steps.current[dependency] !== null) {
                        let type = steps.current[dependency].getAttribute("type-of-step") === "1" ? (pageLanguage === 'fa' ? " را مشخص کنید" : "SPECIFY ") : (pageLanguage === 'fa' ? " را انتخاب کنید" : "SELECT ");
                        tempErr.push(<li key={index}>
                            {pageLanguage === 'fa' ? "شما باید " + steps.current[dependency].getAttribute("cart-custom-text") + type : "YOU MUST " + type + steps.current[dependency].getAttribute("cart-custom-text")}
                        </li>);
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
                        if (dependency === "") break;
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
            } else if (heightCart === undefined || widthCart === undefined) {
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
                    let temp2 = [];
                    let temp3 = [];
                    let temp4 = [];
                    let temp5 = [];
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
                    if (customAcc.length > 0) {
                        tempPostObj["SewingOrderDetails"][0]["Accessories"].push(...customAcc);
                    }
                    tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
                        return el != null;
                    });
                    tempPostObj["SewingModelId"] = tempPostObj["SewingOrderDetails"][0]["SewingModelId"];
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
                                setInstallPrice(response.data["InstallAmount"] ? response.data["InstallAmount"] : 0);
                                // console.log(response.data);
                                
                                let roomNameFa = cartValues["RoomNameFa"];
                                let roomName = cartValues["RoomNameEn"];
                                let WindowName = cartValues["WindowName"] === undefined ? "" : cartValues["WindowName"];
                                
                                let promiseArr = [];
                                customAcc.forEach((obj, index) => {
                                    promiseArr[index] = new Promise((resolve, reject) => {
                                        temp4[index] = <li className="cart_agree_item" key={"acc" + index}>
                                            <h1 className="cart_agree_item_title">{pageLanguage === "fa" ? obj["DesignNameFa"] : obj["DesignNameEn"]}</h1>
                                            <h2 className="cart_agree_item_desc">{t("agree_Qty")}{NumToFa(obj["Qty"], pageLanguage)}</h2>
                                        </li>;
                                        resolve();
                                    });
                                });
                                
                                let promiseArr2 = [];
                                Object.keys(cartValues).forEach((key, index) => {
                                    promiseArr2[index] = new Promise((resolve, reject) => {
                                        let tempObj = userProjects.find(obj => obj["cart"] === key);
                                        if (tempObj === undefined) {
                                            // window.location.reload();
                                            console.log(key);
                                            resolve();
                                        } else {
                                            if (key === "WindowHeight" || key === "WindowWidth") {
                                                resolve();
                                            } else if ((key === "PanelTypeOption" && cartValues["PanelTypeOption"] === "Customize Style Per Curtain") || (key === "Hardware" && cartValues["Hardware"] === "I Want To Customize Hardware Per Curtain")) {
                                                resolve();
                                            } else if (tempObj["title"] !== "" && tempObj["lang"].indexOf(pageLanguage) > -1) {
                                                let objLabel = "";
                                                if (key === "ControlType" && cartValues["ControlType"] === "Motorized") {
                                                    objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${t(cartValues[key].toString())} / ${t(cartValues["MotorType"].toString())}`).toString() : `${t(cartValues[key].toString())} / ${t(cartValues["MotorType"].toString())}`;
                                                }
                                                    // else if (key === "Hardware" && cartValues["Hardware"] === "Same Hardware For All Curtains") {
                                                    //     objLabel = t(cartValues[key].toString()) + " / " + (pageLanguage === "fa" ? cartValues["RailDesignFa"] : cartValues["RailDesignEn"]) + " / " + (pageLanguage === "fa" ? cartValues["RailColorFa"] : cartValues["RailColorEn"]) + " / " + t(cartValues["BatonOption"]);
                                                // }
                                                else if (key === "DraperyHardware" && cartValues["DraperyHardware"] !== "None") {
                                                    objLabel = t(cartValues[key].toString()) + " / " + (pageLanguage === "fa" ? cartValues["RailDesignFaA"] : cartValues["RailDesignEnA"]) + " \n " + (pageLanguage === "fa" ? cartValues["RailColorFaA"] : cartValues["RailColorEnA"]) + " / " + t(cartValues["BatonOptionA"]);
                                                } else if (key === "SheerHardware" && cartValues["SheerHardware"] !== "None") {
                                                    if (cartValues["RailDesignEnB"] === "Motorized Track") {
                                                        objLabel = t(cartValues[key].toString()) + " / " + (pageLanguage === "fa" ? cartValues["RailDesignFaB"] : cartValues["RailDesignEnB"]);
                                                    } else {
                                                        objLabel = t(cartValues[key].toString()) + " / " + (pageLanguage === "fa" ? cartValues["RailDesignFaB"] : cartValues["RailDesignEnB"]) + " \n " + (pageLanguage === "fa" ? cartValues["RailColorFaB"] : cartValues["RailColorEnB"]) + " / " + t(cartValues["BatonOptionB"]);
                                                    }
                                                } else if (key === "PrivacyLayerHardware" && cartValues["PrivacyLayerHardware"] !== "None") {
                                                    if (cartValues["RailDesignEnC"] === "Motorized Track") {
                                                        objLabel = t(cartValues[key].toString()) + " / " + (pageLanguage === "fa" ? cartValues["RailDesignFaC"] : cartValues["RailDesignEnC"]);
                                                    } else {
                                                        objLabel = t(cartValues[key].toString()) + " / " + (pageLanguage === "fa" ? cartValues["RailDesignFaC"] : cartValues["RailDesignEnC"]) + " \n " + (pageLanguage === "fa" ? cartValues["RailColorFaC"] : cartValues["RailColorEnC"]) + " / " + t(cartValues["BatonOptionC"]);
                                                    }
                                                } else if (key === "HandCurtainEn" || key === "HandCurtainFa") {
                                                    objLabel = t("agree_Qty") + NumToFa(cartValues["HandCurtainNum"], pageLanguage);
                                                } else if (key === "HandCurtainEn2" || key === "HandCurtainFa2") {
                                                    objLabel = t("agree_Qty") + NumToFa(cartValues["HandCurtainNum2"], pageLanguage);
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
                                                if (tempObj["fabric"] === undefined) {
                                                    temp5[tempObj["order"]] = <li className="cart_agree_item" key={key}>
                                                        <h1 className="cart_agree_item_title">{t(tempObj["title"])}&nbsp;</h1>
                                                        <h2 className="cart_agree_item_desc">{objLabel}</h2>
                                                    </li>;
                                                    resolve();
                                                } else if (tempObj["fabric"] === 1) {
                                                    temp1[tempObj["order"]] = <li className="cart_agree_item" key={key}>
                                                        <h1 className="cart_agree_item_title">{t(tempObj["title"])}&nbsp;</h1>
                                                        <h2 className="cart_agree_item_desc">{objLabel}</h2>
                                                    </li>;
                                                    resolve();
                                                } else if (tempObj["fabric"] === 2) {
                                                    temp2[tempObj["order"]] = <li className="cart_agree_item" key={key}>
                                                        <h1 className="cart_agree_item_title">{t(tempObj["title"])}&nbsp;</h1>
                                                        <h2 className="cart_agree_item_desc">{objLabel}</h2>
                                                    </li>;
                                                    resolve();
                                                } else if (tempObj["fabric"] === 3) {
                                                    temp3[tempObj["order"]] = <li className="cart_agree_item" key={key}>
                                                        <h1 className="cart_agree_item_title">{t(tempObj["title"])}&nbsp;</h1>
                                                        <h2 className="cart_agree_item_desc">{objLabel}</h2>
                                                    </li>;
                                                    resolve();
                                                } else {
                                                    resolve();
                                                }
                                            } else {
                                                resolve();
                                            }
                                        }
                                    });
                                });
                                
                                Promise.all([...promiseArr, ...promiseArr2]).then(() => {
                                    tempArr.push(<div key={defaultModelName}>
                                        <h2 className="cart_agree_title">{pageLanguage === 'fa' ? convertToPersian(defaultModelNameFa) + " سفارشی " : "Custom " + defaultModelName}</h2>
                                        <ul className="cart_agree_items_container">
                                            <GetMeasurementArray modelId={`${modelID}`} cartValues={cartValues}/>
                                            <li className="cart_agree_item cart_agree_item_fabrics_sorted cart_agree_item_general">
                                                <h1 className="cart_agree_item_fabrics_sorted_title">{t("General Details")}</h1>
                                                <ul>
                                                    {temp5}
                                                </ul>
                                            </li>
                                            <li className="cart_agree_item cart_agree_item_fabrics_sorted cart_agree_item_drapery">
                                                <h1 className="cart_agree_item_fabrics_sorted_title">{t("Drapery")}</h1>
                                                <ul>
                                                    <li className="cart_agree_item">
                                                        <h1 className="cart_agree_item_title">{t("Material & Color")}&nbsp;</h1>
                                                        <h2 className="cart_agree_item_desc">{pageLanguage === 'fa' ? cartValues["FabricDesignFa"] + " / " + cartValues["FabricColorFa"] : CapitalizeAllWords(cartValues["FabricDesignEn"] + " / " + cartValues["FabricColorEn"])}</h2>
                                                    </li>
                                                    {cartValues["BorderOrTrimId"] && cartValues["borderPosition"] &&
                                                        <li className="cart_agree_item">
                                                            <h1 className="cart_agree_item_title">{t("Decorative Border")}&nbsp;</h1>
                                                            <h2 className="cart_agree_item_desc">{pageLanguage === 'fa' ? cartValues["BorderOrTrimDesignFa"] + " / " + cartValues["BorderOrTrimColorFa"] + " \n " + t(cartValues["borderPosition"]) : CapitalizeAllWords(cartValues["BorderOrTrimDesignEn"] + " / " + cartValues["BorderOrTrimColorEn"] + " \N " + t(cartValues["borderPosition"]))}</h2>
                                                        </li>
                                                    }
                                                    {cartValues["BorderOrTrimId"] && !cartValues["borderPosition"] &&
                                                        <li className="cart_agree_item">
                                                            <h1 className="cart_agree_item_title">{t("Decorative Trim")}&nbsp;</h1>
                                                            <h2 className="cart_agree_item_desc">{pageLanguage === 'fa' ? cartValues["BorderOrTrimDesignFa"] + " / " + cartValues["BorderOrTrimColorFa"] : CapitalizeAllWords(cartValues["BorderOrTrimDesignEn"] + " / " + cartValues["BorderOrTrimColorEn"])}</h2>
                                                        </li>
                                                    }
                                                    {temp1}
                                                </ul>
                                            </li>
                                            <li className="cart_agree_item cart_agree_item_fabrics_sorted cart_agree_item_sheer">
                                                <h1 className="cart_agree_item_fabrics_sorted_title">{t("Sheer")}</h1>
                                                <ul>
                                                    <li className="cart_agree_item">
                                                        <h1 className="cart_agree_item_title">{t("Material & Color")}&nbsp;</h1>
                                                        <h2 className="cart_agree_item_desc">{pageLanguage === 'fa' ? cartValues["FabricDesignFa2"] + " / " + cartValues["FabricColorFa2"] : CapitalizeAllWords(cartValues["FabricDesignEn2"] + " / " + cartValues["FabricColorEn2"])}</h2>
                                                    </li>
                                                    {cartValues["BorderOrTrimId2"] && cartValues["borderPosition2"] &&
                                                        <li className="cart_agree_item">
                                                            <h1 className="cart_agree_item_title">{t("Decorative Border")}&nbsp;</h1>
                                                            <h2 className="cart_agree_item_desc">{pageLanguage === 'fa' ? cartValues["BorderOrTrimDesignFa2"] + " / " + cartValues["BorderOrTrimColorFa2"] + " \n " + t(cartValues["borderPosition2"]) : CapitalizeAllWords(cartValues["BorderOrTrimDesignEn2"] + " / " + cartValues["BorderOrTrimColorEn2"] + " \N " + t(cartValues["borderPosition2"]))}</h2>
                                                        </li>
                                                    }
                                                    {cartValues["BorderOrTrimId2"] && !cartValues["borderPosition2"] &&
                                                        <li className="cart_agree_item">
                                                            <h1 className="cart_agree_item_title">{t("Decorative Trim")}&nbsp;</h1>
                                                            <h2 className="cart_agree_item_desc">{pageLanguage === 'fa' ? cartValues["BorderOrTrimDesignFa2"] + " / " + cartValues["BorderOrTrimColorFa2"] : CapitalizeAllWords(cartValues["BorderOrTrimDesignEn2"] + " / " + cartValues["BorderOrTrimColorEn2"])}</h2>
                                                        </li>
                                                    }
                                                    {temp2}
                                                </ul>
                                            </li>
                                            <li className="cart_agree_item cart_agree_item_fabrics_sorted cart_agree_item_pl">
                                                <h1 className="cart_agree_item_fabrics_sorted_title">{t("Privacy Layer")}</h1>
                                                <ul>
                                                    <li className="cart_agree_item">
                                                        <h1 className="cart_agree_item_title">{t("Material & Color")}&nbsp;</h1>
                                                        <h2 className="cart_agree_item_desc">{pageLanguage === 'fa' ? t(cartValues["PrivacyLayer"]) + (cartValues["SheersColorFa"] ? " / " : "") + (cartValues["SheersColorFa"] || "") : CapitalizeAllWords(cartValues["PrivacyLayer"] + (cartValues["SheersColorEn"] ? " / " : "") + (cartValues["SheersColorEn"] || ""))}</h2>
                                                    </li>
                                                    {temp3}
                                                </ul>
                                            </li>
                                            <li className="cart_agree_item cart_agree_item_fabrics_sorted cart_agree_item_acc">
                                                <h1 className="cart_agree_item_fabrics_sorted_title">{t("Accessories")}</h1>
                                                <ul>
                                                    {temp4}
                                                </ul>
                                            </li>
                                            <li className="cart_agree_item">
                                                <h1 className="cart_agree_item_title">{pageLanguage === 'fa' ? "نام اتاق" : "Room Label"}&nbsp;</h1>
                                                <h2 className="cart_agree_item_desc">{pageLanguage === 'fa' ? roomNameFa + (WindowName === "" ? "" : " / " + WindowName) : roomName + (WindowName === "" ? "" : " / " + WindowName)}</h2>
                                            </li>
                                            <li className="cart_agree_item">
                                                <h1 className="cart_agree_item_title">{t("Price")}&nbsp;</h1>
                                                <h2 className="cart_agree_item_desc">{GetPrice(tempBagPrice, pageLanguage, t("TOMANS"))}</h2>
                                            </li>
                                        </ul>
                                    </div>);
                                    setCartAgree(tempArr);
                                    modalHandleShow("cart_modal");
                                    setCartValues(temp);
                                    setAddingLoading(false);
                                });
                                
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
        AddProjectToCart(cartValues, `${modelID}`, price, defaultModelName, defaultModelNameFa, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], (projectId && projectId !== "") ? projectId : cartProjectIndex, editIndex, navigate, isLoggedIn, customAcc).then((temp) => {
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
        }).catch((err) => {
            console.log(err);
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
        let currentState = e.target ? e.target.getAttribute('current-state') : e;
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
        setRodsLoad(true);
        // setRodsLoad2(true);
        
        setExtendedTitle({
            "1": [],
            "2": [],
            "6": [],
            "8": [],
            "8A": [],
            "8B": [],
            "8C": [],
            "9": []
        });
        
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
        let tempExtended = extendedTitle;
        
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
                    setTimeout(() => {
                        // console.log(temp);
                        
                        if (temp["calcMeasurements"] !== undefined) {
                            setStep3(temp["calcMeasurements"].toString());
                            if (!temp["calcMeasurements"]) {
                                let refIndex = inputs.current["31"].getAttribute('ref-num');
                                tempLabels[refIndex] = inputs.current["31"].getAttribute('text');
                                tempValue[refIndex] = inputs.current["31"].value;
                                setStepSelectedLabel(tempLabels);
                                setStepSelectedValue(tempValue);
                                
                                // selectValues["width"] = temp["Width"] ? [{value: temp["Width"]}] : [];
                                // selectValues["length"] = temp["Height"] ? [{value: temp["Height"]}] : [];
                                setWidth(temp["Width"] ? temp["Width"] : undefined);
                                setHeight(temp["Height"] ? temp["Height"] : undefined);
                                depSetTempArr = new Set([...setGetDeps((temp["Width"] ? "" : "311,") + (temp["Height"] ? "" : "312,"), "3", depSetTempArr)]);
                                setSelectCustomValues(selectValues);
                            } else {
                                let refIndex = inputs.current["32"].getAttribute('ref-num');
                                tempLabels[refIndex] = inputs.current["32"].getAttribute('text');
                                tempValue[refIndex] = inputs.current["32"].value;
                                setStepSelectedLabel(tempLabels);
                                setStepSelectedValue(tempValue);
                                depSetTempArr = new Set([...setGetDeps("", "3", depSetTempArr)]);
                                
                                if (temp["hasRod"] !== undefined) {
                                    setStep31(temp["hasRod"].toString());
                                    depSetTempArr = new Set([...setGetDeps("3A0,3A", "3,31", depSetTempArr)]);
                                    if (!temp["hasRod"]) {
                                        let scenario = 0;
                                        if (temp["Mount"]) {
                                            setStep3A0(temp["Mount"].toString());
                                            if (temp["Mount"] === "Wall") {
                                                let refIndex = inputs.current["3A01"].getAttribute('ref-num');
                                                tempLabels[refIndex] = inputs.current["3A01"].getAttribute('text');
                                                tempValue[refIndex] = inputs.current["3A01"].value;
                                                depSetTempArr = new Set([...setGetDeps("", "3A0", depSetTempArr)]);
                                            } else if (temp["Mount"] === "Ceiling") {
                                                let refIndex = inputs.current["3A02"].getAttribute('ref-num');
                                                tempLabels[refIndex] = inputs.current["3A02"].getAttribute('text');
                                                tempValue[refIndex] = inputs.current["3A02"].value;
                                                depSetTempArr = new Set([...setGetDeps("", "3A0", depSetTempArr)]);
                                            } else {
                                                let refIndex = inputs.current["3A03"].getAttribute('ref-num');
                                                tempLabels[refIndex] = inputs.current["3A03"].getAttribute('text');
                                                tempValue[refIndex] = inputs.current["3A03"].value;
                                                setDepth(temp["Depth"] ? temp["Depth"] : undefined);
                                                setMouldingHeight(temp["MouldingHeight"] ? temp["MouldingHeight"] : undefined);
                                                depSetTempArr = new Set([...setGetDeps((temp["Depth"] !== undefined ? "" : "3A11,") + (temp["MouldingHeight"] !== undefined ? "" : "3A12,"), "3A0", depSetTempArr)]);
                                            }
                                            setStepSelectedLabel(tempLabels);
                                            setStepSelectedValue(tempValue);
                                        }
                                        if (temp["CurtainPosition"]) {
                                            setStep3A(temp["CurtainPosition"].toString());
                                            if (temp["CurtainPosition"] === "Standard") {
                                                let refIndex = inputs.current["3A1"].getAttribute('ref-num');
                                                tempLabels[refIndex] = inputs.current["3A1"].getAttribute('text');
                                                tempValue[refIndex] = inputs.current["3A1"].value;
                                                // if (temp["Mount"]) {
                                                //     setSelectedMountOutsideType(temp["Mount"] ? [{
                                                //         value: temp["Mount"],
                                                //         label: optionsOutside[pageLanguage].find(opt => opt.value === temp["Mount"]).label
                                                //     }] : []);
                                                // }
                                                depSetTempArr = new Set([...setGetDeps("", "3A", depSetTempArr)]);
                                            } else if (temp["CurtainPosition"] === "Wall to Wall") {
                                                let refIndex = inputs.current["3A2"].getAttribute('ref-num');
                                                tempLabels[refIndex] = inputs.current["3A2"].getAttribute('text');
                                                tempValue[refIndex] = inputs.current["3A2"].value;
                                                // if (temp["Mount"]) {
                                                //     setSelectedMountOutsideType2(temp["Mount"] ? [{
                                                //         value: temp["Mount"],
                                                //         label: optionsOutside[pageLanguage].find(opt => opt.value === temp["Mount"]).label
                                                //     }] : []);
                                                // }
                                                depSetTempArr = new Set([...setGetDeps("", "3A", depSetTempArr)]);
                                            } else if (temp["CurtainPosition"] === "Left Corner Window") {
                                                let refIndex = inputs.current["3A3"].getAttribute('ref-num');
                                                tempLabels[refIndex] = inputs.current["3A3"].getAttribute('text');
                                                tempValue[refIndex] = inputs.current["3A3"].value;
                                                // if (temp["Mount"]) {
                                                //     setSelectedMountOutsideType3(temp["Mount"] ? [{
                                                //         value: temp["Mount"],
                                                //         label: optionsOutside[pageLanguage].find(opt => opt.value === temp["Mount"]).label
                                                //     }] : []);
                                                // }
                                                depSetTempArr = new Set([...setGetDeps("", "3A", depSetTempArr)]);
                                            } else {
                                                let refIndex = inputs.current["3A4"].getAttribute('ref-num');
                                                tempLabels[refIndex] = inputs.current["3A4"].getAttribute('text');
                                                tempValue[refIndex] = inputs.current["3A4"].value;
                                                // if (temp["Mount"]) {
                                                //     setSelectedMountOutsideType4(temp["Mount"] ? [{
                                                //         value: temp["Mount"],
                                                //         label: optionsOutside[pageLanguage].find(opt => opt.value === temp["Mount"]).label
                                                //     }] : []);
                                                // }
                                                depSetTempArr = new Set([...setGetDeps("", "3A", depSetTempArr)]);
                                            }
                                            if (temp["Mount"]) {
                                                if (temp["FinishedLengthType"]) {
                                                    setStep3B(temp["FinishedLengthType"].toString());
                                                    if (temp["FinishedLengthType"] === "Sill" || temp["FinishedLengthType"] === "Apron") {
                                                        if ((temp["Mount"] === "Ceiling" || temp["Mount"] === "Moulding") && (temp["CurtainPosition"] === "Standard" || temp["CurtainPosition"] === "Left Corner Window" || temp["CurtainPosition"] === "Right Corner Window")) {
                                                            scenario = 1;
                                                        } else if (temp["Mount"] === "Wall" && temp["CurtainPosition"] === "Wall to Wall") {
                                                            scenario = 2;
                                                        } else if ((temp["Mount"] === "Ceiling" || temp["Mount"] === "Moulding") && temp["CurtainPosition"] === "Wall to Wall") {
                                                            scenario = 3;
                                                        } else {
                                                            scenario = 4;
                                                        }
                                                        
                                                        if (temp["FinishedLengthType"] === "Sill") {
                                                            let refIndex = inputs.current["3B1"].getAttribute('ref-num');
                                                            tempLabels[refIndex] = inputs.current["3B1"].getAttribute('text');
                                                            tempValue[refIndex] = inputs.current["3B1"].value;
                                                        } else {
                                                            let refIndex = inputs.current["3B11"].getAttribute('ref-num');
                                                            tempLabels[refIndex] = inputs.current["3B11"].getAttribute('text');
                                                            tempValue[refIndex] = inputs.current["3B11"].value;
                                                            setStep3B1("true");
                                                        }
                                                        
                                                    } else {
                                                        if ((temp["Mount"] === "Ceiling" || temp["Mount"] === "Moulding") && (temp["CurtainPosition"] === "Standard" || temp["CurtainPosition"] === "Left Corner Window" || temp["CurtainPosition"] === "Right Corner Window")) {
                                                            scenario = 5;
                                                        } else if (temp["Mount"] === "Wall" && temp["CurtainPosition"] === "Wall to Wall") {
                                                            scenario = 6;
                                                        } else if ((temp["Mount"] === "Ceiling" || temp["Mount"] === "Moulding") && temp["CurtainPosition"] === "Wall to Wall") {
                                                            scenario = 7;
                                                        } else {
                                                            scenario = 8;
                                                        }
                                                        
                                                        if (temp["FinishedLengthType"] === "Floor") {
                                                            let refIndex = inputs.current["3B3"].getAttribute('ref-num');
                                                            tempLabels[refIndex] = inputs.current["3B3"].getAttribute('text');
                                                            tempValue[refIndex] = inputs.current["3B3"].value;
                                                        } else {
                                                            let refIndex = inputs.current["3B4"].getAttribute('ref-num');
                                                            tempLabels[refIndex] = inputs.current["3B4"].getAttribute('text');
                                                            tempValue[refIndex] = inputs.current["3B4"].value;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        setTimeout(() => {
                                            if (scenario > 0) {
                                                if (scenario === 1) {
                                                    let tempWidth = changeLang ? temp["Width3C"] : temp["Width"];
                                                    
                                                    // selectValues["Width3C"] = tempWidth ? [{value: tempWidth}] : [];
                                                    setWidth3C(tempWidth ? tempWidth : undefined);
                                                    if (tempWidth) {
                                                        tempLabels["3C"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                    }
                                                    // selectValues["left"] = temp["ExtensionLeft"] ? [{value: temp["ExtensionLeft"]}] : [];
                                                    // selectValues["right"] = temp["ExtensionRight"] ? [{value: temp["ExtensionRight"]}] : [];
                                                    setLeft(temp["ExtensionLeft"] ? temp["ExtensionLeft"] : undefined);
                                                    setRight(temp["ExtensionRight"] ? temp["ExtensionRight"] : undefined);
                                                    if (temp["ExtensionLeft"] !== undefined && temp["ExtensionRight"] !== undefined) {
                                                        tempLabels["3D"] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionRight"]}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionLeft"]}`) + postfixFa}` : `Left: ${temp["ExtensionLeft"] + postfixEn}\u00A0\u00A0\u00A0Right: ${temp["ExtensionRight"] + postfixEn}`;
                                                    }
                                                    
                                                    let tempHeight = changeLang ? temp["CeilingToWindow1"] : temp["Height"];
                                                    let tempHeight2 = changeLang ? temp["CeilingToWindow2"] : temp["Height2"];
                                                    let tempHeight3 = changeLang ? temp["CeilingToWindow3"] : temp["Height3"];
                                                    // selectValues["CeilingToWindow1"] = tempHeight ? [{value: tempHeight}] : [];
                                                    // selectValues["CeilingToWindow2"] = tempHeight2 ? [{value: tempHeight2}] : [];
                                                    // selectValues["CeilingToWindow3"] = tempHeight3 ? [{value: tempHeight3}] : [];
                                                    setCeilingToWindow1(tempHeight ? tempHeight : undefined);
                                                    setCeilingToWindow2(tempHeight2 ? tempHeight2 : undefined);
                                                    setCeilingToWindow3(tempHeight3 ? tempHeight3 : undefined);
                                                    if (tempHeight && tempHeight2 && tempHeight3) {
                                                        let tempMax = Math.min(tempHeight, tempHeight2, tempHeight3);
                                                        tempLabels["3EStandardCeiling"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMax}`) + postfixFa : tempMax + postfixEn;
                                                    }
                                                    
                                                    // selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                    setCeilingToFloor(temp["CeilingToFloor"] ? temp["CeilingToFloor"] : undefined);
                                                    if (temp["CeilingToFloor"] !== undefined) {
                                                        tempLabels["3G"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                    }
                                                    
                                                    depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "3C,") + (temp["ExtensionLeft"] !== undefined ? "" : "3D1,") + (temp["ExtensionRight"] !== undefined ? "" : "3D2,") + (tempHeight !== undefined ? "" : "3EStandardCeiling1,") + (tempHeight2 !== undefined ? "" : "3EStandardCeiling2,") + (tempHeight3 !== undefined ? "" : "3EStandardCeiling3,") + (selectValues["CeilingToFloor"] !== undefined ? "" : "3G,"), "31,3A,3B,3B1", depSetTempArr)]);
                                                    
                                                } else if (scenario === 2) {
                                                    let tempWidth = changeLang ? temp["Width3C"] : temp["Width"];
                                                    let tempHeight = changeLang ? temp["Height3E"] : temp["Height"];
                                                    
                                                    // selectValues["Width3C"] = tempWidth ? [{value: tempWidth}] : [];
                                                    setWidth3C(tempWidth ? tempWidth : undefined);
                                                    if (tempWidth) {
                                                        tempLabels["3C"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                    }
                                                    
                                                    // selectValues["Height3E"] = tempHeight ? [{value: tempHeight}] : [];
                                                    setHeight3E(tempHeight ? tempHeight : undefined);
                                                    if (tempHeight) {
                                                        tempLabels["3E"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempHeight}`) + postfixFa : tempHeight + postfixEn;
                                                    }
                                                    
                                                    // selectValues["ShadeMount"] = temp["ShadeMount"] ? [{value: temp["ShadeMount"]}] : [];
                                                    setMount(temp["ShadeMount"] ? temp["ShadeMount"] : undefined);
                                                    if (temp["ShadeMount"] !== undefined) {
                                                        tempLabels["3F"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["ShadeMount"]}`) + postfixFa : temp["ShadeMount"] + postfixEn;
                                                    }
                                                    
                                                    // selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                    setCeilingToFloor(temp["CeilingToFloor"] ? temp["CeilingToFloor"] : undefined);
                                                    if (temp["CeilingToFloor"] !== undefined) {
                                                        tempLabels["3G"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                    }
                                                    
                                                    depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "3C,") + (tempHeight !== undefined ? "" : "3E,") + +(selectValues["ShadeMount"] !== undefined ? "" : "3F,") + (selectValues["CeilingToFloor"] !== undefined ? "" : "3G,"), "31,3A,3B,3B1", depSetTempArr)]);
                                                    
                                                } else if (scenario === 3) {
                                                    let tempWidth = changeLang ? temp["Width3C"] : temp["Width"];
                                                    
                                                    // selectValues["Width3C"] = tempWidth ? [{value: tempWidth}] : [];
                                                    setWidth3C(tempWidth ? tempWidth : undefined);
                                                    if (tempWidth) {
                                                        tempLabels["3C"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                    }
                                                    
                                                    let tempHeight = changeLang ? temp["CeilingToWindow1"] : temp["Height"];
                                                    let tempHeight2 = changeLang ? temp["CeilingToWindow2"] : temp["Height2"];
                                                    let tempHeight3 = changeLang ? temp["CeilingToWindow3"] : temp["Height3"];
                                                    // selectValues["CeilingToWindow1"] = tempHeight ? [{value: tempHeight}] : [];
                                                    // selectValues["CeilingToWindow2"] = tempHeight2 ? [{value: tempHeight2}] : [];
                                                    // selectValues["CeilingToWindow3"] = tempHeight3 ? [{value: tempHeight3}] : [];
                                                    setCeilingToWindow1(tempHeight ? tempHeight : undefined);
                                                    setCeilingToWindow2(tempHeight2 ? tempHeight2 : undefined);
                                                    setCeilingToWindow3(tempHeight3 ? tempHeight3 : undefined);
                                                    if (tempHeight && tempHeight2 && tempHeight3) {
                                                        let tempMax = Math.min(tempHeight, tempHeight2, tempHeight3);
                                                        tempLabels["3EStandardCeiling"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMax}`) + postfixFa : tempMax + postfixEn;
                                                    }
                                                    
                                                    // selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                    setCeilingToFloor(temp["CeilingToFloor"] ? temp["CeilingToFloor"] : undefined);
                                                    if (temp["CeilingToFloor"] !== undefined) {
                                                        tempLabels["3G"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                    }
                                                    
                                                    depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "3C,") + (tempHeight !== undefined ? "" : "3EStandardCeiling1,") + (tempHeight2 !== undefined ? "" : "3EStandardCeiling2,") + (tempHeight3 !== undefined ? "" : "3EStandardCeiling3,") + (selectValues["CeilingToFloor"] !== undefined ? "" : "3G,"), "31,3A,3B,3B1", depSetTempArr)]);
                                                    
                                                } else if (scenario === 4) {
                                                    let tempWidth = changeLang ? temp["Width3C"] : temp["Width"];
                                                    let tempHeight = changeLang ? temp["Height3E"] : temp["Height"];
                                                    
                                                    // selectValues["Width3C"] = tempWidth ? [{value: tempWidth}] : [];
                                                    setWidth3C(tempWidth ? tempWidth : undefined);
                                                    if (tempWidth) {
                                                        tempLabels["3C"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                    }
                                                    
                                                    // selectValues["left"] = temp["ExtensionLeft"] ? [{value: temp["ExtensionLeft"]}] : [];
                                                    // selectValues["right"] = temp["ExtensionRight"] ? [{value: temp["ExtensionRight"]}] : [];
                                                    setLeft(temp["ExtensionLeft"] ? temp["ExtensionLeft"] : undefined);
                                                    setRight(temp["ExtensionRight"] ? temp["ExtensionRight"] : undefined);
                                                    if (temp["ExtensionLeft"] !== undefined && temp["ExtensionRight"] !== undefined) {
                                                        tempLabels["3D"] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionRight"]}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionLeft"]}`) + postfixFa}` : `Left: ${temp["ExtensionLeft"] + postfixEn}\u00A0\u00A0\u00A0Right: ${temp["ExtensionRight"] + postfixEn}`;
                                                    }
                                                    
                                                    // selectValues["Height3E"] = tempHeight ? [{value: tempHeight}] : [];
                                                    setHeight3E(tempHeight ? tempHeight : undefined);
                                                    if (tempHeight) {
                                                        tempLabels["3E"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempHeight}`) + postfixFa : tempHeight + postfixEn;
                                                    }
                                                    
                                                    // selectValues["ShadeMount"] = temp["ShadeMount"] ? [{value: temp["ShadeMount"]}] : [];
                                                    setMount(temp["ShadeMount"] ? temp["ShadeMount"] : undefined);
                                                    if (temp["ShadeMount"] !== undefined) {
                                                        tempLabels["3F"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["ShadeMount"]}`) + postfixFa : temp["ShadeMount"] + postfixEn;
                                                    }
                                                    
                                                    // selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                    setCeilingToFloor(temp["CeilingToFloor"] ? temp["CeilingToFloor"] : undefined);
                                                    if (temp["CeilingToFloor"] !== undefined) {
                                                        tempLabels["3G"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                    }
                                                    
                                                    depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "3C,") + (temp["ExtensionLeft"] !== undefined ? "" : "3D1,") + (temp["ExtensionRight"] !== undefined ? "" : "3D2,") + (tempHeight !== undefined ? "" : "3E,") + +(selectValues["ShadeMount"] !== undefined ? "" : "3F,") + (selectValues["CeilingToFloor"] !== undefined ? "" : "3G,"), "31,3A,3B,3B1", depSetTempArr)]);
                                                    
                                                } else if (scenario === 5) {
                                                    let tempWidth = changeLang ? temp["Width3C"] : temp["Width"];
                                                    
                                                    // selectValues["Width3C"] = tempWidth ? [{value: tempWidth}] : [];
                                                    setWidth3C(tempWidth ? tempWidth : undefined);
                                                    if (tempWidth) {
                                                        tempLabels["3C"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                    }
                                                    
                                                    // selectValues["left"] = temp["ExtensionLeft"] ? [{value: temp["ExtensionLeft"]}] : [];
                                                    // selectValues["right"] = temp["ExtensionRight"] ? [{value: temp["ExtensionRight"]}] : [];
                                                    setLeft(temp["ExtensionLeft"] ? temp["ExtensionLeft"] : undefined);
                                                    setRight(temp["ExtensionRight"] ? temp["ExtensionRight"] : undefined);
                                                    if (temp["ExtensionLeft"] !== undefined && temp["ExtensionRight"] !== undefined) {
                                                        tempLabels["3D"] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionRight"]}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionLeft"]}`) + postfixFa}` : `Left: ${temp["ExtensionLeft"] + postfixEn}\u00A0\u00A0\u00A0Right: ${temp["ExtensionRight"] + postfixEn}`;
                                                    }
                                                    
                                                    let tempHeight = changeLang ? temp["CeilingToFloor1"] : temp["Height"];
                                                    let tempHeight2 = changeLang ? temp["CeilingToFloor2"] : temp["Height2"];
                                                    let tempHeight3 = changeLang ? temp["CeilingToFloor3"] : temp["Height3"];
                                                    // selectValues["CeilingToFloor1"] = tempHeight ? [{value: tempHeight}] : [];
                                                    // selectValues["CeilingToFloor2"] = tempHeight2 ? [{value: tempHeight2}] : [];
                                                    // selectValues["CeilingToFloor3"] = tempHeight3 ? [{value: tempHeight3}] : [];
                                                    setCeilingToFloor1(tempHeight ? tempHeight : undefined);
                                                    setCeilingToFloor2(tempHeight2 ? tempHeight2 : undefined);
                                                    setCeilingToFloor3(tempHeight3 ? tempHeight3 : undefined);
                                                    if (tempHeight && tempHeight2 && tempHeight3) {
                                                        let tempMax = Math.min(tempHeight, tempHeight2, tempHeight3);
                                                        tempLabels["3EStandardCeilingFloor"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMax}`) + postfixFa : tempMax + postfixEn;
                                                    }
                                                    
                                                    // selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                    setCeilingToFloor(temp["CeilingToFloor"] ? temp["CeilingToFloor"] : undefined);
                                                    if (temp["CeilingToFloor"] !== undefined) {
                                                        tempLabels["3G"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                    }
                                                    
                                                    depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "3C,") + (temp["ExtensionLeft"] !== undefined ? "" : "3D1,") + (temp["ExtensionRight"] !== undefined ? "" : "3D2,") + (tempHeight !== undefined ? "" : "3EStandardCeilingFloor1,") + (tempHeight2 !== undefined ? "" : "3EStandardCeilingFloor2,") + (tempHeight3 !== undefined ? "" : "3EStandardCeilingFloor3,") + (selectValues["CeilingToFloor"] !== undefined ? "" : "3G,"), "31,3A,3B,3B1", depSetTempArr)]);
                                                    
                                                } else if (scenario === 6) {
                                                    let tempWidth = changeLang ? temp["Width3C"] : temp["Width"];
                                                    let tempHeight = changeLang ? temp["WindowToFloor"] : temp["Height"];
                                                    
                                                    // selectValues["Width3C"] = tempWidth ? [{value: tempWidth}] : [];
                                                    setWidth3C(tempWidth ? tempWidth : undefined);
                                                    if (tempWidth) {
                                                        tempLabels["3C"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                    }
                                                    
                                                    // selectValues["WindowToFloor"] = tempHeight ? [{value: tempHeight}] : [];
                                                    setWindowToFloor(tempHeight ? tempHeight : undefined);
                                                    if (tempHeight) {
                                                        tempLabels["3EFloor"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempHeight}`) + postfixFa : tempHeight + postfixEn;
                                                    }
                                                    
                                                    // selectValues["ShadeMount"] = temp["ShadeMount"] ? [{value: temp["ShadeMount"]}] : [];
                                                    setMount(temp["ShadeMount"] ? temp["ShadeMount"] : undefined);
                                                    if (temp["ShadeMount"] !== undefined) {
                                                        tempLabels["3F"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["ShadeMount"]}`) + postfixFa : temp["ShadeMount"] + postfixEn;
                                                    }
                                                    
                                                    // selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                    setCeilingToFloor(temp["CeilingToFloor"] ? temp["CeilingToFloor"] : undefined);
                                                    if (temp["CeilingToFloor"] !== undefined) {
                                                        tempLabels["3G"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                    }
                                                    
                                                    depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "3C,") + (tempHeight !== undefined ? "" : "3EFloor,") + +(selectValues["ShadeMount"] !== undefined ? "" : "3F,") + (selectValues["CeilingToFloor"] !== undefined ? "" : "3G,"), "31,3A,3B,3B1", depSetTempArr)]);
                                                    
                                                } else if (scenario === 7) {
                                                    let tempWidth = changeLang ? temp["Width3C"] : temp["Width"];
                                                    
                                                    // selectValues["Width3C"] = tempWidth ? [{value: tempWidth}] : [];
                                                    setWidth3C(tempWidth ? tempWidth : undefined);
                                                    if (tempWidth) {
                                                        tempLabels["3C"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                    }
                                                    let tempHeight = changeLang ? temp["CeilingToWindow1"] : temp["Height"];
                                                    let tempHeight2 = changeLang ? temp["CeilingToWindow2"] : temp["Height2"];
                                                    let tempHeight3 = changeLang ? temp["CeilingToWindow3"] : temp["Height3"];
                                                    // selectValues["CeilingToWindow1"] = tempHeight ? [{value: tempHeight}] : [];
                                                    // selectValues["CeilingToWindow2"] = tempHeight2 ? [{value: tempHeight2}] : [];
                                                    // selectValues["CeilingToWindow3"] = tempHeight3 ? [{value: tempHeight3}] : [];
                                                    setCeilingToWindow1(tempHeight ? tempHeight : undefined);
                                                    setCeilingToWindow2(tempHeight2 ? tempHeight2 : undefined);
                                                    setCeilingToWindow3(tempHeight3 ? tempHeight3 : undefined);
                                                    if (tempHeight && tempHeight2 && tempHeight3) {
                                                        let tempMax = Math.min(tempHeight, tempHeight2, tempHeight3);
                                                        tempLabels["3EStandardCeilingFloor"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMax}`) + postfixFa : tempMax + postfixEn;
                                                    }
                                                    
                                                    // selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                    setCeilingToFloor(temp["CeilingToFloor"] ? temp["CeilingToFloor"] : undefined);
                                                    if (temp["CeilingToFloor"] !== undefined) {
                                                        tempLabels["3G"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                    }
                                                    
                                                    depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "3C,") + (tempHeight !== undefined ? "" : "3EStandardCeilingFloor1,") + (tempHeight2 !== undefined ? "" : "3EStandardCeilingFloor2,") + (tempHeight3 !== undefined ? "" : "3EStandardCeilingFloor3,") + (selectValues["CeilingToFloor"] !== undefined ? "" : "3G,"), "31,3A,3B,3B1", depSetTempArr)]);
                                                    
                                                } else {
                                                    let tempWidth = changeLang ? temp["Width3C"] : temp["Width"];
                                                    let tempHeight = changeLang ? temp["WindowToFloor"] : temp["Height"];
                                                    
                                                    // selectValues["Width3C"] = tempWidth ? [{value: tempWidth}] : [];
                                                    setWidth3C(tempWidth ? tempWidth : undefined);
                                                    if (tempWidth) {
                                                        tempLabels["3C"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                    }
                                                    
                                                    // selectValues["left"] = temp["ExtensionLeft"] ? [{value: temp["ExtensionLeft"]}] : [];
                                                    // selectValues["right"] = temp["ExtensionRight"] ? [{value: temp["ExtensionRight"]}] : [];
                                                    setLeft(temp["ExtensionLeft"] ? temp["ExtensionLeft"] : undefined);
                                                    setRight(temp["ExtensionRight"] ? temp["ExtensionRight"] : undefined);
                                                    if (temp["ExtensionLeft"] !== undefined && temp["ExtensionRight"] !== undefined) {
                                                        tempLabels["3D"] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionRight"]}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionLeft"]}`) + postfixFa}` : `Left: ${temp["ExtensionLeft"] + postfixEn}\u00A0\u00A0\u00A0Right: ${temp["ExtensionRight"] + postfixEn}`;
                                                    }
                                                    
                                                    // selectValues["WindowToFloor"] = tempHeight ? [{value: tempHeight}] : [];
                                                    setWindowToFloor(tempHeight ? tempHeight : undefined);
                                                    if (tempHeight) {
                                                        tempLabels["3EFloor"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempHeight}`) + postfixFa : tempHeight + postfixEn;
                                                    }
                                                    
                                                    // selectValues["ShadeMount"] = temp["ShadeMount"] ? [{value: temp["ShadeMount"]}] : [];
                                                    setMount(temp["ShadeMount"] ? temp["ShadeMount"] : undefined);
                                                    if (temp["ShadeMount"] !== undefined) {
                                                        tempLabels["3F"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["ShadeMount"]}`) + postfixFa : temp["ShadeMount"] + postfixEn;
                                                    }
                                                    
                                                    // selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                    setCeilingToFloor(temp["CeilingToFloor"] ? temp["CeilingToFloor"] : undefined);
                                                    if (temp["CeilingToFloor"] !== undefined) {
                                                        tempLabels["3G"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                    }
                                                    
                                                    depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "3C,") + (temp["ExtensionLeft"] !== undefined ? "" : "3D1,") + (temp["ExtensionRight"] !== undefined ? "" : "3D2,") + (tempHeight !== undefined ? "" : "3EFloor,") + +(selectValues["ShadeMount"] !== undefined ? "" : "3F,") + (selectValues["CeilingToFloor"] !== undefined ? "" : "3G,"), "31,3A,3B,3B1", depSetTempArr)]);
                                                    
                                                }
                                                setSelectCustomValues(selectValues);
                                                setStepSelectedLabel(tempLabels);
                                                setStepSelectedValue(tempValue);
                                            } else {
                                                depSetTempArr = new Set([...setGetDeps((temp["Mount"] ? "" : "3A1,") + (temp["FinishedLengthType"] ? "" : "3B,") + "3A", "3,31", depSetTempArr)]);
                                            }
                                        }, 100);
                                    } else {
                                        if (temp["FinishedLengthType"]) {
                                            setStep3ARod(temp["FinishedLengthType"].toString());
                                            if (temp["FinishedLengthType"] === "Sill" || temp["FinishedLengthType"] === "Apron") {
                                                if (temp["FinishedLengthType"] === "Sill") {
                                                    let refIndex = inputs.current["3ARod1"].getAttribute('ref-num');
                                                    tempLabels[refIndex] = inputs.current["3ARod1"].getAttribute('text');
                                                    tempValue[refIndex] = inputs.current["3ARod1"].value;
                                                } else {
                                                    let refIndex = inputs.current["3ARod11"].getAttribute('ref-num');
                                                    tempLabels[refIndex] = inputs.current["3ARod11"].getAttribute('text');
                                                    tempValue[refIndex] = inputs.current["3ARod11"].value;
                                                    setStep3ARod1("true");
                                                }
                                                
                                                let tempWidth = changeLang ? temp["RodWidth"] : temp["Width"];
                                                let tempHeight = changeLang ? temp["RodToBottom"] : temp["Height"];
                                                
                                                // selectValues["RodWidth"] = tempWidth ? [{value: tempWidth}] : [];
                                                setRodWidth(tempWidth ? tempWidth : undefined);
                                                if (tempWidth) {
                                                    tempLabels["3BRod"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                }
                                                
                                                // selectValues["RodToBottom"] = tempHeight ? [{value: tempHeight}] : [];
                                                setRodToBottom(tempHeight ? tempHeight : undefined);
                                                if (tempHeight) {
                                                    tempLabels["3CRod"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempHeight}`) + postfixFa : tempHeight + postfixEn;
                                                }
                                                
                                                // selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                setCeilingToFloor(temp["CeilingToFloor"] ? temp["CeilingToFloor"] : undefined);
                                                if (temp["CeilingToFloor"] !== undefined) {
                                                    tempLabels["3DRod"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                }
                                                
                                                depSetTempArr = new Set([...setGetDeps((tempWidth !== undefined ? "" : "3BRod,") + (tempHeight !== undefined ? "" : "3CRod,") + (temp["CeilingToFloor"] !== undefined ? "" : "3DRod,"), "31,3ARod,3ARod1", depSetTempArr)]);
                                                setSelectCustomValues(selectValues);
                                                setStepSelectedLabel(tempLabels);
                                                setStepSelectedValue(tempValue);
                                                
                                            } else {
                                                if (temp["FinishedLengthType"] === "Floor") {
                                                    let refIndex = inputs.current["3ARod3"].getAttribute('ref-num');
                                                    tempLabels[refIndex] = inputs.current["3ARod3"].getAttribute('text');
                                                    tempValue[refIndex] = inputs.current["3ARod3"].value;
                                                } else {
                                                    let refIndex = inputs.current["3ARod4"].getAttribute('ref-num');
                                                    tempLabels[refIndex] = inputs.current["3ARod4"].getAttribute('text');
                                                    tempValue[refIndex] = inputs.current["3ARod4"].value;
                                                }
                                                
                                                let tempWidth = changeLang ? temp["RodWidth"] : temp["Width"];
                                                let tempHeight = changeLang ? temp["RodToFloor"] : temp["Height"];
                                                
                                                // selectValues["RodWidth"] = tempWidth ? [{value: tempWidth}] : [];
                                                setRodWidth(tempWidth ? tempWidth : undefined);
                                                if (tempWidth) {
                                                    tempLabels["3BRod"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                                }
                                                
                                                // selectValues["RodToFloor"] = tempHeight ? [{value: tempHeight}] : [];
                                                setRodToFloor(tempHeight ? tempHeight : undefined);
                                                if (tempHeight) {
                                                    tempLabels["3CRodFloor"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempHeight}`) + postfixFa : tempHeight + postfixEn;
                                                }
                                                
                                                // selectValues["CeilingToFloor"] = temp["CeilingToFloor"] ? [{value: temp["CeilingToFloor"]}] : [];
                                                setCeilingToFloor(temp["CeilingToFloor"] ? temp["CeilingToFloor"] : undefined);
                                                if (temp["CeilingToFloor"] !== undefined) {
                                                    tempLabels["3DRod"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["CeilingToFloor"]}`) + postfixFa : temp["CeilingToFloor"] + postfixEn;
                                                }
                                                
                                                depSetTempArr = new Set([...setGetDeps((tempWidth !== undefined ? "" : "3BRod,") + (tempHeight !== undefined ? "" : "3CRodFloor,") + (temp["CeilingToFloor"] !== undefined ? "" : "3DRod,"), "31,3ARod", depSetTempArr)]);
                                                setSelectCustomValues(selectValues);
                                                setStepSelectedLabel(tempLabels);
                                                setStepSelectedValue(tempValue);
                                                
                                            }
                                        } else {
                                            depSetTempArr = new Set([...setGetDeps("3ARod", "", depSetTempArr)]);
                                        }
                                        
                                    }
                                } else {
                                    depSetTempArr = new Set([...setGetDeps("31", "3", depSetTempArr)]);
                                }
                            }
                        }
                        if (temp["WindowWidth"] && temp["WindowHeight"]) {
                            getWindowSize(temp["WindowWidth"], temp["WindowHeight"]);
                        }
    
                        if (temp["Lining"]) {
                            setStep4(temp["Lining"]);
                            if (temp["Lining"] === "Standard Lining") {
                                let refIndex = inputs.current["41"].getAttribute('ref-num');
                                tempLabels[refIndex] = inputs.current["41"].getAttribute('text');
                                tempValue[refIndex] = inputs.current["41"].value;
                            } else {
                                let refIndex = inputs.current["42"].getAttribute('ref-num');
                                tempLabels[refIndex] = inputs.current["42"].getAttribute('text');
                                tempValue[refIndex] = inputs.current["42"].value;
                            }
                            depSetTempArr = new Set([...setGetDeps("", "4", depSetTempArr)]);
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                        }
    
                        if (temp["PanelCoverage"]) {
                            setStep5(temp["PanelCoverage"]);
                            if (temp["PanelCoverage"] === "Full") {
                                let refIndex = inputs.current["51"].getAttribute('ref-num');
                                tempLabels[refIndex] = inputs.current["51"].getAttribute('text');
                                tempValue[refIndex] = inputs.current["51"].value;
                            } else {
                                let refIndex = inputs.current["52"].getAttribute('ref-num');
                                tempLabels[refIndex] = inputs.current["52"].getAttribute('text');
                                tempValue[refIndex] = inputs.current["52"].value;
                            }
                            depSetTempArr = new Set([...setGetDeps("", "5", depSetTempArr)]);
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                        }
    
                        if (temp["PanelTypeA"]) {
                            setStep61(temp["PanelTypeA"]);
                            let refIndex = inputs.current["611"].getAttribute('ref-num');
                            tempExtended[refIndex][0] = <li key="2" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("All Curtains")}</span><span className="step_title_extended_list_item_text">{t(temp["PanelTypeA"])}</span></li>;
                            depSetTempArr = new Set([...setGetDeps("", "61", depSetTempArr)]);
                        }
    
                        if (temp["GrommetFinish"]) {
                            setStep7(temp["GrommetFinish"]);
                            if (temp["GrommetFinish"] === "Satin Brass") {
                                let refIndex = inputs.current["71"].getAttribute('ref-num');
                                tempLabels[refIndex] = inputs.current["71"].getAttribute('text');
                                tempValue[refIndex] = inputs.current["71"].value;
                            } else if (temp["GrommetFinish"] === "Satin Nickel") {
                                let refIndex = inputs.current["72"].getAttribute('ref-num');
                                tempLabels[refIndex] = inputs.current["72"].getAttribute('text');
                                tempValue[refIndex] = inputs.current["72"].value;
                            } else {
                                let refIndex = inputs.current["73"].getAttribute('ref-num');
                                tempLabels[refIndex] = inputs.current["73"].getAttribute('text');
                                tempValue[refIndex] = inputs.current["73"].value;
                            }
                            depSetTempArr = new Set([...setGetDeps("", "7", depSetTempArr)]);
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                        }
                        
                        if (temp["Hardware"]) {
                            setStep8(temp["Hardware"]);
                            if (temp["Hardware"] === "I Have My Own Hardware") {
                                let refIndex = inputs.current["81"].getAttribute('ref-num');
                                tempLabels[refIndex] = inputs.current["81"].getAttribute('text');
                                tempValue[refIndex] = inputs.current["81"].value;
                                tempExtended["8"] = [];
                                depSetTempArr = new Set([...setGetDeps("", "8", depSetTempArr)]);
                            } else if (temp["Hardware"] === "Same Hardware For All Curtains") {
                                let refIndex = inputs.current["82"].getAttribute('ref-num');
                                tempLabels[refIndex] = inputs.current["82"].getAttribute('text');
                                tempValue[refIndex] = inputs.current["82"].value;
                                tempExtended["8"] = [t("hardware2_drapery")];
                                
                                if (temp["RailDesignA"]) {
                                    setStep81(temp["RailDesignA"]);
                                    let railObject = {};
                                    railObject = rails.filter(obj => {
                                        return obj["RailId"] === temp["RailDesignA"]
                                    })[0] || railObject;
                                    
                                    if (railObject["DesignENName"]) {
                                        tempExtended["8"][1] = <li key="1" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Design")}</span><span className="step_title_extended_list_item_text">{pageLanguage === "fa" ? convertToPersian(railObject["DesignName"]) : railObject["DesignENName"]}</span></li>;
                                    }
                                    
                                    if (temp["RailIdA"]) {
                                        setStep82(temp["RailIdA"]);
                                        
                                        let railObject2 = {};
                                        railObject2 = rails.filter(obj => {
                                            return obj["RailId"] === temp["RailIdA"]
                                        })[0] || railObject2;
                                        
                                        if (railObject["DesignENName"] && railObject2["ColorName"] && railObject2["ColorEnName"]) {
                                            tempExtended["8"][2] = <li key="2" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Finish")}</span><span className="step_title_extended_list_item_text">{pageLanguage === "fa" ? convertToPersian(railObject2["ColorName"]) : railObject2["ColorEnName"]}</span></li>;
                                        }
                                    }
                                    
                                    showRodsColor(railObject, "82");
                                    
                                    if (temp["BatonOptionA"]) {
                                        setStep83(temp["BatonOptionA"]);
                                        if (temp["BatonOptionA"] === "None") {
                                            tempExtended["8"][3] = <li key="3" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Baton")}</span><span className="step_title_extended_list_item_text">{t("None")}</span></li>;
                                        } else if (temp["BatonOptionA"] === "Baton 30cm") {
                                            tempExtended["8"][3] = <li key="3" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Baton")}</span><span className="step_title_extended_list_item_text">{t("Baton 30cm")}</span></li>;
                                        } else if (temp["BatonOptionA"] === "Baton 45cm") {
                                            tempExtended["8"][3] = <li key="3" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Baton")}</span><span className="step_title_extended_list_item_text">{t("Baton 45cm")}</span></li>;
                                        } else {
                                            tempExtended["8"][3] = <li key="3" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Baton")}</span><span className="step_title_extended_list_item_text">{t("Cord")}</span></li>;
                                        }
                                    }
                                }
                                depSetTempArr = new Set([...setGetDeps((temp["RailDesignA"] !== undefined ? "" : "81,") + (temp["RailIdA"] !== undefined ? "" : "82,") + (temp["BatonOptionA"] !== undefined ? "" : "83,"), "8", depSetTempArr)]);
                                
                            }
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                        }
                        
                        if (temp["RoomNameEn"]) {
                            setSavedProjectRoomLabel(temp["RoomNameEn"]);
                            
                            depSetTempArr = new Set([...setGetDeps("", "101", depSetTempArr)]);
                            setSelectedRoomLabel(temp["RoomNameEn"] ? [{
                                value: temp["RoomNameEn"],
                                label: rooms[pageLanguage].find(opt => opt.value === temp["RoomNameEn"]).label
                            }] : []);
                            tempSelect.label = rooms[pageLanguage].find(opt => opt.value === temp["RoomNameEn"]).label;
                            tempSelect.value = temp["RoomNameEn"];
                            setRoomLabelSelect(tempSelect);
                            if (temp["WindowName"] === undefined || (temp["WindowName"] && temp["WindowName"] === "")) {
                                tempLabels["10"] = tempSelect.label;
                            } else if (temp["WindowName"]) {
                                tempLabels["10"] = tempSelect.label + " - " + temp["WindowName"];
                            }
                            setStepSelectedLabel(tempLabels);
                        }
                        if (temp["WindowName"] && temp["WindowName"] !== "") {
                            setSavedProjectRoomText(temp["WindowName"]);
                            depSetTempArr = new Set([...setGetDeps("", "102", depSetTempArr)]);
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
                            setExtendedTitle(tempExtended);
                            setPageLoad(false);
                        }, 300);
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
    
    // const MotorType = {
    //     "en": [
    //         {value: 'Standard', label: 'Standard'},
    //         {value: 'Smart', label: 'Smart'}
    //     ],
    //     "fa": [
    //         {value: 'Standard', label: 'استاندارد'},
    //         {value: 'Smart', label: 'هوشمند'}
    //     ],
    //
    // };
    
    const [MotorType, setMotorType] = useState({
        "en": [
            {value: 'Standard', label: 'Standard'},
            {value: 'Smart', label: 'Smart'}
        ],
        "fa": [
            {value: 'Standard', label: 'استاندارد'},
            {value: 'Smart', label: 'هوشمند'}
        ],
        
    });
    
    const optionsOutside = {
        "en": [{value: 'Wall', label: 'Wall'}, {value: 'Ceiling', label: 'Ceiling'}], "fa": [{value: 'Wall', label: 'دیوار'}, {value: 'Ceiling', label: 'سقف'}],
        
    };
    
    useEffect(() => {
        if (Object.keys(modelAccessories).length > 0 && widthCart && heightCart && fabricQty > 0) {
            // let qty=widthCart*heightCart/10000;
            let qty = fabricQty;
            let tempObj = {
                "en": [
                    {
                        value: 'Standard',
                        label: (modelAccessories["17"] && modelAccessories["17"]["1"] && qty > modelAccessories["17"]["1"]["FromQty"] && qty <= modelAccessories["17"]["1"]["ToQty"]) ? "Standard (" + GetPrice(modelAccessories["17"]["1"]["Price"], pageLanguage, t("TOMANS")) + ")" : ((modelAccessories["17"] && modelAccessories["17"]["14"] && qty > modelAccessories["17"]["14"]["FromQty"] && qty <= modelAccessories["17"]["14"]["ToQty"]) ? "Standard (" + GetPrice(modelAccessories["17"]["14"]["Price"], pageLanguage, t("TOMANS")) + ")" : ""),
                        apiAccValue: (modelAccessories["17"] && modelAccessories["17"]["1"] && qty > modelAccessories["17"]["1"]["FromQty"] && qty <= modelAccessories["17"]["1"]["ToQty"]) ? {
                                "SewingAccessoryId": 17,
                                "SewingModelAccessoryId": 0,
                                "SewingAccessoryValue": "61500508",
                                "Qty": 1
                            }
                            : ((modelAccessories["17"] && modelAccessories["17"]["14"] && qty > modelAccessories["17"]["14"]["FromQty"] && qty <= modelAccessories["17"]["14"]["ToQty"]) ? {
                                "SewingAccessoryId": 17,
                                "SewingModelAccessoryId": 0,
                                "SewingAccessoryValue": "61500507",
                                "Qty": 1
                            } : "")
                    },
                    {
                        value: 'Smart',
                        label: (modelAccessories["18"] && modelAccessories["18"]["15"] && qty > modelAccessories["18"]["15"]["FromQty"] && qty <= modelAccessories["18"]["15"]["ToQty"]) ? "Smart (" + GetPrice(modelAccessories["18"]["15"]["Price"], pageLanguage, t("TOMANS")) + ")" : ((modelAccessories["18"] && modelAccessories["18"]["16"] && qty > modelAccessories["18"]["16"]["FromQty"] && qty <= modelAccessories["18"]["16"]["ToQty"]) ? "Smart (" + GetPrice(modelAccessories["18"]["16"]["Price"], pageLanguage, t("TOMANS")) + ")" : ""),
                        apiAccValue: (modelAccessories["18"] && modelAccessories["18"]["15"] && qty > modelAccessories["18"]["15"]["FromQty"] && qty <= modelAccessories["18"]["15"]["ToQty"]) ? {
                                "SewingAccessoryId": 18,
                                "SewingModelAccessoryId": 0,
                                "SewingAccessoryValue": "61500518",
                                "Qty": 1
                            }
                            : ((modelAccessories["18"] && modelAccessories["18"]["16"] && qty > modelAccessories["18"]["16"]["FromQty"] && qty <= modelAccessories["18"]["16"]["ToQty"]) ? {
                                "SewingAccessoryId": 18,
                                "SewingModelAccessoryId": 0,
                                "SewingAccessoryValue": "61500517",
                                "Qty": 1
                            } : "")
                    }
                ],
                "fa": [
                    {
                        value: 'Standard',
                        label: (modelAccessories["17"] && modelAccessories["17"]["1"] && qty > modelAccessories["17"]["1"]["FromQty"] && qty <= modelAccessories["17"]["1"]["ToQty"]) ? "استاندارد (" + GetPrice(modelAccessories["17"]["1"]["Price"], pageLanguage, t("TOMANS")) + ")" : ((modelAccessories["17"] && modelAccessories["17"]["14"] && qty > modelAccessories["17"]["14"]["FromQty"] && qty <= modelAccessories["17"]["14"]["ToQty"]) ? "استاندارد (" + GetPrice(modelAccessories["17"]["14"]["Price"], pageLanguage, t("TOMANS")) + ")" : ""),
                        apiAccValue: (modelAccessories["17"] && modelAccessories["17"]["1"] && qty > modelAccessories["17"]["1"]["FromQty"] && qty <= modelAccessories["17"]["1"]["ToQty"]) ? {
                                "SewingAccessoryId": 17,
                                "SewingModelAccessoryId": 0,
                                "SewingAccessoryValue": "61500508",
                                "Qty": 1
                            }
                            : ((modelAccessories["17"] && modelAccessories["17"]["14"] && qty > modelAccessories["17"]["14"]["FromQty"] && qty <= modelAccessories["17"]["14"]["ToQty"]) ? {
                                "SewingAccessoryId": 17,
                                "SewingModelAccessoryId": 0,
                                "SewingAccessoryValue": "61500507",
                                "Qty": 1
                            } : "")
                    },
                    {
                        value: 'Smart',
                        label: (modelAccessories["18"] && modelAccessories["18"]["15"] && qty > modelAccessories["18"]["15"]["FromQty"] && qty <= modelAccessories["18"]["15"]["ToQty"]) ? "هوشمند (" + GetPrice(modelAccessories["18"]["15"]["Price"], pageLanguage, t("TOMANS")) + ")" : ((modelAccessories["18"] && modelAccessories["18"]["16"] && qty > modelAccessories["18"]["16"]["FromQty"] && qty <= modelAccessories["18"]["16"]["ToQty"]) ? "هوشمند (" + GetPrice(modelAccessories["18"]["16"]["Price"], pageLanguage, t("TOMANS")) + ")" : ""),
                        apiAccValue: (modelAccessories["18"] && modelAccessories["18"]["15"] && qty > modelAccessories["18"]["15"]["FromQty"] && qty <= modelAccessories["18"]["15"]["ToQty"]) ? {
                                "SewingAccessoryId": 18,
                                "SewingModelAccessoryId": 0,
                                "SewingAccessoryValue": "61500518",
                                "Qty": 1
                            }
                            : ((modelAccessories["18"] && modelAccessories["18"]["16"] && qty > modelAccessories["18"]["16"]["FromQty"] && qty <= modelAccessories["18"]["16"]["ToQty"]) ? {
                                "SewingAccessoryId": 18,
                                "SewingModelAccessoryId": 0,
                                "SewingAccessoryValue": "61500517",
                                "Qty": 1
                            } : "")
                    }
                ],
                
            }
            let tempStandardPrice = (modelAccessories["17"] && modelAccessories["17"]["1"] && qty > modelAccessories["17"]["1"]["FromQty"] && qty <= modelAccessories["17"]["1"]["ToQty"]) ? modelAccessories["17"]["1"]["Price"] : ((modelAccessories["17"] && modelAccessories["17"]["14"] && qty > modelAccessories["17"]["14"]["FromQty"] && qty <= modelAccessories["17"]["14"]["ToQty"]) ? modelAccessories["17"]["14"]["Price"] : 0);
            let tempSmartPrice = (modelAccessories["18"] && modelAccessories["18"]["15"] && qty > modelAccessories["18"]["15"]["FromQty"] && qty <= modelAccessories["18"]["15"]["ToQty"]) ? modelAccessories["18"]["15"]["Price"] : ((modelAccessories["18"] && modelAccessories["18"]["16"] && qty > modelAccessories["18"]["16"]["FromQty"] && qty <= modelAccessories["18"]["16"]["ToQty"]) ? modelAccessories["18"]["16"]["Price"] : 0);
            setMotorType(tempObj);
            // console.log(selectedMotorType);
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
            setSelectedMotorMinPrice(Math.min(tempStandardPrice, tempSmartPrice));
            // setCart("", "", "MotorType");
            // if (stepSelectedValue["41"] === "1" && stepSelectedValue["4"] === "2") {
            //     setDeps("411", "");
            // }
        }
        // console.log(Object.keys(modelAccessories).length > 0, widthCart, heightCart);
    }, [widthCart, heightCart, JSON.stringify(modelAccessories), fabricQty]);
    
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
    
    const draperiesSelect = {
        "en": [
            {value: 'I Have 25mm Rod', label: '25mm Rod'},
            {value: 'I Have 28mm Rod', label: '28mm Rod'},
            {value: 'I Have Standard Track', label: 'Standard Track'},
            {value: 'I Have Track With Cord Draw', label: 'Track With Cord Draw'},
            {value: 'I Have Motorized Track', label: 'Motorized Track'},
            {value: 'I Have Others', label: 'Others'}
        ],
        "fa": [
            {value: 'I Have 25mm Rod', label: 'میله ۲۵ میلی متری'},
            {value: 'I Have 28mm Rod', label: 'میله ۲۸ میلی متری'},
            {value: 'I Have Standard Track', label: 'ریل استاندارد'},
            {value: 'I Have Track With Cord Draw', label: 'ریل با طناب کشی'},
            {value: 'I Have Motorized Track', label: 'ریل موتوری'},
            {value: 'I Have Others', label: 'متفرقه'}
        ]
    };
    
    const sheersSelect = {
        "en": [
            {value: 'I Have 25mm Rod', label: '25mm Rod'},
            {value: 'I Have 28mm Rod', label: '28mm Rod'},
            {value: 'I Have Standard Track', label: 'Standard Track'},
            {value: 'I Have Track With Cord Draw', label: 'Track With Cord Draw'},
            {value: 'I Have Motorized Track', label: 'Motorized Track'},
            {value: 'I Have Others', label: 'Others'}
        ],
        "fa": [
            {value: 'I Have 25mm Rod', label: 'میله ۲۵ میلی متری'},
            {value: 'I Have 28mm Rod', label: 'میله ۲۸ میلی متری'},
            {value: 'I Have Standard Track', label: 'ریل استاندارد'},
            {value: 'I Have Track With Cord Draw', label: 'ریل با طناب کشی'},
            {value: 'I Have Motorized Track', label: 'ریل موتوری'},
            {value: 'I Have Others', label: 'متفرقه'}
        ]
    };
    const privacyLayerSelect = {
        "en": [
            {value: 'I Have 25mm Rod', label: '25mm Rod'},
            {value: 'I Have 28mm Rod', label: '28mm Rod'},
            {value: 'I Have Standard Track', label: 'Standard Track'},
            {value: 'I Have Track With Cord Draw', label: 'Track With Cord Draw'},
            {value: 'I Have Motorized Track', label: 'Motorized Track'},
            {value: 'I Have Others', label: 'Others'}
        ],
        "fa": [
            {value: 'I Have 25mm Rod', label: 'میله ۲۵ میلی متری'},
            {value: 'I Have 28mm Rod', label: 'میله ۲۸ میلی متری'},
            {value: 'I Have Standard Track', label: 'ریل استاندارد'},
            {value: 'I Have Track With Cord Draw', label: 'ریل با طناب کشی'},
            {value: 'I Have Motorized Track', label: 'ریل موتوری'},
            {value: 'I Have Others', label: 'متفرقه'}
        ]
    };
    const [selectedMotorChannels, setSelectedMotorChannels] = useState([motorChannels[pageLanguage].find(opt => opt.value === '0')]);
    const [selectedMotorPosition, setSelectedMotorPosition] = useState([]);
    const [selectedRemoteName, setSelectedRemoteName] = useState([]);
    const [selectedMotorType, setSelectedMotorType] = useState([]);
    const [selectedMotorMinPrice, setSelectedMotorMinPrice] = useState(0);
    const [selectedDrapery, setSelectedDrapery] = useState([]);
    const [selectedSheer, setSelectedSheer] = useState([]);
    const [selectedPrivacyLayer, setSelectedPrivacyLayer] = useState([]);
    
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
        if (!pageLoad) {
            if (step61 !== "") {
                setStep61("");
                setDeps("61", "");
                setCart("", "", "PanelTypeA");
            }
            selectChanged(undefined, "6");
            if (widthCart && parseInt(widthCart) > 0) {
                getRails(parseInt(widthCart));
            }
        }
    }, [widthCart]);
    
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
            // setDeps("", "1");
            setStep1(fabricSelected.selectedFabricId.toString());
            
            let tempExtended = extendedTitle;
            tempExtended["1"][0] = tempLabels["1"];
            
            let temp = JSON.parse(JSON.stringify(requiredStep));
            if (tempLabels["1"] !== "" && requiredStep["1"]) {
                temp["1"] = false;
            }
            setRequiredStep(temp);
            
            if (step1Check !== `${fabricSelected.selectedDesignCode}`) {
                setStep1Check("");
                setStep1Border("");
                setStep1BorderRadio("");
                setStep1Trim("");
                tempExtended["1"].splice(1, 1);
                setDeps("", "1,11,111");
            } else {
                setDeps("", "1");
            }
            setExtendedTitle(tempExtended);
        }
    }, [fabricSelected]);
    
    useEffect(() => {
        if (fabricSelected2.selectedFabricId && fabricSelected2.selectedFabricId !== 0) {
            fabricClicked(fabricSelected2.selectedPhoto, fabricSelected2.selectedHasTrim);
            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
            tempLabels["2"] = location.pathname.split('').slice(1, 3).join('') === "fa" ? fabricSelected2.selectedTextFa + "/" + fabricSelected2.selectedColorFa : fabricSelected2.selectedTextEn + "/" + fabricSelected2.selectedColorEn;
            let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
            tempValue["2"] = fabricSelected2.selectedFabricId;
            setStepSelectedLabel(tempLabels);
            setStepSelectedValue(tempValue);
            // setCart("FabricId", fabricSelected2.selectedFabricId);
            setCart("FabricId2", `${fabricSelected2.selectedFabricId}`, "", "FabricDesignFa2,FabricDesignEn2,FabricColorEn2,FabricColorFa2,PhotoUrl2", [fabricSelected2.selectedTextFa, fabricSelected2.selectedTextEn, fabricSelected2.selectedColorEn, fabricSelected2.selectedColorFa, fabricSelected2.selectedPhoto]);
            // setCart("PhotoUrl", fabricSelected2.selectedPhoto);
            setDeps("", "2");
            setStep2(fabricSelected2.selectedFabricId.toString());
            
            let tempExtended = extendedTitle;
            tempExtended["2"][0] = tempLabels["2"];
            
            let temp = JSON.parse(JSON.stringify(requiredStep));
            if (tempLabels["2"] !== "" && requiredStep["2"]) {
                temp["2"] = false;
            }
            setRequiredStep(temp);
            
            if (step2Check !== `${fabricSelected2.selectedDesignCode}`) {
                setStep2Check("");
                setStep2Border("");
                setStep2BorderRadio("");
                setStep2Trim("");
                tempExtended["2"].splice(1, 1);
            }
            setExtendedTitle(tempExtended);
        }
    }, [fabricSelected2]);
    
    useEffect(() => {
        if (borderSelected.selectedFabricId) {
            setCart("BorderOrTrimId", `${borderSelected.selectedFabricId}`, "", "BorderOrTrimDesignFa,BorderOrTrimDesignEn,BorderOrTrimColorEn,BorderOrTrimColorFa,BorderOrTrimPhotoUrl", [borderSelected.selectedTextFa, borderSelected.selectedTextEn, borderSelected.selectedColorEn, borderSelected.selectedColorFa, borderSelected.selectedPhoto]);
            
            setStep1Border(borderSelected.selectedFabricId.toString());
            setStep1Trim("");
            setDeps("111", "11");
            
            let tempExtended = extendedTitle;
            tempExtended["1"][1] = <li key="1" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Decorative Border")}</span><span className="step_title_extended_list_item_text">{location.pathname.split('').slice(1, 3).join('') === "fa" ? borderSelected.selectedTextFa + "/" + borderSelected.selectedColorFa : borderSelected.selectedTextEn + "/" + borderSelected.selectedColorEn}</span></li>;
            setExtendedTitle(tempExtended);
        }
    }, [borderSelected]);
    
    useEffect(() => {
        if (trimSelected.selectedFabricId) {
            setCart("BorderOrTrimId", `${trimSelected.selectedFabricId}`, "", "BorderOrTrimDesignFa,BorderOrTrimDesignEn,BorderOrTrimColorEn,BorderOrTrimColorFa,BorderOrTrimPhotoUrl", [trimSelected.selectedTextFa, trimSelected.selectedTextEn, trimSelected.selectedColorEn, trimSelected.selectedColorFa, trimSelected.selectedPhoto]);
            
            setStep1Border("");
            setStep1Trim(trimSelected.selectedFabricId.toString());
            setDeps("", "11,111");
            
            let tempExtended = extendedTitle;
            tempExtended["1"][1] = <li key="1" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Decorative Trim")}</span><span className="step_title_extended_list_item_text">{location.pathname.split('').slice(1, 3).join('') === "fa" ? trimSelected.selectedTextFa + "/" + trimSelected.selectedColorFa : trimSelected.selectedTextEn + "/" + trimSelected.selectedColorEn}</span></li>;
            tempExtended["1"].splice(2, 1);
            setExtendedTitle(tempExtended);
        }
    }, [trimSelected]);
    
    useEffect(() => {
        if (borderSelected2.selectedFabricId) {
            setCart("BorderOrTrimId2", `${borderSelected2.selectedFabricId}`, "", "BorderOrTrimDesignFa2,BorderOrTrimDesignEn2,BorderOrTrimColorEn2,BorderOrTrimColorFa2,BorderOrTrimPhotoUrl2", [borderSelected2.selectedTextFa, borderSelected2.selectedTextEn, borderSelected2.selectedColorEn, borderSelected2.selectedColorFa, borderSelected2.selectedPhoto]);
            
            setStep2Border(borderSelected2.selectedFabricId.toString());
            setStep2Trim("");
            setDeps("211", "21");
            
            let tempExtended = extendedTitle;
            tempExtended["2"][1] = <li key="1" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Decorative Border")}</span><span className="step_title_extended_list_item_text">{location.pathname.split('').slice(1, 3).join('') === "fa" ? borderSelected2.selectedTextFa + "/" + borderSelected2.selectedColorFa : borderSelected2.selectedTextEn + "/" + borderSelected2.selectedColorEn}</span></li>;
            setExtendedTitle(tempExtended);
        }
    }, [borderSelected2]);
    
    useEffect(() => {
        if (trimSelected2.selectedFabricId) {
            setCart("BorderOrTrimId2", `${trimSelected2.selectedFabricId}`, "", "BorderOrTrimDesignFa2,BorderOrTrimDesignEn2,BorderOrTrimColorEn2,BorderOrTrimColorFa2,BorderOrTrimPhotoUrl2", [trimSelected2.selectedTextFa, trimSelected2.selectedTextEn, trimSelected2.selectedColorEn, trimSelected2.selectedColorFa, trimSelected2.selectedPhoto]);
            
            setStep2Border("");
            setStep2Trim(trimSelected2.selectedFabricId.toString());
            setDeps("", "21,211");
            
            let tempExtended = extendedTitle;
            tempExtended["2"][1] = <li key="1" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Decorative Trim")}</span><span className="step_title_extended_list_item_text">{location.pathname.split('').slice(1, 3).join('') === "fa" ? trimSelected2.selectedTextFa + "/" + trimSelected2.selectedColorFa : trimSelected2.selectedTextEn + "/" + trimSelected2.selectedColorEn}</span></li>;
            tempExtended["2"].splice(2, 1);
            setExtendedTitle(tempExtended);
        }
    }, [trimSelected2]);
    
    useEffect(() => {
        if (sheersSelected.selectedFabricId && sheersSelected.selectedFabricId !== 0) {
            setCart("SheersId1", `${sheersSelected.selectedFabricId}`, "", "SheersDesignFa,SheersDesignEn,SheersColorEn,SheersColorFa,SheersPhotoUrl", [sheersSelected.selectedTextFa, sheersSelected.selectedTextEn, sheersSelected.selectedColorEn, sheersSelected.selectedColorFa, sheersSelected.selectedPhoto]);
            // setCart("SheersId1", `${sheersSelected.selectedFabricId}`);
            setDeps("", "2B1");
            // setStep2B1(sheersSelected.selectedFabricId.toString());
            
            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
            // tempLabels["2B"] = inputs.current["2B2"].getAttribute('text') + " / " + (pageLanguage === "fa" ? sheersSelected.selectedColorFa : sheersSelected.selectedColorEn);
            tempLabels["2B"] = location.pathname.split('').slice(1, 3).join('') === "fa" ? sheersSelected.selectedTextFa + "/" + sheersSelected.selectedColorFa : sheersSelected.selectedTextEn + "/" + sheersSelected.selectedColorEn;
            setStepSelectedLabel(tempLabels);
            
            let temp = JSON.parse(JSON.stringify(requiredStep));
            if (tempLabels["2B"] !== "" && requiredStep["2B"]) {
                temp["2B"] = false;
            }
            setRequiredStep(temp);
        }
    }, [sheersSelected]);
    
    useEffect(() => {
        if (sheersSelected2.selectedFabricId && sheersSelected2.selectedFabricId !== 0) {
            setCart("SheersId2", `${sheersSelected2.selectedFabricId}`, "", "SheersDesignFa,SheersDesignEn,SheersColorEn,SheersColorFa,SheersPhotoUrl", [sheersSelected2.selectedTextFa, sheersSelected2.selectedTextEn, sheersSelected2.selectedColorEn, sheersSelected2.selectedColorFa, sheersSelected2.selectedPhoto]);
            // setCart("SheersId2", `${sheersSelected2.selectedFabricId}`);
            setDeps("", "2B1");
            // setStep2B1(sheersSelected2.selectedFabricId.toString());
            
            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
            // tempLabels["2B"] = inputs.current["2B3"].getAttribute('text') + " / " + (pageLanguage === "fa" ? sheersSelected2.selectedColorFa : sheersSelected2.selectedColorEn);
            tempLabels["2B"] = location.pathname.split('').slice(1, 3).join('') === "fa" ? sheersSelected2.selectedTextFa + "/" + sheersSelected2.selectedColorFa : sheersSelected2.selectedTextEn + "/" + sheersSelected2.selectedColorEn;
            setStepSelectedLabel(tempLabels);
            
            let temp = JSON.parse(JSON.stringify(requiredStep));
            if (tempLabels["2B"] !== "" && requiredStep["2B"]) {
                temp["2B"] = false;
            }
            setRequiredStep(temp);
        }
    }, [sheersSelected2]);
    
    useEffect(() => {
        if (step1BorderRadio !== "") {
            let tempExtended = extendedTitle;
            tempExtended["1"][2] = <li key="2" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Border Position")}</span><span className="step_title_extended_list_item_text">{pageLanguage === 'en' ? CapitalizeAllWords(t(step1BorderRadio)) : t(step1BorderRadio)}</span></li>;
            setExtendedTitle(tempExtended);
            setCart("borderPosition", step1BorderRadio);
            setDeps("", "111");
        } else {
            let tempExtended = extendedTitle;
            tempExtended["1"].splice(2, 1);
            setExtendedTitle(tempExtended);
        }
    }, [step1BorderRadio]);
    
    useEffect(() => {
        if (step2BorderRadio !== "") {
            let tempExtended = extendedTitle;
            tempExtended["2"][2] = <li key="2" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Border Position")}</span><span className="step_title_extended_list_item_text">{pageLanguage === 'en' ? CapitalizeAllWords(t(step2BorderRadio)) : t(step2BorderRadio)}</span></li>;
            setExtendedTitle(tempExtended);
            setCart("borderPosition2", step2BorderRadio);
            setDeps("", "211");
        } else {
            let tempExtended = extendedTitle;
            tempExtended["2"].splice(2, 1);
            setExtendedTitle(tempExtended);
        }
    }, [step2BorderRadio]);
    
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
    }, [step1]);
    
    useEffect(() => {
        if (Object.keys(fabrics).length) {
            renderFabrics(bag);
        } else {
            setFabricsList([]);
        }
    }, [step1Check, step1Border, step1BorderRadio, step1Trim]);
    
    useEffect(() => {
        if (fabricSelected.selectedFabricId && step1Check !== "") {
            setDeps("11", "");
        } else if (fabricSelected.selectedFabricId) {
            setTimeout(() => {
                setDeps("", "11,111");
                setCart("", "", "BorderOrTrimId,BorderOrTrimDesignFa,BorderOrTrimDesignEn,BorderOrTrimColorEn,BorderOrTrimColorFa,BorderOrTrimPhotoUrl,borderPosition");
            }, 500);
        }
    }, [step1Check]);
    
    useEffect(() => {
        if (pageLanguage !== '') {
            if (Object.keys(rods).length) {
                renderRods();
                // renderTracks();
            } else {
                setRodsList([]);
                setTracksList([]);
            }
        }
    }, [step81]);
    
    function showRodsColor(railObject, stepNum) {
        let pageLanguage = location.pathname.split('').slice(1, 3).join('');
        const rodList = [];
        let promiseArr = [];
        if (Object.keys(railObject).length > 0) {
            if (stepNum === "82") {
                rods[railObject["DesignCode"]].forEach((obj, index) => {
                    promiseArr[index] = new Promise((resolve, reject) => {
                        let ColorName = obj["ColorParents"].length ? convertToPersian(obj["ColorParents"][0]["ColorParentName"]) : "Undefined";
                        let ColorEnName = obj["ColorParents"].length ? obj["ColorParents"][0]["ColorParentEnName"] : "Undefined";
                        let RailId = obj["RailId"];
                        let Price = obj["Price"];
                        let PhotoObj = {};
                        PhotoObj = obj["Photos"].filter(obj => {
                            return obj["PhotoTypeId"] === 4709
                        })[0] || PhotoObj;
                        let PhotoPath = PhotoObj["PhotoUrl"] || "";
                        
                        // rodList.push(<div className="box33 radio_style" key={index}>
                        //     <img
                        //         src={`https://api.atlaspood.ir/${PhotoPath}`} className="img-fluid height_auto" alt=""/>
                        //     <input className="radio" type="radio" text={pageLanguage === 'fa' ? ColorName : ColorEnName} value={index} name="step82" ref-num={"82"} id={"82" + index}
                        //            checked={step82 === `${RailId}`}
                        //            onChange={e => {
                        //                setStep82(`${RailId}`);
                        //            }} ref={ref => (inputs.current["82" + index] = ref)}/>
                        //     <label htmlFor={"82" + index}>{pageLanguage === 'fa' ? ColorName : ColorEnName}
                        //         {/*{Price > 0 && <br/>}{Price > 0 && <p>{GetPrice(Price, pageLanguage, t("TOMANS"))}</p>}*/}
                        //     </label>
                        // </div>);
                        
                        rodList.push(
                            <div className="box33" key={index}>
                                <div className="radio_group">
                                    <label className="radio_container">
                                        <input className="radio" type="radio" text={pageLanguage === 'fa' ? ColorName : ColorEnName} value={index} name="step82" ref-num={"82"} id={"82" + index} outline="true"
                                               checked={step82 === `${RailId}`}
                                               onChange={e => {
                                                   setStep82(`${RailId}`);
                                               }} ref={ref => (inputs.current["82" + index] = ref)}/>
                                        <div className="frame_img">
                                            <img src={`https://api.atlaspood.ir/${PhotoPath}`} className="img-fluid bracket_color_img" alt=""/>
                                        </div>
                                    </label>
                                    <div className="radio_group_name_container">
                                        <h1>{pageLanguage === 'fa' ? ColorName : ColorEnName}</h1>
                                    </div>
                                </div>
                            </div>
                        );
                        resolve();
                    });
                });
            }
        }
        
        Promise.all(promiseArr).then(() => {
            if (stepNum === "82") {
                setRodsColorList(rodList);
            }
        });
    }
    
    useEffect(() => {
        if (step81 !== "" && !pageLoad) {
            setDeps("82", "81");
            setStep82("");
            setStep83("");
            // setStep84("");
            
            let railObject = {};
            railObject = rails.filter(obj => {
                return obj["RailId"] === step81
            })[0] || railObject;
            
            if (railObject["DesignENName"]) {
                // let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                // tempLabels["8"] = pageLanguage === "fa" ? railObject["DesignName"] : railObject["DesignENName"];
                // setStepSelectedLabel(tempLabels);
                
                let tempExtended = extendedTitle;
                tempExtended["8"][1] = <li key="1" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Design")}</span><span className="step_title_extended_list_item_text">{pageLanguage === "fa" ? convertToPersian(railObject["DesignName"]) : railObject["DesignENName"]}</span></li>;
                tempExtended["8"].splice(2, 3);
                setExtendedTitle(tempExtended);
            }
            setCart(undefined, undefined, "RailIdA,RailColorFaA,RailColorEnA", "RailDesignA,RailDesignFaA,RailDesignEnA", [step81, railObject["DesignName"], railObject["DesignENName"], step81, railObject["DesignName"], railObject["DesignENName"], step81, railObject["DesignName"], railObject["DesignENName"]]);
            showRodsColor(railObject, "82");
        }
    }, [step81]);
    
    useEffect(() => {
        if (step82 !== "" && !pageLoad) {
            setDeps("", "82");
            
            let railObject = {};
            railObject = rails.filter(obj => {
                return obj["RailId"] === step81
            })[0] || railObject;
            
            let railObject2 = {};
            railObject2 = rails.filter(obj => {
                return obj["RailId"] === step82
            })[0] || railObject2;
            
            if (railObject["DesignENName"] && railObject2["ColorName"] && railObject2["ColorEnName"]) {
                // let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                // tempLabels["8"] = pageLanguage === "fa" ? convertToPersian(railObject["DesignName"]) + " / " + convertToPersian(railObject2["ColorName"]) : railObject["DesignENName"] + " / " + railObject2["ColorEnName"];
                // setStepSelectedLabel(tempLabels);
                let tempExtended = extendedTitle;
                tempExtended["8"][2] = <li key="2" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Finish")}</span><span className="step_title_extended_list_item_text">{pageLanguage === "fa" ? convertToPersian(railObject2["ColorName"]) : railObject2["ColorEnName"]}</span></li>;
                setExtendedTitle(tempExtended);
            }
            setCart(undefined, undefined, "", "RailIdA,RailColorFaA,RailColorEnA", [step82, railObject2["ColorName"], railObject2["ColorEnName"], step82, railObject2["ColorName"], railObject2["ColorEnName"], step82, railObject2["ColorName"], railObject2["ColorEnName"]]);
            showRodsColor(railObject, "82");
        }
    }, [step82]);
    
    useEffect(() => {
        setTimeout(() => {
            let tempExtended = extendedTitle;
            if (rails.length && step81 !== "") {
                let railObject = {};
                railObject = rails.filter(obj => {
                    return obj["RailId"] === step81
                })[0] || railObject;
                
                if (railObject["DesignENName"]) {
                    tempExtended["8"][1] = <li key="1" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Design")}</span><span className="step_title_extended_list_item_text">{pageLanguage === "fa" ? convertToPersian(railObject["DesignName"]) : railObject["DesignENName"]}</span></li>;
                    tempExtended["8"].splice(2, 3);
                }
                let railObject2 = {};
                railObject2 = rails.filter(obj => {
                    return obj["RailId"] === step82
                })[0] || railObject2;
                
                if (railObject["DesignENName"] && railObject2["ColorName"] && railObject2["ColorEnName"]) {
                    tempExtended["8"][2] = <li key="2" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Finish")}</span><span className="step_title_extended_list_item_text">{pageLanguage === "fa" ? convertToPersian(railObject2["ColorName"]) : railObject2["ColorEnName"]}</span></li>;
                }
                showRodsColor(railObject, "82");
            }
            
            setExtendedTitle(tempExtended);
        }, 1000);
    }, [rails]);
    
    useEffect(() => {
        if (accessoriesDesign["isPlus"] !== undefined || accessoriesDesign["qty"] !== undefined || accessoriesDesign["DesignCode"] !== undefined) {
            let temp = JSON.parse(JSON.stringify(customAcc));
            let temp2 = JSON.parse(JSON.stringify(customAccActive));
            
            if (accessoriesDesign["DesignCode"] !== "" && temp2[accessoriesDesign["DesignCode"]] !== undefined) {
                const found = temp.findIndex(el => el["SewingAccessoryValue"] === temp2[accessoriesDesign["DesignCode"]]["SewingAccessoryValue"]);
                
                if (accessoriesDesign["isPlus"] !== undefined) {
                    if (accessoriesDesign["isPlus"]) {
                        if (found === -1) {
                            temp.push({
                                "SewingAccessoryId": temp2[accessoriesDesign["DesignCode"]]["SewingAccessoryId"],
                                "SewingModelAccessoryId": temp2[accessoriesDesign["DesignCode"]]["SewingModelAccessoryId"],
                                "SewingAccessoryValue": temp2[accessoriesDesign["DesignCode"]]["SewingAccessoryValue"],
                                "DesignNameEn": temp2[accessoriesDesign["DesignCode"]]["DesignNameEn"],
                                "DesignNameFa": temp2[accessoriesDesign["DesignCode"]]["DesignNameFa"],
                                "ColorNameEn": temp2[accessoriesDesign["DesignCode"]]["ColorNameEn"],
                                "ColorNameFa": temp2[accessoriesDesign["DesignCode"]]["ColorNameFa"],
                                "Qty": 1
                            });
                        } else {
                            let newQty = +temp[found]["Qty"] + +1;
                            if (newQty > 10) {
                                temp[found] = {
                                    "SewingAccessoryId": temp[found]["SewingAccessoryId"],
                                    "SewingModelAccessoryId": temp[found]["SewingModelAccessoryId"],
                                    "SewingAccessoryValue": temp[found]["SewingAccessoryValue"],
                                    "DesignNameEn": temp[found]["DesignNameEn"],
                                    "DesignNameFa": temp[found]["DesignNameFa"],
                                    "ColorNameEn": temp[found]["ColorNameEn"],
                                    "ColorNameFa": temp[found]["ColorNameFa"],
                                    "Qty": 10
                                }
                            } else {
                                temp[found] = {
                                    "SewingAccessoryId": temp[found]["SewingAccessoryId"],
                                    "SewingModelAccessoryId": temp[found]["SewingModelAccessoryId"],
                                    "SewingAccessoryValue": temp[found]["SewingAccessoryValue"],
                                    "DesignNameEn": temp[found]["DesignNameEn"],
                                    "DesignNameFa": temp[found]["DesignNameFa"],
                                    "ColorNameEn": temp[found]["ColorNameEn"],
                                    "ColorNameFa": temp[found]["ColorNameFa"],
                                    "Qty": newQty
                                }
                            }
                        }
                    } else {
                        if (found === -1) {
                        } else {
                            let newQty = +temp[found]["Qty"] - +1;
                            if (newQty < 1) {
                                temp.splice(found, 1);
                            } else {
                                temp[found] = {
                                    "SewingAccessoryId": temp[found]["SewingAccessoryId"],
                                    "SewingModelAccessoryId": temp[found]["SewingModelAccessoryId"],
                                    "SewingAccessoryValue": temp[found]["SewingAccessoryValue"],
                                    "DesignNameEn": temp[found]["DesignNameEn"],
                                    "DesignNameFa": temp[found]["DesignNameFa"],
                                    "ColorNameEn": temp[found]["ColorNameEn"],
                                    "ColorNameFa": temp[found]["ColorNameFa"],
                                    "Qty": newQty
                                }
                            }
                        }
                    }
                } else if (accessoriesDesign["qty"] !== undefined) {
                    if (found === -1) {
                        let newQty = accessoriesDesign["qty"];
                        if (newQty < 1) {
                        } else if (newQty > 10) {
                            temp.push({
                                "SewingAccessoryId": temp2[accessoriesDesign["DesignCode"]]["SewingAccessoryId"],
                                "SewingModelAccessoryId": temp2[accessoriesDesign["DesignCode"]]["SewingModelAccessoryId"],
                                "SewingAccessoryValue": temp2[accessoriesDesign["DesignCode"]]["SewingAccessoryValue"],
                                "DesignNameEn": temp2[accessoriesDesign["DesignCode"]]["DesignNameEn"],
                                "DesignNameFa": temp2[accessoriesDesign["DesignCode"]]["DesignNameFa"],
                                "ColorNameEn": temp2[accessoriesDesign["DesignCode"]]["ColorNameEn"],
                                "ColorNameFa": temp2[accessoriesDesign["DesignCode"]]["ColorNameFa"],
                                "Qty": 10
                            });
                        } else {
                            temp.push({
                                "SewingAccessoryId": temp2[accessoriesDesign["DesignCode"]]["SewingAccessoryId"],
                                "SewingModelAccessoryId": temp2[accessoriesDesign["DesignCode"]]["SewingModelAccessoryId"],
                                "SewingAccessoryValue": temp2[accessoriesDesign["DesignCode"]]["SewingAccessoryValue"],
                                "DesignNameEn": temp2[accessoriesDesign["DesignCode"]]["DesignNameEn"],
                                "DesignNameFa": temp2[accessoriesDesign["DesignCode"]]["DesignNameFa"],
                                "ColorNameEn": temp2[accessoriesDesign["DesignCode"]]["ColorNameEn"],
                                "ColorNameFa": temp2[accessoriesDesign["DesignCode"]]["ColorNameFa"],
                                "Qty": newQty
                            });
                        }
                    } else {
                        let newQty = accessoriesDesign["qty"];
                        if (newQty < 1) {
                            temp.splice(found, 1);
                        } else if (newQty > 10) {
                            temp[found] = {
                                "SewingAccessoryId": temp[found]["SewingAccessoryId"],
                                "SewingModelAccessoryId": temp[found]["SewingModelAccessoryId"],
                                "SewingAccessoryValue": temp[found]["SewingAccessoryValue"],
                                "DesignNameEn": temp[found]["DesignNameEn"],
                                "DesignNameFa": temp[found]["DesignNameFa"],
                                "ColorNameEn": temp[found]["ColorNameEn"],
                                "ColorNameFa": temp[found]["ColorNameFa"],
                                "Qty": 10
                            };
                        } else {
                            temp[found] = {
                                "SewingAccessoryId": temp[found]["SewingAccessoryId"],
                                "SewingModelAccessoryId": temp[found]["SewingModelAccessoryId"],
                                "SewingAccessoryValue": temp[found]["SewingAccessoryValue"],
                                "DesignNameEn": temp[found]["DesignNameEn"],
                                "DesignNameFa": temp[found]["DesignNameFa"],
                                "ColorNameEn": temp[found]["ColorNameEn"],
                                "ColorNameFa": temp[found]["ColorNameFa"],
                                "Qty": newQty
                            };
                        }
                    }
                } else {
                    if (found !== -1) {
                        temp[found] = {
                            "SewingAccessoryId": accessoriesDesign["SewingAccessoryId"],
                            "SewingModelAccessoryId": accessoriesDesign["SewingModelAccessoryId"],
                            "SewingAccessoryValue": accessoriesDesign["SewingAccessoryValue"],
                            "DesignNameEn": accessoriesDesign["DesignNameEn"],
                            "DesignNameFa": accessoriesDesign["DesignNameFa"],
                            "ColorNameEn": accessoriesDesign["ColorNameEn"],
                            "ColorNameFa": accessoriesDesign["ColorNameFa"],
                            "Qty": temp[found]["Qty"]
                        };
                    }
                    temp2[accessoriesDesign["DesignCode"]] = {
                        "SewingAccessoryId": accessoriesDesign["SewingAccessoryId"],
                        "SewingModelAccessoryId": accessoriesDesign["SewingModelAccessoryId"],
                        "SewingAccessoryValue": accessoriesDesign["SewingAccessoryValue"],
                        "DesignNameEn": accessoriesDesign["DesignNameEn"],
                        "DesignNameFa": accessoriesDesign["DesignNameFa"],
                        "ColorNameEn": accessoriesDesign["ColorNameEn"],
                        "ColorNameFa": accessoriesDesign["ColorNameFa"],
                    };
                    setCustomAccActive(temp2);
                }
                
            }
            setCart(undefined, undefined, undefined, undefined, undefined, temp);
            setCustomAcc(temp);
            setAccessoriesDesign({
                "isPlus": undefined,
                "SewingAccessoryValue": "",
                "SewingAccessoryId": undefined,
                "SewingModelAccessoryId": undefined,
                "DesignCode": undefined,
                "DesignNameEn": undefined,
                "DesignNameFa": undefined,
                "ColorNameEn": undefined,
                "ColorNameFa": undefined,
                "qty": undefined
            });
        }
    }, [accessoriesDesign]);
    useEffect(() => {
        if (tiebackDrapery["isPlus"] !== undefined) {
            if (tiebackDrapery["isPlus"]) {
                let newQty = +tiebackDraperyQty + +1;
                if (newQty > 10) {
                    newQty = 10;
                }
                setTiebackDrapery({
                    "isPlus": undefined,
                    "HandCurtainId": tiebackDrapery["HandCurtainId"],
                    "HandCurtainNum": newQty
                });
                setTiebackDraperyQty(newQty);
            } else {
                let newQty = +tiebackDraperyQty - +1;
                if (newQty < 0) {
                    newQty = 0;
                }
                setTiebackDrapery({
                    "isPlus": undefined,
                    "HandCurtainId": tiebackDrapery["HandCurtainId"],
                    "HandCurtainNum": newQty
                });
                setTiebackDraperyQty(newQty);
            }
        } else if (tiebackDrapery["HandCurtainId"] !== undefined) {
            if (tiebackDrapery["HandCurtainNum"] > 0) {
                setCart("HandCurtainId", tiebackDrapery["HandCurtainId"], "", "HandCurtainNum,HandCurtainEn,HandCurtainFa", [tiebackDraperyQty, "Matching Drapery Tieback", "دوخت کمر پرده"]);
            } else {
                setCart("", "", "HandCurtainId,HandCurtainNum");
            }
        }
    }, [tiebackDrapery]);
    
    useEffect(() => {
        if (tiebackSheer["isPlus"] !== undefined) {
            if (tiebackSheer["isPlus"]) {
                let newQty = +tiebackSheerQty + +1;
                if (newQty > 10) {
                    newQty = 10;
                }
                setTiebackSheer({
                    "isPlus": undefined,
                    "HandCurtainId": tiebackSheer["HandCurtainId"],
                    "HandCurtainNum": newQty
                });
                setTiebackSheerQty(newQty);
            } else {
                let newQty = +tiebackSheerQty - +1;
                if (newQty < 0) {
                    newQty = 0;
                }
                setTiebackSheer({
                    "isPlus": undefined,
                    "HandCurtainId": tiebackSheer["HandCurtainId"],
                    "HandCurtainNum": newQty
                });
                setTiebackSheerQty(newQty);
            }
        } else if (tiebackSheer["HandCurtainId"] !== undefined) {
            if (tiebackSheer["HandCurtainNum"] > 0) {
                setCart("HandCurtainId2", tiebackSheer["HandCurtainId"], "", "HandCurtainNum2,HandCurtainEn2,HandCurtainFa2", [tiebackSheerQty, "Matching Sheer Tieback", "دوخت کمر پرده"]);
            } else {
                setCart("", "", "HandCurtainId2,HandCurtainNum2");
            }
        }
    }, [tiebackSheer]);
    
    useEffect(() => {
        if (Object.keys(customAccActive).length) {
            renderStepAccessories();
            // console.log(customAcc,customAccActive);
        }
        // setCart(undefined, undefined, undefined, undefined, undefined, customAcc);
    }, [customAcc, customAccActive]);
    
    useEffect(() => {
        if (customAcc.length) {
            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
            let tempText = [];
            
            let promiseArr = [];
            customAcc.forEach((obj, index) => {
                promiseArr[index] = new Promise((resolve, reject) => {
                    const found = Object.keys(stepAccessories).find(e => {
                        return stepAccessories[e].findIndex(el => el["DetailId"] === obj["SewingAccessoryValue"]) !== -1;
                    });
                    
                    setTimeout(() => {
                        if (found !== undefined) {
                            const found2 = stepAccessories[found].findIndex(el => el["DetailId"] === obj["SewingAccessoryValue"]);
                            
                            if (found2 !== -1) {
                                let DesignENName = stepAccessories[found][found2]["DesignENName"];
                                let DesignName = stepAccessories[found][found2]["DesignName"];
                                let qty = obj["Qty"];
                                tempText.push(`${pageLanguage === "en" ? DesignENName : DesignName} ${pageLanguage === "en" ? `x${qty}` : NumberToPersianWord.convertEnToPe(`${qty}x`)}`);
                                resolve();
                            } else {
                                resolve();
                            }
                        } else {
                            resolve();
                        }
                    }, 100);
                });
            });
            
            Promise.all(promiseArr).then(() => {
                tempLabels["9"] = tempText.join(', \n');
                // setAccTitle(tempText);
                
                let tempExtended = extendedTitle;
                tempExtended["9"] = tempText;
                setExtendedTitle(tempExtended);
                setStepSelectedLabel(tempLabels);
            });
        } else {
            let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
            tempLabels["9"] = "";
            
            let tempExtended = extendedTitle;
            tempExtended["9"] = [];
            setExtendedTitle(tempExtended);
            setStepSelectedLabel(tempLabels);
        }
    }, [customAcc, pageLanguage]);
    
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
                    SaveUserProject(depSet, cartValues, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], `${modelID}`, price, defaultModelName, defaultModelNameFa, projectData, customAcc).then((temp) => {
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
                    SaveUserProject(depSet, cartValues, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], `${modelID}`, price, defaultModelName, defaultModelNameFa, undefined, customAcc).then((temp) => {
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
            // console.log(tempObj);
            
            // setDefaultFabricPhoto(model["DefaultFabricPhotoUrl"]);
            // setCart("PhotoUrl", model["DefaultFabricPhotoUrl"]);
            // setDefaultModelName(model["ModelENName"]);
            // setDefaultModelNameFa(model["ModelName"]);
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
        // console.log(Object.keys(model).length !== 0 , widthCart !== undefined);
        if (Object.keys(model).length !== 0 && widthCart !== undefined) {
            let tempObj = {};
            let promiseArr = [];
            model["Accessories"].forEach((obj, index) => {
                promiseArr[index] = new Promise((resolve, reject) => {
                    let tempObj2 = {};
                    let promiseArr2 = [];
                    obj["SewingAccessoryDetails"].forEach((el, index2) => {
                        promiseArr2[index2] = new Promise((resolve, reject) => {
                            tempObj2[el["SewingAccessoryDetailId"]] = JSON.parse(JSON.stringify(el));
                            tempObj2[el["SewingAccessoryDetailId"]]["Price"] = obj["CalcMethodId"] === 5602 ? el["Price"] * widthCart / 100 : el["Price"];
                            resolve();
                        });
                    });
                    Promise.all(promiseArr2).then(() => {
                        tempObj[obj["SewingAccessoryId"]] = tempObj2;
                        resolve();
                    });
                });
            });
            
            Promise.all(promiseArr).then(() => {
                setModelAccessories(tempObj);
            });
        } else {
            setModelAccessories({});
        }
        if (Object.keys(model).length > 0) {
            let tempObj = {};
            let promiseArr = [];
            model["Accessories"].forEach((obj, index) => {
                promiseArr[index] = new Promise((resolve, reject) => {
                    let promiseArr2 = [];
                    if (obj["SewingAccessoryId"] === 26) {
                        // obj["SewingAccessoryDetails"].push({
                        //     "SewingAccessoryDetailId": 65,
                        //     "SewingAccessoryId": 26,
                        //     "Title": "دوخت کمر پرده",
                        //     "EnTitle": null,
                        //     "DetailId": "0000012",
                        //     "FromQty": null,
                        //     "ToQty": null,
                        //     "DesignCode": null,
                        //     "DesignName": null,
                        //     "DesignENName": null,
                        //     "ColorId": null,
                        //     "ColorHtmlCode": null,
                        //     "ColorName": null,
                        //     "ColorENName": null,
                        //     "ProductGroupId": null,
                        //     "Price": 230000,
                        //     "StockQty": 0,
                        //     "Photos": [
                        //         {
                        //             "PhotoOrder": 0,
                        //             "PhotoTypeId": 4701,
                        //             "PhotoUrl": "Content/Images/Product/2011/2011-12-23/0000011/0000011_Main.jpg?v=29943",
                        //             "ThumbPhotoUrl": "Content/Images/Product/2011/2011-12-23/0000011/0000011_Main_Thump.jpg?v=29943"
                        //         },
                        //         {
                        //             "PhotoOrder": 1,
                        //             "PhotoTypeId": 4702,
                        //             "PhotoUrl": "Content/Images/Product/2011/2011-12-23/0000011/0000011_MainInner.jpg?v=29943",
                        //             "ThumbPhotoUrl": "Content/Images/Product/2011/2011-12-23/0000011/0000011_MainInner_Thump.jpg?v=29943"
                        //         },
                        //         {
                        //             "PhotoOrder": 2,
                        //             "PhotoTypeId": 4703,
                        //             "PhotoUrl": "Content/Images/Product/2011/2011-12-23/0000011/0000011_OneCol.jpg?v=29943",
                        //             "ThumbPhotoUrl": "Content/Images/Product/2011/2011-12-23/0000011/0000011_OneCol_Thump.jpg?v=29943"
                        //         },
                        //         {
                        //             "PhotoOrder": 3,
                        //             "PhotoTypeId": 4709,
                        //             "PhotoUrl": "Content/Images/Product/2011/2011-12-23/0000011/0000011_Color.jpg?v=29943",
                        //             "ThumbPhotoUrl": "Content/Images/Product/2011/2011-12-23/0000011/0000011_Color_Thump.jpg?v=29943"
                        //         }
                        //     ]
                        // })
                        obj["SewingAccessoryDetails"].forEach((el, index2) => {
                            promiseArr2[index2] = new Promise((resolve, reject) => {
                                // if (el["DetailId"] === "0000011") {
                                //     el["DesignENName"] = "Matching Drapery Tieback";
                                //     el["DesignName"] = "دوخت کمر پرده";
                                // }
                                // if (el["DetailId"] === "0000012") {
                                //     el["DesignENName"] = "Matching Sheer Tieback";
                                //     el["DesignName"] = "دوخت کمر پرده";
                                // }
                                el["SewingModelAccessoryId"] = obj["SewingModelAccessoryId"];
                                if (el["DesignCode"] && el["DesignCode"] !== "") {
                                    if (tempObj[el["DesignCode"]] === undefined || tempObj[el["DesignCode"]].length === 0)
                                        tempObj[el["DesignCode"]] = [];
                                    tempObj[el["DesignCode"]].push(JSON.parse(JSON.stringify(el)));
                                } else {
                                    if (tempObj[index2.toString()] === undefined || tempObj[index2.toString()].length === 0)
                                        tempObj[index2.toString()] = [];
                                    tempObj[index2.toString()].push(JSON.parse(JSON.stringify(el)));
                                }
                                resolve();
                            });
                        });
                    }
                    Promise.all(promiseArr2).then(() => {
                        resolve();
                    });
                });
            });
            
            Promise.all(promiseArr).then(() => {
                setStepAccessories(tempObj);
            });
        } else {
            setStepAccessories({});
        }
        if (Object.keys(model).length > 0) {
            let tempArr = [];
            let promiseArr = [];
            model["Accessories"].forEach((obj, index) => {
                promiseArr[index] = new Promise((resolve, reject) => {
                    let promiseArr2 = [];
                    if (obj["SewingAccessoryId"] === 28) {
                        obj["SewingAccessoryDetails"].forEach((el, index2) => {
                            promiseArr2[index2] = new Promise((resolve, reject) => {
                                el["SewingModelAccessoryId"] = obj["SewingModelAccessoryId"];
                                tempArr.push(JSON.parse(JSON.stringify(el)));
                                resolve();
                            });
                        });
                    }
                    Promise.all(promiseArr2).then(() => {
                        resolve();
                    });
                });
            });
            
            Promise.all(promiseArr).then(() => {
                let tempFabrics = {};
                let promiseArr2 = [];
                tempArr.forEach((obj, index) => {
                    promiseArr2[index] = new Promise((resolve, reject) => {
                        if (obj["ProductGroupId"] === "100703") {
                            if (tempFabrics[obj["DesignCode"]] === "" || tempFabrics[obj["DesignCode"]] === undefined || tempFabrics[obj["DesignCode"]] === null || tempFabrics[obj["DesignCode"]] === [])
                                tempFabrics[obj["DesignCode"]] = [];
                            tempFabrics[obj["DesignCode"]].push(obj);
                        }
                        resolve();
                    });
                });
                Promise.all(promiseArr2).then(() => {
                    setTrimAccessories(tempFabrics);
                });
            });
        } else {
            setTrimAccessories([]);
        }
    }, [model, JSON.stringify(cartValues)]);
    
    useEffect(() => {
        if (pageLoad === false) {
            if (widthCart && parseInt(widthCart) > 0) {
                getRails(parseInt(widthCart));
            }
            setCart(undefined, undefined);
        }
    }, [pageLoad]);
    
    useEffect(() => {
        if (modelID !== '' && catID !== '') {
            // if(firstRender) {
            // getCats();
            getModel();
            // getFabrics();
            // setFirstRender(false);
            // }
        }
    }, [modelID, catID]);
    
    useEffect(() => {
        if (pageItem) {
            setDefaultFabricPhoto(pageItem["MainImageUrl"]);
            // console.log(pageId);
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
    
    function getRemoteNames() {
        if (isLoggedIn) {
            axios.get(baseURLGetRemoteNames, {
                headers: authHeader()
            }).then((response) => {
                let tempArr = [];
                response.data.forEach(el => {
                    tempArr.push({
                        value: el,
                        label: el
                    });
                });
                tempArr.push({
                    value: "addNewRemoteName",
                    label: t("Add New Remote")
                });
                setRemoteNames(tempArr);
            }).catch(err => {
                console.log(err);
                if (err.response && err.response.status === 401) {
                    refreshToken().then((response2) => {
                        if (response2 !== false) {
                            getRemoteNames();
                        } else {
                            setRemoteNames([]);
                        }
                    });
                } else {
                    setRemoteNames([]);
                }
            });
        } else {
            if (Object.keys(bag).length > 0 && bag["drapery"] !== undefined) {
                let tempArr = bag["drapery"].map((obj, index) => {
                    if (obj["PreorderText"] && obj["PreorderText"]["RemoteName"] && obj["PreorderText"]["SewingModelId"] === modelID) {
                        return {
                            value: obj["PreorderText"]["RemoteName"],
                            label: obj["PreorderText"]["RemoteName"]
                        }
                    } else {
                        return null;
                    }
                }).filter(n => n).filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i);
                tempArr.push({
                    value: "addNewRemoteName",
                    label: t("Add New Remote")
                });
                // console.log(tempArr);
                setRemoteNames(tempArr);
            } else {
                setRemoteNames([]);
            }
        }
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
                            // renderFabrics2(temp);
                        }, 100);
                    }).catch(() => {
                        getHasZipcode();
                        setTimeout(() => {
                            renderFabrics({});
                            // renderFabrics2({});
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
    }, [fabrics, fabrics2, cartChanged, isLoggedIn, location.pathname]);
    
    useEffect(() => {
        setLang().then(() => {
            if (pageLanguage !== '') {
                if (Object.keys(rods).length) {
                    renderRods();
                } else {
                    setRodsList([]);
                }
            }
            if (rodsLoad) {
                setRodsLoad(false);
            }
        });
    }, [rods, isLoggedIn, location.pathname]);
    
    useEffect(() => {
        if (Object.keys(stepAccessories).length > 0) {
            // renderStepAccessories();
            
            let temp = JSON.parse(JSON.stringify(customAccActive));
            
            let promiseArr = [];
            Object.keys(stepAccessories).forEach((key, index) => {
                promiseArr[index] = new Promise((resolve, reject) => {
                    if (temp[key] === undefined) {
                        temp[key] = {
                            "SewingAccessoryId": stepAccessories[key][0]["SewingAccessoryId"],
                            "SewingModelAccessoryId": stepAccessories[key][0]["SewingModelAccessoryId"],
                            "SewingAccessoryValue": stepAccessories[key][0]["DetailId"]
                        };
                    }
                    
                    resolve();
                });
            });
            Promise.all(promiseArr).then(() => {
                setCustomAccActive(temp);
            });
        } else {
            setStepAccessoriesList([]);
            setCustomAccActive({});
        }
    }, [stepAccessories, location.pathname]);
    
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
            // setSelectedMotorChannels([motorChannels[pageLanguage].find(opt => opt.value === '0')]);
            if (widthCart && parseInt(widthCart) > 0) {
                getRails(parseInt(widthCart));
            } else {
                getRails();
            }
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
        
        // setTimeout(() => {
        //     if (steps.current["6"]) {
        //         steps.current["6"].scrollIntoView({
        //             behavior: "smooth",
        //             block: "center"
        //         });
        //     }
        // }, 500);
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
                    <div>
                        {defaultFabricPhoto &&
                            <img src={`https://api.atlaspood.ir/${defaultFabricPhoto}`} className="img-fluid" alt=""/>
                        }
                    </div>
                </div>
                <div className={`model_customize_section ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                    <Accordion ref={accordion} flush activeKey={accordionActiveKey}>
                        {/*/!* step 0 *!/*/}
                        {/*<Card>*/}
                        {/*    <Card.Header>*/}
                        {/*        <ContextAwareToggle eventKey="1" stepNum={t("1")} stepTitle={t("grommet_step1")} stepRef="1" type="1" required={requiredStep["1"]}*/}
                        {/*                            stepSelected={stepSelectedLabel["1"] === undefined ? "" : stepSelectedLabel["1"]}/>*/}
                        {/*    </Card.Header>*/}
                        {/*    <Accordion.Collapse eventKey="1">*/}
                        {/*        <Card.Body>*/}
                        {/*            <div className="card_body card_body_radio tall_img_card_body">*/}
                        {/*                <div className="box33 radio_style">*/}
                        {/*                    /!*<img src={require('../Images/drapery/dk/window-Inside.svg').default} className="img-fluid" alt=""/>*!/*/}
                        {/*                    <input className="radio" type="radio" text={t("Drapery & Sheers")} value="1" name="step1" ref-num="1" id="11"*/}
                        {/*                           checked={step1 === "Drapery & Sheers"}*/}
                        {/*                           onChange={e => {*/}
                        {/*                               setStep1("Drapery & Sheers");*/}
                        {/*                               setDeps("", "1");*/}
                        {/*                               setCart("FabricType", "Drapery & Sheers");*/}
                        {/*                               selectChanged(e);*/}
                        {/*                        */}
                        {/*                           }} ref={ref => (inputs.current["11"] = ref)}/>*/}
                        {/*                    <label htmlFor="11">{t("Drapery & Sheers")}</label>*/}
                        {/*                </div>*/}
                        {/*                <div className="box33 radio_style">*/}
                        {/*                    /!*<img src={require('../Images/drapery/dk/window-Outside.svg').default} className="img-fluid" alt=""/>*!/*/}
                        {/*                    <input className="radio" type="radio" text={t("Drapery Only")} value="2" name="step1" ref-num="1" id="12"*/}
                        {/*                           checked={step1 === "Drapery Only"}*/}
                        {/*                           onChange={e => {*/}
                        {/*                               setStep1("Drapery Only");*/}
                        {/*                               setDeps("", "1");*/}
                        {/*                               setCart("FabricType", "Drapery Only");*/}
                        {/*                               selectChanged(e);*/}
                        {/*                           }} ref={ref => (inputs.current["12"] = ref)}/>*/}
                        {/*                    <label htmlFor="12">{t("Drapery Only")}</label>*/}
                        {/*                </div>*/}
                        {/*                <div className="box33 radio_style">*/}
                        {/*                    /!*<img src={require('../Images/drapery/dk/window-Arc.svg').default} className="img-fluid" alt=""/>*!/*/}
                        {/*                    <input className="radio" type="radio" text={t("Sheers Only")} value="3" name="step1" ref-num="1" id="13"*/}
                        {/*                           checked={step1 === "Sheers Only"}*/}
                        {/*                           onChange={e => {*/}
                        {/*                               setStep1("Sheers Only");*/}
                        {/*                               setDeps("", "1");*/}
                        {/*                               setCart("FabricType", "Sheers Only");*/}
                        {/*                               selectChanged(e);*/}
                        {/*                           }} ref={ref => (inputs.current["13"] = ref)}/>*/}
                        {/*                    <label htmlFor="13">{t("Sheers Only")}</label>*/}
                        {/*                </div>*/}
                        {/*                */}
                        {/*                <NextStep eventKey="2">{t("NEXT STEP")}</NextStep>*/}
                        {/*            </div>*/}
                        {/*        </Card.Body>*/}
                        {/*    </Accordion.Collapse>*/}
                        {/*</Card>*/}
                        
                        {/* step 1 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="1" stepNum={t("1")} stepTitle={t("grommet_step1")} stepRef="1" type="1" required={requiredStep["1"]}
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
                                        <div className="fabrics_list_container">
                                            {fabricsList}
                                        </div>
                                        <NextStep currentStep="1" eventKey="3">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 2 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="3A0" stepNum={t("2")} stepTitle={t("zebra_step2")} stepRef="3A0" type="1" required={requiredStep["3A0"]}
                                                    stepSelected={stepSelectedLabel["3A0"] === undefined ? "" : stepSelectedLabel["3A0"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3A0">
                                <Card.Body>
                                    <div className="card_body card_body_radio card_body_radio_camera card_body_radio_medium_img">
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/grommet/mount_wall.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("Wall")} value="1" name="step3A0" ref-num="3A0" id="3A01"
                                                   checked={step3A0 === "Wall"}
                                                   onChange={e => {
                                                       if (step3A0 !== "" && step3 === "true") {
                                                           modalHandleShow("MountTypeWarning");
                                                           setMountTypeTemp({
                                                               stepValue: "Wall",
                                                               id: "",
                                                               cartValue: "Wall",
                                                               event: e
                                                           });
                                                       } else {
                                                           setStep3A0("Wall");
                                                           setStep3("");
                                                           setDepth(undefined);
                                                           setMouldingHeight(undefined);
                                                           setMountErr1(false);
                                                           setMountErr2(false);
                                                           setDeps("3", "3A0,3A11,3A12,31,311,312,3A,3A1,3B,3B1,3C,3D1,3D2,3E,3EFloor,3F,3G,3ARod,3ARod1,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                           setCart("Mount", "Wall", "Depth,MouldingHeight,calcMeasurements,WidthCart,HeightCart,hasRod,CurtainPosition,FinishedLengthType,Width3C,ExtensionLeft,ExtensionRight,ShadeMount,Height3E,WindowToFloor,CeilingToFloor,RodWidth,RodToBottom,RodToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3");
                                                           clearInputs(e, undefined, "3,3A,3B");
                                                           setMeasurementsNextStep("4");
                                                       }
                                                   }} ref={ref => (inputs.current["3A01"] = ref)}/>
                                            <label htmlFor="3A01">{t("Wall")}
                                            </label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/grommet/mount_ceiling.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("Ceiling")} value="2" name="step3A0" ref-num="3A0" id="3A02"
                                                   checked={step3A0 === "Ceiling"}
                                                   onChange={e => {
                                                       if (step3A0 !== "" && step3 === "true") {
                                                           modalHandleShow("MountTypeWarning");
                                                           setMountTypeTemp({
                                                               stepValue: "Ceiling",
                                                               id: "",
                                                               cartValue: "Ceiling",
                                                               event: e
                                                           });
                                                       } else {
                                                           setStep3A0("Ceiling");
                                                           setStep3("");
                                                           setDepth(undefined);
                                                           setMouldingHeight(undefined);
                                                           setMountErr1(false);
                                                           setMountErr2(false);
                                                           setDeps("3", "3A0,3A11,3A12,31,311,312,3A,3A1,3B,3B1,3C,3D1,3D2,3E,3EFloor,3F,3G,3ARod,3ARod1,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3\");");
                                                           setCart("Mount", "Ceiling", "Depth,MouldingHeight,calcMeasurements,WidthCart,HeightCart,hasRod,CurtainPosition,FinishedLengthType,Width3C,ExtensionLeft,ExtensionRight,ShadeMount,Height3E,WindowToFloor,CeilingToFloor,RodWidth,RodToBottom,RodToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3");
                                                           clearInputs(e, undefined, "3,3A,3B");
                                                           setMeasurementsNextStep("4");
                                                       }
                                                   }} ref={ref => (inputs.current["3A02"] = ref)}/>
                                            <label htmlFor="3A02">{t("Ceiling")}
                                            </label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/grommet/mount_moulding.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("Moulding")} value="3" name="step3A0" ref-num="3A0" id="3A03"
                                                   checked={step3A0 === "Moulding"}
                                                   onChange={e => {
                                                       if (step3A0 !== "" && step3 === "true") {
                                                           modalHandleShow("MountTypeWarning");
                                                           setMountTypeTemp({
                                                               stepValue: "Moulding",
                                                               id: "",
                                                               cartValue: "Moulding",
                                                               event: e
                                                           });
                                                       } else {
                                                           setStep3A0("Moulding");
                                                           setStep3("");
                                                           setDepth(undefined);
                                                           setMouldingHeight(undefined);
                                                           setDeps("3,3A11,3A12", "3A0,31,311,312,3A,3A1,3B,3B1,3C,3D1,3D2,3E,3EFloor,3F,3G,3ARod,3ARod1,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3\");");
                                                           setCart("Mount", "Moulding", "calcMeasurements,WidthCart,HeightCart,hasRod,CurtainPosition,FinishedLengthType,Width3C,ExtensionLeft,ExtensionRight,ShadeMount,Height3E,WindowToFloor,CeilingToFloor,RodWidth,RodToBottom,RodToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3");
                                                           clearInputs(e, undefined, "3,3A0,3A,3B");
                                                           setMeasurementsNextStep("4");
                                                       }
                                                   }} ref={ref => (inputs.current["3A03"] = ref)}/>
                                            <label htmlFor="3A03">{t("mount_MouldingMount")}
                                            </label>
                                        </div>
                                        
                                        <div className={step3A0 === "Moulding" ? "own_measurements_container" : "noDisplay"}>
                                            <div className="own_measurements_width">
                                                {/*<label className="select_label">{t("Depth")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                                {/*<div className="select_container select_container_num">*/}
                                                {/*    <Select*/}
                                                {/*        className="select"*/}
                                                {/*        placeholder={t("Please Select")}*/}
                                                {/*        portal={document.body}*/}
                                                {/*        dropdownPosition="bottom"*/}
                                                {/*        dropdownHandle={false}*/}
                                                {/*        dropdownGap={0}*/}
                                                {/*        values={selectCustomValues.Depth}*/}
                                                {/*        onDropdownOpen={() => {*/}
                                                {/*            let temp1 = window.scrollY;*/}
                                                {/*            window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                                {/*            setTimeout(() => {*/}
                                                {/*                let temp2 = window.scrollY;*/}
                                                {/*                if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                                {/*            }, 100);*/}
                                                {/*        }}*/}
                                                {/*        dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                                {/*        contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                                {/*                                                                        postfixFa=""/>}*/}
                                                {/*        // optionRenderer={*/}
                                                {/*        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                                {/*        // }*/}
                                                {/*        onChange={(selected) => {*/}
                                                {/*            if (selected[0] !== undefined) {*/}
                                                {/*                let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                                {/*                temp.Depth = selected;*/}
                                                {/*                setSelectCustomValues(temp);*/}
                                                {/*                setDeps("", "3A11");*/}
                                                {/*                setCart("Depth", selected[0].value);*/}
                                                {/*            }*/}
                                                {/*        }}*/}
                                                {/*        options={SelectOptionRange(1, 50, 1, "cm", "", pageLanguage)}*/}
                                                {/*    />*/}
                                                {/*</div>*/}
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Depth")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["depth"] = ref)} debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                inputs.current["mouldingHeight"].focus();
                                                            } else if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (depth !== undefined && (depth < 1 || depth > 1000) || mountErr1 ? " measure_input_err" : "")} type="text"
                                                                       name="depth" value={NumToFa(`${depth || ""}`, pageLanguage)} text={t("Moulding")} ref-num="3A0"
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("Depth", parseInt(newValue));
                                                                                   setDeps("", "3A11");
                                                                                   setDepth(parseInt(newValue));
                                                                                   setMountErr1(false);
                                                                                   if (mouldingHeight && mouldingHeight !== "" && parseInt(mouldingHeight) >= 1 && parseInt(mouldingHeight) <= 1000) {
                                                                                       selectChanged(e);
                                                                                   } else {
                                                                                       selectChanged(undefined, "3A0");
                                                                                   }
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "Depth");
                                                                                   setDeps("3A11", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setDepth(undefined);
                                                                                   } else {
                                                                                       setDepth(parseInt(newValue));
                                                                                   }
                                                                                   selectChanged(undefined, "3A0");
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {mountErr1 && <h2 className="measure_input_desc measure_input_desc_err">{t("Required field")}</h2>}
                                                </div>
                                            </div>
                                            <div className="own_measurements_Length">
                                                {/*<label className="select_label">{t("Length_step3")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                                {/*<div className="select_container select_container_num">*/}
                                                {/*    <Select*/}
                                                {/*        className="select"*/}
                                                {/*        placeholder={t("Please Select")}*/}
                                                {/*        portal={document.body}*/}
                                                {/*        dropdownPosition="bottom"*/}
                                                {/*        dropdownHandle={false}*/}
                                                {/*        dropdownGap={0}*/}
                                                {/*        values={selectCustomValues.MouldingHeight}*/}
                                                {/*        onDropdownOpen={() => {*/}
                                                {/*            let temp1 = window.scrollY;*/}
                                                {/*            window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                                {/*            setTimeout(() => {*/}
                                                {/*                let temp2 = window.scrollY;*/}
                                                {/*                if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                                {/*            }, 100);*/}
                                                {/*        }}*/}
                                                {/*        dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                                {/*        contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                                {/*                                                                        postfixFa=""/>}*/}
                                                {/*        // optionRenderer={*/}
                                                {/*        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                                {/*        // }*/}
                                                {/*        onChange={(selected) => {*/}
                                                {/*            if (selected[0] !== undefined) {*/}
                                                {/*                let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                                {/*                temp.MouldingHeight = selected;*/}
                                                {/*                setSelectCustomValues(temp);*/}
                                                {/*                setDeps("", "3A12");*/}
                                                {/*                setCart("MouldingHeight", selected[0].value);*/}
                                                {/*            }*/}
                                                {/*        }}*/}
                                                {/*        options={SelectOptionRange(1, 50, 1, "cm", "", pageLanguage)}*/}
                                                {/*    />*/}
                                                {/*</div>*/}
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("MouldingHeight")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["mouldingHeight"] = ref)} debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (mouldingHeight !== undefined && (mouldingHeight < 1 || mouldingHeight > 1000) || mountErr2 ? " measure_input_err" : "")} type="text"
                                                                       name="mouldingHeight" value={NumToFa(`${mouldingHeight || ""}`, pageLanguage)} text={t("Moulding")} ref-num="3A0"
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("MouldingHeight", parseInt(newValue));
                                                                                   setDeps("", "3A12");
                                                                                   setMouldingHeight(parseInt(newValue));
                                                                                   setMountErr2(false);
                                                                                   if (depth && depth !== "" && parseInt(depth) >= 1 && parseInt(depth) <= 1000) {
                                                                                       selectChanged(e);
                                                                                   } else {
                                                                                       selectChanged(undefined, "3A0");
                                                                                   }
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "MouldingHeight");
                                                                                   setDeps("3A12", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setMouldingHeight(undefined);
                                                                                   } else {
                                                                                       setMouldingHeight(parseInt(newValue));
                                                                                   }
                                                                                   selectChanged(undefined, "3A0");
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    
                                                    {mountErr2 && <h2 className="measure_input_desc measure_input_desc_err">{t("Required field")}</h2>}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <NextStep currentStep="3A0" eventKey={step3A0 === "Moulding" && ((inputs.current["depth"] && inputs.current["depth"].value === "") || (inputs.current["mouldingHeight"] && inputs.current["mouldingHeight"].value === "")) ? "3A0" : "3"} onClick={() => {
                                            setTimeout(() => {
                                                if (step3A0 === "Moulding") {
                                                    if (inputs.current["depth"] && inputs.current["depth"].value === "") {
                                                        setMountErr1(true);
                                                    }
                                                    if (inputs.current["mouldingHeight"] && inputs.current["mouldingHeight"].value === "") {
                                                        setMountErr2(true);
                                                    }
                                                }
                                            }, 400);
                                        }}>{t("NEXT STEP")}</NextStep>
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
                                                       setMeasurementsNextStep("4");
                                                       if (step3A0 === "") {
                                                           setStep3("");
                                                           selectUncheck(e);
                                                           modalHandleShow("noMount");
                                                           setDeps("3", "311,312");
                                                           setCart("", "", "Width,Height,WidthCart,HeightCart,WindowWidth,WindowHeight,calcMeasurements");
                                                       } else {
                                                           setStep3("false");
                                                           setStep31("");
                                                           setStep61("");
                                                           setDeps("311,312", "3,31,3A,3A1,3B,3B1,3C,3D1,3D2,3E,3EFloor,3F,3G,3ARod,3ARod1,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                           clearInputs(e, "3A,3B,3C,3D,3E,3EFloor,3F,3G,3ARod,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling,3EStandardCeilingFloor");
                                                           setCart("calcMeasurements", false, "WidthCart,HeightCart,hasRod,CurtainPosition,FinishedLengthType,Width3C,ExtensionLeft,ExtensionRight,ShadeMount,Height3E,WindowToFloor,CeilingToFloor,RodWidth,RodToBottom,RodToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3");
                                                       }
                                                   }} ref={ref => (inputs.current["31"] = ref)}/>
                                            <label htmlFor="31">{t("I have my own measurements.")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("Calculate my measurements")} value="2" name="step3" checked={step3 === "true"}
                                                   ref-num="3" id="32" ref={ref => (inputs.current["32"] = ref)}
                                                   onChange={e => {
                                                       setMeasurementsNextStep("4");
                                                       if (step3A0 === "") {
                                                           setStep3("");
                                                           selectUncheck(e);
                                                           modalHandleShow("noMount");
                                                           setDeps("3", "31,32");
                                                           setCart("", "", "Width,Height,WidthCart,HeightCart,WindowWidth,WindowHeight,calcMeasurements");
                                                       } else {
                                                           setStep3("true");
                                                           setStep31("");
                                                           setStep61("");
                                                           clearInputs(e);
                                                           setDeps("31", "3,311,312");
                                                           setCart("calcMeasurements", true, "Width,Height,WidthCart,HeightCart,WindowWidth,WindowHeight");
                                                       }
                                                   }}/>
                                            <label htmlFor="32">{t("Calculate my measurements.")}</label>
                                        </div>
                                        
                                        <div className={step3 === "false" ? "own_measurements_container" : "noDisplay"}>
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
                                                        }} className={"measure_input" + (width !== undefined && (width < 1 || width > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="width" value={NumToFa(`${width || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("Width", parseInt(newValue));
                                                                                   setDeps("", "311");
                                                                                   setWidth(parseInt(newValue));
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "Width");
                                                                                   setDeps("311", "");
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
                                                    {/*<h2 className={"measure_input_desc" + (width !== undefined && (width < 30 || width > 1000) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 1000`, pageLanguage)} {t("cm_label")}</h2>*/}
                                                </div>
                                            </div>
                                            <div className="own_measurements_Length">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Height")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["Height"] = ref)} debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (height !== undefined && (height < 1 || height > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="height" value={NumToFa(`${height || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("Height", parseInt(newValue));
                                                                                   setDeps("", "312");
                                                                                   setHeight(parseInt(newValue));
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "Height");
                                                                                   setDeps("312", "");
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
                                                    {/*<h2 className={"measure_input_desc" + (height !== undefined && (height < 30 || height > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>*/}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className={step3 === "true" ? "card_body card_body_radio card_body_grommet_measurements" : "noDisplay"}>
                                            <div className="box100">
                                                <p className="step_selection_title">{t("grommet_step31_title")}</p>
                                            </div>
                                            <div className="box50 radio_style">
                                                <img
                                                    src={pageLanguage === "fa" ? require('../Images/drapery/grommet/HasRod.svg').default : require('../Images/drapery/grommet/HasRod.svg').default}
                                                    className="img-fluid height_auto" alt=""/>
                                                <input className="radio" type="radio" value="1" name="step31" ref-num="31" id="311" checked={step31 === "true"}
                                                       onChange={e => {
                                                           setStep31("true");
                                                           setStep3A("Standard");
                                                           setStep3B("Floor");
                                                           setStep3ARod("");
                                                           clearInputs(e, "3C,3D,3E,3EFloor,3F,3G,3ARod,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling,3EStandardCeilingFloor");
                                                           setDeps("3ARod", "31,3B,3B1,3C,3D1,3D2,3E,3EFloor,3F,3G,3A0,3A,3A1,3ARod1,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                           setCart("hasRod", true, "Width3C,ExtensionLeft,ExtensionRight,ShadeMount,Height3E,WindowToFloor,CeilingToFloor,RodWidth,RodToBottom,RodToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3");
                                                           setMeasurementsNextStep("3A");
                                                       }} ref={ref => (inputs.current["311"] = ref)}/>
                                                <label htmlFor="311">{t("grommet_has_rod")}</label>
                                            </div>
                                            <div className="box50 radio_style">
                                                <img
                                                    src={pageLanguage === "fa" ? require('../Images/drapery/grommet/NoRod.svg').default : require('../Images/drapery/grommet/NoRod.svg').default}
                                                    className="img-fluid height_auto" alt=""/>
                                                <input className="radio" type="radio" value="2" name="step31" ref-num="31" id="312" checked={step31 === "false"}
                                                       onChange={e => {
                                                           setStep31("false");
                                                           setStep3A("Standard");
                                                           setStep3B("Floor");
                                                           setWidth3C(undefined);
                                                           setCeilingToFloor1(undefined);
                                                           setCeilingToFloor2(undefined);
                                                           setCeilingToFloor3(undefined);
                                                           setLeft(undefined);
                                                           setRight(undefined);
                                                    
                                                           selectChanged("3A", "3C,3D,3E,3EFloor,3F,3G,3ARod,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling,3EStandardCeilingFloor", t("Standard"), "3B", [t("Floor")]);
                                                           setCart("hasRod", false, "Width3C,ExtensionLeft,ExtensionRight,ShadeMount,Height3E,WindowToFloor,CeilingToFloor,RodWidth,RodToBottom,RodToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3", "CurtainPosition,FinishedLengthType", ["Standard", "Floor"]);
                                                           if (step3A0 === "Wall") {
                                                               setDeps("3C,3D1,3D2,3EFloor,3F,3G", "31,3A,3B,3B1,3E,3ARod,3A1,3ARod1,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                           } else {
                                                               setDeps("3C,3D1,3D2,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3", "31,3A,3B,3B1,3E,3F,3G,3EFloor,3ARod,3A1,3ARod1,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3");
                                                        
                                                           }
                                                           setMeasurementsNextStep("3A");
                                                       }} ref={ref => (inputs.current["312"] = ref)}/>
                                                <label htmlFor="312">{t("grommet_no_rod")}</label>
                                            </div>
                                        </div>
                                        <NextStep currentStep="3" eventKey={measurementsNextStep}>{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    {(stepSelectedValue["3"] === "1") && <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">
                                                        <div className="measurementsHelp_link" onClick={e => modalHandleShow("measurementsHelp")}>
                                                            {t("step3_help_1")}
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>}
                                    {(stepSelectedValue["3"] === "2") && <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">
                                                        <b>{t("Note:&nbsp;")}</b>
                                                        {t("step3_help_2.5")}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>}
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3A */}
                        <Card className={step3 === "true" && step31 === "false" ? "" : "noDisplay"}>
                            <Card.Header className={[...depSet].findIndex(el => el.startsWith("3")) === -1 && (!accordionActiveKey.startsWith("3")) ? "hidden" : ""}>
                                <ContextAwareToggle eventKey="3A" stepNum={t("3A")} stepTitle={t("grommet_step3A")} stepRef="3A" type="1" required={requiredStep["3A"]}
                                                    stepSelected={stepSelectedLabel["3A"] === undefined ? "" : stepSelectedLabel["3A"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3A">
                                <Card.Body>
                                    <div className="card_body card_body_radio card_body_4_grommet">
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/grommet/CP_standard.svg').default} className="img-fluid half_margin" alt=""/>
                                            <input className="radio" type="radio" text={t("Standard")} value="1" name="step3A" ref-num="3A" id="3A1"
                                                   checked={step3A === "Standard"}
                                                   onChange={e => {
                                                       if (step3A !== "" && anyMeasurements) {
                                                           modalHandleShow("CurtainPosWarning");
                                                           setCurtainPosTemp({
                                                               stepValue: "Standard",
                                                               id: "",
                                                               cartValue: "Standard",
                                                               event: e
                                                           });
                                                       } else {
                                                           setStep3A("Standard");
                                                           clearInputs(e);
                                                           setCart("CurtainPosition", "Standard", "Width3C,ExtensionLeft,ExtensionRight,ShadeMount,Height3E,WindowToFloor,CeilingToFloor,RodWidth,RodToBottom,RodToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3");
                                                           if (step3B === "Sill" || step3B === "Apron") {
                                                               if (step3A0 === "Ceiling" || step3A0 === "Moulding") {
                                                                   setDeps("3C,3D1,3D2,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3G", "3A,3B,3B1,3E,3F,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                               } else {
                                                                   setDeps("3C,3D1,3D2,3E,3F,3G", "3A,3B,3B1,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                               }
                                                           } else {
                                                               if (step3A0 === "Ceiling" || step3A0 === "Moulding") {
                                                                   setDeps("3C,3D1,3D2,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3", "3A,3B,3B1,3E,3F,3G,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3");
                                                               } else {
                                                                   setDeps("3C,3D1,3D2,3EFloor,3F,3G", "3A,3B,3B1,3E,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                               }
                                                           }
                                                       }
                                                   }} ref={ref => (inputs.current["3A1"] = ref)}/>
                                            <label htmlFor="3A1">{t("Standard")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/grommet/CP_Wall.svg').default} className="img-fluid half_margin" alt=""/>
                                            <input className="radio" type="radio" text={t("Wall to Wall")} value="2" name="step3A" ref-num="3A" id="3A2"
                                                   checked={step3A === "Wall to Wall"}
                                                   onChange={e => {
                                                       if (step3A !== "" && anyMeasurements) {
                                                           modalHandleShow("CurtainPosWarning");
                                                           setCurtainPosTemp({
                                                               stepValue: "Wall to Wall",
                                                               id: "",
                                                               cartValue: "Wall to Wall",
                                                               event: e
                                                           });
                                                       } else {
                                                           setStep3A("Wall to Wall");
                                                           clearInputs(e);
                                                           setCart("CurtainPosition", "Wall to Wall", "Width3C,ExtensionLeft,ExtensionRight,ShadeMount,Height3E,WindowToFloor,CeilingToFloor,RodWidth,RodToBottom,RodToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3");
                                                           if (step3B === "Sill" || step3B === "Apron") {
                                                               if (step3A0 === "Wall") {
                                                                   setDeps("3C,3E,3F,3G", "3A,3B,3B1,3D1,3D2,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                               } else {
                                                                   setDeps("3C,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3G", "3A,3B,3B1,3D1,3D2,3E,3F,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                               }
                                                           } else {
                                                               if (step3A0 === "Wall") {
                                                                   setDeps("3C,3EFloor,3F,3G", "3A,3B,3B1,3D1,3D2,3E,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                               } else {
                                                                   setDeps("3C,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3", "3A,3B,3B1,3D1,3D2,3E,3F,3G,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3");
                                                               }
                                                           }
                                                       }
                                                   }} ref={ref => (inputs.current["3A2"] = ref)}/>
                                            <label htmlFor="3A2">{t("Wall to Wall")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/public/no_image.svg').default} className="img-fluid half_margin" alt=""/>
                                            <input className="radio" type="radio" text={t("Right Corner Window")} value="4" name="step3A" ref-num="3A" id="3A4"
                                                   checked={step3A === "Right Corner Window"}
                                                   onChange={e => {
                                                       if (step3A !== "" && anyMeasurements) {
                                                           modalHandleShow("CurtainPosWarning");
                                                           setCurtainPosTemp({
                                                               stepValue: "Right Corner Window",
                                                               id: "",
                                                               cartValue: "Right Corner Window",
                                                               event: e
                                                           });
                                                       } else {
                                                           setStep3A("Right Corner Window");
                                                           clearInputs(e);
                                                           setCart("CurtainPosition", "Right Corner Window", "Width3C,ExtensionLeft,ExtensionRight,ShadeMount,Height3E,WindowToFloor,CeilingToFloor,RodWidth,RodToBottom,RodToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3");
                                                           if (step3B === "Sill" || step3B === "Apron") {
                                                               if (step3A0 === "Ceiling" || step3A0 === "Moulding") {
                                                                   setDeps("3C,3D1,3D2,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3G", "3A,3B,3B1,3E,3F,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                               } else {
                                                                   setDeps("3C,3D1,3D2,3E,3F,3G", "3A,3B,3B1,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                               }
                                                           } else {
                                                               if (step3A0 === "Ceiling" || step3A0 === "Moulding") {
                                                                   setDeps("3C,3D1,3D2,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3", "3A,3B,3B1,3E,3F,3G,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3");
                                                               } else {
                                                                   setDeps("3C,3D1,3D2,3EFloor,3F,3G", "3A,3B,3B1,3E,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                               }
                                                           }
                                                       }
                                                   }} ref={ref => (inputs.current["3A4"] = ref)}/>
                                            <label htmlFor="3A4">{t("Right Corner Window")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/public/no_image.svg').default} className="img-fluid half_margin" alt=""/>
                                            <input className="radio" type="radio" text={t("Left Corner Window")} value="3" name="step3A" ref-num="3A" id="3A3"
                                                   checked={step3A === "Left Corner Window"}
                                                   onChange={e => {
                                                       if (step3A !== "" && anyMeasurements) {
                                                           modalHandleShow("CurtainPosWarning");
                                                           setCurtainPosTemp({
                                                               stepValue: "Left Corner Window",
                                                               id: "",
                                                               cartValue: "Left Corner Window",
                                                               event: e
                                                           });
                                                       } else {
                                                           setStep3A("Left Corner Window");
                                                           clearInputs(e);
                                                           setCart("CurtainPosition", "Left Corner Window", "Width3C,ExtensionLeft,ExtensionRight,ShadeMount,Height3E,WindowToFloor,CeilingToFloor,RodWidth,RodToBottom,RodToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3");
                                                           if (step3B === "Sill" || step3B === "Apron") {
                                                               if (step3A0 === "Ceiling" || step3A0 === "Moulding") {
                                                                   setDeps("3C,3D1,3D2,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3G", "3A,3B,3B1,3E,3F,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                               } else {
                                                                   setDeps("3C,3D1,3D2,3E,3F,3G", "3A,3B,3B1,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                               }
                                                           } else {
                                                               if (step3A0 === "Ceiling" || step3A0 === "Moulding") {
                                                                   setDeps("3C,3D1,3D2,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3", "3A,3B,3B1,3E,3F,3G,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3");
                                                               } else {
                                                                   setDeps("3C,3D1,3D2,3EFloor,3F,3G", "3A,3B,3B1,3E,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                               }
                                                           }
                                                       }
                                                   }} ref={ref => (inputs.current["3A3"] = ref)}/>
                                            <label htmlFor="3A3">{t("Left Corner Window")}</label>
                                        </div>
                                        
                                        <NextStep currentStep="3A" eventKey="3B">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3B */}
                        <Card className={step3 === "true" && step31 === "false" && step3A0 !== "" && step3A !== "" ? "" : "noDisplay"}>
                            <Card.Header className={[...depSet].findIndex(el => el.startsWith("3")) === -1 && (!accordionActiveKey.startsWith("3")) ? "hidden" : ""}>
                                <ContextAwareToggle eventKey="3B" stepNum={t("3B")} stepTitle={t("dk_step2A")} stepRef="3B" type="1" required={requiredStep["3B"]}
                                                    stepSelected={stepSelectedLabel["3B"] === undefined ? "" : stepSelectedLabel["3B"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3B">
                                <Card.Body>
                                    <div className="card_body card_body_radio card_body_finished_length card_body_finished_length_grommet">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("dk_step2A_title")}</p>
                                        </div>
                                        <div className="box25 radio_style">
                                            <img
                                                src={pageLanguage === "fa" ? require('../Images/drapery/grommet/length type-05.svg').default : require('../Images/drapery/grommet/length type-04.svg').default}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" text={t("Sill")} value="1" name="step3B" ref-num="3B" id="3B1" checked={step3B === "Sill"}
                                                   onChange={e => {
                                                       if ((step3B === "Floor" || step3B === "Slight Puddle") && anyMeasurements) {
                                                           modalHandleShow("FinishedLengthWarning");
                                                           setFinishedLengthTemp({
                                                               stepValue: "Sill",
                                                               id: "",
                                                               cartValue: "Sill",
                                                               event: e
                                                           });
                                                       } else {
                                                           setStep3B("Sill");
                                                           clearInputs(e);
                                                           setCart("FinishedLengthType", "Sill");
                                                           if ((step3A0 === "Ceiling" || step3A0 === "Moulding") && (step3A === "Standard" || step3A === "Left Corner Window" || step3A === "Right Corner Window")) {
                                                               setDeps("3C,3D1,3D2,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3G", "3B,3B1,3E,3F,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                           } else if (step3A === "Wall to Wall" && step3A0 === "Wall") {
                                                               setDeps("3C,3E,3F,3G", "3B,3B1,3D1,3D2,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                           } else if (step3A === "Wall to Wall" && (step3A0 === "Ceiling" || step3A0 === "Moulding")) {
                                                               setDeps("3C,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3G", "3B,3B1,3D1,3D2,3E,3F,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                           } else {
                                                               setDeps("3C,3D1,3D2,3E,3F,3G", "3B,3B1,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                           }
                                                       }
                                                   }} ref={ref => (inputs.current["3B1"] = ref)}/>
                                            <label htmlFor="3B1">{t("Sill")}</label>
                                        </div>
                                        <div className="box25 radio_style">
                                            <img
                                                src={pageLanguage === "fa" ? require('../Images/drapery/grommet/length type-06.svg').default : require('../Images/drapery/grommet/length type-03.svg').default}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" value="2" name="step3B" ref-num="3B" id="3B2" checked={step3B === "Apron"}
                                                   onChange={e => {
                                                       if ((step3B === "Floor" || step3B === "Slight Puddle") && anyMeasurements) {
                                                           modalHandleShow("FinishedLengthWarning");
                                                           setFinishedLengthTemp({
                                                               stepValue: "Apron",
                                                               id: "",
                                                               cartValue: "Apron",
                                                               event: e
                                                           });
                                                       } else {
                                                           setStep3B("Apron");
                                                           clearInputs(e);
                                                           setCart("FinishedLengthType", "Apron");
                                                           if ((step3A0 === "Ceiling" || step3A0 === "Moulding") && (step3A === "Standard" || step3A === "Left Corner Window" || step3A === "Right Corner Window")) {
                                                               setDeps("3C,3D1,3D2,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3G", "3B,3B1,3E,3F,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                           } else if (step3A === "Wall to Wall" && step3A0 === "Wall") {
                                                               setDeps("3C,3E,3F,3G", "3B,3B1,3D1,3D2,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                           } else if (step3A === "Wall to Wall" && (step3A0 === "Ceiling" || step3A0 === "Moulding")) {
                                                               setDeps("3C,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3G", "3B,3B1,3D1,3D2,3E,3F,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                           } else {
                                                               setDeps("3C,3D1,3D2,3E,3F,3G", "3B,3B1,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                           }
                                                       }
                                                   }} ref={ref => (inputs.current["3B2"] = ref)}/>
                                            <label htmlFor="3B2">{t("Apron")}</label>
                                        </div>
                                        <div className="box25 radio_style">
                                            <img
                                                src={pageLanguage === "fa" ? require('../Images/drapery/grommet/length type-07.svg').default : require('../Images/drapery/grommet/length type-02.svg').default}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" text={t("Floor")} value="3" name="step3B" ref-num="3B" id="3B3" checked={step3B === "Floor"}
                                                   onChange={e => {
                                                       if ((step3B === "Sill" || step3B === "Apron") && anyMeasurements) {
                                                           modalHandleShow("FinishedLengthWarning");
                                                           setFinishedLengthTemp({
                                                               stepValue: "Floor",
                                                               id: "",
                                                               cartValue: "Floor",
                                                               event: e
                                                           });
                                                       } else {
                                                           setStep3B("Floor");
                                                           clearInputs(e);
                                                           setCart("FinishedLengthType", "Floor");
                                                           if ((step3A0 === "Ceiling" || step3A0 === "Moulding") && (step3A === "Standard" || step3A === "Left Corner Window" || step3A === "Right Corner Window")) {
                                                               setDeps("3C,3D1,3D2,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3", "3B,3B1,3E,3F,3G,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3");
                                                           } else if (step3A === "Wall to Wall" && step3A0 === "Wall") {
                                                               setDeps("3C,3EFloor,3F,3G", "3B,3B1,3D1,3D2,3E,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                           } else if (step3A === "Wall to Wall" && (step3A0 === "Ceiling" || step3A0 === "Moulding")) {
                                                               setDeps("3C,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3", "3B,3B1,3D1,3D2,3E,3F,3G,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3");
                                                           } else {
                                                               setDeps("3C,3D1,3D2,3EFloor,3F,3G", "3B,3B1,3E,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                           }
                                                       }
                                                   }} ref={ref => (inputs.current["3B3"] = ref)}/>
                                            <label htmlFor="3B3">{t("Floor")}</label>
                                        </div>
                                        <div className="box25 radio_style">
                                            <img
                                                src={pageLanguage === "fa" ? require('../Images/drapery/grommet/length type-08.svg').default : require('../Images/drapery/grommet/length type-01.svg').default}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" text={t("Slight Puddle")} value="4" name="step3B" ref-num="3B" id="3B4"
                                                   checked={step3B === "Slight Puddle"}
                                                   onChange={e => {
                                                       if ((step3B === "Sill" || step3B === "Apron") && anyMeasurements) {
                                                           modalHandleShow("FinishedLengthWarning");
                                                           setFinishedLengthTemp({
                                                               stepValue: "Slight Puddle",
                                                               id: "",
                                                               cartValue: "Slight Puddle",
                                                               event: e
                                                           });
                                                       } else {
                                                           setStep3B("Slight Puddle");
                                                           clearInputs(e);
                                                           setCart("FinishedLengthType", "Slight Puddle");
                                                           if ((step3A0 === "Ceiling" || step3A0 === "Moulding") && (step3A === "Standard" || step3A === "Left Corner Window" || step3A === "Right Corner Window")) {
                                                               setDeps("3C,3D1,3D2,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3", "3B,3B1,3E,3F,3G,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3");
                                                           } else if (step3A === "Wall to Wall" && step3A0 === "Wall") {
                                                               setDeps("3C,3EFloor,3F,3G", "3B,3B1,3D1,3D2,3E,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                           } else if (step3A === "Wall to Wall" && (step3A0 === "Ceiling" || step3A0 === "Moulding")) {
                                                               setDeps("3C,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3", "3B,3B1,3D1,3D2,3E,3F,3G,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3");
                                                           } else {
                                                               setDeps("3C,3D1,3D2,3EFloor,3F,3G", "3B,3B1,3E,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                           }
                                                       }
                                                   }} ref={ref => (inputs.current["3B4"] = ref)}/>
                                            <label htmlFor="3B4">{t("Slight Puddle")}</label>
                                        </div>
                                        
                                        <div className={step3B === "Apron" ? (step3BErr1 ? "secondary_options secondary_options_err" : "secondary_options") : "noDisplay"}>
                                            <div className="card-body-display-flex">
                                                <div className="checkbox_style checkbox_style_step2">
                                                    <input type="checkbox" text={t("Apron")} value="3" name="step3B1" ref-num="3B" checked={step3B1 === "true"}
                                                           onChange={(e) => {
                                                               if (e.target.checked) {
                                                                   selectChanged(e);
                                                                   setDeps("", "3B1");
                                                                   setStep3B1("true");
                                                                   setStep3BErr1(false);
                                                               } else {
                                                                   setStep3B1("false");
                                                                   setDeps("3B1", "");
                                                                   selectChanged(undefined, "3B");
                                                               }
                                                           }} id="3B11" ref={ref => (inputs.current["3B11"] = ref)}/>
                                                    <label htmlFor="3B11" className="checkbox_label">
                                                        <img className="checkbox_label_img checkmark1 img-fluid"
                                                             src={require('../Images/public/checkmark1_checkbox.png')}
                                                             alt=""/>
                                                    </label>
                                                    <span className="checkbox_text">
                                                        {t("grommet_apron_checkbox_title")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {step3BErr1 && <div className="input_not_valid">{t("grommet_step3AErr1")}</div>}
                                        <NextStep currentStep="3B" eventKey="3C">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"></p>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle"><b>{t("dk_step2a_help1")}</b>{t("dk_step2a_help2")}</li>
                                                    <li className="no_listStyle"><b>{t("grommet_step3a_help2")}</b>{t("grommet_step3a_help3")}</li>
                                                    <li className="no_listStyle"><b>{t("grommet_step3a_help4")}</b>{t("grommet_step3a_help5")}</li>
                                                    <li className="no_listStyle"><b>{t("grommet_step3a_help6")}</b>{t("grommet_step3a_help7")}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3C*/}
                        <Card
                            className={step3 === "true" && step31 === "false" && step3A !== "" && step3B !== "" && step3A0 !== "" ? "" : "noDisplay"}>
                            <Card.Header className={[...depSet].findIndex(el => el.startsWith("3")) === -1 && (!accordionActiveKey.startsWith("3")) ? "hidden" : ""}>
                                <ContextAwareToggle eventKey="3C" stepNum={t("3D")} stepTitle={step3A === "Wall to Wall" ? t("grommet_width_wall") : t("dk_step2B")} stepRef="3C"
                                                    type="2" required={requiredStep["3C"]}
                                                    stepSelected={stepSelectedLabel["3C"] === undefined ? "" : stepSelectedLabel["3C"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3C">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{step3A === "Wall to Wall" ? t("grommet_width_wall_title") : t("dk_step2B_title")}</p>
                                            <img src={step3A === "Wall to Wall" ? require('../Images/drapery/grommet/FrameSize_wall.svg').default : require('../Images/drapery/zebra/new_FrameSize.svg').default} className="img-fluid frame_with_top" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Width")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (width3C !== undefined && (width3C < 1 || width3C > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="width3C" value={NumToFa(`${width3C || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("Width3C", parseInt(newValue));
                                                                                   setDeps("", "3C");
                                                                                   setWidth3C(parseInt(newValue));
                                                                                   optionSelectChanged("3C", parseInt(newValue), "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "Width3C");
                                                                                   setDeps("3C", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setWidth3C(undefined);
                                                                                       selectChanged(undefined, "3C");
                                                                                   } else {
                                                                                       setWidth3C(parseInt(newValue));
                                                                                       selectChanged("3C", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (width3C !== undefined && (width3C < 30 || width3C > 290) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 290`, pageLanguage)} {t("cm_label")}</h2>*/}
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="3C" eventKey={step3A === "Wall to Wall" ? "3E" : "3D"}>{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3D*/}
                        <Card
                            className={step3 === "true" && step31 === "false" && step3A !== "" && step3B !== "" && step3A0 !== "" && !(step3A === "Wall to Wall") ? "" : "noDisplay"}>
                            <Card.Header className={[...depSet].findIndex(el => el.startsWith("3")) === -1 && (!accordionActiveKey.startsWith("3")) ? "hidden" : ""}>
                                <ContextAwareToggle eventKey="3D" stepNum={t("3E")} stepTitle={t("dk_step2CCeiling")} stepRef="3D" type="2"
                                                    required={requiredStep["3D"]}
                                                    stepSelected={stepSelectedLabel["3D"] === undefined ? "" : stepSelectedLabel["3D"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3D">
                                <Card.Body>
                                    <div className="card_body card_body_overflow_issue">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("dk_step2c_out_title")}</p>
                                            <img src={require('../Images/drapery/dk/new_fullRod_track.svg').default} className="img-fluid frame_with_top2" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container dir_ltr">
                                            <div className="box50">
                                                {/*<label className={step3A === "Left Corner Window" ? "select_label disabled" : "select_label"}><p*/}
                                                {/*    className="farsi_cm">{t("select_cm")}</p>{t("Left")}</label>*/}
                                                {/*<div className={step3A === "Left Corner Window" ? "select_container select_container_num disabled" : "select_container" + " select_container_num"}>*/}
                                                {/*    <Select*/}
                                                {/*        className="select"*/}
                                                {/*        disabled={step3A === "Left Corner Window"}*/}
                                                {/*        placeholder={t("Please Select")}*/}
                                                {/*        portal={document.body}*/}
                                                {/*        dropdownPosition="bottom"*/}
                                                {/*        dropdownHandle={false}*/}
                                                {/*        dropdownGap={0}*/}
                                                {/*        onDropdownOpen={() => {*/}
                                                {/*            let temp1 = window.scrollY;*/}
                                                {/*            window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                                {/*            setTimeout(() => {*/}
                                                {/*                let temp2 = window.scrollY;*/}
                                                {/*                if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                                {/*            }, 100);*/}
                                                {/*        }}*/}
                                                {/*        values={selectCustomValues.left}*/}
                                                {/*        dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                                {/*        contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                                {/*                                                                        postfixFa=""/>}*/}
                                                {/*        // optionRenderer={*/}
                                                {/*        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                                {/*        // }*/}
                                                {/*        onChange={(selected) => {*/}
                                                {/*            if (selected[0] !== undefined) {*/}
                                                {/*                let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                                {/*                temp.left = selected;*/}
                                                {/*                setSelectCustomValues(temp);*/}
                                                {/*                if (step3A === "Right Corner Window") {*/}
                                                {/*                    optionSelectChanged_LeftRight(selected[0], "3D", true, "cm", "س\u200Cم", pageLanguage, 0);*/}
                                                {/*                    setDeps("", "3D1,3D2");*/}
                                                {/*                    setCart("ExtensionLeft", selected[0].value, "", "ExtensionRight", [0]);*/}
                                                {/*                } else {*/}
                                                {/*                    optionSelectChanged_LeftRight(selected[0], "3D", true, "cm", "س\u200Cم", pageLanguage);*/}
                                                {/*                    setDeps("", "3D1");*/}
                                                {/*                    setCart("ExtensionLeft", selected[0].value);*/}
                                                {/*                }*/}
                                                {/*            }*/}
                                                {/*        }}*/}
                                                {/*        options={SelectOptionRange(1, 50, 1, "cm", "", pageLanguage)}*/}
                                                {/*    />*/}
                                                {/*</div>*/}
                                                <div className={step3A === "Left Corner Window" ? "measure_input_container disabled" : "measure_input_container"}>
                                                    <h1 className="measure_input_label">{t("Left")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                inputs.current["Right"].focus();
                                                            } else if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (left !== undefined && (left < 1 || left > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="Left" value={NumToFa(`${left || ""}`, pageLanguage)} disabled={step3A === "Left Corner Window"}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   if (step3A === "Right Corner Window") {
                                                                                       optionSelectChanged_LeftRight(parseInt(newValue), "3D", true, "cm", "س\u200Cم", pageLanguage, 0);
                                                                                       setDeps("", "3D1,3D2");
                                                                                       setCart("ExtensionLeft", parseInt(newValue), "", "ExtensionRight", [0]);
                                                                                   } else {
                                                                                       setCart("ExtensionLeft", parseInt(newValue));
                                                                                       setDeps("", "3D1");
                                                                                       optionSelectChanged_LeftRight(parseInt(newValue), "3D", true, "cm", "س\u200Cم", pageLanguage);
                                                                                   }
                                                                                   setLeft(parseInt(newValue));
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   if (step3A === "Right Corner Window") {
                                                                                       // optionSelectChanged_LeftRight(parseInt(newValue), "3D", true, "cm", "س\u200Cم", pageLanguage, 0);
                                                                                       setDeps("3D1,3D2", "");
                                                                                       setCart("", "", "ExtensionLeft,ExtensionRight");
                                                                                   } else {
                                                                                       setCart("", "", "ExtensionLeft");
                                                                                       setDeps("3D1", "");
                                                                                   }
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setLeft(undefined);
                                                                                       selectChanged(undefined, "3D");
                                                                                   } else {
                                                                                       setLeft(parseInt(newValue));
                                                                                       selectChanged("3D", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (left !== undefined && (left < 1 || left > 10) ? " measure_input_desc_err" : "")}>Max. 10cm</h2>*/}
                                                </div>
                                                {step3A === "Left Corner Window" &&
                                                    <OverlayContainer classNames="extension_unavailable"
                                                                      placement="right"
                                                                      children={<div className="extension_unavailable_title text_underline">{t("Why is this unavailable?")}</div>}
                                                                      component={
                                                                          <div className="extension_unavailable_container">
                                                                              <div className="extension_unavailable_text">{t("Left_unavailable_text")}</div>
                                                                          </div>
                                                                      }/>
                                                    
                                                    // <PopoverStickOnHover classNames="extension_unavailable"
                                                    //                      placement="right"
                                                    //                      children={<div className="extension_unavailable_title text_underline">{t("Why is this unavailable?")}</div>}
                                                    //                      component={
                                                    //                          <div className="extension_unavailable_container">
                                                    //                              <div className="extension_unavailable_text">{t("Left_unavailable_text")}</div>
                                                    //                          </div>
                                                    //                      }/>
                                                }
                                            </div>
                                            <div className="box50">
                                                {/*<label className={step3A === "Right Corner Window" ? "select_label disabled" : "select_label"}><p*/}
                                                {/*    className="farsi_cm">{t("select_cm")}</p>{t("Right")}</label>*/}
                                                {/*<div className={step3A === "Right Corner Window" ? "select_container select_container_num disabled" : "select_container" + " select_container_num"}>*/}
                                                {/*    <Select*/}
                                                {/*        className="select"*/}
                                                {/*        disabled={step3A === "Right Corner Window"}*/}
                                                {/*        placeholder={t("Please Select")}*/}
                                                {/*        portal={document.body}*/}
                                                {/*        dropdownPosition="bottom"*/}
                                                {/*        dropdownHandle={false}*/}
                                                {/*        dropdownGap={0}*/}
                                                {/*        onDropdownOpen={() => {*/}
                                                {/*            let temp1 = window.scrollY;*/}
                                                {/*            window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                                {/*            setTimeout(() => {*/}
                                                {/*                let temp2 = window.scrollY;*/}
                                                {/*                if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                                {/*            }, 100);*/}
                                                {/*        }}*/}
                                                {/*        values={selectCustomValues.right}*/}
                                                {/*        dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                                {/*        contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                                {/*                                                                        postfixFa=""/>}*/}
                                                {/*        // optionRenderer={*/}
                                                {/*        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                                {/*        // }*/}
                                                {/*        onChange={(selected) => {*/}
                                                {/*            if (selected[0] !== undefined) {*/}
                                                {/*                let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                                {/*                temp.right = selected;*/}
                                                {/*                setSelectCustomValues(temp);*/}
                                                {/*                if (step3A === "Left Corner Window") {*/}
                                                {/*                    optionSelectChanged_LeftRight(selected[0], "3D", false, "cm", "س\u200Cم", pageLanguage, 0);*/}
                                                {/*                    setDeps("", "3D1,3D2");*/}
                                                {/*                    setCart("ExtensionRight", selected[0].value, "", "ExtensionLeft", [0]);*/}
                                                {/*                } else {*/}
                                                {/*                    optionSelectChanged_LeftRight(selected[0], "3D", false, "cm", "س\u200Cم", pageLanguage);*/}
                                                {/*                    setDeps("", "3D2");*/}
                                                {/*                    setCart("ExtensionRight", selected[0].value);*/}
                                                {/*                }*/}
                                                {/*            }*/}
                                                {/*        }}*/}
                                                {/*        options={SelectOptionRange(1, 50, 1, "cm", "", pageLanguage)}*/}
                                                {/*    />*/}
                                                {/*</div>*/}
                                                <div className={step3A === "Right Corner Window" ? "measure_input_container disabled" : "measure_input_container"}>
                                                    <h1 className="measure_input_label">{t("Right")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["Right"] = ref)} debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (right !== undefined && (right < 1 || right > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="right" value={NumToFa(`${right || ""}`, pageLanguage)} disabled={step3A === "Right Corner Window"}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   if (step3A === "Left Corner Window") {
                                                                                       optionSelectChanged_LeftRight(parseInt(newValue), "3D", false, "cm", "س\u200Cم", pageLanguage, 0);
                                                                                       setDeps("", "3D2,3D1");
                                                                                       setCart("ExtensionRight", parseInt(newValue), "", "ExtensionLeft", [0]);
                                                                                   } else {
                                                                                       setCart("ExtensionRight", parseInt(newValue));
                                                                                       setDeps("", "3D2");
                                                                                       optionSelectChanged_LeftRight(parseInt(newValue), "3D", false, "cm", "س\u200Cم", pageLanguage);
                                                                                   }
                                                                                   setRight(parseInt(newValue));
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   if (step3A === "Left Corner Window") {
                                                                                       // optionSelectChanged_LeftRight(parseInt(newValue), "3D", false, "cm", "س\u200Cم", pageLanguage, 0);
                                                                                       setDeps("3D2,3D1", "");
                                                                                       setCart("", "", "ExtensionRight,ExtensionLeft");
                                                                                   } else {
                                                                                       setCart("", "", "ExtensionRight");
                                                                                       setDeps("3D2", "");
                                                                                   }
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setRight(undefined);
                                                                                       selectChanged(undefined, "3D");
                                                                                   } else {
                                                                                       setRight(parseInt(newValue));
                                                                                       selectChanged("3D", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (right !== undefined && (right < 1 || right > 10) ? " measure_input_desc_err" : "")}>Max. 10cm</h2>*/}
                                                </div>
                                                {step3A === "Right Corner Window" &&
                                                    <OverlayContainer classNames="extension_unavailable"
                                                                      placement="right"
                                                                      children={<div className="extension_unavailable_title text_underline">{t("Why is this unavailable?")}</div>}
                                                                      component={
                                                                          <div className="extension_unavailable_container">
                                                                              <div className="extension_unavailable_text">{t("Right_unavailable_text")}</div>
                                                                          </div>
                                                                      }/>
                                                    // <PopoverStickOnHover classNames="extension_unavailable"
                                                    //                      placement="right"
                                                    //                      children={<div className="extension_unavailable_title text_underline">{t("Why is this unavailable?")}</div>}
                                                    //                      component={
                                                    //                          <div className="extension_unavailable_container">
                                                    //                              <div className="extension_unavailable_text">{t("Right_unavailable_text")}</div>
                                                    //                          </div>
                                                    //                      }/>
                                                }
                                            </div>
                                        </div>
                                        
                                        <NextStep currentStep="3D" eventKey="3E">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">{t("grommet_step3C_help_1")}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3E*/}
                        <Card
                            className={step3 === "true" && step31 === "false" && step3A !== "" && step3B !== "" && step3A0 !== "" && !((step3A0 === "Ceiling" || step3A0 === "Moulding") && (step3A === "Standard" || step3A === "Left Corner Window" || step3A === "Right Corner Window")) && !(step3A === "Wall to Wall" && (step3A0 === "Ceiling" || step3A0 === "Moulding")) && (step3B === "Sill" || step3B === "Apron") ? "" : "noDisplay"}>
                            <Card.Header className={[...depSet].findIndex(el => el.startsWith("3")) === -1 && (!accordionActiveKey.startsWith("3")) ? "hidden" : ""}>
                                <ContextAwareToggle eventKey="3E" stepNum={step3A === "Wall to Wall" ? t("2E") : t("2F")} stepTitle={t("dk_step2EWall")} stepRef="3E" type="2"
                                                    required={requiredStep["3E"]}
                                                    stepSelected={stepSelectedLabel["3E"] === undefined ? "" : stepSelectedLabel["3E"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3E">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("dk_step2EWall_title")}</p>
                                            <img src={require('../Images/drapery/zebra/new_frame_height.svg').default} className="img-fluid just_frame" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Height")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (height3E !== undefined && (height3E < 1 || height3E > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="height3E" value={NumToFa(`${height3E || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("Height3E", parseInt(newValue));
                                                                                   setDeps("", "3E");
                                                                                   setHeight3E(parseInt(newValue));
                                                                                   optionSelectChanged("3E", parseInt(newValue), "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "Height3E");
                                                                                   setDeps("3E", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setHeight3E(undefined);
                                                                                       selectChanged(undefined, "3E");
                                                                                   } else {
                                                                                       setHeight3E(parseInt(newValue));
                                                                                       selectChanged("3E", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (height3E !== undefined && (height3E < 30 || height3E > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>*/}
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="3E" eventKey={step3A === "Wall to Wall" ? "3F" : "3F"}>{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3EFloor */}
                        <Card
                            className={step3 === "true" && step31 === "false" && step3A !== "" && step3B !== "" && step3A0 !== "" && !((step3A0 === "Ceiling" || step3A0 === "Moulding") && (step3A === "Standard" || step3A === "Left Corner Window" || step3A === "Right Corner Window")) && !(step3A === "Wall to Wall" && (step3A0 === "Ceiling" || step3A0 === "Moulding")) && (step3B === "Floor" || step3B === "Slight Puddle") ? "" : "noDisplay"}>
                            <Card.Header className={[...depSet].findIndex(el => el.startsWith("3")) === -1 && (!accordionActiveKey.startsWith("3")) ? "hidden" : ""}>
                                <ContextAwareToggle eventKey="3E" stepNum={step3A === "Wall to Wall" ? t("2E") : t("2F")} stepTitle={t("dk_step2DWall")} stepRef="3EFloor" type="2"
                                                    required={requiredStep["3EFloor"]}
                                                    stepSelected={stepSelectedLabel["3EFloor"] === undefined ? "" : stepSelectedLabel["3EFloor"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3E">
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
                                        {/*                        if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.WindowToFloor}*/}
                                        {/*                dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                        {/*                contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                                postfixFa=""/>}*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged("3EFloor", selected[0], "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.WindowToFloor = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "3EFloor");*/}
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
                                                        }} className={"measure_input" + (windowToFloor !== undefined && (windowToFloor < 1 || windowToFloor > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="windowToFloor1" value={NumToFa(`${windowToFloor || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("WindowToFloor", parseInt(newValue));
                                                                                   setDeps("", "3EFloor");
                                                                                   setWindowToFloor(parseInt(newValue));
                                                                                   optionSelectChanged("3EFloor", parseInt(newValue), "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "WindowToFloor");
                                                                                   setDeps("3EFloor", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setWindowToFloor(undefined);
                                                                                       selectChanged(undefined, "3EFloor");
                                                                                   } else {
                                                                                       setWindowToFloor(parseInt(newValue));
                                                                                       selectChanged("3EFloor", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (windowToFloor !== undefined && (windowToFloor < 30 || windowToFloor > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>*/}
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="3EFloor" eventKey={step3A === "Wall to Wall" ? "3F" : "3F"}>{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3EStandardCeiling */}
                        <Card
                            className={step3 === "true" && step31 === "false" && ((step3A0 === "Ceiling" || step3A0 === "Moulding") && (step3A === "Standard" || step3A === "Left Corner Window" || step3A === "Right Corner Window") || (step3A === "Wall to Wall" && (step3A0 === "Ceiling" || step3A0 === "Moulding"))) && step3B !== "" && step3A0 !== "" && (step3B === "Sill" || step3B === "Apron") ? "" : "noDisplay"}>
                            <Card.Header className={[...depSet].findIndex(el => el.startsWith("3")) === -1 && (!accordionActiveKey.startsWith("3")) ? "hidden" : ""}>
                                <ContextAwareToggle eventKey="3E" stepNum={step3A === "Wall to Wall" ? t("2E") : t("2F")} stepTitle={t("dk_step2D_sill")}
                                                    stepRef="3EStandardCeiling" type="2" required={requiredStep["3EStandardCeiling"]}
                                                    stepSelected={stepSelectedLabel["3EStandardCeiling"] === undefined ? "" : stepSelectedLabel["3EStandardCeiling"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3E">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{step3A0 === "Moulding" ? t("arc_step2D_title") : t("dk_step2D_title")}</p>
                                            <img
                                                src={pageLanguage === 'fa' ? (step3A0 === "Moulding" ? require('../Images/drapery/dk/new_ceiling_to_window_3_arc_fa.svg').default : require('../Images/drapery/dk/new_ceiling_to_window_3_fa.svg').default) : (step3A0 === "Moulding" ? require('../Images/drapery/dk/new_ceiling_to_window_3_arc.svg').default : require('../Images/drapery/dk/new_ceiling_to_window_3.svg').default)}
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
                                        {/*                        if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.CeilingToWindow1}*/}
                                        {/*                dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                        {/*                contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                                postfixFa=""/>}*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "3EStandardCeiling", 0, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.CeilingToWindow1 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "3EStandardCeiling1");*/}
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
                                        {/*                        if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.CeilingToWindow2}*/}
                                        {/*                dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                        {/*                contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                                postfixFa=""/>}*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "3EStandardCeiling", 1, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.CeilingToWindow2 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "3EStandardCeiling2");*/}
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
                                        {/*                        if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.CeilingToWindow3}*/}
                                        {/*                dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                        {/*                contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                                postfixFa=""/>}*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "3EStandardCeiling", 2, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.CeilingToWindow3 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "3EStandardCeiling3");*/}
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
                                                        }} className={"measure_input" + (ceilingToWindow1 !== undefined && (ceilingToWindow1 < 1 || ceilingToWindow1 > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="ceilingToWindow1" value={NumToFa(`${ceilingToWindow1 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("CeilingToWindow1", parseInt(newValue));
                                                                                   setDeps("", "3EStandardCeiling1");
                                                                                   setCeilingToWindow1(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "3EStandardCeiling", 0, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "CeilingToWindow1");
                                                                                   setDeps("3EStandardCeiling1", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setCeilingToWindow1(undefined);
                                                                                       selectChanged(undefined, "3EStandardCeiling");
                                                                                   } else {
                                                                                       setCeilingToWindow1(parseInt(newValue));
                                                                                       selectChanged("3EStandardCeiling", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (ceilingToWindow1 !== undefined && (ceilingToWindow1 < 30 || ceilingToWindow1 > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>*/}
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("step3AIn_B")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["ceilingToWindow2"] = ref)} debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                inputs.current["ceilingToWindow3"].focus();
                                                            } else if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (ceilingToWindow2 !== undefined && (ceilingToWindow2 < 1 || ceilingToWindow2 > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="ceilingToWindow2" value={NumToFa(`${ceilingToWindow2 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("CeilingToWindow2", parseInt(newValue));
                                                                                   setDeps("", "3EStandardCeiling2");
                                                                                   setCeilingToWindow2(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "3EStandardCeiling", 1, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "CeilingToWindow2");
                                                                                   setDeps("3EStandardCeiling2", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setCeilingToWindow2(undefined);
                                                                                       selectChanged(undefined, "3EStandardCeiling");
                                                                                   } else {
                                                                                       setCeilingToWindow2(parseInt(newValue));
                                                                                       selectChanged("3EStandardCeiling", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (ceilingToWindow2 !== undefined && (ceilingToWindow2 < 30 || ceilingToWindow2 > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>*/}
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("step3AIn_C")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["ceilingToWindow3"] = ref)} debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (ceilingToWindow3 !== undefined && (ceilingToWindow3 < 1 || ceilingToWindow3 > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="ceilingToWindow3" value={NumToFa(`${ceilingToWindow3 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("CeilingToWindow3", parseInt(newValue));
                                                                                   setDeps("", "3EStandardCeiling3");
                                                                                   setCeilingToWindow3(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "3EStandardCeiling", 2, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "CeilingToWindow3");
                                                                                   setDeps("3EStandardCeiling3", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setCeilingToWindow3(undefined);
                                                                                       selectChanged(undefined, "3EStandardCeiling");
                                                                                   } else {
                                                                                       setCeilingToWindow3(parseInt(newValue));
                                                                                       selectChanged("3EStandardCeiling", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (ceilingToWindow3 !== undefined && (ceilingToWindow3 < 30 || ceilingToWindow3 > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>*/}
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep={[...depSet].findIndex(el => el.startsWith("3")) === -1 ? "3" : "3EStandardCeiling"} eventKey="4">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3EStandardCeilingFloor */}
                        <Card
                            className={step3 === "true" && step31 === "false" && ((step3A0 === "Ceiling" || step3A0 === "Moulding") && (step3A === "Standard" || step3A === "Left Corner Window" || step3A === "Right Corner Window") || (step3A === "Wall to Wall" && (step3A0 === "Ceiling" || step3A0 === "Moulding"))) && step3B !== "" && step3A0 !== "" && (step3B === "Floor" || step3B === "Slight Puddle") ? "" : "noDisplay"}>
                            <Card.Header className={[...depSet].findIndex(el => el.startsWith("3")) === -1 && (!accordionActiveKey.startsWith("3")) ? "hidden" : ""}>
                                <ContextAwareToggle eventKey="3E" stepNum={step3A === "Wall to Wall" ? t("2E") : t("2F")} stepTitle={t("dk_step2E")}
                                                    stepRef="3EStandardCeilingFloor" type="2" required={requiredStep["3EStandardCeilingFloor"]}
                                                    stepSelected={stepSelectedLabel["3EStandardCeilingFloor"] === undefined ? "" : stepSelectedLabel["3EStandardCeilingFloor"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3E">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{step3A0 === "Moulding" ? t("arc_step2E_title") : t("dk_step2E_title")}</p>
                                            <img
                                                src={pageLanguage === 'fa' ? (step3A0 === "Moulding" ? require('../Images/drapery/dk/new_ceiling_to_floor_3_arc_fa.svg').default : require('../Images/drapery/dk/new_ceiling_to_floor_3_fa.svg').default) : (step3A0 === "Moulding" ? require('../Images/drapery/dk/new_ceiling_to_floor_3_arc.svg').default : require('../Images/drapery/dk/new_ceiling_to_floor_3.svg').default)}
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
                                        {/*                        if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.CeilingToFloor1}*/}
                                        {/*                dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                        {/*                contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                                postfixFa=""/>}*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "3EStandardCeilingFloor", 0, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.CeilingToFloor1 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "3EStandardCeilingFloor1");*/}
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
                                        {/*                        if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.CeilingToFloor2}*/}
                                        {/*                dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                        {/*                contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                                postfixFa=""/>}*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "3EStandardCeilingFloor", 1, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.CeilingToFloor2 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "3EStandardCeilingFloor2");*/}
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
                                        {/*                        if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                        {/*                    }, 100);*/}
                                        {/*                }}*/}
                                        {/*                values={selectCustomValues.CeilingToFloor3}*/}
                                        {/*                dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                        {/*                contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                        {/*                                                                                postfixFa=""/>}*/}
                                        {/*                // optionRenderer={*/}
                                        {/*                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                        {/*                // }*/}
                                        {/*                onChange={(selected) => {*/}
                                        {/*                    if (selected[0] !== undefined) {*/}
                                        {/*                        optionSelectChanged_three(selected[0], "3EStandardCeilingFloor", 2, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);*/}
                                        {/*                        let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                        {/*                        temp.CeilingToFloor3 = selected;*/}
                                        {/*                        setSelectCustomValues(temp);*/}
                                        {/*                        setDeps("", "3EStandardCeilingFloor3");*/}
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
                                                        }} className={"measure_input" + (ceilingToFloor1 !== undefined && (ceilingToFloor1 < 1 || ceilingToFloor1 > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="ceilingToFloor1" value={NumToFa(`${ceilingToFloor1 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("CeilingToFloor1", parseInt(newValue));
                                                                                   setDeps("", "3EStandardCeilingFloor1");
                                                                                   setCeilingToFloor1(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "3EStandardCeilingFloor", 0, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "CeilingToFloor1");
                                                                                   setDeps("3EStandardCeilingFloor1", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setCeilingToFloor1(undefined);
                                                                                       selectChanged(undefined, "3EStandardCeilingFloor");
                                                                                   } else {
                                                                                       setCeilingToFloor1(parseInt(newValue));
                                                                                       selectChanged("3EStandardCeilingFloor", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (ceilingToFloor1 !== undefined && (ceilingToFloor1 < 30 || ceilingToFloor1 > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>*/}
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("step3AIn_B")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["ceilingToFloor2"] = ref)} debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                inputs.current["ceilingToFloor3"].focus();
                                                            } else if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (ceilingToFloor2 !== undefined && (ceilingToFloor2 < 1 || ceilingToFloor2 > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="ceilingToFloor2" value={NumToFa(`${ceilingToFloor2 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("CeilingToFloor2", parseInt(newValue));
                                                                                   setDeps("", "3EStandardCeilingFloor2");
                                                                                   setCeilingToFloor2(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "3EStandardCeilingFloor", 1, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "CeilingToFloor2");
                                                                                   setDeps("3EStandardCeilingFloor2", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setCeilingToFloor2(undefined);
                                                                                       selectChanged(undefined, "3EStandardCeilingFloor");
                                                                                   } else {
                                                                                       setCeilingToFloor2(parseInt(newValue));
                                                                                       selectChanged("3EStandardCeilingFloor", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (ceilingToFloor2 !== undefined && (ceilingToFloor2 < 30 || ceilingToFloor2 > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>*/}
                                                </div>
                                            </div>
                                            <div className="Three_select_container">
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("step3AIn_C")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput inputRef={ref => (inputs.current["ceilingToFloor3"] = ref)} debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (ceilingToFloor3 !== undefined && (ceilingToFloor3 < 1 || ceilingToFloor3 > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="ceilingToFloor3" value={NumToFa(`${ceilingToFloor3 || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("CeilingToFloor3", parseInt(newValue));
                                                                                   setDeps("", "3EStandardCeilingFloor3");
                                                                                   setCeilingToFloor3(parseInt(newValue));
                                                                                   optionSelectChanged_three(parseInt(newValue), "3EStandardCeilingFloor", 2, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "CeilingToFloor3");
                                                                                   setDeps("3EStandardCeilingFloor3", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setCeilingToFloor3(undefined);
                                                                                       selectChanged(undefined, "3EStandardCeilingFloor");
                                                                                   } else {
                                                                                       setCeilingToFloor3(parseInt(newValue));
                                                                                       selectChanged("3EStandardCeilingFloor", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (ceilingToFloor3 !== undefined && (ceilingToFloor3 < 30 || ceilingToFloor3 > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>*/}
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep={[...depSet].findIndex(el => el.startsWith("3")) === -1 ? "3" : "3EStandardCeilingFloor"} eventKey="4">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3F */}
                        <Card
                            className={step3 === "true" && step31 === "false" && step3A !== "" && step3B !== "" && step3A0 !== "" && !((step3A0 === "Ceiling" || step3A0 === "Moulding") && (step3A === "Standard" || step3A === "Left Corner Window" || step3A === "Right Corner Window")) && !(step3A === "Wall to Wall" && (step3A0 === "Ceiling" || step3A0 === "Moulding")) ? "" : "noDisplay"}>
                            <Card.Header className={[...depSet].findIndex(el => el.startsWith("3")) === -1 && (!accordionActiveKey.startsWith("3")) ? "hidden" : ""}>
                                <ContextAwareToggle eventKey="3F" stepNum={step3A === "Wall to Wall" ? t("2F") : t("2G")} stepTitle={t("dk_step2FWall")} stepRef="3F" type="2"
                                                    required={requiredStep["3F"]}
                                                    stepSelected={stepSelectedLabel["3F"] === undefined ? "" : stepSelectedLabel["3F"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3F">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("dk_step2FWall_title")}</p>
                                            <img
                                                src={pageLanguage === 'fa' ? require('../Images/drapery/dk/new_RodtoFrame_track_full.svg').default : require('../Images/drapery/dk/new_RodtoFrame_track_full.svg').default}
                                                className="img-fluid frame_with_top2" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                {/*<label className="select_label">{t("Width")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                                {/*<div className="select_container select_container_num">*/}
                                                {/*    <Select*/}
                                                {/*        className="select"*/}
                                                {/*        placeholder={t("Please Select")}*/}
                                                {/*        portal={document.body}*/}
                                                {/*        dropdownPosition="bottom"*/}
                                                {/*        dropdownHandle={false}*/}
                                                {/*        dropdownGap={0}*/}
                                                {/*        onDropdownOpen={() => {*/}
                                                {/*            let temp1 = window.scrollY;*/}
                                                {/*            window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                                {/*            setTimeout(() => {*/}
                                                {/*                let temp2 = window.scrollY;*/}
                                                {/*                if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                                {/*            }, 100);*/}
                                                {/*        }}*/}
                                                {/*        values={selectCustomValues.ShadeMount}*/}
                                                {/*        dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                                {/*        contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                                {/*                                                                        postfixFa=""/>}*/}
                                                {/*        // optionRenderer={*/}
                                                {/*        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                                {/*        // }*/}
                                                {/*        onChange={(selected) => {*/}
                                                {/*            if (selected[0] !== undefined) {*/}
                                                {/*                optionSelectChanged("3F", selected[0], "cm", "س\u200Cم", pageLanguage);*/}
                                                {/*                let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                                {/*                temp.ShadeMount = selected;*/}
                                                {/*                setSelectCustomValues(temp);*/}
                                                {/*                setDeps("", "3F");*/}
                                                {/*                setCart("ShadeMount", selected[0].value);*/}
                                                {/*            }*/}
                                                {/*        }}*/}
                                                {/*        options={SelectOptionRange(10, 50, 1, "cm", "", pageLanguage)}*/}
                                                {/*    />*/}
                                                {/*</div>*/}
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
                                                                                   setDeps("", "3F");
                                                                                   setMount(parseInt(newValue));
                                                                                   optionSelectChanged("3F", parseInt(newValue), "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "ShadeMount");
                                                                                   setDeps("3F", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setMount(undefined);
                                                                                       selectChanged(undefined, "3F");
                                                                                   } else {
                                                                                       setMount(parseInt(newValue));
                                                                                       selectChanged("3F", undefined, t("Invalid Measurements"));
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
                                        <NextStep currentStep="3F" eventKey="3G">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">{t("grommet_step3E_help_1")}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3G*/}
                        <Card
                            className={step3 === "true" && step31 === "false" && step3A !== "" && step3B !== "" && step3A0 !== "" && !((step3A0 === "Ceiling" || step3A0 === "Moulding") && (step3B === "Floor" || step3B === "Slight Puddle")) ? "" : "noDisplay"}>
                            <Card.Header className={[...depSet].findIndex(el => el.startsWith("3")) === -1 && (!accordionActiveKey.startsWith("3")) ? "hidden" : ""}>
                                <ContextAwareToggle eventKey="3G" stepNum={step3A0 !== "Wall" ? (step3A === "Wall to Wall" ? t("2F") : t("2G")) : (step3A === "Wall to Wall" ? t("2G") : t("2H"))} stepTitle={t("dk_step2FWall2")} stepRef="3G" type="2"
                                                    required={requiredStep["3G"]}
                                                    stepSelected={stepSelectedLabel["3G"] === undefined ? "" : stepSelectedLabel["3G"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3G">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("dk_step2GWall_title")}</p>
                                            <img
                                                src={pageLanguage === 'fa' ? require('../Images/drapery/dk/new_CeilingToFloor1_track_full_fa.svg').default : require('../Images/drapery/dk/new_CeilingToFloor1_track_full.svg').default}
                                                className="img-fluid tall_curtain_image" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                {/*<label className="select_label">{t("Height")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                                {/*<div className="select_container select_container_num">*/}
                                                {/*    <Select*/}
                                                {/*        className="select"*/}
                                                {/*        placeholder={t("Please Select")}*/}
                                                {/*        portal={document.body}*/}
                                                {/*        dropdownPosition="bottom"*/}
                                                {/*        dropdownHandle={false}*/}
                                                {/*        dropdownGap={0}*/}
                                                {/*        onDropdownOpen={() => {*/}
                                                {/*            let temp1 = window.scrollY;*/}
                                                {/*            window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                                {/*            setTimeout(() => {*/}
                                                {/*                let temp2 = window.scrollY;*/}
                                                {/*                if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                                {/*            }, 100);*/}
                                                {/*        }}*/}
                                                {/*        values={selectCustomValues.CeilingToFloor}*/}
                                                {/*        dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                                {/*        contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                                {/*                                                                        postfixFa=""/>}*/}
                                                {/*        // optionRenderer={*/}
                                                {/*        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                                {/*        // }*/}
                                                {/*        onChange={(selected) => {*/}
                                                {/*            if (selected[0] !== undefined) {*/}
                                                {/*                optionSelectChanged("3G", selected[0], "cm", "س\u200Cم", pageLanguage);*/}
                                                {/*                let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                                {/*                temp.CeilingToFloor = selected;*/}
                                                {/*                setSelectCustomValues(temp);*/}
                                                {/*                setDeps("", "3G");*/}
                                                {/*                setCart("CeilingToFloor", selected[0].value);*/}
                                                {/*            }*/}
                                                {/*        }}*/}
                                                {/*        options={SelectOptionRange(100, 500, 1, "cm", "", pageLanguage)}*/}
                                                {/*    />*/}
                                                {/*</div>*/}
                                                <div className="measure_input_container">
                                                    {/*<h1 className="measure_input_label">{t("step3AIn_A")}</h1>*/}
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (ceilingToFloor !== undefined && (ceilingToFloor < 1 || ceilingToFloor > 1000 || (heightCart && (ceilingToFloor < +heightCart))) ? " measure_input_err" : "")} type="text"
                                                                       name="ceilingToFloor" value={NumToFa(`${ceilingToFloor || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000 && !(heightCart && (parseInt(newValue) < +heightCart))) {
                                                                                   setCartLoading(true);
                                                                                   setCart("CeilingToFloor", parseInt(newValue));
                                                                                   setDeps("", "3G");
                                                                                   setCeilingToFloor(parseInt(newValue));
                                                                                   optionSelectChanged("3G", parseInt(newValue), "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "CeilingToFloor");
                                                                                   setDeps("3G", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setCeilingToFloor(undefined);
                                                                                       selectChanged(undefined, "3G");
                                                                                   } else {
                                                                                       setCeilingToFloor(parseInt(newValue));
                                                                                       selectChanged("3G", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (ceilingToFloor !== undefined && (ceilingToFloor < 1 || ceilingToFloor > 1000 || (heightCart && (ceilingToFloor < +heightCart))) ? " measure_input_desc_err" : "")}>{(heightCart && (ceilingToFloor < +heightCart)) ? t("roomHeight_more_than_height") : ""}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep={[...depSet].findIndex(el => el.startsWith("3")) === -1 ? "3" : "3G"} eventKey="4">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3ARod */}
                        <Card
                            className={step3 === "true" && step31 === "true" ? "" : "noDisplay"}>
                            <Card.Header className={[...depSet].findIndex(el => el.startsWith("3")) === -1 && (!accordionActiveKey.startsWith("3")) ? "hidden" : ""}>
                                <ContextAwareToggle eventKey="3A" stepNum={t("3A")} stepTitle={t("dk_step2A")} stepRef="3ARod" type="1" required={requiredStep["3ARod"]}
                                                    stepSelected={stepSelectedLabel["3ARod"] === undefined ? "" : stepSelectedLabel["3ARod"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3A">
                                <Card.Body>
                                    <div className="card_body card_body_radio card_body_finished_length card_body_finished_length_grommet">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("dk_step2A_title")}</p>
                                        </div>
                                        <div className="box25 radio_style">
                                            <img
                                                src={pageLanguage === "fa" ? require('../Images/drapery/grommet/length type-05.svg').default : require('../Images/drapery/grommet/length type-04.svg').default}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" text={t("Sill")} value="1" name="step3ARod" ref-num="3ARod" id="3ARod1"
                                                   checked={step3ARod === "Sill"}
                                                   onChange={e => {
                                                       setStep3ARod("Sill");
                                                       clearInputs();
                                                       setCart("FinishedLengthType", "Sill", "RodToFloor,Width3C,ExtensionLeft,ExtensionRight,Height3E,WindowToFloor,ShadeMount,CeilingToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3");
                                                       setDeps("3BRod,3CRod,3DRod", "3ARod,3ARod1,3CRodFloor,3B,3C,3D1,3D2,3E,3F,3G,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                       selectChanged(e, "3CRodFloor,3B,3C,3E,3EFloor,3F,3G,3EStandardCeiling,3EStandardCeilingFloor");
                                                   }} ref={ref => (inputs.current["3ARod1"] = ref)}/>
                                            <label htmlFor="3ARod1">{t("Sill")}</label>
                                        </div>
                                        <div className="box25 radio_style">
                                            <img
                                                src={pageLanguage === "fa" ? require('../Images/drapery/grommet/length type-06.svg').default : require('../Images/drapery/grommet/length type-03.svg').default}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" value="2" name="step3ARod" ref-num="3ARod" id="3ARod2" checked={step3ARod === "Apron"}
                                                   onChange={e => {
                                                       setStep3ARod("Apron");
                                                       clearInputs();
                                                       setStep3ARod1("");
                                                       setCart("FinishedLengthType", "Apron", "RodToFloor,Width3C,ExtensionLeft,ExtensionRight,Height3E,WindowToFloor,ShadeMount,CeilingToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3");
                                                       setDeps("3BRod,3CRod,3DRod", "3ARod,3ARod1,3CRodFloor,3B,3C,3D1,3D2,3E,3F,3G,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                       selectChanged(e, "3CRodFloor,3B,3C,3E,3EFloor,3F,3G,3EStandardCeiling,3EStandardCeilingFloor");
                                                   }} ref={ref => (inputs.current["3ARod2"] = ref)}/>
                                            <label htmlFor="3ARod2">{t("Apron")}</label>
                                        </div>
                                        <div className="box25 radio_style">
                                            <img
                                                src={pageLanguage === "fa" ? require('../Images/drapery/grommet/length type-07.svg').default : require('../Images/drapery/grommet/length type-02.svg').default}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" text={t("Floor")} value="3" name="step3ARod" ref-num="3ARod" id="3ARod3"
                                                   checked={step3ARod === "Floor"}
                                                   onChange={e => {
                                                       setStep3ARod("Floor");
                                                       clearInputs();
                                                       setCart("FinishedLengthType", "Floor", "RodToBottom,Width3C,ExtensionLeft,ExtensionRight,Height3E,WindowToFloor,ShadeMount,CeilingToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3");
                                                       setDeps("3BRod,3CRodFloor,3DRod", "3ARod,3ARod1,3CRod,3B,3C,3D1,3D2,3E,3F,3G,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                       selectChanged(e, "3D,3B,3C,3E,3EFloor,3F,3G,3EStandardCeiling,3EStandardCeilingFloor");
                                                   }} ref={ref => (inputs.current["3ARod3"] = ref)}/>
                                            <label htmlFor="3ARod3">{t("Floor")}</label>
                                        </div>
                                        <div className="box25 radio_style">
                                            <img
                                                src={pageLanguage === "fa" ? require('../Images/drapery/grommet/length type-08.svg').default : require('../Images/drapery/grommet/length type-01.svg').default}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" text={t("Slight Puddle")} value="4" name="step3ARod" ref-num="3ARod" id="3ARod4"
                                                   checked={step3ARod === "Slight Puddle"}
                                                   onChange={e => {
                                                       setStep3ARod("Slight Puddle");
                                                       clearInputs();
                                                       setCart("FinishedLengthType", "Slight Puddle", "RodToBottom,Width3C,ExtensionLeft,ExtensionRight,Height3E,WindowToFloor,ShadeMount,CeilingToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3");
                                                       setDeps("3BRod,3CRodFloor,3DRod", "3ARod,3ARod1,3CRod,3B,3C,3D1,3D2,3E,3F,3G,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                                       selectChanged(e, "3D,3B,3C,3E,3EFloor,3F,3G,3EStandardCeiling,3EStandardCeilingFloor");
                                                   }} ref={ref => (inputs.current["3ARod4"] = ref)}/>
                                            <label htmlFor="3ARod4">{t("Slight Puddle")}</label>
                                        </div>
                                        
                                        <div className={step3ARod === "Apron" ? (step3ARodErr1 ? "secondary_options secondary_options_err" : "secondary_options") : "noDisplay"}>
                                            <div className="card-body-display-flex">
                                                <div className="checkbox_style checkbox_style_step2">
                                                    <input type="checkbox" text={t("Apron")} value="3" name="step3ARod1" ref-num="3ARod" checked={step3ARod1 === "true"}
                                                           onChange={(e) => {
                                                               if (e.target.checked) {
                                                                   selectChanged(e);
                                                                   setDeps("", "3ARod1");
                                                                   setStep3ARod1("true");
                                                                   setStep3ARodErr1(false);
                                                               } else {
                                                                   setStep3ARod1("false");
                                                                   setDeps("3ARod1", "");
                                                                   selectChanged(undefined, "3ARod");
                                                               }
                                                           }} id="3ARod11" ref={ref => (inputs.current["3ARod11"] = ref)}/>
                                                    <label htmlFor="3ARod11" className="checkbox_label">
                                                        <img className="checkbox_label_img checkmark1 img-fluid"
                                                             src={require('../Images/public/checkmark1_checkbox.png')}
                                                             alt=""/>
                                                    </label>
                                                    <span className="checkbox_text">
                                                        {t("grommet_apron_checkbox_title")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {step3ARodErr1 && <div className="input_not_valid">{t("grommet_step3AErr1")}</div>}
                                        <NextStep currentStep="3ARod" eventKey="3B">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"></p>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle"><b>{t("dk_step2a_help1")}</b>{t("dk_step2a_help2")}</li>
                                                    <li className="no_listStyle"><b>{t("grommet_step3a_help2")}</b>{t("grommet_step3a_help3")}</li>
                                                    <li className="no_listStyle"><b>{t("grommet_step3a_help4")}</b>{t("grommet_step3a_help5")}</li>
                                                    <li className="no_listStyle"><b>{t("grommet_step3a_help6")}</b>{t("grommet_step3a_help7")}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3BRod*/}
                        <Card
                            className={step3 === "true" && step31 === "true" && ((step3ARod !== "" && step3ARod !== "Apron") || (step3ARod === "Apron" && step3ARod1 === "true")) ? "" : "noDisplay"}>
                            <Card.Header className={[...depSet].findIndex(el => el.startsWith("3")) === -1 && (!accordionActiveKey.startsWith("3")) ? "hidden" : ""}>
                                <ContextAwareToggle eventKey="3B" stepNum={t("3B")} stepTitle={t("grommet_step3BRod")} stepRef="3BRod" type="2" required={requiredStep["3BRod"]}
                                                    stepSelected={stepSelectedLabel["3BRod"] === undefined ? "" : stepSelectedLabel["3BRod"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3B">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("grommet_step3BRod_title")}</p>
                                            <img src={require('../Images/drapery/grommet/rod_width.svg').default} className="img-fluid frame_with_top" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                {/*<label className="select_label">{t("Width")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                                {/*<div className="select_container select_container_num">*/}
                                                {/*    <Select*/}
                                                {/*        className="select"*/}
                                                {/*        placeholder={t("Please Select")}*/}
                                                {/*        portal={document.body}*/}
                                                {/*        dropdownPosition="bottom"*/}
                                                {/*        dropdownHandle={false}*/}
                                                {/*        dropdownGap={0}*/}
                                                {/*        onDropdownOpen={() => {*/}
                                                {/*            let temp1 = window.scrollY;*/}
                                                {/*            window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                                {/*            setTimeout(() => {*/}
                                                {/*                let temp2 = window.scrollY;*/}
                                                {/*                if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                                {/*            }, 100);*/}
                                                {/*        }}*/}
                                                {/*        values={selectCustomValues.RodWidth}*/}
                                                {/*        dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                                {/*        contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                                {/*                                                                        postfixFa=""/>}*/}
                                                {/*        // optionRenderer={*/}
                                                {/*        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                                {/*        // }*/}
                                                {/*        onChange={(selected) => {*/}
                                                {/*            if (selected[0] !== undefined) {*/}
                                                {/*                optionSelectChanged("3BRod", selected[0], "cm", "س\u200Cم", pageLanguage);*/}
                                                {/*                let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                                {/*                temp.RodWidth = selected;*/}
                                                {/*                setSelectCustomValues(temp);*/}
                                                {/*                setDeps("", "3BRod");*/}
                                                {/*                setCart("RodWidth", selected[0].value);*/}
                                                {/*            }*/}
                                                {/*        }}*/}
                                                {/*        options={SelectOptionRange(30, 500, 1, "cm", "", pageLanguage)}*/}
                                                {/*    />*/}
                                                {/*</div>*/}
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Width")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (rodWidth !== undefined && (rodWidth < 1 || rodWidth > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="rodWidth" value={NumToFa(`${rodWidth || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("RodWidth", parseInt(newValue));
                                                                                   setDeps("", "3BRod");
                                                                                   setRodWidth(parseInt(newValue));
                                                                                   optionSelectChanged("3BRod", parseInt(newValue), "cm", "س\u200Cم", pageLanguage);
                                                                    
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "RodWidth");
                                                                                   setDeps("3BRod", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setRodWidth(undefined);
                                                                                       selectChanged(undefined, "3BRod");
                                                                                   } else {
                                                                                       setRodWidth(parseInt(newValue));
                                                                                       selectChanged("3BRod", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (rodWidth !== undefined && (rodWidth < 30 || rodWidth > 300) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 300`, pageLanguage)} {t("cm_label")}</h2>*/}
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="3BRod" eventKey="3C">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3CRod*/}
                        <Card
                            className={step3 === "true" && step31 === "true" && (step3ARod === "Sill" || (step3ARod === "Apron" && step3ARod1 === "true")) ? "" : "noDisplay"}>
                            <Card.Header className={[...depSet].findIndex(el => el.startsWith("3")) === -1 && (!accordionActiveKey.startsWith("3")) ? "hidden" : ""}>
                                <ContextAwareToggle eventKey="3C" stepNum={t("3C")} stepTitle={t("grommet_step3DRod")} stepRef="3CRod" type="2" required={requiredStep["3CRod"]}
                                                    stepSelected={stepSelectedLabel["3CRod"] === undefined ? "" : stepSelectedLabel["3CRod"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3C">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("grommet_step3DRod_title")}</p>
                                            <img src={require('../Images/drapery/grommet/RodToBottom.svg').default} className="img-fluid just_frame" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                {/*<label className="select_label">{t("Height")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                                {/*<div className="select_container select_container_num">*/}
                                                {/*    <Select*/}
                                                {/*        className="select"*/}
                                                {/*        placeholder={t("Please Select")}*/}
                                                {/*        portal={document.body}*/}
                                                {/*        dropdownPosition="bottom"*/}
                                                {/*        dropdownHandle={false}*/}
                                                {/*        dropdownGap={0}*/}
                                                {/*        onDropdownOpen={() => {*/}
                                                {/*            let temp1 = window.scrollY;*/}
                                                {/*            window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                                {/*            setTimeout(() => {*/}
                                                {/*                let temp2 = window.scrollY;*/}
                                                {/*                if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                                {/*            }, 100);*/}
                                                {/*        }}*/}
                                                {/*        values={selectCustomValues.RodToBottom}*/}
                                                {/*        dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                                {/*        contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                                {/*                                                                        postfixFa=""/>}*/}
                                                {/*        // optionRenderer={*/}
                                                {/*        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                                {/*        // }*/}
                                                {/*        onChange={(selected) => {*/}
                                                {/*            if (selected[0] !== undefined) {*/}
                                                {/*                optionSelectChanged("3CRod", selected[0], "cm", "س\u200Cم", pageLanguage);*/}
                                                {/*                let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                                {/*                temp.RodToBottom = selected;*/}
                                                {/*                setSelectCustomValues(temp);*/}
                                                {/*                setDeps("", "3CRod");*/}
                                                {/*                setCart("RodToBottom", selected[0].value);*/}
                                                {/*            }*/}
                                                {/*        }}*/}
                                                {/*        options={SelectOptionRange(30, 500, 1, "cm", "", pageLanguage)}*/}
                                                {/*    />*/}
                                                {/*</div>*/}
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Height")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (rodToBottom !== undefined && (rodToBottom < 1 || rodToBottom > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="rodToBottom1" value={NumToFa(`${rodToBottom || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("RodToBottom", parseInt(newValue));
                                                                                   setDeps("", "3CRod");
                                                                                   setRodToBottom(parseInt(newValue));
                                                                                   optionSelectChanged("3CRod", parseInt(newValue), "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "RodToBottom");
                                                                                   setDeps("3CRod", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setRodToBottom(undefined);
                                                                                       selectChanged(undefined, "3CRod");
                                                                                   } else {
                                                                                       setRodToBottom(parseInt(newValue));
                                                                                       selectChanged("3CRod", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (rodToBottom !== undefined && (rodToBottom < 30 || rodToBottom > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>*/}
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="3CRod" eventKey="3D">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3CRodFloor*/}
                        <Card
                            className={step3 === "true" && step31 === "true" && (step3ARod === "Floor" || step3ARod === "Slight Puddle") ? "" : "noDisplay"}>
                            <Card.Header className={[...depSet].findIndex(el => el.startsWith("3")) === -1 && (!accordionActiveKey.startsWith("3")) ? "hidden" : ""}>
                                <ContextAwareToggle eventKey="3C" stepNum={t("3C")} stepTitle={t("grommet_step3DRodFloor")} stepRef="3CRodFloor" type="2"
                                                    required={requiredStep["3CRodFloor"]}
                                                    stepSelected={stepSelectedLabel["3CRodFloor"] === undefined ? "" : stepSelectedLabel["3CRodFloor"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3C">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("grommet_step3DRodFloor_title")}</p>
                                            <img
                                                src={pageLanguage === 'fa' ? require('../Images/drapery/grommet/RodtoFloor.svg').default : require('../Images/drapery/grommet/RodtoFloor.svg').default}
                                                className="img-fluid just_frame" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                {/*<label className="select_label">{t("Height")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                                {/*<div className="select_container select_container_num">*/}
                                                {/*    <Select*/}
                                                {/*        className="select"*/}
                                                {/*        placeholder={t("Please Select")}*/}
                                                {/*        portal={document.body}*/}
                                                {/*        dropdownPosition="bottom"*/}
                                                {/*        dropdownHandle={false}*/}
                                                {/*        dropdownGap={0}*/}
                                                {/*        onDropdownOpen={() => {*/}
                                                {/*            let temp1 = window.scrollY;*/}
                                                {/*            window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                                {/*            setTimeout(() => {*/}
                                                {/*                let temp2 = window.scrollY;*/}
                                                {/*                if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                                {/*            }, 100);*/}
                                                {/*        }}*/}
                                                {/*        values={selectCustomValues.RodToFloor}*/}
                                                {/*        dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                                {/*        contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                                {/*                                                                        postfixFa=""/>}*/}
                                                {/*        // optionRenderer={*/}
                                                {/*        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                                {/*        // }*/}
                                                {/*        onChange={(selected) => {*/}
                                                {/*            if (selected[0] !== undefined) {*/}
                                                {/*                optionSelectChanged("3CRodFloor", selected[0], "cm", "س\u200Cم", pageLanguage);*/}
                                                {/*                let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                                {/*                temp.RodToFloor = selected;*/}
                                                {/*                setSelectCustomValues(temp);*/}
                                                {/*                setDeps("", "3CRodFloor");*/}
                                                {/*                setCart("RodToFloor", selected[0].value);*/}
                                                {/*            }*/}
                                                {/*        }}*/}
                                                {/*        options={SelectOptionRange(30, 500, 1, "cm", "", pageLanguage)}*/}
                                                {/*    />*/}
                                                {/*</div>*/}
                                                <div className="measure_input_container">
                                                    <h1 className="measure_input_label">{t("Height")}</h1>
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (rodToFloor !== undefined && (rodToFloor < 1 || rodToFloor > 1000) ? " measure_input_err" : "")} type="text"
                                                                       name="rodToFloor1" value={NumToFa(`${rodToFloor || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000) {
                                                                                   setCartLoading(true);
                                                                                   setCart("RodToFloor", parseInt(newValue));
                                                                                   setDeps("", "3CRodFloor");
                                                                                   setRodToFloor(parseInt(newValue));
                                                                                   optionSelectChanged("3CRodFloor", parseInt(newValue), "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "RodToFloor");
                                                                                   setDeps("3CRodFloor", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setRodToFloor(undefined);
                                                                                       selectChanged(undefined, "3CRodFloor");
                                                                                   } else {
                                                                                       setRodToFloor(parseInt(newValue));
                                                                                       selectChanged("3CRodFloor", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    {/*<h2 className={"measure_input_desc" + (rodToFloor !== undefined && (rodToFloor < 30 || rodToFloor > 400) ? " measure_input_desc_err" : "")}>{NumToFa(`30 - 400`, pageLanguage)} {t("cm_label")}</h2>*/}
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="3CRodFloor" eventKey="3D">{t("NEXT STEP")}</NextStep>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 3DRod */}
                        <Card
                            className={step3 === "true" && step31 === "true" && ((step3ARod !== "" && step3ARod !== "Apron") || (step3ARod === "Apron" && step3ARod1 === "true")) ? "" : "noDisplay"}>
                            <Card.Header className={[...depSet].findIndex(el => el.startsWith("3")) === -1 && (!accordionActiveKey.startsWith("3")) ? "hidden" : ""}>
                                <ContextAwareToggle eventKey="3D" stepNum={t("3D")} stepTitle={t("dk_step2FWall2")} stepRef="3DRod" type="2" required={requiredStep["3DRod"]}
                                                    stepSelected={stepSelectedLabel["3DRod"] === undefined ? "" : stepSelectedLabel["3DRod"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3D">
                                <Card.Body>
                                    <div className="card_body">
                                        <div className="box100">
                                            <p className="step_selection_title">{t("dk_step2GWall_title")}</p>
                                            <img
                                                src={pageLanguage === 'fa' ? require('../Images/drapery/grommet/CeilingToFloor.svg').default : require('../Images/drapery/grommet/CeilingToFloor.svg').default}
                                                className="img-fluid frame_with_top2" alt=""/>
                                        </div>
                                        <div className="box100 Three_selection_container">
                                            <div className="box100">
                                                {/*<label className="select_label">{t("Width")}<p className="farsi_cm">{t("select_cm")}</p></label>*/}
                                                {/*<div className="select_container select_container_num">*/}
                                                {/*    <Select*/}
                                                {/*        className="select"*/}
                                                {/*        placeholder={t("Please Select")}*/}
                                                {/*        portal={document.body}*/}
                                                {/*        dropdownPosition="bottom"*/}
                                                {/*        dropdownHandle={false}*/}
                                                {/*        dropdownGap={0}*/}
                                                {/*        onDropdownOpen={() => {*/}
                                                {/*            let temp1 = window.scrollY;*/}
                                                {/*            window.scrollTo(window.scrollX, window.scrollY + 1);*/}
                                                {/*            setTimeout(() => {*/}
                                                {/*                let temp2 = window.scrollY;*/}
                                                {/*                if (temp2 === temp1) window.scrollTo(window.scrollX, window.scrollY - 1);*/}
                                                {/*            }, 100);*/}
                                                {/*        }}*/}
                                                {/*        values={selectCustomValues.CeilingToFloor4}*/}
                                                {/*        dropdownRenderer={({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>}*/}
                                                {/*        contentRenderer={({props, state, methods}) => <CustomControlNum props={props} state={state} methods={methods} postfix="cm"*/}
                                                {/*                                                                        postfixFa=""/>}*/}
                                                {/*        // optionRenderer={*/}
                                                {/*        //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>*/}
                                                {/*        // }*/}
                                                {/*        onChange={(selected) => {*/}
                                                {/*            if (selected[0] !== undefined) {*/}
                                                {/*                optionSelectChanged("3DRod", selected[0], "cm", "س\u200Cم", pageLanguage);*/}
                                                {/*                let temp = JSON.parse(JSON.stringify(selectCustomValues));*/}
                                                {/*                temp.CeilingToFloor4 = selected;*/}
                                                {/*                setSelectCustomValues(temp);*/}
                                                {/*                setDeps("", "3DRod");*/}
                                                {/*                setCart("CeilingToFloor", selected[0].value);*/}
                                                {/*            }*/}
                                                {/*        }}*/}
                                                {/*        options={SelectOptionRange(100, 500, 1, "cm", "", pageLanguage)}*/}
                                                {/*    />*/}
                                                {/*</div>*/}
                                                <div className="measure_input_container">
                                                    {/*<h1 className="measure_input_label">{t("step3AIn_A")}</h1>*/}
                                                    <div className="measure_input_field_container">
                                                        <DebounceInput debounceTimeout={1500} autoComplete="off" onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(NumberToPersianWord.convertPeToEn(e.key)) && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) {
                                                                e.preventDefault();
                                                            }
                                                        }} className={"measure_input" + (ceilingToFloor !== undefined && (ceilingToFloor < 1 || ceilingToFloor > 1000 || (heightCart && (ceilingToFloor < +heightCart))) ? " measure_input_err" : "")} type="text"
                                                                       name="ceilingToFloor" value={NumToFa(`${ceilingToFloor || ""}`, pageLanguage)}
                                                                       onChange={(e) => {
                                                                           setTimeout(() => {
                                                                               let newValue = NumberToPersianWord.convertPeToEn(e.target.value);
                                                                               newValue = isNaN(newValue) ? "" : newValue;
                                                                               if (newValue && newValue !== "" && parseInt(newValue) >= 1 && parseInt(newValue) <= 1000 && !(heightCart && (parseInt(newValue) < +heightCart))) {
                                                                                   setCartLoading(true);
                                                                                   setCart("CeilingToFloor", parseInt(newValue));
                                                                                   setDeps("", "3DRod");
                                                                                   setCeilingToFloor(parseInt(newValue));
                                                                                   optionSelectChanged("3DRod", parseInt(newValue), "cm", "س\u200Cم", pageLanguage);
                                                                               } else {
                                                                                   setCartLoading(true);
                                                                                   setCart("", "", "CeilingToFloor");
                                                                                   setDeps("3DRod", "");
                                                                                   if (newValue === "" || isNaN(parseInt(newValue))) {
                                                                                       setCeilingToFloor(undefined);
                                                                                       selectChanged(undefined, "3DRod");
                                                                                   } else {
                                                                                       setCeilingToFloor(parseInt(newValue));
                                                                                       selectChanged("3DRod", undefined, t("Invalid Measurements"));
                                                                                   }
                                                                               }
                                                                           }, 300);
                                                                       }}/>
                                                        <div className="measure_input_postfix">{t("cm_label")}</div>
                                                    </div>
                                                    <h2 className={"measure_input_desc" + (ceilingToFloor !== undefined && (ceilingToFloor < 1 || ceilingToFloor > 1000 || (heightCart && (ceilingToFloor < +heightCart))) ? " measure_input_desc_err" : "")}>{(heightCart && (ceilingToFloor < +heightCart)) ? t("roomHeight_more_than_height") : ""}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep={[...depSet].findIndex(el => el.startsWith("3")) === -1 ? "3" : "3DRod"} eventKey="4">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle single_line_height">{t("grommet_step3E_help_1")}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 4 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="4" stepNum={t("4")} stepTitle={t("grommet_step4")} stepRef="4" type="1" required={requiredStep["4"]}
                                                    stepSelected={stepSelectedLabel["4"] === undefined ? "" : stepSelectedLabel["4"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="4">
                                <Card.Body>
                                    <div className="card_body card_body_radio tall_img_card_body">
                                        <div className="box50 radio_style">
                                            {/*<img src={require('../Images/drapery/dk/window-Inside.svg').default} className="img-fluid" alt=""/>*/}
                                            <input className="radio" type="radio" text={t("Standard Lining")} value="1" name="step4" ref-num="4" id="41"
                                                   checked={step4 === "Standard Lining"}
                                                   onChange={e => {
                                                       setStep4("Standard Lining");
                                                       setDeps("", "4");
                                                       setCart("Lining", "Standard Lining");
                                                       selectChanged(e);
                                                
                                                   }} ref={ref => (inputs.current["41"] = ref)}/>
                                            <label htmlFor="41">{t("Standard Lining")}<br/><p
                                                className="surcharge_price">{t("No Additional Charge")}</p>
                                            </label>
                                        </div>
                                        <div className="box50 radio_style">
                                            {/*<img src={require('../Images/drapery/dk/window-Outside.svg').default} className="img-fluid" alt=""/>*/}
                                            <input className="radio" type="radio" text={t("Privacy Lining")} value="2" name="step4" ref-num="4" id="42"
                                                   checked={step4 === "Privacy Lining"}
                                                   onChange={e => {
                                                       setStep4("Privacy Lining");
                                                       setDeps("", "4");
                                                       setCart("Lining", "Privacy Lining");
                                                       selectChanged(e);
                                                   }} ref={ref => (inputs.current["42"] = ref)}/>
                                            <label htmlFor="42">{t("Privacy Lining")}<br/><p
                                                className="surcharge_price">{liningPrice !== 0 ? (t("Add ") + GetPrice(liningPrice, pageLanguage, t("TOMANS"))) : t("Surcharge Applies")}</p>
                                            </label>
                                        </div>
                                        
                                        <NextStep currentStep="4" eventKey="5">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header">{t("grommet_lining_help_1")}</p>
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
                                                                                                  src={popoverImages["step41"] === undefined ? require('../Images/drapery/grommet/standard_lining.jpg') : popoverImages["step41"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">{t("grommet_lining_help_1")}</span>
                                                                                              <span className="popover_thumbnails">
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/grommet/standard_lining.jpg')}
                                                                                                           text="step41"
                                                                                                           onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                           className="popover_thumbnail_img img-fluid"
                                                                                                           alt=""/>
                                                                                                  </div>
                                                                                              </span>
                                                                                          </div>
                                                                                      </div>
                                                                                  }/>
                                                            }
                                                        </span>{t("grommet_lining_help_2")}</li>
                                                    <li>{t("grommet_lining_help_3")}</li>
                                                    <li>{t("grommet_lining_help_4")}</li>
                                                </ul>
                                            </div>
                                            <div className="help_column help_right_column">
                                                <p className="help_column_header">{t("grommet_lining_help_5")}</p>
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
                                                                                                  src={popoverImages["step42"] === undefined ? require('../Images/drapery/grommet/privacy_lining.jpg') : popoverImages["step42"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">{t("grommet_lining_help_5")}</span>
                                                                                              <span className="popover_thumbnails">
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/grommet/privacy_lining.jpg')}
                                                                                                           text="step42"
                                                                                                           onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                           className="popover_thumbnail_img img-fluid"
                                                                                                           alt=""/>
                                                                                                  </div>
                                                                                              </span>
                                                                                          </div>
                                                                                      </div>
                                                                                  }/>
                                                            }
                                                        </span>{t("grommet_lining_help_6")}</li>
                                                    <li>{t("grommet_lining_help_7")}</li>
                                                    <li>{t("grommet_lining_help_8")}</li>
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
                                <ContextAwareToggle eventKey="5" stepNum={t("5")} stepTitle={t("grommet_step5")} stepRef="5" type="1" required={requiredStep["5"]}
                                                    stepSelected={stepSelectedLabel["5"] === undefined ? "" : stepSelectedLabel["5"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="5">
                                <Card.Body>
                                    <div className="card_body card_body_radio tall_img_card_body">
                                        <div className="box50 radio_style">
                                            {/*<img src={require('../Images/drapery/dk/window-Outside.svg').default} className="img-fluid" alt=""/>*/}
                                            <input className="radio" type="radio" text={t("Full")} value="1" name="step5" ref-num="5" id="51"
                                                   checked={step5 === "Full"}
                                                   onChange={e => {
                                                       setStep5("Full");
                                                       setDeps("", "5");
                                                       setCart("PanelCoverage", "Full");
                                                       selectChanged(e);
                                                   }} ref={ref => (inputs.current["51"] = ref)}/>
                                            <label htmlFor="51">{t("Full")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            {/*<img src={require('../Images/drapery/dk/window-Inside.svg').default} className="img-fluid" alt=""/>*/}
                                            <input className="radio" type="radio" text={t("Decorative")} value="2" name="step5" ref-num="5" id="52"
                                                   checked={step5 === "Decorative"}
                                                   onChange={e => {
                                                       setStep5("Decorative");
                                                       setDeps("", "5");
                                                       setCart("PanelCoverage", "Decorative");
                                                       selectChanged(e);
                                                
                                                   }} ref={ref => (inputs.current["52"] = ref)}/>
                                            <label htmlFor="52">{t("Decorative")}</label>
                                        </div>
                                        
                                        <NextStep currentStep="5" eventKey="6">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header">{t("grommet_panel_help_3")}</p>
                                                <ul className="help_column_list">
                                                    <li>{t("grommet_panel_help_4")}</li>
                                                </ul>
                                            </div>
                                            <div className="help_column help_right_column">
                                                <p className="help_column_header">{t("grommet_panel_help_1")}</p>
                                                <ul className="help_column_list">
                                                    <li>{t("grommet_panel_help_2.5")}</li>
                                                    <li>{t("grommet_panel_help_2.5")}</li>
                                                    <li>{t("grommet_panel_help_2")}</li>
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
                                <ContextAwareToggle eventKey="6" stepNum={t("6")} stepTitle={t("grommet_step6")} stepRef="6" type="1" required={requiredStep["6"]}
                                                    stepSelected={stepSelectedLabel["6"] === undefined ? "" : stepSelectedLabel["6"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="6">
                                <Card.Body>
                                    <div className={(widthCart === undefined || step5 === "" || step3A0 === "") ? "card_body card_body_info" : "noDisplay"}>
                                        <div className="card_body_info_header">
                                            <h1 className="card_body_info_header_title">{t("more_info")}</h1>
                                        </div>
                                        <hr/>
                                        <div className="card_body_info_body">
                                            <p className="card_body_info_text">{widthCart === undefined && step5 === "" && step3A0 === "" ? t("panel_type2_text1") : (widthCart === undefined && step5 !== "" && step3A0 === "" ? t("panel_type2_text2") : (widthCart === undefined && step5 !== "" && step3A0 !== "" ? t("panel_type2_text3") : t("panel_type2_text4")))}</p>
                                        </div>
                                        <NextStep currentStep="6" eventKey="7">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    {/*<div className={widthCart !== undefined && step5 !== "" ? "card_body card_body_radio" : "noDisplay"}>*/}
                                    {/*    <div className="box33 radio_style">*/}
                                    {/*        <input className="radio" type="radio" text={t("PanelType1")} value="2" name="step6" ref-num="6" id="61"*/}
                                    {/*               checked={step6 === "Same Style For All Curtains"}*/}
                                    {/*               onChange={e => {*/}
                                    {/*                   setStep6("Same Style For All Curtains");*/}
                                    {/*                   setStep6A("");*/}
                                    {/*                   setStep6B("");*/}
                                    {/*                   setStep6C("");*/}
                                    {/*                   let tempExtended = extendedTitle;*/}
                                    {/*                   tempExtended["6"][0] = t("Same Style For All Curtains");*/}
                                    {/*                   tempExtended["6"].splice(1, 3);*/}
                                    {/*                   setExtendedTitle(tempExtended);*/}
                                    {/*                   selectChanged(e);*/}
                                    {/*                   setDeps("61", "6,6A,6B,6C");*/}
                                    {/*                   setCart("PanelTypeOption", "Same Style For All Curtains", "PanelTypeA,PanelTypeB,PanelTypeC");*/}
                                    {/*               }} ref={ref => (inputs.current["61"] = ref)}/>*/}
                                    {/*        <label htmlFor="61">{t("PanelType1")}</label>*/}
                                    {/*    </div>*/}
                                    {/*    <div className="box33 radio_style">*/}
                                    {/*        <input className="radio" type="radio" text={t("PanelType2")} value="2" name="step6" ref-num="6" id="62"*/}
                                    {/*               checked={step6 === "Customize Style Per Curtain"}*/}
                                    {/*               onChange={e => {*/}
                                    {/*                   if (step2A === "" || step2B === "" || (step2B !== "None" && step2B1 === "") || (step2B !== "None" && step2C === "")) {*/}
                                    {/*                       setStep6("");*/}
                                    {/*                       setStep6A("");*/}
                                    {/*                       setStep6B("");*/}
                                    {/*                       setStep6C("");*/}
                                    {/*                       let tempExtended = extendedTitle;*/}
                                    {/*                       tempExtended["6"] = [];*/}
                                    {/*                       setExtendedTitle(tempExtended);*/}
                                    {/*                       modalHandleShow("noPrivacyLayer");*/}
                                    {/*                       setDeps("6", "6A,6B,6C");*/}
                                    {/*                       selectUncheck(e);*/}
                                    {/*                       setCart(undefined, undefined, "PanelTypeOption,PanelTypeA,PanelTypeB,PanelTypeC");*/}
                                    {/*                   } else {*/}
                                    {/*                       setStep6("Customize Style Per Curtain");*/}
                                    {/*                       setStep61("");*/}
                                    {/*                       setStep6A("");*/}
                                    {/*                       setStep6B("");*/}
                                    {/*                       setStep6C("");*/}
                                    {/*                       let tempExtended = extendedTitle;*/}
                                    {/*                       tempExtended["6"][0] = [t("Customize Style Per Curtain")];*/}
                                    {/*                       tempExtended["6"].splice(1, 3);*/}
                                    {/*                       setExtendedTitle(tempExtended);*/}
                                    {/*                       selectChanged(e);*/}
                                    {/*                       setDeps("6A,6B" + (step2B !== "None" ? ",6C" : ""), "6,61");*/}
                                    {/*                       setCart("PanelTypeOption", "Customize Style Per Curtain", "PanelTypeA,PanelTypeB,PanelTypeC");*/}
                                    {/*                   }*/}
                                    {/*               }} ref={ref => (inputs.current["62"] = ref)}/>*/}
                                    {/*        <label htmlFor="62">{t("PanelType2")}</label>*/}
                                    {/*    </div>*/}
                                    {/*    {step6 === "" && <NextStep currentStep="6" eventKey="7">{t("NEXT STEP")}</NextStep>}*/}
                                    {/*</div>*/}
                                    <div className={widthCart !== undefined && step5 !== "" ? "card_body card_body_radio card_body_panel_type special_farsi_card_body" : "noDisplay"}>
                                        <div className="box100">
                                            <p className="step_selection_title">{t("All Curtains Panel Type")}</p>
                                        </div>
                                        <div className={parseInt(widthCart) <= 160 || step5 === "Decorative" ? "box33 radio_style" : "noDisplay"}>
                                            <img
                                                src={pageLanguage === "fa" ? require('../Images/drapery/grommet/panel_type_left.svg').default : require('../Images/drapery/grommet/panel_type_left.svg').default}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" text={t("Single Panel, Left")} value="1" name="step61" ref-num="6" id="611"
                                                   checked={step61 === "Single Panel, Left"}
                                                   onChange={e => {
                                                       setStep61("Single Panel, Left");
                                                       let tempExtended = extendedTitle;
                                                       tempExtended["6"][1] = <li key="1" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("All Curtains")}</span><span className="step_title_extended_list_item_text">{t("Single Panel, Left")}</span></li>;
                                                       setExtendedTitle(tempExtended);
                                                       setDeps("", "61");
                                                       setCart(undefined, undefined, "", "PanelTypeA", ["Single Panel, Left", "Single Panel, Left", "Single Panel, Left"]);
                                                       selectChanged(e);
                                                   }} ref={ref => (inputs.current["611"] = ref)}/>
                                            <label htmlFor="611">{t("Single Panel, Left")}</label>
                                        </div>
                                        <div className={parseInt(widthCart) <= 160 || step5 === "Decorative" ? "box33 radio_style" : "noDisplay"}>
                                            <img
                                                src={pageLanguage === "fa" ? require('../Images/drapery/grommet/panel_type_right.svg').default : require('../Images/drapery/grommet/panel_type_right.svg').default}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" text={t("Single Panel, Right")} value="2" name="step61" ref-num="6" id="612"
                                                   checked={step61 === "Single Panel, Right"}
                                                   onChange={e => {
                                                       setStep61("Single Panel, Right");
                                                       let tempExtended = extendedTitle;
                                                       tempExtended["6"][1] = <li key="1" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("All Curtains")}</span><span className="step_title_extended_list_item_text">{t("Single Panel, Right")}</span></li>;
                                                       setExtendedTitle(tempExtended);
                                                       setDeps("", "61");
                                                       setCart(undefined, undefined, "", "PanelTypeA", ["Single Panel, Right", "Single Panel, Right", "Single Panel, Right"]);
                                                       selectChanged(e);
                                                   }} ref={ref => (inputs.current["612"] = ref)}/>
                                            <label htmlFor="612">{t("Single Panel, Right")}</label>
                                        </div>
                                        <div className={step5 === "Full" ? (parseInt(widthCart) > 160 && parseInt(widthCart) <= 320 ? "box33 radio_style wide_panel_type" : "noDisplay") : "noDisplay"}>
                                            <img
                                                src={pageLanguage === "fa" ? require('../Images/drapery/grommet/panel_type_free_hanging.svg').default : require('../Images/drapery/grommet/panel_type_free_hanging.svg').default}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" text={t("Single, Free Hanging")} value="3" name="step61" ref-num="6" id="613"
                                                   checked={step61 === "Single, Free Hanging"}
                                                   onChange={e => {
                                                       setStep61("Single, Free Hanging");
                                                       let tempExtended = extendedTitle;
                                                       tempExtended["6"][1] = <li key="1" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("All Curtains")}</span><span className="step_title_extended_list_item_text">{t("Single, Free Hanging")}</span></li>;
                                                       setExtendedTitle(tempExtended);
                                                       setDeps("", "61");
                                                       setCart(undefined, undefined, "", "PanelTypeA", ["Single, Free Hanging", "Single, Free Hanging", "Single, Free Hanging"]);
                                                       selectChanged(e);
                                                   }} ref={ref => (inputs.current["613"] = ref)}/>
                                            <label htmlFor="613">{t("Single, Free Hanging")}</label>
                                            <div className="radio_recommended_text">{t("RECOMMENDED FOR YOUR MEASUREMENTS")}</div>
                                        </div>
                                        <div className={step5 === "Full" ? (parseInt(widthCart) > 160 && parseInt(widthCart) <= 320 ? "box33 radio_style wide_panel_type" : "noDisplay") : "noDisplay"}>
                                            <img
                                                src={pageLanguage === "fa" ? require('../Images/drapery/grommet/panel_type_free_hanging2.svg').default : require('../Images/drapery/grommet/panel_type_free_hanging2.svg').default}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" text={t("Pair, Free Hanging")} value="4" name="step61" ref-num="6" id="614"
                                                   checked={step61 === "Pair, Free Hanging"}
                                                   onChange={e => {
                                                       setStep61("Pair, Free Hanging");
                                                       let tempExtended = extendedTitle;
                                                       tempExtended["6"][1] = <li key="1" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("All Curtains")}</span><span className="step_title_extended_list_item_text">{t("Pair, Free Hanging")}</span></li>;
                                                       setExtendedTitle(tempExtended);
                                                       setDeps("", "61");
                                                       setCart(undefined, undefined, "", "PanelTypeA", ["Pair, Free Hanging", "Pair, Free Hanging", "Pair, Free Hanging"]);
                                                       selectChanged(e);
                                                   }} ref={ref => (inputs.current["614"] = ref)}/>
                                            <label htmlFor="614">{t("Pair, Free Hanging")}</label>
                                            <div className="radio_recommended_text">{t("RECOMMENDED FOR YOUR MEASUREMENTS")}</div>
                                        </div>
                                        <div className={step5 === "Full" ? (parseInt(widthCart) > 160 ? (parseInt(widthCart) > 320 ? "noDisplay" : "box33 radio_style radio_recommended wide_panel_type") : "box33 radio_style") : "box33 radio_style"}>
                                            <img
                                                src={step5 === "Full" ? (parseInt(widthCart) > 160 ? (pageLanguage === "fa" ? require('../Images/drapery/grommet/panel_type_both2.svg').default : require('../Images/drapery/grommet/panel_type_both2.svg').default) : (pageLanguage === "fa" ? require('../Images/drapery/grommet/panel_type_both.svg').default : require('../Images/drapery/grommet/panel_type_both.svg').default)) : (pageLanguage === "fa" ? require('../Images/drapery/grommet/panel_type_both.svg').default : require('../Images/drapery/grommet/panel_type_both.svg').default)}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" text={t("Pair, Split Draw")} value="5" name="step61" ref-num="6" id="615"
                                                   checked={step61 === "Pair, Split Draw"}
                                                   onChange={e => {
                                                       setStep61("Pair, Split Draw");
                                                       let tempExtended = extendedTitle;
                                                       tempExtended["6"][1] = <li key="1" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("All Curtains")}</span><span className="step_title_extended_list_item_text">{t("Pair, Split Draw")}</span></li>;
                                                       setExtendedTitle(tempExtended);
                                                       setDeps("", "61");
                                                       setCart(undefined, undefined, "", "PanelTypeA", ["Pair, Split Draw", "Pair, Split Draw", "Pair, Split Draw"]);
                                                       selectChanged(e);
                                                       if (step5 === "Full" && parseInt(widthCart) > 320) {
                                                           modalHandleShow("panelTypeWarning");
                                                       }
                                                   }} ref={ref => (inputs.current["615"] = ref)}/>
                                            <label htmlFor="615">{t("Pair, Split Draw")}</label>
                                            <div className="radio_recommended_text">{t("RECOMMENDED FOR YOUR MEASUREMENTS")}</div>
                                        </div>
                                        <div className={step5 === "Full" ? (parseInt(widthCart) > 320 ? "box50 radio_style" : "noDisplay") : "noDisplay"}>
                                            <img
                                                src={pageLanguage === "fa" ? require('../Images/drapery/grommet/panel_type_three.svg').default : require('../Images/drapery/grommet/panel_type_three.svg').default}
                                                className="img-fluid height_auto" alt=""/>
                                            <input className="radio" type="radio" text={t("Three Panel, Split Draw")} value="6" name="step61" ref-num="6" id="616"
                                                   checked={step61 === "Three Panel, Split Draw"}
                                                   onChange={e => {
                                                       setStep61("Three Panel, Split Draw");
                                                       let tempExtended = extendedTitle;
                                                       tempExtended["6"][1] = <li key="1" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("All Curtains")}</span><span className="step_title_extended_list_item_text">{t("Three Panel, Split Draw")}</span></li>;
                                                       setExtendedTitle(tempExtended);
                                                       setDeps("", "61");
                                                       setCart(undefined, undefined, "", "PanelTypeA", ["Three Panel, Split Draw", "Three Panel, Split Draw", "Three Panel, Split Draw"]);
                                                       selectChanged(e);
                                                   }} ref={ref => (inputs.current["616"] = ref)}/>
                                            <label htmlFor="616">{t("Three Panel, Split Draw")}</label>
                                            <div className="radio_recommended_text">{t("RECOMMENDED FOR YOUR MEASUREMENTS")}</div>
                                        </div>
                                        {/*<div className={step5 === "Full" ? (parseInt(widthCart) > 320 ? "box50 radio_style radio_recommended" : "noDisplay") : "noDisplay"}>*/}
                                        {/*    <img*/}
                                        {/*        src={pageLanguage === "fa" ? require('../Images/drapery/grommet/panel_type_four.svg').default : require('../Images/drapery/grommet/panel_type_four.svg').default}*/}
                                        {/*        className="img-fluid height_auto" alt=""/>*/}
                                        {/*    <input className="radio" type="radio" text={t("Four Panel, Split Draw")} value="7" name="step61" ref-num="6" id="617"*/}
                                        {/*           checked={step61 === "Four Panel, Split Draw"}*/}
                                        {/*           onChange={e => {*/}
                                        {/*               setStep61("Four Panel, Split Draw");*/}
                                        {/*               let tempExtended = extendedTitle;*/}
                                        {/*               tempExtended["6"][1] = <li key="1" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("All Curtains")}</span><span className="step_title_extended_list_item_text">{t("Four Panel, Split Draw")}</span></li>;*/}
                                        {/*               setExtendedTitle(tempExtended);*/}
                                        {/*               setDeps("", "61");*/}
                                        {/*               setCart("PanelType", "Four Panel, Split Draw");*/}
                                        {/*               selectChanged(e);*/}
                                        {/*           }} ref={ref => (inputs.current["617"] = ref)}/>*/}
                                        {/*    <label htmlFor="617">{t("Four Panel, Split Draw")}</label>*/}
                                        {/*    <div className="radio_recommended_text">{t("RECOMMENDED FOR YOUR MEASUREMENTS")}</div>*/}
                                        {/*</div>*/}
                                        <NextStep currentStep="6" eventKey="7">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    
                                    {widthCart !== undefined && step5 !== "" && <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header">{t("grommet_panel_type_help_1")}</p>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle">
                                                            <span className="popover_indicator">
                                                                {<PopoverStickOnHover placement={`${pageLanguage === 'fa' ? "right" : "left"}`}
                                                                                      children={<object className="popover_camera" type="image/svg+xml"
                                                                                                        data={require('../Images/public/camera.svg').default}/>}
                                                                                      component={<div className="clearfix">
                                                                                          <div className="popover_image clearfix">
                                                                                              <img
                                                                                                  src={popoverImages["step61"] === undefined ? require('../Images/drapery/grommet/single_panel.jpg') : popoverImages["step61"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">{t("grommet_panel_type_help_1")}</span>
                                                                                              <span className="popover_thumbnails">
                                                                                                      <div>
                                                                                                          <img src={require('../Images/drapery/grommet/single_panel.jpg')}
                                                                                                               text="step61"
                                                                                                               onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                               className="popover_thumbnail_img img-fluid"
                                                                                                               alt=""/>
                                                                                                      </div>
                                                                                                  </span>
                                                                                          </div>
                                                                                      </div>}/>}
                                                            </span>{t("grommet_panel_type_help_2")}</li>
                                                    <li>{t("grommet_panel_type_help_3")}</li>
                                                </ul>
                                            </div>
                                            <div className="help_column help_right_column">
                                                <p className="help_column_header">{t("grommet_panel_type_help_4")}</p>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle">
                                                            <span className="popover_indicator">
                                                                {<PopoverStickOnHover placement={`${pageLanguage === 'fa' ? "right" : "left"}`}
                                                                                      children={<object className="popover_camera" type="image/svg+xml"
                                                                                                        data={require('../Images/public/camera.svg').default}/>}
                                                                                      component={<div className="clearfix">
                                                                                          <div className="popover_image clearfix">
                                                                                              <img
                                                                                                  src={popoverImages["step52"] === undefined ? require('../Images/drapery/grommet/pair_panel.jpg') : popoverImages["step52"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">{t("grommet_panel_type_help_6")}</span>
                                                                                              <span className="popover_thumbnails">
                                                                                                      <div>
                                                                                                          <img src={require('../Images/drapery/grommet/pair_panel.jpg')}
                                                                                                               text="step52"
                                                                                                               onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                               className="popover_thumbnail_img img-fluid"
                                                                                                               alt=""/>
                                                                                                      </div>
                                                                                                  </span>
                                                                                          </div>
                                                                                      </div>}/>}
                                                            </span>{t("grommet_panel_type_help_6")}</li>
                                                    <li>{t("grommet_panel_type_help_7")}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>}
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 7 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="7" stepNum={t("7")} stepTitle={t("grommet_step7")} stepRef="7" type="1" required={requiredStep["7"]}
                                                    stepSelected={stepSelectedLabel["7"] === undefined ? "" : stepSelectedLabel["7"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="7">
                                <Card.Body>
                                    <div className="card_body card_body_radio bracket_color">
                                        <div className="box33">
                                            <div className="radio_group">
                                                <label className="radio_container">
                                                    <input className="radio" type="radio" text={t("BracketColor1")} value="1" name="step7" ref-num="7" id="71" outline="true"
                                                           checked={step7 === "Satin Brass"}
                                                           onChange={e => {
                                                               selectChanged(e);
                                                               setStep7("Satin Brass");
                                                               setDeps("", "7");
                                                               setCart("GrommetFinish", "Satin Brass");
                                                           }} ref={ref => (inputs.current["71"] = ref)}/>
                                                    <div className="frame_img">
                                                        <img src={require('../Images/drapery/roller/SatinBrass.jpg')} className="img-fluid bracket_color_img" alt=""/>
                                                    </div>
                                                </label>
                                                <div className="radio_group_name_container">
                                                    <h1>{t("BracketColor1")}</h1>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="box33">
                                            <div className="radio_group">
                                                <label className="radio_container">
                                                    <input className="radio" type="radio" text={t("BracketColor2")} value="2" name="step7" ref-num="7" id="72" outline="true"
                                                           checked={step7 === "Satin Nickel"}
                                                           onChange={e => {
                                                               selectChanged(e);
                                                               setStep7("Satin Nickel");
                                                               setDeps("", "7");
                                                               setCart("GrommetFinish", "Satin Nickel");
                                                           }} ref={ref => (inputs.current["72"] = ref)}/>
                                                    <div className="frame_img">
                                                        <img src={require('../Images/drapery/roller/SatinNickel.jpg')} className="img-fluid bracket_color_img" alt=""/>
                                                    </div>
                                                </label>
                                                <div className="radio_group_name_container">
                                                    <h1>{t("BracketColor2")}</h1>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="box33">
                                            <div className="radio_group">
                                                <label className="radio_container">
                                                    <input className="radio" type="radio" text={t("BracketColor3")} value="3" name="step7" ref-num="7" id="73" outline="true"
                                                           checked={step7 === "Gun Metal"}
                                                           onChange={e => {
                                                               selectChanged(e);
                                                               setStep7("Gun Metal");
                                                               setDeps("", "7");
                                                               setCart("GrommetFinish", "Gun Metal");
                                                           }} ref={ref => (inputs.current["72"] = ref)}/>
                                                    <div className="frame_img">
                                                        <img src={require('../Images/drapery/roller/GunMetal.jpg')} className="img-fluid bracket_color_img" alt=""/>
                                                    </div>
                                                </label>
                                                <div className="radio_group_name_container">
                                                    <h1>{t("BracketColor3")}</h1>
                                                </div>
                                            </div>
                                        </div>
                                        <NextStep currentStep="7" eventKey="8">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"/>
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
                                                                                                  src={popoverImages["step7"] === undefined ? require('../Images/drapery/grommet/gold_ring.jpg') : popoverImages["step7"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span
                                                                                                  className="popover_footer_title">{t("GrommetFinish_help_camera")}</span>
                                                                                              <span className="popover_thumbnails">
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/grommet/gold_ring.jpg')}
                                                                                                           text="step7"
                                                                                                           onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                           className="popover_thumbnail_img img-fluid"
                                                                                                           alt=""/>
                                                                                                  </div>
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/grommet/white_ring.jpg')}
                                                                                                           text="step7"
                                                                                                           onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                           className="popover_thumbnail_img img-fluid"
                                                                                                           alt=""/>
                                                                                                  </div>
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/grommet/black_ring.jpg')}
                                                                                                           text="step7"
                                                                                                           onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                           className="popover_thumbnail_img img-fluid"
                                                                                                           alt=""/>
                                                                                                  </div>
                                                                                              </span>
                                                                                          </div>
                                                                                      </div>
                                                                                  }/>
                                                            }
                                                        </span>{t("GrommetFinish_help1")}
                                                    </li>
                                                    <li><b>{t("Note:&nbsp;")}</b>{t("GrommetFinish_help2")}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 8 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="8" stepNum={t("8")} stepTitle={t("grommet_step8")} stepRef="8" type="1" required={requiredStep["8"]}
                                                    stepSelected={stepSelectedLabel["8"] === undefined ? "" : stepSelectedLabel["8"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="8">
                                <Card.Body>
                                    <div className="card_body card_body_radio card_body_hardware card_body_hardware3">
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("hardware1")} value="1" name="step8" ref-num="8" id="81" outline="true"
                                                   checked={step8 === "I Have My Own Hardware"}
                                                   onChange={e => {
                                                       setStep81("");
                                                       setStep82("");
                                                       setStep83("");
                                                       // setStep84("");
                                                       // setStep8A("");
                                                       // setStep8B("");
                                                       // setStep8C("");
                                                       setSelectedDrapery([]);
                                                       // setSelectedSheer([]);
                                                       // setSelectedPrivacyLayer([]);
                                                       let tempExtended = extendedTitle;
                                                       tempExtended["8"] = [t("I Have My Own Hardware")];
                                                       tempExtended["8A"] = [];
                                                       tempExtended["8B"] = [];
                                                       tempExtended["8C"] = [];
                                                       setExtendedTitle(tempExtended);
                                                       selectChanged(e, "8A,8B,8C");
                                                       setStep8("I Have My Own Hardware");
                                                       setHardwareNextStep("9");
                                                       setDeps("85", "8,81,82,83,84,8A,8A1,8A2,8A3,8A4,8B,8B1,8B2,8B3,8B5,8B51,8B6,8C,8C1,8C2,8C3,8C5,8C51,8C6");
                                                       setCart("Hardware", "I Have My Own Hardware", "DraperyHardware,SheerHardware,PrivacyLayerHardware,RailId,BatonOption,RailDesign,RailDesignEn,RailDesignFa,RailColorEn,RailColorFa,RodColor,hardwareDrapery,hardwareSheer,hardwarePrivacyLayer,BatonOptionA,RailDesignA,RailDesignEnA,RailDesignFaA,RailColorEnA,RailColorFaA,RodColorA,MountA,RailIdB,BatonOptionB,RailDesignB,RailDesignEnB,RailDesignFaB,RailColorEnB,RailColorFaB,RodColorB,hasPowerB,MotorPositionB,RemoteNameB,MotorChannelsB,RailIdC,BatonOptionC,RailDesignC,RailDesignEnC,RailDesignFaC,RailColorEnC,RailColorFaC,RodColorC,hasPowerC,MotorPositionC,RemoteNameC,MotorChannelsC");
                                                   }} ref={ref => (inputs.current["81"] = ref)}/>
                                            <label htmlFor="81">{t("I Don't Need Any Hardware")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <input className="radio" type="radio" text={t("Same Hardware For All Curtains")} value="2" name="step8" ref-num="8" id="82" outline="true"
                                                   checked={step8 === "Same Hardware For All Curtains"}
                                                   onChange={e => {
                                                       // setStep8A("");
                                                       // setStep8B("");
                                                       // setStep8C("");
                                                       let tempExtended = extendedTitle;
                                                       if (step3 === "" || (step3 === "true" && step31 === "")) {
                                                           setHardwareNextStep("9");
                                                           setStep8("");
                                                           tempExtended["8"] = [];
                                                           tempExtended["8A"] = [];
                                                           tempExtended["8B"] = [];
                                                           tempExtended["8C"] = [];
                                                           selectUncheck(e);
                                                           modalHandleShow("noMeasurements");
                                                           setDeps("8", "81,82,83,85,86,87,8A,8A1,8A2,8A3,8A4,8B,8B1,8B2,8B3,8B5,8B51,8B6,8C,8C1,8C2,8C3,8C5,8C51,8C6");
                                                           setCart("", "", "Hardware,hardwareDrapery,hardwareSheer,hardwarePrivacyLayer,BatonOptionA,RailDesignA,RailDesignEnA,RailDesignFaA,RailColorEnA,RailColorFaA,RodColorA,MountA,RailIdB,BatonOptionB,RailDesignB,RailDesignEnB,RailDesignFaB,RailColorEnB,RailColorFaB,RodColorB,hasPowerB,MotorPositionB,RemoteNameB,MotorChannelsB,RailIdC,BatonOptionC,RailDesignC,RailDesignEnC,RailDesignFaC,RailColorEnC,RailColorFaC,RodColorC,hasPowerC,MotorPositionC,RemoteNameC,MotorChannelsC");
                                                       } else {
                                                           selectChanged(e, "8A,8B,8C");
                                                           setTimeout(() => {
                                                               setStep8("Same Hardware For All Curtains");
                                                           }, 300);
                                                           tempExtended["8"] = [t("hardware2_drapery")];
                                                           setHardwareNextStep("9");
                                                           setDeps("81,82,83", "8,85,86,87,8A,8A1,8A2,8A3,8A4,8B,8B1,8B2,8B3,8B5,8B51,8B6,8C,8C1,8C2,8C3,8C5,8C51,8C6");
                                                    
                                                           setCart("Hardware", "Same Hardware For All Curtains", "hardwareDrapery,hardwareSheer,hardwarePrivacyLayer,BatonOptionA,RailDesignA,RailDesignEnA,RailDesignFaA,RailColorEnA,RailColorFaA,RodColorA,MountA,RailIdB,BatonOptionB,RailDesignB,RailDesignEnB,RailDesignFaB,RailColorEnB,RailColorFaB,RodColorB,hasPowerB,MotorPositionB,RemoteNameB,MotorChannelsB,RailIdC,BatonOptionC,RailDesignC,RailDesignEnC,RailDesignFaC,RailColorEnC,RailColorFaC,RodColorC,hasPowerC,MotorPositionC,RemoteNameC,MotorChannelsC", "DraperyHardware,SheerHardware,PrivacyLayerHardware", ["Rod", "Rod", "Rod"]);
                                                       }
                                                       setExtendedTitle(tempExtended);
                                                   }} ref={ref => (inputs.current["82"] = ref)}/>
                                            <label htmlFor="82">{t("hardware2_drapery")}</label>
                                        </div>
                                        
                                        {/* step 10 Questions */}
                                        <div className={step8 === "Same Hardware For All Curtains" ? "card_body card_body_radio card_body_Rod" : "noDisplay"}>
                                            {rodsList}
                                        </div>
                                        <div className={step8 === "Same Hardware For All Curtains" && step81 !== "" ? "card_body card_body_radio card_body_Rod_color" : "noDisplay"}>
                                            <div className="box100">
                                                <p className="step_selection_title">{t("step8_rod_finish_title")}</p>
                                            </div>
                                            {rodsColorList}
                                        </div>
                                        <div
                                            className={step8 === "Same Hardware For All Curtains" && step81 !== "" ? "card_body card_body_radio card_body_baton" : "noDisplay"}>
                                            <div className="box100">
                                                <p className="step_selection_title">{t("Baton Option")}</p>
                                            </div>
                                            <div className="box33 radio_style">
                                                <input className="radio" type="radio" text={t("None")} value="1" name="step83" ref-num="83" id="831"
                                                       checked={step83 === "None"}
                                                       onChange={e => {
                                                           setStep83("None");
                                                           setDeps("", "83");
                                                           setCart(undefined, undefined, "", "BatonOptionA", ["None", "None", "None"]);
                                                           selectChanged(e);
                                                           let tempExtended = extendedTitle;
                                                           tempExtended["8"][3] = <li key="3" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Baton")}</span><span className="step_title_extended_list_item_text">{t("None")}</span></li>;
                                                           setExtendedTitle(tempExtended);
                                                       }} ref={ref => (inputs.current["831"] = ref)}/>
                                                <label htmlFor="831">{t("None")}</label>
                                            </div>
                                            <div className="box33 radio_style">
                                                <input className="radio" type="radio" text={t("Baton 30cm")} value="2" name="step83" ref-num="83" id="832"
                                                       checked={step83 === "Baton 30cm"}
                                                       onChange={e => {
                                                           setStep83("Baton 30cm");
                                                           setDeps("", "83");
                                                           setCart(undefined, undefined, "", "BatonOptionA", ["Baton 30cm", "Baton 30cm", "Baton 30cm"]);
                                                           selectChanged(e);
                                                           let tempExtended = extendedTitle;
                                                           tempExtended["8"][3] = <li key="3" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Baton")}</span><span className="step_title_extended_list_item_text">{t("Baton 30cm")}</span></li>;
                                                           setExtendedTitle(tempExtended);
                                                       }} ref={ref => (inputs.current["832"] = ref)}/>
                                                <label htmlFor="832">{t("Baton 30cm")}<br/><p
                                                    className="surcharge_price">{Object.keys(modelAccessories).length !== 0 ? t("Add ") : t("Surcharge Applies")}{(modelAccessories["27"] ? (modelAccessories["27"]["58"] ? GetPrice(modelAccessories["27"]["58"]["Price"], pageLanguage, t("TOMANS")) : null) : null)}</p>
                                                </label>
                                            </div>
                                            <div className="box33 radio_style">
                                                <input className="radio" type="radio" text={t("Baton 45cm")} value="3" name="step83" ref-num="83" id="833"
                                                       checked={step83 === "Baton 45cm"}
                                                       onChange={e => {
                                                           setStep83("Baton 45cm");
                                                           setDeps("", "83");
                                                           setCart(undefined, undefined, "", "BatonOptionA", ["Baton 45cm", "Baton 45cm", "Baton 45cm"]);
                                                           selectChanged(e);
                                                           let tempExtended = extendedTitle;
                                                           tempExtended["8"][3] = <li key="3" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Baton")}</span><span className="step_title_extended_list_item_text">{t("Baton 45cm")}</span></li>;
                                                           setExtendedTitle(tempExtended);
                                                       }} ref={ref => (inputs.current["833"] = ref)}/>
                                                <label htmlFor="833">{t("Baton 45cm")}<br/><p
                                                    className="surcharge_price">{Object.keys(modelAccessories).length !== 0 ? t("Add ") : t("Surcharge Applies")}{(modelAccessories["27"] ? (modelAccessories["27"]["59"] ? GetPrice(modelAccessories["27"]["59"]["Price"], pageLanguage, t("TOMANS")) : null) : null)}</p>
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div className={step8 === "I Have My Own Hardware" ? "card_body card_body_radio card_body_have_hardware" : "noDisplay"}>
                                            <div className="box100">
                                                <p className="step_selection_title">{t("step8A_haveHardware_title")}</p>
                                            </div>
                                            <div className="box50 radio_style">
                                                <div className="same_row_selection_title">
                                                    {t("Drapery Hardware")}
                                                </div>
                                            </div>
                                            <div className="box50 radio_style">
                                                <div className="select_container">
                                                    <Select
                                                        className="select"
                                                        placeholder={t("Please Select")}
                                                        portal={document.body}
                                                        dropdownPosition="bottom"
                                                        dropdownHandle={false}
                                                        dropdownGap={0}
                                                        values={selectedDrapery}
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
                                                        onChange={(selected) => {
                                                            if (selected.length) {
                                                                setCart("hardwareDrapery", selected[0].value);
                                                                setDeps("", "85");
                                                                let tempExtended = extendedTitle;
                                                                tempExtended["8"][1] = <li key="1" className="step_title_extended_list_item"><span className="step_title_extended_list_item_title">{t("Drapery Hardware")}</span><span className="step_title_extended_list_item_text">{selected[0].value}</span></li>;
                                                                setExtendedTitle(tempExtended);
                                                                setSelectedDrapery(selected);
                                                            }
                                                        }}
                                                        options={draperiesSelect[pageLanguage]}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <NextStep currentStep="8" eventKey={hardwareNextStep}>{t("NEXT STEP")}</NextStep>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 9 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="9" stepNum={t("9")} stepTitle={t("grommet_step9")} stepRef="9" type="1" required={requiredStep["9"]}
                                                    stepSelected={stepSelectedLabel["9"] === undefined ? "" : stepSelectedLabel["9"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="9">
                                <Card.Body>
                                    <div className="card_body card_body_Accessories">
                                        <div className="Accessories_container">
                                            <ul className="Accessories_List">
                                                <li className="Accessories_List_item">
                                                    <div className="Accessories_List_item_image">
                                                        <img src={require('../Images/drapery/grommet/MatchingTieback.jpg')} className="img-fluid" alt=""/>
                                                    </div>
                                                    <div className="Accessories_List_item_desc">
                                                        <h1 className="Accessories_List_item_title">{t("Matching Drapery Tieback")}</h1>
                                                        <h2 className="Accessories_List_item_price">{GetPrice(10000, pageLanguage, t("TOMANS"))}</h2>
                                                        <div className="Accessories_List_item_colors"></div>
                                                    </div>
                                                    <div className="Accessories_List_item_qty">
                                                        <div className="qty_numbers">
                                                            <button type="text" className="qty_minus" onClick={() => setTiebackDrapery({
                                                                "isPlus": false,
                                                                "HandCurtainId": 2401,
                                                                "HandCurtainNum": undefined
                                                            })}><img src={require('../Images/public/minus.svg').default} alt="" className="qty_math_icon"/></button>
                                                            <input type="text" className="qty_num"
                                                                   value={tiebackDraperyQty}
                                                                   onChange={(e) => {
                                                                       //     setTiebackDrapery({
                                                                       //     "isPlus": undefined,
                                                                       //     "HandCurtainId": 2401,
                                                                       //     "HandCurtainNum": e.target.value
                                                                       // })
                                                                   }}
                                                                   readOnly/>
                                                            <button type="text" className="qty_plus" onClick={() => setTiebackDrapery({
                                                                "isPlus": true,
                                                                "HandCurtainId": 2401,
                                                                "HandCurtainNum": undefined
                                                            })}><img src={require('../Images/public/plus.svg').default} alt="" className="qty_math_icon"/></button>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="Accessories_List_item">
                                                    <div className="Accessories_List_item_image">
                                                        <img src={require('../Images/drapery/grommet/MatchingTieback.jpg')} className="img-fluid" alt=""/>
                                                    </div>
                                                    <div className="Accessories_List_item_desc">
                                                        <h1 className="Accessories_List_item_title">{t("Matching Sheer Tieback")}</h1>
                                                        <h2 className="Accessories_List_item_price">{GetPrice(10000, pageLanguage, t("TOMANS"))}</h2>
                                                        <div className="Accessories_List_item_colors"></div>
                                                    </div>
                                                    <div className="Accessories_List_item_qty">
                                                        <div className="qty_numbers">
                                                            <button type="text" className="qty_minus" onClick={() => setTiebackSheer({
                                                                "isPlus": false,
                                                                "HandCurtainId": 2401,
                                                                "HandCurtainNum": undefined
                                                            })}><img src={require('../Images/public/minus.svg').default} alt="" className="qty_math_icon"/></button>
                                                            <input type="text" className="qty_num"
                                                                   value={tiebackSheerQty}
                                                                   onChange={(e) => {
                                                                       //     setTiebackDrapery({
                                                                       //     "isPlus": undefined,
                                                                       //     "HandCurtainId": 2401,
                                                                       //     "HandCurtainNum": e.target.value
                                                                       // })
                                                                   }}
                                                                   readOnly/>
                                                            <button type="text" className="qty_plus" onClick={() => setTiebackSheer({
                                                                "isPlus": true,
                                                                "HandCurtainId": 2401,
                                                                "HandCurtainNum": undefined
                                                            })}><img src={require('../Images/public/plus.svg').default} alt="" className="qty_math_icon"/></button>
                                                        </div>
                                                    </div>
                                                </li>
                                                {stepAccessoriesList}
                                            </ul>
                                        </div>
                                    </div>
                                    <NextStep currentStep="9" eventKey="10">{t("NEXT STEP")}</NextStep>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        {/* step 10 */}
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="10" stepNum={t("10")} stepTitle={t("zebra_step6")} stepRef="10" type="2" required={requiredStep["10"]}
                                                    stepSelected={stepSelectedLabel["10"] === undefined ? "" : stepSelectedLabel["10"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="10">
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
                                                        <ul className="upload_results">
                                                            {uploadedImagesList}
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
                                                    <button type="button" className="btn" onClick={e => {
                                                        if (isLoggedIn) {
                                                            modalHandleShow("uploadImg");
                                                        } else {
                                                            dispatch({
                                                                type: ShowLogin2Modal,
                                                            })
                                                        }
                                                    }}>
                                                        {t("Upload Image")}
                                                    </button>
                                                </div>
                                                <div className="btn-upload">
                                                    <button type="button" className="btn" onClick={e => {
                                                        if (isLoggedIn) {
                                                            modalHandleShow("uploadPdf");
                                                        } else {
                                                            dispatch({
                                                                type: ShowLogin2Modal,
                                                            })
                                                        }
                                                    }}>
                                                        {t("Upload PDF")}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="box100 uploaded_name_section">
                                            <div className="mid_upload">
                                                <ul className="upload_names_images">
                                                    {uploadedImagesNamesList}
                                                </ul>
                                                <br/>
                                                <ul className="upload_names_pdfs">
                                                    {uploadedPDFNameList}
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
                                                            if (selected[0] !== undefined) {
                                                                setDeps("", "1001");
                                                                roomLabelChanged(selected[0], "10", false);
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
                                                                   setTimeout(() => {
                                                                       if (e.target.value === "") {
                                                                           setDeps("1002", "");
                                                                       } else {
                                                                           setDeps("", "1002");
                                                                       }
                                                                       roomLabelChanged(e.target.value, "10", true);
                                                                       setRoomLabelText(e.target.value);
                                                                       setCart("WindowName", e.target.value);
                                                                   }, 300);
                                                               }}/>
                                            </div>
                                        </div>
                                        <NextStep currentStep="10" eventKey="11">{t("NEXT STEP")}</NextStep>
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
                        
                        {/* step 11 */}
                        <Card className={accordionActiveKey === "" ? "card_little_margin" : "card_big_margin"}>
                            <Card.Header>
                                <ContextAwareToggle eventKey="11" stepNum={t("11")} stepTitle={t("zebra_step7")} stepTitle2={t("(Optional)")} stepRef="11" type="2"
                                                    required={false}
                                                    stepSelected={stepSelectedLabel["11"] === undefined ? "" : stepSelectedLabel["11"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="11">
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
            
            <Modal dialogClassName={`warning_modal2 bigSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["panelTypeWarning"] === undefined ? false : modals["panelTypeWarning"]}
                   onHide={() => modalHandleClose("panelTypeWarning")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("panelTypeWarning")}</p>
                    
                    <br/>
                    <div className="buttons_section">
                        <button className="btn btn-new-dark" onClick={() => {
                            modalHandleClose("widthDifferent");
                            setStep61("");
                            setDeps("61", "");
                            setCart("", "", "PanelTypeA");
                            selectChanged(undefined, "6");
                        }}>{t("CHANGE MEASUREMENTS")}
                        </button>
                        <button className="btn white_btn" onClick={() => {
                            modalHandleClose("panelTypeWarning");
                        }}>{t("I AGREE, CONTINUE ANYWAY")}
                        </button>
                    </div>
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            {/*<Modal dialogClassName={`warning_modal2 bigSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}*/}
            {/*       show={modals["SheerHeaderStyleWarning"] === undefined ? false : modals["SheerHeaderStyleWarning"]}*/}
            {/*       onHide={() => modalHandleClose("SheerHeaderStyleWarning")}>*/}
            {/*    <Modal.Header closeButton>*/}
            {/*        /!*<Modal.Title>Modal heading</Modal.Title>*!/*/}
            {/*    </Modal.Header>*/}
            {/*    <Modal.Body>*/}
            {/*        <p>{t("SheerHeaderStyleWarning")}</p>*/}
            
            {/*        <br/>*/}
            {/*        <div className="buttons_section">*/}
            {/*            <button className="btn btn-new-dark" onClick={() => {*/}
            {/*                modalHandleClose("SheerHeaderStyleWarning");*/}
            {/*            }}>{t("DON'T CHANGE HEADER STYLE")}*/}
            {/*            </button>*/}
            {/*            <button className="btn white_btn" onClick={() => {*/}
            {/*                setStep2A(sheerHeaderStyleTemp.stepValue);*/}
            {/*                setDeps("", "2A,8,81,82,83,84,8A,8A1,8A2,8A3,8A4,8B,8B1,8B2,8B3,8B5,8B51,8B6,8B5,8B51,8C,8C1,8C2,8C3,8C5,8C51,8C6,8C5,8C51");*/}
            {/*                setCart("SheerHeaderStyle", sheerHeaderStyleTemp.cartValue, "RailId,BatonOption,RailDesign,RailDesignEn,RailDesignFa,RailColorEn,RailColorFa,RodColor,Mount8,BatonOptionA,RailDesignA,RailDesignEnA,RailDesignFaA,RailColorEnA,RailColorFaA,RodColorA,MountA,RailIdB,BatonOptionB,RailDesignB,RailDesignEnB,RailDesignFaB,RailColorEnB,RailColorFaB,RodColorB,MountB,RailIdC,BatonOptionC,RailDesignC,RailDesignEnC,RailDesignFaC,RailColorEnC,RailColorFaC,RodColorC,MountC,hasPower,MotorPosition,RemoteName,MotorChannels");*/}
            {/*                selectChanged(sheerHeaderStyleTemp.event, "8");*/}
            {/*                setSheersModelId(sheerHeaderStyleTemp.id);*/}
            {/*                setStep8("");*/}
            {/*                modalHandleClose("SheerHeaderStyleWarning");*/}
            {/*            }}>{t("I AGREE, CONTINUE ANYWAY")}*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    </Modal.Body>*/}
            {/*    /!*<Modal.Footer>*!/*/}
            {/*    /!*    *!/*/}
            {/*    /!*</Modal.Footer>*!/*/}
            {/*</Modal>*/}
            
            {/*<Modal dialogClassName={`warning_modal2 bigSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}*/}
            {/*       show={modals["SheerHeaderStyleWarning2"] === undefined ? false : modals["SheerHeaderStyleWarning2"]}*/}
            {/*       onHide={() => modalHandleClose("SheerHeaderStyleWarning2")}>*/}
            {/*    <Modal.Header closeButton>*/}
            {/*        /!*<Modal.Title>Modal heading</Modal.Title>*!/*/}
            {/*    </Modal.Header>*/}
            {/*    <Modal.Body>*/}
            {/*        <p>{t("SheerHeaderStyleWarning")}</p>*/}
            
            {/*        <br/>*/}
            {/*        <div className="buttons_section">*/}
            {/*            <button className="btn btn-new-dark" onClick={() => {*/}
            {/*                modalHandleClose("SheerHeaderStyleWarning2");*/}
            {/*            }}>{t("DON'T CHANGE HEADER STYLE")}*/}
            {/*            </button>*/}
            {/*            <button className="btn white_btn" onClick={() => {*/}
            {/*                setStep2C(sheerHeaderStyleTemp2.stepValue);*/}
            {/*                setDeps("", "2C,8,81,82,83,84,8A,8A1,8A2,8A3,8A4,8B,8B1,8B2,8B3,8B5,8B51,8B6,8B5,8B51,8C,8C1,8C2,8C3,8C5,8C51,8C6,8C5,8C51");*/}
            {/*                setCart("PrivacyLayerHeaderStyle", sheerHeaderStyleTemp2.cartValue, "RailId,BatonOption,RailDesign,RailDesignEn,RailDesignFa,RailColorEn,RailColorFa,RodColor,Mount8,BatonOptionA,RailDesignA,RailDesignEnA,RailDesignFaA,RailColorEnA,RailColorFaA,RodColorA,MountA,RailIdB,BatonOptionB,RailDesignB,RailDesignEnB,RailDesignFaB,RailColorEnB,RailColorFaB,RodColorB,MountB,RailIdC,BatonOptionC,RailDesignC,RailDesignEnC,RailDesignFaC,RailColorEnC,RailColorFaC,RodColorC,MountC,hasPower,MotorPosition,RemoteName,MotorChannels");*/}
            {/*                selectChanged(sheerHeaderStyleTemp2.event, "8");*/}
            {/*                setSheersModelId2(sheerHeaderStyleTemp2.id);*/}
            {/*                setStep8("");*/}
            {/*                modalHandleClose("SheerHeaderStyleWarning2");*/}
            {/*            }}>{t("I AGREE, CONTINUE ANYWAY")}*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    </Modal.Body>*/}
            {/*    /!*<Modal.Footer>*!/*/}
            {/*    /!*    *!/*/}
            {/*    /!*</Modal.Footer>*!/*/}
            {/*</Modal>*/}
            
            <Modal dialogClassName={`warning_modal2 bigSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["MountTypeWarning"] === undefined ? false : modals["MountTypeWarning"]}
                   onHide={() => modalHandleClose("MountTypeWarning")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("MountTypeWarning")}</p>
                    
                    <br/>
                    <div className="buttons_section">
                        <button className="btn btn-new-dark" onClick={() => {
                            modalHandleClose("MountTypeWarning");
                        }}>{t("DON'T CHANGE MOUNT POSITION")}
                        </button>
                        <button className="btn white_btn" onClick={() => {
                            setStep3A0(mountTypeTemp.stepValue);
                            setStep3("");
                            setDepth(undefined);
                            setMouldingHeight(undefined);
                            setMountErr1(false);
                            setMountErr2(false);
                            if (mountTypeTemp.stepValue === "Moulding") {
                                setDeps("3,3A11,3A12", "3A0,31,311,312,3A,3A1,3B,3B1,3C,3D1,3D2,3E,3EFloor,3F,3G,3ARod,3ARod1,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                            } else {
                                setDeps("3", "3A0,3A11,3A12,31,311,312,3A,3A1,3B,3B1,3C,3D1,3D2,3E,3EFloor,3F,3G,3ARod,3ARod1,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                            }
                            setCart("Mount", mountTypeTemp.cartValue, "Depth,MouldingHeight,calcMeasurements,WidthCart,HeightCart,hasRod,CurtainPosition,FinishedLengthType,Width3C,ExtensionLeft,ExtensionRight,ShadeMount,Height3E,WindowToFloor,CeilingToFloor,RodWidth,RodToBottom,RodToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3");
                            clearInputs(mountTypeTemp.event, undefined, "3,3A,3B");
                            setMeasurementsNextStep("4");
                            modalHandleClose("MountTypeWarning");
                        }}>{t("I AGREE, CONTINUE ANYWAY")}
                        </button>
                    </div>
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            <Modal dialogClassName={`warning_modal2 bigSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["CurtainPosWarning"] === undefined ? false : modals["CurtainPosWarning"]}
                   onHide={() => modalHandleClose("CurtainPosWarning")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("CurtainPosWarning")}</p>
                    
                    <br/>
                    <div className="buttons_section">
                        <button className="btn btn-new-dark" onClick={() => {
                            modalHandleClose("CurtainPosWarning");
                        }}>{t("DON'T CHANGE CURTAIN POSITION")}
                        </button>
                        <button className="btn white_btn" onClick={() => {
                            setStep3A(curtainPosTemp.stepValue);
                            clearInputs(curtainPosTemp.event);
                            setCart("CurtainPosition", curtainPosTemp.cartValue, "Width3C,ExtensionLeft,ExtensionRight,ShadeMount,Height3E,WindowToFloor,CeilingToFloor,RodWidth,RodToBottom,RodToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3");
                            if (step3B === "Sill" || step3B === "Apron") {
                                if ((step3A0 === "Ceiling" || step3A0 === "Moulding") && (curtainPosTemp.stepValue === "Standard" || curtainPosTemp.stepValue === "Left Corner Window" || curtainPosTemp.stepValue === "Right Corner Window")) {
                                    setDeps("3C,3D1,3D2,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3G", "3A,3B,3B1,3E,3F,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                } else if (curtainPosTemp.stepValue === "Wall to Wall" && step3A0 === "Wall") {
                                    setDeps("3C,3E,3F,3G", "3A,3B,3B1,3D1,3D2,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                } else if (curtainPosTemp.stepValue === "Wall to Wall" && (step3A0 === "Ceiling" || step3A0 === "Moulding")) {
                                    setDeps("3C,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3G", "3A,3B,3B1,3D1,3D2,3E,3F,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                } else {
                                    setDeps("3C,3D1,3D2,3E,3F,3G", "3A,3B,3B1,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                }
                            } else {
                                if ((step3A0 === "Ceiling" || step3A0 === "Moulding") && (curtainPosTemp.stepValue === "Standard" || curtainPosTemp.stepValue === "Left Corner Window" || curtainPosTemp.stepValue === "Right Corner Window")) {
                                    setDeps("3C,3D1,3D2,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3", "3A,3B,3B1,3E,3F,3G,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3");
                                } else if (curtainPosTemp.stepValue === "Wall to Wall" && step3A0 === "Wall") {
                                    setDeps("3C,3EFloor,3F,3G", "3A,3B,3B1,3D1,3D2,3E,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                } else if (curtainPosTemp.stepValue === "Wall to Wall" && (step3A0 === "Ceiling" || step3A0 === "Moulding")) {
                                    setDeps("3C,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3", "3A,3B,3B1,3D1,3D2,3E,3F,3G,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3");
                                } else {
                                    setDeps("3C,3D1,3D2,3EFloor,3F,3G", "3A,3B,3B1,3E,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                }
                            }
                            modalHandleClose("CurtainPosWarning");
                        }}>{t("I AGREE, CONTINUE ANYWAY")}
                        </button>
                    </div>
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
            
            <Modal dialogClassName={`warning_modal2 bigSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["FinishedLengthWarning"] === undefined ? false : modals["FinishedLengthWarning"]}
                   onHide={() => modalHandleClose("FinishedLengthWarning")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("FinishedLengthWarning")}</p>
                    
                    <br/>
                    <div className="buttons_section">
                        <button className="btn btn-new-dark" onClick={() => {
                            modalHandleClose("FinishedLengthWarning");
                        }}>{t("DON'T CHANGE CURTAIN POSITION")}
                        </button>
                        <button className="btn white_btn" onClick={() => {
                            setStep3B(finishedLengthTemp.stepValue);
                            clearInputs(finishedLengthTemp.event);
                            setCart("FinishedLengthType", finishedLengthTemp.cartValue, "WindowToFloor,RodWidth,Width3C,Height3E,RodToBottom,RodToFloor,CeilingToFloor,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3,CeilingToFloor1,CeilingToFloor2,CeilingToFloor3");
                            
                            if (finishedLengthTemp.stepValue === "Sill" || finishedLengthTemp.stepValue === "Apron") {
                                if ((step3A0 === "Ceiling" || step3A0 === "Moulding") && (step3A === "Standard" || step3A === "Left Corner Window" || step3A === "Right Corner Window")) {
                                    setDeps("3C,3D1,3D2,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3G", "3B,3B1,3E,3F,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                } else if (step3A === "Wall to Wall" && step3A0 === "Wall") {
                                    setDeps("3C,3E,3F,3G", "3B,3B1,3D1,3D2,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                } else if (step3A === "Wall to Wall" && (step3A0 === "Ceiling" || step3A0 === "Moulding")) {
                                    setDeps("3C,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3G", "3B,3B1,3D1,3D2,3E,3F,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                } else {
                                    setDeps("3C,3D1,3D2,3E,3F,3G", "3B,3B1,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                }
                            } else {
                                if ((step3A0 === "Ceiling" || step3A0 === "Moulding") && (step3A === "Standard" || step3A === "Left Corner Window" || step3A === "Right Corner Window")) {
                                    setDeps("3C,3D1,3D2,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3", "3B,3B1,3E,3F,3G,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3");
                                } else if (step3A === "Wall to Wall" && step3A0 === "Wall") {
                                    setDeps("3C,3EFloor,3F,3G", "3B,3B1,3D1,3D2,3E,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                } else if (step3A === "Wall to Wall" && (step3A0 === "Ceiling" || step3A0 === "Moulding")) {
                                    setDeps("3C,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3", "3B,3B1,3D1,3D2,3E,3F,3G,3EFloor,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3");
                                } else {
                                    setDeps("3C,3D1,3D2,3EFloor,3F,3G", "3B,3B1,3E,3BRod,3CRod,3CRodFloor,3DRod,3EStandardCeiling1,3EStandardCeiling2,3EStandardCeiling3,3EStandardCeilingFloor1,3EStandardCeilingFloor2,3EStandardCeilingFloor3");
                                }
                            }
                            modalHandleClose("FinishedLengthWarning");
                        }}>{t("I AGREE, CONTINUE ANYWAY")}
                        </button>
                    </div>
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
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
                   show={modals["learnMore1"] === undefined ? false : modals["learnMore1"]}
                   onHide={() => modalHandleClose("learnMore1")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    
                    <br/>
                    <div className="text_center">
                        <button className="btn btn-new-dark" onClick={() => modalHandleClose("learnMore1")}>{t("CONTINUE")}</button>
                    </div>
                </Modal.Body>
            </Modal>
            
            <Modal dialogClassName={`learnMore_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["learnMore2"] === undefined ? false : modals["learnMore2"]}
                   onHide={() => modalHandleClose("learnMore2")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("modal_learn_more3")}</p>
                    
                    <br/>
                    <div className="text_center">
                        <button className="btn btn-new-dark" onClick={() => modalHandleClose("learnMore2")}>{t("CONTINUE")}</button>
                    </div>
                </Modal.Body>
            </Modal>
            
            <Modal dialogClassName={`learnMore_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["learnMore3"] === undefined ? false : modals["learnMore3"]}
                   onHide={() => modalHandleClose("learnMore3")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <ul className="help_column_list">
                        <li>{t("learnMore3_help1")}</li>
                        <li>{t("learnMore3_help2")}</li>
                        <li>{t("learnMore3_help3")}</li>
                    </ul>
                    
                    <br/>
                    <div className="text_center">
                        <button className="btn btn-new-dark" onClick={() => modalHandleClose("learnMore3")}>{t("CONTINUE")}</button>
                    </div>
                </Modal.Body>
            </Modal>
            
            <Modal dialogClassName={`learnMore_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["learnMore4"] === undefined ? false : modals["learnMore4"]}
                   onHide={() => modalHandleClose("learnMore4")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <ul className="help_column_list">
                        <li>{t("learnMore4_help1")}</li>
                        <li>{t("learnMore4_help2")}</li>
                        <li>{t("learnMore4_help3")}</li>
                        <li>{t("learnMore4_help4")}</li>
                    </ul>
                    
                    <br/>
                    <div className="text_center">
                        <button className="btn btn-new-dark" onClick={() => modalHandleClose("learnMore4")}>{t("CONTINUE")}</button>
                    </div>
                </Modal.Body>
            </Modal>
            
            <Modal backdrop="static" keyboard={false} dialogClassName={`measurementsHelp_modal largeSizeModal scroll_on ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["measurementsHelp"] === undefined ? false : modals["measurementsHelp"]}
                   onHide={() => modalHandleClose("measurementsHelp")} scrollable={true}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p className="measurementsHelp_modal_title">{t("HOW TO MEASURE FOR GROMMET DRAPERY")}</p>
                    <div className="help_options_container">
                        <ul className="help_options">
                            <li className={`help_option_item ${helpMeasure === "hasRod" ? "help_option_item_on" : ""}`}
                                onClick={() => setHelpMeasure("hasRod")}>{t("bold_help_hasRod")}</li>
                            <li className="help_option_item_separator"></li>
                            <li className={`help_option_item ${helpMeasure === "noRod" ? "help_option_item_on" : ""}`}
                                onClick={() => setHelpMeasure("noRod")}>{t("bold_help_noRod")}</li>
                        </ul>
                    </div>
                    {helpMeasure === "hasRod" &&
                        <div>
                            <div className="measurementsHelp_modal_img_section">
                                {/*<p className="measurementsHelp_modal_img_title">{t("Inside Mount")}</p>*/}
                                <object className="measurementsHelp_modal_img" type="image/svg+xml"
                                        data={pageLanguage === 'fa' ? require('../Images/drapery/grommet/help_hasRod.svg').default : require('../Images/drapery/grommet/help_hasRod.svg').default}/>
                            </div>
                            <div className="accordion_help measurementsHelp_modal_help_section">
                                <div className="help_container">
                                    <div className="help_column help_left_column">
                                        <p className="help_column_header">{t("TO DETERMINE PANEL HEIGHT")}</p>
                                        <ul className="help_column_list">
                                            <li>{t("grommet_modal_help_1")}</li>
                                            <li className="help_or">{t("OR")}</li>
                                            <li>{t("grommet_modal_help_2")}</li>
                                        </ul>
                                    </div>
                                    
                                    <div className="help_column help_right_column">
                                        <p className="help_column_header">{t("TO DETERMINE PANEL WIDTH")}</p>
                                        <ul className="help_column_list">
                                            <li>{t("grommet_modal_help_3")}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {/*<br/>*/}
                    {/*<br/>*/}
                    {/*<br/>*/}
                    
                    {helpMeasure === "noRod" &&
                        <div>
                            <div className="measurementsHelp_modal_img_section">
                                {/*<p className="measurementsHelp_modal_title">{t("HOW TO MEASURE FOR ZEBRA SHADES")}</p>*/}
                                {/*<p className="measurementsHelp_modal_img_title">{t("Outside Mount")}</p>*/}
                                <object className="measurementsHelp_modal_img" type="image/svg+xml"
                                        data={pageLanguage === 'fa' ? require('../Images/drapery/grommet/help_noRod.svg').default : require('../Images/drapery/grommet/help_noRod.svg').default}/>
                            </div>
                            <div className="accordion_help measurementsHelp_modal_help_section">
                                <div className="help_container">
                                    <div className="help_column help_left_column">
                                        <p className="help_column_header">{t("TO DETERMINE PANEL HEIGHT")}</p>
                                        <ul className="help_column_list">
                                            <li>{t("grommet_modal_help_4")}</li>
                                            <li className="help_or">{t("OR")}</li>
                                            <li>{t("grommet_modal_help_5")}</li>
                                        </ul>
                                    </div>
                                    
                                    <div className="help_column help_right_column">
                                        <p className="help_column_header">{t("TO DETERMINE PANEL WIDTH")}</p>
                                        <ul className="help_column_list">
                                            <li>{t("grommet_modal_help_6")}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
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
                            clearInputs(undefined, inputDifRef, undefined, "HeightDif")
                            let temp = JSON.parse(JSON.stringify(stepSelectedOptions));
                            temp.labels[inputDifRef] = [];
                            temp.values[inputDifRef] = [];
                            setStepSelectedOptions(temp);
                            modalHandleClose("heightDifferent");
                        }}>{t("CHANGE MEASUREMENTS")}
                        </button>
                        <button className="btn white_btn" onClick={() => {
                            modalHandleClose("heightDifferent");
                            // setAccordionActiveKey("4");
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
                                                if (selected[0] !== undefined) {
                                                    setDeps("", "1001");
                                                    roomLabelChanged(selected[0], "10", false);
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
                                                       setTimeout(() => {
                                                           if (e.target.value === "") {
                                                               setDeps("1002", "");
                                                           } else {
                                                               setDeps("", "1002");
                                                           }
                                                           roomLabelChanged(e.target.value, "10", true);
                                                           setRoomLabelText(e.target.value);
                                                           setCart("WindowName", e.target.value);
                                                       }, 300);
                                                   }}/>
                                </div>
                            </div>
                            {!!(roomLabelText !== "" && selectedRoomLabel.length) &&
                                <button className="save_item_btn btn-new-dark"
                                        onClick={() => {
                                            if (roomLabelText !== "" && selectedRoomLabel.length) {
                                                setSavingLoading(true);
                                                if (projectId && projectId !== "") {
                                                    SaveUserProject(depSet, cartValues, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], `${modelID}`, price, defaultModelName, defaultModelNameFa, projectData, customAcc).then((temp) => {
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
                                                    SaveUserProject(depSet, cartValues, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], `${modelID}`, price, defaultModelName, defaultModelNameFa, undefined, customAcc).then((temp) => {
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
                    <ModalLogin text={t("fabric_login_text")}/>
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
                                    SaveUserProject(depSet, cartValues, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], `${modelID}`, price, defaultModelName, defaultModelNameFa, projectData, customAcc).then((temp) => {
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
                                    SaveUserProject(depSet, cartValues, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], `${modelID}`, price, defaultModelName, defaultModelNameFa, undefined, customAcc).then((temp) => {
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
                    
                    {/*<div className="left_footer">*/}
                    {/*    <button className="save_to_acc" onClick={() => {*/}
                    {/*        if (roomLabelText !== "" && selectedRoomLabel.length) {*/}
                    {/*            setSavingLoading(true);*/}
                    {/*            if (projectId && projectId !== "") {*/}
                    {/*                SaveUserProject(depSet, cartValues, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], `${modelID}`, price, defaultModelName, defaultModelNameFa, projectData, customAcc).then((temp) => {*/}
                    {/*                    if (temp === 401) {*/}
                    {/*                        setSaveProjectCount(saveProjectCount + 1);*/}
                    {/*                    } else if (temp) {*/}
                    {/*                        modalHandleShow("add_to_project_modal");*/}
                    {/*                        setProjectModalState(1);*/}
                    {/*                        setSavingLoading(false);*/}
                    {/*                    } else {*/}
                    {/*                        console.log("project not saved!");*/}
                    {/*                        setSavingLoading(false);*/}
                    {/*                    }*/}
                    {/*                }).catch(() => {*/}
                    {/*                    // console.log("hi2");*/}
                    {/*                    setProjectModalState(2);*/}
                    {/*                    modalHandleShow("add_to_project_modal");*/}
                    {/*                    setSavingLoading(false);*/}
                    {/*                });*/}
                    {/*            } else {*/}
                    {/*                SaveUserProject(depSet, cartValues, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], `${modelID}`, price, defaultModelName, defaultModelNameFa, undefined, customAcc).then((temp) => {*/}
                    {/*                    if (temp === 401) {*/}
                    {/*                        console.log("hi1");*/}
                    {/*                        setSaveProjectCount(saveProjectCount + 1);*/}
                    {/*                    } else if (temp) {*/}
                    {/*                        modalHandleShow("add_to_project_modal");*/}
                    {/*                        setProjectModalState(1);*/}
                    {/*                        setSavingLoading(false);*/}
                    {/*                    } else {*/}
                    {/*                        console.log("project not saved!");*/}
                    {/*                        setSavingLoading(false);*/}
                    {/*                    }*/}
                    {/*                }).catch(() => {*/}
                    {/*                    // console.log("hi1");*/}
                    {/*                    setProjectModalState(2);*/}
                    {/*                    modalHandleShow("add_to_project_modal");*/}
                    {/*                    setSavingLoading(false);*/}
                    {/*                });*/}
                    {/*            }*/}
                    {/*        } else {*/}
                    {/*            setProjectModalState(0);*/}
                    {/*            modalHandleShow("add_to_project_modal");*/}
                    {/*        }*/}
                    {/*    }} disabled={savingLoading}>{savingLoading ? t("SAVING...") : t("footer_Save To")}<br/>{savingLoading ? "" : t("footer_My Account")}</button>*/}
                    {/*</div>*/}
                    {/*<div className="hidden_inner_footer">&nbsp;</div>*/}
                    {/*<div className="footer_price_section">*/}
                    {/*    <div className="showPrice">{t("footer_Price")}</div>*/}
                    {/*    <div className="Price">{GetPrice(price, pageLanguage, t("TOMANS"))}</div>*/}
                    {/*</div>*/}
                    {/*<div className="right_footer">*/}
                    {/*    <input type="submit" onClick={() => {*/}
                    {/*        setAddingLoading(true);*/}
                    {/*        addToCart();*/}
                    {/*    }} className="btn add_to_cart" disabled={addingLoading} value={addingLoading ? t("ADDING...") : t("footer_Add" +*/}
                    {/*        " To Cart")} readOnly/>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
}

export default Grommet2;