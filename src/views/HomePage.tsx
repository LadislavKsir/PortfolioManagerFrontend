import {JSX} from "react";
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import {styled} from '@mui/material/styles';

export default function HomePage() {
    function ExchangePanel(imageSrc: string, navigateToPath: string): JSX.Element {
        const onClick = () => {
            // const navigate = useNavigate();
            // navigate(navigateToPath);
            window.location.href = navigateToPath
        }

        return (
            <div className={"homepage-choice-container"}>
                <img
                    className={"homepage-choice-image"}
                    src={imageSrc}
                    alt={"Binance logo"}
                    onClick={onClick}>
                </img>
            </div>
        )
    }

    const Item = styled(Paper)(({theme}) => ({
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
                    <div className={"header-bar"}>
                    </div>
                </Item>
                <Item>
                    <div className={"choice-bar"} style={{display: "flex"}}>

                        {ExchangePanel("binance.png", '/binance/summary')}
                        {ExchangePanel("portu.jpg", '/portu/summary')}
                        {ExchangePanel("patria.png", '/patria/summary')}
                        {ExchangePanel("investown.png", '/investown/summary')}
                    </div>
                </Item>
            </Stack>
        </div>
    );
}
