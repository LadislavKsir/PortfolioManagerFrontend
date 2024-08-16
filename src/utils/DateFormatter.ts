export function formatDateString(date: string) {
    return formatDate(new Date(date))

}

export function formatDateTimeString(date: string) {
    return formatDateTime(new Date(date))

}

function formatTime(date: Date) {
    let minutes = '' + (date.getMinutes())
    let seconds = '' + date.getSeconds()

    if (minutes.length < 2)
        minutes = '0' + minutes;
    if (seconds.length < 2)
        seconds = '0' + seconds;

    return [date.getHours(), minutes, seconds].join(':');
}

export function formatDate(date: Date | undefined): string {
    if (date === undefined) {
        return ""
    }

    let month = '' + (date!.getMonth() + 1)
    let day = '' + date!.getDate()
    const year = date!.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('.');
}

export function formatDateTime(date: Date | undefined) {
    if (date === undefined) {
        return "";
    }
    return formatDate(date) + " " + formatTime(date);
}

