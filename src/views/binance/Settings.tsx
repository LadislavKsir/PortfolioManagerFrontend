import {useEffect} from "react";

import {MenuProps} from "../../App.tsx";

import SyncButton from "../../components/SyncButton.tsx";
import {binanceNavigation} from "../../routing/NavigationDefinitionFactory.tsx";

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


    return (
        <div>
            <h2>Settings</h2>
        </div>
    );
}
