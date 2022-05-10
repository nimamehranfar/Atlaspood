import React from "react";
import NumberToPersianWord from "number_to_persian_word";


function GetPrice(price, lang, postFix) {
    return (lang === "fa" ? NumberToPersianWord.convertEnToPe(`${(price / 10).toLocaleString()}`) : (price / 10).toLocaleString()) + " " + postFix;
}

export default GetPrice;