import useFetch from "../../api/Api.ts";
import {DataGrid, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import {JSX, useEffect} from "react";
import {MenuProps} from "../../App.tsx";
import {PagedResponse} from "../../types/PagedResponse.ts";
import {LockedSubscription} from "../../types/LockedSubscription.ts";
import {formatDate, formatDateString, formatDateTime} from "../../utils/DateFormatter.ts";
import LoadingComponent from "../../components/LoadingComponent.tsx";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SyncButton from "../../components/SyncButton.tsx";
import {binanceNavigation} from "../../routing/NavigationDefinitionFactory.tsx";
import {LineChart} from "@mui/x-charts/LineChart";
import {SubscriptionGroupedRewards} from "../../types/SubscriptionGroupedRewards.ts";

export default function Earn(menuProps: MenuProps) {

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

        document.title = 'Earn';
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
            width: 180,
            type: 'string',
            valueGetter: (_, row: LockedSubscription) => new Date(row.endTime),
            valueFormatter: (value?: Date) => {
                return formatDateTime(value)
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

        {
            field: 'totalEarned',
            headerName: 'Earned',

            type: 'string'
        }, {
            width: 160,
            field: 'resultStatus',
            headerName: 'Final status',
            type: 'string',

        },

    ];

    const lockedSubscriptions = useFetch<PagedResponse<LockedSubscription>>('/binance/locked-subscriptions')
    const flexibleSubscriptionsRewards = useFetch<SubscriptionGroupedRewards[]>('/binance/flexible-subscriptions-grouped-rewards')
    const lockedSubscriptionsRewards = useFetch<SubscriptionGroupedRewards[]>('/binance/locked-subscriptions-grouped-rewards')


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

    function flexibleSubscriptionsRewardsGraph(): JSX.Element {
        if (flexibleSubscriptionsRewards === undefined) {
            return (<LoadingComponent/>)
        }

        const xLabels = flexibleSubscriptionsRewards.map((x) => formatDateString(x.time));
        const series = extractSeriesFromData(flexibleSubscriptionsRewards)

        return (
            <div className={"centered-element-wrapper"}>
                <h3>Flexible subscriptions daily rewards</h3>
                <div className={"centered-element"}>
                    <LineChart
                        width={1280}
                        height={400}
                        series={series}
                        xAxis={[
                            {scaleType: 'point', data: xLabels},

                        ]}
                        grid={{vertical: true, horizontal: true}}
                    />

                </div>
            </div>
        )
    }

    function lockedSubscriptionsRewardsGraph(): JSX.Element {
        if (lockedSubscriptionsRewards === undefined) {
            return (<LoadingComponent/>)
        }

        const xLabels = lockedSubscriptionsRewards.map((x) => formatDateString(x.time));

        const series = extractSeriesFromData(lockedSubscriptionsRewards)

        return (
            <div className={"centered-element-wrapper"}>
                <h3>Locked subscriptions daily rewards</h3>
                <div className={"centered-element"}>
                    <LineChart
                        width={1280}
                        height={400}
                        series={series}
                        xAxis={[
                            {scaleType: 'point', data: xLabels},

                        ]}
                        grid={{vertical: true, horizontal: true}}
                    />
                </div>
            </div>
        )
    }


    function extractSeriesFromData(groupedRewards: SubscriptionGroupedRewards[] ) {
        const uniqueCoinCodes = Array.from(
            new Set(groupedRewards.flatMap((x) => x.rewards.map((y) => y.coinCode)))
        );

        return uniqueCoinCodes.map((coinCode) => {
            const data = groupedRewards.map((x) => {
                const reward = x.rewards.find((y) => y.coinCode === coinCode);
                return reward ? reward.amount : null;
            });
            return {
                data,
                connectNulls: false,
                showMark: true,
                label: coinCode,
            };
        })
    }

    return (

        <div className={"centered-element-wrapper"}>
            <div className={"centered-element"}>
                {/*{headTable()}*/}
                {lockedSubscriptionsRewardsGraph()}
                {flexibleSubscriptionsRewardsGraph()}
                <h2>Locked subscriptions</h2>
                {lockedSubscriptionsTable()}
            </div>
        </div>

    );
}
