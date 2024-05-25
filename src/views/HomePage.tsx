// import React from "react";
// import { useTranslation } from "react-i18next";

import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

export default function HomePage() {
    // const { t } = useTranslation();

    function SummaryButton() {
        const navigate = useNavigate();

        function handleClick() {
            navigate("/summary");
        }

        return (
            <Button variant="contained" onClick={handleClick}>Summary</Button>
        )
    }

    function handleContainedClick() {

    }

    return (
        <div>
            <h2>Hello</h2>
            <div>
                <Button variant="contained" onClick={handleContainedClick}>Contained</Button>
                <SummaryButton/>
            </div>
        </div>
    );
}
