import {Route, Routes} from "react-router-dom";
import NotAuth from "../views/NotAuth";
import HomePage from "../views/HomePage.tsx";
import NoMatch from "../views/NoMatch.tsx";
import BinanceSummary from "../views/binance/BinanceSummary.tsx";
import Coins from "../views/binance/Coins.tsx";
import CoinDetail from "../views/binance/CoinDetail.tsx";
import Orders from "../views/binance/Orders.tsx";
import PortuSummary from "../views/portu/PortuSummary.tsx";
import PatriaSummary from "../views/patria/PatriaSummary.tsx";
import InvestownSummary from "../views/investown/InvestownSummary.tsx";
import MainSummary from "../views/MainSummary.tsx";
import {MenuProps} from "../App.tsx";
// import * as routingConstants from 'RoutingConstants.js';
// import * as routingConstants from '../routing/RoutingConstants.js';

/**
 * This component sets and manages routing in the application
 */
export default function Routing(menuProps: MenuProps) {

    const SUMMARY_PATH = "/summary"

    const BINANCE_SUMMARY_PATH = "/binance" + SUMMARY_PATH
    const PORTU_SUMMARY_PATH = "/portu" + SUMMARY_PATH
    const PATRIA_SUMMARY_PATH = "/patria" + SUMMARY_PATH
    const INVESTOWN_SUMMARY_PATH = "/investown" + SUMMARY_PATH


    const BINANCE_COINS_PATH = "/binance/coins"
    const BINANCE_ORDERS_PATH = "/binance/orders"
    const BINANCE_COIN_DETAIL_PATH = "/binance/coins/:code"


    return (
        <div>

            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/not_auth" element={<NotAuth/>}/>

                <Route path="/home" element={<HomePage/>}/>

                <Route path={SUMMARY_PATH} element={<MainSummary/>}/>

                <Route path={BINANCE_SUMMARY_PATH} element={
                    <BinanceSummary
                        setMenuComponentContent={menuProps.setMenuComponentContent}
                        setNavigationContent={menuProps.setNavigationContent}
                    />
                }/>

                {/*<Route path={BINANCE_SUMMARY_PATH} element={<BinanceSummary/>}/>*/}
                <Route path={PORTU_SUMMARY_PATH} element={<PortuSummary/>}/>

                <Route path={PATRIA_SUMMARY_PATH}
                       element={<PatriaSummary
                           setMenuComponentContent={menuProps.setMenuComponentContent}
                           setNavigationContent={menuProps.setNavigationContent}/>
                }/>

                <Route path={INVESTOWN_SUMMARY_PATH} element={<InvestownSummary/>}/>


                <Route path={BINANCE_COINS_PATH} element={<Coins/>}/>
                <Route path={BINANCE_ORDERS_PATH}
                       element={
                           <Orders setMenuComponentContent={menuProps.setMenuComponentContent}
                                   setNavigationContent={menuProps.setNavigationContent}/>
                       }
                />

                <Route path={BINANCE_COIN_DETAIL_PATH} element={<CoinDetail/>}/>


                <Route path="*" element={<NoMatch/>}/>
            </Routes>
        </div>
    );
}
