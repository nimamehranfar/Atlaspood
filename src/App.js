import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route, Link, Navigate} from "react-router-dom";
import {useSelector} from 'react-redux';

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


function App({t}) {
    const [user1, setuser] = useState({
        pass: "",
        success: false
    });
    const inputsHandler = (e) => {
        setuser({[e.target.name]: e.target.value})
    };
    onsubmit = (event) => {
        event.preventDefault();
        if (user1.pass === "atlas1400") {
            setuser({success: true});
        }
    };
    
    const {isLoggedIn, user, showLogin} = useSelector((state) => state.auth);
    
    useEffect(() => {
        // console.log(isLoggedIn);
    }, [isLoggedIn]);
    
    return (
        <Router>
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
                            <Route path="User" element={isLoggedIn ? <Navigate to="/en/Account"/> :<RegisterLogin/>}/>
                            <Route path="User/Reset/:resetId" element={<Reset/>}/>
                            <Route path="Account" element={isLoggedIn ? <AccountLayout/> : <Navigate to="/en/User"/>}>
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
                            <Route path="User" element={isLoggedIn ? <Navigate to="/fa/Account"/> :<RegisterLogin/>}/>
                            <Route path="User/Reset/:resetId" element={<Reset/>}/>
                            <Route path="Account" element={isLoggedIn ? <AccountLayout/> : <Navigate to="/fa/User"/>}>
                                <Route path="" element={<Settings/>}/>
                                <Route path="Projects" element={<Projects/>}/>
                                <Route path="AddressBook" element={<AddressBook/>}/>
                                <Route path="OrderHistory" element={<OrderHistory/>}/>
                                <Route path="OrderDetails/:orderID" element={<OrderDetails/>}/>
                            </Route>
                        </Route>
                        
                        <Route path="/en" element={<HeaderWithOutlet/>}>
                            <Route path="Curtain/:catID/:modelID" element={<CustomCurtain/>}/>
                        </Route>
                        <Route path="/fa" element={<HeaderWithOutlet/>}>
                            <Route path="Curtain/:catID/:modelID" element={<CustomCurtain/>}/>
                        </Route>
                        
                        <Route path="/en" element={<NoHeaderNoFooter/>}>
                            <Route path="Checkout" element={<Checkout/>}/>
                            <Route path="User/Activate/:activeId" element={<ConfirmEmail/>}/>
                        </Route>
                        <Route path="/fa" element={<NoHeaderNoFooter/>}>
                            <Route path="Checkout" element={<Checkout/>}/>
                            <Route path="User/Activate/:activeId" element={<ConfirmEmail/>}/>
                        </Route>
                        
                        
                        <Route path="/admin/panel" element={<Panel/>}>
                            <Route path="menu" element={<Menu/>}/>
                            <Route path="slideshow" element={<Slideshow/>}/>
                            <Route path="banner" element={<Banner/>}/>
                            <Route path="models" element={<Models/>}/>
                        </Route>
                        <Route
                            path="*"
                            element={<Navigate to="/en"/>}
                        />
                    </Routes>
                    }
                
                </div>
            </div>
        </Router>
    );
}

export default App;
