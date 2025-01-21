import useFetch, {useFetchDelete, useFetchPost} from "../../api/Api.ts";
import {DataGrid, GridCellParams, GridColDef, GridRenderCellParams, GridValidRowModel} from "@mui/x-data-grid";
import addParams, {Parameter} from "../../utils/UrlBuilder.ts";
import {JSX, useEffect, useState} from "react";
import {ListOrdersResponse, TradeOrder} from "../../types/Orders.ts";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Tab, Tabs} from "@mui/material";
import {MenuProps} from "../../App.tsx";
import {formatDateTime} from "../../utils/DateFormatter.ts";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import LoadingComponent from "../../components/LoadingComponent.tsx";
import {fetchOkNotification} from "../../utils/NotificationsHelper.ts";
import SyncButton  from "../../components/SyncButton.tsx";
import {binanceNavigation} from "../../routing/NavigationDefinitionFactory.tsx";
import CoinSelect from "../../components/CoinSelect.tsx";
import {formatNumberValue} from "../../utils/ValueFormatter.ts";

export default function Orders(menuProps: MenuProps) {
    // const {code} = useParams();

    const [statusSelectValue, setStatusSelectValue] = useState<string | undefined>('PROCESS');
    const [activeTab, setActiveTab] = useState(1);
    const [selectedCoin, setSelectedCoin] = useState<string>("");


    useEffect(() => {
        menuProps.setMenuComponentContent(
            (
                <div>
                    <SyncButton content={menuProps.dialogProps.content}
                                openClose={menuProps.dialogProps.openClose}>
                    </SyncButton>
                </div>
            )
        );
        menuProps.setNavigationContent(binanceNavigation())

        document.title = 'Orders';
    }, []);



    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    function iconCell(coinCode:string | undefined, index: number):JSX.Element{
        if (coinCode) {
            return (
                <div className={"coin-icon-div"}>
                    <img
                        className={"coin-icon"}
                        src={"/icons/" + coinCode.split(" -> ")[index] + ".png"}
                    >
                    </img>{coinCode}
                </div>
            );
        } else {
            return (<div></div>)
        }
    }

    const buyColumns: GridColDef[] = [
        {
            field: 'coinCodex',
            headerName: 'Coin',
            width: 175,
            valueGetter: (_: never, row: TradeOrder) => row.from + " -> " + row.to,
            renderCell: (params: GridRenderCellParams<GridValidRowModel, string>) => iconCell(params.value, 1)
        },
        {
            field: 'buyQuantity',
            headerName: 'Qty',
            type: 'string',
            width: 125,
        },
        {
            field: 'sellQuantity',
            headerName: 'Cost $',
            type: 'string',
            width: 125,
        },
        {
            field: 'inversePrice',
            headerName: 'Price',
            type: 'number',
            width: 125,
            valueFormatter: (value?: number) => {
                return formatNumberValue(value)
            },
        },
        {
            field: 'actualPrice',
            headerName: 'Actual price',
            type: 'number',
            valueFormatter: (value?: number) => {
                return formatNumberValue(value)
            },
            width: 125,

        },
        {
            field: 'expireTime',
            headerName: 'expireTime',
            type: 'string',
            valueGetter: (_: never, row: TradeOrder) => new Date(row.expireTime),
            valueFormatter: (value?: Date) => {
                return formatDateTime(value)
            },
            cellClassName: (params: GridCellParams<TradeOrder, string>) => {
                return params.row.nearingExpiration ? "nearing-expiration" : "";
            },
            width: 120,
        },

        {

            field: 'status',
            headerName: 'Status',
            type: 'string'
        },
        {

            field: "renew",
            headerName: "",
            sortable: false,
            width: 20,
            renderCell: (params: GridRenderCellParams) => {
                const onClick = (e: { stopPropagation: () => void; }) => {
                    e.stopPropagation(); // don't select this row after clicking
                    const order = params.row
                    RenewOrder(order.id)
                };

                return (
                    <div className="d-flex justify-content-between align-items-center" style={{cursor: "pointer"}}>
                        <RefreshOutlinedIcon onClick={onClick}></RefreshOutlinedIcon>
                    </div>
                )
            }
        },
        {

            field: "cancel",
            headerName: "",
            sortable: false,
            width: 20,
            renderCell: (params: GridRenderCellParams) => {
                const onClick = (e: { stopPropagation: () => void; }) => {
                    e.stopPropagation(); // don't select this row after clicking
                    const order = params.row
                    CancelOrder(order.id)
                };

                return (
                    <div className="d-flex justify-content-between align-items-center" style={{cursor: "pointer"}}>
                        <DeleteOutlinedIcon onClick={onClick}
                        ></DeleteOutlinedIcon>
                    </div>
                );
            }
        },
    ].map(column => ({
        ...column,
        filterable: false,
        headerClassName: 'grid-header-cell'
    }));

    const sellColumns: GridColDef[] = [
        {
            field: 'coinCodex',
            headerName: 'Coin',
            width: 175,
            valueGetter: (_: never, row: TradeOrder) => row.from + " -> " + row.to,
            renderCell: (params: GridRenderCellParams<GridValidRowModel, string>) => iconCell(params.value, 0)
        },
        {
            field: 'sellQuantity',
            headerName: 'Qty',
            type: 'string',
            width: 125,
        },
        {
            field: 'buyQuantity',
            headerName: 'Sell for $',
            type: 'string',
            width: 125,
        },
        {
            field: 'price',
            headerName: 'Price',
            type: 'number',
            width: 125,
            valueFormatter: (value?: number) => {
                return formatNumberValue(value)
            },
        },
        {
            field: 'actualPrice',
            headerName: 'Actual price',
            type: 'number',
            valueFormatter: (value?: number) => {
                return formatNumberValue(value)
            },
            width: 125,
        },
        {
            field: 'expireTime',
            headerName: 'Expire date',
            type: 'string',
            cellClassName: (params: GridCellParams<TradeOrder, string>) => {
                return params.row.nearingExpiration ? "nearing-expiration" : "";
            },
            valueGetter: (_: never, row: TradeOrder) => new Date(row.expireTime),
            valueFormatter: (value?: Date) => {
                return formatDateTime(value)
            },
            width: 120,
        },
        {
            field: 'status',
            headerName: 'Status',
            type: 'string'
        },
        {
            field: "renew",
            headerName: "",
            sortable: false,
            width: 20,
            renderCell: (params: GridRenderCellParams) => {
                const onClick = (e: { stopPropagation: () => void; }) => {
                    e.stopPropagation(); // don't select this row after clicking
                    const order: TradeOrder = params.row;
                    RenewOrder(order.id)
                };

                return (
                    <div className="d-flex justify-content-between align-items-center" style={{cursor: "pointer"}}>
                        <RefreshOutlinedIcon onClick={onClick}></RefreshOutlinedIcon>
                    </div>
                )

            }
        },
        {
            field: "cancel",
            headerName: "",
            sortable: false,
            width: 20,
            renderCell: (params: GridRenderCellParams) => {

                const onClick = (e: { stopPropagation: () => void; }) => {
                    e.stopPropagation(); // don't select this row after clicking
                    const order: TradeOrder = params.row;
                    CancelOrder(order.id)
                };
                return (
                    <div className="d-flex justify-content-between align-items-center" style={{cursor: "pointer"}}>
                        <DeleteOutlinedIcon onClick={onClick}
                        ></DeleteOutlinedIcon>
                    </div>
                );

            }
        },

    ].map(column => ({
        ...column,
        filterable: false,
        headerClassName: 'grid-header-cell',
    }));

    const buyParams: Parameter[] = [
        {key: 'coinCodes', value: selectedCoin},
        {key: 'type', value: "BUY"},
        {key: 'statuses', value: statusSelectValue}
    ]
    const sellParams: Parameter[] = [
        {key: 'coinCodes', value: selectedCoin},
        {key: 'type', value: "SELL"},
        {key: 'statuses', value: statusSelectValue},
    ]

    const buyOrders = useFetch<ListOrdersResponse>(addParams('/binance/orders', buyParams))
    const sellOrders = useFetch<ListOrdersResponse>(addParams('/binance/orders', sellParams))

    function CancelOrder(orderId: string) {
        useFetchDelete<ListOrdersResponse>('/binance/orders/' + orderId).then(r => console.log(r));
    }

    function RenewOrder(orderId: string) {
        useFetchPost<ListOrdersResponse>('/binance/orders/' + orderId, {}).then(() => fetchOkNotification());

    }


    function pricesNearBuy(row: TradeOrder): boolean {
        return (1 - (row.actualPrice / row.inversePrice)) >= -0.025
    }

    function pricesNearSell(row: TradeOrder): boolean {
        return (1 - (row.actualPrice / row.price)) <= 0.025
    }

    const handleOrderStatusSelectChange = (event: SelectChangeEvent) => {
        setStatusSelectValue(event.target.value as string);
    };

    function orderStatusSelect(): JSX.Element {
        return (
            <FormControl>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={statusSelectValue}
                    label="Status"
                    onChange={handleOrderStatusSelectChange}
                >
                    <MenuItem value={'FAIL'}>Failed/Cancelled</MenuItem>
                    <MenuItem value={'SUCCESS'}>Executed</MenuItem>
                    <MenuItem value={'PROCESS'}>Open</MenuItem>
                    <MenuItem value={undefined}>All</MenuItem>
                </Select>
            </FormControl>
        )
    }

    function ordersTable(): JSX.Element {

        if (buyOrders === undefined || sellOrders === undefined) {
            return (<LoadingComponent/>)
        }

        return (
            <div>
                <div className={"centered-element-wrapper xxx"}>
                    <div className={"centered-element"}>
                        {orderStatusSelect()}
                    </div>
                    <div className={"centered-element"}>
                        <CoinSelect selectedCoin={selectedCoin} onCoinSelect={setSelectedCoin}/>
                    </div>
                </div>
                <br/>

                <div style={{ paddingTop: '20px',display: 'flex', flexDirection: 'column', maxWidth: '1000px', margin: '0 auto' }}>
                    {/* Tabs styled to look like part of the table */}
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="fullWidth"  // Ensures the tabs span across the full width
                            style={{
                                // backgroundColor: '#f5f5f5',  // Match table header background
                                // borderBottom: '1px solid #e0e0e0', // Add border to match the table look
                                border: '1px solid #e0e0e0', // Add border to match the table look
                                width: '100%',
                                padding: 0  // Remove extra padding
                            }}
                        >
                            <Tab label="Buy Orders" style={{borderRight: "1px solid #e0e0e0"}}/>
                            <Tab label="Sell Orders"/>
                        </Tabs>
                    </div>

                    {/* Buy Orders */}
                    {activeTab === 0 && (
                        <div className={"centered-element-without-padding"}>
                            <div style={{width: '100%'}}>
                                <DataGrid
                                    rows={buyOrders.data}
                                    columns={buyColumns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {page: 0, pageSize: 100},
                                        },
                                        sorting: {
                                            sortModel: [{field: 'from', sort: 'asc'}],
                                        }
                                    }}
                                    getRowClassName={(params) => {
                                        return pricesNearBuy(params.row) ? "profit" : "";
                                    }}
                                    getRowId={(row: TradeOrder) => row.from + row.to + row.date}
                                    pageSizeOptions={[50, 100]}
                                />
                            </div>
                        </div>
                    )}

                    {/* Sell Orders */}
                    {activeTab === 1 && (
                        <div className={"centered-element-without-padding"}>
                            <div style={{width: '100%'}}>
                                <DataGrid
                                    rows={sellOrders.data}
                                    columns={sellColumns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {page: 0, pageSize: 100},
                                        },
                                        sorting: {
                                            sortModel: [{field: 'from', sort: 'asc'}],
                                        }
                                    }}
                                    getRowClassName={(params) => pricesNearSell(params.row) ? "profit" : ""}
                                    getRowId={(row: TradeOrder) => row.from + row.to + row.date}
                                    pageSizeOptions={[100, 200]}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2>Orders</h2>
            {ordersTable()}
        </div>
    );
}
