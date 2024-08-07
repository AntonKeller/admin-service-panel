export function downloadFile(path, saveAs, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", path, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        callback();
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(this.response);
        const tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = saveAs;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();
}

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

export function copyClipboard(txt, f1, f2) {
    const inp = document.createElement('input')
    inp.value = txt;
    document.body.appendChild(inp)
    inp.select()

    if (document.execCommand('copy')) {
        f1('Скопировано в буффер!');
    } else {
        f2('Копирование в буффер не удалось!');
    }

    document.body.removeChild(inp)
}

const requestConfig = {
    timeout: 1500,
};