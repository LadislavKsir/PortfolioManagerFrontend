export interface CoinTradesSummaryResponse {
    coinTrades: CoinTradesSummary[],
    totalInvested: number,
    totalActualValue: number
}

export interface CoinTradesSummary {
    id: string | undefined,
    coinCode: string,
    holding: string,
    averageBuyPrice: string,
    unrealisedProfit: number,
    realisedProfit: number,
    actualPrice: number,
    lowestBuyPrice: string,
    highestBuyPrice: string,
    totalBuyPrice: string,

}
