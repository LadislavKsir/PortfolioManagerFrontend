import useFetch from "../../api/Api.ts";
import {DataGrid, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import {JSX, useEffect} from "react";
import {MenuProps, NavigationDefinition} from "../../App.tsx";
import {DataResponse} from "../../types/DataResponse.ts";
import {LockedSubscription} from "../../types/LockedSubscription.ts";
import {formatDate} from "../../utils/DateFormatter.ts";
import LoadingComponent from "../../components/LoadingComponent.tsx";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function LockedSubscriptions(menuProps: MenuProps) {

    useEffect(() => {
        const navigationContent: NavigationDefinition[] = [
            {text: "Summary", link: "/binance/summary"},
            {text: "Orders", link: "/binance/orders"},
            {text: "Coins", link: "/binance/coins"},
        ]
        menuProps.setNavigationContent(navigationContent)
    }, []);


    const columns: GridColDef[] = [
        {
            field: 'coinCodex',
            headerName: 'Coin',
            valueGetter: (_, row: LockedSubscription) => row.coinCode,
            renderCell: (params: GridRenderCellParams<any, string>) => {
                if (params.value) {
                    return (
                        <div>
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
        // {
        //     field: 'coinCode',
        //     headerName: 'Coin',
        //
        //     type: 'string'
        // },
        {
            field: 'time',
            headerName: 'Date',

            description: '',
            width: 180,
            type: 'dateTime',
            valueGetter: (_, row: LockedSubscription) => new Date(row.time),
            valueFormatter: (value?: Date) => {
                return formatDate(value)
            }
        }, {
            field: 'End at',
            headerName: 'End at',

            type: 'string',
            valueGetter: (_, row: LockedSubscription) => new Date(row.endTime),
            valueFormatter: (value?: Date) => {
                return formatDate(value)
            }

        }, {
            field: 'lockPeriod',
            headerName: 'Locked for',
            type: 'string',

        }, {
            field: 'amount',
            headerName: 'Amount',
            type: 'string',

        }, {
            field: 'finished',
            headerName: 'Finished',

            type: 'string',
            renderCell: (params: GridRenderCellParams<any, boolean>) => {
                if (params.value === true) {
                    return (
                        <div className="d-flex justify-content-between align-items-center" style={{cursor: "pointer"}}>
                            <CheckCircleIcon></CheckCircleIcon>
                        </div>
                    );
                } else {
                    return (<div></div>)
                }

            }
        },
        // {
        //     field: 'priceWhenLocked',
        //     headerName: 'priceWhenLocked',
        //
        //     type: 'string'
        // },
        // {
        //     field: 'priceWhenFinished',
        //     headerName: 'priceWhenFinished',
        //
        //     type: 'string'
        // },
        {
            field: 'totalEarned',
            headerName: 'Earned',

            type: 'string'
        },

    ];

    const lockedSubscriptions = useFetch<DataResponse<LockedSubscription>>('/binance/locked-subscriptions')

    function lockedSubscriptionsTable(): JSX.Element {
        return (
            (lockedSubscriptions === undefined) ? <LoadingComponent/> :
                (<DataGrid
                    rows={lockedSubscriptions.data}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 50},
                        },
                        sorting: {
                            sortModel: [{field: 'time', sort: 'desc'}],
                        }
                    }}
                    getRowClassName={(params) => {
                        return (params.row.finished) ? "profit" : "";
                    }}
                    getRowId={(row: LockedSubscription) => {
                        return row.positionId;
                    }}
                    pageSizeOptions={[50, 100]}
                />)
        )
    }

    return (

        <div className={"centered-element-wrapper"}>
            <div className={"centered-element"}>
                <h2>Locked Subscriptions</h2>
                {/*{headTable()}*/}

                {lockedSubscriptionsTable()}
            </div>
        </div>

    );
}
