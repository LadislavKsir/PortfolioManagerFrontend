import {useEffect, useState} from "react";
import {MenuProps} from "../../App.tsx";
import SyncButton from "../../components/SyncButton.tsx";
import {binanceNavigation} from "../../routing/NavigationDefinitionFactory.tsx";
import {TextField, FormControlLabel, Switch, Button, Grid} from "@mui/material";
import axios from "axios";


const API_URL = "http://localhost:8080/api/binance/configuration";

export default function Settings(menuProps: MenuProps) {
    const [config, setConfig] = useState({
        applicationBaselineDate: "",
        saveSnapshots: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
        menuProps.setNavigationContent(binanceNavigation());

        document.title = 'Settings';

        // Fetch the current configuration
        const fetchConfig = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(API_URL);
                setConfig(response.data);
            } catch (error) {
                console.error("Failed to fetch configuration:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const handleSave = async () => {
        try {
            setIsLoading(true);
            await axios.put(API_URL, config);
            alert("Configuration saved successfully.");
        } catch (error) {
            console.error("Failed to save configuration:", error);
            alert("Failed to save configuration.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            setIsLoading(true);
            const url = "http://localhost:8080/api/binance/trades/import-update-dates?fileType=BINANCE_EXCEL_EXPORT"
            await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("File uploaded successfully.");
        } catch (error) {
            console.error("Failed to upload file:", error);
            alert("Failed to upload file.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className={"centered-element-wrapper"}>
                <div className={"centered-element"}>
                    <div>
                        <h2>Settings</h2>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Application Baseline Date"
                                    type="date"
                                    value={config.applicationBaselineDate}
                                    onChange={(e) => setConfig({...config, applicationBaselineDate: e.target.value})}
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
                                            checked={config.saveSnapshots}
                                            onChange={(e) => setConfig({...config, saveSnapshots: e.target.checked})}
                                        />
                                    }
                                    label="Save Snapshots"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSave}
                                    disabled={isLoading}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </div>

            </div>


            <div className={"centered-element"}>
                <h3>Upload update dates excel</h3>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleFileUpload}
                            disabled={isLoading || !selectedFile}
                        >
                            Upload
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
        ;
}
