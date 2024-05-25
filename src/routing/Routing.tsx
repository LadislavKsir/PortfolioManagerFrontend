import {Route, Routes} from "react-router-dom";
import NotAuth from "../views/NotAuth";
import HomePage from "../views/HomePage.tsx";
import NoMatch from "../views/NoMatch.tsx";
import Summary from "../views/Summary.tsx";


/**
 * This component sets and manages routing in the application
 */
export default function Routing() {

    // const rootNode = document.getElementById("root") as HTMLElement;

    return (
        <div>

            <Routes>
                {/*<Route path="/" element={<HomePage />} />*/}
                <Route path="/home" element={<HomePage/>}/>
                {/*<Route path={`/${import.meta.env.VITE_PUBLIC_URL}`} element={<Navigate to="/" />} />*/}

                <Route path="/not_auth" element={<NotAuth/>}/>
                <Route path="/summary" element={<Summary/>}/>
                <Route path="*" element={<NoMatch/>}/>
            </Routes>
        </div>
    );
}
