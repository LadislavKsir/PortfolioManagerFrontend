import {GridColDef, GridRenderCellParams, GridValidRowModel} from "@mui/x-data-grid";
import {CoinTradesSummary} from "../../types/CoinTradesSummary.ts";
import {Trade} from "../../types/Trade.ts";
import isStableCoin from "../../utils/StableCoins.ts";
import {formatDateTime} from "../../utils/DateFormatter.ts";
import {getCurrentPercentFromCoinTradesSummary} from "../../utils/Calculations.ts";

export const overviewTablecolumns: GridColDef[] = [
    {
        field: 'coinCodex',
        headerName: 'Coin',
        valueGetter: (_, row: CoinTradesSummary) => row.coinCode,
        renderCell: (params: GridRenderCellParams<GridValidRowModel, string>) => {
            if (params.value) {
                return (
                    <div className={"coin-icon-div"}>
                        <img
                            className={"coin-icon"}
                            src={"/icons/" + params.value + ".png"}
                        >
                        </img>{params.value}
                    </div>
                );
            } else {
                return (<div></div>)
            }

        }
    },
    {

        field: 'holding',
        headerName: 'Holding',
        type: 'number',
        width: 130,
        valueGetter: (_, row: CoinTradesSummary) => parseFloat(row.holding).toFixed(6),
    },
    {

        field: 'totalBuyPrice',
        headerName: 'Buy value',
        description: '',
        type: 'number',
        valueGetter: (_, row: CoinTradesSummary) => parseFloat(row.totalBuyPrice).toFixed(6),
    },
    {

        field: 'Actual value',
        headerName: 'Actual value',
        type: 'number',
        valueGetter: (_, row: CoinTradesSummary) => parseFloat(row.holding) * row.actualPrice,
    },
    {

        field: 'Actual %',
        headerName: 'Actual %',
        type: 'number',
        width: 130,
        valueGetter: (_, row: CoinTradesSummary) => getCurrentPercentFromCoinTradesSummary(row),
        valueFormatter: (value: number) => {
            return value.toFixed(2) + "%"
        },
    },

    {

        field: 'actualPrice',
        headerName: 'Actual price',
        description: '',
        width: 180,
        valueGetter: (_, row: CoinTradesSummary) => row.actualPrice.toFixed(5),
    },

    {

        field: 'averageBuyPrice',
        headerName: 'Average buy price',
        description: '',
        width: 180,
        valueGetter: (_, row: CoinTradesSummary) => parseFloat(row.averageBuyPrice).toFixed(5),
    },
    {

        field: 'unrealisedProfit',
        headerName: 'Unrealised Profit',
        description: '',
        width: 180,
        valueGetter: (_, row: CoinTradesSummary) => row.unrealisedProfit.toFixed(5),
    },
    {

        field: 'lowestBuyPrice',
        headerName: 'Lowest buy price',
        description: '',
        width: 180,
        valueGetter: (_, row: CoinTradesSummary) => parseFloat(row.lowestBuyPrice).toFixed(5),
    },
    {

        field: 'highestBuyPrice',
        headerName: 'Highest buy price',
        description: '',
        width: 200,
        valueGetter: (_, row: CoinTradesSummary) => parseFloat(row.highestBuyPrice).toFixed(5),
    },
];

export const lastTradesTableColumns: GridColDef[] = [
    {

        field: 'from',
        headerName: 'From',
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

