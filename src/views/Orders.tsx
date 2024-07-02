// import React from "react";
// import { useTranslation } from "react-i18next";

import {useParams} from "react-router-dom";
import useFetch from "../api/Api.ts";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import addParams, {Parameter} from "../utils/UrlBuilder.ts";
import {JSX} from "react";
import {ListOrdersResponse, Order} from "../types/Orders.ts";

// interface OrdersProps {
//     coinCode: string | undefined
// }props: OrdersProps | undefined

export default function Orders() {

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
            field: 'price',
            headerName: 'Price',
            type: 'number'
        },
        {
            field: 'actualPrice',
            headerName: 'Actual price',
            type: 'number'
        },

    ];

    const {code} = useParams();


    const params: Parameter[] = [{key: 'coinCodes', value: code}]

    const orders = useFetch<ListOrdersResponse>(addParams('/orders', params))

    if (orders === undefined) {
        return (<div></div>)
    }

    function ordersTable(): JSX.Element {
        return (
            <div style={{width: '100%'}}>
                <DataGrid
                    rows={orders.orders}
                    columns={columns}
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
        )
    }

    return (
        <div>
            <h2>Coin detail</h2>
            {ordersTable()}
        </div>
    );
}
