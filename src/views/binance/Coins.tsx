// import React from "react";
// import { useTranslation } from "react-i18next";
import useFetch from "../../api/Api.ts";
import {Coin, ListCoinsResponse} from "../../types/Coin.ts";
import { Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent.tsx";
import Box from "@mui/material/Box";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";

export default function Coins() {

    const navigate = useNavigate();
    const data = useFetch<ListCoinsResponse>("/binance/coins")

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(3),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        ...theme.applyStyles('dark', {
            backgroundColor: '#1A2027',
        }),
    }));

    return (data === undefined) ? (
            <div>
                <h2>Coins</h2>
                <LoadingComponent/>
            </div>)
        : (
            <div>
                <h2>Coins</h2>

                <Box sx={{padding: '20px', height: '100vh'}}>
                    <Grid container spacing={4} justifyContent="center" alignItems="center">
                        {data.coins.sort((a, b) => a.code.localeCompare(b.code)).map((coin: Coin) => (
                            <Grid item xs={5} sm={6} md={4} lg={4} key={coin.code}>
                                <Item
                                    key={coin.code}
                                    onClick={function handleClick() {
                                        navigate("/binance/coins/" + coin.code);
                                    }}
                                >
                                    {coin.code}
                                </Item>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

            </div>
        );
}
