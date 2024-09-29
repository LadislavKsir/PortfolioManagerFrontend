import useFetch from "../../api/Api.ts";
import {ListTradesResponse, Trade} from "../../types/Trade.ts";
import {CoinTradesSummaryResponse} from "../../types/CoinTradesSummary.ts";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import addParams, {Parameter} from "../../utils/UrlBuilder.ts";
import {JSX, useEffect} from "react";
import isStableCoin from "../../utils/StableCoins.ts";
import {useParams} from "react-router-dom";
import {MenuProps, NavigationDefinition} from "../../App.tsx";
import {LineChart} from "@mui/x-charts";
import {TradesSummarySnapshot} from "../../types/TradesSummarySnapshot.ts";
import {formatDateTime, formatDateTimeString} from "../../utils/DateFormatter.ts";
import LoadingComponent from "../../components/LoadingComponent.tsx";

export default function CoinDetail(menuProps: MenuProps) {

    useEffect(() => {
        const navigationContent: NavigationDefinition[] = [
            {text: "Summary", link: "/binance/summary"},
            {text: "Orders", link: "/binance/orders"},
            {text: "Coins", link: "/binance/coins"},
            {text: "Earn", link: "/binance/locked-subscriptions"},
        ]
        menuProps.setNavigationContent(navigationContent)
    }, []);


    const columns: GridColDef[] = [
        {
            field: 'from',
            headerName: 'From',
            headerClassName: 'my-header',
            type: 'string'
        },
        {
            field: 'to',
            headerName: 'To',
            type: 'string'
        },
        {
            field: 'averageBuyPrice',
            headerName: 'Price',
            description: '',
            width: 180,
            valueGetter: (_, row: Trade) => isStableCoin(row.from) ? row.inversePrice : row.price,
        },
        {
            field: 'sellQuantity',
            headerName: 'Quantity',
            description: '',
            width: 180,
            valueGetter: (_, row: Trade) => isStableCoin(row.from) ? row.buyQuantity : row.sellQuantity,
        },
        {
            field: 'tradeValue',
            headerName: 'Trade value',
            description: '',
            width: 180,
            valueGetter: (_, row: Trade) => isStableCoin(row.from) ? row.sellQuantity : row.buyQuantity,
        },
        {
            field: 'date',
            headerName: 'Date',
            description: '',
            width: 180,
            type: 'string',
            valueGetter: (_, row: Trade) => new Date(row.date),
            valueFormatter: (value?: Date) => {
                return formatDateTime(value)
            }
            // valueGetter: (_, row: Trade) => formatDateString(row.date),
            // // valueFormatter
            // sortComparator: dateStringSortComparator,
        },
        {
            field: 'orderType',
            headerName: 'orderType',
            description: '',
            width: 180,
            type: 'string'
        },

    ];

    const {code} = useParams();
    const params: Parameter[] = [{key: 'coinCodes', value: code}]

    const coinTrades = useFetch<ListTradesResponse>(addParams('/binance/trades', params))
    const coinTradesSummary = useFetch<CoinTradesSummaryResponse>(addParams('/binance/v1/trades-summary', params));

    const snapshotsParams: Parameter[] = [{key: 'coinCodes', value: code}, {key: 'onlyOverview', value: false}]
    const snapshots: TradesSummarySnapshot[] = useFetch<TradesSummarySnapshot[]>(addParams('/binance/trades-summary-snapshots', snapshotsParams))


    if (coinTrades === undefined || coinTradesSummary === undefined) {
        return (<div></div>)
    }

    const coinTradeSummary = coinTradesSummary.coinTrades.pop()

    if (coinTradeSummary === undefined) {
        return (<div></div>)
    }

    function SimpleLineChart() {
        const actualValues = snapshots.map((x) => x.actualValue);
        const invested = snapshots.map((x) => x.invested);
        // const xLabels = snapshots.map((x) => new Date(x.dateTime).toLocaleString());
        const xLabels = snapshots.map((x) => formatDateTimeString(x.dateTime));

        // const cashflows = [20, 30, 40]

        return (
            <div className={"centered-element-wrapper"}>
                <div className={"centered-element"}>
                    <LineChart
                        width={1380}
                        height={500}
                        series={[
                            {data: actualValues, label: 'Actual value'},
                            {data: invested, label: 'Invested'},
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

    // const value = coinTradeSummary.tot
    const actualValue = parseFloat(coinTradeSummary.holding) * coinTradeSummary.actualPrice
    const rows = coinTrades.trades

    function headTable(): JSX.Element {
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
                    <td></td>
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
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 50},
                    },
                    sorting: {
                        sortModel: [{field: 'date', sort: 'desc'}],
                    }
                }}
                getRowClassName={(params) => {
                    return (params.row.from === "USDT" || params.row.from === "USDC") ? "profit" : "loss";
                }}
                pageSizeOptions={[50, 100]}
            />
        )
    }

    function tradePricesChart() {
        if (snapshots === undefined) {
            return (<LoadingComponent/>)
        }

        const data = rows.sort(function (a, b) {
            return (new Date(b.date).valueOf() - new Date(a.date).valueOf());
        }).reverse()

        const buys: (number | null)[] = []
        const sells: (number | null)[] = []
        const labels: (string)[] = []

        data.forEach((trade: Trade) => {
            if (trade.from === "USDT" || trade.from === "USDC") {
                buys.push(trade.inversePrice)
                sells.push(null)
            } else {
                buys.push(null)
                sells.push(trade.price)
            }
            labels.push(formatDateTimeString(trade.date))
        })

        return (
            <div className={"centered-element-wrapper"}>
                <div className={"centered-element"}>
                    <LineChart
                        width={1280}
                        height={500}
                        series={[
                            {data: buys, label: 'Buy'},
                            {data: sells, label: 'Sell'},
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
                {headTable()}
                {SimpleLineChart()}
                {tradePricesChart()}

                <h4>Coin trades</h4>
                {coinTradesTable()}
            </div>
        </div>

    );
}
