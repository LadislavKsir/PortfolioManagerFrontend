// import React from "react";
// import { useTranslation } from "react-i18next";

import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

export default function HomePage() {
    // const { t } = useTranslation();


    function MyButton(link: string, name: string) {
        const navigate = useNavigate();

        function handleClick() {
            navigate(link);
        }

        return (
            <Button variant="contained" className="my-button" onClick={handleClick}>{name}</Button>
        )
    }

    function SummaryButton() {
        return MyButton("/summary", "Summary")
    }

    // function DashboardButton() {
    //     return MyButton("/dashboard", "Dashboard")
    // }

    function CoinsButton() {
        return MyButton("/coins", "Coins")
    }

    function OrdersButton() {
        return MyButton("/orders", "Orders")
    }


    return (
        <div>
            <h2>Hello</h2>
            <div style={{display: "flex"}}>

                <div className="my-button">
                    <SummaryButton/>
                </div>
                <div className="my-button">
                    <OrdersButton/>
                </div>
                <div className="my-button">
                    <CoinsButton/>
                </div>
            </div>
        </div>
    );
}
