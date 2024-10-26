export function slicer(str, len) {
    return str?.length > len ? str?.slice(0, len - 3) + '...' : str;
}

export function timeStringToDate(_timeString) {
    return new Date(parseInt(_timeString));
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