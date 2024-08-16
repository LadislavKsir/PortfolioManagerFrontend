export interface CoinTradesSummaryResponse {
    coinTrades: CoinTradesSummary[],
    totalInvested: number,
    totalActualValue: number
}

export interface CoinTradesSummary {
    id: string | undefined,
    coinCode: string,
    holding: string,
    averagePrice: string,
    unrealisedProfitOrLoss: number,
    realisedProfit: number,
    actualPrice: number,
    actualValue: number,
    currentlyInvested: string,


}
// {
//     "coinCode": "ADA",
//     "buyPriceSum": "14.35509068",
//     "sellPriceSum": "4.01760911",
//     "totalAmountBought": "26.56880114",
//     "totalAmountSold": "5.44598126",
//     "holding": "21.12281988",
//     "currentlyInvested": "21.12281988",
//     "averagePrice": "1.00000000",
//     "actualPrice": 0.3438975695986304,
//     "unrealisedProfitOrLoss": 13.858733460198366
// },