import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation, useParams} from "react-router-dom";
import GetPrice from "./GetPrice";


function OrderDetails() {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const [orderDetail, setOrderDetail] = useState([]);
    const {orderID} = useParams();
    
    function setOrderDetails(orderNum) {
        let temp = [];
        
        temp.push(
            <div className="order_history_detail_container" key="1">
                <div className="order_history_detail_num_date">
                    <span className="order_history_detail_number">
                        <h2>{t("ORDER NUMBER")}</h2>
                        <h3>{orderNum}</h3>
                    </span>
                    <span className="order_history_detail_date">
                        <h2>{t("ORDER DATE")}</h2>
                        <h3>11/26/2020</h3></span>
                </div>
                <div className="order_history_detail_body">
                    <div className="order_history_detail_body_title_section">
                        <h1 className="order_history_detail_body_title">{t("SHIPPED")}</h1>
                    </div>
                    <div className="order_history_detail_body_shipping_section">
                         <span className="order_history_detail_body_shipping_method">
                             <h2>{t("DELIVERY METHOD")}</h2>
                             <h3>FedEx</h3>
                         </span>
                        <span className="order_history_detail_body_shipping_date">
                            <h2>{t("SHIPPED")}</h2>
                            <h3>11/28/2020</h3>
                        </span>
                        <span className="order_history_detail_body_shipping_btn">
                            <button className="order_history_detail_btn btn btn-new-dark">{t("TRACK IT")}</button>
                        </span>
                    </div>
                    <div className="order_history_detail_body_tracking_section">
                         <span className="order_history_detail_body_tracking">
                             <h2>{t("TRACKING NUMBER")}</h2>
                             <h3 className="text_underline">3257862547525</h3>
                         </span>
                    </div>
                    <div className="order_history_detail_body_item_count_section">
                        <span className="order_history_detail_body_item_count">{t("1")} {t("ITEM")}</span>
                    </div>
                    <div className="order_history_detail_body_item_details_section">
                        <span className="basket_item_title">
                            <div className="basket_item_image_container">
                                <img src="http://api.atlaspood.ir/Content/Images/Product/2021/2021-11-17/90909302/90909302_0303.jpg" alt="" className="basket_item_img"/>
                            </div>
                            <div className="basket_item_title_container">
                                <div className="basket_item_title_name">Custom ZEBRA SHADES</div>
                                <div className="basket_item_title_desc">
                                    <h3>Fabric&nbsp;</h3>
                                    <h4>Catalina</h4>
                                </div>
                                <div className="basket_item_title_desc">
                                    <h3>Color&nbsp;</h3>
                                    <h4>Caramel</h4>
                                </div>
                                <div className="basket_item_title_desc"><h3>Mount Type&nbsp;</h3><h4>Inside</h4></div><div
                                className="basket_item_title_desc"><h3>Width&nbsp;</h3><h4>31cm</h4></div><div
                                className="basket_item_title_desc"><h3>Height&nbsp;</h3><h4>31cm</h4></div><div
                                className="basket_item_title_desc"><h3>Control Type&nbsp;</h3><h4>Continuous Loop</h4></div><div className="basket_item_title_desc"><h3>Control Position&nbsp;</h3><h4>Left</h4></div><div
                                className="basket_item_title_desc"><h3>Chain Length&nbsp;</h3><h4>300cm</h4></div><div className="basket_item_title_desc"><h3>Metal Valance Style&nbsp;</h3><h4>Metal Valance Fabric Insert</h4></div><div
                                className="basket_item_title_desc"><h3>Metal Valance Color&nbsp;</h3><h4>Silver</h4></div><div className="basket_item_title_desc"><h3>Room Label&nbsp;</h3><h4>Family Room</h4></div>
                            </div>
                        </span>
                        <span className="order_history_detail_item_qty_price">
                            <div className="order_history_detail_item_qty_price_hidden"/>
                            <span className="order_history_detail_item_qty">
                                <h2>{t("QTY")}</h2>
                                <h3>{t("1")}</h3>
                            </span>
                            <span className="order_history_detail_item_price">
                                <h2>{t("SUBTOTAL")}</h2>
                                <h3>{GetPrice(2000000, pageLanguage, t("TOMANS"))}</h3>
                            </span>
                        </span>
                    </div>
                    <div className="order_history_detail_body_order_total_section">
                        <span className="order_history_detail_body_order_total">{t("ORDER TOTAL")}</span>
                    </div>
                    <div className="order_history_detail_body_total_info_section">
                        <span className="order_history_detail_body_total_info_shipping">
                            <span className="order_history_detail_body_total_info_shipping_name">
                                <h2>{t("SHIPPING INFO")}</h2>
                                <h3>USER</h3>
                            </span>
                            <div className="order_history_detail_body_total_info_shipping_address">
                                <h3 className="address_list_item_details">Address1</h3>
                                <h3 className="address_list_item_details">City Region</h3>
                                <h3 className="address_list_item_details">Country</h3>
                            </div>
                        </span>
                        <span className="order_history_detail_body_total_info_price">
                            <div className="order_history_detail_body_total_info_price_container">
                                    <h3>{t("SUBTOTAL")}</h3>
                                    <h4>{GetPrice(2000000, pageLanguage, t("TOMANS"))}</h4>
                            </div>
                            <div className="order_history_detail_body_total_info_price_container">
                                    <h3>{t("DISCOUNT")}</h3>
                                    <h4>{GetPrice(225000, pageLanguage, t("TOMANS"))}</h4>
                            </div>
                            <div className="order_history_detail_body_total_info_price_container">
                                    <h3>{t("SHIPPING")}</h3>
                                    <h4>{GetPrice(500000, pageLanguage, t("TOMANS"))}</h4>
                            </div>
                            <div className="order_history_detail_body_total_info_price_container">
                                    <h3>{t("TOTAL")}</h3>
                                    <h4>{GetPrice(5225000, pageLanguage, t("TOMANS"))}</h4>
                            </div>
                        </span>
                    </div>
                    <div className="order_history_detail_body_payment_info_section">
                        <div className="order_history_detail_body_payment_info"><span className="text_underline">{t("PAYMENT INFO")}</span><i className="arrow-back"/></div>
                    </div>
                </div>
            </div>
        );
        
        setOrderDetail(temp);
    }
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
        setOrderDetails(orderID);
    }, [location.pathname]);
    
    return (
        <div className={`Account_OrderHistory_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            <div className="Account_settings_section">
                <div>
                    <h1 className="Account_settings_section_title order_history_detail">ORDER DETAILS</h1>
                    {orderDetail}
                </div>
            </div>
        </div>
    
    );
}

export default OrderDetails;