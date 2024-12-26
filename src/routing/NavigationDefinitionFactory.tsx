import {NavigationDefinition} from "./NavigationDefinition.tsx";

export function summary(): NavigationDefinition {
    return {text: "Summary", link: "/binance/summary"}
}

export function orders(): NavigationDefinition {
    return {text: "Orders", link: "/binance/orders"}
}

export function coins(): NavigationDefinition {
    return {text: "Coins", link: "/binance/coins"}
}

export function earn(): NavigationDefinition {
    return {text: "Earn", link: "/binance/earn"}
}

export function settings(): NavigationDefinition {
    return {text: "Settings", link: "/binance/locked-subscriptions"}
}

export function binanceNavigation(): NavigationDefinition[] {
    return [summary(), orders(), coins(), earn()]
}


export function commonNavigation(): NavigationDefinition[] {
    return [settings()]
}
