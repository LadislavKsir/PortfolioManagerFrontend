import useFetch from "../../api/Api.ts"
import {DataGrid, GridRowParams} from "@mui/x-data-grid";

import {useNavigate} from "react-router-dom";
import {CoinTradesSummary, CoinTradesSummaryResponse} from "../../types/CoinTradesSummary.ts";
import {ListTradesResponse} from "../../types/Trade.ts";
import {JSX, useEffect, useState} from "react";
import addParams, {Parameter} from "../../utils/UrlBuilder.ts";
import {TableContainer, TextField} from "@mui/material";
import {TradesSummarySnapshot} from "../../types/TradesSummarySnapshot.ts";
import {LineChart} from "@mui/x-charts";
import isStableCoin from "../../utils/StableCoins.ts";
import {MenuProps} from "../../App.tsx";
import LoadingComponent from "../../components/LoadingComponent.tsx";

import {formatDateTimeString} from "../../utils/DateFormatter.ts";
import {lastTradesTableColumns, overviewTablecolumns} from "./BinanceSummaryTableDefinitions.tsx";
import {binanceNavigation} from "../../routing/NavigationDefinitionFactory.tsx";
import SyncButton from "../../components/SyncButton.tsx";
import {removeUnncessaryDotsInValueArray} from "../../utils/Calculations.ts";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";


export default function BinanceSummary(menuProps: MenuProps) {

    const navigate = useNavigate();

    const [checked, _] = useState(true);

    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);

    useEffect(() => {
        menuProps.setMenuComponentContent(
            <div>
                <SyncButton content={menuProps.dialogProps.content}
                            openClose={menuProps.dialogProps.openClose}>
                </SyncButton>
            </div>
        );
        menuProps.setNavigationContent(binanceNavigation)

        document.title = 'Binance summary';
    }, []);

    function rowClick(params: GridRowParams) {
        navigate("/binance/coins/" + params.id);
    }


    const listTradesSummaryParams: Parameter[] = [
        {key: "skipNotOwnedCoins", value: checked}
    ]
    const data = useFetch<CoinTradesSummaryResponse>(addParams('/binance/trades/trades-summary', listTradesSummaryParams))


    const listTradesParams: Parameter[] = [{key: "pageSize", value: 30}]
    const trades = useFetch<ListTradesResponse>(addParams('/binance/trades', listTradesParams))

    function formatDateToBe(date: string | null) {
        if (date) {
            return dayjs(date).format('YYYY-MM-DD')
        }
        return null
    }

    const listTradesSummarySnapshotsParams: Parameter[] = [
        {key: "dateFrom", value: formatDateToBe(dateFrom)},
        {key: "dateTo", value: formatDateToBe(dateTo)}
    ]
    const snapshots: TradesSummarySnapshot[] = useFetch<TradesSummarySnapshot[]>(addParams('/binance/trades/summary-snapshots', listTradesSummarySnapshotsParams))

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
        const invested = removeUnncessaryDotsInValueArray(snapshots.map((x) => x.invested));
        const actualValues = snapshots.map((x) => x.actualValue);

        const xLabels = snapshots.map((x) => formatDateTimeString(x.dateTime));

        return (
            <div className={"centered-element-wrapper"}>
                <div className={"centered-element"}>
                    <LineChart
                        width={1580}
                        height={500}
                        series={[
                            {data: invested, connectNulls: true, showMark: false, label: 'Invested'},
                            {data: actualValues, showMark: false, label: 'Actual value'},
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

    function datePickers(): JSX.Element {
        const handleDateFromChange = (newDate) => {
            setDateFrom(newDate);
        };

        const handleDateToChange = (newDate) => {
            setDateTo(newDate);
        };

        return (
            <div className={"centered-element-wrapper"}>
                <div className={"centered-element"}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Select Date From"
                            value={dateFrom}
                            onChange={handleDateFromChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>
                <div className={"centered-element"}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Select Date To"
                            value={dateTo}
                            onChange={handleDateToChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>
            </div>
        )
    }

    return (

        <div>
            <h2>Summary</h2>

            {SimpleLineChart()}
            {datePickers()}

            <h3>Overview</h3>
            {overviewTable()}

            <h3>Last trades</h3>
            {lastTradesTable()}
        </div>
    );
}
