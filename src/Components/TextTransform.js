function Capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function CapitalizeAllWords(string) {
    let splitStr = string.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}

function Uppercase(string) {
    return string.toUpperCase();
}

function Lowercase(string) {
    return string.toLowerCase();
}

export { Capitalize, CapitalizeAllWords, Uppercase, Lowercase };