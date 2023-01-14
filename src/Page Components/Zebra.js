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
import TruncateMarkup from "react-truncate-markup";
import {Capitalize, CapitalizeAllWords, Uppercase} from "../Components/TextTransform";


const baseURLCats = "https://api.atlaspood.ir/WebsitePage/GetDetailByName";
const baseURLPageItem = "https://api.atlaspood.ir/WebsitePageItem/GetById";
const baseURLModel = "https://api.atlaspood.ir/SewingModel/GetById";
const baseURLFabrics = "https://api.atlaspood.ir/Sewing/GetModelFabric";
const baseURLWindowSize = "https://api.atlaspood.ir/Sewing/GetWindowSize";
const baseURLPrice = "https://api.atlaspood.ir/Sewing/GetSewingOrderPrice";
const baseURLZipCode = "https://api.atlaspood.ir/Sewing/HasInstall";
const baseURLFreeShipping = "https://api.atlaspood.ir/WebsiteSetting/GetFreeShippingAmount";
const baseURGetProject = "https://api.atlaspood.ir/SewingPreorder/GetById";
const baseURLGetCart = "https://api.atlaspood.ir/cart/GetAll";
const baseURLGetRemoteNames = "https://api.atlaspood.ir/cart/GetRemoteNames";
const baseURLUploadImg = "https://api.atlaspood.ir/SewingOrderAttachment/ImageUpload";
const baseURLUploadPdf = "https://api.atlaspood.ir/SewingOrderAttachment/PdfUpload";
const baseURLDeleteFile = "https://api.atlaspood.ir/SewingOrderAttachment/Delete";
const baseURLEditProject = "https://api.atlaspood.ir/SewingPreorder/Edit";
const baseURLDeleteBasketProject = "https://api.atlaspood.ir/Cart/DeleteItem";
const baseURLAddSwatch = "https://api.atlaspood.ir/Cart/Add";
const baseURLFilterPattern = "https://api.atlaspood.ir/Sewing/GetModelPatternType";
const baseURLFilterType = "https://api.atlaspood.ir/Sewing/GetModelDesignType";
const baseURLFilterPrice = "https://api.atlaspood.ir/BaseType/GetPriceLevel";


