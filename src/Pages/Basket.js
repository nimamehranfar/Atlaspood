import React, {useEffect, useRef, useState} from "react";
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
import {LOGIN, LOGOUT} from "../Actions/types";
import Select from "react-dropdown-select";
import CustomControlFiles from "../Components/CustomControlFiles";
import Modal from "react-bootstrap/Modal";
import PopoverStickOnHover from "../Components/PopoverStickOnHover";
import GetMeasurementArray from "../Components/GetMeasurementArray";
import GetUserProjectData from "../Components/GetUserProjectData";
import Dropdown from "react-bootstrap/Dropdown";
import convertToPersian from "../Components/ConvertToPersian";

const baseURLPrice = "https://api.atlaspood.ir/Sewing/GetSewingOrderPrice";
const baseURLGetCart = "https://api.atlaspood.ir/cart/GetAll";
const baseURLEditProject = "https://api.atlaspood.ir/SewingPreorder/Edit";
const baseURLDeleteBasketProject = "https://api.atlaspood.ir/Cart/DeleteItem";
const baseURLSaveForLaterBasketProject = "https://api.atlaspood.ir/Cart/SaveForLater";
const baseURLAddProjectToCart = "https://api.atlaspood.ir/cart/AddSewingPreorder";
const baseURLDeleteFile = "https://api.atlaspood.ir/SewingOrderAttachment/Delete";


