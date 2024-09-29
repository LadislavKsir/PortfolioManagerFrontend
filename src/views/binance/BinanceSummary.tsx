import useFetch from "../../api/Api.ts"
import {DataGrid, GridRowParams} from "@mui/x-data-grid";

import {useNavigate} from "react-router-dom";
import {CoinTradesSummary, CoinTradesSummaryResponse} from "../../types/CoinTradesSummary.ts";
import {ListTradesResponse} from "../../types/Trade.ts";
import {JSX, useEffect, useState} from "react";
import addParams, {Parameter} from "../../utils/UrlBuilder.ts";
import {TableContainer} from "@mui/material";
import {TradesSummarySnapshot} from "../../types/TradesSummarySnapshot.ts";
import {LineChart} from "@mui/x-charts";
import isStableCoin from "../../utils/StableCoins.ts";
import {MenuProps} from "../../App.tsx";
import LoadingComponent from "../../components/LoadingComponent.tsx";

import {formatDateTimeString} from "../../utils/DateFormatter.ts";
import {lastTradesTableColumns, overviewTablecolumns} from "./BinanceSummaryTableDefinitions.tsx";
import {binanceNavigation} from "../../routing/NavigationDefinitionFactory.tsx";
import SyncButton from "../../components/SyncButton.tsx";


export default function BinanceSummary(menuProps: MenuProps) {

    const navigate = useNavigate();

    const [checked, _] = useState(true);

    useEffect(() => {
        menuProps.setMenuComponentContent(
            <div>
                <SyncButton content={menuProps.dialogProps.content}
                            openClose={menuProps.dialogProps.openClose}>
                </SyncButton>
            </div>
        );
        menuProps.setNavigationContent(binanceNavigation)
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

    // function syncButton() {
    //     // return <Button onClick={() => enqueueSnackbar('I love hooks')}>Show snackbar</Button>;
    //     function handleClick() {
    //         //
    //         useFetchPost<SyncResultResponse>("/binance/trades/sync", {})
    //             .then(response => {
    //                 menuProps.dialogProps.content(renderResults(response))
    //                 menuProps.dialogProps.openClose(true)
    //             })
    //             // .catch(err => {
    //                 // enqueueSnackbar(err.message, { variant: 'error' })
    //             // });
    //     }
    //
    //     return (
    //         <Button variant="contained" className="my-button" onClick={handleClick}>Sync</Button>
    //     );
    // }

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
