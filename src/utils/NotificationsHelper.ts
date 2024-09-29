import {enqueueSnackbar} from "notistack";

/*
success
danger
info
default
warning
 */
export function errorNotification(message: string) {
    // addNotification(message, "danger")
    enqueueSnackbar(message, {variant: 'error'})
}

export function fetchOkNotification() {
    enqueueSnackbar("Done!", {variant: 'success'})
}