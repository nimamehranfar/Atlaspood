import React, {useContext, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {func} from "prop-types";
import axios from "axios";
// import CartInfo from "../Components/CartInfo";
import UserProjects from "../Components/UserProjects";
import NumberToPersianWord from "number_to_persian_word";
import GetPrice from "../Components/GetPrice";
import {useDispatch, useSelector} from "react-redux";
import authHeader from "../Services/auth-header";
import {refreshToken} from "../Services/auth.service";
import {CartUpdatedFalse, CartUpdatedTrue, LOGIN, LOGOUT, ShowLogin2Modal} from "../Actions/types";
import Select from "react-dropdown-select";
import CustomControlFiles from "../Components/CustomControlFiles";
import Modal from "react-bootstrap/Modal";
import PopoverStickOnHover from "../Components/PopoverStickOnHover";
import GetMeasurementArray from "../Components/GetMeasurementArray";
import GetUserProjectData from "../Components/GetUserProjectData";
import Dropdown from "react-bootstrap/Dropdown";
import {convertToPersian} from "../Components/TextTransform";
import {Accordion, AccordionContext, useAccordionButton} from "react-bootstrap";
import PopoverStickOnClick from "../Components/PopoverStickOnClick";
import { NumToFa,CapitalizeAllWords} from "../Components/TextTransform";
import SaveUserProject from "../Components/SaveUserProject";

const baseURLPrice = "https://api.atlaspood.ir/Sewing/GetSewingOrderPrice";
const baseURLGetCart = "https://api.atlaspood.ir/cart/GetAll";
const baseURLEditProject = "https://api.atlaspood.ir/SewingPreorder/Edit";
const baseURLDeleteBasketProject = "https://api.atlaspood.ir/Cart/DeleteItem";
const baseURLSaveForLaterBasketProject = "https://api.atlaspood.ir/Cart/SaveForLater";
const baseURLAddProjectToCart = "https://api.atlaspood.ir/cart/AddSewingPreorder";
const baseURLDeleteFile = "https://api.atlaspood.ir/SewingOrderAttachment/Delete";
const baseURLFreeShipping = "https://api.atlaspood.ir/WebsiteSetting/GetFreeShippingAmount";
const baseURLChangeZipcode = "https://api.atlaspood.ir/Cart/ChangeZipCode";
const baseURLZipCode = "https://api.atlaspood.ir/Sewing/HasInstall";


function Basket() {
    const {t} = useTranslation();
    const location = useLocation();
    const {swatchOnly} = useParams();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const {isLoggedIn, isRegistered, user, showLogin2} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const firstRender = useRef(true);
    const [firstBasket, setFirstBasket] = useState(true);
    const [noShipping, setNoShipping] = useState(false);
    const [subTotalPrice, setSubTotalPrice] = useState(0);
    const [installPrice, setInstallPrice] = useState(0);
    const [transportPrice, setTransportPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [freeShipPrice, setFreeShipPrice] = useState(0);
    const [cart, setCart] = useState({});
    const [drapery, setDrapery] = useState([]);
    const [draperyList, setDraperyList] = useState([]);
    const [draperyCount, setDraperyCount] = useState(0);
    const [product, setProduct] = useState([]);
    const [productList, setProductList] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [swatches, setSwatches] = useState([]);
    const [swatchesList, setSwatchesList] = useState([]);
    const [swatchesTotalPrice, setSwatchesTotalPrice] = useState(0);
    const [swatchesCount, setSwatchesCount] = useState(0);
    const [cartChanged, setCartChanged] = useState(0);
    const draperyRef = useRef([]);
    
    const [loginAwaiting, setLoginAwaiting] = useState({});
    
    const [show, setShow] = useState(false);
    const [zoomModalHeader, setZoomModalHeader] = useState([]);
    const [zoomModalBody, setZoomModalBody] = useState([]);
    const [files, setFiles] = useState({});
    
    const [modals, setModals] = useState([]);
    
    const [zipcodeId, setZipcodeId] = useState(-1);
    const [zipcodeAll, setZipcodeAll] = useState("");
    const [hasInstall, setHasInstall] = useState(null);
    const [zipcodeButton, setZipcodeButton] = useState(false);
    
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
    
    function ContextAwareToggleViewDetails({eventKey, callback, textOnHide, textOnShow}) {
        const {activeEventKey} = useContext(AccordionContext);
        
        const decoratedOnClick = useAccordionButton(
            eventKey,
            () => callback && callback(eventKey),
        );
        
        const isCurrentEventKey = activeEventKey === eventKey;
        
        return (
            <button
                className="basket_item_title_dropdown_btn"
                aria-expanded={`${isCurrentEventKey}`}
                type="button"
                onClick={decoratedOnClick}
            >
                <h4 className="dk_curtain_preview_item_details">{isCurrentEventKey ? textOnShow : textOnHide}</h4>
            </button>
        );
    }
    
    function removeZipcode(refIndex) {
        if (isLoggedIn) {
            let temp = JSON.parse(JSON.stringify(cart))["CartDetails"];
            let tempProjectContainer = temp.find(opt => opt["CartDetailId"] === refIndex);
            if (Object.keys(tempProjectContainer).length !== 0) {
                let tempProject = tempProjectContainer["SewingPreorder"];
                tempProject["Count"] = tempProject["WindowCount"];
                tempProject["PreorderText"]["InstallAmount"] = 0;
                tempProject["PreorderText"]["TransportationAmount"] = 0;
                tempProject["PreorderText"]["ZipCode"] = "";
                tempProject["PreorderText"]["NeedInstall"] = false;
                tempProject["InstallAmount"] = 0;
                tempProject["TransportationAmount"] = 0;
                tempProject["ZipCode"] = "";
                tempProject["NeedInstall"] = false;
                editBasketProject(tempProject);
            }
            
        } else {
            let tempObj = JSON.parse(JSON.stringify(drapery[refIndex]));
            tempObj["PreorderText"]["InstallAmount"] = 0;
            tempObj["PreorderText"]["TransportationAmount"] = 0;
            tempObj["PreorderText"]["ZipCode"] = "";
            tempObj["InstallAmount"] = 0;
            tempObj["TransportationAmount"] = 0;
            tempObj["ZipCode"] = "";
            tempObj["NeedInstall"] = false;
            
            if (localStorage.getItem("cart") !== null) {
                let cartObj = JSON.parse(localStorage.getItem("cart"));
                if (cartObj["drapery"] === undefined)
                    cartObj["drapery"] = [];
                cartObj["drapery"][refIndex] = tempObj;
                localStorage.setItem('cart', JSON.stringify(cartObj));
                setCartChanged(cartChanged + 1);
            } else {
                let newCartObj = {};
                let newCartArr = [];
                newCartArr[0] = tempObj;
                newCartObj["drapery"] = newCartArr;
                newCartObj["product"] = [];
                newCartObj["swatches"] = [];
                localStorage.setItem('cart', JSON.stringify(newCartObj));
                setCartChanged(cartChanged + 1);
            }
        }
    }
    
    function setBasketNumber(refIndex, numValue, type, minusPlus) {
        if (isLoggedIn) {
            let temp = JSON.parse(JSON.stringify(cart))["CartDetails"];
            
            let tempProjectContainer = temp.find(opt => opt["CartDetailId"] === refIndex);
            
            if (Object.keys(tempProjectContainer).length !== 0) {
                let tempProject = tempProjectContainer["SewingPreorder"];
                tempProject["Count"] = tempProject["WindowCount"];
                if (minusPlus !== undefined) {
                    if (tempProject["Count"] + minusPlus <= 0 || tempProject["Count"] + minusPlus > 10)
                        setBasketNumber(refIndex, tempProject["Count"] + minusPlus, type);
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
            let temp = [];
            let typeString = "";
            let cartObj = {};
            if (type === 0) {
                if (localStorage.getItem("cart") !== null) {
                    cartObj = JSON.parse(localStorage.getItem("cart"));
                    temp = cartObj["drapery"];
                    typeString = "drapery";
                } else {
                    setCart({});
                }
            } else if (type === 1) {
                if (localStorage.getItem("cart") !== null) {
                    cartObj = JSON.parse(localStorage.getItem("cart"));
                    temp = cartObj["product"];
                    typeString = "product";
                } else {
                    setCart({});
                }
            } else {
                if (localStorage.getItem("cart") !== null) {
                    cartObj = JSON.parse(localStorage.getItem("cart"));
                    temp = cartObj["swatches"];
                    typeString = "swatches";
                } else {
                    setCart({});
                }
            }
            if (temp !== []) {
                if (minusPlus !== undefined) {
                    if (temp[refIndex] === undefined) {
                        localStorage.setItem('cart', JSON.stringify(cartObj));
                        setCartChanged(cartChanged + 1);
                    } else {
                        if (temp[refIndex]["Count"] + minusPlus <= 0 || temp[refIndex]["Count"] + minusPlus > 10)
                            setBasketNumber(refIndex, temp[refIndex]["Count"] + minusPlus, type);
                        else {
                            temp[refIndex]["Count"] = temp[refIndex]["Count"] + minusPlus;
                            temp[refIndex]["WindowCount"] = temp[refIndex]["Count"];
                            temp[refIndex]["PreorderText"]["WindowCount"] = temp[refIndex]["Count"];
                            cartObj[typeString] = temp;
                            localStorage.setItem('cart', JSON.stringify(cartObj));
                            setCartChanged(cartChanged + 1);
                        }
                    }
                } else {
                    // console.log(numValue);
                    if (!isNaN(numValue) || numValue === 10 || numValue === "10") {
                        if (parseInt(numValue) > 10) {
                            temp[refIndex]["Count"] = 10;
                            temp[refIndex]["WindowCount"] = temp[refIndex]["Count"];
                            temp[refIndex]["PreorderText"]["WindowCount"] = temp[refIndex]["Count"];
                            cartObj[typeString] = temp;
                            localStorage.setItem('cart', JSON.stringify(cartObj));
                            setCartChanged(cartChanged + 1);
                            
                        } else if (parseInt(numValue) <= 0) {
                            // let loadingArr=[];
                            // loadingArr.push(
                            //     <li key="loading">
                            //         <div className="lds-dual-ring"/>
                            //     </li>
                            // );
                            // setDraperyList(loadingArr);
                            // console.log(draperyRef.current,refIndex,typeof(refIndex));
                            draperyRef.current[refIndex].className = "drapery_basket_item is_loading";
                            setTimeout(() => {
                                draperyRef.current[refIndex].className = "drapery_basket_item";
                                temp.splice(refIndex, 1);
                                cartObj[typeString] = temp;
                                localStorage.setItem('cart', JSON.stringify(cartObj));
                                setCartChanged(cartChanged + 1);
                            }, 1500);
                        } else {
                            temp[refIndex]["Count"] = parseInt(numValue);
                            temp[refIndex]["WindowCount"] = temp[refIndex]["Count"];
                            temp[refIndex]["PreorderText"]["WindowCount"] = temp[refIndex]["Count"];
                            cartObj[typeString] = temp;
                            localStorage.setItem('cart', JSON.stringify(cartObj));
                            setCartChanged(cartChanged + 1);
                        }
                    } else {
                        temp[refIndex]["Count"] = 1;
                        temp[refIndex]["WindowCount"] = temp[refIndex]["Count"];
                        temp[refIndex]["PreorderText"]["WindowCount"] = temp[refIndex]["Count"];
                        cartObj[typeString] = temp;
                        localStorage.setItem('cart', JSON.stringify(cartObj));
                        setCartChanged(cartChanged + 1);
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
            .then((response) => {
                setCart(response.data ? response.data : {});
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
        if (draperyRef.current[refIndex]) {
            draperyRef.current[refIndex].classList.add("is_loading");
        }
        axios.post(baseURLDeleteBasketProject + "/" + refIndex, {},{
            headers: authHeader()
        }).then((response) => {
            if (draperyRef.current[refIndex]) {
                draperyRef.current[refIndex].classList.remove("is_loading");
            }
            setCart(response.data ? response.data : {});
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
                    draperyRef.current[refIndex].classList.remove("is_loading");
                }
            }
        });
    }
    
    function saveForLaterBasketProject(refIndex, projectObject) {
        if (isLoggedIn) {
            draperyRef.current[refIndex].classList.add("is_loading");
            axios.post(baseURLSaveForLaterBasketProject + "/" + refIndex, {}, {
                headers: authHeader()
            }).then((response) => {
                if (draperyRef.current[refIndex]) {
                    draperyRef.current[refIndex].classList.remove("is_loading");
                }
                setCart(response.data ? response.data : {});
            }).catch(err => {
                if (err.response.status === 401) {
                    refreshToken().then((response2) => {
                        if (response2 !== false) {
                            saveForLaterBasketProject(refIndex);
                        } else {
                            navigate("/" + pageLanguage);
                        }
                    });
                } else {
                    if (draperyRef.current[refIndex]) {
                        draperyRef.current[refIndex].classList.remove("is_loading");
                    }
                }
            });
        } else {
            dispatch({
                type: ShowLogin2Modal,
            });
            if (localStorage.getItem("cart") !== null) {
                let cartObj = JSON.parse(localStorage.getItem("cart"));
                let temp = cartObj["drapery"];
                temp.splice(refIndex, 1);
                cartObj["drapery"] = temp;
                localStorage.setItem('cart', JSON.stringify(cartObj));
                setLoginAwaiting(projectObject);
            } else {
            }
        }
    }
    
    function copyItem(indexOrObj,pageId,SpecialId) {
        if (isLoggedIn) {
            let tempObj = JSON.parse(JSON.stringify(indexOrObj));
            delete tempObj["SewingPreorderId"];
            delete tempObj["IsCompleted"];
            delete tempObj["WindowName"];
            delete tempObj["WindowDescription"];
            delete tempObj["RoomNameEn"];
            delete tempObj["RoomNameFa"];
            tempObj["Count"] = 1;
            tempObj["WindowCount"] = 1;
            
            delete tempObj["PreorderText"]["IsCompleted"];
            delete tempObj["PreorderText"]["WindowName"];
            delete tempObj["PreorderText"]["WindowDescription"];
            delete tempObj["PreorderText"]["RoomNameEn"];
            delete tempObj["PreorderText"]["RoomNameFa"];
            tempObj["PreorderText"]["Count"] = 1;
            tempObj["PreorderText"]["WindowCount"] = 1;
            // copyBagObject(indexOrObj);
            sessionStorage.setItem("cartCopy", JSON.stringify(tempObj));
            setTimeout(() => {
                navigate("/" + pageLanguage + JSON.parse(JSON.stringify(UserProjects))[tempObj["SewingModelId"]]["route"] + (SpecialId ? "/"+SpecialId : "") + "/Page-ID/" + pageId)
            }, 200);
            
        } else {
            let tempObj = JSON.parse(JSON.stringify(drapery[indexOrObj]));
            delete tempObj["SewingPreorderId"];
            delete tempObj["IsCompleted"];
            delete tempObj["WindowName"];
            delete tempObj["WindowDescription"];
            delete tempObj["RoomNameEn"];
            delete tempObj["RoomNameFa"];
            tempObj["Count"] = 1;
            tempObj["WindowCount"] = 1;
    
            delete tempObj["PreorderText"]["IsCompleted"];
            delete tempObj["PreorderText"]["WindowName"];
            delete tempObj["PreorderText"]["WindowDescription"];
            delete tempObj["PreorderText"]["RoomNameEn"];
            delete tempObj["PreorderText"]["RoomNameFa"];
            tempObj["PreorderText"]["Count"] = 1;
            tempObj["PreorderText"]["WindowCount"] = 1;
            // if (localStorage.getItem("cart") !== null) {
            //     let cartObj = JSON.parse(localStorage.getItem("cart"));
            //     if (cartObj["drapery"] === undefined)
            //         cartObj["drapery"] = [];
            //     cartObj["drapery"].push(tempObj);
            //     localStorage.setItem('cart', JSON.stringify(cartObj));
            //     setCartChanged(cartChanged + 1);
            // } else {
            //     let newCartObj = {};
            //     let newCartArr = [];
            //     newCartArr[0] = tempObj;
            //     newCartObj["drapery"] = newCartArr;
            //     newCartObj["product"] = [];
            //     newCartObj["swatches"] = [];
            //     localStorage.setItem('cart', JSON.stringify(newCartObj));
            //     setCartChanged(cartChanged + 1);
            // }
            sessionStorage.setItem("cartCopy", JSON.stringify(tempObj));
            setTimeout(() => {
                navigate("/" + pageLanguage + JSON.parse(JSON.stringify(UserProjects))[tempObj["SewingModelId"]]["route"] + (SpecialId ? "/"+SpecialId : "") + "/Page-ID/" + pageId)
            }, 200);
            
        }
    }
    
    function copyBagObject(tempObj) {
        axios.post(baseURLAddProjectToCart, tempObj, {
            headers: authHeader()
        })
            .then((response) => {
                setCart(response.data ? response.data : {});
            })
            .catch(err => {
                if (err.response.status === 401) {
                    refreshToken().then((response2) => {
                        if (response2 !== false) {
                            copyBagObject(tempObj);
                        } else {
                        }
                    });
                } else {
                    console.log("project not Copied");
                }
            });
    }
    
    function CustomDropdownFiles({props, state, methods}) {
        const regexp = new RegExp(state.search, "i");
        
        return (
            <div className={props.className}>
                <div className="select_item_container">
                    {props.options
                        .filter(item =>
                            regexp.test(item[props.searchBy] || item[props.labelField])
                        )
                        .map(option => {
                            let exist = "false";
                            let extensionSearch = /(?:\.([^.]+))?$/;
                            let extension = extensionSearch.exec(option[props.labelField])[1].toLowerCase();
                            let fileName = option[props.labelField].replace(/\.[^/.]+$/, "");
                            // Object.values(state.values).forEach(obj=>{
                            //     if(obj.value=== option.value)
                            //         exist="true";
                            // });
                            return (
                                <div className="select_item uploaded_name_item"
                                     item-selected={exist}
                                     disabled={option.disabled}
                                     key={option[props.valueField]}>
                                    <i className="fa fa-file"/>
                                    <div className="uploaded_name_item_text" onClick={() => showFile(`${option[props.valueField]}`, extension)}>{fileName}</div>
                                    <div className="uploaded_name_item_x" onClick={() => {
                                        deleteUploaded(option[props.valueField]);
                                        methods.addItem(option);
                                    }}>X
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }
    
    let imageExtensionList = ["jpg", "png", "jpeg", "jiff", "gif", "webp"];
    let pdfExtensionList = ["pdf"];
    
    function showFile(fileUrl, extension) {
        if (imageExtensionList.indexOf(extension) > -1) {
            handleShow(fileUrl);
        } else if (pdfExtensionList.indexOf(extension) > -1) {
            const pdfWindow = window.open();
            pdfWindow.location.href = `https://api.atlaspood.ir${fileUrl}`;
        }
    }
    
    function deleteUploaded(fileUrl) {
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
                                deleteUploaded(fileUrl);
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
        });
    }
    
    function deleteFileFromProject(obj, projectId) {
        let temp = JSON.parse(JSON.stringify(drapery));
        console.log(drapery);
        let tempProject = temp.find(opt => opt["SewingPreorderId"] === projectId)["SewingPreorder"];
        let tempFileIndex = tempProject["SewingOrderAttachments"].findIndex(opt => opt["FileUrl"] === obj.value);
        
        tempProject["SewingOrderAttachments"].splice(tempFileIndex, 1);
        
        editBasketProject(tempProject);
    }
    
    function handleShow(PhotoPath) {
        const tempDiv = [];
        // const tempDiv1 = [];
        tempDiv.push(
            <div key={PhotoPath} className="zoomImg">
                <div className="imageContainer">
                    {/*<ReactImageMagnify*/}
                    {/*    imageProps={{*/}
                    {/*        alt: '',*/}
                    {/*        isFluidWidth: true,*/}
                    {/*        src: `https://api.atlaspood.ir/${PhotoPath}`*/}
                    {/*    }}*/}
                    {/*    magnifiedImageProps={{*/}
                    {/*        src: `https://api.atlaspood.ir/${PhotoPath}`,*/}
                    {/*        width: 800,*/}
                    {/*        height: 800*/}
                    {/*    }}*/}
                    {/*    portalProps={{placement: 'over'}}*/}
                    {/*/>*/}
                    <object className="img-fluid intractable" data={`https://api.atlaspood.ir${PhotoPath}`}/>
                </div>
            </div>
        );
        // tempDiv1.push(
        //     <span key={1} className="s">{pageLanguage === 'en' ? DesignEnName : DesignName} / {pageLanguage === 'en' ? ColorEnName : ColorName}</span>
        // );
        
        setZoomModalBody(tempDiv);
        // setZoomModalHeader(tempDiv1);
        setShow(true);
    }
    
    function changeZipcode() {
        axios.post(baseURLZipCode, {}, {
            params: {
                zipCode: zipcodeAll
            }
        }).then((response) => {
            if(response.data) {
                if(isLoggedIn) {
                    axios.get(baseURLChangeZipcode + "/" + zipcodeId, {
                        params: {
                            zipCode: zipcodeAll
                        },
                        headers: authHeader()
                    }).then((response) => {
                        setZipcodeAll("");
                        setZipcodeId(-1);
                        setHasInstall(null);
                        setCart(response.data ? response.data : {});
                    }).catch(err => {
                        if (err.response.status === 401) {
                            refreshToken().then((response2) => {
                                if (response2 !== false) {
                                    changeZipcode();
                                } else {
                                    navigate("/" + pageLanguage);
                                }
                            });
                        } else {
                            setZipcodeAll("");
                            setZipcodeId(-1);
                            renderDraperies();
                            setHasInstall(null);
                        }
                    });
                }
                else{
                    if (localStorage.getItem("cart") !== null) {
                        let cartObj = JSON.parse(localStorage.getItem("cart"));
                        let temp = cartObj["drapery"];
                        let promiseArr = [];
    
                        temp.forEach((tempObj, index) => {
                            promiseArr[index] = new Promise((resolve, reject) => {
                                if(tempObj["ZipCode"]!=="") {
                                    tempObj["ZipCode"] = zipcodeAll;
                                    tempObj["PreorderText"]["ZipCode"] = zipcodeAll;
                                }
                                resolve();
                            })
                        })
    
                        Promise.all(promiseArr).then(() => {
                            cartObj["drapery"] = temp;
                            localStorage.setItem('cart', JSON.stringify(cartObj));
                            setZipcodeAll("");
                            setZipcodeId(-1);
                            setHasInstall(null);
                            setCartChanged(cartChanged + 1);
                        })
                    } else {
                        setCartChanged(cartChanged + 1);
                    }
                }
            }
            else{
                setHasInstall(response.data);
            }
        }).catch(err => {
            console.log(err);
            setHasInstall(false);
        });
        
    }
    
    function getCart(){
        if (isLoggedIn) {
            axios.get(baseURLGetCart, {
                headers: authHeader()
            }).then((response) => {
                setCart(response.data ? response.data : {});
                setFirstBasket(false);
            }).catch(err => {
                if (err.response.status === 401) {
                    refreshToken().then((response2) => {
                        if (response2 !== false) {
                            getCart();
                        } else {
                            setFirstBasket(false);
                        }
                    });
                } else {
                    setFirstBasket(false);
                }
            });
        } else {
            if (localStorage.getItem("cart") !== null) {
                setCart({...JSON.parse(localStorage.getItem("cart")), ...{"lang": location.pathname.split('').slice(1, 3).join('')}});
            } else {
                setCart({});
            }
            setFirstBasket(false);
        }
        axios.get(baseURLFreeShipping).then((response) => {
            setFreeShipPrice(response.data);
        }).catch(err => {
            console.log(err);
        });
    }
    
    function renderDraperies(){
        if (isLoggedIn) {
            if (drapery.length) {
                let tempFiles = JSON.parse(JSON.stringify(files));
                let projectData = JSON.parse(JSON.stringify(UserProjects));
                let temp = [];
                let tempNoShip = true;
                let promise2 = new Promise((resolve, reject) => {
                    drapery.sort(function(a, b) {
                        return b["CartDetailId"] - a["CartDetailId"]  ||  b["SewingPreorderId"] - a["SewingPreorderId"];
                    }).forEach((tempObj,i)=>{
                        let projectDataObj = projectData[drapery[i]["SewingPreorder"]["SewingModelId"]];
                        let desc = [];
                        let projectId = drapery[i]["SewingPreorderId"];
                        // let obj={};
                        let obj = drapery[i]["SewingPreorder"]["PreorderText"] || {};
                        let fabricColorFa = obj["FabricColorFa"];
                        let fabricColor = obj["FabricColorEn"];
                        let fabricDesignFa = obj["FabricDesignFa"];
                        let fabricDesign = obj["FabricDesignEn"];
                        let defaultModelNameFa = obj["ModelNameFa"];
                        let defaultModelName = obj["ModelNameEn"];
                        let roomNameFa = obj["RoomNameFa"];
                        let roomName = obj["RoomNameEn"];
                        let WindowName = obj["WindowName"] === undefined ? "" : obj["WindowName"];
                        let photoUrl = obj["PhotoUrl"];
                        let SewingModelId = obj["SewingModelId"];
                        let zipcode = drapery[i]["SewingPreorder"]["ZipCode"];
                        obj["Price"] = drapery[i]["PayableAmount"];
                        
                        if (tempNoShip) {
                            tempNoShip = zipcode && zipcode !== "";
                        }
                        
                        // let fabricColorFa = "";
                        // let fabricColor = "";
                        // let fabricDesignFa = "";
                        // let fabricDesign = "";
                        // let defaultModelNameFa = "";
                        // let defaultModelName = "";
                        // let roomNameFa = "";
                        // let roomName = "";
                        // let WindowName = "";
                        // let photoUrl = "";
                        let InstallAmount = drapery[i]["SewingPreorder"]["InstallAmount"] ? drapery[i]["SewingPreorder"]["InstallAmount"] : 0;
                        // let SewingModelId = drapery[i]["SewingPreorder"]["SewingModelId"];
                        // obj["InstallAmount"] = drapery[i]["InstallAmount"]?obj["InstallAmount"]:0;
                        // obj["WindowCount"] = drapery[i]["Count"];
                        // console.log(obj["WindowCount"]);
                        
                        let uploadedFiles = drapery[i]["SewingPreorder"]["SewingOrderAttachments"];
                        let tempSelectArr = [];
                        
                        if (uploadedFiles && uploadedFiles.length > 0) {
                            let promise3 = new Promise((resolve, reject) => {
                                uploadedFiles.forEach((obj1, index) => {
                                    tempSelectArr.push({
                                        value: obj1["FileUrl"], label: obj1["UserFileName"]
                                    });
                                    if (index === uploadedFiles.length - 1) {
                                        resolve();
                                    }
                                });
                            });
                            promise3.then(() => {
                                tempFiles[`${projectId}`] = tempSelectArr;
                            });
                        }
                        
                        if (projectDataObj) {
                            let promiseArr = [];
                            let firstMeasurements = true;
                            
                            projectDataObj["data"].forEach((tempObj, index) => {
                                promiseArr[index] = new Promise((resolve, reject) => {
                                    if (tempObj["title"] !== "" && tempObj["lang"].indexOf(pageLanguage) > -1) {
                                        let objLabel = "";
                                        if (obj[tempObj["apiLabel"]] === undefined) {
                                            resolve();
                                        } else if (tempObj["apiLabel"] === "WindowWidth" && tempObj["measurements"]) {
                                            if (firstMeasurements) {
                                                firstMeasurements = false;
                                                GetUserProjectData(drapery[i]["SewingPreorder"], true).then((temp) => {
                                                    // console.log(temp,drapery[i]["SewingPreorder"]);
                                                    desc[tempObj["order"]] =
                                                        <div className="basket_item_title_desc" key={index}>
                                                            <h3>{t("Measurements")}&nbsp;</h3>
                                                            {/*<PopoverStickOnClick classNames="basket_view_detail_popover"*/}
                                                            {/*                     placement="bottom"*/}
                                                            {/*                     children={<h2 className="checkout_item_details">{t("View Details")}</h2>}*/}
                                                            {/*                     children2={<h2 className="checkout_item_details">{t("Hide Details")}</h2>}*/}
                                                            {/*                     component={*/}
                                                            {/*                         <div className="basket_item_title_container">*/}
                                                            {/*                             <GetMeasurementArray modelId={`${SewingModelId}`} cartValues={temp}/>*/}
                                                            {/*                         </div>*/}
                                                            {/*                     }/>*/}
                                                            {/*<Dropdown autoClose="outside" title="" align={pageLanguage === "fa" ? "end" : "start"}>*/}
                                                            {/*    <Dropdown.Toggle className="basket_item_title_dropdown_btn">*/}
                                                            {/*        <h4 className="basket_item_details">{t("View Details")}</h4>*/}
                                                            {/*        <img className="select_control_handle_close img-fluid" src={require('../Images/public/arrow_down.svg').default}*/}
                                                            {/*             alt=""/>*/}
                                                            {/*    </Dropdown.Toggle>*/}
                                                            {/*    <Dropdown.Menu className="basket_item_title_dropdown">*/}
                                                            {/*        <div className="basket_item_title_container">*/}
                                                            {/*            <GetMeasurementArray modelId={`${SewingModelId}`} cartValues={temp}/>*/}
                                                            {/*        </div>*/}
                                                            {/*    </Dropdown.Menu>*/}
                                                            {/*</Dropdown>*/}
                                                            <h4 className="basket_measurement_accordion_container">
                                                                <Accordion>
                                                                    <Accordion.Item eventKey="0">
                                                                        <ContextAwareToggleViewDetails eventKey="0" textOnHide={t("View Details")} textOnShow={t("Hide Details")}/>
                                                                        <Accordion.Body className="basket_item_title_dropdown dk_curtain_preview_dropdown">
                                                                            <div className="basket_item_title_container">
                                                                                <GetMeasurementArray modelId={`${SewingModelId}`} cartValues={temp}/>
                                                                            </div>
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                </Accordion>
                                                            </h4>
                                                        </div>;
                                                    resolve();
                                                }).catch(() => {
                                                    resolve();
                                                });
                                            } else {
                                                resolve();
                                            }
                                        } else if (tempObj["apiLabel"] === "WindowHeight" && tempObj["measurements"]) {
                                            resolve();
                                        } else {
                                            let apiValue = obj[tempObj["apiLabel"]] === null ? "null" : obj[tempObj["apiLabel"]].toString();
                                            if (tempObj["apiLabel"] === "ControlType" && obj["ControlType"] === "Motorized") {
                                                objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${t(obj[tempObj["apiLabel"]].toString())} / ${t(obj["MotorType"].toString())}`).toString() : `${t(obj[tempObj["apiLabel"]].toString())} / ${t(obj["MotorType"].toString())}`;
                                            } else if (tempObj["titleValue"] === null) {
                                                if (tempObj["titlePostfix"] === "") {
                                                    objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${t(apiValue)}`).toString() : t(apiValue);
                                                } else {
                                                    objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${apiValue}`).toString() + t(tempObj["titlePostfix"]) : apiValue + t(tempObj["titlePostfix"]);
                                                }
                                            } else {
                                                if (tempObj["titleValue"][apiValue] === null) {
                                                    if (tempObj["titlePostfix"] === "") {
                                                        objLabel = t(apiValue);
                                                    } else {
                                                        objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${apiValue}`).toString() + t(tempObj["titlePostfix"]) : apiValue.toString() + t(tempObj["titlePostfix"]);
                                                    }
                                                } else {
                                                    objLabel = t(tempObj["titleValue"][apiValue]);
                                                }
                                            }
                                            desc[tempObj["order"]] =
                                                <div className="basket_item_title_desc" key={index}>
                                                    <h3>{t(tempObj["title"])}&nbsp;</h3>
                                                    <h4>{objLabel}</h4>
                                                </div>;
                                            resolve();
                                        }
                                        
                                        // if (index === projectDataObj["data"].length - 1) {
                                        //     resolve();
                                        // }
                                    } else {
                                        // if (index === projectDataObj["data"].length - 1) {
                                        //                                     //     resolve();
                                        //                                     // }
                                        resolve();
                                    }
                                });
                            });
                            
                            Promise.all(promiseArr).then(() => {
                                // console.log(desc);
                                temp[i] =
                                    <li className="drapery_basket_item" key={i} ref={ref => (draperyRef.current[drapery[i]["CartDetailId"]] = ref)}>
                                    <span className="basket_item_title">
                                        <div className="basket_item_image_container">
                                            <img src={`https://api.atlaspood.ir/${photoUrl}`} alt="" className="basket_item_img"/>
                                        </div>
                                        <div className="basket_item_title_container">
                                            <div
                                                className="basket_item_title_name">{pageLanguage === 'fa' ? convertToPersian(defaultModelNameFa) + " سفارشی " : "Custom " + defaultModelName}</div>
                                            {SewingModelId === "0326" &&
                                                <div className="basket_item_title_desc">
                                                    <h3>{pageLanguage === 'fa' ? "پارچه/رنگ" : "Fabric/Color"}&nbsp;</h3>
                                                    <h4>
                                                        <div className={`dk_curtain_preview_container`}>
                                                            <Accordion>
                                                                <Accordion.Item eventKey="0">
                                                                    <ContextAwareToggleViewDetails eventKey="0" textOnHide={t("View Details")} textOnShow={t("Hide Details")}/>
                                                                    <Accordion.Body className="basket_item_title_dropdown dk_curtain_preview_dropdown">
                                                                        <div className="dk_curtain_preview_detail_container">
                                                                            {obj["CurtainArr"].map((item, i) =>
                                                                                <div key={i}
                                                                                     className="dk_curtain_preview_detail">
                                                                                    <h2>{pageLanguage === 'en' ? ("VANE " + (+i + +1) + ":") : (" شال" + NumberToPersianWord.convertEnToPe(`${+i + +1}`) + ":")}</h2>
                                                                                    <h3>&nbsp;{(pageLanguage === 'en' ? CapitalizeAllWords(item["DesignEnName"]) : item["DesignName"]).toString() + " / " + (pageLanguage === 'en' ? CapitalizeAllWords(item["ColorEnName"]) : item["ColorName"]).toString()}</h3>
                                                                                </div>)}
                                                                        </div>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>
                                                            </Accordion>
                                                        </div>
                                                    </h4>
                                                </div>
                                            }
                                            {SewingModelId === "0325" &&
                                                <div className="basket_item_title_desc">
                                                    <h3>{t("dualRoller_step1")}&nbsp;</h3>
                                                    <h4>{pageLanguage === 'fa' ? obj["FabricDesignFa"] + " / " + obj["FabricColorFa"] : obj["FabricDesignEn"] + " / " + obj["FabricColorEn"]}</h4>
                                                </div>
                                            }
                                            {SewingModelId === "0325" &&
                                                <div className="basket_item_title_desc">
                                                    <h3>{t("dualRoller_step2")}&nbsp;</h3>
                                                    <h4>{pageLanguage === 'fa' ? obj["FabricDesignFa2"] + " / " + obj["FabricColorFa2"] : obj["FabricDesignEn2"] + " / " + obj["FabricColorEn2"]}</h4>
                                                </div>
                                            }
                                            {desc}
                                            <div className="basket_item_title_desc">
                                                <h3>{pageLanguage === 'fa' ? "نام اتاق" : "Room Label"}&nbsp;</h3>
                                                <h4>{pageLanguage === 'fa' ? roomNameFa + (WindowName === "" ? "" : " / " + WindowName) : roomName + (WindowName === "" ? "" : " / " + WindowName)}</h4>
                                            </div>
                                            <div className="basket_item_desc_button">
                                                <Link className="btn basket_desc_button"
                                                      to={"/" + pageLanguage + JSON.parse(JSON.stringify(UserProjects))[drapery[i]["SewingPreorder"]["SewingModelId"]]["route"] + (obj["SpecialId"] ? "/"+obj["SpecialId"] : "") + "/Bag-Projects/" + drapery[i]["SewingPreorderId"] + "/Page-ID/" + obj["PageId"]}>{t("EDIT")}</Link>
                                                <button className="basket_desc_button" onClick={() => copyItem(drapery[i]["SewingPreorder"],obj["PageId"],obj["SpecialId"])}>{t("COPY")}</button>
                                            </div>
                                            {zipcode && zipcode !== "" &&
                                                <div className="basket_zipcode_container">
                                                    <div className="basket_zipcode_left">
                                                        <h1 className="basket_zipcode_title">{t("basket_zipcode_text1")}</h1>
                                                        {(zipcodeId===-1 || zipcodeId!==drapery[i]["SewingPreorderId"]) &&
                                                            <div className="basket_zipcode_change_container">
                                                                <h2 className="basket_zipcode_title2">{t("basket_zipcode_text3")}{pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${zipcode}`) : zipcode}&nbsp;|&nbsp;</h2>
                                                                <h2 className="basket_zipcode_title3 text_underline" onClick={()=>setZipcodeId(drapery[i]["SewingPreorderId"])}>{t("Change")}</h2>
                                                            </div>
                                                        }
                                                        {zipcodeId===drapery[i]["SewingPreorderId"] &&
                                                            <div className="basket_zipcode_change_input_container">
                                                                <input className="zipcode_input form-control" type="text" name="zipcode_input" defaultValue={zipcodeAll}
                                                                       placeholder={t("Enter Zip Code")} onChange={(e) => {
                                                                    setZipcodeAll(e.target.value.replace(/\D+/g, ''));
                                                                }}/>
                                                                <button className="zipcode_input_button white_btn"
                                                                        onClick={() => {
                                                                            setZipcodeButton(true);
                                                                        }}>
                                                                    {t("Update")}
                                                                </button>
                                                            </div>
                                                        }
                                                        {zipcodeId===drapery[i]["SewingPreorderId"] && hasInstall===false &&
                                                            <h3 className="basket_zipcode_err">{t("basket_zipcode_err")}</h3>
                                                        }
                                                        <button className="basket_zipcode_btn text_underline"
                                                                onClick={() => removeZipcode(drapery[i]["CartDetailId"])}>{t("Remove")}</button>
                                                    </div>
                                                    <div className="basket_zipcode_right">
                                                        <h2 className="basket_zipcode_price">{GetPrice(InstallAmount, pageLanguage, t("TOMANS"))}</h2>
                                                    </div>
                                                    <div className="basket_zipcode_bottom">
                                                        {/*<div className="basket_zipcode_img_container">*/}
                                                        {/*    <img src={require('../Images/public/no_image.svg').default} className="img-fluid" alt=""/>*/}
                                                        {/*</div>*/}
                                                        <div className="basket_zipcode_desc_container">
                                                            <h2 className="basket_zipcode_desc_text">{t("basket_zipcode_text2")}
                                                                {/*<button className="basket_zipcode_desc_btn text_underline">{t("How It Works")}</button>*/}
                                                            </h2>
                                                            {/*<div className="basket_zipcode_desc_btn_container">*/}
                                                            {/*    <button className="basket_zipcode_desc_btn text_underline">{t("How It Works")}</button>*/}
                                                            {/*    <span/>*/}
                                                            {/*    <button className="basket_zipcode_desc_btn text_underline">{t("Terms Apply")}</button>*/}
                                                            {/*</div>*/}
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            <div className="basket_item_delivery_section">
                                                <div className="basket_item_delivery_avail">
                                                    <h1 className="basket_item_delivery_title">{t("AVAILABILITY")}</h1>
                                                    <h2 className="basket_item_delivery_desc">{zipcode && zipcode !== "" ? t("AVAILABILITY_desc") : t("AVAILABILITY_desc2")}</h2>
                                                </div>
                                                <div className="basket_item_delivery_return">
                                                    <h1 className="basket_item_delivery_title">{t("RETURNS")}</h1>
                                                    <h2 className="basket_item_delivery_desc">{t("RETURNS_desc")}<p>{t("Return Policy")}</p></h2>
                                                </div>
                                            </div>
                                        </div>
                                    </span>
                                        <span
                                            className="basket_item_price">{GetPrice((obj["Price"]), pageLanguage, t("TOMANS"))}</span>
                                        <span className="basket_item_qty">
                                        <div className="basket_item_qty_numbers">
                                            <button type="text" className="basket_qty_minus" onClick={() => setBasketNumber(drapery[i]["CartDetailId"], 0, 0, -1)}><img
                                                src={require('../Images/public/minus.svg').default} alt="" className="qty_math_icon"/></button>
                                            <input type="text" className="basket_qty_num"
                                                   value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj["WindowCount"]}`) : obj["WindowCount"]}
                                                   onChange={(e) => setBasketNumber(drapery[i]["CartDetailId"], NumberToPersianWord.convertPeToEn(`${e.target.value}`), 0)}
                                                   readOnly/>
                                            <button type="text" className="basket_qty_plus" onClick={() => setBasketNumber(drapery[i]["CartDetailId"], 0, 0, 1)}><img
                                                src={require('../Images/public/plus.svg').default}
                                                alt="" className="qty_math_icon"/></button>
                                        </div>
                                        <div className="basket_item_qty_button">
                                            <button className="basket_button basket_button_remove"
                                                    onClick={() => setBasketNumber(drapery[i]["CartDetailId"], 0, 0)}>{t("X REMOVE")}</button>
                                        </div>
                                        <div className="basket_item_qty_button" onClick={() => saveForLaterBasketProject(drapery[i]["CartDetailId"])}>
                                            <button className="basket_button basket_button_edit"><p>+</p>&nbsp;<h4>{t("SAVE TO MY ACCOUNT")}</h4></button>
                                        </div>
                                    </span>
                                        <span className="basket_item_total">{GetPrice(obj["Price"] * obj["WindowCount"], pageLanguage, t("TOMANS"))}</span>
                                        <span className={(uploadedFiles && uploadedFiles.length > 0) ? "basket_item_visible1" : "basket_item_hidden1"}>
                                    {(uploadedFiles && uploadedFiles.length > 0) &&
                                        <div className="select_container">
                                            <Select
                                                className="select"
                                                placeholder={t("UPLOADED IMAGES/PDF")}
                                                portal={document.body}
                                                dropdownPosition="bottom"
                                                dropdownHandle={false}
                                                dropdownGap={0}
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
                                                    ({props, state, methods}) => <CustomDropdownFiles props={props} state={state} methods={methods}/>
                                                }
                                                contentRenderer={
                                                    ({props, state, methods}) => <CustomControlFiles props={props} state={state} methods={methods}/>
                                                }
                                                // optionRenderer={
                                                //     ({ item, props, state, methods }) => <CustomOption item={item} props={props} state={state} methods={methods}/>
                                                // }
                                                onChange={(selected) => {
                                                    if (selected[0] !== undefined) {
                                                        deleteFileFromProject(selected[0], projectId);
                                                    }
                                                }}
                                                options={tempSelectArr}
                                            />
                                        </div>
                                    }
                                </span>
                                    </li>;
                                if (i === drapery.length - 1) {
                                    resolve();
                                }
                            });
                        }
                    })
                });
                promise2.then(() => {
                    setDraperyList(temp);
                    setFiles(tempFiles);
                    setNoShipping(tempNoShip);
                });
            } else {
                setDraperyList([]);
                setSubTotalPrice(0);
                setInstallPrice(0);
                setTransportPrice(0);
                setTotalPrice(0);
                setNoShipping(true);
            }
        } else {
            if (drapery.length) {
                let tempDrapery = JSON.parse(JSON.stringify(drapery));
                // let cartInfo = JSON.parse(JSON.stringify(CartInfo));
                let temp = [];
                let delArr = [];
                
                let draperiesTotalPrice = 0;
                let draperiesTotalInstall = 0;
                let draperiesTotalTransport = 0;
                let promiseArr = [];
                let tempNoShip = true;
                
                tempDrapery.forEach((obj, index) => {
                    promiseArr[index] = new Promise((resolve, reject) => {
                        let tempPostObj = {};
                        if (obj["PreorderText"] === undefined) {
                            localStorage.removeItem("cart");
                        } else {
                            let userProjects = JSON.parse(JSON.stringify(UserProjects))[obj["PreorderText"]["SewingModelId"]]["data"];
                            // let obj = obj1["PreorderText"];
                            GetUserProjectData(obj).then((temp) => {
                                tempPostObj["WindowCount"] = 1;
                                tempPostObj["SewingModelId"] = obj["SewingModelId"];
                                Object.keys(temp).forEach(key => {
                                    if (temp[key] !== null || temp[key] !== "") {
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
                                tempPostObj["SewingOrderDetails"][0] = {};
                                tempPostObj["SewingOrderDetails"][0]["CurtainPartId"] = 2303;
                                tempPostObj["SewingOrderDetails"][0]["SewingModelId"] = obj["SewingModelId"];
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
                                            if (tempObj["apiAcc"] === true && tempObj["apiAccValue"][temp[key]]) {
                                                tempPostObj["SewingOrderDetails"][0]["Accessories"].push(tempObj["apiAccValue"][temp[key]]);
                                            } else {
                                            
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
                                console.log(err);
                                resolve(false);
                            });
                        }
                    });
                });
                delArr.forEach(el => {
                    tempDrapery.splice(el, 1);
                });
                Promise.all(promiseArr).then(function (values) {
                    // console.log(values);
                    let tempDraperiesTotalTransport = values.find(function (el) {
                        return el["data"] && el["data"]["TransportationAmount"] && el["data"]["TransportationAmount"] > 0;
                    });
                    if (tempDraperiesTotalTransport && tempDraperiesTotalTransport["data"] && tempDraperiesTotalTransport["data"]["TransportationAmount"]) {
                        draperiesTotalTransport = tempDraperiesTotalTransport["data"]["TransportationAmount"]
                    } else {
                        draperiesTotalTransport = 0;
                    }
                    
                    let promise2 = new Promise((resolve, reject) => {
                        tempDrapery.forEach((obj1, index) => {
                            
                            let obj = obj1["PreorderText"];
                            let userProjects = JSON.parse(JSON.stringify(UserProjects))[obj["SewingModelId"]]["data"];
                            let desc = [];
                            let fabricColorFa = obj["FabricColorFa"];
                            let fabricColor = obj["FabricColorEn"];
                            let fabricDesignFa = obj["FabricDesignFa"];
                            let fabricDesign = obj["FabricDesignEn"];
                            let defaultModelNameFa = obj["ModelNameFa"];
                            let defaultModelName = obj["ModelNameEn"];
                            let roomNameFa = obj["RoomNameFa"];
                            let roomName = obj["RoomNameEn"];
                            let WindowName = obj["WindowName"] === undefined ? "" : obj["WindowName"];
                            let photoUrl = obj["PhotoUrl"];
                            let SewingModelId = obj["SewingModelId"];
                            let zipcode = obj1["ZipCode"];
                            obj["Price"] = values[index].data["price"] / obj1["WindowCount"];
                            obj1["Price"] = values[index].data["price"] / obj1["WindowCount"];
                            obj["InstallAmount"] = values[index].data["InstallAmount"] ? values[index].data["InstallAmount"] : 0;
                            obj["TransportationAmount"] = values[index].data["TransportationAmount"] ? values[index].data["TransportationAmount"] : 0;
                            draperiesTotalPrice += values[index].data["price"];
                            draperiesTotalInstall += values[index].data["InstallAmount"];
                            
                            if (tempNoShip) {
                                tempNoShip = zipcode && zipcode !== "";
                            }
                            
                            let promiseArr2 = [];
                            let firstMeasurements = true;
                            Object.keys(obj).forEach((key, i) => {
                                promiseArr2[i] = new Promise((resolve, reject) => {
                                    let tempObj = userProjects.find(obj => obj["apiLabel"] === key);
                                    if (tempObj === undefined) {
                                        delArr.push(index);
                                        resolve();
                                    } else if (tempObj["apiLabel"] === "WindowWidth" && tempObj["measurements"]) {
                                        if (firstMeasurements) {
                                            firstMeasurements = false;
                                            GetUserProjectData(obj1, false).then((temp) => {
                                                desc[tempObj["order"]] =
                                                    <div className="basket_item_title_desc" key={i}>
                                                        <h3>{t("Measurements")}&nbsp;</h3>
                                                        {/*<PopoverStickOnHover classNames="basket_view_detail_popover"*/}
                                                        {/*                     placement="bottom"*/}
                                                        {/*                     children={<h4 className="basket_item_details">{t("View Details")}</h4>}*/}
                                                        {/*                     component={*/}
                                                        {/*                         <div className="basket_item_title_container">*/}
                                                        {/*                             <GetMeasurementArray modelId={`${SewingModelId}`} cartValues={temp}/>*/}
                                                        {/*                         </div>*/}
                                                        {/*                     }/>*/}
                                                        {/*<Dropdown autoClose="outside" title="" align={pageLanguage === "fa" ? "end" : "start"}>*/}
                                                        {/*    <Dropdown.Toggle className="basket_item_title_dropdown_btn">*/}
                                                        {/*        <h4 className="basket_item_details">{t("View Details")}</h4>*/}
                                                        {/*        <img className="select_control_handle_close img-fluid" src={require('../Images/public/arrow_down.svg').default}*/}
                                                        {/*             alt=""/>*/}
                                                        {/*    </Dropdown.Toggle>*/}
                                                        {/*    <Dropdown.Menu className="basket_item_title_dropdown">*/}
                                                        {/*        <div className="basket_item_title_container">*/}
                                                        {/*            <GetMeasurementArray modelId={`${SewingModelId}`} cartValues={temp}/>*/}
                                                        {/*        </div>*/}
                                                        {/*    </Dropdown.Menu>*/}
                                                        {/*</Dropdown>*/}
                                                        <h4 className="basket_measurement_accordion_container">
                                                            <Accordion>
                                                                <Accordion.Item eventKey="0">
                                                                    <ContextAwareToggleViewDetails eventKey="0" textOnHide={t("View Details")} textOnShow={t("Hide Details")}/>
                                                                    <Accordion.Body className="basket_item_title_dropdown dk_curtain_preview_dropdown">
                                                                        <div className="basket_item_title_container">
                                                                            <GetMeasurementArray modelId={`${SewingModelId}`} cartValues={temp}/>
                                                                        </div>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>
                                                            </Accordion>
                                                        </h4>
                                                    </div>;
                                                resolve();
                                            }).catch(() => {
                                                resolve();
                                            });
                                        } else {
                                            resolve();
                                        }
                                    } else if (tempObj["apiLabel"] === "WindowHeight" && tempObj["measurements"]) {
                                        resolve();
                                    } else {
                                        if (tempObj["title"] !== "" && tempObj["lang"].indexOf(pageLanguage) > -1) {
                                            let objLabel = "";
                                            let apiValue = obj[tempObj["apiLabel"]] === null ? "null" : obj[tempObj["apiLabel"]].toString();
                                            if (tempObj["apiLabel"] === "ControlType" && obj["ControlType"] === "Motorized") {
                                                objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${t(obj[key].toString())} / ${t(obj["MotorType"].toString())}`).toString() : `${t(obj[key].toString())} / ${t(obj["MotorType"].toString())}`;
                                            } else if (tempObj["titleValue"] === null) {
                                                if (tempObj["titlePostfix"] === "") {
                                                    objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${t(apiValue.toString())}`).toString() : t(apiValue.toString());
                                                } else {
                                                    objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${apiValue}`).toString() + t(tempObj["titlePostfix"]) : apiValue.toString() + t(tempObj["titlePostfix"]);
                                                }
                                            } else {
                                                if (tempObj["titleValue"][apiValue.toString()] === null) {
                                                    if (tempObj["titlePostfix"] === "") {
                                                        objLabel = t(apiValue.toString());
                                                    } else {
                                                        objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${apiValue}`).toString() + t(tempObj["titlePostfix"]) : apiValue.toString() + t(tempObj["titlePostfix"]);
                                                    }
                                                } else {
                                                    objLabel = t(tempObj["titleValue"][apiValue.toString()]);
                                                }
                                            }
                                            desc[tempObj["order"]] =
                                                <div className="basket_item_title_desc" key={key}>
                                                    <h3>{t(tempObj["title"])}&nbsp;</h3>
                                                    <h4>{objLabel}</h4>
                                                </div>;
                                            resolve();
                                        } else {
                                            resolve();
                                        }
                                    }
                                });
                            });
                            
                            Promise.all(promiseArr2).then(() => {
                                temp[tempDrapery.length-index-1] =
                                    <li className="drapery_basket_item" key={index} ref={ref => (draperyRef.current[index] = ref)}>
                                        <span className="basket_item_title">
                                            <div className="basket_item_image_container">
                                                <img src={`https://api.atlaspood.ir/${photoUrl}`} alt="" className="basket_item_img"/>
                                            </div>
                                            <div className="basket_item_title_container">
                                                <div
                                                    className="basket_item_title_name">{pageLanguage === 'fa' ? convertToPersian(defaultModelNameFa) + " سفارشی " : "Custom " + defaultModelName}</div>
                                                {SewingModelId === "0326" &&
                                                    <div className="basket_item_title_desc">
                                                        <h3>{pageLanguage === 'fa' ? "پارچه/رنگ" : "Fabric/Color"}&nbsp;</h3>
                                                        <h4>
                                                            <div className={`dk_curtain_preview_container`}>
                                                                <Accordion>
                                                                    <Accordion.Item eventKey="0">
                                                                        <ContextAwareToggleViewDetails eventKey="0" textOnHide={t("View Details")} textOnShow={t("Hide Details")}/>
                                                                        <Accordion.Body className="basket_item_title_dropdown dk_curtain_preview_dropdown">
                                                                            <div className="dk_curtain_preview_detail_container">
                                                                                {obj["CurtainArr"].map((item, i) =>
                                                                                    <div key={i}
                                                                                         className="dk_curtain_preview_detail">
                                                                                        <h2>{pageLanguage === 'en' ? ("VANE " + (+i + +1) + ":") : (" شال" + NumberToPersianWord.convertEnToPe(`${+i + +1}`) + ":")}</h2>
                                                                                        <h3>&nbsp;{(pageLanguage === 'en' ? CapitalizeAllWords(item["DesignEnName"]) : item["DesignName"]).toString() + " / " + (pageLanguage === 'en' ? CapitalizeAllWords(item["ColorEnName"]) : item["ColorName"]).toString()}</h3>
                                                                                    </div>)}
                                                                            </div>
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                </Accordion>
                                                            </div>
                                                        </h4>
                                                    </div>
                                                }
                                                {SewingModelId === "0325" &&
                                                    <div className="basket_item_title_desc">
                                                        <h3>{t("dualRoller_step1")}&nbsp;</h3>
                                                        <h4>{pageLanguage === 'fa' ? obj["FabricDesignFa"] + " / " + obj["FabricColorFa"] : obj["FabricDesignEn"] + " / " + obj["FabricColorEn"]}</h4>
                                                    </div>
                                                }
                                                {SewingModelId === "0325" &&
                                                    <div className="basket_item_title_desc">
                                                        <h3>{t("dualRoller_step2")}&nbsp;</h3>
                                                        <h4>{pageLanguage === 'fa' ? obj["FabricDesignFa2"] + " / " + obj["FabricColorFa2"] : obj["FabricDesignEn2"] + " / " + obj["FabricColorEn2"]}</h4>
                                                    </div>
                                                }
                                                {desc}
                                                <div className="basket_item_title_desc">
                                                    <h3>{pageLanguage === 'fa' ? "نام اتاق" : "Room Label"}&nbsp;</h3>
                                                    <h4>{pageLanguage === 'fa' ? roomNameFa + (WindowName === "" ? "" : " / " + WindowName) : roomName + (WindowName === "" ? "" : " / " + WindowName)}</h4>
                                                </div>
                                                <div className="basket_item_desc_button">
                                                    <Link className="btn basket_desc_button"
                                                          to={"/" + pageLanguage + JSON.parse(JSON.stringify(UserProjects))[obj["SewingModelId"]]["route"] + (obj["SpecialId"] ? "/"+obj["SpecialId"] : "") + "/Bag-Projects/" + index + "/Page-ID/" + obj["PageId"]}>{t("EDIT")}</Link>
                                                    <button className="basket_desc_button" onClick={() => copyItem(index,obj["PageId"],obj["SpecialId"])}>{t("COPY")}</button>
                                                </div>
                                                {zipcode &&
                                                    <div className="basket_zipcode_container">
                                                        <div className="basket_zipcode_left">
                                                            <h1 className="basket_zipcode_title">{t("basket_zipcode_text1")}</h1>
                                                            {(zipcodeId===-1 || zipcodeId!==index) &&
                                                                <div className="basket_zipcode_change_container">
                                                                    <h2 className="basket_zipcode_title2">{t("basket_zipcode_text3")}{zipcode}&nbsp;|&nbsp;</h2>
                                                                    <h2 className="basket_zipcode_title3 text_underline" onClick={()=>setZipcodeId(index)}>{t("Change")}</h2>
                                                                </div>
                                                            }
                                                            {zipcodeId===index &&
                                                                <div className="basket_zipcode_change_input_container">
                                                                    <input className="zipcode_input form-control" type="text" name="zipcode_input" defaultValue={zipcodeAll}
                                                                           placeholder={t("Enter Zip Code")} onChange={(e) => {
                                                                        setZipcodeAll(e.target.value.replace(/\D+/g, ''));
                                                                    }}/>
                                                                    <button className="zipcode_input_button white_btn"
                                                                            onClick={() => {
                                                                                setZipcodeButton(true);
                                                                            }}>
                                                                        {t("Update")}
                                                                    </button>
                                                                </div>
                                                            }
                                                            {zipcodeId===index && hasInstall===false &&
                                                                <h3 className="basket_zipcode_err">{t("basket_zipcode_err")}</h3>
                                                            }
                                                            <button className="basket_zipcode_btn text_underline" onClick={() => removeZipcode(index)}>{t("Remove")}</button>
                                                        </div>
                                                        <div className="basket_zipcode_right">
                                                            <h2 className="basket_zipcode_price">{GetPrice(obj["InstallAmount"], pageLanguage, t("TOMANS"))}</h2>
                                                        </div>
                                                        <div className="basket_zipcode_bottom">
                                                            {/*<div className="basket_zipcode_img_container">*/}
                                                            {/*    <img src={require('../Images/public/no_image.svg').default} className="img-fluid" alt=""/>*/}
                                                            {/*</div>*/}
                                                            <div className="basket_zipcode_desc_container">
                                                                <h2 className="basket_zipcode_desc_text">{t("basket_zipcode_text2")}
                                                                    {/*<button className="basket_zipcode_desc_btn text_underline">{t("How It Works")}</button>*/}
                                                                </h2>
                                                                {/*<div className="basket_zipcode_desc_btn_container">*/}
                                                                {/*    <button className="basket_zipcode_desc_btn text_underline">{t("How It Works")}</button>*/}
                                                                {/*    <span/>*/}
                                                                {/*    <button className="basket_zipcode_desc_btn text_underline">{t("Terms Apply")}</button>*/}
                                                                {/*</div>*/}
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                <div className="basket_item_delivery_section">
                                                    <div className="basket_item_delivery_avail">
                                                        <h1 className="basket_item_delivery_title">{t("AVAILABILITY")}</h1>
                                                        <h2 className="basket_item_delivery_desc">{zipcode && zipcode !== "" ? t("AVAILABILITY_desc") : t("AVAILABILITY_desc2")}</h2>
                                                    </div>
                                                    <div className="basket_item_delivery_return">
                                                        <h1 className="basket_item_delivery_title">{t("RETURNS")}</h1>
                                                        <h2 className="basket_item_delivery_desc">{t("RETURNS_desc")}<p>{t("Return Policy")}</p></h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </span>
                                        <span
                                            className="basket_item_price">{GetPrice((obj1["Price"]), pageLanguage, t("TOMANS"))}</span>
                                        <span className="basket_item_qty">
                                            <div className="basket_item_qty_numbers">
                                                <button type="text" className="basket_qty_minus" onClick={() => setBasketNumber(index, 0, 0, -1)}><img
                                                    src={require('../Images/public/minus.svg').default} alt="" className="qty_math_icon"/></button>
                                                <input type="text" className="basket_qty_num"
                                                       value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj1["WindowCount"]}`) : obj1["WindowCount"]}
                                                       onChange={(e) => setBasketNumber(index, NumberToPersianWord.convertPeToEn(`${e.target.value}`), 0)} readOnly/>
                                                <button type="text" className="basket_qty_plus" onClick={() => setBasketNumber(index, 0, 0, 1)}><img
                                                    src={require('../Images/public/plus.svg').default}
                                                    alt="" className="qty_math_icon"/></button>
                                            </div>
                                            <div className="basket_item_qty_button">
                                                <button className="basket_button basket_button_remove" onClick={() => setBasketNumber(index, 0, 0)}>{t("X REMOVE")}</button>
                                            </div>
                                            <div className="basket_item_qty_button" onClick={() => saveForLaterBasketProject(index, tempDrapery[index])}>
                                                <button className="basket_button basket_button_edit"><p>+</p>&nbsp;<h4>{t("SAVE TO MY ACCOUNT")}</h4></button>
                                            </div>
                                        </span>
                                        <span className="basket_item_total">{GetPrice(obj1["Price"] * obj1["WindowCount"], pageLanguage, t("TOMANS"))}</span>
                                    </li>;
                                
                                if (index === tempDrapery.length - 1) {
                                    resolve();
                                }
                            });
                        });
                    });
                    
                    promise2.then(() => {
                        setDraperyList(temp);
                        if (localStorage.getItem("cart") !== null) {
                            let cartObjects = JSON.parse(localStorage.getItem("cart"));
                            cartObjects["drapery"] = tempDrapery;
                            localStorage.setItem('cart', JSON.stringify(cartObjects));
                        } else {
                            setCart({});
                        }
                        setSubTotalPrice(draperiesTotalPrice);
                        setInstallPrice(draperiesTotalInstall);
                        setTransportPrice(draperiesTotalTransport);
                        setTotalPrice(draperiesTotalPrice + draperiesTotalInstall + draperiesTotalTransport);
                        setNoShipping(tempNoShip);
                    });
                }).catch(err => {
                    console.log(err);
                });
            } else {
                setDraperyList([]);
                setSubTotalPrice(0);
                setInstallPrice(0);
                setTransportPrice(0);
                setTotalPrice(0);
                setNoShipping(true);
            }
        }
    }
    
    useEffect(() => {
        if (isLoggedIn && Object.keys(loginAwaiting).length) {
            let projectObj = JSON.parse(JSON.stringify(loginAwaiting));
            setLoginAwaiting({});
            GetUserProjectData(projectObj).then((temp) => {
                SaveUserProject([], temp, [temp["uploadedImagesFile"] ? temp["uploadedImagesFile"] : [], temp["uploadedImagesURL"] ? temp["uploadedImagesURL"] : [], temp["uploadedPDFFile"] ? temp["uploadedPDFFile"] : [], temp["uploadedPDFURL"] ? temp["uploadedPDFURL"] : []], projectObj["SewingModelId"], projectObj["Price"], temp["ModelNameEn"], temp["ModelNameFa"], undefined, temp["Accessories"][0]).then((temp2) => {
                    if (temp2) {
                        setCartChanged(cartChanged + 1);
                    } else {
                        console.log("project not saved!");
                        setCartChanged(cartChanged + 1);
                    }
                }).catch((err) => {
                    console.log(err);
                    setCartChanged(cartChanged + 1);
                });
            }).catch(err => {
                console.log(err);
                setCartChanged(cartChanged + 1);
            });
        }
    }, [isLoggedIn]);
    
    useEffect(() => {
        if (!isLoggedIn && !showLogin2 && Object.keys(loginAwaiting).length) {
            if (localStorage.getItem("cart") !== null) {
                let cartObj = JSON.parse(localStorage.getItem("cart"));
                let temp = cartObj["drapery"];
                temp.push(loginAwaiting);
                cartObj["drapery"] = temp;
                localStorage.setItem('cart', JSON.stringify(cartObj));
                setLoginAwaiting({});
            } else {
                let newCartObj = {};
                let newCartArr = [];
                newCartArr[0] = loginAwaiting;
                newCartObj["drapery"] = newCartArr;
                newCartObj["product"] = [];
                newCartObj["swatches"] = [];
                localStorage.setItem('cart', JSON.stringify(newCartObj));
                setLoginAwaiting({});
            }
            setCartChanged(cartChanged + 1);
        }
    }, [showLogin2]);
    
    useEffect(() => {
        getCart();
    }, [cartChanged, location.pathname]);
    
    useEffect(() => {
        if (Object.keys(cart).length !== 0) {
            if (isLoggedIn) {
                if (swatchOnly === undefined) {
                    let draperies = cart["CartDetails"].filter((object1) => {
                        return object1["TypeId"] === 6403;
                    });
                    
                    let swatches = cart["CartDetails"].filter((object1) => {
                        return object1["TypeId"] === 6402;
                    });
                    setSubTotalPrice(cart["TotalAmount"]);
                    setInstallPrice(cart["InstallAmount"]);
                    setTransportPrice(cart["TransportationAmount"]);
                    setTotalPrice(cart["PayableAmount"]);
                    setDrapery(draperies);
                    setDraperyCount(draperies.length);
                    setSwatches(swatches);
                    setSwatchesCount(swatches.length);
                } else if (swatchOnly && swatchOnly === "Swatches") {
                    let swatches = cart["CartDetails"].filter((object1) => {
                        return object1["TypeId"] === 6402;
                    });
                    setSwatches(swatches);
                    setSwatchesCount(swatches.length);
                } else {
                    navigate("/" + pageLanguage);
                }
            } else {
                if (cart["drapery"] === undefined || cart["drapery"].length === 0) {
                    setDrapery([]);
                    setDraperyCount(0);
                } else {
                    setDrapery(cart["drapery"]);
                    setDraperyCount(cart["drapery"].length);
                }
                if (cart["product"] === undefined || cart["product"] === []) {
                    setProduct([]);
                    setProductCount(0);
                } else {
                    setProduct(cart["product"]);
                    setProductCount(cart["product"].length);
                }
                if (cart["swatches"] === undefined || cart["swatches"] === []) {
                    setSwatches([]);
                    setSwatchesCount(0);
                } else {
                    setSwatches(cart["swatches"]);
                    setSwatchesCount(cart["swatches"].length);
                }
            }
        } else {
            setDrapery([]);
            setProduct([]);
            setSwatches([]);
        }
        if (firstRender.current) {
            firstRender.current = false;
        }
        else {
            dispatch({
                type: CartUpdatedTrue,
                payload: {mainCart: cart}
            });
        }
        // console.log(cart);
    }, [JSON.stringify(cart)]);
    
    useEffect(() => {
        renderDraperies();
    }, [drapery]);
    
    useEffect(() => {
        if(zipcodeId!==-1) {
            renderDraperies();
        }
    }, [zipcodeId]);
    
    useEffect(() => {
        if(zipcodeButton) {
            // console.log(zipcodeAll);
            setZipcodeButton(false);
            if(zipcodeAll!=="" && zipcodeId!==-1){
                changeZipcode();
            }
        }
    }, [zipcodeButton]);
    
    useEffect(() => {
        if(hasInstall===false) {
            renderDraperies();
            setHasInstall(null);
        }
    }, [hasInstall]);
    
    useEffect(() => {
        if (isLoggedIn) {
            if (swatches.length) {
                let temp = [];
                let tempTotal = 0;
                let promise2 = new Promise((resolve, reject) => {
                    for (let i = 0; i < swatches.length; i++) {
                        let obj = swatches[i];
                        let CartDetailId = obj["CartDetailId"];
                        let ProductEnName = obj["ProductEnName"];
                        let ProductName = obj["ProductName"];
                        let ProductDesignEnName = obj["ProductDesignEnName"];
                        let ProductDesignName = obj["ProductDesignName"];
                        let ProductColorEnName = obj["ProductColorEnName"];
                        let ProductColorName = obj["ProductColorName"];
                        let photoUrl = obj["PhotoUrl"];
                        let price = obj["PayableAmount"];
                        tempTotal += price;
                        temp[i] =
                            <li className="swatches_basket_item" key={i} ref={ref => (draperyRef.current[CartDetailId] = ref)}>
                                <div className="swatches_item_image_container">
                                    <img src={`https://api.atlaspood.ir/${photoUrl}`} alt="" className="swatches_item_img img-fluid"/>
                                </div>
                                <div className="swatches_item_title_container">
                                    <div className="swatches_item_title_name">{pageLanguage === 'fa' ? ProductDesignName : ProductDesignEnName}</div>
                                    <div className="swatches_item_remove">
                                        <button type="button" className="btn-close" onClick={() => deleteBasketProject(CartDetailId)}/>
                                    </div>
                                </div>
                                <div className="swatches_item_title_name">{pageLanguage === 'fa' ? ProductColorName : ProductColorEnName}</div>
                                <div className="swatches_item_title_price">{price === 0 ? t("Free") : GetPrice(price, pageLanguage, t("TOMANS"))}</div>
                            
                            
                            </li>;
                        if (i === swatches.length - 1) {
                            resolve();
                        }
                    }
                });
                promise2.then(() => {
                    setSwatchesTotalPrice(tempTotal);
                    setSwatchesList(temp);
                    if (swatchOnly && swatchOnly === "Swatches") {
                        setTotalPrice(tempTotal);
                    }
                });
            } else {
                setSwatchesList([]);
            }
        }
    }, [swatches]);
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
        setDraperyList([]);
        setProductList([]);
        setSwatchesList([]);
        sessionStorage.clear();
    }, [location.pathname]);
    
    return (
        <div className={`basket_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            {/*<div className="breadcrumb_container dir_ltr">*/}
            {/*    <Breadcrumb className="breadcrumb">*/}
            {/*        <Breadcrumb.Item linkAs={Link} className="breadcrumb_item" linkProps={{to: "/" + pageLanguage, className: "breadcrumb_item"}}>Home</Breadcrumb.Item>*/}
            {/*        <Breadcrumb.Item linkAs={Link} className="breadcrumb_item" linkProps={{to: location, className: "breadcrumb_item breadcrumb_item_current"}}>Shopping*/}
            {/*            Bag</Breadcrumb.Item>*/}
            {/*    </Breadcrumb>*/}
            {/*</div>*/}
            
            {(draperyCount + productCount + swatchesCount) > 0 &&
                <div className="basket_container">
                    <div className="basket_title_container">
                        <h1 className="basket_title">{t("Shopping Bag")} ({pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${draperyCount + productCount + swatchesCount}`) : draperyCount + productCount + swatchesCount})</h1>
                        <h3 className="basket_title_link" onClick={() => navigate("/" + pageLanguage)}>{t("CONTINUE SHOPPING")}</h3>
                    </div>
                    <div className="basket_flex">
                        <div className="basket_section">
                            {draperyCount > 0 && <div className="drapery_basket">
                                <div className="drapery_basket_header basket_header">
                                    <span className="basket_header_title">{t("MADE TO ORDER")}</span>
                                    <span className="basket_header_price">{t("PRICE")}</span>
                                    <span className="basket_header_qty">{t("QTY")}</span>
                                    <span className="basket_header_total">{t("TOTAL PRICE")}</span>
                                </div>
                                <ul className="drapery_basket_items">
                                    {draperyList}
                                </ul>
                            </div>}
                            {productCount > 0 && <div className="product_basket">
                                <div className="product_basket_header basket_header">
                                    <span className="basket_header_title">PRODUCT</span>
                                    <span className="basket_header_price">PRICE</span>
                                    <span className="basket_header_qty">QTY</span>
                                    <span className="basket_header_total">TOTAL PRICE</span>
                                </div>
                                <ul className="product_basket_items">
                                
                                </ul>
                            </div>}
                            {swatchesCount > 0 && <div className="swatches_basket">
                                <div className="swatches_basket_header basket_header">
                                    <span className="basket_header_title">{t("SWATCHES")}</span>
                                    <span className="basket_header_price"/>
                                    <span className="basket_header_qty"/>
                                    <span className="basket_header_swatches_only">
                                    <div className="arrow_container" onClick={() => navigate("/" + pageLanguage + "/Checkout/Swatches")}>
                                        <span className="swatches_only">{t("Order Swatches Only")}</span>
                                        <span className="arrow_body"><span className="head"/></span>
                                    </div>
                                </span>
                                </div>
                                <div className="swatch_list_container">
                                    <ul className="swatches_basket_items">
                                        {swatchesList}
                                    </ul>
                                    <div className="swatch_price_section">
                                        <span className="total_swatch_price">{swatchesTotalPrice > 0 ? GetPrice(swatchesTotalPrice, pageLanguage, t("TOMANS")) : t("Free")}</span>
                                    </div>
                                </div>
                            </div>}
                        </div>
                        {/*<div className="payment_section">*/}
                        {/*    <div className="payment_price_section">*/}
                        {/*        <h2 className="payment_title">SUMMARY</h2>*/}
                        {/*        <span className="payment_price_detail">*/}
                        {/*            <h3>SHIPPING :</h3>*/}
                        {/*            <h4>--</h4>*/}
                        {/*        </span>*/}
                        {/*        <span className="payment_price_detail">*/}
                        {/*            <h3>SUBTOTAL :</h3>*/}
                        {/*            <h4>$380,000</h4>*/}
                        {/*        </span>*/}
                        {/*        /!*<span className="payment_price_detail">*!/*/}
                        {/*        /!*    <h3>TAX :</h3>*!/*/}
                        {/*        /!*    <h4>--</h4>*!/*/}
                        {/*        /!*</span>*!/*/}
                        {/*        <div className="promo_container">*/}
                        {/*            <input type="text" className="promo_input" placeholder="ENTER PROMO CODE"/>*/}
                        {/*            <div className="promo_button_section">*/}
                        {/*                <button className="promo_submit">APPLY</button>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*        <span className="payment_price_total payment_price_detail">*/}
                        {/*            <h3>TOTAL</h3>*/}
                        {/*            <h4>$380,000</h4>*/}
                        {/*        </span>*/}
                        {/*        <button className="basket_checkout">CHECKOUT NOW</button>*/}
                        {/*    </div>*/}
                        {/*    /!*<div className="payment_promo_section">*!/*/}
                        {/*    /!*    <h2 className="payment_title">HAVE A PROMO CODE?</h2>*!/*/}
                        {/*    /!*    <div className="promo_container">*!/*/}
                        {/*    /!*        <input type="text" className="promo_input" placeholder="PROMO CODE"/>*!/*/}
                        {/*    /!*        <button className="promo_submit"/>*!/*/}
                        {/*    /!*    </div>*!/*/}
                        {/*    /!*</div>*!/*/}
                        {/*    <div className="payment_help_section">*/}
                        {/*        <h2 className="payment_title">NEED HELP?</h2>*/}
                        {/*        <h4 className="payment_help_items">Call us: 98.21.88787878</h4>*/}
                        {/*        <h4 className="payment_help_items">Shipping Information</h4>*/}
                        {/*        <h4 className="payment_help_items">Returns & Exchanges</h4>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                    <div className="go_to_checkout big_basket">
                        <div className="checkout_hidden_section"/>
                        <div className="checkout_button_section">
                        <span className="checkout_payment_price_detail payment_price_detail">
                            <h3>{t("PRODUCT TOTAL")}</h3>
                            <h4>{GetPrice(subTotalPrice, pageLanguage, t("TOMANS"))}</h4>
                        </span>
                            {installPrice > 0 &&
                                <span className="checkout_payment_price_detail payment_price_detail">
                                <h3>{t("INSTALLATION SERVICES")}</h3>
                                <h4>{GetPrice(installPrice, pageLanguage, t("TOMANS"))}</h4>
                            </span>
                            }
                            {transportPrice > 0 &&
                                <span className="checkout_payment_price_detail payment_price_detail">
                                <h3>{t("TRANSPORTATION FEE")}</h3>
                                <h4>{GetPrice(transportPrice, pageLanguage, t("TOMANS"))}</h4>
                            </span>
                            }
                            {(!noShipping || swatches.length > 0) &&
                                <span className="checkout_payment_price_detail payment_price_detail">
                                    <h3>{t("SHIPPING")}</h3>
                                    <h4>{(freeShipPrice - totalPrice) < 0 ? t("FREE") : t("CALCULATED AT NEXT STEP")}</h4>
                                </span>
                            }
                            <span className="checkout_payment_price_detail payment_price_detail">
                                <h3>{t("SUBTOTAL")}</h3>
                                <h4>{GetPrice(totalPrice, pageLanguage, t("TOMANS"))}</h4>
                            </span>
                            <Link to={"/" + pageLanguage + "/Checkout"} className="basket_checkout">{t("CHECKOUT NOW")}</Link>
                            <button className="btn white_btn" onClick={() => modalHandleShow("order_quotation")}>{t("ORDER QUOTATION")}</button>
                        </div>
                    </div>
                
                </div>
            }
            
            {(draperyCount + productCount + swatchesCount) === 0 && !firstBasket &&
                <div className="basket_container">
                    <div className="basket_title_container2">
                        <h1 className="basket_title">{t("basket_empty1")}</h1>
                        <h2 className="basket_title2">{t("basket_empty2")}</h2>
                    </div>
                </div>
            }
            <Modal dialogClassName="zoomModal" show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    {zoomModalHeader}
                </Modal.Header>
                <Modal.Body>
                    {zoomModalBody}
                </Modal.Body>
                <Modal.Footer>
                    <button className=" btn btn-new-dark" onClick={() => setShow(false)}>{t("CONTINUE")}</button>
                </Modal.Footer>
            </Modal>
            <Modal dialogClassName={`bigSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["order_quotation"] === undefined ? false : modals["order_quotation"]} onHide={() =>
                modalHandleClose("order_quotation")}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                </Modal.Body>
                <Modal.Footer>
                    <button className=" btn btn-new-dark" onClick={() => modalHandleClose("order_quotation")}>{t("CONTINUE")}</button>
                </Modal.Footer>
            </Modal>
        </div>
    
    );
}

export default Basket;