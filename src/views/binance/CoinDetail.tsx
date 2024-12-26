import useFetch from "../../api/Api.ts";
import {ListTradesResponse, Trade} from "../../types/Trade.ts";
import {DataGrid} from "@mui/x-data-grid";
import addParams, {addPathVariable, Parameter} from "../../utils/UrlBuilder.ts";
import {JSX, useEffect} from "react";
import isStableCoin from "../../utils/StableCoins.ts";
import {useParams} from "react-router-dom";
import {MenuProps} from "../../App.tsx";
import {LineChart} from "@mui/x-charts";
import {TradesSummarySnapshot} from "../../types/TradesSummarySnapshot.ts";
import {formatDateTimeString} from "../../utils/DateFormatter.ts";
import LoadingComponent from "../../components/LoadingComponent.tsx";
import {coinDetailCoinTradesTableDefinition} from "./CoinDetailTableDefinitions.tsx";
import {CoinDetailResponse} from "../../types/CoinDetailResponse.ts";
import {removeUnncessaryDotsInValueArray} from "../../utils/Calculations.ts";
import {NavigationDefinition} from "../../routing/NavigationDefinition.tsx";
import {Divider} from '@mui/material';

export default function CoinDetail(menuProps: MenuProps) {

    const {code} = useParams() as { code: string };
    const params: Parameter[] = [{key: 'coinCodes', value: code}]

    const coinTrades = useFetch<ListTradesResponse>(addParams('/binance/trades', params))

    const snapshotsParams: Parameter[] = [{key: 'coinCodes', value: code}, {key: 'onlyOverview', value: false}]
    const snapshots: TradesSummarySnapshot[] = useFetch<TradesSummarySnapshot[]>(addParams('/binance/trades/summary-snapshots', snapshotsParams))

    const coinDetail = useFetch<CoinDetailResponse>(addPathVariable('/binance/trades/coin-summary', code))

    useEffect(() => {
        const navigationContent: NavigationDefinition[] = [
            {text: "Summary", link: "/binance/summary"},
            {text: "Orders", link: "/binance/orders"},
            {text: "Coins", link: "/binance/coins"},
            {text: "Earn", link: "/binance/earn"},
        ]
        menuProps.setNavigationContent(navigationContent)

        document.title = code + ' trades detail';
    }, []);

    if (coinTrades === undefined || coinDetail === undefined) {
        return (<div></div>)
    }

    const coinTradeSummary = coinDetail.tradesSummary

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

    function headTableUpd(): JSX.Element {
        const codeWithLink = (chartUrl: string | undefined): JSX.Element => {
            return chartUrl ? <a href={chartUrl} target="_blank">{code}</a> : <p>{code}</p>
        }

        const getPossibleProfitClassName = (possibleProfit: string | undefined): string => {
            return (possibleProfit === undefined || parseFloat(possibleProfit) < 0) ? "loss" : "profit"
        }

        return (
            <table className="coin-detail-table">
                <tbody>
                <tr className="coin-detail-table-row">
                    <td>Coin:</td>
                    <td>{codeWithLink(coinDetail.chartUrl)}</td>
                    <td>Current price:</td>
                    <td>{coinTradeSummary?.actualPrice}</td>

                </tr>
                <tr className="coin-detail-table-row">
                    <td colSpan={4}><Divider/></td>
                </tr>
                <tr className="coin-detail-table-row">
                    <td>Holding:</td>
                    <td>{coinTradeSummary?.holding}</td>
                    <td>Buy Value:</td>
                    <td> {coinTradeSummary?.totalBuyPrice}</td>
                </tr>
                <tr className="coin-detail-table-row">
                    <td>Average buy price:</td>
                    <td>{coinTradeSummary?.averageBuyPrice}</td>
                    <td>Actual Value:</td>
                    <td> {actualValue}</td>
                </tr>

                <tr className="coin-detail-table-row">
                    <td colSpan={4}><Divider/></td>
                </tr>

                <tr className="coin-detail-table-row">
                    <td>Buy price sum:</td>
                    <td>{coinTradeSummary?.buyPriceSum}</td>
                    <td>Currently possible profit:</td>
                    <td className={getPossibleProfitClassName(coinTradeSummary?.actuallyPossibleProfit)}>{coinTradeSummary?.actuallyPossibleProfit}</td>
                </tr>
                <tr className="coin-detail-table-row">
                    <td>Sell price sum:</td>
                    <td>{coinTradeSummary?.sellPriceSum}</td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
            // </div>

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
                {/*{headTable()}*/}
                {headTableUpd()}

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
