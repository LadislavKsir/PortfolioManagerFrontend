import {JSX} from "react";
import Box from "@mui/material/Box";
import {CircularProgress} from "@mui/material";

export default function LoadingComponent(): JSX.Element {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress/>
        </Box>
    );
}