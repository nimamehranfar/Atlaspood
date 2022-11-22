import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {func} from "prop-types";
import axios from "axios";
import NumberToPersianWord from "number_to_persian_word";
import GetPrice from "../Components/GetPrice";
import authHeader from "../Services/auth-header";
import UserProjects from "../Components/UserProjects";
// import CartInfo from "../Components/CartInfo";
import {refreshToken} from "../Services/auth.service";
import {LOGIN, LOGOUT} from "../Actions/types";
import {useDispatch} from "react-redux";
import AddProjectToCart from "../Components/AddProjectToCart";
import GetUserProjectData from "../Components/GetUserProjectData";
import Modal from "react-bootstrap/Modal";
import ReactImageMagnify from "@blacklab/react-image-magnify";
import Select from "react-dropdown-select";
import CustomDropdownWithSearch from "../Components/CustomDropdownWithSearch";
import CustomControl from "../Components/CustomControl";
import CustomControlFiles from "../Components/CustomControlFiles";
import convertToPersian from "../Components/ConvertToPersian";

const baseURLGetProjects = "https://api.atlaspood.ir/SewingPreorder/GetAll";
const baseURLEditProject = "https://api.atlaspood.ir/SewingPreorder/Edit";
const baseURLDeleteProject = "https://api.atlaspood.ir/SewingPreorder/Delete";
const baseURLDeleteBasketProject = "https://api.atlaspood.ir/Cart/DeleteItem";
const baseURLPrice = "https://api.atlaspood.ir/Sewing/GetSewingOrderPrice";
const baseURLFreeShipping = "https://api.atlaspood.ir/WebsiteSetting/GetFreeShippingAmount";
const baseURLGetCart = "https://api.atlaspood.ir/cart/GetAll";
const baseURLDeleteFile = "https://api.atlaspood.ir/SewingOrderAttachment/Delete";


