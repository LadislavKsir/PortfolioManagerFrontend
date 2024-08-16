import useFetch, {useFetchPost} from "../../api/Api.ts"
import {DataGrid, GridColDef, GridRowParams} from "@mui/x-data-grid";

import {useNavigate} from "react-router-dom";
import {CoinTradesSummary, CoinTradesSummaryResponse} from "../../types/CoinTradesSummary.ts";
import {ListTradesResponse, Trade} from "../../types/Trade.ts";
import {JSX, useEffect, useState} from "react";
import addParams, {Parameter} from "../../utils/UrlBuilder.ts";
import {Button, TableContainer} from "@mui/material";
import {TradesSummarySnapshot} from "../../types/TradesSummarySnapshot.ts";
import {LineChart} from "@mui/x-charts";
import isStableCoin from "../../utils/StableCoins.ts";
import {MenuProps, NavigationDefinition} from "../../App.tsx";

function getCurrentPercent(row: CoinTradesSummary) {
    const diff = (row.currentlyInvested) / (row.actualValue)
    if (diff > 1) {
        return -(diff - 1) * 100
    } else {
        return +(1 - diff) * 100
    }
}

//
// {
//     "coinCode": "ADA",
//     "buyPriceSum": "14.35509068",
//     "sellPriceSum": "4.01760911",
//     "totalAmountBought": "26.56880114",
//     "totalAmountSold": "5.44598126",
//     "currentlyInvested": "10.33748157",
//     "holding": "21.12281988",
//     "actualValue": 7.255879141514035,
//     "averagePrice": "0.48939875",
//     "actualPrice": 0.34350901928507266,
//     "unrealisedProfitOrLoss": 3.081602428485966
// },

const overviewTablecolumns: GridColDef[] = [
    {
        field: 'coinCode',
        headerName: 'Coin',
        type: 'string'
    },
    {
        field: 'x',
        headerName: '',
        type: 'number',
        width: 20,
        valueGetter: (_, __: CoinTradesSummary) => "",
    },
    {
        field: 'currentlyInvested',
        headerName: 'Buy value',
        description: '',
        valueGetter: (_, row: CoinTradesSummary) => parseFloat(row.currentlyInvested).toFixed(3),
    },
    {
        field: 'actualValue',
        headerName: 'Actual value',
        type: 'number',
        valueGetter: (_, row: CoinTradesSummary) => row.actualValue.toFixed(3),
    },
    {
        field: 'Actual %',
        headerName: 'Actual %',
        type: 'number',
        valueGetter: (_, row: CoinTradesSummary) => getCurrentPercent(row),
    },
    {
        field: 'xx',
        headerName: '',
        type: 'number',
        valueGetter: (_, __: CoinTradesSummary) => "",
    },
    {
        field: 'holding',
        headerName: 'Holding',
        type: 'number',
        valueGetter: (_, row: CoinTradesSummary) => parseFloat(row.holding).toFixed(5),
    },

    {
        field: 'actualPrice',
        headerName: 'Actual price',
        description: '',
        width: 180,
        valueGetter: (_, row: CoinTradesSummary) => row.actualPrice.toFixed(3),
    },
    {
        field: 'averagePrice',
        headerName: 'Average buy price',
        description: '',
        width: 180,
        valueGetter: (_, row: CoinTradesSummary) => parseFloat(row.averagePrice).toFixed(3),
    },
    {
        field: 'unrealisedProfitOrLoss',
        headerName: 'Unrealised Profit',
        description: '',
        width: 180
    }
];

const lastTradesTableColumns: GridColDef[] = [
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
        type: 'dateTime',
        valueGetter: (_, row: Trade) => new Date(row.date),
    },


];


export default function BinanceSummary(menuProps: MenuProps) {

    const navigate = useNavigate();

    const [checked, _] = useState(true);

    useEffect(() => {
        console.log("setMenuComponentContent(menuComponent());")
        menuProps.setMenuComponentContent(contextualMenuComponent());

        const navigationContent: NavigationDefinition[] = [
            {text: "Summary", link: "/binance/summary"},
            {text: "Orders", link: "/binance/orders"},
            {text: "Coins", link: "/binance/coins"},
        ]
        menuProps.setNavigationContent(navigationContent)
    }, []);

    function rowClick(params: GridRowParams) {
        navigate("/binance/coins/" + params.id);
    }


    const listTradesSummaryParams: Parameter[] = [{key: "skipNotOwnedCoins", value: checked}]
    const data = useFetch<CoinTradesSummaryResponse>(addParams('/binance/v2/trades-summary', listTradesSummaryParams))


    const listTradesParams: Parameter[] = [{key: "pageSize", value: 10}]
    const trades = useFetch<ListTradesResponse>(addParams('/binance/trades', listTradesParams))

    // const snapshots: TradesSummarySnapshot[] = useFetch<TradesSummarySnapshot[]>('/binance/trades-summary-snapshots')

    if (data === undefined || data.coinTrades === undefined) return (<div></div>)


    function overviewTable(): JSX.Element {

        return (
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
                                    sortModel: [{field: 'unrealisedProfitOrLoss', sort: 'desc'}],
                                }
                            }}
                            getRowId={(row: CoinTradesSummary) => {
                                return row.coinCode;
                            }}
                            getRowClassName={(params) => {
                                return params.row.unrealisedProfitOrLoss > 0 ? "profit" : "loss";
                            }}
                            onRowClick={rowClick}
                            pageSizeOptions={[50, 100]}
                        />
                    </TableContainer>

                </div>
            </div>
        )
    }


    // function SimpleLineChart() {
    //     const pData = snapshots.map((x) => x.actualValue);
    //     const xLabels = snapshots.map((x) => new Date(x.dateTime).toLocaleString());
    //
    //     const cashflows = [20,30,40]
    //
    //     return (
    //         <div className={"centered-element-wrapper"}>
    //             <div className={"centered-element"}>
    //                 <LineChart
    //                     width={1580}
    //                     height={500}
    //                     series={[
    //                         {data: pData, label: 'Actual value'},
    //                         // {data: cashflows, label: 'Cashflow'},
    //                     ]}
    //                     xAxis={[
    //                         {scaleType: 'point', data: xLabels},
    //
    //                     ]}
    //                     grid={{ vertical: true, horizontal: true }}
    //                 />
    //             </div>
    //         </div>
    //
    //     );
    // }

    function lastTradesTable(): JSX.Element {

        return (
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
    }

    function syncButton() {

        function handleClick() {
            useFetchPost("/binance/trades/sync", {}).then(r => console.log(r))
        }

        return (
            <Button variant="contained" className="my-button" onClick={handleClick}>Sync</Button>
        )
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

            {/*{SimpleLineChart()}*/}

            <h3>Overview</h3>
            {overviewTable()}

            <h3>Last trades</h3>
            {lastTradesTable()}
        </div>
    );
}
