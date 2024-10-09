import {GridColDef} from "@mui/x-data-grid";
import {Trade} from "../../types/Trade.ts";
import isStableCoin from "../../utils/StableCoins.ts";
import {formatDateTime} from "../../utils/DateFormatter.ts";

export const coinDetailCoinTradesTableDefinition: GridColDef[] = [
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
        type: 'string',
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