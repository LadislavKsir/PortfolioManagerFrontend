import useFetch from "../../api/Api.ts";
import {ListTradesResponse, Trade} from "../../types/Trade.ts";
import {CoinTradesSummaryResponse} from "../../types/CoinTradesSummary.ts";
import {DataGrid} from "@mui/x-data-grid";
import addParams, {addPathVariable, Parameter} from "../../utils/UrlBuilder.ts";
import  {JSX, useEffect} from "react";
import isStableCoin from "../../utils/StableCoins.ts";
import {useParams} from "react-router-dom";
import {MenuProps} from "../../App.tsx";
import {LineChart} from "@mui/x-charts";
import {TradesSummarySnapshot} from "../../types/TradesSummarySnapshot.ts";
import {formatDateTimeString} from "../../utils/DateFormatter.ts";
import LoadingComponent from "../../components/LoadingComponent.tsx";
import {coinDetailCoinTradesTableDefinition} from "./CoinDetailTableDefinitions.tsx";
import {Box, Grid, Paper, Typography} from "@mui/material";
import {styled} from "@mui/system";
import {CoinDetail} from "../../types/CoinDetail.ts";
import {removeUnncessaryDotsInValueArray} from "../../utils/Calculations.ts";
import {NavigationDefinition} from "../../routing/NavigationDefinition.tsx";

