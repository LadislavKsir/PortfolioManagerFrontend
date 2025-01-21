// import useFetch, {useFetchDelete, useFetchPost} from "../../api/Api.ts";
// import {DataGrid, GridCellParams, GridColDef, GridRenderCellParams, GridValidRowModel} from "@mui/x-data-grid";
// import addParams, {Parameter} from "../../utils/UrlBuilder.ts";
// import {JSX, useEffect, useState} from "react";
// import {ListOrdersResponse, TradeOrder} from "../../types/Orders.ts";
// import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Tab, Tabs} from "@mui/material";
// import {MenuProps} from "../../App.tsx";
// import {formatDateTime} from "../../utils/DateFormatter.ts";
// import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
// import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
// import LoadingComponent from "../../components/LoadingComponent.tsx";
// import {fetchOkNotification} from "../../utils/NotificationsHelper.ts";
// import SyncButton from "../../components/SyncButton.tsx";
// import {binanceNavigation} from "../../routing/NavigationDefinitionFactory.tsx";
// import CoinSelect from "../../components/CoinSelect.tsx";
// import {formatNumberValue} from "../../utils/ValueFormatter.ts";
//
//
// const buyColumns: GridColDef[] = [
//     {
//         field: 'coinCodex',
//         headerName: 'Coin',
//         width: 175,
//         valueGetter: (_: never, row: TradeOrder) => row.from + " -> " + row.to,
//         renderCell: (params: GridRenderCellParams<GridValidRowModel, string>) => iconCell(params.value, 1)
//     },
//     {
//         field: 'buyQuantity',
//         headerName: 'Qty',
//         type: 'string',
//         width: 125,
//     },
//     {
//         field: 'sellQuantity',
//         headerName: 'Cost $',
//         type: 'string',
//         width: 125,
//     },
//     {
//         field: 'inversePrice',
//         headerName: 'Price',
//         type: 'number',
//         width: 125,
//         valueFormatter: (value?: number) => {
//             return formatNumberValue(value)
//         },
//     },
//     {
//         field: 'actualPrice',
//         headerName: 'Actual price',
//         type: 'number',
//         valueFormatter: (value?: number) => {
//             return formatNumberValue(value)
//         },
//         width: 125,
//
//     },
//     {
//         field: 'expireTime',
//         headerName: 'expireTime',
//         type: 'string',
//         valueGetter: (_: never, row: TradeOrder) => new Date(row.expireTime),
//         valueFormatter: (value?: Date) => {
//             return formatDateTime(value)
//         },
//         cellClassName: (params: GridCellParams<TradeOrder, string>) => {
//             return params.row.nearingExpiration ? "nearing-expiration" : "";
//         },
//         width: 120,
//     },
//
//     {
//
//         field: 'status',
//         headerName: 'Status',
//         type: 'string'
//     },
//     {
//
//         field: "renew",
//         headerName: "",
//         sortable: false,
//         width: 20,
//         renderCell: (params: GridRenderCellParams) => {
//             const onClick = (e: { stopPropagation: () => void; }) => {
//                 e.stopPropagation(); // don't select this row after clicking
//                 const order = params.row
//                 RenewOrder(order.id)
//             };
//
//             return (
//                 <div className="d-flex justify-content-between align-items-center" style={{cursor: "pointer"}}>
//                     <RefreshOutlinedIcon onClick={onClick}></RefreshOutlinedIcon>
//                 </div>
//             )
//         }
//     },
//     {
//
//         field: "cancel",
//         headerName: "",
//         sortable: false,
//         width: 20,
//         renderCell: (params: GridRenderCellParams) => {
//             const onClick = (e: { stopPropagation: () => void; }) => {
//                 e.stopPropagation(); // don't select this row after clicking
//                 const order = params.row
//                 CancelOrder(order.id)
//             };
//
//             return (
//                 <div className="d-flex justify-content-between align-items-center" style={{cursor: "pointer"}}>
//                     <DeleteOutlinedIcon onClick={onClick}
//                     ></DeleteOutlinedIcon>
//                 </div>
//             );
//         }
//     },
// ].map(column => ({
//     ...column,
//     filterable: false,
//     headerClassName: 'grid-header-cell'
// }));
//
// const sellColumns: GridColDef[] = [
//     {
//         field: 'coinCodex',
//         headerName: 'Coin',
//         width: 175,
//         valueGetter: (_: never, row: TradeOrder) => row.from + " -> " + row.to,
//         renderCell: (params: GridRenderCellParams<GridValidRowModel, string>) => iconCell(params.value, 0)
//     },
//     {
//         field: 'sellQuantity',
//         headerName: 'Qty',
//         type: 'string',
//         width: 125,
//     },
//     {
//         field: 'buyQuantity',
//         headerName: 'Sell for $',
//         type: 'string',
//         width: 125,
//     },
//     {
//         field: 'price',
//         headerName: 'Price',
//         type: 'number',
//         width: 125,
//         valueFormatter: (value?: number) => {
//             return formatNumberValue(value)
//         },
//     },
//     {
//         field: 'actualPrice',
//         headerName: 'Actual price',
//         type: 'number',
//         valueFormatter: (value?: number) => {
//             return formatNumberValue(value)
//         },
//         width: 125,
//     },
//     {
//         field: 'expireTime',
//         headerName: 'Expire date',
//         type: 'string',
//         cellClassName: (params: GridCellParams<TradeOrder, string>) => {
//             return params.row.nearingExpiration ? "nearing-expiration" : "";
//         },
//         valueGetter: (_: never, row: TradeOrder) => new Date(row.expireTime),
//         valueFormatter: (value?: Date) => {
//             return formatDateTime(value)
//         },
//         width: 120,
//     },
//     {
//         field: 'status',
//         headerName: 'Status',
//         type: 'string'
//     },
//     {
//         field: "renew",
//         headerName: "",
//         sortable: false,
//         width: 20,
//         renderCell: (params: GridRenderCellParams) => {
//             const onClick = (e: { stopPropagation: () => void; }) => {
//                 e.stopPropagation(); // don't select this row after clicking
//                 const order: TradeOrder = params.row;
//                 RenewOrder(order.id)
//             };
//
//             return (
//                 <div className="d-flex justify-content-between align-items-center" style={{cursor: "pointer"}}>
//                     <RefreshOutlinedIcon onClick={onClick}></RefreshOutlinedIcon>
//                 </div>
//             )
//
//         }
//     },
//     {
//         field: "cancel",
//         headerName: "",
//         sortable: false,
//         width: 20,
//         renderCell: (params: GridRenderCellParams) => {
//
//             const onClick = (e: { stopPropagation: () => void; }) => {
//                 e.stopPropagation(); // don't select this row after clicking
//                 const order: TradeOrder = params.row;
//                 CancelOrder(order.id)
//             };
//             return (
//                 <div className="d-flex justify-content-between align-items-center" style={{cursor: "pointer"}}>
//                     <DeleteOutlinedIcon onClick={onClick}
//                     ></DeleteOutlinedIcon>
//                 </div>
//             );
//
//         }
//     },
//
// ].map(column => ({
//     ...column,
//     filterable: false,
//     headerClassName: 'grid-header-cell',
// }));
