import {JSX} from "react";
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import {styled} from '@mui/material/styles';
import {useNavigate} from "react-router-dom";
function ExchangePanel({ imageSrc, navigateToPath }: { imageSrc: string; navigateToPath: string }): JSX.Element {
    const navigate = useNavigate();

    const onClick = () => {
        navigate(navigateToPath);
    };

    return (
        <div className={"homepage-choice-container"}>
            <img
                className={"homepage-choice-image"}
                src={imageSrc}
                alt={"Exchange logo"}
                onClick={onClick}
            />
        </div>
    );
}

export default function HomePage() {
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (
        <div className={"homepage-container"}>
            <Stack spacing={2}>
                <Item>
                    <div className={"header-bar"}></div>
                </Item>
                <Item>
                    <div className={"choice-bar"} style={{ display: "flex" }}>
                        <ExchangePanel imageSrc="binance.png" navigateToPath="/binance/summary" />
                        <ExchangePanel imageSrc="portu.jpg" navigateToPath="/portu/summary" />
                        <ExchangePanel imageSrc="patria.png" navigateToPath="/patria/summary" />
                        <ExchangePanel imageSrc="investown.png" navigateToPath="/investown/summary" />
                    </div>
                </Item>
            </Stack>
        </div>
    );
}