export default function CoinDetail(menuProps: MenuProps) {

    const {code} = useParams();
    const params: Parameter[] = [{key: 'coinCodes', value: code}]

    const coinTrades = useFetch<ListTradesResponse>(addParams('/binance/trades', params))
    const coinTradesSummary = useFetch<CoinTradesSummaryResponse>(addParams('/binance/trades/trades-summary', params));

    const snapshotsParams: Parameter[] = [{key: 'coinCodes', value: code}, {key: 'onlyOverview', value: false}]
    const snapshots: TradesSummarySnapshot[] = useFetch<TradesSummarySnapshot[]>(addParams('/binance/trades/summary-snapshots', snapshotsParams))

    const coinDetail = useFetch<CoinDetail>(addPathVariable('/binance/trades/coin-summary', code))

    useEffect(() => {
        const navigationContent: NavigationDefinition[] = [
            {text: "Summary", link: "/binance/summary"},
            {text: "Orders", link: "/binance/orders"},
            {text: "Coins", link: "/binance/coins"},
            {text: "Earn", link: "/binance/locked-subscriptions"},
        ]
        menuProps.setNavigationContent(navigationContent)
    }, []);

    const StyledPaper = styled(Paper)(({theme}) => ({
        padding: theme.spacing(2),
        backgroundColor: '#E0E0E0', // Grey background color for each block
        textAlign: 'center',
    }));

    if (coinTrades === undefined || coinTradesSummary === undefined || coinDetail === undefined) {
        return (<div></div>)
    }

    const coinTradeSummary = coinTradesSummary.coinTrades.pop()

    if (coinTradeSummary === undefined) {
        return (<div></div>)
    }

    function SimpleLineChart() {
        const actualValues = snapshots.map((x) => x.actualValue);
        const investedValues = snapshots.map((x) => x.invested)

        const invested = removeUnncessaryDotsInValueArray(investedValues);
        const xLabels = snapshots.map((x) => formatDateTimeString(x.dateTime));

        return (
            <div className={"centered-element-wrapper"}>
                <div className={"centered-element"}>
                    <LineChart
                        width={1380}
                        height={500}
                        series={[
                            {data: actualValues, showMark: false, label: 'Actual value'},
                            {data: invested, connectNulls: true, showMark: false, label: 'Invested'},
                        ]}
                        xAxis={[
                            {scaleType: 'point', data: xLabels},

                        ]}
                        grid={{vertical: true, horizontal: true}}
                    />
                </div>
            </div>

        );
    }

    const actualValue = parseFloat(coinTradeSummary.holding) * coinTradeSummary.actualPrice
    const rows = coinTrades.trades

    function headTableNew(): JSX.Element {
        return (
            <Paper
                elevation={3}
                sx={{
                    padding: 2,
                    borderRadius: 3,
                    backgroundColor: '#f6f0ff', // Light purple background for the card
                    border: '1px solid #C689FF', // Border styling
                }}
            >
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mb={2}
                >
                    {/* The coin icon and title */}
                    <img
                        src="coin-icon-url" // Add your coin icon URL here
                        alt="Celestia Icon"
                        style={{width: 40, height: 40, marginRight: 10}}
                    />
                    <Typography variant="h6">Celestia (TIA)</Typography>
                </Box>
                {/* The grid with values */}
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <StyledPaper>
                            <Typography>Actual price:</Typography>
                            <Typography variant="h6">13156</Typography>
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={4}>
                        <StyledPaper>
                            <Typography>Holding:</Typography>
                            <Typography variant="h6">13156</Typography>
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={4}>
                        <StyledPaper>
                            <Typography>Buy price sum:</Typography>
                            <Typography variant="h6">13156</Typography>
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={4}>
                        <StyledPaper>
                            <Typography>Actual value:</Typography>
                            <Typography variant="h6">468</Typography>
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={4}>
                        <StyledPaper>
                            <Typography>Buy value:</Typography>
                            <Typography variant="h6">135</Typography>
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={4}>
                        <StyledPaper>
                            <Typography>Sell price sum:</Typography>
                            <Typography variant="h6">13156</Typography>
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={4}>
                        <StyledPaper>
                            <Typography>Realised profit:</Typography>
                            <Typography variant="h6">13156</Typography>
                        </StyledPaper>
                    </Grid>
                </Grid>
            </Paper>
        );
    }

    // function chartUrlLink(chartUrl: string | undefined): React.JSX.Element {
    //     return
    // }

    function headTable(): JSX.Element {
        const chartUrl = (chartUrl: string | undefined): JSX.Element => {
            return chartUrl ? <a href={chartUrl} target="_blank">Chart @ CoinMarketCap</a> : <p/>
        }

        return (
            <table className="coin-detail-table">
                <tbody>
                <tr className="coin-detail-table-row">
                    <td>Code:</td>
                    <td>{code}</td>
                    <td>Actual Value:</td>
                    <td> {actualValue}</td>
                </tr>
                <tr className="coin-detail-table-row">
                    <td>Holding:</td>
                    <td>{coinTradeSummary?.holding}</td>
                    <td>Buy Value:</td>
                    <td> {coinTradeSummary?.totalBuyPrice}</td>
                </tr>
                <tr className="coin-detail-table-row">
                    <td>Current price:</td>
                    <td>{coinTradeSummary?.actualPrice}</td>
                    <td>Average buy price:</td>
                    <td>{coinTradeSummary?.averageBuyPrice}</td>
                </tr>
                <tr className="coin-detail-table-row">
                    <td></td>
                    <td>{chartUrl(coinDetail.chartUrl)}</td>
                    <td>Realised profit:</td>
                    <td>{coinTradeSummary?.realisedProfit}</td>
                </tr>
                </tbody>
            </table>

        )
    }

    function coinTradesTable(): JSX.Element {
        return (
            <DataGrid
                rows={rows}
                columns={coinDetailCoinTradesTableDefinition}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 50},
                    },
                    sorting: {
                        sortModel: [{field: 'date', sort: 'desc'}],
                    }
                }}
                getRowClassName={(params) => {
                    return (isStableCoin(params.row.from)) ? "profit" : "loss";
                }}
                pageSizeOptions={[50, 100]}
            />
        )
    }

    function tradePricesChart() {
        if (snapshots === undefined) {
            return (<LoadingComponent/>)
        }

        const data = [...rows].sort(function (a, b) {
            return (new Date(b.date).valueOf() - new Date(a.date).valueOf());
        }).reverse()

        const buys: (number | null)[] = []
        const sells: (number | null)[] = []
        let actual: (number | null)[] = []
        const labels: (string)[] = []

        data.forEach((trade: Trade) => {
            actual.push(coinTradeSummary.actualPrice)

            if (isStableCoin(trade.from)) {
                buys.push(trade.inversePrice)
                sells.push(null)
            } else {
                buys.push(null)
                sells.push(trade.price)
            }
            labels.push(formatDateTimeString(trade.date))
        })

        actual = actual.map((num, index) => {
            return (index === 0 || index === actual.length - 1) ? num : null;
        });

        return (
            <div className={"centered-element-wrapper"}>
                <div className={"centered-element"}>
                    <LineChart
                        width={1280}
                        height={500}
                        series={[
                            {data: buys, showMark: true, label: 'Buy'},
                            {data: sells, showMark: true, label: 'Sell'},
                            {data: actual, showMark: false, connectNulls: true, label: 'Actual'},
                        ]}
                        xAxis={[
                            {scaleType: 'point', data: labels},

                        ]}
                        grid={{vertical: true, horizontal: true}}
                    />
                </div>
            </div>
        );
    }

    return (

        <div className={"centered-element-wrapper"}>
            <div className={"centered-element"}>

                <h2>Coin detail</h2>

                {/*{headTableNew()}*/}
                {headTable()}

                <h2>Value history</h2>
                {SimpleLineChart()}

                <h2>Graph of realised trades</h2>
                {tradePricesChart()}

                <h4>Coin trades</h4>
                {coinTradesTable()}
            </div>
        </div>

    );
}
