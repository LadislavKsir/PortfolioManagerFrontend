// import React from "react";
// import { useTranslation } from "react-i18next";

import {useParams} from "react-router-dom";
import useFetch from "../api/Api.ts";
import {ListTradesResponse, Trade} from "../types/Trade.ts";
import {CoinTradesSummaryResponse} from "../types/CoinTradesSummary.ts";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import addParams, {Parameter} from "../utils/UrlBuilder.ts";
import {JSX} from "react";

interface CoinDetailProps {
    coinCode: string | undefined
}

export default function CoinDetail(props: CoinDetailProps | undefined) {

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
            valueGetter: (_, row: Trade) => row.from === "USDT" ? row.inversePrice : row.price,
        },
        {
            field: 'sellQuantity',
            headerName: 'Quantity',
            description: '',
            width: 180,
            valueGetter: (_, row: Trade) => row.from === "USDT" ? row.buyQuantity : row.sellQuantity,
        },
        {
            field: 'tradeValue',
            headerName: 'Trade value',
            description: '',
            width: 180,
            valueGetter: (_, row: Trade) => row.from === "USDT" ? row.sellQuantity : row.buyQuantity,
        },
        {
            field: 'date',
            headerName: 'Date',
            description: '',
            width: 180
        },

    ];

    const {code} = useParams();


    const params: Parameter[] = [{key: 'coinCodes', value: code}]

    const coinTrades = useFetch<ListTradesResponse>(addParams('/trades', params))
    const coinTradesSummary = useFetch<CoinTradesSummaryResponse>(addParams('/trades-summary', params));

    if (coinTrades === undefined || coinTradesSummary === undefined) {
        return (<div></div>)
    }

    const coinTradeSummary = coinTradesSummary.coinTrades.pop()

    if (coinTradeSummary === undefined) {
        return (<div></div>)
    }

    const value = coinTradeSummary.holding * coinTradeSummary.averageBuyPrice
    const actualValue = coinTradeSummary.holding * coinTradeSummary.actualPrice
    const rows = coinTrades.trades

    function headTable(): JSX.Element {
        return (
            <table className="my-table">
                <tbody>
                <tr className="my-table-row">
                    <td>Code:</td>
                    <td>{code}</td>
                    <td>Actual Value:</td>
                    <td> {actualValue}</td>
                </tr>
                <tr className="my-table-row">
                    <td>Holding:</td>
                    <td>{coinTradeSummary?.holding}</td>
                    <td>Buy Value:</td>
                    <td> {value}</td>
                </tr>
                <tr className="my-table-row">
                    <td>Current price:</td>
                    <td>{coinTradeSummary?.actualPrice}</td>
                    <td>Average buy price:</td>
                    <td>{coinTradeSummary?.averageBuyPrice}</td>
                </tr>
                <tr className="my-table-row">
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
            <div style={{width: '100%'}}>
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
                    pageSizeOptions={[50, 100]}
                />

            </div>
        )
    }

    return (
        <div>
            <h2>Coin detail</h2>

            {headTable()}
            {coinTradesTable()}
        </div>
    );
}
