import {useParams} from "react-router-dom";
import useFetch, {useFetchDelete} from "../../api/Api.ts";
import {DataGrid, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import addParams, {Parameter} from "../../utils/UrlBuilder.ts";
import {JSX, useEffect} from "react";
import {ListOrdersResponse, Order} from "../../types/Orders.ts";
import {Button} from "@mui/material";
import {MenuProps, NavigationDefinition} from "../../App.tsx";

export default function Orders(menuProps: MenuProps) {

    useEffect(() => {
        const navigationContent: NavigationDefinition[] = [
            {text: "Summary", link: "/binance/summary"},
            {text: "Orders", link: "/binance/orders"},
            {text: "Coins", link: "/binance/coins"},
        ]
        menuProps.setNavigationContent(navigationContent)
    }, []);

    const buyColumns: GridColDef[] = [
        {
            field: 'to',
            headerName: 'Coin',
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
                    CancelOrder(order.orderId)
                };

                return <Button onClick={onClick}>Delete</Button>;
            }
        },
    ];


    const sellColumns: GridColDef[] = [
        {
            field: 'from',
            headerName: 'Coin',
            headerClassName: 'my-header',
            type: 'string'
        },
        {
            field: 'sellQuantity',
            headerName: 'Qty',
            headerClassName: 'my-header',
            type: 'string'
        },
        {
            field: 'buyQuantity',
            headerName: 'Sell for $',
            headerClassName: 'my-header',
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

    const buyOrders = useFetch<ListOrdersResponse>(addParams('/binance/orders', buyParams))
    const sellOrders = useFetch<ListOrdersResponse>(addParams('/binance/orders', sellParams))

    if (buyOrders?.data === undefined || sellOrders?.data === undefined) {
        return (<div></div>)
    }

    // console.log("buyOrders")
    // console.log(buyOrders)
    //
    // console.log("sellOrders")
    // console.log(sellOrders)
    //
    function CancelOrder(orderId: string) {
        useFetchDelete<ListOrdersResponse>('/orders/' + orderId).then(r => console.log(r));
    }

    function RenewOrder(pair: string, order: Order) {
        // useFetchDelete<ListOrdersResponse>(addParams('/orders/' + orderId, cancelOrderParams)).then(r => console.log(r));
    }


    function ordersTable(): JSX.Element {
        return (

            <div className={"centered-element-wrapper"}>
                <div className={"centered-element"}>
                    <div style={{width: '100%'}}>
                        <h3>Buy orders</h3>
                        <DataGrid
                            rows={buyOrders.data}
                            columns={buyColumns}
                            initialState={{
                                pagination: {
                                    paginationModel: {page: 0, pageSize: 50},
                                },
                                sorting: {
                                    sortModel: [{field: 'from', sort: 'asc'}],
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
                            rows={sellOrders.data}
                            columns={sellColumns}
                            initialState={{
                                pagination: {
                                    paginationModel: {page: 0, pageSize: 50},
                                },
                                sorting: {
                                    sortModel: [{field: 'from', sort: 'asc'}],
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
