export interface ListOrdersResponse {
    data: TradeOrder[]
}
export interface TradeOrder {
    id: string,
    from: string,
    to: string,
    sellQuantity: number,
    buyQuantity: number,
    price: number,
    inversePrice: number,
    actualPrice: number,
    date: string,
    expireTime: string,
    nearingExpiration: boolean
}


