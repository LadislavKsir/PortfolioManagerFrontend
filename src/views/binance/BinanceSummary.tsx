import useFetch, {useFetchPost} from "../../api/Api.ts"
import {DataGrid, GridRowParams} from "@mui/x-data-grid";

import {useNavigate} from "react-router-dom";
import {CoinTradesSummary, CoinTradesSummaryResponse} from "../../types/CoinTradesSummary.ts";
import {ListTradesResponse} from "../../types/Trade.ts";
import {JSX, useEffect, useState} from "react";
import addParams, {Parameter} from "../../utils/UrlBuilder.ts";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TableContainer} from "@mui/material";
import {TradesSummarySnapshot} from "../../types/TradesSummarySnapshot.ts";
import {LineChart} from "@mui/x-charts";
import isStableCoin from "../../utils/StableCoins.ts";
import {MenuProps, NavigationDefinition} from "../../App.tsx";
import LoadingComponent from "../../components/LoadingComponent.tsx";

import {formatDateTimeString} from "../../utils/DateFormatter.ts";
import {lastTradesTableColumns, overviewTablecolumns} from "./BinanceSummaryTableDefinitions.tsx";
import SyncResultResponse from "../../types/SyncResultResponse.tsx"; // Add this import

export default function BinanceSummary(menuProps: MenuProps) {

    const navigate = useNavigate();

    const [checked, _] = useState(true);

    useEffect(() => {
        menuProps.setMenuComponentContent(contextualMenuComponent());

        const navigationContent: NavigationDefinition[] = [
            {text: "Summary", link: "/binance/summary"},
            {text: "Orders", link: "/binance/orders"},
            {text: "Coins", link: "/binance/coins"},
            {text: "Earn", link: "/binance/locked-subscriptions"},
        ]
        menuProps.setNavigationContent(navigationContent)
    }, []);

    function rowClick(params: GridRowParams) {
        navigate("/binance/coins/" + params.id);
    }


    const listTradesSummaryParams: Parameter[] = [{key: "skipNotOwnedCoins", value: checked}]
    const data = useFetch<CoinTradesSummaryResponse>(addParams('/binance/v1/trades-summary', listTradesSummaryParams))


    const listTradesParams: Parameter[] = [{key: "pageSize", value: 30}]
    const trades = useFetch<ListTradesResponse>(addParams('/binance/trades', listTradesParams))

    const snapshots: TradesSummarySnapshot[] = useFetch<TradesSummarySnapshot[]>('/binance/trades-summary-snapshots')

    function overviewTable(): JSX.Element {

        return (
            (data === undefined || data.coinTrades === undefined) ?
                <LoadingComponent/> : (
                    <div className={"centered-element-wrapper"}>
                        <div className={"centered-element"}>

                            <TableContainer>
                                <DataGrid
                                    rows={data.coinTrades}
                                    columns={overviewTablecolumns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {page: 0, pageSize: 50},
                                        },
                                        sorting: {
                                            sortModel: [{field: 'Actual %', sort: 'desc'}],
                                        }
                                    }}
                                    getRowId={(row: CoinTradesSummary) => {
                                        return row.coinCode;
                                    }}
                                    getRowClassName={(params) => {
                                        return params.row.unrealisedProfit > 0 ? "profit" : "loss";
                                    }}
                                    onRowClick={rowClick}
                                    pageSizeOptions={[50, 100]}
                                />
                            </TableContainer>
                        </div>
                    </div>
                )
        )
    }


    function SimpleLineChart() {
        if (snapshots === undefined) {
            return (<LoadingComponent/>)
        }
        const invested = snapshots.map((x) => x.invested);
        const actualValues = snapshots.map((x) => x.actualValue);

        const xLabels = snapshots.map((x) => formatDateTimeString(x.dateTime));

        return (
            <div className={"centered-element-wrapper"}>
                <div className={"centered-element"}>
                    <LineChart
                        width={1580}
                        height={500}
                        series={[
                            {data: invested, label: 'Invested'},
                            {data: actualValues, label: 'Actual value'},
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

    function lastTradesTable(): JSX.Element {
        return (
            (trades === undefined) ? (<LoadingComponent/>) : (
                <div className={"centered-element-wrapper"}>
                    <div className={"centered-element"}>
                        <DataGrid
                            rows={trades.trades}
                            columns={lastTradesTableColumns}
                            initialState={{
                                pagination: {
                                    paginationModel: {page: 0, pageSize: 50},
                                },
                                sorting: {
                                    sortModel: [{field: 'date', sort: 'desc'}],
                                }
                            }}
                            getRowClassName={(params) => {
                                return isStableCoin(params.row.from) ? "profit" : "loss";
                            }}
                            pageSizeOptions={[50, 100]}
                        />
                    </div>
                </div>
            )
        )
    }

    function syncButton() {
        function handleClick() {
            useFetchPost<SyncResultResponse>("/binance/trades/sync", {})
                .then(response => {
                    menuProps.dialogProps.content(renderResults(response))
                    menuProps.dialogProps.openClose(true)
                })
                .catch(err => {
                    menuProps.dialogProps.content(<div>{err}</div>)
                    menuProps.dialogProps.openClose(true)
                });
        }

        return (
            <Button variant="contained" className="my-button" onClick={handleClick}>Sync</Button>
        );
    }

    function renderResults(apiResponse: SyncResultResponse) {
        if (!apiResponse) return null;

        const {earnHistory, convertHistory} = apiResponse;

        return (
            <div>
                <h3>Locked Subscriptions</h3>
                <ul>
                    <li>Skipped: {earnHistory.lockedSubscriptions.skipped}</li>
                    <li>Persisted: {earnHistory.lockedSubscriptions.persisted}</li>
                    <li>Updated: {earnHistory.lockedSubscriptions.updated}</li>
                    <li>Removed: {earnHistory.lockedSubscriptions.removed}</li>
                </ul>

                <h3>Earn History</h3>
                <ul>
                    <li>Skipped: {earnHistory.earnHistoryItems.skipped}</li>
                    <li>Persisted: {earnHistory.earnHistoryItems.persisted}</li>
                    <li>Updated: {earnHistory.earnHistoryItems.updated}</li>
                    <li>Removed: {earnHistory.earnHistoryItems.removed}</li>
                </ul>

                <h3>Convert History</h3>
                <ul>
                    <li>Skipped: {convertHistory.skipped}</li>
                    <li>Persisted: {convertHistory.persisted}</li>
                    <li>Updated: {convertHistory.updated}</li>
                    <li>Removed: {convertHistory.removed}</li>
                </ul>
            </div>
        );
    }


    function contextualMenuComponent(): JSX.Element {
        // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //     console.log("handleChange-> %s, %s", checked, event.target.checked)
        //     setChecked(event.target.checked);
        // };

        // function skipNotOwnedCoinsCheckbox(): JSX.Element {
        //     const label = {inputProps: {'aria-label': 'Checkbox demo'}};
        //     return (<Checkbox {...label} checked={checked} onChange={handleChange}/>)
        // }

        return (
            <div>

                {/*{headTable()}*/}
                {syncButton()}
                {/*<div className={"centered-element-wrapper"}>*/}
                {/*<div className={"centered-element"}><p>Skip not owned coins? {checked}</p></div>*/}
                {/*<div className={"centered-element"}>{skipNotOwnedCoinsCheckbox()}</div>*/}
                {/*<div className={"centered-element"}></div>*/}
                {/*</div>*/}


            </div>
        )
    }

    return (

        <div>
            <h2>Summary</h2>

            {SimpleLineChart()}

            <h3>Overview</h3>
            {overviewTable()}

            <h3>Last trades</h3>
            {lastTradesTable()}
        </div>
    );
}
