import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route, Link, Navigate} from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';

import Home from "./Pages/Home";
import Panel from "./Pages/Panel";
import Menu from "./Components/Menu"
import Slideshow from "./Components/Slideshow";
import Banner from "./Components/Banner";
import Curtain from "./Pages/Curtain";
import Product from "./Pages/Product";
import HeaderFooter from "./Pages/HeaderFooter";
import Models from "./Components/Models";
import CustomCurtain from "./Pages/CustomCurtain";
import HeaderWithOutlet from "./Pages/HeaderWithOutlet";
import Basket from "./Pages/Basket";
import Checkout from "./Pages/Checkout";
import NoHeaderNoFooter from "./Pages/NoHeaderNoFooter";
import Projects from "./Pages/Projects";
import RegisterLogin from "./Pages/RegisterLogin";
import AccountLayout from "./Pages/AccountLayout";
import Settings from "./Components/Settings";
import AddressBook from "./Components/AddressBook";
import OrderHistory from "./Components/OrderHistory";
import OrderDetails from "./Components/OrderDetails";
import Reset from "./Pages/Reset";
import ConfirmEmail from "./Pages/ConfirmEmail";
import {refreshToken} from "./Services/auth.service";
import {CLEAR_REGISTER, LOGIN, LOGOUT, REGISTER} from "./Actions/types";
import jwt from "jwt-decode";
import PageItems from "./Components/PageItems";


