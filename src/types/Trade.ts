export interface ListTradesResponse {
    trades: Trade[]

}
export interface Trade {
    id: string,
    from: string,
    to: string,
    sellQuantity: number,
    buyQuantity: number,
    price: number,
    inversePrice: number,
    date: string
}


