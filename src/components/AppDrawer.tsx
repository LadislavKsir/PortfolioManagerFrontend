import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import MenuComponent from "./MenuComponent.tsx";
import {JSX} from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import {ListItemText, Typography} from "@mui/material";
import List from "@mui/material/List";
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import {NavigationDefinition} from "../routing/NavigationDefinition.tsx";
import {useNavigate} from "react-router-dom";
interface AppDrawerProps {
    menuComponentContent: JSX.Element,
    navigationContent: NavigationDefinition[]
}

export function AppDrawer(props: AppDrawerProps): JSX.Element {
    const navigate = useNavigate();

    const drawerWidth = 240;
    const handleClick = (event: React.MouseEvent, link: string) => {
        // Check if Ctrl or Meta (Command key on Mac) is pressed to open in a new tab
        if (event.ctrlKey || event.metaKey) {
            window.open(link, '_blank');
        } else {
            navigate(link)
        }
    };

    const handleRightClick = (event: React.MouseEvent) => {
        // Allow the default browser right-click menu to appear
        // event.preventDefault();
        // You can add custom behavior here if needed or remove this to fully rely on the browser's default context menu
    };

    function listItemButton(text: string, linkUrl: string): JSX.Element {
        return (
            <ListItem key={text} disablePadding>
                <ListItemButton
                    onClick={(event) => handleClick(event, linkUrl)}
                    onContextMenu={handleRightClick}
                >
                    <ListItemIcon>
                        <HomeIcon sx={{ color: '#f1ecf1' }}/>
                    </ListItemIcon>
                    <ListItemText primary={text}/>
                </ListItemButton>
            </ListItem>
        )
    }

    function listItemButtonWithIcon(text: string, linkUrl: string, icon: JSX.Element): JSX.Element {
        return (
            <ListItem key={text} disablePadding>
                <ListItemButton
                    onClick={(event) => handleClick(event, linkUrl)}
                    onContextMenu={handleRightClick}
                >
                    <ListItemIcon>
                        {/*<HomeIcon sx={{ color: '#f1ecf1' }}/>*/}
                        {icon}
                    </ListItemIcon>
                    <ListItemText primary={text}/>
                </ListItemButton>
            </ListItem>
        )
    }

    function getSettingsIcon(): JSX.Element {
     return ( <SettingsIcon sx={{ color: '#f1ecf1' }}/>)
    }

    function fixedNavigationList(): JSX.Element {
        const settingsIcon = getSettingsIcon();

        return (
            <List>
                {/*<ListItemIcon><HomeIcon sx={{ color: '#ecf0f1' }}/></ListItemIcon>*/}
                {/*<ListItemText primary="Home" />*/}
                {listItemButton("Homepage", "/home")}
                {/*{listItemButton("Settings", "/settings")}*/}
                {listItemButtonWithIcon("Settings", "/settings", settingsIcon)}
            </List>
        )
    }


    function contextualNavigationList(): JSX.Element {

        return (
            <List>
                {props.navigationContent.map((def) => (
                    <ListItem key={def.text} disablePadding>
                        <ListItemButton
                            onClick={(event) => handleClick(event, def.link)}
                            onContextMenu={handleRightClick}
                        >
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
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#2c3e50', // Dark background
                    color: '#ecf0f1', // Light text
                    padding: '20px', // Add padding for spacing
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar>
                <Typography variant="h6">Portfolio Manager v.2</Typography>
            </Toolbar>
            <Divider/>
            {fixedNavigationList()}
            <Divider/>
            {contextualNavigationList()}
            <MenuComponent content={props.menuComponentContent}></MenuComponent>
        </Drawer>
    )
}