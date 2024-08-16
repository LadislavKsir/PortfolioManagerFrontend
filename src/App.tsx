import './App.css'

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import Routing from "./routing/Routing.tsx";

import {JSX, useState} from "react";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {AppDrawer} from "./components/AppDrawer.tsx";


export interface NavigationDefinition {
    text: string,
    link: string
}

export interface MenuProps {
    setMenuComponentContent: React.Dispatch<React.SetStateAction<JSX.Element>>,
    setNavigationContent: React.Dispatch<React.SetStateAction<NavigationDefinition[]>>
}

function App() {

    const DEFAULT_MENU_COMPONENT_CONTENT: JSX.Element = (<div></div>)

    const [menuComponentContent, setMenuComponentContent] = useState<JSX.Element>(DEFAULT_MENU_COMPONENT_CONTENT);
    const [navigationContent, setNavigationContent] = useState<NavigationDefinition[]>([]);


    const theme = createTheme({
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


    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                display: 'flex',
            }}>
                <CssBaseline/>

                <AppDrawer menuComponentContent={menuComponentContent}
                           navigationContent={navigationContent}>
                </AppDrawer>


                <Box component="main" sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3,
                    // backgroundImage: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)', // Example gradient
                    borderRadius: '8px', // Rounded corners for a softer look
                }}>
                    <Routing setMenuComponentContent={setMenuComponentContent}
                             setNavigationContent={setNavigationContent}/>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default App
