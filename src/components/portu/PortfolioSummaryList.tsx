import  { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box
} from '@mui/material';
import {useNavigate} from "react-router-dom";

interface PortfolioSummaryListProps {
    selectedIds: number[];
}

const PortfolioSummaryList = ({ selectedIds }: PortfolioSummaryListProps) => {
    const [summaries, setSummaries] = useState<PortfolioSummary[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!selectedIds.length) {
            setSummaries([]);
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get<PortfolioSummary[]>('http://192.168.0.106:8081/portfolio/summary', {
                    params: { portfolioIds: selectedIds },
                    paramsSerializer: (params) =>
                        params.portfolioIds.map((id: number) => `portfolioIds=${id}`).join('&'),
                });
                setSummaries(response.data);
            } catch (error) {
                console.error('Failed to fetch portfolio summaries', error);
            }
        };

        fetchData();
    }, [selectedIds]);

    function handleCardClick(id: number) {
        navigate("/portu/portfolio/" + id);
    }



    return (
        <Box mt={4}>
            <Grid container spacing={2}>
                {summaries.map(({ portfolio, transactionsSummary }) => (
                    <Grid item xs={12} sm={6} md={4} key={portfolio.id}>
                        <Card
                            variant="outlined"
                            sx={{
                                backgroundColor: portfolio.active ? 'background.paper' : 'grey.200',
                                opacity: portfolio.active ? 1 : 0.6,
                            }}
                            onClick={() => handleCardClick(portfolio.id)}
                        >
                            <CardContent>
                                <Typography variant="h6" gutterBottom > {portfolio.name}</Typography>
                                <Typography variant="body2" align="left">💰 Total In: {transactionsSummary.totalIn}</Typography>
                                <Typography variant="body2" align="left">💸 Total Out: {transactionsSummary.totalOut}</Typography>
                                <Typography variant="body2" align="left">🧾 Fees: {transactionsSummary.totalFees}</Typography>
                                <Typography variant="body2" align="left">📈 Dividends: {transactionsSummary.totalDividends}</Typography>
                            </CardContent>
                        </Card>


                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default PortfolioSummaryList;
