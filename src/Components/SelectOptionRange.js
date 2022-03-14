import React from "react";
import Range from "./Range";
import NumberToPersianWord from "number_to_persian_word";

function SelectOptionRange(from, to, step, postfix, postfixFa, lang) {
    const options = [];
    if (lang === "fa")
        Range(from, to, step).forEach(i => {
            options.push({value: i, label: NumberToPersianWord.convertEnToPe(`${i}`)+postfixFa, key:i});
        });
    else
        Range(from, to, step).forEach(i => {
            options.push({value: i, label: i+postfix, key: i})
        });
    return options;
}

export default SelectOptionRange;