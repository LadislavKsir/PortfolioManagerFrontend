import useFetch from "../../api/Api.ts";
import {ListTradesResponse, Trade} from "../../types/Trade.ts";
import {CoinTradesSummaryResponse} from "../../types/CoinTradesSummary.ts";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import addParams, {Parameter} from "../../utils/UrlBuilder.ts";
import {JSX, useEffect} from "react";
import isStableCoin from "../../utils/StableCoins.ts";
import {useParams} from "react-router-dom";
import {MenuProps, NavigationDefinition} from "../../App.tsx";


export default function CoinDetail(menuProps: MenuProps) {

    useEffect(() => {
        const navigationContent: NavigationDefinition[] = [
            {text: "Summary", link: "/binance/summary"},
            {text: "Orders", link: "/binance/orders"},
            {text: "Coins", link: "/binance/coins"},
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
            type: 'dateTime',
            valueGetter: (_, row: Trade) => new Date(row.date),
        },

    ];

    const {code} = useParams();
    const params: Parameter[] = [{key: 'coinCodes', value: code}]

    const coinTrades = useFetch<ListTradesResponse>(addParams('/binance/trades', params))
    const coinTradesSummary = useFetch<CoinTradesSummaryResponse>(addParams('/binance/trades-summary', params));

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
                    <td> {value}</td>
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
                pageSizeOptions={[50, 100]}
            />
        )
    }

    return (

        <div className={"centered-element-wrapper"}>
            <div className={"centered-element"}>
                <h2>Coin detail</h2>
                {headTable()}
                {coinTradesTable()}
            </div>
        </div>

    );
}
