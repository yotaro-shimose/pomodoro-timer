// React
import { FC } from "react";

import { makeStyles, Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/core/styles";
interface TimerScreenProps {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        TimerScreen: {
            fontSize: "6rem"
        }
    })
);

const TimerScreen: FC<TimerScreenProps> = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.TimerScreen}>
            <span>{props.days}</span>:<span>{props.hours}</span>:<span>{props.minutes}</span>:
            <span>{props.seconds}</span>
        </div>
    )
}
export default TimerScreen;