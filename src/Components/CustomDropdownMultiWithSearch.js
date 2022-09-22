import React from "react";
import {useTranslation} from "react-i18next";
import NumberToPersianWord from "number_to_persian_word";

function CustomDropdownMultiWithSearch({props, state, methods}) {
    const regexp = new RegExp(state.search, "i");
    const regexp2 = new RegExp(NumberToPersianWord.convertEnToPe(`${state.search.toLocaleString()}`), "i");
    const {t} = useTranslation();
    
    return (
        <div className={props.className}>
            <div>
                <input
                    type="text"
                    value={state.search}
                    onChange={methods.setSearch}
                    placeholder={t("Type anything")}
                />
            </div>
            <div>
                {props.options
                    .filter(item =>
                        regexp.test(item[props.searchBy] || item[props.labelField] || NumberToPersianWord.convertEnToPe(`${item[props.searchBy].toLocaleString()}`) || NumberToPersianWord.convertEnToPe(`${item[props.labelField].toLocaleString()}`)) ||
                        regexp2.test(item[props.searchBy] || item[props.labelField] || NumberToPersianWord.convertEnToPe(`${item[props.searchBy].toLocaleString()}`) || NumberToPersianWord.convertEnToPe(`${item[props.labelField].toLocaleString()}`))

                    )
                    .map(option => {
                        let exist="false";
                        Object.values(state.values).forEach(obj=>{
                            if(obj.value=== option.value)
                                exist="true";
                        });
                        return (
                            <div disabled={option.disabled}
                                 key={option[props.valueField]}
                                 onClick={
                                     option.disabled ? null : () => methods.addItem(option)
                                 }
                            >
                                <input
                                    type="checkbox"
                                    onChange={() => methods.addItem(option)}
                                    checked={exist}
                                />
                                <div>{option[props.labelField]}</div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
export default CustomDropdownMultiWithSearch;