import {Route, Routes} from "react-router-dom";
import NotAuth from "../views/NotAuth";
import HomePage from "../views/HomePage.tsx";
import NoMatch from "../views/NoMatch.tsx";
import Summary from "../views/Summary.tsx";
import Coins from "../views/Coins.tsx";
import Dashboard from "../views/Dashboard.tsx";
import CoinDetail from "../views/CoinDetail.tsx";
import Orders from "../views/Orders.tsx";

/**
 * This component sets and manages routing in the application
 */
export default function Routing() {

    // const rootNode = document.getElementById("root") as HTMLElement;
    const SUMMARY_PATH = "/summary"


    return (
        <div>

            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/home" element={<HomePage/>}/>
                {/*<Route path={`/${import.meta.env.VITE_PUBLIC_URL}`} element={<Navigate to="/" />} />*/}

                <Route path="/not_auth" element={<NotAuth/>}/>
                <Route path={SUMMARY_PATH} element={<Summary/>}/>

                <Route path="/coins" element={<Coins/>}/>
                <Route path="/orders" element={<Orders/>}/>
                <Route path="/coins/:code" element={<CoinDetail coinCode={undefined}/>}/>

                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="*" element={<NoMatch/>}/>
            </Routes>
        </div>
    );
}
