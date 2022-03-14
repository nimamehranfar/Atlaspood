import React from "react";

function CustomDropdownMultiWithSearch({props, state, methods}) {
    const regexp = new RegExp(state.search, "i");
    
    return (
        <div>
            <div>
                <input
                    type="text"
                    value={state.search}
                    onChange={methods.setSearch}
                    placeholder="Type anything"
                />
            </div>
            <div>
                {props.options
                    .filter(item =>
                        regexp.test(item[props.searchBy] || item[props.labelField])
                    )
                    .map(option => {
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
                                    checked={state.values.indexOf(option) !== -1}
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