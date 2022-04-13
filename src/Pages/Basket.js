import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation} from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {func} from "prop-types";
import axios from "axios";
import CartInfo from "../Components/CartInfo";
import NumberToPersianWord from "number_to_persian_word";

const baseURLGetAllModels = "http://atlaspood.ir/api/SewingModel/GetAll?apiKey=477f46c6-4a17-4163-83cc-29908d";


function Basket() {
    const {t} = useTranslation();
    const [pageLanguage, setPageLanguage] = React.useState("");
    const location = useLocation();
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
                if (numValue > 10) {
                    temp[refIndex]["qty"] = 10;
                    cartObj[typeString] = temp;
                    localStorage.setItem('cart', JSON.stringify(cartObj));
                    setCartChanged(cartChanged + 1);
                    
                } else if (numValue <= 0) {
                    temp.splice(refIndex, 1);
                    cartObj[typeString] = temp;
                    localStorage.setItem('cart', JSON.stringify(cartObj));
                    setCartChanged(cartChanged + 1);
                } else {
                    temp[refIndex]["qty"] = numValue;
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
            let cartInfo = JSON.parse(JSON.stringify(CartInfo));
            let temp = [];
            
            drapery.forEach((obj, index) => {
                let fabricColorFa = obj["FabricColorFa"];
                let fabricColor = obj["FabricColorEn"];
                let fabricDesignFa = obj["FabricDesignFa"];
                let fabricDesign = obj["FabricDesignEn"];
                let defaultModelNameFa = obj["ModelNameFa"];
                let defaultModelName = obj["ModelNameEn"];
                let roomNameFa = obj["RoomNameFa"];
                let roomName = obj["RoomNameEn"];
                let WindowName = obj["WindowName"]===undefined?"":obj["WindowName"];
                let photoUrl = obj["PhotoUrl"];
                
                // const desc = Object.entries(obj).map(([key, value]) => {
                //     if (doNotShow.indexOf(key) > -1)
                //         return null;
                //     else {
                //         return (
                //             <div className="basket_item_title_desc" key={key}>
                //                 <h3>{key}&nbsp;</h3>
                //                 <h4>{value.toString()}</h4>
                //             </div>
                //         );
                //     }
                // });
                
                let desc = [];
                Object.keys(obj).forEach(key => {
                    let tempObj = cartInfo.find(obj => obj["cart"] === key);
                    if (tempObj["title"] !== "" && tempObj["lang"].indexOf(pageLanguage) > -1) {
                        let objLabel = "";
                        if (tempObj["titleValue"] === null) {
                            if(tempObj["titlePostfix"]===""){
                                objLabel = t(obj[key].toString());
                            }
                            else{
                                objLabel = pageLanguage==="fa"? NumberToPersianWord.convertEnToPe(`${obj[key]}`).toString()+t(tempObj["titlePostfix"]):obj[key].toString()+t(tempObj["titlePostfix"]);
                            }
                        } else {
                            if (tempObj["titleValue"][obj[key].toString()] === null) {
                                if(tempObj["titlePostfix"]===""){
                                    objLabel = t(obj[key].toString());
                                }
                                else{
                                    objLabel = pageLanguage==="fa"? NumberToPersianWord.convertEnToPe(`${obj[key]}`).toString()+t(tempObj["titlePostfix"]):obj[key].toString()+t(tempObj["titlePostfix"]);
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
                });
                
                temp.push(
                    <li className="drapery_basket_item" key={index}>
                    <span className="basket_item_title">
                        <div className="basket_item_image_container">
                            <img src={`http://atlaspood.ir/${photoUrl}`} alt="" className="basket_item_img"/>
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
                                <h4>{pageLanguage === 'fa' ? roomNameFa+ (WindowName===""?"":" / "+WindowName) :roomName+ (WindowName===""?"":" / "+WindowName)}</h4>
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
                        <span className="basket_item_price">{totalPrice.toLocaleString()} {t("TOMANS")}</span>
                        <span className="basket_item_qty">
                        <div className="basket_item_qty_numbers">
                            <button type="text" className="basket_qty_minus" onClick={() => setBasketNumber(index, 0, 0, -1)}>–</button>
                            <input type="number" className="basket_qty_num" value={obj["qty"]} onChange={(e) => setBasketNumber(index, e.target.value, 0)}/>
                            <button type="text" className="basket_qty_plus" onClick={() => setBasketNumber(index, 0, 0, 1)}>+</button>
                        </div>
                        <div className="basket_item_qty_button">
                            <button className="basket_button basket_button_remove" onClick={() => setBasketNumber(index, 0, 0)}>{t("X REMOVE")}</button>
                        </div>
                        <div className="basket_item_qty_button">
                            <button className="basket_button basket_button_edit">{t("+ WISHLIST")}</button>
                        </div>
                    </span>
                        <span className="basket_item_total">{totalPrice.toLocaleString()} {t("TOMANS")}</span>
                    </li>
                );
            });
            setDraperyList(temp);
        }
    }, [drapery]);
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
    }, [location.pathname]);
    
    return (
        <div className={`basket_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            <div className="breadcrumb_container dir_ltr">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item linkAs={Link} className="breadcrumb_item" linkProps={{to: "/" + pageLanguage, className: "breadcrumb_item"}}>Home</Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} className="breadcrumb_item" linkProps={{to: location, className: "breadcrumb_item breadcrumb_item_current"}}>Shopping
                        Bag</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            
            <div className="basket_container">
                <div className="basket_title_container">
                    <h1 className="basket_title">{t("Shopping Bag")} ({draperyCount + productCount + swatchesCount})</h1>
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
                            <h4>{totalPrice.toLocaleString()} {t("TOMANS")}</h4>
                        </span>
                        <button className="basket_checkout">{t("CHECKOUT NOW")}</button>
                    </div>
                </div>
            </div>
        </div>
    
    );
}

export default Basket;