export interface ListOrdersResponse {
    data: Order[]
}
export interface Order {
    id: string,
    orderId: string,
    quoteId: string,
    from: string,
    to: string,
    sellQuantity: number,
    buyQuantity: number,
    price: number,
    actualPrice: number,
    inversePrice: number,
    date: string,
    expireTime: string
}

