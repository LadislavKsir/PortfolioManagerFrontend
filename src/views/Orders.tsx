import {useParams} from "react-router-dom";
import useFetch, {useFetchDelete} from "../api/Api.ts";
import {DataGrid, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import addParams, {Parameter} from "../utils/UrlBuilder.ts";
import {JSX} from "react";
import {ListOrdersResponse, Order} from "../types/Orders.ts";
import {Button} from "@mui/material";

export default function Orders() {

    const buyColumns: GridColDef[] = [
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
            field: 'inversePrice',
            headerName: 'Price',
            type: 'number'
        },
        {
            field: 'actualPrice',
            headerName: 'Actual price',
            type: 'number'
        },
        {
            field: "renew",
            headerName: "Renew",
            sortable: false,
            renderCell: (params: GridRenderCellParams) => {
                const onClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    const order = params.row
                    RenewOrder(order.to + order.from, order)
                };

                return <Button onClick={onClick}>Renew</Button>;
            }
        },
        {
            field: "cancel",
            headerName: "Cancel",
            sortable: false,
            renderCell: (params: GridRenderCellParams) => {
                const onClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    const order = params.row
                    CancelOrder(order.to + order.from, order.orderId)
                };

                return <Button onClick={onClick}>Delete</Button>;
            }
        },
    ];


    const sellColumns: GridColDef[] = [
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
            field: 'price',
            headerName: 'Price',
            type: 'number'
        },
        {
            field: 'actualPrice',
            headerName: 'Actual price',
            type: 'number'
        },
        {
            field: "renew",
            headerName: "Renew",
            sortable: false,
            renderCell: (params: GridRenderCellParams) => {
                const onClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    const order: Order = params.row;
                    RenewOrder(order.from + order.to, order)
                };

                return <Button onClick={onClick}>Renew</Button>;
            }
        },
        {
            field: "cancel",
            headerName: "Cancel",
            sortable: false,
            renderCell: (params: GridRenderCellParams) => {
                const onClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    const order: Order = params.row;
                    CancelOrder(order.from + order.to, order.orderId)
                };

                return <Button onClick={onClick}>Delete</Button>;
            }
        },

    ];

    const {code} = useParams();


    const buyParams: Parameter[] = [{key: 'coinCodes', value: code}, {key: 'type', value: "BUY"}]
    const sellParams: Parameter[] = [{key: 'coinCodes', value: code}, {key: 'type', value: "SELL"}]

    const buyOrders = useFetch<ListOrdersResponse>(addParams('/orders', buyParams))
    const sellOrders = useFetch<ListOrdersResponse>(addParams('/orders', sellParams))

    if (buyOrders === undefined || sellOrders === undefined) {
        return (<div></div>)
    }

    function CancelOrder(pair: string, orderId: string) {
        const cancelOrderParams: Parameter[] = [{key: 'pair', value: pair}]
        // useFetchDelete<ListOrdersResponse>(addParams('/orders/' + orderId, cancelOrderParams)).then(r => console.log(r));
    }

    function RenewOrder(pair: string, order: Order) {
        const cancelOrderParams: Parameter[] = [{key: 'pair', value: pair}]
        // useFetchDelete<ListOrdersResponse>(addParams('/orders/' + orderId, cancelOrderParams)).then(r => console.log(r));
    }


    function ordersTable(): JSX.Element {
        return (

            <div className={"centered-element-wrapper"}>
                <div className={"centered-element"}>
                    <div style={{width: '100%'}}>
                        <h3>Buy orders</h3>
                        <DataGrid
                            rows={buyOrders.orders}
                            columns={buyColumns}
                            initialState={{
                                pagination: {
                                    paginationModel: {page: 0, pageSize: 50},
                                },
                                sorting: {
                                    sortModel: [{field: 'date', sort: 'desc'}],
                                }
                            }}
                            getRowId={(row: Order) => {
                                return row.from + row.to + row.date;
                            }}
                            pageSizeOptions={[50, 100]}
                        />

                    </div>
                </div>
                <div className={"centered-element"}>
                    <div style={{width: '100%'}}>
                        <h3>Sell orders</h3>
                        <DataGrid
                            rows={sellOrders.orders}
                            columns={sellColumns}
                            initialState={{
                                pagination: {
                                    paginationModel: {page: 0, pageSize: 50},
                                },
                                sorting: {
                                    sortModel: [{field: 'date', sort: 'desc'}],
                                }
                            }}
                            getRowId={(row: Order) => {
                                return row.from + row.to + row.date;
                            }}
                            pageSizeOptions={[50, 100]}
                        />

                    </div>
                </div>
            </div>

        )
    }

    return (
        <div>
            <h2>Orders</h2>
            {ordersTable()}
        </div>
    );
}
