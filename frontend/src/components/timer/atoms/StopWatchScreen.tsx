// React
import { FC } from "react";

import { makeStyles, Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/core/styles";

interface StopWatchScreenProps {
    hours: string,
    minutes: string,
    seconds: string,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        StopWatchScreen: {
            fontSize: "6rem"
        }
    })
);

const StopWatchScreen: FC<StopWatchScreenProps> = (props) => {

    const classes = useStyles();
    return (
        <div className={classes.StopWatchScreen}>
            <span>{props.hours}</span>:<span>{props.minutes}</span>:
            <span>{props.seconds}</span>
        </div>
    )
}
export default StopWatchScreen;