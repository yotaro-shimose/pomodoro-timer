// React
import { FC } from "react";

import { makeStyles, Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/core/styles";

interface TimerScreenProps {
    minutes: string,
    seconds: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        TimerScreen: {
            fontSize: "9rem"
        }
    })
);

const TimerScreen: FC<TimerScreenProps> = (props) => {

    const classes = useStyles();
    return (
        <div className={classes.TimerScreen}>
            <span>{props.minutes}</span>:
            <span>{props.seconds}</span>
        </div>
    )
}
export default TimerScreen;