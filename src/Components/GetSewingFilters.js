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

let tempData={
    "0303": {
        "pattern":
            [
                {value: 'Plains', label: 'Plains' , labelFa: 'ساده'},
                {value: 'Pleated', label: 'Pleated' , labelFa: 'پليسه'},
                {value: 'Textures', label: 'Textures' , labelFa: 'بافت ويژه'}
            ],
        "type":
            [
                {value: 'Light Filtering', label: 'Light Filtering' , labelFa: 'روشن'},
                {value: 'Room Darkening', label: 'Room Darkening' , labelFa: 'تاريک'}
            ]
        
    },
    "0324": {
        "pattern":
            [
                {value: 'Plains', label: 'Plains' , labelFa: 'ساده'},
                {value: 'Prints&Patterns', label: 'Prints&Patterns' , labelFa: 'طرحدار'},
                {value: 'Sheers', label: 'Sheers' , labelFa: 'توری'},
                {value: 'Textures', label: 'Textures' , labelFa: 'بافت ويژه'},
                {value: 'Children\'s Designs', label: 'Children\'s Designs' , labelFa: 'بچه گانه'}
            ],
        "type":
            [
                {value: 'Light Filtering', label: 'Light Filtering' , labelFa: 'روشن'},
                {value: 'Room Darkening', label: 'Room Darkening' , labelFa: 'تاريک'}
            ]
        
    },
    "0325": {
        "pattern":
            [
                {value: 'Plains', label: 'Plains' , labelFa: 'ساده'},
                {value: 'Prints&Patterns', label: 'Prints&Patterns' , labelFa: 'طرحدار'},
                {value: 'Sheers', label: 'Sheers' , labelFa: 'توری'},
                {value: 'Textures', label: 'Textures' , labelFa: 'بافت ويژه'},
                {value: 'Children\'s Designs', label: 'Children\'s Designs' , labelFa: 'بچه گانه'}
            ],
        "type":
            [
                {value: 'Light Filtering', label: 'Light Filtering' , labelFa: 'روشن'},
                {value: 'Room Darkening', label: 'Room Darkening' , labelFa: 'تاريک'}
            ]
        
    },
    "0326": {
        "pattern":
            [],
        "type":
            []
        
    },
    "0099": {
        "pattern":
            [],
        "type":
            []
        
    },
}

async function GetSewingFilters(id, modelId) {
    
    if (id === 1) {
        return await new Promise((resolve, reject) => {
            axios.get(baseURLFilterColor).then((response) => {
                let tempObj = {
                    "en": [],
                    "fa": []
                };
                
                let promise2 = new Promise((resolve, reject) => {
                    response.data.sort((a, b) => a["ColorENName"].localeCompare(b["ColorENName"])).forEach((object1, index) => {
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
                    // response.data.forEach((object1, index) => {
                    //     tempObj["en"][index] = {value: object1["BaseTypeDetailId"], label: object1["ENName"]};
                    //     tempObj["fa"][index] = {value: object1["BaseTypeDetailId"], label: object1["FAName"]};
                    //
                    //     if (index === response.data.length - 1) {
                    //         resolve();
                    //     }
                    // });
                    tempData[modelId]["pattern"].forEach((object1, index) => {
                        tempObj["en"][index] = {value: object1["value"], label: object1["label"]};
                        tempObj["fa"][index] = {value: object1["value"], label: object1["labelFa"]};
                        
                        if (index === tempData[modelId]["pattern"].length - 1) {
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
                    // response.data.forEach((object1, index) => {
                    //     tempObj["en"][index] = {value: object1["BaseTypeDetailId"], label: object1["ENName"]};
                    //     tempObj["fa"][index] = {value: object1["BaseTypeDetailId"], label: object1["FAName"]};
                    //
                    //     if (index === response.data.length - 1) {
                    //         resolve();
                    //     }
                    // });
                    tempData[modelId]["type"].forEach((object1, index) => {
                        tempObj["en"][index] = {value: object1["value"], label: object1["label"]};
                        tempObj["fa"][index] = {value: object1["value"], label: object1["labelFa"]};
                        
                        if (index === tempData[modelId]["type"].length - 1) {
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
                            tempObj["en"][index+1] = {value: "Sale", label: "Sale"};
                            tempObj["fa"][index+1] = {value: "Sale", label: "تخفیف دار"};
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