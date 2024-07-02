export interface CoinTradesSummaryResponse {
    coinTrades: CoinTradesSummary[],
    totalInvested: number,
    totalActualValue: number
}

export interface CoinTradesSummary {
    id: string | undefined,
    coinCode: string,
    holding: number,
    averageBuyPrice: number,
    unrealisedProfit: number,
    realisedProfit: number,
    actualPrice: number,
    LastBuyTrade: LastBuyTrade
}

export interface LastBuyTrade {
    id: string,
    date: string,
    from: string,
    to: string,
    sellQuantity: number,
    buyQuantity: number,
    price: number,
    inversePrice: number,
    unrealisedProfit: number
}


// {
//     "coinCode": "MATIC",
//     "holding": 7.840749250000001,
//     "averageBuyPrice": 1.0278683202661236,
//     "unrealisedProfit": null,
//     "lowestBuyPrice": 0.678049,
//     "highestBuyPrice": 1.2564,
//     "realisedProfit": 3.151188151237379,
//     "lastBuyTrade": {
//     "id": "a3129329-2dda-4e6c-80c2-41ef182c2a41",
//         "date": "2024-05-10T15:41:08",
//         "from": "USDT",
//         "to": "MATIC",
//         "sellQuantity": 0.05676794,
//         "buyQuantity": 0.08372248,
//         "price": 1.474819666425288,
//         "inversePrice": 0.678049,
//         "unrealisedProfit": null
// },
//     "actualPrice": null
// },