import {useSelector} from "react-redux";
import axios from "axios";
import authHeader from "../Services/auth-header";
import {refreshToken} from "../Services/auth.service";

const baseURLHasZipCode = "https://api.atlaspood.ir/Cart/GetAlreadyZipCode";

async function getBasketZipcode(isLoggedIn) {
    return await new Promise((resolve, reject) => {
        if (isLoggedIn) {
            axios.get(baseURLHasZipCode, {
                headers: authHeader()
            }).then((response) => {
                resolve(response.data);
            }).catch(err => {
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
                    resolve(false);
                }
            });
        } else {
            if (localStorage.getItem("cart") !== null) {
                let cartObjects = JSON.parse(localStorage.getItem("cart"));
                let temp = cartObjects["drapery"];
                let promiseArr = [];
                let tempZipcode=null;
                temp.forEach((obj,index) => {
                    promiseArr[index] = new Promise((resolve, reject) => {
                        if (obj["PreorderText"] && obj["PreorderText"]["ZipCode"] && obj["PreorderText"]["ZipCode"] !== "") {
                            tempZipcode=obj["PreorderText"]["ZipCode"];
                            resolve();
                        }
                        else{
                            resolve();
                        }
                    })
                });
                Promise.all(promiseArr).then(() => {
                    resolve(tempZipcode);
                });
            } else {
                resolve(false);
            }
        }
    });
}

export default getBasketZipcode;