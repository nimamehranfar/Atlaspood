import NumberToPersianWord from "number_to_persian_word";

function Capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function CapitalizeAllWords(string= "") {
    let splitStr = string.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}

function Uppercase(string= "") {
    return string.toUpperCase();
}

function Lowercase(string= "") {
    return string.toLowerCase();
}

function NumToFa(string= "",pageLanguage) {
    return pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(string) : string;
}

function convertToPersian(string_farsi= "") {
    if (string_farsi !== null && string_farsi !== undefined && string_farsi !== "") {
        let tempString = string_farsi.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace('ك', 'ک');
        return tempString;
    } else
        return string_farsi;
}

export { Capitalize, CapitalizeAllWords, Uppercase, Lowercase, NumToFa, convertToPersian };