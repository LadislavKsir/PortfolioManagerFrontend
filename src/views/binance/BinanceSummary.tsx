import useFetch from "../../api/Api.ts"
import {DataGrid, GridRowParams} from "@mui/x-data-grid";

import {useNavigate} from "react-router-dom";
import {CoinTradesSummary, CoinTradesSummaryResponse} from "../../types/CoinTradesSummary.ts";
import {Trade} from "../../types/Trade.ts";
import {JSX, useEffect, useState} from "react";
import {TableContainer} from "@mui/material";

import isStableCoin from "../../utils/StableCoins.ts";
import {MenuProps} from "../../App.tsx";
import LoadingComponent from "../../components/LoadingComponent.tsx";

import {formatDateTimeString} from "../../utils/DateFormatter.ts";
import {overviewTablecolumns} from "./BinanceSummaryTableDefinitions.tsx";
import {binanceNavigation} from "../../routing/NavigationDefinitionFactory.tsx";
import SyncButton from "../../components/SyncButton.tsx";
import DataTable, {ColumnDefinition} from "../../components/common/DataTable.tsx";
import {urlBuilder} from "../../utils/UrlBuilderNew.ts";
import {SummarySnapshots} from "../../components/binance/SummarySnapshots.tsx";

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

        document.title = 'Binance summary';
    }, []);

    function rowClick(params: GridRowParams) {
        navigate("/binance/coins/" + params.id);
    }

    const url = urlBuilder('/binance/trades/trades-summary')
        .addParameter("skipNotOwnedCoins", checked)
        .build();
    const data = useFetch<CoinTradesSummaryResponse>(url)



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

    function tradesTable(): JSX.Element {
        const columns: ColumnDefinition<Trade>[] = [
            {key: 'from', label: 'From', align: 'left'},
            {key: 'to', label: 'To', align: 'left'},
            {
                key: 'averageBuyPrice', label: 'Price', align: 'left', valueGetter: (row: Trade) => {
                    return isStableCoin(row.from) ? row.inversePrice : row.price
                }
            },
            {
                key: 'sellQuantity', label: 'Quantity', align: 'left', valueGetter: (row: Trade) => {
                    return isStableCoin(row.from) ? row.buyQuantity : row.sellQuantity
                }
            },
            {
                key: 'tradeValue', label: 'Trade value', align: 'right', valueGetter: (row: Trade) => {
                    return isStableCoin(row.from) ? row.sellQuantity : row.buyQuantity
                }
            },
            {
                key: 'date', label: 'Date', align: 'right', valueFormatter: (value?: string) => {
                    return formatDateTimeString(value)
                }
            },
            {key: 'orderType', label: 'Type', align: 'right'}
        ];

        return (
            <DataTable<Trade> columns={columns}
                              data={null}
                              dataSourceUrl={`http://192.168.0.106:8080/api/binance/trades`}
                              getRowId={(row) => row.id}
                              paged={true}
            />
        )
    }

    return (
        <div>
            <h2>Summary</h2>
            {sumTable()}
            { <SummarySnapshots/>}

            <h3>Overview</h3>
            {overviewTable()}

            <h3>Trades</h3>
            {tradesTable()}
        </div>
    );
}
