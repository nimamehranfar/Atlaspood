import React, {useState} from "react";
import {BrowserRouter as Router, Routes, Route, Link, Navigate} from "react-router-dom";

import Home from "./Pages/Home";
import Header from "./Components/Header";
import Panel from "./Pages/Panel";
import Menu from "./Components/Menu"
import Slideshow from "./Components/Slideshow";
import Banner from "./Components/Banner";


function App() {
    const [user1, setuser] = useState({
        pass: "",
        success: true
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
                        <Route path="/en" element={<Home/>}/>
                        <Route path="/fa" element={<Home/>}/>
                        <Route path="/admin/panel" element={<Panel/>}>
                            <Route path="menu" element={<Menu/>}/>
                            <Route path="slideshow" element={<Slideshow/>}/>
                            <Route path="banner" element={<Banner/>}/>
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
