import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";


function GetMeasurementArray({modelId, cartValues}) {
    const {t} = useTranslation();
    
    const [measurements, setMeasurements] = useState(undefined);
    
    
    useEffect(() => {
    if (modelId === "0303") {
        if (cartValues["calcMeasurements"]) {
            if (cartValues["Mount"] === "Inside") {
                setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                    <span className="cart_agree_measurement_row">
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Width 1")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["Width1"]?cartValues["Width1"]:cartValues["Width"]}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Width 2")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["Width2"]}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Width 3")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["Width3"]}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Width")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["WidthCart"]+t("Measurements CM")}</h2>
                        </div>
                    </span>
                    <span className="cart_agree_measurement_row">
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Height 1")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["Height1"]?cartValues["Height1"]:cartValues["Height"]}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Height 2")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["Height2"]}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Height 3")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["Height3"]}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Height")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["HeightCart"]+t("Measurements CM")}</h2>
                        </div>
                    </span>
                    <span className="cart_agree_measurement_row_bottom">
                        <p className="cart_agree_measurement_row_bottom_left">{t("Shade Dimension= ")}{(cartValues["WidthCart"]-4)+t("Zebra Measurements W")+" X "+cartValues["HeightCart"]+t("Zebra Measurements H")+t("Zebra Measurements cm")}</p>
                        <p className="cart_agree_measurement_row_bottom_right">{t("Zebra Measurements text")}</p>
                    </span>
                </li>);
            }
            else{
                setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                    <span className="cart_agree_measurement_row">
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Window Width")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["Width3A"]?cartValues["Width3A"]:cartValues["Width"]}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Extension(L)")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["ExtensionLeft"]}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Extension(R)")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["ExtensionRight"]}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Total Width")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["WidthCart"]+t("Measurements CM")}</h2>
                        </div>
                    </span>
                    <span className="cart_agree_measurement_row">
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Window Height")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["Height3C"]?cartValues["Height3C"]:cartValues["Height"]}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator"/>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Mount")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["ShadeMount"]}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title cart_agree_measurement_row_operator">:</h1>
                            <h2 className="cart_agree_item_desc"/>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Total Mounting Height")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["HeightCart"]+t("Measurements CM")}</h2>
                        </div>
                    </span>
                    <span className="cart_agree_measurement_row_bottom">
                        <p className="cart_agree_measurement_row_bottom_left">{t("Shade Dimension= ")}{(cartValues["WidthCart"]-4)+t("Zebra Measurements W")+" X "+cartValues["HeightCart"]+t("Zebra Measurements H")+t("Zebra Measurements cm")}</p>
                        <p className="cart_agree_measurement_row_bottom_right">{t("Zebra Measurements text")}</p>
                    </span>
                </li>);
            }
        }
        else{
            setMeasurements(<li className="cart_agree_item cart_agree_measurement">
                    <span className="cart_agree_measurement_row cart_agree_measurement_row_single">
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Width")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["WidthCart"]+t("Measurements CM")}</h2>
                        </div>
                        <div className="cart_agree_measurement_row_section">
                            <h1 className="cart_agree_item_title">{t("Height")}</h1>
                            <h2 className="cart_agree_item_desc">{cartValues["HeightCart"]+t("Measurements CM")}</h2>
                        </div>
                    </span>
                    <span className="cart_agree_measurement_row_bottom">
                        <p className="cart_agree_measurement_row_bottom_left">{t("Shade Dimension= ")}{(cartValues["WidthCart"]-4)+t("Zebra Measurements W")+" X "+cartValues["HeightCart"]+t("Zebra Measurements H")+t("Zebra Measurements cm")}</p>
                        <p className="cart_agree_measurement_row_bottom_right">{t("Zebra Measurements text")}</p>
                    </span>
            </li>);
        }
    }
    }, []);
    
    return (
        <ul className="measurements_container">{measurements}</ul>
    );
}

export default GetMeasurementArray;