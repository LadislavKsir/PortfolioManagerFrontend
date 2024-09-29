import {JSX} from "react";
import {useFetchPost} from "../api/Api.ts";
import SyncResultResponse from "../types/SyncResultResponse.tsx";
import {Button} from "@mui/material";
import {DialogProps} from "../App.tsx";

export default function SyncButton(dialogProps: DialogProps): JSX.Element {

    function handleClick() {
        //
        useFetchPost<SyncResultResponse>("/binance/trades/sync", {})
            .then(response => {
                dialogProps.content(renderResults(response))
                dialogProps.openClose(true)
            })
    }

    return (
        <Button variant="contained" className="my-button" onClick={handleClick}>Sync</Button>
    );

    function renderResults(apiResponse: SyncResultResponse) {
        if (!apiResponse) return null;

        const {earnHistory, convertHistory} = apiResponse;

        return (
            <div>
                <h3>Locked Subscriptions</h3>
                <ul>
                    <li>Skipped: {earnHistory.lockedSubscriptions.skipped}</li>
                    <li>Persisted: {earnHistory.lockedSubscriptions.persisted}</li>
                    <li>Updated: {earnHistory.lockedSubscriptions.updated}</li>
                    <li>Removed: {earnHistory.lockedSubscriptions.removed}</li>
                </ul>

                <h3>Earn History</h3>
                <ul>
                    <li>Skipped: {earnHistory.earnHistoryItems.skipped}</li>
                    <li>Persisted: {earnHistory.earnHistoryItems.persisted}</li>
                    <li>Updated: {earnHistory.earnHistoryItems.updated}</li>
                    <li>Removed: {earnHistory.earnHistoryItems.removed}</li>
                </ul>

                <h3>Convert History</h3>
                <ul>
                    <li>Skipped: {convertHistory.skipped}</li>
                    <li>Persisted: {convertHistory.persisted}</li>
                    <li>Updated: {convertHistory.updated}</li>
                    <li>Removed: {convertHistory.removed}</li>
                </ul>
            </div>
        );
    }
}