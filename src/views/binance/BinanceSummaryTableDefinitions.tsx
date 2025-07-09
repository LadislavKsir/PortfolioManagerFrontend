import {GridColDef, GridRenderCellParams, GridValidRowModel} from "@mui/x-data-grid";
import {CoinTradesSummary} from "../../types/CoinTradesSummary.ts";
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
        valueGetter: (_, row: CoinTradesSummary) => parseFloat(row.actualPrice).toFixed(5),
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
        valueGetter: (_, row: CoinTradesSummary) => {return parseFloat(row.unrealisedProfit).toFixed(5)},
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


