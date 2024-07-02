// import React from "react";
// import { useTranslation } from "react-i18next";
import useFetch from "../api/Api.ts";
import {Coin, ListCoinsResponse} from "../types/Coin.ts";
import {Button} from "@mui/material";
import {JSX} from "react";
import {useNavigate} from "react-router-dom";

export default function Coins() {

    const navigate = useNavigate();
    const data = useFetch<ListCoinsResponse>("/coins")


    function getCoinButtons(data: ListCoinsResponse) {

        const arr: JSX.Element[] = []

        data.coins.forEach((coin: Coin) => {

            function handleClick() {
                console.log("clicked"+coin.code)
                navigate("/coins/"+coin.code);
            }
            arr.push(

                <div>
                    <Button variant="contained" onClick={handleClick}>{coin.code}</Button>
                </div>
            )
        })

        return (
            <div>
                {arr}
            </div>
        )

    }

    if (data === undefined) {
        return (
            <div>
                <h2>Coins</h2>
            </div>
        );
    }

    return (
        <div>
            <h2>Coins</h2>
            {getCoinButtons(data)}
        </div>
    );
}
