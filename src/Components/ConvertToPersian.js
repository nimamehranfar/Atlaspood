function convertToPersian(string_farsi) {
    if (string_farsi !== null && string_farsi !== undefined && string_farsi !== "") {
        let tempString = string_farsi.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace('ك', 'ک');
        return tempString;
    } else
        return string_farsi;
}


export default convertToPersian;