import {useParams} from "react-router-dom";
import useFetch, {useFetchDelete, useFetchPost} from "../../api/Api.ts";
import {DataGrid, GridCellParams, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import addParams, {Parameter} from "../../utils/UrlBuilder.ts";
import {JSX, useEffect} from "react";
import {ListOrdersResponse, Order} from "../../types/Orders.ts";
import {Button} from "@mui/material";
import {MenuProps, NavigationDefinition} from "../../App.tsx";
import {Trade} from "../../types/Trade.ts";

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
            type: 'string',
            width: 130,
            valueGetter: (_, row: Order) => row.to + " -> " + row.from,
        },
        {
            field: 'buyQuantity',
            headerName: 'Qty',
            headerClassName: 'my-header',
            type: 'string'
        },
        {
            field: 'sellQuantity',
            headerName: 'Cost $',
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
            field: 'expireTime',
            headerName: 'expireTime',
            type: 'dateTime',
            valueGetter: (_, row: Order) => new Date(row.expireTime),
            cellClassName: (params: GridCellParams<never, Date>) => {
                return nearingExpiration(params.value!) ? "nearing-expiration" : ""
            }
        },
        {
            field: "renew",
            headerName: "Renew",
            sortable: false,
            renderCell: (params: GridRenderCellParams) => {
                const onClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    const order = params.row
                    RenewOrder(order.orderId)
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
            type: 'string',
            width: 130,
            valueGetter: (_, row: Order) => row.from + " -> " + row.to,
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
            field: 'expireTime',
            headerName: 'expireTime',
            type: 'dateTime',
            valueGetter: (_, row: Order) => new Date(row.expireTime),
            cellClassName: (params: GridCellParams<never, Date>) => {
                return nearingExpiration(params.value!) ? "nearing-expiration" : ""
            }
        },
        {
            field: "renew",
            headerName: "Renew",
            sortable: false,
            renderCell: (params: GridRenderCellParams) => {
                const onClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    const order: Order = params.row;
                    RenewOrder(order.orderId)
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
                    CancelOrder(order.orderId)
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

    function nearingExpiration(date: Date): boolean {
        return Math.round((date - Date.now()) / (1000 * 3600 * 24)) <= 3

    }

    function CancelOrder(orderId: string) {
        useFetchDelete<ListOrdersResponse>('/binance/orders/' + orderId).then(r => console.log(r));
    }

    function RenewOrder(orderId: string) {
        useFetchPost<ListOrdersResponse>('/binance/orders/' + orderId, {}).then(r => console.log(r));
    }


    function pricesNear(row: Order): boolean {
        return (1 - (row.actualPrice / row.price)) <= 0.025
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
                            // getRowClassName={(params) => {
                            //     return pricesNear(params.row) > 0 ? "profit" : "";
                            // }}
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
                            getRowClassName={(params) => {
                                return pricesNear(params.row) > 0 ? "profit" : "";
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
