// import React from "react";
// import { useTranslation } from "react-i18next";

import  {axiosInstance} from "../api/Api.ts"
import {GridColDef} from "@mui/x-data-grid";
import MyTable from "../components/MyTable.tsx";
import useSWR from "swr";

// const fetcher = (url: string) => await axiosInstance(url).then((res: any) => res.data.json);
const fetcher = async (url: string) => {
    return await axiosInstance.get(url).then((res: { data: any; }) => res.data);
};

const columns: GridColDef[] = [
    {
        field: 'coinCode',
        headerName: 'Coin',
        type: 'string'
    },
    {
        field: 'holding',
        headerName: 'Holding',
        type: 'number'
    },
    {
        field: 'actualPrice',
        headerName: 'Actual price',
        description: '',
        width: 180
    },
    {
        field: 'averageBuyPrice',
        headerName: 'Average buy price',
        description: '',
        width: 180
    },
    {
        field: 'unrealisedProfit',
        headerName: 'Unrealised Profit',
        description: '',
        width: 180
    },
    {
        field: 'lowestBuyPrice',
        headerName: 'Lowest buy price',
        description: '',
        width: 180,

        headerClassName: "header card"
    },
];


function addId(x) {
    x.id = x.coinCode
    return x
}

export default function Summary() {

    const {data, error, isLoading} = useSWR('/trades-summary?skipNotOwnedCoins=true', fetcher)
    // const response: CoinTrades  = useFetch<CoinTrades>('/trades-summary?skipNotOwnedCoins=true', {
    //     method: MethodTypes.GET,
    //     body: undefined
    // });
    // console.log(response);


    if (error || data === undefined|| data.coinTrades === undefined) return <div>{error?.toString()}</div>


    const rows = data.coinTrades.map((x) => addId(x))

    console.log(rows);

    return (
        <div>
            <h2>Summary</h2>
            <MyTable
                columns={columns}
                rows={rows}
            />
        </div>
    );
}
