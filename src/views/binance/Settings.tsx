import {useEffect, useState} from "react";

import {MenuProps} from "../../App.tsx";

import SyncButton from "../../components/SyncButton.tsx";
import {binanceNavigation} from "../../routing/NavigationDefinitionFactory.tsx";

import {TextField, FormControlLabel, Switch, Button, Grid} from "@mui/material";
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

    const settingsData = useFetch<SettingsDto>('/binance/configuration')
    if (settingsData === undefined) {
        return (
            <div>
                <h2>Coins</h2>
                <LoadingComponent/>
            </div>)
    }

    function setApplicationBaselineDate(value: string) {
        console.log("setApplicationBaselineDate: " + value)
        settingsData.applicationBaselineDate = value
        console.log(settingsData)
    }

    function setSaveSnapshots(saveSnapshots: boolean) {
        console.log("setSaveSnapshots: " + saveSnapshots)
        settingsData.saveSnapshots = saveSnapshots
    }

    return (
        <div>
            <h2>Settings</h2>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Application Baseline Date"
                        type="date"
                        value={settingsData.applicationBaselineDate}
                        onChange={(e) => setApplicationBaselineDate(e.target.value)}
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
                                checked={settingsData.saveSnapshots}
                                onChange={(e) => {
                                    setSaveSnapshots(e.target.checked)
                                    e.target.checked = !e.target.checked
                                }}
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
