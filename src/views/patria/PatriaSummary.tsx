import {MenuProps} from "../../App.tsx";
import {NavigationDefinition} from "../../routing/NavigationDefinition.tsx";
import {JSX, useCallback, useEffect} from "react";

export default function PatriaSummary(menuProps: MenuProps) {

    const setupMenu = useCallback(() => {
        menuProps.setMenuComponentContent(contextualMenuComponent());

        const navigationContent: NavigationDefinition[] = [
            {text: "Summary", link: "/patria/summary"},
            {text: "Dividends", link: "/patria/orders"}
        ]
        menuProps.setNavigationContent(navigationContent)
    }, [menuProps]);

    useEffect(() => {
        setupMenu();
    }, [setupMenu]);

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
