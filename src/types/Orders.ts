export interface ListOrdersResponse {
    orders: Order[]
}
export interface Order {
    id: string,
    from: string,
    to: string,
    sellQuantity: number,
    buyQuantity: number,
    price: number,
    inversePrice: number,
    date: string
}

