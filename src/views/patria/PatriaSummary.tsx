import {MenuProps, NavigationDefinition} from "../../App.tsx";
import {JSX, useEffect} from "react";

export default function PatriaSummary(menuProps: MenuProps) {

    useEffect(() => {
        menuProps.setMenuComponentContent(contextualMenuComponent());

        const navigationContent: NavigationDefinition[] = [
            {text: "Summary", link: "/patria/summary"},
            {text: "Dividends", link: "/patria/orders"}
        ]
        menuProps.setNavigationContent(navigationContent)
    }, []);

    return (
        <div>
            <h2>Patria Summary</h2>

        </div>
    );

    function contextualMenuComponent(): JSX.Element {
        return (
            <div></div>
        )
    }
}
