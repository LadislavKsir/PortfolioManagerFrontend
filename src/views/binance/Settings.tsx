import {useEffect, useState} from "react";

import {MenuProps} from "../../App.tsx";

import SyncButton from "../../components/SyncButton.tsx";
import {binanceNavigation} from "../../routing/NavigationDefinitionFactory.tsx";

import { TextField, FormControlLabel, Switch, Button, Grid } from "@mui/material";
import useFetch from "../../api/Api.ts";
import {SettingsDto} from "../../types/SettingsDto.ts";
import LoadingComponent from "../../components/LoadingComponent.tsx";

const API_URL = "/binance/configuration";

export default function Settings(menuProps: MenuProps) {


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

        document.title = 'Settings';

    }, []);


    // const [applicationBaselineDate, setApplicationBaselineDate] = useState("");
    // const [saveSnapshots, setSaveSnapshots] = useState(false);

    // Fetch the current configuration


    // const handleSave = async () => {
    //     try {
    //         setIsLoading(true);
    //         // await axios.put(API_URL, config);
    //         alert("Configuration saved successfully.");
    //     } catch (error) {
    //         console.error("Failed to save configuration:", error);
    //         alert("Failed to save configuration.");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const response = useFetch<SettingsDto>('/binance/configuration')
    if(response===undefined){
        return  (
            <div>
                <h2>Coins</h2>
                <LoadingComponent/>
            </div>)
    }
    // setData(response)

    // function setData(response: SettingsDto){
    //     setApplicationBaselineDate(response.applicationBaselineDate)
    //     setSaveSnapshots(response.saveSnapshots)
    // }

    return (response === undefined) ?
        (
            <div>
                <h2>Coins</h2>
                <LoadingComponent/>
            </div>) : (
        <div>
            <h2>Settings</h2>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Application Baseline Date"
                        type="date"
                        value={response.applicationBaselineDate}
                        // onChange={(e) => setApplicationBaselineDate( e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={response.saveSnapshots}
                                // onChange={(e) => setSaveSnapshots(saveSnapshots)}
                            />
                        }
                        label="Save Snapshots"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        // onClick={handleSave}
                        // disabled={isLoading}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}
