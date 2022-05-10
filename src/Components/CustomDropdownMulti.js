import React from "react";

function CustomDropdownMulti({props, state, methods}) {
    const regexp = new RegExp(state.search, "i");
    
    return (
        <div className={props.className}>
            <div>
                {props.options
                    .filter(item =>
                        regexp.test(item[props.searchBy] || item[props.labelField])
                    )
                    .map(option => {
                        let exist="false";
                        Object.values(state.values).forEach(obj=>{
                            if(obj.value=== option.value)
                                exist="true";
                        });
                        return (
                            <div className="select_item"
                                 item-selected={exist}
                                 disabled={option.disabled}
                                 key={option[props.valueField]}
                                 onClick={
                                     option.disabled ? null : () => methods.addItem(option)
                                 }
                            >
                                <span className="fa">{option[props.labelField]}</span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default CustomDropdownMulti;