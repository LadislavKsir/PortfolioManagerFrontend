import {createTheme} from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5', // Customize your primary color
        },
        secondary: {
            main: '#f50057', // Customize your secondary color
        },
        background: {
            default: '#f5f5f5', // Light background for the main content
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2rem',
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
        },
        fontSize: 12
    },
});

