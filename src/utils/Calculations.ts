import {CoinTradesSummary} from "../types/CoinTradesSummary.ts";

//
export function getCurrentPercentFromCoinTradesSummary(row: CoinTradesSummary) {
    return getCurrentPercentFromString(row.holding, row.actualPrice, row.averageBuyPrice)
}

export function getCurrentPercentFromString(holding: string, actualPrice: number, averageBuyPrice: string) {
    return getCurrentPercent(parseFloat(holding), actualPrice, parseFloat(averageBuyPrice))
}

export function getCurrentPercent(holding: number, actualPrice: number, averageBuyPrice: number) {
    const diff = (holding * actualPrice) / (holding * averageBuyPrice)
    let result;
    if (diff > 1) {
        result = (diff - 1) * 100
    } else {
        result = -(1 - diff) * 100
    }

    return result
}

export function removeUnncessaryDotsInValueArray(data: number[]): (number | null)[] {
    let previous: (number | null) = null;
    const result: (number | null)[] = []


    data.forEach((value: number, index: number) => {
        let newValue = null;
        if (previous === value) {
            if (data[index + 1] === value) {
                newValue = null;
            } else {
                newValue = value;

            }
        } else {
            newValue = value;
        }
        result.push(newValue)
        previous = value
    })

    result[result.length - 1] = data[data.length - 1]

    return result
}