function Projects() {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    let navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [userProjects, setUserProjects] = useState([]);
    const [userProjectsRender, setUserProjectsRender] = useState([<h1 key={1} className="no_project">You don't have any saved project yet.</h1>]);
    const [bagProjectObject, setBagProjectObject] = useState({});
    
    
    const [modals, setModals] = useState([]);
    const [files, setFiles] = useState({});
    
    const [show, setShow] = useState(false);
    const [zoomModalHeader, setZoomModalHeader] = useState([]);
    const [zoomModalBody, setZoomModalBody] = useState([]);
    
    const [cartStateAgree, setCartStateAgree] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [cartAgree, setCartAgree] = useState([]);
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [freeShipPrice, setFreeShipPrice] = useState(0);
    const draperyRef = useRef([]);
    
    const projectRef = useRef([]);
    const projectsButtonRef = useRef([]);
    
    function getUserProjects() {
        axios.get(baseURLGetProjects, {
            headers: authHeader()
        }).then((response) => {
            setUserProjects(response.data);
        }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        getUserProjects();
                    } else {
                        navigate("/" + pageLanguage);
                    }
                });
            }
        });
    }
    
    function renderUserProjects() {
        let projectData = JSON.parse(JSON.stringify(UserProjects));
        let tempFiles = JSON.parse(JSON.stringify(files));
        let tempProjectArr = [];
        let promise2 = new Promise((resolve, reject) => {
            for (let i = 0; i < userProjects.length; i++) {
                let projectDataObj = projectData[userProjects[i]["SewingModelId"]];
                let tempArr = [];
                let projectId = userProjects[i]["SewingPreorderId"];
                let uploadedFiles = userProjects[i]["SewingOrderAttachments"];
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
                    let promise1 = new Promise((resolve, reject) => {
                        projectDataObj["data"].forEach((tempObj, index) => {
                            if (tempObj["title"] !== "" && tempObj["lang"].indexOf(pageLanguage) > -1) {
                                let objLabel = "";
                                if ((tempObj["apiLabel"] === "WidthCart" || tempObj["apiLabel"] === "HeightCart") && userProjects[i]["PreorderText"][tempObj["apiLabel"]] === undefined) {
                                    if (userProjects[i]["PreorderText"]["Width1"] || userProjects[i]["PreorderText"]["Width2"] || userProjects[i]["PreorderText"]["Width3"] || userProjects[i]["PreorderText"]["Height1"] || userProjects[i]["PreorderText"]["Height2"] || userProjects[i]["PreorderText"]["Height3"] || userProjects[i]["PreorderText"]["LeftWidthExt"] || userProjects[i]["PreorderText"]["RightWidthExt"] || userProjects[i]["PreorderText"]["HeightOfRodMount"]) {
                                        if (tempObj["apiLabel"] === "WidthCart") {
                                            tempArr[tempObj["order"]] =
                                                <div className="basket_item_title_desc" key={index}>
                                                    <h3>{t("Measurements")}&nbsp;</h3>
                                                    <h4>{t("Almost Complete")}</h4>
                                                </div>;
                                        }
                                    }
                                } else if (userProjects[i]["PreorderText"][tempObj["apiLabel"]] === undefined) {
                                } else {
                                    let apiValue = userProjects[i]["PreorderText"][tempObj["apiLabel"]] === null ? "null" : userProjects[i]["PreorderText"][tempObj["apiLabel"]].toString();
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
                                    tempArr[tempObj["order"]] =
                                        <div className="basket_item_title_desc" key={index}>
                                            <h3>{t(tempObj["title"])}&nbsp;</h3>
                                            <h4>{objLabel}</h4>
                                        </div>;
                                }
                                
                                if (index === projectDataObj["data"].length - 1) {
                                    resolve();
                                }
                            } else {
                                if (index === projectDataObj["data"].length - 1) {
                                    resolve();
                                }
                            }
                            
                        });
                    });
                    
                    promise1.then(() => {
                        tempProjectArr[i] =
                            <li className="drapery_basket_item" key={i} ref={ref => (projectRef.current[projectId] = ref)}>
                            <span className="basket_item_title">
                                 <div className="basket_item_image_container">
                                    <img src={"https://api.atlaspood.ir/" + userProjects[i]["PreorderText"]["PhotoUrl"]} alt="" className="basket_item_img"/>
                                 </div>
                                <div className="basket_item_title_container">
                                <div
                                    className="basket_item_title_name">{pageLanguage === "fa" ? userProjects[i]["PreorderText"]["ModelNameFa"] + " سفارشی " : "Custom " + userProjects[i]["PreorderText"]["ModelNameEn"]}:
                                    <h5>&nbsp;{pageLanguage === 'fa' ? userProjects[i]["PreorderText"]["RoomNameFa"] + (!userProjects[i]["PreorderText"]["WindowName"] ? "" : " / " + userProjects[i]["PreorderText"]["WindowName"]) : userProjects[i]["PreorderText"]["RoomNameEn"] + (!userProjects[i]["PreorderText"]["WindowName"] ? "" : " / " + userProjects[i]["PreorderText"]["WindowName"])}</h5>
                                </div>
                                    {tempArr}
    
                                    <div className="basket_item_title_desc">
                                        <h3>{pageLanguage === 'fa' ? "نام اتاق" : "Room Label"}&nbsp;</h3>
                                        <h4>{pageLanguage === 'fa' ? userProjects[i]["PreorderText"]["RoomNameFa"] + (!userProjects[i]["PreorderText"]["WindowName"] ? "" : " / " + userProjects[i]["PreorderText"]["WindowName"]) : userProjects[i]["PreorderText"]["RoomNameEn"] + (!userProjects[i]["PreorderText"]["WindowName"] ? "" : " / " + userProjects[i]["PreorderText"]["WindowName"])}</h4>
                                    </div>
                                </div>
                            </span>
                                <span
                                    className="basket_item_price">{userProjects[i]["IsCompleted"] ? GetPrice(userProjects[i]["PreorderText"]["price"], pageLanguage, t("TOMANS")) : "---"}</span>
                                <span className="basket_item_qty">
                            <div className="basket_item_qty_numbers">
                                   <button type="text" className="basket_qty_minus" onClick={() => setProjectCount(projectId, 0, -1)}>
                                      <img src={require('../Images/public/minus.svg').default} alt="" className="qty_math_icon"/>
                                   </button>
                                   <input type="text" className="basket_qty_num"
                                          value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${userProjects[i]["Count"]}`) : userProjects[i]["Count"]}
                                          onChange={(e) => setProjectCount(projectId, NumberToPersianWord.convertPeToEn(`${e.target.value}`))}/>
                                   <button type="text" className="basket_qty_plus" onClick={() => setProjectCount(projectId, 0, 1)}>
                                       <img src={require('../Images/public/plus.svg').default} alt="" className="qty_math_icon"/>
                                   </button>
                                </div>
                                <div className="basket_item_qty_button">
                                <button className="basket_button basket_button_remove" onClick={() => setProjectCount(projectId, 0)}>{t("X REMOVE")}</button>
                                </div>
                            </span>
                                <span className="basket_item_total">{userProjects[i]["IsCompleted"] ? GetPrice(userProjects[i]["PreorderText"]["price"] * userProjects[i]["Count"], pageLanguage, t("TOMANS")) : "---"}</span>
                                
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
                                {!userProjects[i]["IsCompleted"] &&
                                <span className="basket_item_btn">
                                        <Link className="projects_add_to_cart_btn btn projects_add_to_cart_btn_long"
                                              to={"/" + pageLanguage + projectDataObj["route"] + "/Saved-Projects/" + userProjects[i]["SewingPreorderId"]}>{t("FINISH CONFIGURING")}</Link>
                                </span>
                                }
                                {userProjects[i]["IsCompleted"] &&
                                <span className="basket_item_btn">
                                        <button className="projects_add_to_cart_btn btn" ref={ref => (projectsButtonRef.current[i] = ref)} onClick={() => {
                                            projectsButtonRef.current[i].disabled = true;
                                            projectsButtonRef.current[i].innerHTML = t("ADDING...");
                                            addProjectToBag(userProjects[i], i)
                                        }}>{t("ADD TO BAG")}</button>
                                        <Link className="projects_edit_btn btn"
                                              to={"/" + pageLanguage + projectDataObj["route"] + "/Saved-Projects/" + userProjects[i]["SewingPreorderId"]}>{t("EDIT")}</Link>
                                </span>
                                }
                                <span className="basket_item_hidden2"/>
                            </li>;
                        if (i === userProjects.length - 1) {
                            resolve();
                        }
                    });
                }
            }
        });
        promise2.then(() => {
            setUserProjectsRender(tempProjectArr);
            setFiles(tempFiles);
        });
        
    }
    
    function setProjectCount(projectId, numValue, minusPlus) {
        let temp = JSON.parse(JSON.stringify(userProjects));
        let tempProject = temp.find(opt => opt["SewingPreorderId"] === projectId);
        
        if (tempProject !== {}) {
            if (minusPlus !== undefined) {
                if (tempProject["Count"] + minusPlus <= 0 || tempProject["Count"] + minusPlus > 10)
                    setProjectCount(projectId, tempProject["Count"] + minusPlus);
                else {
                    tempProject["Count"] = tempProject["Count"] + minusPlus;
                    editProject(tempProject);
                }
            } else {
                if (numValue === "") {
                    tempProject["Count"] = 1;
                    editProject(tempProject);
                } else if (!isNaN(numValue) || numValue === 10 || numValue === "10") {
                    if (parseInt(numValue) > 10) {
                        tempProject["Count"] = 10;
                        editProject(tempProject);
                        
                    } else if (parseInt(numValue) <= 0) {
                        deleteUserProject(projectId);
                    } else {
                        tempProject["Count"] = parseInt(numValue);
                        editProject(tempProject);
                    }
                }
            }
        }
    }
    
    function editProject(projectObj) {
        axios.post(baseURLEditProject, projectObj, {
            headers: authHeader()
        })
            .then(() => {
                getUserProjects();
            }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        editProject(projectObj);
                    } else {
                        navigate("/" + pageLanguage);
                    }
                });
            }
        });
    }
    
    function deleteUserProject(projectId) {
        projectRef.current[projectId].className = "drapery_basket_item is_loading";
        axios.delete(baseURLDeleteProject, {
            params: {
                id: projectId
            },
            headers: authHeader()
        }).then((response) => {
            if (projectRef.current[projectId]) {
                projectRef.current[projectId].className = "drapery_basket_item";
            }
            getUserProjects();
        }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        deleteUserProject(projectId);
                    } else {
                        navigate("/" + pageLanguage);
                    }
                });
            } else {
                if (projectRef.current[projectId]) {
                    projectRef.current[projectId].className = "drapery_basket_item";
                }
            }
        });
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
    
    
    function setBasketNumber(cart, refIndex, numValue, minusPlus) {
        let temp = JSON.parse(JSON.stringify(cart))["CartDetails"];
        let tempProjectContainer = temp.find(opt => opt["CartDetailId"] === refIndex);
        
        if (Object.keys(tempProjectContainer).length !== 0) {
            let tempProject = tempProjectContainer["SewingPreorder"];
            if (minusPlus !== undefined) {
                if (tempProject["Count"] + minusPlus <= 0 || tempProject["Count"] + minusPlus > 10)
                    setBasketNumber(cart, refIndex, tempProject["Count"] + minusPlus);
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
    }
    
    function editBasketProject(projectObj) {
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
    
    function addProjectToBag(projectObj, index) {
        // console.log(projectObj, index);
        setBagProjectObject(projectObj);
        GetUserProjectData(projectObj, true).then((temp) => {
            
            // console.log(temp);
            let userProjects = JSON.parse(JSON.stringify(UserProjects))[projectObj["SewingModelId"]]["data"];
            let tempArr = [];
            let temp1 = [];
            let cartValues = temp;
            let tempPostObj = {};
            let tempBagPrice = 0;
            
            let defaultModelName = projectObj["PreorderText"]["ModelNameEn"];
            let defaultModelNameFa = projectObj["PreorderText"]["ModelNameFa"];
            
            tempPostObj["WindowCount"] = 1;
            tempPostObj["SewingModelId"] = projectObj["SewingModelId"];
            Object.keys(temp).forEach(key => {
                if (temp[key] !== null || temp[key] !== "") {
                    let tempObj = userProjects.find(obj => obj["cart"] === key);
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
            tempPostObj["SewingOrderDetails"][0]["SewingModelId"] = tempPostObj["SewingModelId"];
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
            
            // console.log(tempPostObj,tempPostObj["SewingOrderDetails"][0]["FabricId"]);
            if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined) {
                // console.log(JSON.stringify(tempPostObj));
                axios.post(baseURLPrice, tempPostObj)
                    .then((response) => {
                        tempBagPrice = response.data["price"];
                        temp["price"] = response.data["price"];
                        // console.log(response.data);
                        
                        projectObj["price"] = response.data["price"];
                        projectObj["PreorderText"]["price"] = response.data["price"];
                        setBagProjectObject(projectObj);
                        
                        let roomNameFa = cartValues["RoomNameFa"];
                        let roomName = cartValues["RoomNameEn"];
                        let WindowName = cartValues["WindowName"] === undefined ? "" : cartValues["WindowName"];
                        Object.keys(cartValues).forEach(key => {
                            let tempObj = userProjects.find(obj => obj["cart"] === key);
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
                                <h2 className="cart_agree_title2">{pageLanguage === 'fa' ? convertToPersian(defaultModelNameFa) + " سفارشی " : "Custom " + defaultModelName}</h2>
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
                        setCartStateAgree(true);
                        modalHandleShow("cart_modal");
                        AddProjectToCart(temp, projectObj["SewingModelId"], projectObj["price"], temp["ModelNameEn"], temp["ModelNameFa"], [temp["uploadedImagesFile"]?temp["uploadedImagesFile"]:[], temp["uploadedImagesURL"]?temp["uploadedImagesURL"]:[], temp["uploadedPDFFile"]?temp["uploadedPDFFile"]:[], temp["uploadedPDFURL"]?temp["uploadedPDFURL"]:[]], projectObj["SewingPreorderId"], undefined, navigate, true).then((temp2) => {
                            if (temp2 === 401) {
                                addProjectToBag(projectObj, index);
                            } else if (temp2) {
                                renderCart(temp2);
                                projectsButtonRef.current[index].disabled = false;
                                projectsButtonRef.current[index].innerHTML = t("ADD TO BAG");
                                getUserProjects();
                            } else {
                                console.log("project not added");
                                projectsButtonRef.current[index].disabled = false;
                                projectsButtonRef.current[index].innerHTML = t("ADD TO BAG");
                                getUserProjects();
                            }
                        });
                    }).catch(err => {
                    if (err.response.status === 401) {
                        refreshToken().then((response2) => {
                            if (response2 !== false) {
                                addProjectToBag(projectObj, index);
                            } else {
                                projectsButtonRef.current[index].disabled = false;
                                projectsButtonRef.current[index].innerHTML = t("ADD TO BAG");
                                navigate("/en" + "/User");
                            }
                        });
                    } else {
                        projectsButtonRef.current[index].disabled = false;
                        projectsButtonRef.current[index].innerHTML = t("ADD TO BAG");
                        console.log("project not added");
                    }
                });
            } else {
                projectsButtonRef.current[index].disabled = false;
                projectsButtonRef.current[index].innerHTML = t("ADD TO BAG");
            }
        });
    }
    
    function addToCart_agreed(projectObj) {
        GetUserProjectData(projectObj, true).then((temp) => {
            AddProjectToCart(temp, projectObj["SewingModelId"], projectObj["price"], temp["ModelNameEn"], temp["ModelNameFa"], [temp["uploadedImagesFile"]?temp["uploadedImagesFile"]:[], temp["uploadedImagesURL"]?temp["uploadedImagesURL"]:[], temp["uploadedPDFFile"]?temp["uploadedPDFFile"]:[], temp["uploadedPDFURL"]?temp["uploadedPDFURL"]:[]], projectObj["SewingPreorderId"], undefined, navigate, true).then((temp2) => {
                if (temp2) {
                    renderCart(temp2);
                    setTimeout(() => {
                        // modalHandleShow("cart_modal");
                        setCartStateAgree(true);
                    }, 500);
                } else {
                    console.log("project not added")
                }
            });
        });
    }
    
    function renderCart(customPageCart) {
        let cartObjects = {};
        let promise2 = new Promise((resolve, reject) => {
            if (customPageCart !== undefined) {
                cartObjects = customPageCart;
                // console.log(customPageCart);
                resolve();
            } else {
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
                
            }
        });
        promise2.then(() => {
            let temp1 = [];
            let cartCount = 0;
            cartCount += cartObjects["CartDetails"].length;
            let draperiesTotalPrice = cartObjects["TotalAmount"];
            
            let promise2 = new Promise((resolve, reject) => {
                for (let i = 0; i < cartObjects["CartDetails"].length; i++) {
                    let obj = cartObjects["CartDetails"][i]["SewingPreorder"]["PreorderText"];
                    
                    
                    let roomName = (obj["WindowName"] === undefined || obj["WindowName"] === "") ? "" : " / " + obj["WindowName"];
                    temp1[i] =
                        <li className="custom_cart_item" key={"drapery" + i} ref={ref => (draperyRef.current[cartObjects["CartDetails"][i]["CartDetailId"]] = ref)}>
                            <div className="custom_cart_item_image_container">
                                <img src={`https://api.atlaspood.ir/${obj["PhotoUrl"]}`} alt="" className="custom_cart_item_img img-fluid"/>
                            </div>
                            <div className="custom_cart_item_desc">
                                <div className="custom_cart_item_desc_container">
                                    <h1 className="custom_cart_item_desc_name">{pageLanguage === 'fa' ? obj["ModelNameFa"] + " سفارشی " : "Custom " + obj["ModelNameEn"]}</h1>
                                    <button type="button" className="btn-close" aria-label="Close"
                                            onClick={() => setBasketNumber(cartObjects, cartObjects["CartDetails"][i]["CartDetailId"], 0)}/>
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
                                                onClick={() => setBasketNumber(cartObjects, cartObjects["CartDetails"][i]["CartDetailId"], 0, -1)}>–
                                        </button>
                                        <input type="text" className="basket_qty_num"
                                               value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${cartObjects["CartDetails"][i]["SewingPreorder"]["Count"]}`) : cartObjects["CartDetails"][i]["SewingPreorder"]["Count"]}
                                               onChange={(e) => setBasketNumber(cartObjects, cartObjects["CartDetails"][i]["CartDetailId"], NumberToPersianWord.convertPeToEn(`${e.target.value}`))}/>
                                        <button type="text" className="basket_qty_plus"
                                                onClick={() => setBasketNumber(cartObjects, cartObjects["CartDetails"][i]["CartDetailId"], 0, 1)}>+
                                        </button>
                                    </div>
                                    <p className="custom_cart_item_end_price">{GetPrice(obj["price"], pageLanguage, t("TOMANS"))}</p>
                                </div>
                            </div>
                        </li>;
                    if (i === cartObjects["CartDetails"].length - 1) {
                        resolve();
                    }
                }
            });
            promise2.then(() => {
                setCartItems(temp1);
                setCartCount(cartCount);
                localStorage.removeItem("cart");
                setTotalCartPrice(draperiesTotalPrice);
            });
            if (cartObjects["CartDetails"].length === 0) {
                modalHandleClose("cart_modal");
                setCartStateAgree(false);
            }
            
            
        });
        axios.get(baseURLFreeShipping).then((response) => {
            setFreeShipPrice(response.data);
        }).catch(err => {
            console.log(err);
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
                            let fileName=option[props.labelField].replace(/\.[^/.]+$/, "");
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
                                    <div className="uploaded_name_item_text" onClick={() => showFile(`${option[props.valueField]}`,extension)}>{fileName}</div>
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
    
    let imageExtensionList=["jpg","png","jpeg","jiff","gif","webp"];
    let pdfExtensionList=["pdf"];
    
    function showFile(fileUrl,extension) {
        if(imageExtensionList.indexOf(extension) > -1){
            handleShow(fileUrl);
        }
        else if(pdfExtensionList.indexOf(extension) > -1){
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
        let temp = JSON.parse(JSON.stringify(userProjects));
        let tempProject = temp.find(opt => opt["SewingPreorderId"] === projectId);
        let tempFileIndex = tempProject["SewingOrderAttachments"].findIndex(opt => opt["FileUrl"] === obj.value);
        
        tempProject["SewingOrderAttachments"].splice(tempFileIndex, 1);
        
        editProject(tempProject);
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
        if (userProjects.length) {
            renderUserProjects();
        } else {
            setUserProjectsRender([<h1 key={1} className="no_project">You don't have any saved project yet.</h1>]);
        }
    }, [userProjects]);
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
        getUserProjects();
    }, [location.pathname]);
    
    return (
        <div className={`basket_page_container Project_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            <h1 className="Account_settings_section_title">{t("MY PROJECTS")}</h1>
            <div className="basket_container Projects_container">
                <div className="basket_flex">
                    <div className="basket_section">
                        <div className="drapery_basket">
                            <div className="drapery_basket_header basket_header">
                                <span className="basket_header_title">{t("PROJECT DETAILS")}</span>
                                <span className="basket_header_price">{t("PRICE")}</span>
                                <span className="basket_header_qty">{t("QTY")}</span>
                                <span className="basket_header_total">{t("TOTAL PRICE")}</span>
                            </div>
                            <ul className="drapery_basket_items">
                                {userProjectsRender}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
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
                            addToCart_agreed(bagProjectObject);
                        }}>{t("AGREE & ADD TO BAG")}
                        </button>
                    </div>
                    }
                </Modal.Footer>
            </Modal>
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
        </div>
    );
    
}

export default Projects;