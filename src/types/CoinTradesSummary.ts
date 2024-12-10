export interface CoinTradesSummaryResponse {
    coinTrades: CoinTradesSummary[],
    totalInvested: number,
    totalActualValue: number,

    totalBuyPriceSum: string,
    totalSellPriceSum: string,
    actuallyPossibleProfit: string
}

export interface CoinTradesSummary {
    id: string | undefined,
    coinCode: string,
    holding: string,
    averageBuyPrice: string,
    unrealisedProfit: string,
    realisedProfit: number,
    actualPrice: string,
    lowestBuyPrice: string,
    highestBuyPrice: string,
    totalBuyPrice: string,

}