function Zebra({CatID, ModelID, SpecialId, ProjectId, EditIndex, PageItem, QueryString, Parameters}) {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const [firstRender, setFirstRender] = useState(true);
    const [catID, setCatID] = useState(CatID);
    const [modelID, setModelID] = useState(ModelID);
    const [specialId, setSpecialId] = useState(SpecialId);
    const [projectId, setProjectId] = useState(ProjectId);
    const [editIndex, setEditIndex] = useState(EditIndex);
    const [pageItem, setPageItem] = useState(PageItem);
    const [queryString, setQueryString] = useState(QueryString);
    const [parameters, setParameters] = useState(Parameters);
    const {isLoggedIn, isRegistered, user, showLogin} = useSelector((state) => state.auth);
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const [models, setModels] = useState([]);
    const [projectData, setProjectData] = useState({});
    const [model, setModel] = useState({});
    const [modelAccessories, setModelAccessories] = useState({});
    const [fabrics, setFabrics] = useState({});
    const [fabricsList, setFabricsList] = useState([]);
    const [defaultFabricPhoto, setDefaultFabricPhoto] = useState(null);
    const [defaultModelName, setDefaultModelName] = useState("");
    const [defaultModelNameFa, setDefaultModelNameFa] = useState("");
    const [price, setPrice] = useState(0);
    const [bagPrice, setBagPrice] = useState(0);
    const [fabricQty, setFabricQty] = useState(0);
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [freeShipPrice, setFreeShipPrice] = useState(0);
    const [show, setShow] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchShow, setSearchShow] = useState(false);
    const [measurementsNextStep, setMeasurementsNextStep] = useState("4");
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
    const [cartAgreeDescription, setCartAgreeDescription] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [cartProjectIndex, setCartProjectIndex] = useState(-1);
    const [cartDraperies, setCartDraperies] = useState({
        "count": 0,
        "list": []
    });
    const [saveProjectCount, setSaveProjectCount] = useState(0);
    
    const [depSet, setDepSet] = useState(new Set(['1', '2', '3', '4', '5', '61', '62']));
    
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
    const [filterColors, setFilterColors] = useState([...queryString["colors"]]);
    const [filterPatterns, setFilterPatterns] = useState([...queryString["patterns"]]);
    const [filterTypes, setFilterTypes] = useState([...queryString["types"]]);
    const [filterPrices, setFilterPrices] = useState([...queryString["prices"]]);
    const [filterDesigns, setFilterDesigns] = useState([...queryString["designs"]]);
    
    const [step1, setStep1] = useState("");
    const [step2, setStep2] = useState("");
    const [step21, setStep21] = useState("");
    const [step3, setStep3] = useState("");
    const [step4, setStep4] = useState("");
    const [step41, setStep41] = useState("");
    const [step4A, setStep4A] = useState("");
    const [step4B, setStep4B] = useState("");
    const [step5, setStep5] = useState("");
    const [zipcodeChecked, setZipcodeChecked] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [zipcodeButton, setZipcodeButton] = useState(false);
    const [hasInstall, setHasInstall] = useState(null);
    const [installPrice, setInstallPrice] = useState(-1);
    const [transportPrice, setTransportPrice] = useState(-1);
    const [remoteName, setRemoteName] = useState("");
    const [selectedValanceColor1, setSelectedValanceColor1] = useState([]);
    const [selectedValanceColor2, setSelectedValanceColor2] = useState([]);
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
    
    const [helpMeasure, setHelpMeasure] = useState("Inside");
    const [customMotorAcc, setCustomMotorAcc] = useState({});
    
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
                let FabricId = fabrics[key][j].FabricId;
                // console.log(fabrics,key);
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
                                <img className={`img-fluid ${`${FabricId}` === step1 ? "img-fluid_checked" : ""}`} src={`https://api.atlaspood.ir/${PhotoPath}`} alt=""/>
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
                    </div>
                );
                
            }
            
            fabricList.push(
                <div className={`material_detail ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`} key={"fabric" + key}>
                    <div className={`material_traits ${pageLanguage1 === 'fa' ? "font_farsi" : "font_en"}`}>
                        <hr/>
                        <span>{pageLanguage1 === 'en' ? "DESIGN NAME" : "نام طرح"}: {pageLanguage1 === 'en' ? DesignEnName : DesignName}</span>
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
    
    function ContextAwareToggle({stepNum, stepTitle, stepTitle2, stepSelected, eventKey, callback, stepRef, type, required, cartCustomText}) {
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
                    <div className={"steps_header_title "+stepTitle2?"steps_header_title_max_content":""} type-of-step={type} cart-custom-text={cartCustomText === undefined ? stepTitle : cartCustomText}
                         ref={ref => (steps.current[stepRef] = ref)}>{stepTitle}<h5>{stepTitle2}</h5></div>
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
                    {/*<div className="steps_header_selected" ref={ref => (selectedTitle.current[stepNum] = ref)}>{showLabels ? stepSelected : null}</div>*/}
                    
                    {showLabels &&
                        <TruncateMarkup lines={1} tokenize="words">
                            <div className="steps_header_selected" ref={ref => (selectedTitle.current[stepNum] = ref)}>{stepSelected}</div>
                        </TruncateMarkup>
                    }
                </div>
                {required && stepSelected === "" &&
                    <div className="stepRequired"/>
                }
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
        let tempValue = JSON.parse(JSON.stringify(stepSelectedValue));
        let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
        if (e) {
            // console.log(e.target.value);
            let refIndex = e.target.getAttribute('ref-num');
            // selectedTitle.current[refIndex].innerHTML = e.target.getAttribute('text');
            tempLabels[refIndex] = e.target.getAttribute('text');
            
            tempValue[refIndex] = e.target.value;
        }
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
    
    function setCart(refIndex, cartValue, delRefs, secondRefIndex, secondCartValue, customAcc) {
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
        if (customAcc) {
            tempPostObj["SewingOrderDetails"][0]["Accessories"].push(customAcc);
        } else if (Object.keys(customMotorAcc).length > 0) {
            tempPostObj["SewingOrderDetails"][0]["Accessories"].push(customMotorAcc);
        }
        tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
            return el != null;
        });
        
        let promise2 = new Promise((resolve, reject) => {
            if (stepSelectedValue["3"] !== undefined) {
                if (tempPostObj["SewingOrderDetails"][0]["FabricId"] === undefined) {
                    delete tempPostObj["SewingOrderDetails"];
                }
                // if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined && stepSelectedValue["2"] !== undefined && stepSelectedValue["3"] !== undefined) {
                // console.log(JSON.stringify(tempPostObj));
                axios.post(baseURLPrice, tempPostObj)
                    .then((response) => {
                        setPrice(response.data["price"]);
                        setFabricQty(response.data["FabricQty"]);
                        // setInstallPrice(response.data["InstallAmount"] ? response.data["InstallAmount"] : 0);
                        
                        
                        // setCart("HeightCart", totalHeight, "", "WidthCart", [totalWidth]);
                        if (stepSelectedValue["2"] === "1" && stepSelectedValue["3"] === "2") {
                            if (temp["Width1"] !== undefined && temp["Width2"] !== undefined && temp["Width3"] !== undefined && temp["Height1"] !== undefined && temp["Height2"] !== undefined && temp["Height3"] !== undefined) {
                                // console.log("2");
                                getWindowSize(response.data["Width"], response.data["Height"]);
                                temp["WidthCart"] = response.data["Width"];
                                temp["HeightCart"] = response.data["Height"];
                                
                            }
                        } else if (stepSelectedValue["2"] === "2" && stepSelectedValue["3"] === "2") {
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
                    setFabricQty(0);
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
    
    function measureWindowSize(zipcode) {
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
            if (Object.keys(customMotorAcc).length > 0) {
                tempPostObj["SewingOrderDetails"][0]["Accessories"].push(customMotorAcc);
            }
            tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
                return el != null;
            });
            
            if (stepSelectedValue["3"] !== undefined) {
                if (tempPostObj["SewingOrderDetails"][0]["FabricId"] === undefined) {
                    delete tempPostObj["SewingOrderDetails"];
                }
                // if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined && stepSelectedValue["2"] !== undefined && stepSelectedValue["3"] !== undefined) {
                // console.log(JSON.stringify(tempPostObj));
                if (zipcode && zipcode !== "") {
                    tempPostObj["Zipcode"] = zipcode;
                }
                
                axios.post(baseURLPrice, tempPostObj)
                    .then((response) => {
                        if (zipcode && zipcode !== "") {
                            setInstallPrice(response.data["InstallAmount"] ? response.data["InstallAmount"] : 0);
                            setTransportPrice(response.data["TransportationAmount"] ? response.data["TransportationAmount"] : 0);
                            setHasInstall(true);
                        } else {
                            setPrice(response.data["price"]);
                            setFabricQty(response.data["FabricQty"]);
                            
                            // setCart("HeightCart", totalHeight, "", "WidthCart", [totalWidth]);
                            getWindowSize(response.data["Width"], response.data["Height"]);
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
        }).catch(err => {
            setHasInstall(false);
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
            if (Object.keys(customMotorAcc).length > 0) {
                tempPostObj["SewingOrderDetails"][0]["Accessories"].push(customMotorAcc);
            }
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
                        if (zipcodeChecked && response.data["InstallAmount"]) {
                            temp["InstallAmount"] = response.data["InstallAmount"];
                            temp["TransportationAmount"] = response.data["TransportationAmount"];
                        }
                        // setInstallPrice(response.data["InstallAmount"] ? response.data["InstallAmount"] : 0);
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
                                <h2 className="cart_agree_title">{pageLanguage === 'fa' ? convertToPersian(defaultModelNameFa) + " سفارشی " : "Custom " + defaultModelName}</h2>
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
                                                                                <h5>&nbsp;X</h5><h3>{item["Qty"]}</h3>
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
                                let sodFabrics = obj["SodFabrics"] ? obj["SodFabrics"] : [];
                                let roomName = (obj["WindowName"] === undefined || obj["WindowName"] === "") ? "" : " / " + obj["WindowName"];
                                if (obj["SewingModelId"] === "0326") {
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
                                                                                    <h5>&nbsp;X</h5><h3>{item["Qty"]}</h3>
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
                                                               value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj1["Count"]}`) : obj1["Count"]}
                                                               onChange={(e) => setBasketNumber(undefined, index, NumberToPersianWord.convertPeToEn(`${e.target.value}`), 0)}/>
                                                        <button type="text" className="basket_qty_plus" onClick={() => setBasketNumber(undefined, index, 0, 0, 1)}>+</button>
                                                    </div>
                                                    <p className="custom_cart_item_end_price">{GetPrice(obj1["price"] * obj1["Count"], pageLanguage, t("TOMANS"))}</p>
                                                </div>
                                            </div>
                                        </li>;
                                } else {
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
        let pageLanguage = location.pathname.split('').slice(1, 3).join('');
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
                            setStep21("true");
                            let refIndex = inputs.current["21"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["21"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["21"].value;
                            depSetTempArr = new Set([...setGetDeps("", "2", depSetTempArr)]);
                        } else if (temp["Mount"] === "Outside") {
                            let refIndex = inputs.current["22"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["22"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["22"].value;
                            depSetTempArr = new Set([...setGetDeps("", "2", depSetTempArr)]);
                        } else {
                            setStep21("true");
                            let refIndex = inputs.current["23"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["23"].getAttribute('text');
                            tempValue[refIndex] = inputs.current["23"].value;
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
                                        tempLabels["3AIn"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMin}`) + postfixFa : tempMin + postfixEn;
                                    }
                                    if (tempHeight && temp["Height2"] && temp["Height3"]) {
                                        let tempMax = Math.max(tempHeight, temp["Height2"], temp["Height3"]);
                                        tempLabels["3BIn"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMax}`) + postfixFa : tempMax + postfixEn;
                                    }
                                    
                                    depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "3AIn1,") + (temp["Width2"] ? "" : "3AIn2,") + (temp["Width3"] ? "" : "3AIn3,") + (tempHeight ? "" : "3BIn1,") + (temp["Height2"] ? "" : "3BIn2,") + (temp["Height3"] ? "" : "3BIn3,"), "3", depSetTempArr)]);
                                    setSelectCustomValues(selectValues);
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                } else if (temp["Mount"] === "Outside") {
                                    let tempWidth = changeLang ? temp["Width3A"] : temp["Width"];
                                    let tempHeight = changeLang ? temp["Height3C"] : temp["Height"];
                                    
                                    // console.log(temp,tempWidth,tempHeight);
                                    
                                    selectValues["width3A"] = tempWidth ? [{value: tempWidth}] : [];
                                    if (tempWidth) {
                                        tempLabels["3AOut"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                    }
                                    selectValues["height3C"] = tempHeight ? [{value: tempHeight}] : [];
                                    if (tempHeight) {
                                        tempLabels["3COut"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempHeight}`) + postfixFa : tempHeight + postfixEn;
                                    }
                                    selectValues["left"] = temp["ExtensionLeft"] ? [{value: temp["ExtensionLeft"]}] : [];
                                    selectValues["right"] = temp["ExtensionRight"] ? [{value: temp["ExtensionRight"]}] : [];
                                    if (temp["ExtensionLeft"] !== undefined && temp["ExtensionRight"] !== undefined) {
                                        tempLabels["3BOut"] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionRight"]}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionLeft"]}`) + postfixFa}` : `Left: ${temp["ExtensionLeft"] + postfixEn}\u00A0\u00A0\u00A0Right: ${temp["ExtensionRight"] + postfixEn}`;
                                    }
                                    selectValues["ShadeMount"] = temp["ShadeMount"] ? [{value: temp["ShadeMount"]}] : [];
                                    if (temp["ShadeMount"] !== undefined) {
                                        tempLabels["3DOut"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${temp["ShadeMount"]}`) + postfixFa : temp["ShadeMount"] + postfixEn;
                                    }
                                    
                                    depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "3AOut,") + (tempHeight ? "" : "3COut,") + (temp["ExtensionLeft"] !== undefined ? "" : "3BOut1,") + (temp["ExtensionRight"] !== undefined ? "" : "3BOut2,") + (temp["ShadeMount"] !== undefined ? "" : "3DOut,"), "3", depSetTempArr)]);
                                    setSelectCustomValues(selectValues);
                                    setStepSelectedLabel(tempLabels);
                                    setStepSelectedValue(tempValue);
                                } else {
                                    let tempWidth = changeLang ? temp["Width3A"] : temp["Width"];
                                    let tempHeight = changeLang ? temp["CeilingToWindow1"] : temp["Height"];
                                    let tempHeight2 = changeLang ? temp["CeilingToWindow2"] : temp["Height2"];
                                    let tempHeight3 = changeLang ? temp["CeilingToWindow3"] : temp["Height3"];
                                    
                                    selectValues["width3A"] = tempWidth ? [{value: tempWidth}] : [];
                                    if (tempWidth) {
                                        tempLabels["3AOut"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempWidth}`) + postfixFa : tempWidth + postfixEn;
                                    }
                                    selectValues["left"] = temp["ExtensionLeft"] ? [{value: temp["ExtensionLeft"]}] : [];
                                    selectValues["right"] = temp["ExtensionRight"] ? [{value: temp["ExtensionRight"]}] : [];
                                    if (temp["ExtensionLeft"] !== undefined && temp["ExtensionRight"] !== undefined) {
                                        tempLabels["3BOut"] = pageLanguage === "fa" ? `راست:  ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionRight"]}`) + postfixFa}\u00A0\u00A0\u00A0چپ: ${NumberToPersianWord.convertEnToPe(`${temp["ExtensionLeft"]}`) + postfixFa}` : `Left: ${temp["ExtensionLeft"] + postfixEn}\u00A0\u00A0\u00A0Right: ${temp["ExtensionRight"] + postfixEn}`;
                                    }
                                    selectValues["CeilingToWindow1"] = tempHeight ? [{value: tempHeight}] : [];
                                    selectValues["CeilingToWindow2"] = tempHeight2 ? [{value: tempHeight2}] : [];
                                    selectValues["CeilingToWindow3"] = tempHeight3 ? [{value: tempHeight3}] : [];
                                    if (tempHeight && tempHeight2 && tempHeight3) {
                                        let tempMax = Math.max(tempHeight, tempHeight2, tempHeight3);
                                        tempLabels["3CArc"] = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${tempMax}`) + postfixFa : tempMax + postfixEn;
                                    }
                                    
                                    depSetTempArr = new Set([...setGetDeps((tempWidth ? "" : "3AOut,") + (temp["ExtensionLeft"] !== undefined ? "" : "3BOut1,") + (temp["ExtensionRight"] !== undefined ? "" : "3BOut2,") + (tempHeight !== undefined ? "" : "3CArc1,") + (tempHeight2 !== undefined ? "" : "3CArc2,") + (tempHeight3 !== undefined ? "" : "3CArc3,"), "3", depSetTempArr)]);
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
                            
                            depSetTempArr = new Set([...setGetDeps((temp["hasPower"] ? ((temp["MotorType"] ? "" : "411,") + (temp["MotorPosition"] ? "" : "412,")) : "41,"), "4", depSetTempArr)]);
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            if (temp["hasPower"] !== undefined) {
                                setStep41(temp["hasPower"].toString());
                                let refIndex = inputs.current["411"].getAttribute('ref-num');
                                tempLabels[refIndex] = inputs.current["411"].getAttribute('text');
                                tempValue[refIndex] = inputs.current["411"].value;
                                setStepSelectedLabel(tempLabels);
                                setStepSelectedValue(tempValue);
                                
                                setSelectedMotorType(temp["MotorType"] ? [{
                                    value: temp["MotorType"],
                                    label: MotorType[pageLanguage].find(opt => opt.value === temp["MotorType"]).label
                                }] : []);
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
                    
                    if (temp["MetalValanceStyle"]) {
                        setStep5(temp["MetalValanceStyle"]);
                        
                        if (temp["MetalValanceStyle"] === "MetalValance") {
                            let refIndex = inputs.current["51"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["51"].getAttribute('text') + (temp["MetalValanceColor"] ? "/" + optionsMetalValance[pageLanguage].find(opt => opt.value === temp["MetalValanceColor"]).label : "");
                            tempValue[refIndex] = inputs.current["51"].value;
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            setSelectedValanceColor1(temp["MetalValanceColor"] ? [{
                                value: temp["MetalValanceColor"],
                                label: optionsMetalValance[pageLanguage].find(opt => opt.value === temp["MetalValanceColor"]).label
                            }] : []);
                            depSetTempArr = new Set([...setGetDeps((temp["MetalValanceColor"] ? "" : "51,"), "5", depSetTempArr)]);
                        } else {
                            let refIndex = inputs.current["52"].getAttribute('ref-num');
                            tempLabels[refIndex] = inputs.current["52"].getAttribute('text') + (temp["MetalValanceColor"] ? "/" + optionsMetalValance[pageLanguage].find(opt => opt.value === temp["MetalValanceColor"]).label : "");
                            tempValue[refIndex] = inputs.current["52"].value;
                            setStepSelectedLabel(tempLabels);
                            setStepSelectedValue(tempValue);
                            setSelectedValanceColor2(temp["MetalValanceColor"] ? [{
                                value: temp["MetalValanceColor"],
                                label: optionsMetalValance[pageLanguage].find(opt => opt.value === temp["MetalValanceColor"]).label
                            }] : []);
                            depSetTempArr = new Set([...setGetDeps((temp["MetalValanceColor"] ? "" : "52,"), "5", depSetTempArr)]);
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
    
    useEffect(() => {
        if (Object.keys(modelAccessories).length > 0 && cartValues["WidthCart"] && cartValues["HeightCart"]) {
            // let qty=cartValues["WidthCart"]*cartValues["HeightCart"]/10000;
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
                    {value: 'Standard', label: 'استاندارد '},
                    {value: 'Smart', label: 'هوشمند '}
                ],
                
            }
            let tempStandardPrice = (modelAccessories["17"] && modelAccessories["17"]["1"] && qty > modelAccessories["17"]["1"]["FromQty"] && qty <= modelAccessories["17"]["1"]["ToQty"]) ? modelAccessories["17"]["1"]["Price"] : ((modelAccessories["17"] && modelAccessories["17"]["14"] && qty > modelAccessories["17"]["14"]["FromQty"] && qty <= modelAccessories["17"]["14"]["ToQty"]) ? modelAccessories["17"]["14"]["Price"] : 0);
            let tempSmartPrice = (modelAccessories["18"] && modelAccessories["18"]["15"] && qty > modelAccessories["18"]["15"]["FromQty"] && qty <= modelAccessories["18"]["15"]["ToQty"]) ? modelAccessories["18"]["15"]["Price"] : ((modelAccessories["18"] && modelAccessories["18"]["16"] && qty > modelAccessories["18"]["16"]["FromQty"] && qty <= modelAccessories["18"]["16"]["ToQty"]) ? modelAccessories["18"]["16"]["Price"] : 0);
            setMotorType(tempObj);
            // console.log(tempObj);
            setSelectedMotorType([]);
            setSelectedMotorMinPrice(Math.min(tempStandardPrice, tempSmartPrice));
            setCart("", "", "MotorType");
            if (stepSelectedValue["41"] === "1" && stepSelectedValue["4"] === "2") {
                setDeps("411", "");
            }
        }
    }, [cartValues["WidthCart"], cartValues["HeightCart"], JSON.stringify(modelAccessories)]);
    
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
    const [selectedMotorChannels, setSelectedMotorChannels] = useState([motorChannels[pageLanguage].find(opt => opt.value === '0')]);
    const [selectedMotorPosition, setSelectedMotorPosition] = useState([]);
    const [selectedRemoteName, setSelectedRemoteName] = useState([]);
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
        getCart().then((temp) => {
            if (Object.keys(fabrics).length) {
                setTimeout(() => {
                    renderFabrics(temp);
                }, 100);
            } else {
                setFabricsList([]);
            }
        });
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
            if (specialId) {
                setCart("PhotoUrl", pageItem["MainImageUrl"], "", "SpecialId", [specialId]);
            } else {
                setCart("PhotoUrl", pageItem["MainImageUrl"]);
            }
            setDefaultModelName(pageItem["EnTitle"]);
            setDefaultModelNameFa(pageItem["Title"]);
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
                if (err.response.status === 401) {
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
                }).filter(n => n);
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
                        setTimeout(() => {
                            renderFabrics(temp);
                            getRemoteNames();
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
        
        // setTimeout(() => {
        //     if (steps.current["6"]) {
        //         steps.current["6"].scrollIntoView({
        //             behavior: "smooth",
        //             block: "center"
        //         });
        //     }
        // }, 500);
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
                <h1>{defaultModelName === undefined || defaultModelName === "" ? " " : pageLanguage === 'fa' ? convertToPersian(defaultModelNameFa) + " سفارشی " : "Custom " + defaultModelName}</h1>
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
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/zebra/new_mount_inside.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("mount_Inside")} value="1" name="step2" ref-num="2" id="21" checked={step2 === "Inside"}
                                                   onChange={e => {
                                                       setStep2("Inside");
                                                       setStep21("");
                                                       setMeasurementsNextStep("4");
                                                       if (stepSelectedValue["3"] === "2") {
                                                           setDeps("21", "2,3AOut,3BOut1,3BOut2,3COut,3DOut,3CArc1,3CArc2,3CArc3");
                                                           deleteSpecialSelects();
                                                           setCart("Mount", "Inside", "calcMeasurements,Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3");
                                                           setStep3("");
                                                           selectChanged(e, "3,3AOut,3BOut,3COut,3DOut,3CArc");
                                                       } else {
                                                           setDeps("21", "2");
                                                           setCart("Mount", "Inside");
                                                           selectChanged(e, "3AOut,3BOut,3COut,3DOut,3CArc");
                                                       }
                                                
                                                   }} ref={ref => (inputs.current["21"] = ref)}/>
                                            <label htmlFor="21">{t("mount_Inside")}</label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/zebra/new_mount_outside.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("mount_Outside")} value="2" name="step2" ref-num="2" id="22" checked={step2 === "Outside"}
                                                   onChange={e => {
                                                       setStep2("Outside");
                                                       setStep21("");
                                                       if (stepSelectedValue["3"] === "2") {
                                                           setDeps("3AOut,3BOut1,3BOut2,3COut,3DOut", "2,21,3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3,3CArc1,3CArc2,3CArc3");
                                                           deleteSpecialSelects();
                                                           setCart("Mount", "Outside", "calcMeasurements,Width1,Width2,Width3,Height1,Height2,Height3,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3");
                                                           setStep3("");
                                                           selectChanged(e, "3,3AIn,3BIn,3AOut,3BOut,3CArc");
                                                       } else {
                                                           setDeps("", "2,21");
                                                           setCart("Mount", "Outside");
                                                           selectChanged(e, "3AIn,3BIn,3AOut,3BOut,3CArc");
                                                       }
                                                   }} ref={ref => (inputs.current["22"] = ref)}/>
                                            <label htmlFor="22">{t("mount_Outside")}</label>
                                        </div>
                                        <div className="box33 radio_style">
                                            <img src={require('../Images/drapery/zebra/new_mount_arc.svg').default} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" text={t("mount_Arc")} value="3" name="step1" ref-num="2" id="23"
                                                   checked={step2 === "HiddenMoulding"}
                                                   onChange={e => {
                                                       setStep2("HiddenMoulding");
                                                       setStep21("");
                                                       setMeasurementsNextStep("4");
                                                       if (stepSelectedValue["3"] === "2") {
                                                           setDeps("21", "2,2AIn1,2AIn2,2AIn3,2BIn1,2BIn2,2BIn3,2A,2B,2E,2DWall,2EWall,2FWall,2GWall,2EWallFloor,2FWallFloor,2C1,2C2,2CCeiling1,2CCeiling2,2D1,2D2,2D3,2DFloor1,2DFloor2,2DFloor3");
                                                           deleteSpecialSelects();
                                                           setCart("Mount", "HiddenMoulding", "calcMeasurements,Width1,Width2,Width3,Height1,Height2,Height3,Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount");
                                                           setStep3("");
                                                           selectChanged(e, "3,3AIn,3BIn,3AOut,3BOut,3COut,3DOut");
                                                       } else {
                                                           setDeps("21", "2");
                                                           setCart("Mount", "HiddenMoulding");
                                                           selectChanged(e, "3AIn,3BIn,3AOut,3BOut,3COut,3DOut");
                                                       }
                                                   }} ref={ref => (inputs.current["23"] = ref)}/>
                                            <label htmlFor="23">{t("mount_Arc")}</label>
                                        </div>
                                        {stepSelectedValue["2"] === "1" &&
                                            <div className="secondary_options">
                                                <div className="card-body-display-flex">
                                                    <div className="checkbox_style checkbox_style_step2">
                                                        <input type="checkbox" value="1" name="step21" ref-num="21" checked={step21 === "true"} onChange={(e) => {
                                                            if (e.target.checked) {
                                                                selectChanged(e);
                                                                setStep21("true");
                                                                let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                                                                let refIndex = inputs.current["21"].getAttribute('ref-num');
                                                                tempLabels[refIndex] = inputs.current["21"].getAttribute('text');
                                                                setStepSelectedLabel(tempLabels);
                                                                setDeps("", "21");
                                                            } else {
                                                                setStep21("");
                                                                // modalHandleShow("noPower");
                                                                if (stepSelectedValue["3"] === "2") {
                                                                    setDeps("21,3", "3AOut,3BOut1,3BOut2,3COut,3DOut,3CArc1,3CArc2,3CArc3");
                                                                    deleteSpecialSelects();
                                                                    setCart("", "", "calcMeasurements,Width3A,Height3C,Width1,Width2,Width3,Height1,Height2,Height3,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3");
                                                                    setStep3("");
                                                                    selectChanged(undefined, "3,3AOut,3BOut,3COut,3DOut,3CArc");
                                                                } else {
                                                                    setDeps("21", "");
                                                                }
                                                            }
                                                        }} id="211" ref={ref => (inputs.current["211"] = ref)}/>
                                                        <label htmlFor="211" className="checkbox_label">
                                                            <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')}
                                                                 alt=""/>
                                                        </label>
                                                        <span className="checkbox_text">
                                                        {t("inside_checkbox_title")}
                                                    </span>
                                                    </div>
                                                
                                                </div>
                                            </div>
                                        }
                                        {stepSelectedValue["2"] === "3" &&
                                            <div className="secondary_options">
                                                <div className="card-body-display-flex">
                                                    <div className="checkbox_style checkbox_style_step2">
                                                        <input type="checkbox" value="1" name="step21" ref-num="21" checked={step21 === "true"} onChange={(e) => {
                                                            if (e.target.checked) {
                                                                selectChanged(e);
                                                                setStep21("true");
                                                                let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                                                                let refIndex = inputs.current["23"].getAttribute('ref-num');
                                                                tempLabels[refIndex] = inputs.current["23"].getAttribute('text');
                                                                setStepSelectedLabel(tempLabels);
                                                                setDeps("", "21");
                                                            } else {
                                                                setStep21("");
                                                                // modalHandleShow("noPower");
                                                                
                                                                if (stepSelectedValue["3"] === "2") {
                                                                    setDeps("21,3", "2AIn1,2AIn2,2AIn3,2BIn1,2BIn2,2BIn3,2A,2B,2E,2DWall,2EWall,2FWall,2GWall,2EWallFloor,2FWallFloor,2C1,2C2,2CCeiling1,2CCeiling2,2D1,2D2,2D3,2DFloor1,2DFloor2,2DFloor3");
                                                                    deleteSpecialSelects();
                                                                    setCart("", "", "calcMeasurements,Width1,Width2,Width3,Height1,Height2,Height3,Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3");
                                                                    setStep3("");
                                                                    selectChanged(undefined, "3,3AIn,3BIn,3AOut,3BOut,3COut,3DOut");
                                                                } else {
                                                                    setDeps("21", "");
                                                                }
                                                            }
                                                        }} id="211" ref={ref => (inputs.current["211"] = ref)}/>
                                                        <label htmlFor="211" className="checkbox_label">
                                                            <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')}
                                                                 alt=""/>
                                                        </label>
                                                        <span className="checkbox_text">
                                                        {t("Arc_checkbox_title")}
                                                    </span>
                                                    </div>
                                                
                                                </div>
                                            </div>
                                        }
                                        <NextStep eventKey={(stepSelectedValue["2"] === "1" || stepSelectedValue["2"] === "3") && step21 !== "true" ? "2" : "3"} onClick={() => {
                                            if ((stepSelectedValue["2"] === "1" || stepSelectedValue["2"] === "3") && step21 !== "true")
                                                modalHandleShow("noInsideUnderstand");
                                        }}>{t("NEXT STEP")}</NextStep>
                                    </div>
                                    {/*<div className="accordion_help">*/}
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
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header"></p>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle"><b>{t("dk_step2_help_1")}</b>{t("dk_step2_help_2")}</li>
                                                    <li className="no_listStyle"><b>{t("dk_step2_help_3")}</b>{t("dk_step2_help_4")}</li>
                                                    <li className="no_listStyle"><b>{t("dk_step2_help_5")}</b>{t("zebra_step2_help_6")}</li>
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
                                                       selectChanged(e, "3AIn,3BIn,3AOut,3BOut,3COut,3DOut,3CArc");
                                                       setMeasurementsNextStep("4");
                                                       setDeps("31,32", "3,3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3,3AOut,3BOut1,3BOut2,3COut,3DOut,3CArc1,3CArc2,3CArc3");
                                                       deleteSpecialSelects();
                                                       setCart("calcMeasurements", false, "WidthCart,HeightCart,Width1,Width2,Width3,Height1,Height2,Height3,Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3");
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
                                                           setCart("calcMeasurements", true, "Width,height,calcMeasurements");
                                                       } else if (stepSelectedValue["2"] === "1") {
                                                           if (stepSelectedValue["2"] === "1" && step21 !== "true") {
                                                               modalHandleShow("noInsideUnderstand");
                                                               setStep3("");
                                                               selectUncheck(e);
                                                               setDeps("3", "31,32");
                                                               setCart("calcMeasurements", true, "Width,height,calcMeasurements");
                                                           } else {
                                                               setStep3("true");
                                                               deleteSpecialSelects();
                                                               selectChanged(e);
                                                               setMeasurementsNextStep("3A");
                                                               setDeps("3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3", "3,3AOut,3BOut1,3BOut2,3COut,3DOut,31,32,3CArc1,3CArc2,3CArc3");
                                                               setCart("calcMeasurements", true, "Width,Height,Width3A,Height3C,ExtensionLeft,ExtensionRight,ShadeMount,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3");
                                                           }
                                                       } else if (stepSelectedValue["2"] === "3") {
                                                           if (stepSelectedValue["2"] === "3" && step21 !== "true") {
                                                               modalHandleShow("noInsideUnderstand");
                                                               setStep3("");
                                                               selectUncheck(e);
                                                               setDeps("3", "31,32");
                                                               setCart("calcMeasurements", true, "Width,height,calcMeasurements");
                                                           } else {
                                                               setStep3("true");
                                                               deleteSpecialSelects();
                                                               selectChanged(e);
                                                               setMeasurementsNextStep("3A");
                                                               setDeps("3AOut,3BOut1,3BOut2,3CArc1,3CArc2,3CArc3", "3,3COut,3DOut,31,32");
                                                               setCart("calcMeasurements", true, "Width,Height,Width1,Width2,Width3,Height1,Height2,Height3,Height3C,ShadeMount");
                                                           }
                                                       } else {
                                                           setStep3("true");
                                                           deleteSpecialSelects();
                                                           selectChanged(e);
                                                           setMeasurementsNextStep("3A");
                                                           setDeps("3AOut,3BOut1,3BOut2,3COut,3DOut", "3,3AIn1,3BIn1,3AIn2,3BIn2,3AIn3,3BIn3,31,32,3CArc1,3CArc2,3CArc3");
                                                           setCart("calcMeasurements", true, "Width,Height,Width1,Width2,Width3,Height1,Height2,Height3,CeilingToWindow1,CeilingToWindow2,CeilingToWindow3");
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
                                                                optionSelectChanged_WidthLength(selected[0], "3", true, "cm", "س\u200Cم", pageLanguage);
                                                                let temp = selectCustomValues;
                                                                temp.width = selected;
                                                                setSelectCustomValues(temp);
                                                                setDeps("", "31");
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
                                                                optionSelectChanged_WidthLength(selected[0], "3", false, "cm", "س\u200Cم", pageLanguage);
                                                                let temp = selectCustomValues;
                                                                temp.length = selected;
                                                                setSelectCustomValues(temp);
                                                                setDeps("", "32");
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
                                                            {t("step3_help_2.5")}
                                                        </li>
                                                        <li className="no_listStyle single_line_height">
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
                        {stepSelectedValue["3"] === "2" && stepSelectedValue["2"] === "1" && step21 === "true" &&
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
                                                    src={pageLanguage === 'fa' ? require('../Images/drapery/zebra/width_inside_3_fa.svg').default : require('../Images/drapery/zebra/new_width_inside_3.svg').default}
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
                                                                    optionSelectChanged_three(selected[0], "3AIn", 0, true, "widthDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.width1 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "3AIn1");
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
                                                                    optionSelectChanged_three(selected[0], "3AIn", 1, true, "widthDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.width2 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "3AIn2");
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
                                                                    optionSelectChanged_three(selected[0], "3AIn", 2, true, "widthDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.width3 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "3AIn3");
                                                                    setCart("Width3", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(30, 300, 1, "cm", "", pageLanguage)}
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
                        {stepSelectedValue["3"] === "2" && stepSelectedValue["2"] === "1" && step21 === "true" &&
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
                                                    src={pageLanguage === 'fa' ? require('../Images/drapery/zebra/height_inside_3_fa.svg').default : require('../Images/drapery/zebra/new_height_inside_3.svg').default}
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
                                                                    optionSelectChanged_three(selected[0], "3BIn", 0, false, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.height1 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "3BIn1");
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
                                                                    optionSelectChanged_three(selected[0], "3BIn", 1, false, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.height2 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "3BIn2");
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
                                                                    optionSelectChanged_three(selected[0], "3BIn", 2, false, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.height3 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "3BIn3");
                                                                    setCart("Height3", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}
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
                        {stepSelectedValue["3"] === "2" && !!(stepSelectedValue["2"] === "2" || stepSelectedValue["2"] === "3") &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="3A" stepNum={t("3A")} stepTitle={t("zebra_step3AOutside")} stepRef="3AOut" type="2"
                                                        required={requiredStep["3AOut"]}
                                                        stepSelected={stepSelectedLabel["3AOut"] === undefined ? "" : stepSelectedLabel["3AOut"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="3A">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("step3A_out_title")}</p>
                                                <img src={require('../Images/drapery/zebra/new_FrameSize.svg').default} className="img-fluid" alt=""/>
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
                                                            values={selectCustomValues.width3A}
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
                                                                    optionSelectChanged("3AOut", selected[0], "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.width3A = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "3AOut");
                                                                    setCart("Width3A", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(30, 290, 1, "cm", "", pageLanguage)}
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
                        {stepSelectedValue["3"] === "2" && !!(stepSelectedValue["2"] === "2" || stepSelectedValue["2"] === "3") &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="3B" stepNum={t("3B")} stepTitle={t("zebra_step3BOutside")} stepRef="3BOut" type="2"
                                                        required={requiredStep["3BOut"]}
                                                        stepSelected={stepSelectedLabel["3BOut"] === undefined ? "" : stepSelectedLabel["3BOut"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="3B">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("step3B_out_title")}</p>
                                                <img src={require('../Images/drapery/zebra/new_wall_cover.svg').default} className="img-fluid" alt=""/>
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
                                    <ContextAwareToggle eventKey="3C" stepNum={t("3C")} stepTitle={t("zebra_step3COutside")} stepRef="3COut" type="2"
                                                        required={requiredStep["3COut"]}
                                                        stepSelected={stepSelectedLabel["3COut"] === undefined ? "" : stepSelectedLabel["3COut"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="3C">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("step3C_out_title")}</p>
                                                <img src={require('../Images/drapery/zebra/new_frame_height.svg').default} className="img-fluid" alt=""/>
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
                                                            values={selectCustomValues.height3C}
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
                                                                    optionSelectChanged("3COut", selected[0], "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.height3C = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "3COut");
                                                                    setCart("Height3C", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}
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
                        
                        {/* step 3C Arc */}
                        {stepSelectedValue["3"] === "2" && stepSelectedValue["2"] === "3" &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="3C" stepNum={t("3C")} stepTitle={t("dk_step2D")} stepRef="3CArc" type="2" required={requiredStep["3CArc"]}
                                                        stepSelected={stepSelectedLabel["3CArc"] === undefined ? "" : stepSelectedLabel["3CArc"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="3C">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("arc_step2D_title")}</p>
                                                <img
                                                    src={pageLanguage === 'fa' ? require('../Images/drapery/dk/new_ceiling_to_window_3_arc.svg').default : require('../Images/drapery/dk/new_ceiling_to_window_3_arc.svg').default}
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
                                                                    optionSelectChanged_three(selected[0], "3CArc", 0, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.CeilingToWindow1 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "3CArc1");
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
                                                                    optionSelectChanged_three(selected[0], "3CArc", 1, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.CeilingToWindow2 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "3CArc2");
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
                                                                    optionSelectChanged_three(selected[0], "3CArc", 2, true, "heightDifferent", "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.CeilingToWindow3 = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "3CArc3");
                                                                    setCart("CeilingToWindow3", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}
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
                        }
                        
                        {/* step 3D outside */}
                        {stepSelectedValue["3"] === "2" && stepSelectedValue["2"] === "2" &&
                            <Card>
                                <Card.Header>
                                    <ContextAwareToggle eventKey="3D" stepNum={t("3D")} stepTitle={t("zebra_step3DOutside")} stepRef="3DOut" type="2"
                                                        required={requiredStep["3DOut"]}
                                                        stepSelected={stepSelectedLabel["3DOut"] === undefined ? "" : stepSelectedLabel["3DOut"]}/>
                                </Card.Header>
                                <Accordion.Collapse eventKey="3D">
                                    <Card.Body>
                                        <div className="card_body">
                                            <div className="box100">
                                                <p className="step_selection_title">{t("step3D_out_title")}</p>
                                                <img src={require('../Images/drapery/zebra/new_shade_mount.svg').default} className="img-fluid" alt=""/>
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
                                                                window.scrollTo(window.scrollX, window.scrollY + 1);
                                                                setTimeout(() => {
                                                                    let temp2 = window.scrollY;
                                                                    if (temp2 === temp1)
                                                                        window.scrollTo(window.scrollX, window.scrollY - 1);
                                                                }, 100);
                                                            }}
                                                            values={selectCustomValues.shadeMount}
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
                                                                    optionSelectChanged("3DOut", selected[0], "cm", "س\u200Cم", pageLanguage);
                                                                    let temp = selectCustomValues;
                                                                    temp.shadeMount = selected;
                                                                    setSelectCustomValues(temp);
                                                                    setDeps("", "3DOut");
                                                                    setCart("ShadeMount", selected[0].value);
                                                                }
                                                            }}
                                                            options={SelectOptionRange(10, 100, 1, "cm", "", pageLanguage)}
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
                                                       setStep41("false");
                                                       setControlTypeNextStep("4A");
                                                       setDeps("4A,4B", "4,41,411,412");
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
                                                className="surcharge_price">{Object.keys(modelAccessories).length !== 0 || selectedMotorMinPrice > 0 ? t("Starts at ") + GetPrice(selectedMotorMinPrice, pageLanguage, t("TOMANS")) : t("Surcharge Applies")}</p>
                                            </label>
                                        
                                        </div>
                                        {stepSelectedValue["4"] === "2" &&
                                            <div className="secondary_options">
                                                {/*<hr/>*/}
                                                {/*<p className="no_power_title">{t("Motor_title")}</p>*/}
                                                <div className="card-body-display-flex">
                                                    {/*<div className="box50 radio_style">*/}
                                                    {/*    <input className="radio" type="radio" text={t("Yes")} value="1" name="step41" ref-num="41" id="411" checked={step41 === "true"}*/}
                                                    {/*           onChange={e => {*/}
                                                    {/*               selectChanged(e);*/}
                                                    {/*               setStep41("true");*/}
                                                    {/*               setDeps("411", "41");*/}
                                                    {/*               setCart("hasPower", true, "", "MotorChannels", [selectedMotorChannels.map(obj => obj.value)]);*/}
                                                    {/*           }} ref={ref => (inputs.current["411"] = ref)}/>*/}
                                                    {/*    <label htmlFor="411">{t("Yes")}</label>*/}
                                                    {/*</div>*/}
                                                    {/*<div className="box50 radio_style">*/}
                                                    {/*    <input className="radio" type="radio" text={t("No")} value="2" name="step41" ref-num="41" id="412"*/}
                                                    {/*           onClick={e => {*/}
                                                    {/*               selectUncheck(e);*/}
                                                    {/*               setStep41("");*/}
                                                    {/*               modalHandleShow("noPower");*/}
                                                    {/*               setDeps("41", "411");*/}
                                                    {/*           }} ref={ref => (inputs.current["412"] = ref)}/>*/}
                                                    {/*    <label htmlFor="412">{t("No")}</label>*/}
                                                    {/*</div>*/}
                                                    <div className="width_max checkbox_style">
                                                        <input type="checkbox" value="1" name="step41" ref-num="41" checked={step41 === "true"} onChange={(e) => {
                                                            if (e.target.checked) {
                                                                selectChanged(e);
                                                                setStep41("true");
                                                                let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                                                                let refIndex = inputs.current["42"].getAttribute('ref-num');
                                                                tempLabels[refIndex] = inputs.current["42"].getAttribute('text');
                                                                setStepSelectedLabel(tempLabels);
                                                                setSelectedMotorPosition([]);
                                                                setDeps("411,412", "41");
                                                                setCart("hasPower", true, "", "MotorChannels", [selectedMotorChannels.map(obj => obj.value)]);
                                                            } else {
                                                                selectUncheck(e);
                                                                setStep41("");
                                                                // modalHandleShow("noPower");
                                                                setDeps("41", "411");
                                                            }
                                                        }} id="411" ref={ref => (inputs.current["411"] = ref)}/>
                                                        <label htmlFor="411" className="checkbox_label">
                                                            <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')}
                                                                 alt=""/>
                                                        </label>
                                                        <span className="checkbox_text">
                                                        {t("Motor_title")}
                                                    </span>
                                                    </div>
                                                
                                                </div>
                                            </div>
                                        }
                                        {stepSelectedValue["41"] === "1" && stepSelectedValue["4"] === "2" &&
                                            <div className="motorized_options same_row_selection">
                                                <div className="motorized_option_left">
                                                    <p>{t("Motor Type")}</p>
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
                                                                if (selected[0] && cartValues["WidthCart"] && cartValues["HeightCart"]) {
                                                                    // console.log(MotorType);
                                                                    setDeps("", "411");
                                                                    setSelectedMotorType(selected);
                                                                    if (selected[0]["apiAccValue"]) {
                                                                        setCustomMotorAcc(selected[0]["apiAccValue"]);
                                                                        setCart("MotorType", selected[0].value, undefined, undefined, undefined, selected[0]["apiAccValue"]);
                                                                    } else {
                                                                        setCart("MotorType", selected[0].value);
                                                                    }
                                                                }
                                                            }}
                                                            options={MotorType[pageLanguage]}
                                                        />
                                                    </div>
                                                </div>
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
                                                                if (selected[0]) {
                                                                    setDeps("", "412");
                                                                    setCart("MotorPosition", selected[0].value);
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
                                                    {!!(remoteNames.length > 0) &&
                                                        <div className="select_container">
                                                            <Select
                                                                className="select"
                                                                placeholder={t("SELECT EXISTING OR ADD NEW")}
                                                                portal={document.body}
                                                                dropdownPosition="bottom"
                                                                dropdownHandle={false}
                                                                dropdownGap={0}
                                                                values={selectedRemoteName}
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
                                                                        setSelectedRemoteName(selected);
                                                                        if (selected[0]["value"] === "addNewRemoteName") {
                                                                            setShowRemoteName(true);
                                                                            setCart("", "", "RemoteName");
                                                                            setRemoteName("");
                                                                        } else {
                                                                            setShowRemoteName(false);
                                                                            setCart("RemoteName", selected[0]["value"]);
                                                                            setRemoteName(selected[0]["value"]);
                                                                        }
                                                                    }
                                                                }}
                                                                options={remoteNames}
                                                            />
                                                        </div>
                                                    }
                                                    {!!(remoteNames.length === 0) &&
                                                        <input className="Remote_name" type="text" name="Remote_name" value={remoteName}
                                                               placeholder={t("Enter a name for your remote")} onChange={(e) => {
                                                            setCart("RemoteName", e.target.value);
                                                            setRemoteName(Capitalize(e.target.value));
                                                        }}/>
                                                    }
                                                </div>
                                                {showRemoteName &&
                                                    <div className="motorized_option_left">
                                                        <p>&nbsp;</p>
                                                    </div>
                                                }
                                                {showRemoteName &&
                                                    <div className="motorized_option_right">
                                                        <input className="Remote_name" type="text" name="Remote_name" value={remoteName}
                                                               placeholder={t("Enter a name for your remote")} onChange={(e) => {
                                                            setCart("RemoteName", e.target.value);
                                                            setRemoteName(Capitalize(e.target.value));
                                                        }}/>
                                                    </div>
                                                }
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
                                                        {/*<li>{t("step4_help_5")}</li>*/}
                                                        <li className="no_listStyle">
                                                        <span className="popover_indicator">
                                                            {<PopoverStickOnHover placement={`${pageLanguage === 'fa' ? "right" : "left"}`}
                                                                                  children={<object className="popover_camera" type="image/svg+xml"
                                                                                                    data={require('../Images/public/camera.svg').default}/>}
                                                                                  component={
                                                                                      <div className="clearfix">
                                                                                          <div className="popover_image clearfix">
                                                                                              <img
                                                                                                  src={popoverImages["step41"] === undefined ? require('../Images/drapery/zebra/motorized_control_type1.png.jpg') : popoverImages["step41"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">{t("step4_popover_1")}</span>
                                                                                              <span className="popover_thumbnails">
                                                                                                  <div>
                                                                                                      <img src={require('../Images/drapery/zebra/motorized_control_type1.png.jpg')}
                                                                                                           text="step41"
                                                                                                           onMouseEnter={(e) => popoverThumbnailHover(e)}
                                                                                                           className="popover_thumbnail_img img-fluid"
                                                                                                           alt=""/>
                                                                                                  </div>
                                                                                                  {/*<div>*/}
                                                                                                  {/*    <img src={require('../Images/drapery/zebra/motorized_control_type2.png')}*/}
                                                                                                  {/*         text="step41"*/}
                                                                                                  {/*         onMouseEnter={(e) => popoverThumbnailHover(e)}*/}
                                                                                                  {/*         className="popover_thumbnail_img img-fluid"*/}
                                                                                                  {/*         alt=""/>*/}
                                                                                                  {/*</div>*/}
                                                                                              </span>
                                                                                          </div>
                                                                                      </div>
                                                                                  }/>
                                                            }
                                                        </span>{t("step4_help_5")}</li>
                                                        {/*<li>{t("step4_help_5.5")}</li>*/}
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
                                        <div className="card_body card_body_radio special_farsi_card_body">
                                            <div className="box50 radio_style radio_middle">
                                                <img src={require('../Images/drapery/zebra/position_left.svg').default} className="img-fluid" alt=""/>
                                                <input className="radio" type="radio" text={t("Left")} value="1" name="step4A" ref-num="4A" id="4A1" checked={step4A === "Left"}
                                                       onChange={e => {
                                                           selectChanged(e);
                                                           setStep4A("Left");
                                                           setDeps("", "4A");
                                                           setCart("ControlPosition", "Left");
                                                       }} ref={ref => (inputs.current["4A1"] = ref)}/>
                                                <label htmlFor="4A1">{t("Left")}</label>
                                            </div>
                                            <div className="box50 radio_style radio_middle">
                                                <img src={require('../Images/drapery/zebra/position_right.svg').default} className="img-fluid" alt=""/>
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
                                                    className="surcharge_price">{Object.keys(modelAccessories).length !== 0 ? t("Add ") : t("Surcharge Applies")}{(modelAccessories["2"] ? (modelAccessories["2"]["2"] ? GetPrice(modelAccessories["2"]["2"]["Price"], pageLanguage, t("TOMANS")) : null) : null)}</p>
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
                                                    className="surcharge_price">{Object.keys(modelAccessories).length !== 0 ? t("Add ") : t("Surcharge Applies")}{(modelAccessories["2"] ? (modelAccessories["2"]["3"] ? GetPrice(modelAccessories["2"]["3"]["Price"], pageLanguage, t("TOMANS")) : null) : null)}</p>
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
                                <ContextAwareToggle eventKey="5" stepNum={t("5")} stepTitle={t("zebra_step5")} stepRef="5" type="1" required={requiredStep["5"]}
                                                    stepSelected={stepSelectedLabel["5"] === undefined ? "" : stepSelectedLabel["5"]}/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="5">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/zebra/metal_valance.svg').default} className="img-fluid mb-3" alt=""/>
                                            <input className="radio" type="radio" text={t("style_Metal Valance")} value="1" name="step5" ref-num="5" id="51"
                                                   checked={step5 === "MetalValance"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep5("MetalValance");
                                                       setDeps("51", "5,52");
                                                       setCart("MetalValanceStyle", "MetalValance");
                                                   }} ref={ref => (inputs.current["51"] = ref)}/>
                                            <label htmlFor="51">{t("style_Metal Valance")}</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/zebra/metal_valance_fabric_insert.svg').default} className="img-fluid mb-3" alt=""/>
                                            <input className="radio" type="radio" text={t("style_Metal Valance") + " " + t("style_Fabric Insert")} value="2" name="step5"
                                                   ref-num="5" id="52" checked={step5 === "MetalValanceFabricInsert"}
                                                   onChange={e => {
                                                       selectChanged(e);
                                                       setStep5("MetalValanceFabricInsert");
                                                       setDeps("52", "5,51");
                                                       setCart("MetalValanceStyle", "MetalValanceFabricInsert");
                                                   }} ref={ref => (inputs.current["52"] = ref)}/>
                                            <label htmlFor="52">{t("style_Metal Valance")}<br/>{t("style_Fabric Insert")}</label>
                                        </div>
                                        {(stepSelectedValue["5"] === "1" || stepSelectedValue["5"] === "2") &&
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
                                                            values={selectedValanceColor1}
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
                                                                    setDeps("", "51");
                                                                    setCart("MetalValanceColor", selected[0].value);
                                                                    let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                                                                    tempLabels["5"] = t("style_Metal Valance") + "/" + selected[0].label;
                                                                    setStepSelectedLabel(tempLabels);
                                                                }
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
                                                            values={selectedValanceColor2}
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
                                                                    setDeps("", "52");
                                                                    setCart("MetalValanceColor", selected[0].value);
                                                                    let tempLabels = JSON.parse(JSON.stringify(stepSelectedLabel));
                                                                    tempLabels["5"] = t("style_Metal Valance") + " " + t("style_Fabric Insert") + "/" + selected[0].label;
                                                                    setStepSelectedLabel(tempLabels);
                                                                }
                                                            }}
                                                            options={optionsMetalValanceFabricInsert[pageLanguage]}
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        }
                                        <NextStep eventKey="6">{t("NEXT STEP")}</NextStep>
                                    </div>
                                    <div className="accordion_help">
                                        <div className="help_container">
                                            <div className="help_column help_left_column">
                                                <p className="help_column_header">{t("step5_help_1")}</p>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle">&nbsp;</li>
                                                    <li className="no_listStyle">
                                                        <span className="popover_indicator">
                                                            {<PopoverStickOnHover placement={`${pageLanguage === 'fa' ? "right" : "left"}`}
                                                                                  children={<object className="popover_camera" type="image/svg+xml"
                                                                                                    data={require('../Images/public/camera.svg').default}/>}
                                                                                  component={
                                                                                      <div className="clearfix">
                                                                                          <div className="popover_image clearfix">
                                                                                              <img
                                                                                                  src={popoverImages["step51"] === undefined ? require('../Images/drapery/zebra/DoubleRoller_Valance_Colors.jpg') : popoverImages["step51"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">{t("step5_popover_1")}</span>
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
                                                        </span>{t("step5_help_2")}</li>
                                                    <li>{t("step5_help_3")}</li>
                                                </ul>
                                            </div>
                                            <div className="help_column help_right_column">
                                                <p className="help_column_header">{t("step5_help_4")}</p>
                                                <ul className="help_column_list">
                                                    <li className="no_listStyle">
                                                        <span className="popover_indicator">
                                                            {<PopoverStickOnHover placement={`${pageLanguage === 'fa' ? "right" : "left"}`}
                                                                                  children={<object className="popover_camera" type="image/svg+xml"
                                                                                                    data={require('../Images/public/camera.svg').default}/>}
                                                                                  component={
                                                                                      <div id="popover_content_step5help2" className="clearfix">
                                                                                          <div className="popover_image clearfix">
                                                                                              <img
                                                                                                  src={popoverImages["step52"] === undefined ? require('../Images/drapery/zebra/DoubleRoller_Valance_Colors.jpg') : popoverImages["step52"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">{t("step5_popover_2")}</span>
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
                                                        </span>{t("step5_help_5")}</li>
                                                    <li>{t("step5_help_6")}</li>
                                                    <li>{t("step5_help_7")}</li>
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
                                                                                                    data={require('../Images/public/camera.svg').default}/>}
                                                                                  component={
                                                                                      <div id="popover_content_step5help2" className="clearfix">
                                                                                          <div className="popover_image clearfix">
                                                                                              <img
                                                                                                  src={popoverImages["step53"] === undefined ? require('../Images/drapery/zebra/roller_bottombar_designer.jpg') : popoverImages["step53"]}
                                                                                                  className="img-fluid" alt=""/>
                                                                                          </div>
                                                                                          <div className="popover_footer">
                                                                                              <span className="popover_footer_title">{t("step5_popover_3")}</span>
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
                                                        </span>{t("step5_help_8")}</li>
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
                                                           roomLabelChanged(Capitalize(e.target.value), "6", true);
                                                           setRoomLabelText(Capitalize(e.target.value));
                                                           setCart("WindowName", Capitalize(e.target.value));
                                                       }}/>
                                            </div>
                                        </div>
                                        <NextStep eventKey="7">{t("NEXT STEP")}</NextStep>
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
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="7" stepNum={t("7")} stepTitle={t("zebra_step7")} stepTitle2={t("(Optional)")} stepRef="7" type="2" required={requiredStep["7"]}
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
                                                <h3 className="zipcode_text">{t("zipcode_text1.5")}</h3>
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
                                                <div className="zipcode_dropdown_div_container">
                                                    <div className="zipcode_input_container">
                                                        <input className="zipcode_input form-control" type="text" name="zipcode_input" value={zipcode}
                                                               placeholder={t("Enter Zip Code")} onChange={(e) => {
                                                            setZipcode(e.target.value.replace(/\D+/g, ''));
                                                        }}/>
                                                        <button className="zipcode_input_button white_btn"
                                                                onClick={() => {
                                                                    setZipcodeButton(true);
                                                                    measureWindowSize(zipcode);
                                                                }}>
                                                            <div/>
                                                        </button>
                                                    </div>
                                                </div>
                                                {zipcodeButton &&
                                                    <h3 className="zipcode_text2">
                                                        {zipcodeButton && hasInstall === false &&
                                                            t("zipcode_text2")
                                                        }
                                                        {zipcodeButton && hasInstall &&
                                                            t("zipcode_text3")
                                                        }
                                                    </h3>
                                                }
                                                {zipcodeButton && hasInstall && installPrice === -1 &&
                                                    <h3 className="zipcode_text">{t("zipcode_text8")}</h3>
                                                }
                                                {zipcodeButton && hasInstall && !!installPrice && installPrice !== -1 &&
                                                    <div className="zipcode_available_container">
                                                        <div className="checkbox_style">
                                                            <input type="checkbox" value="1" name="zipcode" disabled={addingLoading} checked={zipcodeChecked === "true"} onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setZipcodeChecked("true");
                                                                    setCart("ZipCode", zipcode);
                                                                } else {
                                                                    setZipcodeChecked("false");
                                                                    setCart("", "","ZipCode");
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
                                                        <h3 className="zipcode_text3">{t("zipcode_text7")}</h3>
                                                    </div>
                                                }
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
            
            <Modal backdrop="static" keyboard={false} dialogClassName={`measurementsHelp_modal largeSizeModal scroll_on ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["measurementsHelp"] === undefined ? false : modals["measurementsHelp"]}
                   onHide={() => modalHandleClose("measurementsHelp")} scrollable={true}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p className="measurementsHelp_modal_title">{t("HOW TO MEASURE FOR ZEBRA SHADES")}</p>
                    <div className="help_options_container">
                        <ul className="help_options">
                            <li className={`help_option_item ${helpMeasure === "Inside" ? "help_option_item_on" : ""}`}
                                onClick={() => setHelpMeasure("Inside")}>{t("bold_Inside_mount")}</li>
                            <li className="help_option_item_separator"></li>
                            <li className={`help_option_item ${helpMeasure === "Outside" ? "help_option_item_on" : ""}`}
                                onClick={() => setHelpMeasure("Outside")}>{t("bold_Outside_mount")}</li>
                            <li className="help_option_item_separator"></li>
                            <li className={`help_option_item ${helpMeasure === "HiddenMoulding" ? "help_option_item_on" : ""}`}
                                onClick={() => setHelpMeasure("HiddenMoulding")}>{t("bold_Arc_mount")}</li>
                        </ul>
                    </div>
                    {helpMeasure === "Inside" &&
                        <div>
                            <div className="measurementsHelp_modal_img_section">
                                {/*<p className="measurementsHelp_modal_img_title">{t("Inside Mount")}</p>*/}
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
                        </div>
                    }
                    {/*<br/>*/}
                    {/*<br/>*/}
                    {/*<br/>*/}
                    
                    {helpMeasure === "Outside" &&
                        <div>
                            <div className="measurementsHelp_modal_img_section">
                                {/*<p className="measurementsHelp_modal_title">{t("HOW TO MEASURE FOR ZEBRA SHADES")}</p>*/}
                                {/*<p className="measurementsHelp_modal_img_title">{t("Outside Mount")}</p>*/}
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
                        </div>
                    }
                    {helpMeasure === "HiddenMoulding" &&
                        <div>
                            <div className="measurementsHelp_modal_img_section">
                                {/*<p className="measurementsHelp_modal_title">{t("HOW TO MEASURE FOR ZEBRA SHADES")}</p>*/}
                                {/*<p className="measurementsHelp_modal_img_title">{t("Outside Mount")}</p>*/}
                                <object className="measurementsHelp_modal_img" type="image/svg+xml"
                                        data={pageLanguage === 'fa' ? require('../Images/drapery/zebra/step3_help_outside_fa.svg').default : require('../Images/drapery/zebra/step3_help_outside.svg').default}/>
                            </div>
                            <div className="accordion_help measurementsHelp_modal_help_section">
                                <div className="help_container">
                                    <div className="help_column help_left_column">
                                        <p className="help_column_header">{t("TO DETERMINE HIDDEN MOULDING MOUNT")}</p>
                                        <ul className="help_column_list">
                                            <li>{t("modal_help_16")}</li>
                                            <li>{t("modal_help_17")}</li>
                                            <li>{t("modal_help_18")}</li>
                                        </ul>
                                    </div>
                                    
                                    <div className="help_column help_left_column">
                                        <p className="help_column_header">{t("STEP 1: MEASURE WIDTH")}</p>
                                        <ul className="help_column_list">
                                            <li>{t("modal_help_19")}</li>
                                            <li>{t("modal_help_20")}</li>
                                        </ul>
                                    </div>
                                    
                                    <div className="help_column help_right_column">
                                        <p className="help_column_header">{t("STEP 2: MEASURE LENGTH")}</p>
                                        <ul className="help_column_list">
                                            <li>{t("modal_help_21")}</li>
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
                                    <input type="text" placeholder={t("Window Description")} className="form-control window_name" name="order_window_name"
                                           value={roomLabelText}
                                           onChange={(e) => {
                                               if (e.target.value === "")
                                                   setDeps("62", "");
                                               else
                                                   setDeps("", "62");
                                               roomLabelChanged(Capitalize(e.target.value), "6", true);
                                               setRoomLabelText(Capitalize(e.target.value));
                                               setCart("WindowName", Capitalize(e.target.value));
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
                        <button className="btn add_to_cart" disabled={addingLoading} onClick={() => {
                            setAddingLoading(true);
                            addToCart();
                        }}>
                            {addingLoading ? t("ADDING...") : t("footer_Add To Cart")}
                        </button>
                        <button className="btn add_to_cart">
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
                        }} disabled={savingLoading}>{savingLoading ? t("SAVING...") : t("footer_Save To")} {savingLoading ? "" : t("footer_My Account")}</button>
                    </div>
                    
                    {/*<div className="left_footer">*/}
                    {/*    <button className="save_to_acc" onClick={() => {*/}
                    {/*        if (roomLabelText !== "" && selectedRoomLabel.length) {*/}
                    {/*            setSavingLoading(true);*/}
                    {/*            if (projectId && projectId !== "") {*/}
                    {/*                SaveUserProject(depSet, cartValues, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], `${modelID}`, price, defaultModelName, defaultModelNameFa, projectData).then((temp) => {*/}
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
                    {/*                SaveUserProject(depSet, cartValues, [uploadedImagesFile, uploadedImagesURL, uploadedPDFFile, uploadedPDFURL], `${modelID}`, price, defaultModelName, defaultModelNameFa).then((temp) => {*/}
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
                    {/*    <div className="price">{GetPrice(price, pageLanguage, t("TOMANS"))}</div>*/}
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

export default Zebra;