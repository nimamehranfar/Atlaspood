import React from "react";

function CustomDropdownWithSearch({props, state, methods}) {
    const regexp = new RegExp(state.search, "i");
    
    return (
        <div>
            <div className="select_search_container">
                <i className="fa fa-search" aria-hidden="true"/>
                <input
                    type="text"
                    value={state.search}
                    onChange={methods.setSearch}
                    placeholder="Search"
                />
            </div>
            <div className="select_item_container">
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
                                 }>
                                {option[props.labelField]}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default CustomDropdownWithSearch;