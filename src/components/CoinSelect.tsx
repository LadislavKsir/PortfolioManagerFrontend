import {JSX} from "react";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import useFetch from "../api/Api.ts";
import {Coin} from "../types/Coin.ts";
import {PagedResponse} from "../types/PagedResponse.ts";

interface CoinSelectProps {
    selectedCoin: string;
    onCoinSelect: (coin: string) => void;
}

export default function CoinSelect({ selectedCoin, onCoinSelect }: CoinSelectProps): JSX.Element {
    const handleCoinSelectChange = (event: SelectChangeEvent) => {
        const selectedCoinCode = event.target.value as string
        onCoinSelect(selectedCoinCode);
    };

    const coins = useFetch<PagedResponse<Coin>>('/binance/coins')

    if (!coins) {
        return <div></div>
    } else {
        // const c = {id: 0, code: "ALL"} as Coin
        // coins.coins.push(c)

        return (
            <div className={"xxx"}>
                <FormControl>
                    <InputLabel id="select-coin-label">Coin</InputLabel>

                    <Select
                        labelId="coin-select-label"
                        id="coin-select"
                        value={selectedCoin}
                        // label="Select Coin"
                        onChange={handleCoinSelectChange}
                        displayEmpty={true}
                    >
                        <MenuItem key={-1} value={""}>
                            -* All *-
                        </MenuItem>
                        {coins.data.map((coin) => (
                            <MenuItem key={coin.id} value={coin.code}>
                                {coin.code}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        )
    }
}