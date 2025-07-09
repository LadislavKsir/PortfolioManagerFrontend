import useFetch from "../../api/Api.ts";
import {DataGrid, GridColDef, GridRenderCellParams, GridValidRowModel} from "@mui/x-data-grid";
import {JSX, useEffect, useState} from "react";
import {MenuProps} from "../../App.tsx";
import {PagedResponse} from "../../types/common/PagedResponse.ts";
import {LockedSubscription} from "../../types/LockedSubscription.ts";
import {formatDate, formatDateString, formatDateTime} from "../../utils/DateFormatter.ts";
import LoadingComponent from "../../components/LoadingComponent.tsx";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SyncButton from "../../components/SyncButton.tsx";
import {binanceNavigation} from "../../routing/NavigationDefinitionFactory.tsx";
import {LineChart} from "@mui/x-charts/LineChart";
import {SubscriptionGroupedRewards} from "../../types/SubscriptionGroupedRewards.ts";
import {Button, Checkbox, FormControlLabel, FormGroup, TableContainer} from "@mui/material";


export default function Earn(menuProps: MenuProps) {

    // const [selectedCoinsLocked, setSelectedCoinsLocked] = useState<Set<string>>(new Set());
    // const [selectedCoinsFlexible, setSelectedCoinsFlexible] = useState<Set<string>>(new Set());
    const [selectedCoins, setSelectedCoins] = useState<Set<string>>(new Set());
    const [allCoins, setAllCoins] = useState<Set<string>>(new Set());

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

    useEffect(() => {
        if (flexibleSubscriptionsRewards && lockedSubscriptionsRewards) {
            const flexCoinCodes = new Set(
                flexibleSubscriptionsRewards.flatMap(x =>
                    x.rewards.map(y => y.coinCode)
                )
            );

            const lockedCoinCodes = new Set(
                lockedSubscriptionsRewards.flatMap(x =>
                    x.rewards.map(y => y.coinCode)
                )
            );


            setSelectedCoins(new Set([...flexCoinCodes, ...lockedCoinCodes]));
            setAllCoins(new Set([...flexCoinCodes, ...lockedCoinCodes]));
        }
    }, [lockedSubscriptionsRewards]);

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

    function coinSelector(selectedCoins: Set<string>, setSelectedCoins: React.Dispatch<React.SetStateAction<Set<string>>>) {

        const handleCheckboxChange = (coinCode: string) => {
            setSelectedCoins((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(coinCode)) {
                    newSet.delete(coinCode);
                } else {
                    newSet.add(coinCode);
                }
                return newSet;
            });
        };
        const handleClear = () => {
            setSelectedCoins(new Set());
        };

        const handleSelectAll = () => {
            setSelectedCoins(new Set(allCoins));
        };

        return (
            <div>
                <h4>Selected coins:</h4>
                <FormGroup row>
                    {Array.from(allCoins).map((coinCode) => (
                        <FormControlLabel
                            key={coinCode}
                            control={
                                <Checkbox
                                    checked={selectedCoins.has(coinCode)}
                                    onChange={() => handleCheckboxChange(coinCode)}
                                />
                            }
                            label={coinCode}
                        />
                    ))}
                </FormGroup>
                <div style={{marginTop: '10px'}}>
                    <Button variant="outlined" color="primary" onClick={handleClear} style={{marginRight: '10px'}}>
                        Clear selection
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleSelectAll}>
                        Select all
                    </Button>
                </div>
                <br/>
            </div>
        )
    }

    function rewardsTable(rewards: SubscriptionGroupedRewards[], additionalClassNames: string) {
        if (rewards === undefined) {
            return (<LoadingComponent/>)
        }

        const data = rewards.flatMap(dailyRewards => dailyRewards.rewards)
        const groupedAndSummed = Object.values(
            data.reduce((accumulator, item) => {
                const {coinCode, amount} = item;
                if (!accumulator[coinCode]) {
                    accumulator[coinCode] = {coinCode, amount: parseFloat(amount)};
                } else {
                    accumulator[coinCode].amount += parseFloat(amount);
                }
                return accumulator;
            }, {})
        );

        const columns: GridColDef[] = [
            {
                field: 'coinCode', headerName: 'Coin', width: 180,
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
            {field: 'amount', headerName: 'Rewards sum', width: 120},
        ]

        return (
            <div className={"centered-element-without-padding " + additionalClassNames}>
                <TableContainer>
                    <DataGrid
                        rows={groupedAndSummed}
                        columns={columns}
                        getRowId={(row) => {
                            return row.coinCode;
                        }}
                        // onRowClick={rowClick}
                        // pageSizeOptions={[50, 100]}
                    />
                </TableContainer>
            </div>
        )
    }

    function rewardsGraph(rewards: SubscriptionGroupedRewards[], label: string, selectedCoins: Set<string>) {
        if (rewards === undefined) {
            return (<LoadingComponent/>);
        }

        const thresholdDate = new Date();
        thresholdDate.setDate(new Date().getDate() - 31);

        const filteredRewards = rewards.filter((x) => {
            const checkedDate = new Date(x.time);
            return checkedDate >= thresholdDate;
        });



        const xLabels = filteredRewards.map((x) => formatDateString(x.time));
        const series = extractSeriesFromData(filteredRewards, selectedCoins);

        return (
            <div className={"centered-element-without-padding dark-gray-border"}>
                <h3>{label}</h3>

                <LineChart
                    width={920}
                    height={350}
                    series={
                        series.map((s) => ({
                            ...s,
                            valueFormatter: (v) => (v === null ? '' : v.toFixed(8)),
                        }))
                    }
                    xAxis={[
                        {scaleType: 'point', data: xLabels},
                    ]}
                    grid={{vertical: true, horizontal: true}}
                />

                {/*<h4>Selected coins:</h4>*/}
                {/*<FormGroup row>*/}
                {/*    {uniqueCoinCodes.map((coinCode) => (*/}
                {/*        <FormControlLabel*/}
                {/*            key={coinCode}*/}
                {/*            control={*/}
                {/*                <Checkbox*/}
                {/*                    checked={selectedCoins.has(coinCode)}*/}
                {/*                    onChange={() => handleCheckboxChange(coinCode)}*/}
                {/*                />*/}
                {/*            }*/}
                {/*            label={coinCode}*/}
                {/*        />*/}
                {/*    ))}*/}
                {/*</FormGroup>*/}
                <h4>Rewards sum:</h4>
                {rewardsTable(rewards, "right-padding-big")}
            </div>
        );
    }

    function extractSeriesFromData(groupedRewards: SubscriptionGroupedRewards[], selectedCoins: Set<string>) {
        const uniqueCoinCodes = Array.from(
            new Set(groupedRewards.flatMap((x) => x.rewards.map((y) => y.coinCode)))
        );

        const filteredCoins = uniqueCoinCodes.filter((coinCode) => selectedCoins.has(coinCode));

        return filteredCoins.map((coinCode) => {
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
        <div>
            <div className={"centered-element-wrapper"}>
                <div className={"centered-element"}>
                    {coinSelector( selectedCoins, setSelectedCoins)}
                </div>
            </div>

            <div className={"centered-element-wrapper"}>
                {rewardsGraph(flexibleSubscriptionsRewards, 'Flexible subscriptions daily rewards', selectedCoins)}
                {rewardsGraph(lockedSubscriptionsRewards, 'Locked subscriptions daily rewards', selectedCoins)}
            </div>

            <div className={"centered-element-wrapper"}>

                <div className={"centered-element"}>
                    <h2>Locked subscriptions</h2>
                    {lockedSubscriptionsTable()}
                </div>

            </div>

        </div>
    )
        ;
}
