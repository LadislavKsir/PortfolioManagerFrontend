export function formatNumberValue(value: number | undefined | null) {
    if (value === undefined || value === null) {
        return ""
    }

    if (value > 1) {
        return value.toFixed(2)
    }

    if (value < 0.0009) {
        return value.toFixed(7)
    }

    if (value < 0.009) {
        return value.toFixed(5)
    }
    return value.toFixed(3)


}

export function formatStringValue(value: string | undefined) {
    if (value === undefined) {
        return ""
    }
}