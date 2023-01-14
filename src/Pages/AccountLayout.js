import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Outlet} from "react-router";
import {LOGIN, LOGOUT} from "../Actions/types";
import {useDispatch} from "react-redux";
import jwt from 'jwt-decode'
import store from "../store";


function AccountLayout() {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    let navigate = useNavigate();
    const dispatch = useDispatch();
    
    
    const [userName, setUserName] = useState("");
    const [roles, setRoles] = useState([]);
    
    function logoutUser(){
        if (localStorage.getItem("user") !== null) {
            localStorage.removeItem("user");
        }
        
        store.dispatch({
            type: LOGOUT,
        });
        navigate("/" + pageLanguage)
    }
    
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
        if (localStorage.getItem("user") !== null)
        {
            let tempObj=JSON.parse(localStorage.getItem("user"));
            setUserName(jwt(tempObj["access_token"])["FirstName"]);
            let tempRoles=jwt(tempObj["access_token"])["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            if(tempRoles && tempRoles.length>0){
                setRoles(tempRoles);
            }
            else{
                setRoles(["User"]);
            }
        }
        else{
            setRoles([]);
        }
        
    }, [location.pathname]);
    
    return (
        <div className={`Account_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            {/*<div className="breadcrumb_container dir_ltr">*/}
            {/*    <Breadcrumb className="breadcrumb">*/}
            {/*        <Breadcrumb.Item linkAs={Link} className="breadcrumb_item" linkProps={{to: "/" + pageLanguage, className: "breadcrumb_item"}}>Home</Breadcrumb.Item>*/}
            {/*        <Breadcrumb.Item linkAs={Link} className="breadcrumb_item"*/}
            {/*                         linkProps={{to: location, className: "breadcrumb_item breadcrumb_item_current"}}>Account</Breadcrumb.Item>*/}
            {/*    </Breadcrumb>*/}
            {/*</div>*/}
            <div className="Account_layout_container">
                <div className="account_sidebar">
                    <h2 className="hello_name">{t("Hello")} {userName}</h2>
                    <ul className="account_sidebar_list">
                        <li className="account_sidebar_list_item"><Link to={"/" + pageLanguage + "/Account/Projects"}>{t("MY PROJECTS")}</Link></li>
                        <li className="account_sidebar_list_item"><Link to={"/" + pageLanguage + "/Account/OrderHistory"}>{t("ORDER HISTORY")}</Link></li>
                        <li className="account_sidebar_list_item"><Link to={"/" + pageLanguage + "/Account/AddressBook"}>{t("ADDRESS BOOK")}</Link></li>
                        <li className="account_sidebar_list_item"><Link to={"/" + pageLanguage + "/Account"}>{t("FAVORITES")}</Link></li>
                        <li className="account_sidebar_list_item"><Link to={"/" + pageLanguage + "/Account"}>{t("ACCOUNT SETTINGS")}</Link></li>
                        <li className="account_sidebar_list_item"><Link to={"/" + pageLanguage + "/Account"}>{t("GIFT CART")}</Link></li>
                        <li className="account_sidebar_list_item"><Link to={"/" + pageLanguage + "/Account"}>{t("MY REWARDS")}</Link></li>
                        {roles.includes("WebsiteAdmin") &&<li className="account_sidebar_list_item"><Link to={"/admin/panel"}>{t("WEBSITE PANEL")}</Link></li>}
                    </ul>
                    <button className="account_logout" onClick={()=>logoutUser()}>{t("LOG OUT")}</button>
                </div>
                <div className="account_outlet">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
}

export default AccountLayout;