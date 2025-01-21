import {useEffect, useState} from "react";
import axios from "axios";
import PortfolioSummaryList from "../../components/portu/PortfolioSummaryList.tsx";

export default function PortuSummary() {

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get("http://localhost:8081/portfolio").then((res) => {
            const data = res.data.data;

            setSelectedIds(data.map((p: PortfolioItem) => p.id)); // ✅ all selected by default
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Portu Summary</h2>
            <PortfolioSummaryList selectedIds={selectedIds} />
        </div>
    );
}
