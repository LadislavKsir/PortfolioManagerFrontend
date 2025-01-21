export interface Transaction {
    id: number;
    date: string;
    checksum: number;
    portfolioId: number;
    portfolioName: string;
    operationId: number;
    operationDescription: string;
    exchangeId: number | null;
    exchangeName: string | null;
    assetId: number | null;
    assetName: string | null;
    quantity: number | null;
    description: string;
    price: number | null;
    amount: number;
    currencyId: number;
    currencyName: string;
    currencyCode: string;
    note: string | null;
    operationType: string;
}