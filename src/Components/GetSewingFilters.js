import React from "react";
import UserProjects from "./UserProjects";
import axios from "axios";
import authHeader from "../Services/auth-header";


const baseURLFilterColor = "https://api.atlaspood.ir/Color/GetBaseColors";
// const baseURLFilterPattern = "https://api.atlaspood.ir/Sewing/GetModelPatternType";
const baseURLFilterPattern = "https://api.atlaspood.ir/BaseType/GetDesignPattern";
// const baseURLFilterType = "https://api.atlaspood.ir/Sewing/GetModelDesignType";
const baseURLFilterType = "https://api.atlaspood.ir/BaseType/GetDesignType";
const baseURLFilterPrice = "https://api.atlaspood.ir/BaseType/GetPriceLevel";


async function GetSewingFilters(id, modelId) {
    
    if (id === 1) {
        return await new Promise((resolve, reject) => {
            axios.get(baseURLFilterColor).then((response) => {
                let tempObj = {
                    "en": [],
                    "fa": []
                };
                
                let promise2 = new Promise((resolve, reject) => {
                    response.data.forEach((object1, index) => {
                        tempObj["en"][index] = {value: object1["ColorId"], label: object1["ColorENName"]};
                        tempObj["fa"][index] = {value: object1["ColorId"], label: object1["ColorName"]};
                        
                        if (index === response.data.length - 1) {
                            resolve();
                        }
                    });
                });
                promise2.then(() => {
                    resolve(tempObj);
                });
            }).catch(err => {
                resolve({
                    "en": [],
                    "fa": []
                });
            });
        });
    } else if (id === 2) {
        return await new Promise((resolve, reject) => {
            axios.get(baseURLFilterPattern).then((response) => {
                let tempObj = {
                    "en": [],
                    "fa": []
                };
                
                let promise2 = new Promise((resolve, reject) => {
                    response.data.forEach((object1, index) => {
                        tempObj["en"][index] = {value: object1["BaseTypeDetailId"], label: object1["ENName"]};
                        tempObj["fa"][index] = {value: object1["BaseTypeDetailId"], label: object1["FAName"]};
                        
                        if (index === response.data.length - 1) {
                            resolve();
                        }
                    });
                });
                promise2.then(() => {
                    resolve(tempObj);
                });
            }).catch(err => {
                resolve({
                    "en": [],
                    "fa": []
                });
            });
        });
    } else if (id === 3) {
        return await new Promise((resolve, reject) => {
            axios.get(baseURLFilterType).then((response) => {
                let tempObj = {
                    "en": [],
                    "fa": []
                };
                
                let promise2 = new Promise((resolve, reject) => {
                    response.data.forEach((object1, index) => {
                        tempObj["en"][index] = {value: object1["BaseTypeDetailId"], label: object1["ENName"]};
                        tempObj["fa"][index] = {value: object1["BaseTypeDetailId"], label: object1["FAName"]};
                        
                        if (index === response.data.length - 1) {
                            resolve();
                        }
                    });
                });
                promise2.then(() => {
                    resolve(tempObj);
                });
            }).catch(err => {
                resolve({
                    "en": [],
                    "fa": []
                });
            });
        });
    } else {
        return await new Promise((resolve, reject) => {
            axios.get(baseURLFilterPrice).then((response) => {
                let tempObj = {
                    "en": [],
                    "fa": []
                };
                
                let promise2 = new Promise((resolve, reject) => {
                    response.data.forEach((object1, index) => {
                        tempObj["en"][index] = {value: object1["ProductPriceLevelId"], label: object1["LevelEnTitle"]};
                        tempObj["fa"][index] = {value: object1["ProductPriceLevelId"], label: object1["LevelTitle"]};
                        
                        if (index === response.data.length - 1) {
                            resolve();
                        }
                    });
                });
                promise2.then(() => {
                    resolve(tempObj);
                });
            }).catch(err => {
                resolve({
                    "en": [],
                    "fa": []
                });
            });
        });
    }
}

export default GetSewingFilters;