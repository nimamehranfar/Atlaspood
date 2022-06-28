import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation} from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {func} from "prop-types";
import axios from "axios";
import CartInfo from "../Components/CartInfo";
import NumberToPersianWord from "number_to_persian_word";
import GetPrice from "../Components/GetPrice";

const baseURLGetAllModels = "http://api.atlaspood.ir/SewingModel/GetAll?apiKey=477f46c6-4a17-4163-83cc-29908d";
const baseURLPrice = "http://api.atlaspood.ir/Sewing/GetSewingOrderPrice";


function Basket() {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
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
    const [swatchesCount, setSwatchesCount] = useState(0);
    const [cartChanged, setCartChanged] = useState(0);
    const draperyRef = useRef([]);
    
    function setBasketNumber(refIndex, numValue, type, minusPlus) {
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
                    temp[refIndex]["qty"] = 1;
                    cartObj[typeString] = temp;
                    localStorage.setItem('cart', JSON.stringify(cartObj));
                    setCartChanged(cartChanged + 1);
                } else {
                    if (temp[refIndex]["qty"] + minusPlus <= 0 || temp[refIndex]["qty"] + minusPlus > 10)
                        setBasketNumber(refIndex, temp[refIndex]["qty"] + minusPlus, type);
                    else {
                        temp[refIndex]["qty"] = temp[refIndex]["qty"] + minusPlus;
                        cartObj[typeString] = temp;
                        localStorage.setItem('cart', JSON.stringify(cartObj));
                        setCartChanged(cartChanged + 1);
                    }
                }
            } else {
                // console.log(numValue);
                if (!isNaN(numValue) || numValue === 10 || numValue === "10") {
                    if (parseInt(numValue) > 10) {
                        temp[refIndex]["qty"] = 10;
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
                        temp[refIndex]["qty"] = parseInt(numValue);
                        cartObj[typeString] = temp;
                        localStorage.setItem('cart', JSON.stringify(cartObj));
                        setCartChanged(cartChanged + 1);
                    }
                } else {
                    temp[refIndex]["qty"] = 1;
                    cartObj[typeString] = temp;
                    localStorage.setItem('cart', JSON.stringify(cartObj));
                    setCartChanged(cartChanged + 1);
                }
            }
        }
    }
    
    function copyItem(index) {
        let tempObj = JSON.parse(JSON.stringify(drapery[index]));
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
    
    useEffect(() => {
        if (localStorage.getItem("cart") !== null) {
            setCart(JSON.parse(localStorage.getItem("cart")));
        } else {
            setCart({});
        }
    }, [cartChanged, location.pathname]);
    
    useEffect(() => {
        if (cart["drapery"] === undefined || cart["drapery"] === []) {
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
    }, [cart]);
    
    useEffect(() => {
        if (drapery.length) {
            let tempDrapery = drapery;
            let cartInfo = JSON.parse(JSON.stringify(CartInfo));
            let temp = [];
            let delArr = [];
            
            let draperiesTotalPrice = 0;
            let promiseArr = [];
            
            tempDrapery.forEach((obj, index) => {
                let tempPostObj = {};
                tempPostObj["ApiKey"] = window.$apikey;
                let cartInfo = JSON.parse(JSON.stringify(CartInfo));
                
                Object.keys(obj).forEach(key => {
                    let tempObj = cartInfo.find(obj => obj["cart"] === key);
                    if (tempObj === undefined) {
                        delArr.push(index);
                    } else {
                        if (tempObj["apiLabel"] !== "") {
                            if (tempObj["apiValue"] === null) {
                                tempPostObj[tempObj["apiLabel"]] = obj[key];
                            } else {
                                tempPostObj[tempObj["apiLabel"]] = tempObj["apiValue"][obj[key]];
                            }
                        }
                    }
                });
                tempPostObj["SewingOrderDetails"] = [];
                tempPostObj["SewingOrderDetails"][0] = {};
                tempPostObj["SewingOrderDetails"][0]["CurtainPartId"] = 2303;
                tempPostObj["SewingOrderDetails"][0]["IsLowWrinkle"] = true;
                tempPostObj["SewingOrderDetails"][0]["IsCoverAll"] = true;
                tempPostObj["SewingOrderDetails"][0]["IsAltogether"] = true;
                
                Object.keys(obj).forEach(key => {
                    let tempObj = cartInfo.find(obj => obj["cart"] === key);
                    if (tempObj === undefined) {
                        if (delArr.indexOf(index) <= -1)
                            delArr.push(index);
                    } else {
                        if (tempObj["apiLabel2"] !== undefined) {
                            if (tempObj["apiValue2"] === null) {
                                tempPostObj["SewingOrderDetails"][0][tempObj["apiLabel2"]] = obj[key];
                            } else {
                                tempPostObj["SewingOrderDetails"][0][tempObj["apiLabel2"]] = tempObj["apiValue2"][obj[key]];
                            }
                        }
                    }
                });
                
                tempPostObj["SewingOrderDetails"][0]["Accessories"] = [];
                Object.keys(obj).forEach(key => {
                    if (obj[key] !== null || obj[key] !== "") {
                        let tempObj = cartInfo.find(obj => obj["cart"] === key);
                        if (tempObj["apiAcc"] !== undefined) {
                            if (tempObj["apiAcc"] === true) {
                                tempPostObj["SewingOrderDetails"][0]["Accessories"].push(tempObj["apiAccValue"][obj[key]]);
                            } else {
                            
                            }
                        }
                    }
                });
                tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
                    return el != null;
                });
                
                if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined) {
                    promiseArr[index] = axios.post(baseURLPrice, tempPostObj);
                }
                
            });
            delArr.forEach(el => {
                tempDrapery.splice(el, 1);
            });
            Promise.all(promiseArr).then(function (values) {
                // console.log(values);
                tempDrapery.forEach((obj, index) => {
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
                    let ModelId = obj["ModelId"];
                    obj["price"] = values[index].data["price"];
                    draperiesTotalPrice += obj["price"];
                    
                    Object.keys(obj).forEach(key => {
                        let tempObj = cartInfo.find(obj => obj["cart"] === key);
                        if (tempObj === undefined) {
                            delArr.push(index);
                        } else {
                            if (tempObj["title"] !== "" && tempObj["lang"].indexOf(pageLanguage) > -1) {
                                let objLabel = "";
                                if (tempObj["titleValue"] === null) {
                                    if (tempObj["titlePostfix"] === "") {
                                        objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${t(obj[key].toString())}`).toString() : t(obj[key].toString());
                                    } else {
                                        objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj[key]}`).toString() + t(tempObj["titlePostfix"]) : obj[key].toString() + t(tempObj["titlePostfix"]);
                                    }
                                } else {
                                    if (tempObj["titleValue"][obj[key].toString()] === null) {
                                        if (tempObj["titlePostfix"] === "") {
                                            objLabel = t(obj[key].toString());
                                        } else {
                                            objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj[key]}`).toString() + t(tempObj["titlePostfix"]) : obj[key].toString() + t(tempObj["titlePostfix"]);
                                        }
                                    } else {
                                        objLabel = t(tempObj["titleValue"][obj[key].toString()]);
                                    }
                                }
                                desc[tempObj["order"]] =
                                    <div className="basket_item_title_desc" key={key}>
                                        <h3>{t(tempObj["title"])}&nbsp;</h3>
                                        <h4>{objLabel}</h4>
                                    </div>
                            }
                        }
                    });
                    
                    temp[index] =
                        <li className="drapery_basket_item" key={index} ref={ref => (draperyRef.current[index] = ref)}>
                        <span className="basket_item_title">
                            <div className="basket_item_image_container">
                                <img src={`http://api.atlaspood.ir/${photoUrl}`} alt="" className="basket_item_img"/>
                            </div>
                            <div className="basket_item_title_container">
                                <div className="basket_item_title_name">{pageLanguage === 'fa' ? defaultModelNameFa + " سفارشی " : "Custom " + defaultModelName}</div>
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
                                    <button className="basket_desc_button">{t("EDIT")}</button>
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
                                className="basket_item_price">{GetPrice((obj["price"] / obj["qty"]), pageLanguage, t("TOMANS"))}</span>
                            <span className="basket_item_qty">
                        <div className="basket_item_qty_numbers">
                            <button type="text" className="basket_qty_minus" onClick={() => setBasketNumber(index, 0, 0, -1)}><img
                                src={require('../Images/public/minus.svg').default} alt="" className="qty_math_icon"/></button>
                            <input type="text" className="basket_qty_num" value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj["qty"]}`) : obj["qty"]}
                                   onChange={(e) => setBasketNumber(index, NumberToPersianWord.convertPeToEn(`${e.target.value}`), 0)} readOnly/>
                            <button type="text" className="basket_qty_plus" onClick={() => setBasketNumber(index, 0, 0, 1)}><img src={require('../Images/public/plus.svg').default}
                                                                                                                                 alt="" className="qty_math_icon"/></button>
                        </div>
                        <div className="basket_item_qty_button">
                            <button className="basket_button basket_button_remove" onClick={() => setBasketNumber(index, 0, 0)}>{t("X REMOVE")}</button>
                        </div>
                        <div className="basket_item_qty_button">
                            <button className="basket_button basket_button_edit"><p>+</p>&nbsp;<h4>{t("WISHLIST")}</h4></button>
                        </div>
                            </span>
                            <span
                                className="basket_item_total">{GetPrice(obj["price"], pageLanguage, t("TOMANS"))}</span>
                        </li>;
                });
                setDraperyList(temp);
                if (localStorage.getItem("cart") !== null) {
                    let cartObjects = JSON.parse(localStorage.getItem("cart"));
                    cartObjects["drapery"] = tempDrapery;
                    localStorage.setItem('cart', JSON.stringify(cartObjects));
                } else {
                    setCart({});
                }
                setTotalPrice(draperiesTotalPrice);
                
            }).catch(err => {
                console.log(err);
            });
            
        }
    }, [drapery]);
    
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
                    <h3 className="basket_title_link">{t("CONTINUE SHOPPING")}</h3>
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
                        {swatchesCount > 0 && <div className="samples_basket">
                            <div className="samples_basket_header basket_header">
                                <span className="basket_header_title">SAMPLES</span>
                                <span className="basket_header_price">PRICE</span>
                                <span className="basket_header_qty">QTY</span>
                                <span className="basket_header_total">TOTAL PRICE</span>
                            </div>
                            <ul className="samples_basket_items">
                            
                            </ul>
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
                <div className="go_to_checkout">
                    <div className="checkout_hidden_section"/>
                    <div className="checkout_button_section">
                        <span className="checkout_payment_price_detail payment_price_detail">
                            <h3>{t("SUBTOTAL")}</h3>
                            <h4>{GetPrice(totalPrice, pageLanguage, t("TOMANS"))}</h4>
                        </span>
                        <Link to={"/" + pageLanguage + "/Checkout"} className="basket_checkout">{t("CHECKOUT NOW")}</Link>
                    </div>
                </div>
            </div>
        </div>
    
    );
}

export default Basket;