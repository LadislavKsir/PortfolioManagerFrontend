import {CoinDetailTradesSummary} from "./CoinDetailTradesSummary.ts";

export interface CoinDetailResponse {
    code: string,
    name: string | undefined,
    chartUrl: string | undefined,
    tradesSummary:  CoinDetailTradesSummary
}