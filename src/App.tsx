import './App.css'
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
// import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Routing from "./routing/Routing.tsx";

import {JSX, useState} from "react";
import {ListItemText} from "@mui/material";
import MenuComponent from "./components/MenuComponent.tsx";

const drawerWidth = 240;

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


    // function headerBarToolbar(): JSX.Element {
    //     return (
    //         <Toolbar>
    //             <Typography variant="h6" color="blue" component="div">
    //                 <a href={"/home"}><p>Homepage</p></a>
    //             </Typography>
    //         </Toolbar>
    //     )
    // }
    //
    // function appBar(): JSX.Element {
    //     return (
    //         <AppBar
    //             position="fixed"
    //             sx={{
    //                 width: `calc(100% - ${drawerWidth}px)`,
    //                 ml: `${drawerWidth}px`,
    //                 backgroundColor: "#1976d2",
    //                 color: "#1976d2"
    //
    //             }}
    //             className={"blue-background"}
    //         >
    //             {/*{headerBarToolbar()}*/}
    //         </AppBar>
    //     )
    // }

    function listItemButton(text: string, linkUrl: string): JSX.Element {
        return (
            <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => (window.location.href = linkUrl)}>
                    <ListItemIcon>
                        <InboxIcon/>
                    </ListItemIcon>
                    <ListItemText primary={text}/>
                </ListItemButton>
            </ListItem>
        )
    }

    function fixedNavigationList(): JSX.Element {
        return (
            <List>
                {listItemButton("Homepage", "/home")}
            </List>
        )
    }

    function contextualNavigationList(): JSX.Element {
        return (
            <List>
                {navigationContent.map((def) => (
                    <ListItem key={def.text} disablePadding>
                        <ListItemButton onClick={() => (window.location.href = def.link)}>
                            <ListItemIcon>
                                <InboxIcon/>
                            </ListItemIcon>
                            <ListItemText primary={def.text}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        )
    }


    return (
        <Box sx={{
            display: 'flex',
        }}>
            <CssBaseline/>
            {/*{appBar()}*/}

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar><p>Portfolio Manager v.2</p></Toolbar>
                <Divider/>
                {fixedNavigationList()}
                <Divider/>
                {contextualNavigationList()}
                <MenuComponent content={menuComponentContent}></MenuComponent>
            </Drawer>


            <Box component="main" sx={{flexGrow: 1, bgcolor: 'background.default', p: 3}}>
                <Routing setMenuComponentContent={setMenuComponentContent} setNavigationContent={setNavigationContent}/>
            </Box>
        </Box>
    );
}

export default App
