import './App.css'


import Routing from "./routing/Routing.tsx";

import {Dispatch, JSX, SetStateAction, useState} from "react";
import {AppDrawer} from "./components/AppDrawer.tsx";
import {AppDialog} from "./components/AppDialog.tsx";

// import 'react-notifications/lib/notifications.css';
import { SnackbarProvider } from 'notistack';


import { Box } from '@mui/material';
import {NavigationDefinition} from "./routing/NavigationDefinition.tsx";

export interface MenuProps {
    setMenuComponentContent: React.Dispatch<React.SetStateAction<JSX.Element>>,
    setNavigationContent: React.Dispatch<React.SetStateAction<NavigationDefinition[]>>
    dialogProps: DialogProps
}



export interface DialogProps {
    content: Dispatch<SetStateAction<JSX.Element | null>>
    openClose: Dispatch<SetStateAction<boolean>>
}

function App() {

    const DEFAULT_MENU_COMPONENT_CONTENT: JSX.Element = (<div></div>)

    const [menuComponentContent, setMenuComponentContent] = useState<JSX.Element>(DEFAULT_MENU_COMPONENT_CONTENT);
    const [navigationContent, setNavigationContent] = useState<NavigationDefinition[]>([]);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<JSX.Element | null>(null);


    const dialogPropsInstance: DialogProps = {
        content: setDialogContent,
        openClose: setModalIsOpen
    }

    return (
        <SnackbarProvider>
            <div className="app-container">
                {/*<Alert variant="outlined" severity="success">*/}
                {/*    This is an outlined success Alert.*/}
                {/*</Alert>*/}
                {/*<Alert variant="outlined" severity="info">*/}
                {/*    This is an outlined info Alert.*/}
                {/*</Alert>*/}
                {/*<Alert severity="warning">*/}
                {/*    This is an outlined warning Alert.*/}
                {/*</Alert>*/}
                {/*<Alert variant="outlined" severity="error">*/}
                {/*    This is an outlined error Alert.*/}
                {/*</Alert>*/}
                {/*<AutohideSnackbar autoHideDuration={2000} text={"Text"} title={"Title"}></AutohideSnackbar>*/}
                {/*{syncButton()}*/}

                {/*<ThemeProvider theme={theme}>*/}
                    <Box sx={{
                        display: 'flex',
                    }}>
                        {/*<CssBaseline/>*/}

                        <AppDrawer menuComponentContent={menuComponentContent}
                                   navigationContent={navigationContent}>
                        </AppDrawer>


                        <Box component="main" sx={{
                            flexGrow: 1,
                            // bgcolor: 'background.default',
                            p: 3,
                            // backgroundImage: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)', // Example gradient
                            borderRadius: '8px', // Rounded corners for a softer look
                        }}>
                            <AppDialog
                                content={dialogContent}
                                modalIsOpen={modalIsOpen}
                                onClose={() => {
                                    setDialogContent(null)
                                    setModalIsOpen(false)
                                }}
                            ></AppDialog>

                            <Routing setMenuComponentContent={setMenuComponentContent}
                                     setNavigationContent={setNavigationContent}
                                     dialogProps={dialogPropsInstance}
                            />
                        </Box>
                    </Box>
                {/*</ThemeProvider>*/}
            </div>
        </SnackbarProvider>
    );
}

// function syncButton() {
//     function handleClick() {
//         // errorNotification("err.message")
//
//     }
//
//     return (
//         <Button variant="contained" className="my-button" onClick={handleClick}>Sync</Button>
//     );
// }

export default App
