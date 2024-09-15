import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {JSX} from "react";

interface AppDialogProps {
    modalIsOpen: boolean,
    content: JSX.Element | null,
    onClose: () => void;
}

export function AppDialog(props: AppDialogProps): JSX.Element {
    return (
        <Dialog open={props.modalIsOpen} onClose={() => props.onClose}>
            <DialogTitle>Sync Results</DialogTitle>
            <DialogContent>
                {props.content}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

