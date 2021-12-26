import { FC } from "react";
import TimerButton from "./atoms/TimerButton";
import { Grid, Dialog, DialogTitle, DialogContent } from "@material-ui/core";
interface ConfirmDialogProps {
    open: boolean;
    onClose(): void;
    finishFunc(): void;
    cancelFunc(): void;
}
const ConfirmDialog: FC<ConfirmDialogProps> = (props) => {

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            fullWidth={true}
        >
            <DialogTitle>時間計測を終了してよろしいですか？</DialogTitle>
            <DialogContent dividers={true}>
                <Grid container spacing={6} alignItems="center" justifyContent="center">
                    <Grid item>
                        <TimerButton buttonName="終了" func={props.finishFunc} />
                    </Grid>
                    <Grid item>
                        <TimerButton buttonName="キャンセル" func={props.cancelFunc} />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>

    )
}
export default ConfirmDialog;