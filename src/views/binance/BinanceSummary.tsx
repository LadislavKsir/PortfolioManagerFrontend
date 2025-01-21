import useFetch from "../../api/Api.ts"
import {DataGrid, GridColDef, GridRenderCellParams, GridRowParams} from "@mui/x-data-grid";

import {useNavigate} from "react-router-dom";
import {CoinTradesSummary, CoinTradesSummaryResponse} from "../../types/CoinTradesSummary.ts";
import {ListTradesResponse, Trade} from "../../types/Trade.ts";
import {JSX, useEffect, useState} from "react";
import addParams, {Parameter} from "../../utils/UrlBuilder.ts";
import { TableContainer, TextField} from "@mui/material";
import {TradesSummarySnapshot} from "../../types/TradesSummarySnapshot.ts";
import {LineChart} from '@mui/x-charts/LineChart';
import isStableCoin from "../../utils/StableCoins.ts";
import {MenuProps} from "../../App.tsx";
import LoadingComponent from "../../components/LoadingComponent.tsx";

import {formatDateTime, formatDateTimeString} from "../../utils/DateFormatter.ts";
import {overviewTablecolumns} from "./BinanceSummaryTableDefinitions.tsx";
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

    // const [hoveredRow, setHoveredRow] = useState<null | Trade>(null);
    // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const lastTradesTableColumns: GridColDef[] = [
        {

            field: 'from',
            headerName: 'From',
            type: 'string',
            renderCell: (params: GridRenderCellParams<any, string>) => (
                <div
                    onMouseEnter={(e) => handleMouseEnter(e, params.row)}
                    // onMouseLeave={debounce(handleMouseLeave, 1000)}
                >{params.value}</div>
            )
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
            type: 'dateTime',
            valueGetter: (_, row: Trade) => new Date(row.date),
            valueFormatter: (value?: Date) => {
                return formatDateTime(value)
            }
        },
        {

            field: 'orderType',
            headerName: 'orderType',
            description: '',
            width: 180,
            type: 'string'
        },
    ];

    const handleMouseEnter = (event: React.MouseEvent, row: Trade) => {
        // console.log("handleMouseEnter %o", row)
        // setHoveredRow(row);
        // setAnchorEl(event.currentTarget);
    };

    const handleMouseLeave = () => {
        // console.log("handleMouseLeave")
        //
        // setHoveredRow(null);
        // setAnchorEl(null);

    };

    const debounce = (mainFunction, delay) => {
        // Declare a variable called 'timer' to store the timer ID
        let timer;

        // Return an anonymous function that takes in any number of arguments
        return function (...args) {
            // Clear the previous timer to prevent the execution of 'mainFunction'
            clearTimeout(timer);

            // Set a new timer that will execute 'mainFunction' after the specified delay
            timer = setTimeout(() => {
                mainFunction(...args);
            }, delay);
        };
    };


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

    function sumTable(): JSX.Element {
        const getPossibleProfitClassName = (possibleProfit: string | undefined): string => {
            return (possibleProfit === undefined || parseFloat(possibleProfit) < 0) ? "loss" : "profit"
        }

        return (data === undefined) ?
            <LoadingComponent/> : (

                <table className="coin-detail-table max-width-75">
                    <tbody>
                    <tr className="coin-detail-table-row">
                        <td>Buy price sum:</td>
                        <td>{data?.totalBuyPriceSum}</td>

                        <td>Invested:</td>
                        <td>{data.totalInvested}</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr className="coin-detail-table-row">
                        <td>Sell price sum:</td>
                        <td>{data?.totalSellPriceSum}</td>
                        <td>Actual value:</td>
                        <td className={(data.totalActualValue - data.totalInvested) < 0 ? "loss" : "profit"}>{data.totalActualValue}</td>

                        <td>Currently possible profit:</td>
                        <td className={getPossibleProfitClassName(data?.actuallyPossibleProfit)}>{data?.actuallyPossibleProfit}</td>
                    </tr>
                    </tbody>
                </table>

            )
    }

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

        const notNullInvested: number[] = invested.filter(n => n)
        const investedMin = Math.min(...notNullInvested);
        const investedMax = Math.max(...notNullInvested);

        const notNullAv: number[] = actualValues.filter(n => n)
        const avMin = Math.min(...notNullAv)
        const avMax = Math.max(...notNullAv)

        const yMin = Math.min(investedMin, avMin) - 30
        const yMax = Math.max(investedMax, avMax) + 10

        const xLabels = snapshots.map((x) => formatDateTimeString(x.dateTime));
        return (
            <div className={"centered-element-wrapper"}>
                <div className={"centered-element"}>
                    <LineChart
                        width={1580}
                        height={500}
                        series={[
                            {data: invested, connectNulls: true, showMark: false, label: 'Invested', baseline: 60},
                            {data: actualValues, showMark: false, label: 'Actual value', baseline: 60},
                        ]}
                        xAxis={[
                            {scaleType: 'point', data: xLabels},

                        ]}
                        yAxis={[
                            {min: yMin, max: yMax}
                            // min: 100, // Start Y-axis at 100
                            // max: 160, // Set an appropriate max if you want to control the range
                        ]}
                        grid={{vertical: true, horizontal: true}}
                    />

                </div>
            </div>
        );
    }

    function getTooltipProfitValue(row: Trade): string {
        const price = isStableCoin(row.from) ? row.inversePrice : row.price
        const quantity = isStableCoin(row.from) ? row.buyQuantity : row.sellQuantity
        const tradeValue = isStableCoin(row.from) ? row.sellQuantity : row.buyQuantity
        return tradeValue
    }

    function getTooltipCoinsLabel(row: Trade): string {
        return row.from + ' -> ' + row.to
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

                    {/*{hoveredRow && anchorEl && (*/}
                    {/*    <Popover*/}
                    {/*        open={Boolean(anchorEl)}*/}
                    {/*        anchorEl={anchorEl}*/}
                    {/*        onClose={() => setAnchorEl(null)}*/}
                    {/*        onMouseEnter={()=>{*/}
                    {/*            console.log("onMouseEnter")*/}
                    {/*        }}*/}
                    {/*        onMouseLeave={() => {*/}
                    {/*            console.log("onMouseLeave Popover")*/}
                    {/*            setAnchorEl(null)*/}
                    {/*        }}*/}
                    {/*        anchorOrigin={{*/}
                    {/*            vertical: 'top',*/}
                    {/*            horizontal: 'left',*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <div style={{padding: '16px'}}>*/}
                    {/*            <h4>{getTooltipCoinsLabel(hoveredRow)} </h4>*/}
                    {/*            <p>Unrealized Profit: {getTooltipProfitValue(hoveredRow)}</p>*/}
                    {/*        </div>*/}
                    {/*    </Popover>*/}
                    {/*)}*/}
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
            {sumTable()}
            {SimpleLineChart()}
            {datePickers()}

            <h3>Overview</h3>
            {overviewTable()}

            <h3>Last trades</h3>
            {lastTradesTable()}
        </div>
    );
}
