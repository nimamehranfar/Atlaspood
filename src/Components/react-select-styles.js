const customStyles = {
    control: (provided) => ({
        ...provided,
        height: "1.875rem",
        minHeight: "1.875rem"
    }),
    indicatorSeparator: () => ({
        display: "none",
    }),
    indicatorsContainer: () => ({
        borderColor: "#414141 transparent transparent transparent !important",
        borderStyle: "solid",
        borderWidth: "5px 4px 0 4px",
        height: "0 !important",
        left: pageLanguage === "fa" ? "5%" : "87%",
        position: "absolute",
        top: "40%",
        width: "0",
    }),
    valueContainer: (provided) => ({
        ...provided,
        lineHeight: "1.875rem",
        padding: "0",
        textAlign: "initial",
        height: "1.875rem"
    }),
    singleValue: (provided) => ({
        ...provided,
        marginInlineStart: "0.5rem"
    }),
    placeholder: (provided) => ({
        ...provided,
        marginInlineStart: "0.5rem"
    }),
    input: (provided) => ({
        ...provided,
        marginTop: "0",
        marginBottom: "0",
        marginInlineEnd: "0",
        marginInlineStart: "0.5rem",
        padding: "0",
        height: "1.875rem"
    }),
    menu: (provided) => ({
        ...provided,
        zIndex: "3",
        borderRadius: "0",
        marginTop: "0"
    }),
    menuPortal: (provided) => ({
        ...provided,
        zIndex: "3",
    }),
    option: (provided, state) => ({
        ...provided,
        padding: "0.375rem",
        height: "1.75rem",
        fontSize: "0.8125rem",
        backgroundColor: state.isSelected ? '#ddd' : state.isFocused ? '#5897fb' : '#fff',
        color: state.isSelected ? '#000' : state.isFocused ? '#fff' : '#292b2c',
    }),
};