function App({t}) {
    const dispatch = useDispatch();
    const [user1, setuser] = useState({
        pass: "",
        success: false
    });
    const inputsHandler = (e) => {
        setuser({[e.target.name]: e.target.value})
    };
    onsubmit = (event) => {
        event.preventDefault();
        if (user1.pass === "1401atlas") {
            setuser({success: true});
        }
    };
    
    const {isLoggedIn, isRegistered, user, showLogin} = useSelector((state) => state.auth);
    const [showPage, setShowPage] = useState(false);
    const [roles, setRoles] = useState([]);
    
    useEffect(() => {
        // if (isLoggedIn) {
        //     refreshToken().then((response2) => {
        //         if (response2 !== false) {
        //         } else {
        //         }
        //         setShowPage(true);
        //     });
        // }
        // else{
        //     setShowPage(true);
        // }
        setShowPage(true);
    }, []);
    
    useEffect(() => {
        if (isLoggedIn) {
            let tempRoles=jwt(user["access_token"])["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
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
    }, [isLoggedIn]);
    
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (isLoggedIn) {
    //             refreshToken().then((response2) => {
    //                 if (response2 !== false) {
    //                 } else {
    //                 }
    //             });
    //         }
    //         else{
    //         }
    //     }, 180000);
    //
    //     return () => clearInterval(interval);
    // }, []);
    
    useEffect(() => {
        if (isRegistered) {
            setTimeout(() => {
                dispatch({
                    type: CLEAR_REGISTER
                });
            }, 5000);
        }
    }, [isRegistered]);
    
    return (
        <Router>
            {showPage &&
            <div className="App">
                <div className="page_container">
                    {!user1.success &&
                    <form className="mb-3 justify-content-md-center margin_auto" style={{width: "15rem", marginTop: "10rem"}}
                          onSubmit={onsubmit}>
                        <div className="App">
                            <input type="password"
                                   name="pass"
                                   placeholder="Enter password"
                                   onChange={inputsHandler}
                                   className="input-group"
                                   style={{marginBottom: "1rem"}}
                            />
                            <button className="btn btn-primary" type="submit">Submit</button>
                        </div>
                    </form>
                    }
                    {user1.success &&
                    <Routes>
                        <Route path="/en" element={<HeaderFooter/>}>
                            <Route path="" element={<Home/>}/>
                            <Route path="Curtain/:catID" element={<Curtain/>}/>
                            <Route path="Product/:catID" element={<Product/>}/>
                            <Route path="Basket" element={<Basket/>}/>
                            <Route path="Basket/:swatchOnly" element={<Basket/>}/>
                            <Route path="User" element={isRegistered ? <Navigate replace to="/en/Account"/> : (isLoggedIn ? <Navigate to="/en/Account/OrderHistory"/> : <RegisterLogin/>)}/>
                            <Route path="User/NewUser" element={<Navigate replace to="/en/User"/>}/>
                            <Route path="User/Reset/:emailId/:resetId" element={<Reset/>}/>
                            <Route path="Account" element={isLoggedIn ? <AccountLayout/> : <Navigate replace to="/en/User"/>}>
                                <Route path="" element={<Settings/>}/>
                                <Route path="Projects" element={<Projects/>}/>
                                <Route path="AddressBook" element={<AddressBook/>}/>
                                <Route path="OrderHistory" element={<OrderHistory/>}/>
                                <Route path="OrderDetails/:orderID" element={<OrderDetails/>}/>
                            </Route>
                        </Route>
                        <Route path="/fa" element={<HeaderFooter/>}>
                            <Route path="" element={<Home/>}/>
                            <Route path="Curtain/:catID" element={<Curtain/>}/>
                            <Route path="Product/:catID" element={<Product/>}/>
                            <Route path="Basket" element={<Basket/>}/>
                            <Route path="Basket/:swatchOnly" element={<Basket/>}/>
                            <Route path="User" element={isLoggedIn ? <Navigate replace to="/fa/Account"/> : <RegisterLogin/>}/>
                            <Route path="User/NewUser" element={<Navigate replace to="/fa/User"/>}/>
                            <Route path="User/Reset/:emailId/:resetId" element={<Reset/>}/>
                            <Route path="Account" element={isLoggedIn ? <AccountLayout/> : <Navigate replace to="/fa/User"/>}>
                                <Route path="" element={<Settings/>}/>
                                <Route path="Projects" element={<Projects/>}/>
                                <Route path="AddressBook" element={<AddressBook/>}/>
                                <Route path="OrderHistory" element={<OrderHistory/>}/>
                                <Route path="OrderDetails/:orderID" element={<OrderDetails/>}/>
                            </Route>
                        </Route>
                
                        <Route path="/en" element={<HeaderWithOutlet/>}>
                            {/*<Route path="Curtain/:catID/:modelID" element={<CustomCurtain/>}/>*/}
                            <Route path="Curtain/:catID/:modelID/Saved-Projects/:projectId/Page-ID/:websitePageItemId" element={<CustomCurtain/>}/>
                            <Route path="Curtain/:catID/:modelID/:specialID/Saved-Projects/:projectId/Page-ID/:websitePageItemId" element={<CustomCurtain/>}/>
                            <Route path="Curtain/:catID/:modelID/Bag-Projects/:editIndex/Page-ID/:websitePageItemId" element={<CustomCurtain/>}/>
                            <Route path="Curtain/:catID/:modelID/:specialID/Bag-Projects/:editIndex/Page-ID/:websitePageItemId" element={<CustomCurtain/>}/>
                            <Route path="Curtain/:catID/:modelID/Copy-Projects/:editIndex/Page-ID/:websitePageItemId" element={<CustomCurtain/>}/>
                            <Route path="Curtain/:catID/:modelID/:specialID/Bag-Projects/:editIndex/Page-ID/:websitePageItemId" element={<CustomCurtain/>}/>
                            <Route path="Curtain/:catID/:modelID/Page-ID/:websitePageItemId" element={<CustomCurtain/>}/>
                            <Route path="Curtain/:catID/:modelID/:specialID/Page-ID/:websitePageItemId" element={<CustomCurtain/>}/>
                            <Route path="Checkout" element={<Checkout/>}/>
                            <Route path="Checkout/:swatchOnly" element={<Checkout/>}/>
                        </Route>
                        <Route path="/fa" element={<HeaderWithOutlet/>}>
                            {/*<Route path="Curtain/:catID/:modelID" element={<CustomCurtain/>}/>*/}
                            <Route path="Curtain/:catID/:modelID/Saved-Projects/:projectId/Page-ID/:websitePageItemId" element={<CustomCurtain/>}/>
                            <Route path="Curtain/:catID/:modelID/:specialID/Saved-Projects/:projectId/Page-ID/:websitePageItemId" element={<CustomCurtain/>}/>
                            <Route path="Curtain/:catID/:modelID/Bag-Projects/:editIndex/Page-ID/:websitePageItemId" element={<CustomCurtain/>}/>
                            <Route path="Curtain/:catID/:modelID/:specialID/Bag-Projects/:editIndex/Page-ID/:websitePageItemId" element={<CustomCurtain/>}/>
                            <Route path="Curtain/:catID/:modelID/Page-ID/:websitePageItemId" element={<CustomCurtain/>}/>
                            <Route path="Curtain/:catID/:modelID/:specialID/Page-ID/:websitePageItemId" element={<CustomCurtain/>}/>
                            <Route path="Checkout" element={<Checkout/>}/>
                            <Route path="Checkout/:swatchOnly" element={<Checkout/>}/>
                        </Route>
                
                        <Route path="/en" element={<NoHeaderNoFooter/>}>
                            <Route path="User/Activate/:activeId" element={<ConfirmEmail/>}/>
                        </Route>
                        <Route path="/fa" element={<NoHeaderNoFooter/>}>
                            <Route path="User/Activate/:activeId" element={<ConfirmEmail/>}/>
                        </Route>
                
                
                        <Route path="/admin/panel" element={roles.includes("WebsiteAdmin") ? <Panel/> : <Navigate replace to="/en"/>}>
                            <Route path="menu" element={<Menu/>}/>
                            <Route path="slideshow" element={<Slideshow/>}/>
                            <Route path="banner" element={<Banner/>}/>
                            <Route path="models" element={<Models/>}/>
                            <Route path="page-items" element={<PageItems/>}/>
                        </Route>
                        <Route
                            path="*"
                            element={<Navigate replace to="/en"/>}
                        />
                    </Routes>
                    }
        
                </div>
            </div>
            }
        </Router>
    );
}

export default App;
