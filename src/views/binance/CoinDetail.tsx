import useFetch from "../../api/Api.ts";
import {Trade} from "../../types/Trade.ts";
import addParams, {addPathVariable, Parameter} from "../../utils/UrlBuilder.ts";
import {JSX, useEffect} from "react";
import isStableCoin from "../../utils/StableCoins.ts";
import {useParams} from "react-router-dom";
import {MenuProps} from "../../App.tsx";
import {LineChart} from "@mui/x-charts";
import {TradesSummarySnapshot} from "../../types/TradesSummarySnapshot.ts";
import {formatDateTimeString} from "../../utils/DateFormatter.ts";
import LoadingComponent from "../../components/LoadingComponent.tsx";
import {CoinDetailResponse} from "../../types/CoinDetailResponse.ts";
import {removeUnncessaryDotsInValueArray} from "../../utils/Calculations.ts";
import {NavigationDefinition} from "../../routing/NavigationDefinition.tsx";
import {Divider} from '@mui/material';
import {formatNumberValue} from "../../utils/ValueFormatter.ts";
import {PagedResponse} from "../../types/common/PagedResponse.ts";
import DataTable, {ColumnDefinition} from "../../components/common/DataTable.tsx";
import {urlBuilder} from "../../utils/UrlBuilderNew.ts";

export default function CoinDetail(menuProps: MenuProps) {

    const {code} = useParams() as { code: string };
    const params: Parameter[] = [{key: 'coinCodes', value: code}]

    const coinTrades = useFetch<PagedResponse<Trade>>(addParams('/binance/trades', params))

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

    if (coinDetail === undefined) {
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
    const rows = coinTrades.data

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
                            {
                                data: buys,
                                showMark: true,
                                label: 'Buy',
                                valueFormatter: value => formatNumberValue(value)
                            },
                            {
                                data: sells,
                                showMark: true,
                                label: 'Sell',
                                valueFormatter: value => formatNumberValue(value)
                            },
                            {
                                data: actual,
                                showMark: false,
                                connectNulls: true,
                                label: 'Actual',
                                valueFormatter: value => formatNumberValue(value)
                            },
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

    function getTextColor(row: Trade) {
        if (isStableCoin(row.from)) {
            if (row.inversePrice > coinTradeSummary?.actualPrice) {
                return 'green'
            } else {
                // return 'limegreen'
                return 'green'
            }
        } else {
            return 'crimson';
        }
    }

    function getFontWeight(row: Trade) {
        if (isStableCoin(row.from) && row.inversePrice < coinTradeSummary?.actualPrice) {
            return 800
        } else {
            return 600
        }
    }

    function tradesTable(): JSX.Element {
        const columns: ColumnDefinition<Trade>[] = [
            {key: 'from', label: 'From', align: 'left'},
            {key: 'to', label: 'To', align: 'left'},
            {
                key: 'averageBuyPrice', label: 'Price', align: 'left', valueGetter: (row: Trade) => {
                    return isStableCoin(row.from) ? row.inversePrice : row.price
                }
            },
            {
                key: 'sellQuantity', label: 'Quantity', align: 'left', valueGetter: (row: Trade) => {
                    return isStableCoin(row.from) ? row.buyQuantity : row.sellQuantity
                }
            },
            {
                key: 'tradeValue', label: 'Trade value', align: 'right', valueGetter: (row: Trade) => {
                    return isStableCoin(row.from) ? row.sellQuantity : row.buyQuantity
                }
            },
            {
                key: 'date', label: 'Date', align: 'right', valueFormatter: (value?: string) => {
                    return formatDateTimeString(value)
                }
            },
            {key: 'orderType', label: 'Type', align: 'right'}
        ];


        const url = urlBuilder(`http://192.168.0.106:8080/api/binance/trades`)
            .addParameter("coinCodes", code)
            .build()



        return (
            <DataTable<Trade> columns={columns}
                              data={null}
                              dataSourceUrl={url}
                              getRowId={(row) => row.id}
                              paged={true}
                              getRowSx={(row) => ({
                                  '& .MuiTableCell-root': {
                                      color: getTextColor(row),
                                      fontWeight: getFontWeight(row),

                                  },
                              })}
            />
        )

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

                <h3>Trades</h3>
                {tradesTable()}
            </div>
        </div>

    );
}
