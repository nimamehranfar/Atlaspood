import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation} from "react-router-dom";
import GetPrice from "./GetPrice";


function OrderHistory() {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
    }, [location.pathname]);
    
    return (
        <div className={`Account_OrderHistory_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            <div className="Account_settings_section">
                <h1 className="Account_settings_section_title">{t("ORDER HISTORY")}</h1>
                <div className="account_OrderHistory_container">
                    <ul className="order_history_list">
                        <li className="order_history_list_item">
                            <div className="order_history_list_item_header">
                                <p className="order_history_list_item_date">11/26/2020</p>
                            </div>
                            <div className="order_history_list_item_body">
                                <span className="order_history_list_item_order_num">
                                    <h2>{t("ORDER NUMBER")}</h2>
                                    <h3>W8UDJ31</h3>
                                </span>
                                <span className="order_history_list_item_shipped">
                                    <h2>{t("SHIPPED TO")}</h2>
                                    <h3>User</h3>
                                </span>
                                <span className="order_history_list_item_status">
                                    <h2>{t("STATUS")}</h2>
                                    <h3>{t("Shipped")}</h3>
                                </span>
                                <span className="order_history_list_item_qty">
                                    <h2>{t("ITEM TOTAL")}</h2>
                                    <h3>{t("1")}</h3>
                                </span>
                            </div>
                            <div className="order_history_list_item_footer">
                                <div className="order_history_list_item_footer_hidden"/>
                                <span className="order_history_list_item_total_container">
                                    <div className="order_history_list_item_total">
                                        <h2>{t("TOTAL")}</h2>
                                        <h3>{GetPrice(2000000, pageLanguage, t("TOMANS"))}</h3>
                                    </div>
                                </span>
                                <span className="order_history_list_item_btn">
                                    <Link to={"/" + pageLanguage + "/Account/OrderDetails/W8UDJ31"} className="order_details btn btn-new-dark">{t("ORDER DETAILS")}</Link>
                                </span>
                            </div>
                        </li>
                        <li className="order_history_list_item">
                            <div className="order_history_list_item_header">
                                <p className="order_history_list_item_date">11/26/2020</p>
                            </div>
                            <div className="order_history_list_item_body">
                                <span className="order_history_list_item_order_num">
                                    <h2>{t("ORDER NUMBER")}</h2>
                                    <h3>W8UDJ31</h3>
                                </span>
                                <span className="order_history_list_item_shipped">
                                    <h2>{t("SHIPPED TO")}</h2>
                                    <h3>User</h3>
                                </span>
                                <span className="order_history_list_item_status">
                                    <h2>{t("STATUS")}</h2>
                                    <h3>Shipped</h3>
                                </span>
                                <span className="order_history_list_item_qty">
                                    <h2>{t("ITEM TOTAL")}</h2>
                                    <h3>1</h3>
                                </span>
                            </div>
                            <div className="order_history_list_item_footer">
                                <div className="order_history_list_item_footer_hidden"/>
                                <span className="order_history_list_item_total_container">
                                    <div className="order_history_list_item_total">
                                        <h2>{t("TOTAL")}</h2>
                                        <h3>{GetPrice(2000000, pageLanguage, t("TOMANS"))}</h3>
                                    </div>
                                </span>
                                <span className="order_history_list_item_btn">
                                    <Link to={"/" + pageLanguage + "/Account/OrderDetails/W8UDJ31"} className="order_details btn btn-new-dark">{t("ORDER DETAILS")}</Link>
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    
    );
}

export default OrderHistory;