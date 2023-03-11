import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import NumberToPersianWord from "number_to_persian_word";
import {useLocation} from "react-router-dom";


function GetMeasurementArray({modelId, cartValues}) {
    const {t} = useTranslation();
    const location = useLocation();
    // console.log(cartValues);
    const [measurements, setMeasurements] = useState(undefined);
    let pageLanguage = location.pathname.split('').slice(1, 3).join('');
    
    useEffect(() => {
        const NumToFa = (inputText) => {
            return pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(inputText) : inputText;
        };
        if (modelId === "0303" || modelId === "0324" || modelId === "0325") {
            if (cartValues["calcMeasurements"]) {
                if (cartValues["Mount"] === "Inside") {
                    setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                    <span className="cart_agree_measurement_row">
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Width 1")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width1"] ? cartValues["Width1"] : cartValues["Width"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Width 2")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width2"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Width 3")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width3"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Width")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowWidth"] + t("Measurements CM"))}</h2>
                        </div>
                    </span>
                        <span className="cart_agree_measurement_row">
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Height 1")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Height1"] ? cartValues["Height1"] : cartValues["Height"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Height 2")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Height2"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Height 3")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Height3"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Height")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowHeight"] + t("Measurements CM"))}</h2>
                        </div>
                    </span>
                        <span className="cart_agree_measurement_row_bottom">
                        <p className="cart_agree_measurement_row_bottom_left">{t("Shade Dimension= ")}{NumToFa((cartValues["WidthCart"]) + t("Zebra Measurements W") + " \u00d7 " + cartValues["HeightCart"] + t("Zebra Measurements H") + t("Zebra Measurements cm"))}</p>
                        <p className="cart_agree_measurement_row_bottom_right">{t("Zebra Measurements text")}</p>
                    </span>
                    </li>);
                } else if (cartValues["Mount"] === "Outside") {
                    setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                    <span className="cart_agree_measurement_row">
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Window Width")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width3A"] ? cartValues["Width3A"] : cartValues["Width"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Extension(L)")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionLeft"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Extension(R)")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionRight"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Total Width")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowWidth"] + t("Measurements CM"))}</h2>
                        </div>
                    </span>
                        <span className="cart_agree_measurement_row">
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Window Height")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Height3C"] ? cartValues["Height3C"] : cartValues["Height"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Mount")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ShadeMount"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Total Mounting Height")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowHeight"] + t("Measurements CM"))}</h2>
                        </div>
                    </span>
                        <span className="cart_agree_measurement_row_bottom">
                        <p className="cart_agree_measurement_row_bottom_left">{t("Shade Dimension= ")}{NumToFa((cartValues["WidthCart"]) + t("Zebra Measurements W") + " \u00d7 " + cartValues["HeightCart"] + t("Zebra Measurements H") + t("Zebra Measurements cm"))}</p>
                        <p className="cart_agree_measurement_row_bottom_right">{t("Zebra Measurements text")}</p>
                    </span>
                    </li>);
                } else {
                    setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                        <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Window Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width3A"] ? cartValues["Width3A"] : cartValues["Width"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(L)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionLeft"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(R)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionRight"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowWidth"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                        <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 1")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToWindow1"] ? cartValues["CeilingToWindow1"] : cartValues["Height"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 2")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToWindow2"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 3")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToWindow3"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Mounting Height")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowHeight"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                        <span className="cart_agree_measurement_row_bottom">
                            <p className="cart_agree_measurement_row_bottom_left">{t("Shade Dimension= ")}{NumToFa((cartValues["WidthCart"]) + t("Zebra Measurements W") + " \u00d7 " + cartValues["HeightCart"] + t("Zebra Measurements H") + t("Zebra Measurements cm"))}</p>
                            <p className="cart_agree_measurement_row_bottom_right">{t("Zebra Measurements text")}</p>
                        </span>
                    </li>);
                }
            } else {
                setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                    <span className="cart_agree_measurement_row cart_agree_measurement_row_single">
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Width")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowWidth"] + t("Measurements CM"))}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Height")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowHeight"] + t("Measurements CM"))}</h2>
                        </div>
                    </span>
                    <span className="cart_agree_measurement_row_bottom">
                        <p className="cart_agree_measurement_row_bottom_left">{t("Shade Dimension= ")}{NumToFa((cartValues["WidthCart"]) + t("Zebra Measurements W") + " \u00d7 " + cartValues["HeightCart"] + t("Zebra Measurements H") + t("Zebra Measurements cm"))}</p>
                        <p className="cart_agree_measurement_row_bottom_right">{t("Zebra Measurements text")}</p>
                    </span>
                </li>);
            }
        } else if (modelId === "0326") {
            if (cartValues["calcMeasurements"]) {
                if (cartValues["Mount"] === "Inside") {
                    setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                    <span className="cart_agree_measurement_row">
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Width 1")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width1"] ? cartValues["Width1"] : cartValues["Width"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Width 2")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width2"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Width 3")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width3"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Width")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowWidth"] + t("Measurements CM"))}</h2>
                        </div>
                    </span>
                        <span className="cart_agree_measurement_row">
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Height 1")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Height1"] ? cartValues["Height1"] : cartValues["Height"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Height 2")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Height2"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Height 3")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Height3"])}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Height")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowHeight"] + t("Measurements CM"))}</h2>
                        </div>
                    </span>
                        <span className="cart_agree_measurement_row_bottom">
                        <p className="cart_agree_measurement_row_bottom_left">{t("Curtain Dimension= ")}{NumToFa((cartValues["WidthCart"]) + t("Zebra Measurements W") + " \u00d7 " + cartValues["HeightCart"] + t("Zebra Measurements H") + t("Zebra Measurements cm"))}</p>
                    </span>
                    </li>);
                } else if (cartValues["Mount"] === "HiddenMoulding") {
                    if (cartValues["FinishedLengthType"] === "Sill") {
                        setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                            <span className="cart_agree_measurement_row">
                                <div className="cart_agree_measurement_row_section">
                                    <h1 className="cart_agree_item_title">{t("Window Width")}</h1>
                                    <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width2B"] ? cartValues["Width2B"] : cartValues["Width"])}</h2>
                                </div>
                                <div className="cart_agree_measurement_row_section">
                                    <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                    <h2 className="cart_agree_item_desc"/>
                                </div>
                                <div className="cart_agree_measurement_row_section">
                                    <h1 className="cart_agree_item_title">{t("Extension(L)")}</h1>
                                    <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionLeft"])}</h2>
                                </div>
                                <div className="cart_agree_measurement_row_section">
                                    <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                    <h2 className="cart_agree_item_desc"/>
                                </div>
                                <div className="cart_agree_measurement_row_section">
                                    <h1 className="cart_agree_item_title">{t("Extension(R)")}</h1>
                                    <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionRight"])}</h2>
                                </div>
                                <div className="cart_agree_measurement_row_section">
                                    <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                    <h2 className="cart_agree_item_desc"/>
                                </div>
                                <div className="cart_agree_measurement_row_section">
                                    <h1 className="cart_agree_item_title">{t("Total Width")}</h1>
                                    <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowWidth"] + t("Measurements CM"))}</h2>
                                </div>
                            </span>
                            <span className="cart_agree_measurement_row">
                                <div className="cart_agree_measurement_row_section">
                                    <h1 className="cart_agree_item_title">{t("Height 1")}</h1>
                                    <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToWindow1"] ? cartValues["CeilingToWindow1"] : cartValues["Height"])}</h2>
                                </div>
                                <div className="cart_agree_measurement_row_section">
                                    <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                    <h2 className="cart_agree_item_desc"/>
                                </div>
                                <div className="cart_agree_measurement_row_section">
                                    <h1 className="cart_agree_item_title">{t("Height 2")}</h1>
                                    <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToWindow2"])}</h2>
                                </div>
                                <div className="cart_agree_measurement_row_section">
                                    <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                    <h2 className="cart_agree_item_desc"/>
                                </div>
                                <div className="cart_agree_measurement_row_section">
                                    <h1 className="cart_agree_item_title">{t("Height 3")}</h1>
                                    <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToWindow3"])}</h2>
                                </div>
                                <div className="cart_agree_measurement_row_section">
                                    <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                    <h2 className="cart_agree_item_desc"/>
                                </div>
                                <div className="cart_agree_measurement_row_section">
                                    <h1 className="cart_agree_item_title">{t("Total Mounting Height")}</h1>
                                    <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowHeight"] + t("Measurements CM"))}</h2>
                                </div>
                            </span>
                            <span className="cart_agree_measurement_row_bottom">
                                <p className="cart_agree_measurement_row_bottom_left">{t("Curtain Dimension= ")}{NumToFa((cartValues["WidthCart"]) + t("Zebra Measurements W") + " \u00d7 " + (cartValues["HeightCart"]) + t("Zebra Measurements H") + t("Zebra Measurements cm"))}</p>
                                <p className="cart_agree_measurement_row_bottom_right">{t("dk sill text")}</p>
                            </span>
                        </li>);
                    } else if (cartValues["FinishedLengthType"] === "Apron") {
                        setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                        <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Window Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width2B"] ? cartValues["Width2B"] : cartValues["Width"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(L)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionLeft"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(R)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionRight"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowWidth"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                            <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 1")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToWindow1"] ? cartValues["CeilingToWindow1"] : cartValues["Height"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 2")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToWindow2"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 3")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToWindow3"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Mounting Height")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowHeight"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                            <span className="cart_agree_measurement_row_bottom">
                                <p className="cart_agree_measurement_row_bottom_left">{t("Curtain Dimension= ")}{NumToFa((cartValues["WidthCart"]) + t("Zebra Measurements W") + " \u00d7 " + (cartValues["HeightCart"]) + t("Zebra Measurements H") + t("Zebra Measurements cm"))}</p>
                                <p className="cart_agree_measurement_row_bottom_right">{t("dk apron text")}</p>
                        </span>
                        </li>);
                    } else {
                        setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                        <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Window Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width2B"] ? cartValues["Width2B"] : cartValues["Width"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(L)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionLeft"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(R)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionRight"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowWidth"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                            <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 1")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToFloor1"] ? cartValues["CeilingToFloor1"] : cartValues["Height"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 2")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToFloor2"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 3")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToFloor3"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Mounting Height")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowHeight"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                            <span className="cart_agree_measurement_row_bottom">
                                <p className="cart_agree_measurement_row_bottom_left">{t("Curtain Dimension= ")}{NumToFa((cartValues["WidthCart"]) + t("Zebra Measurements W") + " \u00d7 " + (cartValues["HeightCart"]) + t("Zebra Measurements H") + t("Zebra Measurements cm"))}</p>
                                <p className="cart_agree_measurement_row_bottom_right">{t("dk floor text")}</p>
                        </span>
                        </li>);
                    }
                } else {
                    if (cartValues["IsWalled"] === "Ceiling") {
                        if (cartValues["FinishedLengthType"] === "Sill") {
                            setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                        <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Window Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width2B"] ? cartValues["Width2B"] : cartValues["Width"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(L)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionLeft"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(R)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionRight"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowWidth"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                                <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 1")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToWindow1"] ? cartValues["CeilingToWindow1"] : cartValues["Height"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 2")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToWindow2"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 3")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToWindow3"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Mounting Height")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowHeight"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                                <span className="cart_agree_measurement_row_bottom">
                                    <p className="cart_agree_measurement_row_bottom_left">{t("Curtain Dimension= ")}{NumToFa((cartValues["WidthCart"]) + t("Zebra Measurements W") + " \u00d7 " + (cartValues["HeightCart"]) + t("Zebra Measurements H") + t("Zebra Measurements cm"))}</p>
                                    <p className="cart_agree_measurement_row_bottom_right">{t("dk sill text")}</p>
                        </span>
                            </li>);
                        } else if (cartValues["FinishedLengthType"] === "Apron") {
                            setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                        <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Window Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width2B"] ? cartValues["Width2B"] : cartValues["Width"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(L)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionLeft"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(R)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionRight"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowWidth"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                                <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 1")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToWindow1"] ? cartValues["CeilingToWindow1"] : cartValues["Height"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 2")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToWindow2"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 3")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToWindow3"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Mounting Height")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowHeight"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                                <span className="cart_agree_measurement_row_bottom">
                                    <p className="cart_agree_measurement_row_bottom_left">{t("Curtain Dimension= ")}{NumToFa((cartValues["WidthCart"]) + t("Zebra Measurements W") + " \u00d7 " + (cartValues["HeightCart"]) + t("Zebra Measurements H") + t("Zebra Measurements cm"))}</p>
                                    <p className="cart_agree_measurement_row_bottom_right">{t("dk apron text")}</p>
                        </span>
                            </li>);
                        } else {
                            setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                        <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Window Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width2B"] ? cartValues["Width2B"] : cartValues["Width"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(L)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionLeft"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(R)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionRight"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowWidth"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                                <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 1")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToFloor1"] ? cartValues["CeilingToFloor1"] : cartValues["Height"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 2")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToFloor2"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Height 3")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["CeilingToFloor3"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Mounting Height")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowHeight"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                                <span className="cart_agree_measurement_row_bottom">
                                    <p className="cart_agree_measurement_row_bottom_left">{t("Curtain Dimension= ")}{NumToFa((cartValues["WidthCart"]) + t("Zebra Measurements W") + " \u00d7 " + (cartValues["HeightCart"]) + t("Zebra Measurements H") + t("Zebra Measurements cm"))}</p>
                                    <p className="cart_agree_measurement_row_bottom_right">{t("dk floor text")}</p>
                        </span>
                            </li>);
                        }
                    } else {
                        if (cartValues["FinishedLengthType"] === "Sill") {
                            setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                        <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Window Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width2B"] ? cartValues["Width2B"] : cartValues["Width"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(L)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionLeft"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(R)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionRight"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowWidth"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                                <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Window Height")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Height2D"] ? cartValues["Height2D"] : cartValues["Height"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Mount")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ShadeMount"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Mounting Height")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowHeight"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                                <span className="cart_agree_measurement_row_bottom">
                                    <p className="cart_agree_measurement_row_bottom_left">{t("Curtain Dimension= ")}{NumToFa((cartValues["WidthCart"]) + t("Zebra Measurements W") + " \u00d7 " + (cartValues["HeightCart"]) + t("Zebra Measurements H") + t("Zebra Measurements cm"))}</p>
                                    <p className="cart_agree_measurement_row_bottom_right">{t("dk sill text")}</p>
                        </span>
                            </li>);
                        } else if (cartValues["FinishedLengthType"] === "Apron") {
                            setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                        <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Window Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width2B"] ? cartValues["Width2B"] : cartValues["Width"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(L)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionLeft"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(R)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionRight"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowWidth"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                                <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Window Height")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Height2D"] ? cartValues["Height2D"] : cartValues["Height"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Mount")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ShadeMount"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Mounting Height")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowHeight"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                                <span className="cart_agree_measurement_row_bottom">
                                    <p className="cart_agree_measurement_row_bottom_left">{t("Curtain Dimension= ")}{NumToFa((cartValues["WidthCart"]) + t("Zebra Measurements W") + " \u00d7 " + (cartValues["HeightCart"]) + t("Zebra Measurements H") + t("Zebra Measurements cm"))}</p>
                                    <p className="cart_agree_measurement_row_bottom_right">{t("dk apron text")}</p>
                        </span>
                            </li>);
                        } else {
                            setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                        <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Window Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["Width2B"] ? cartValues["Width2B"] : cartValues["Width"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(L)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionLeft"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Extension(R)")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ExtensionRight"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Width")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowWidth"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                                <span className="cart_agree_measurement_row">
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Mount")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["ShadeMount"])}</h2>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                                <h2 className="cart_agree_item_desc"/>
                            </div>
                            <div className="cart_agree_measurement_row_section">
                                <h1 className="cart_agree_item_title">{t("Total Mounting Height")}</h1>
                                <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowHeight"] + t("Measurements CM"))}</h2>
                            </div>
                        </span>
                                <span className="cart_agree_measurement_row_bottom">
                                    <p className="cart_agree_measurement_row_bottom_left">{t("Curtain Dimension= ")}{NumToFa((cartValues["WidthCart"]) + t("Zebra Measurements W") + " \u00d7 " + (cartValues["HeightCart"]) + t("Zebra Measurements H") + t("Zebra Measurements cm"))}</p>
                                    <p className="cart_agree_measurement_row_bottom_right">{t("dk floor text")}</p>
                        </span>
                            </li>);
                        }
                    }
                }
            } else {
                setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                    <span className="cart_agree_measurement_row cart_agree_measurement_row_single">
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Width")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowWidth"] + t("Measurements CM"))}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Height")}</h1>
                            <h2 className="cart_agree_item_desc">{NumToFa(cartValues["WindowHeight"] + t("Measurements CM"))}</h2>
                        </div>
                    </span>
                    <span className="cart_agree_measurement_row_bottom">
                        <p className="cart_agree_measurement_row_bottom_left">{t("Curtain Dimension= ")}{NumToFa((cartValues["WidthCart"]) + t("Zebra Measurements W") + " \u00d7 " + cartValues["HeightCart"] + t("Zebra Measurements H") + t("dk Measurements cm"))}</p>
                    </span>
                </li>);
            }
        }
    }, [location.pathname]);
    
    return (<ul className="measurements_container">{measurements}</ul>);
}

export default GetMeasurementArray;