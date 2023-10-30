import React from "react";
import axios from "axios";
import authHeader from "../Services/auth-header";
import {refreshToken} from "../Services/auth.service";
import {useSelector} from "react-redux";
import {LOGIN, LOGOUT} from "../Actions/types";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import UserProjects from "./UserProjects";


const baseURLAddProjectToCart = "https://api.atlaspood.ir/cart/AddSewingOrder";
const baseURLEditProject = "https://api.atlaspood.ir/SewingOrder/Edit";
const baseURLGetCart = "https://api.atlaspood.ir/cart/GetAll";


async function AddProjectToCart(cartValues, SewingModelId, price, ModelNameEn, ModelNameFa, Files, cartProjectIndex, editIndex, navigate, isLoggedIn, customAcc, returnObj) {
    return await new Promise((resolve, reject) => {
        let customPageCart = {};
        let userProjects = JSON.parse(JSON.stringify(UserProjects))[SewingModelId]["data"];
        let temp = JSON.parse(JSON.stringify(cartValues));
        let isCompleted = true;
        // console.log(cartValues, SewingModelId, price, ModelNameEn, ModelNameFa, Files, cartProjectIndex, editIndex, isLoggedIn);
    
        let tempPostObj = {};
        Object.keys(temp).forEach(key => {
            if (temp[key] !== undefined && temp[key] !== null && temp[key] !== "") {
                let tempObj = userProjects.find(obj => obj["cart"] === key);
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
        tempPostObj["SewingOrderDetails"][0]["SewingModelId"] = `${SewingModelId}`;
    
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
        
        tempPostObj["ModelNameEn"] = ModelNameEn;
        tempPostObj["ModelNameFa"] = ModelNameFa;
        // if(tempPostObj["CalcWindowSize"]===false){
        //     if(tempPostObj["Width1"] && tempPostObj["Height1"]) {
        //         tempPostObj["WidthCart"] = tempPostObj["Width1"];
        //         tempPostObj["HeightCart"] = tempPostObj["Height1"];
        //     }
        // }
        
        if(tempPostObj["ZipCode"] && tempPostObj["ZipCode"]!==""){
            tempPostObj["NeedInstall"] = true;
            tempPostObj["InstallAmount"]=tempPostObj["InstallAmount"]?tempPostObj["InstallAmount"]:0;
            tempPostObj["TransportationAmount"]=tempPostObj["TransportationAmount"]?tempPostObj["TransportationAmount"]:0;
        }
        else{
            tempPostObj["NeedInstall"] = false;
            tempPostObj["InstallAmount"]=0;
            tempPostObj["TransportationAmount"]=0;
        }
        
        // tempPostObj["Accessories"] = [];
        // Object.keys(temp).forEach(key => {
        //     if (temp[key] !== undefined && temp[key] !== null && temp[key] !== "") {
        //         let tempObj = userProjects.find(obj => obj["cart"] === key);
        //         if (tempObj) {
        //             if (tempObj["apiAcc"] !== undefined) {
        //                 if (tempObj["apiAcc"] === true && tempObj["apiAccValue"][temp[key]]) {
        //                     tempPostObj["Accessories"].push(tempObj["apiAccValue"][temp[key]]);
        //                 } else {
        //
        //                 }
        //             }
        //         }
        //     }
        // });
        if (customAcc!==undefined && Array.isArray(customAcc) && customAcc.length > 0) {
            tempPostObj["SewingOrderDetails"][0]["Accessories"].push(...customAcc);
        }
        else if(customAcc!==undefined && Object.keys(customAcc).length > 0){
            tempPostObj["SewingOrderDetails"][0]["Accessories"].push(customAcc);
        }
        tempPostObj["SewingOrderDetails"][0]["Accessories"]=tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(n => n);
        tempPostObj["SewingOrderDetails"][1]["Accessories"]=tempPostObj["SewingOrderDetails"][1]["Accessories"].filter(n => n);
        tempPostObj["SewingOrderDetails"][2]["Accessories"]=tempPostObj["SewingOrderDetails"][2]["Accessories"].filter(n => n);
    
        tempPostObj["SewingModelId"] = `${SewingModelId}`;
        tempPostObj["isCompleted"] = isCompleted;
        tempPostObj["WindowCount"] = 1;
        tempPostObj["Count"] = 1;
        tempPostObj["IsActive"] = true;
        tempPostObj["Price"] = price;
        tempPostObj["WindowDescription"] = tempPostObj["WindowName"];
        // tempObj["hasAutomate"] = tempPostObj["hasAutomate"] === undefined ? false : tempPostObj["hasAutomate"];
        
        for (let i = tempPostObj["SewingOrderDetails"].length - 1; i >= 0; i--) {
            if (tempPostObj["SewingOrderDetails"] && tempPostObj["SewingOrderDetails"][i] && tempPostObj["SewingOrderDetails"][i]["FabricId"] === undefined) {
                tempPostObj["SewingOrderDetails"].splice(i, 1);
            }
        }
        
        if (cartProjectIndex && cartProjectIndex !== -1) {
            tempPostObj["SewingOrderId"] = cartProjectIndex;
        }
        if (tempPostObj["SewingOrderId"] && (tempPostObj["SewingOrderId"] === -1 || tempPostObj["SewingOrderId"] === "-1")) {
            delete tempPostObj["SewingOrderId"];
        }
    
        Files[0]=Files[0].filter(x => !!x);
        Files[1]=Files[1].filter(x => !!x);
        Files[2]=Files[2].filter(x => !!x);
        Files[3]=Files[3].filter(x => !!x);
    
        if(Files[0].length+Files[2].length>0){
            tempPostObj["SewingOrderAttachments"]=[];
            Files[0].forEach((obj,index) => {
                tempPostObj["SewingOrderAttachments"].push({
                    "FileUrl": Files[1][index],
                    "UserFileName": obj
                })
            });
            Files[2].forEach((obj,index) => {
                tempPostObj["SewingOrderAttachments"].push({
                    "FileUrl": Files[3][index],
                    "UserFileName": obj
                })
            });
        }
        
        tempPostObj["PreorderText"] = JSON.parse(JSON.stringify(tempPostObj));
    
        if(returnObj){
            resolve(tempPostObj);
        }
        else {
            if (isLoggedIn) {
                // console.log(tempPostObj);
                axios.post(editIndex ? baseURLEditProject : baseURLAddProjectToCart, tempPostObj, {
                    headers: authHeader()
                })
                    .then(() => {
                        axios.get(baseURLGetCart, {
                            headers: authHeader()
                        }).then((response) => {
                            // console.log(response.data ? response.data : {});
                            resolve(response.data ? response.data : {})
                        }).catch(err => {
                                console.log(err);
                            if (err.response && err.response.status === 401) {
                                refreshToken().then((response2) => {
                                    if (response2 !== false) {
                                        resolve(401);
                                    } else {
                                        navigate("/en" + "/User");
                                        reject();
                                    }
                                });
                            } else {
                                resolve(false);
                            }
                        });
                    })
                    .catch(err => {
                                console.log(err);
                            if (err.response && err.response.status === 401) {
                            refreshToken().then((response2) => {
                                if (response2 !== false) {
                                    resolve(401);
                                } else {
                                    reject();
                                }
                            });
                        } else {
                            console.log("project not added to cart");
                            resolve(false);
                        }
                    });
            } else {
                if (localStorage.getItem("cart") === null) {
                    let newCartObj = {};
                    let newCartArr = [];
                    newCartArr[0] = tempPostObj;
                    newCartObj["drapery"] = newCartArr;
                    newCartObj["product"] = [];
                    newCartObj["swatches"] = [];
                    localStorage.setItem('cart', JSON.stringify(newCartObj));
                    customPageCart = newCartObj;
                } else {
                    let cartObj = JSON.parse(localStorage.getItem("cart"));
                    if (cartObj["drapery"] === undefined || cartObj["drapery"].length === 0) {
                        let newCartArr = [];
                        newCartArr[0] = tempPostObj;
                        cartObj["drapery"] = newCartArr;
                        localStorage.setItem('cart', JSON.stringify(cartObj));
                        customPageCart = cartObj;
                    } else {
                        if (cartProjectIndex !== -1) {
                            if (cartObj["drapery"][cartProjectIndex]) {
                                cartObj["drapery"][cartProjectIndex] = tempPostObj;
                                localStorage.setItem('cart', JSON.stringify(cartObj));
                                customPageCart = cartObj;
                            } else {
                                customPageCart = cartObj;
                            }
                        } else {
                            cartObj["drapery"].push(tempPostObj);
                            localStorage.setItem('cart', JSON.stringify(cartObj));
                            customPageCart = cartObj;
                        }
                    }
                }
                resolve(customPageCart);
            }
        }
    });
    
}

export default AddProjectToCart;