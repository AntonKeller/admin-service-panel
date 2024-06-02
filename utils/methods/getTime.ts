const getDateTime = (timeString: string): string => {
    return new Date(parseInt(timeString))
        .toLocaleString()
        .replace(/:\d\d$/i,'')
}

export default getDateTime;