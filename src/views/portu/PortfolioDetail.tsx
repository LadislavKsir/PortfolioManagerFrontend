import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import DataTable, {ColumnDefinition} from "../../components/common/DataTable.tsx";
import {Transaction} from "../../types/portu/Transaction.ts";
import {Box, Card, CardContent, Divider, Grid, Typography} from "@mui/material";

export default function PortfolioDetail() {

    const {portfolioId} = useParams() as { portfolioId: string };

    const [portfolioData, setPortfolioData] = useState<PortfolioSummary | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const loadPortfolioData = useCallback(() => {
        axios.get(`http://192.168.0.106:8081/portfolio/${portfolioId}/summary`).then((res) => {
            const data = res.data;
            setPortfolioData(data);
            setLoading(false);
        });
    }, [portfolioId]);

    useEffect(() => {
        loadPortfolioData();
        // loadTransactions();
    }, [loadPortfolioData]);

    function assetSummaryTable() {
        const columns: ColumnDefinition<AssetSummary>[] = [
            {key: 'assetName', label: 'Název', align: 'left'},
            {key: 'assetCode', label: 'Ticker', align: 'left'},
            {
                key: 'heldQuantity',
                label: 'Držené množství',
                align: 'right',
                valueGetter: (row) => row.holding ? row.heldQuantity.toFixed(2) : '/'
            },
            {key: 'totalBuyPrice', label: 'Celková nákupní cena', align: 'right'},
            {key: 'totalSellPrice', label: 'Celková prodejní cena', align: 'right'},
            {
                key: 'averageBuyPrice',
                label: 'Průměrná cena',
                align: 'right',
                valueGetter: (row) => row.holding ? row.averageBuyPrice.toFixed(2) : '/'
            },
            {key: 'currencyCode', label: 'Měna', align: 'right'},
        ];

        return (
            <DataTable<AssetSummary> columns={columns}
                                     dataSourceUrl={null}
                                     data={portfolioData?.assetsSummary || []}
                                     getRowId={(row) => row.assetId}
                                     getRowSx={(row) => ({
                                         backgroundColor: row.holding ? 'inherit' : 'lightgray',
                                     })}
                                     paged={false}
            />
        )
    }

    function transactionsTable() {
        const columns: ColumnDefinition<Transaction>[] = [
            {key: 'date', label: 'Datum', align: 'left'},
            {key: 'operationDescription', label: 'Operace', align: 'left'},
            {key: 'assetName', label: 'Aktivum', align: 'left'},
            {key: 'assetCode', label: 'Ticker', align: 'left'},
            {key: 'quantity', label: 'Množství', align: 'right'},
            {key: 'price', label: 'Cena', align: 'right'},
            {key: 'amount', label: 'Částka', align: 'right'},
            {key: 'currencyCode', label: 'Měna', align: 'left'},
        ];

        return (
            <DataTable<Transaction> columns={columns}
                                    data={null}
                                    dataSourceUrl={`http://192.168.0.106:8081/portfolio/${portfolioId}/transactions`}
                                    getRowId={(row) => row.id}
                                    paged={true}
            />
        )
    }

    if (loading) return <p>Loading...</p>;

    console.log("Portfolio Data:", portfolioData);

    function portfolioDetailCard() {
        return (
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={3} sm={3} md={3}/>
                    <Grid item xs={3} sm={3} md={3}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Cashflow</Typography>
                                <Typography variant="body2" align="left">💰
                                    Vklady: {portfolioData?.transactionsSummary.totalIn}</Typography>
                                <Typography variant="body2" align="left">💸
                                    Výběry: {portfolioData?.transactionsSummary.totalOut}</Typography>
                                <Typography variant="body2" align="left">🧾
                                    Poplatky: {portfolioData?.transactionsSummary.totalFees}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={3} sm={3} md={3}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Dividendy</Typography>
                                {portfolioData?.transactionsSummary.dividends && Object.entries(portfolioData.transactionsSummary.dividends).map(
                                    ([currency, amount]) => (
                                        <Typography variant="body2" align="left" key={currency}>
                                            💰 {currency}: {amount.toFixed(2)}
                                        </Typography>
                                    )
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3}/>
                </Grid>
            </Box>
        )
    }

    return (
        <div>
            <div>
                <h2>Portfolio detail: {portfolioData?.portfolio.name}</h2>
                <Divider/>
                <br/>
                {portfolioDetailCard()}
            </div>
            <div>

                <h2>Položky:</h2>
                <Divider/>
                {assetSummaryTable()}

                <h2>Transactions:</h2>
                <Divider/>
                {transactionsTable()}

            </div>
        </div>
    )
}
