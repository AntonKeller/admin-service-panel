import moment from "moment";
import 'moment/dist/locale/ru'; // "moment/locale/ru.js";

export function slicer(str, len) {
    return str?.length > len ? str?.slice(0, len - 3) + '...' : str;
}

const configDefault = {
    weekday: 'short', // weekday: 'short',
    year: 'numeric',
    month: 'short', // month: 'short',
    day: 'numeric',
}

// Короткая дата из Unix date
export function unixDateToShortDateString(unixDate) {
    return moment(parseInt(unixDate)).locale('ru').format('DD.MM.YYYY');
}

// Широкая дата из Unix date
export function unixDateToLongDateString(unixDate) {
    return moment(parseInt(unixDate)).locale('ru').format('dd, MMM DD YYYY');
}

export function showAlert(text) {
    return {
        success: function () {
            return {
                type: 'teal-darken-1',
                msg: text,
                isShow: true,
            }
        },
        error: function () {
            return {
                type: 'red-darken-4',
                msg: text,
                isShow: true,
            }
        }
    }
}