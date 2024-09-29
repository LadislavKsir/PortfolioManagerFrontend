import * as React from 'react';
import Snackbar, {SnackbarCloseReason} from '@mui/material/Snackbar';
import {Alert} from "@mui/material";

interface AutohideSnackbarProps {
    title: string,
    text: string
}

export default function AutohideSnackbar(props: AutohideSnackbarProps) {
    const [open, setOpen] = React.useState(false);
    // const [value, setValue] = React.useState<string | null>(null);

    // const handleClick = () => {
    //     console.log("setOpen(true)")
    //     setOpen(true);
    // };

    // <div>
    //     <Alert
    //         onClose={() => {
    //         }}
    //         severity="success"
    //         variant="filled"
    //         sx={{width: '100%'}}
    //     />
    //     <Button onClick={() => enqueueSnackbar<'success'>('I love hooks')}>Show snackbar</Button>
    // </div>

    const handleClose = (
        _event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    // const setNewText = (newText: string) => {
    //     setValue(newText)
    //     setOpen(true);
    // };

    return (
        <div>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    {props.text}
                </Alert>
            </Snackbar>
        </div>
    );
}
