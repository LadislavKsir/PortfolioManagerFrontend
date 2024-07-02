export interface Coin {
    name: string | undefined,
    code: string
}

export interface ListCoinsResponse {
    coins: Coin[]
}