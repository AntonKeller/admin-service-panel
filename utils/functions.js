import moment from "moment";

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
    return moment(unixDate).format('DD.MM.YYYY');
}

// Широкая дата из Unix date
export function unixDateToLongDateString(unixDate) {
    return moment(unixDate).locale('ru').format('dddd, MMMM DD YYYY');
}

export function timestampToDateString(timestamp, config = configDefault) {


    return isNaN(parseInt(timestamp)) ?
        (new Date(parseInt(timestamp))).toLocaleDateString(undefined, config) : '-'
}

export function dateToTimeString(_date) {
    return `${Date.parse(_date)}`;
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