function Basket() {
    const {t} = useTranslation();
    const location = useLocation();
    const {swatchOnly} = useParams();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const {isLoggedIn, isRegistered, user, showLogin} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(0);
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
    
    const [show, setShow] = useState(false);
    const [zoomModalHeader, setZoomModalHeader] = useState([]);
    const [zoomModalBody, setZoomModalBody] = useState([]);
    const [files, setFiles] = useState({});
    
    const [modals, setModals] = useState([]);
    
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
    
    function setBasketNumber(refIndex, numValue, type, minusPlus) {
        if (isLoggedIn) {
            let temp = JSON.parse(JSON.stringify(cart))["CartDetails"];
            
            let tempProjectContainer = temp.find(opt => opt["CartDetailId"] === refIndex);
            
            if (Object.keys(tempProjectContainer).length !== 0) {
                let tempProject = tempProjectContainer["SewingPreorder"];
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
                            temp[refIndex]["PreorderText"]["WindowCount"] = temp[refIndex]["Count"];
                            cartObj[typeString] = temp;
                            localStorage.setItem('cart', JSON.stringify(cartObj));
                            setCartChanged(cartChanged + 1);
                        }
                    } else {
                        temp[refIndex]["Count"] = 1;
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
        projectObj["PreorderText"]["WindowCount"] = projectObj["Count"];
        axios.post(baseURLEditProject, projectObj, {
            headers: authHeader()
        })
            .then(() => {
                setCartChanged(cartChanged + 1);
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
        draperyRef.current[refIndex].classList.add("is_loading");
        axios.delete(baseURLDeleteBasketProject, {
            params: {
                detailId: refIndex
            },
            headers: authHeader()
        }).then((response) => {
            if (draperyRef.current[refIndex]) {
                draperyRef.current[refIndex].classList.remove("is_loading");
            }
            setCartChanged(cartChanged + 1);
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
    
    function saveForLaterBasketProject(refIndex) {
        draperyRef.current[refIndex].classList.add("is_loading");
        axios.post(baseURLSaveForLaterBasketProject + "/" + refIndex, {}, {
            headers: authHeader()
        }).then((response) => {
            if (draperyRef.current[refIndex]) {
                draperyRef.current[refIndex].classList.remove("is_loading");
            }
            setCartChanged(cartChanged + 1);
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
    }
    
    function copyItem(indexOrObj) {
        if (isLoggedIn) {
            delete indexOrObj["SewingPreorderId"];
            copyBagObject(indexOrObj);
        } else {
            let tempObj = JSON.parse(JSON.stringify(drapery[indexOrObj]));
            tempObj["qty"] = 1;
            if (localStorage.getItem("cart") !== null) {
                let cartObj = JSON.parse(localStorage.getItem("cart"));
                if (cartObj["drapery"] === undefined)
                    cartObj["drapery"] = [];
                cartObj["drapery"].push(tempObj);
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
    
    function copyBagObject(tempObj) {
        axios.post(baseURLAddProjectToCart, tempObj, {
            headers: authHeader()
        })
            .then(() => {
                setCartChanged(cartChanged + 1);
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
    
    
    useEffect(() => {
        if (isLoggedIn) {
            axios.get(baseURLGetCart, {
                headers: authHeader()
            }).then((response) => {
                setCart(response.data);
            }).catch(err => {
                if (err.response.status === 401) {
                    refreshToken().then((response2) => {
                        if (response2 !== false) {
                            setCartChanged(cartChanged + 1);
                        } else {
                        }
                    });
                }
            });
        } else {
            if (localStorage.getItem("cart") !== null) {
                setCart(JSON.parse(localStorage.getItem("cart")));
            } else {
                setCart({});
            }
        }
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
                    setTotalPrice(cart["TotalAmount"]);
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
                if (cart["drapery"] === undefined || cart["drapery"].length===0) {
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
        }
    }, [cart]);
    
    useEffect(() => {
        if (isLoggedIn) {
            let tempFiles = JSON.parse(JSON.stringify(files));
            let projectData = JSON.parse(JSON.stringify(UserProjects));
            let temp = [];
            let promise2 = new Promise((resolve, reject) => {
                for (let i = 0; i < drapery.length; i++) {
                    let projectDataObj = projectData[drapery[i]["SewingPreorder"]["SewingModelId"]];
                    let desc = [];
                    let projectId = drapery[i]["SewingPreorderId"];
                    drapery[i]["PreorderText"] = {};
                    // let obj={};
                    let obj = drapery[i]["SewingPreorder"]["PreorderText"];
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
                    obj["price"] = drapery[i]["UnitPrice"];
                    
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
                    // let SewingModelId = drapery[i]["SewingPreorder"]["SewingModelId"];
                    obj["price"] = drapery[i]["UnitPrice"];
                    obj["qty"] = drapery[i]["Count"];
                    
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
                                    } else if (tempObj["measurements"]) {
                                        if (firstMeasurements) {
                                            firstMeasurements = false;
                                            GetUserProjectData(drapery[i]["SewingPreorder"], true).then((temp) => {
                                                // console.log(temp,drapery[i]["SewingPreorder"]);
                                                desc[tempObj["order"]] =
                                                    <div className="basket_item_title_desc" key={index}>
                                                        <h3>{t("Measurements")}&nbsp;</h3>
                                                        {/*<PopoverStickOnHover classNames="basket_view_detail_popover"*/}
                                                        {/*                     placement="bottom"*/}
                                                        {/*                     children={<h4 className="basket_item_details">{t("View Details")}</h4>}*/}
                                                        {/*                     component={*/}
                                                        {/*                         <div className="basket_item_title_container">*/}
                                                        {/*                             <GetMeasurementArray modelId={`${SewingModelId}`} cartValues={temp}/>*/}
                                                        {/*                         </div>*/}
                                                        {/*                     }/>*/}
                                                        <Dropdown autoClose="outside" title="" align={pageLanguage === "fa" ? "end" : "start"}>
                                                            <Dropdown.Toggle className="basket_item_title_dropdown_btn">
                                                                <h4 className="basket_item_details">{t("View Details")}</h4>
                                                                <img className="select_control_handle_close img-fluid" src={require('../Images/public/arrow_down.svg').default}
                                                                     alt=""/>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu className="basket_item_title_dropdown">
                                                                <div className="basket_item_title_container">
                                                                    <GetMeasurementArray modelId={`${SewingModelId}`} cartValues={temp}/>
                                                                </div>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>;
                                                resolve();
                                            }).catch(() => {
                                                resolve();
                                            });
                                        } else {
                                            resolve();
                                        }
                                    } else {
                                        let apiValue = obj[tempObj["apiLabel"]] === null ? "null" : obj[tempObj["apiLabel"]].toString();
                                        if (tempObj["titleValue"] === null) {
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
                                            <div className="basket_item_title_name">{pageLanguage === 'fa' ? convertToPersian(defaultModelNameFa) + " سفارشی " : "Custom " + defaultModelName}</div>
                                            {/*<div className="basket_item_title_desc">*/}
                                            {/*    <h3>Fabric Material & Color&nbsp;&nbsp;&nbsp;&nbsp;</h3>*/}
                                            {/*    <h4>{pageLanguage === 'fa' ? fabricDesignFa + " / " + fabricColorFa : fabricDesign + " / " + fabricColor}</h4>*/}
                                            {/*</div>*/}
                                            {desc}
                                            <div className="basket_item_title_desc">
                                                <h3>{pageLanguage === 'fa' ? "نام اتاق" : "Room Label"}&nbsp;</h3>
                                                <h4>{pageLanguage === 'fa' ? roomNameFa + (WindowName === "" ? "" : " / " + WindowName) : roomName + (WindowName === "" ? "" : " / " + WindowName)}</h4>
                                            </div>
                                            <div className="basket_item_desc_button">
                                                <Link className="btn basket_desc_button"
                                                      to={"/" + pageLanguage + JSON.parse(JSON.stringify(UserProjects))[drapery[i]["SewingPreorder"]["SewingModelId"]]["route"] + "/Bag-Projects/" + drapery[i]["SewingPreorderId"]}>{t("EDIT")}</Link>
                                                <button className="basket_desc_button" onClick={() => copyItem(drapery[i]["SewingPreorder"])}>{t("COPY")}</button>
                                            </div>
                                            <div className="basket_item_delivery_section">
                                                <div className="basket_item_delivery_avail">
                                                    <h1 className="basket_item_delivery_title">{t("AVAILABILITY")}</h1>
                                                    <h2 className="basket_item_delivery_desc">{t("AVAILABILITY_desc")}</h2>
                                                </div>
                                                <div className="basket_item_delivery_return">
                                                    <h1 className="basket_item_delivery_title">{t("RETURNS")}</h1>
                                                    <h2 className="basket_item_delivery_desc">{t("RETURNS_desc")}<p>{t("Return Policy")}</p></h2>
                                                </div>
                                            </div>
                                        </div>
                                    </span>
                                    <span
                                        className="basket_item_price">{GetPrice((obj["price"]), pageLanguage, t("TOMANS"))}</span>
                                    <span className="basket_item_qty">
                                        <div className="basket_item_qty_numbers">
                                            <button type="text" className="basket_qty_minus" onClick={() => setBasketNumber(drapery[i]["CartDetailId"], 0, 0, -1)}><img
                                                src={require('../Images/public/minus.svg').default} alt="" className="qty_math_icon"/></button>
                                            <input type="text" className="basket_qty_num"
                                                   value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj["qty"]}`) : obj["qty"]}
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
                                            <button className="basket_button basket_button_edit"><p>+</p>&nbsp;<h4>{t("SAVE FOR LATER")}</h4></button>
                                        </div>
                                    </span>
                                    <span className="basket_item_total">{GetPrice(obj["price"] * obj["qty"], pageLanguage, t("TOMANS"))}</span>
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
                }
            });
            promise2.then(() => {
                setDraperyList(temp);
                setFiles(tempFiles);
            });
        } else {
            if (drapery.length) {
                let tempDrapery = JSON.parse(JSON.stringify(drapery));
                // let cartInfo = JSON.parse(JSON.stringify(CartInfo));
                let temp = [];
                let delArr = [];
                
                let draperiesTotalPrice = 0;
                let promiseArr = [];
                
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
                delArr.forEach(el => {
                    tempDrapery.splice(el, 1);
                });
                Promise.all(promiseArr).then(function (values) {
                    // console.log(values);
                    
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
                            obj["price"] = values[index].data["price"] / obj1["Count"];
                            obj1["price"] = values[index].data["price"] / obj1["Count"];
                            draperiesTotalPrice += values[index].data["price"];
                            
                            let promiseArr2 = [];
                            let firstMeasurements = true;
                            Object.keys(obj).forEach((key, i) => {
                                promiseArr2[index] = new Promise((resolve, reject) => {
                                    let tempObj = userProjects.find(obj => obj["apiLabel"] === key);
                                    if (tempObj === undefined) {
                                        delArr.push(index);
                                        resolve();
                                    } else if (tempObj["measurements"]) {
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
                                                        <Dropdown autoClose="outside" title="" align={pageLanguage === "fa" ? "end" : "start"}>
                                                            <Dropdown.Toggle className="basket_item_title_dropdown_btn">
                                                                <h4 className="basket_item_details">{t("View Details")}</h4>
                                                                <img className="select_control_handle_close img-fluid" src={require('../Images/public/arrow_down.svg').default}
                                                                     alt=""/>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu className="basket_item_title_dropdown">
                                                                <div className="basket_item_title_container">
                                                                    <GetMeasurementArray modelId={`${SewingModelId}`} cartValues={temp}/>
                                                                </div>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>;
                                                resolve();
                                            }).catch(() => {
                                                resolve();
                                            });
                                        } else {
                                            resolve();
                                        }
                                    } else {
                                        if (tempObj["title"] !== "" && tempObj["lang"].indexOf(pageLanguage) > -1) {
                                            let objLabel = "";
                                            let apiValue = obj[tempObj["apiLabel"]] === null ? "null" : obj[tempObj["apiLabel"]].toString();
                                            if (tempObj["titleValue"] === null) {
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
                                
                                temp[index] =
                                    <li className="drapery_basket_item" key={index} ref={ref => (draperyRef.current[index] = ref)}>
                                        <span className="basket_item_title">
                                            <div className="basket_item_image_container">
                                                <img src={`https://api.atlaspood.ir/${photoUrl}`} alt="" className="basket_item_img"/>
                                            </div>
                                            <div className="basket_item_title_container">
                                                <div
                                                    className="basket_item_title_name">{pageLanguage === 'fa' ? convertToPersian(defaultModelNameFa) + " سفارشی " : "Custom " + defaultModelName}</div>
                                                {/*<div className="basket_item_title_desc">*/}
                                                {/*    <h3>Fabric Material & Color&nbsp;&nbsp;&nbsp;&nbsp;</h3>*/}
                                                {/*    <h4>{pageLanguage === 'fa' ? fabricDesignFa + " / " + fabricColorFa : fabricDesign + " / " + fabricColor}</h4>*/}
                                                {/*</div>*/}
                                                {desc}
                                                <div className="basket_item_title_desc">
                                                    <h3>{pageLanguage === 'fa' ? "نام اتاق" : "Room Label"}&nbsp;</h3>
                                                    <h4>{pageLanguage === 'fa' ? roomNameFa + (WindowName === "" ? "" : " / " + WindowName) : roomName + (WindowName === "" ? "" : " / " + WindowName)}</h4>
                                                </div>
                                                <div className="basket_item_desc_button">
                                                    <Link className="btn basket_desc_button"
                                                          to={"/" + pageLanguage + JSON.parse(JSON.stringify(UserProjects))[obj["SewingModelId"]]["route"] + "/Bag-Projects/" + index}>{t("EDIT")}</Link>
                                                    <button className="basket_desc_button" onClick={() => copyItem(index)}>{t("COPY")}</button>
                                                </div>
                                                <div className="basket_item_delivery_section">
                                                    <div className="basket_item_delivery_avail">
                                                        <h1 className="basket_item_delivery_title">{t("AVAILABILITY")}</h1>
                                                        <h2 className="basket_item_delivery_desc">{t("AVAILABILITY_desc")}</h2>
                                                    </div>
                                                    <div className="basket_item_delivery_return">
                                                        <h1 className="basket_item_delivery_title">{t("RETURNS")}</h1>
                                                        <h2 className="basket_item_delivery_desc">{t("RETURNS_desc")}<p>{t("Return Policy")}</p></h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </span>
                                        <span
                                            className="basket_item_price">{GetPrice((obj1["price"]), pageLanguage, t("TOMANS"))}</span>
                                        <span className="basket_item_qty">
                                            <div className="basket_item_qty_numbers">
                                                <button type="text" className="basket_qty_minus" onClick={() => setBasketNumber(index, 0, 0, -1)}><img
                                                    src={require('../Images/public/minus.svg').default} alt="" className="qty_math_icon"/></button>
                                                <input type="text" className="basket_qty_num"
                                                       value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj1["Count"]}`) : obj1["Count"]}
                                                       onChange={(e) => setBasketNumber(index, NumberToPersianWord.convertPeToEn(`${e.target.value}`), 0)} readOnly/>
                                                <button type="text" className="basket_qty_plus" onClick={() => setBasketNumber(index, 0, 0, 1)}><img
                                                    src={require('../Images/public/plus.svg').default}
                                                    alt="" className="qty_math_icon"/></button>
                                            </div>
                                            <div className="basket_item_qty_button">
                                                <button className="basket_button basket_button_remove" onClick={() => setBasketNumber(index, 0, 0)}>{t("X REMOVE")}</button>
                                            </div>
                                            <div className="basket_item_qty_button">
                                                <button className="basket_button basket_button_edit"><p>+</p>&nbsp;<h4>{t("WISHLIST")}</h4></button>
                                            </div>
                                        </span>
                                        <span className="basket_item_total">{GetPrice(obj1["price"] * obj1["Count"], pageLanguage, t("TOMANS"))}</span>
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
                        setTotalPrice(draperiesTotalPrice);
                    });
                }).catch(err => {
                    console.log(err);
                });
            }
            else{
                setTotalPrice(0);
            }
        }
    }, [drapery]);
    
    useEffect(() => {
        if (isLoggedIn) {
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
                    let price = obj["TotalAmount"];
                    tempTotal += price;
                    temp[i] =
                        <li className="swatches_basket_item" key={i} ref={ref => (draperyRef.current[CartDetailId] = ref)}>
                            <div className="swatches_item_image_container">
                                <img src={`https://api.atlaspood.ir/${photoUrl}`} alt="" className="swatches_item_img img-fluid"/>
                            </div>
                            <div className="swatches_item_title_container">
                                <div className="swatches_item_title_name">{pageLanguage === 'fa' ? ProductDesignName : ProductDesignEnName}</div>
                                <div className="swatches_item_remove">
                                    <button type="button" className="btn-close" onClick={() => setBasketNumber(CartDetailId, 0, 0)}/>
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
        }
    }, [swatches]);
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
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
                                    <div className="arrow_container" onClick={()=>navigate("/"+ pageLanguage+"/Checkout/Swatches")}>
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
                            <h3>{t("SUBTOTAL")}</h3>
                            <h4>{GetPrice(totalPrice, pageLanguage, t("TOMANS"))}</h4>
                        </span>
                        <Link to={"/" + pageLanguage + "/Checkout"} className="basket_checkout">{t("CHECKOUT NOW")}</Link>
                        <button className="btn white_btn" onClick={() => modalHandleShow("order_quotation")}>{t("ORDER QUOTATION")}</button>
                    </div>
                </div>
            </div>
            
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