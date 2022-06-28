import React from "react";
import axios from "axios";
import authHeader from "../Services/auth-header";
import UserProjects from "./UserProjects";
import {refreshToken} from "../Services/auth.service";
import {LOGIN, LOGOUT} from "../Actions/types";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const baseURLAddProject = "http://api.atlaspood.ir/SewingPreorder/Add";


function SaveUserProject(depSet, cartValues, sewingModelId, price,ModelNameEn,ModelNameFa) {
    let userProjects = JSON.parse(JSON.stringify(UserProjects))[sewingModelId]["data"];
    let temp = JSON.parse(JSON.stringify(cartValues));
    let navigate = useNavigate();
    const dispatch = useDispatch();
    
    let tempDepSet = [...depSet];
    let tempNewSet = new Set();
    tempDepSet.forEach(dependency => {
        tempNewSet.add(dependency.split('')[0]);
    });
    let isCompleted=!(tempNewSet.size > 0);
    
    let tempPostObj = {};
    tempPostObj["SewingModelId"] = sewingModelId;
    Object.keys(temp).forEach(key => {
        if (temp[key] !== null || temp[key] !== "") {
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
    tempPostObj["price"] = price;
    tempPostObj["isCompleted"] = isCompleted;
    tempPostObj["ModelNameEn"] = ModelNameEn;
    tempPostObj["ModelNameFa"] = ModelNameFa;
    
    let tempObj = {};
    tempObj["Count"] = 1;
    if(tempPostObj["FabricId"]!==undefined)
        tempObj["fabricId"] = tempPostObj["FabricId"];
    tempObj["sewingModelId"] = sewingModelId;
    tempObj["isCompleted"] = isCompleted;
    tempObj["hasAutomate"] = tempPostObj["hasAutomate"]===undefined?false:tempPostObj["hasAutomate"];
    tempObj["preorderText"] = tempPostObj;
    axios.post(baseURLAddProject, tempObj, {
        headers: authHeader()
    })
        .then((response) => {
            return true;
        })
        .catch(err => {if (err.response.status === 401) {
            refreshToken().then((response2) => {
                if (response2 !== false) {
                    localStorage.setItem('user', JSON.stringify(response2.data));
                    dispatch({
                        type: LOGIN,
                        payload: {user: response2.data},
                    });
                    SaveUserProject(depSet, cartValues, sewingModelId, price,ModelNameEn,ModelNameFa);
                } else {
                    if (localStorage.getItem("user") !== null) {
                        localStorage.removeItem("user");
                    }
                    dispatch({
                        type: LOGOUT,
                    });
                    navigate("/en");
                }
            });
        }
            return false;
        });
}

export default SaveUserProject;