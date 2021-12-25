// React
import { FC } from "react";
import { Toolbar, Grid } from "@material-ui/core";
import { useStopwatch } from "react-timer-hook";
import TimerButton from "./atoms/TimerButton";
import TimerScreen from "./atoms/TimerScreen";

const PomodoroTimer: FC = () => {
    const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
        useStopwatch({ autoStart: true });

    const finish = () => {
        // TODO: タイマーを終了させるときの動作
        pause();
        console.log("finish!!");
    }

    const startName = "start";
    const pauseName = "pause";
    const finishName = "finish";

    const buttonDataList = [
        {
            "func": start,
            "buttonName": startName
        }, {
            "func": pause,
            "buttonName": pauseName
        }, {
            "func": finish,
            "buttonName": finishName
        }
    ]

    return (
        <div className="PomodoroTimer">
            <Toolbar />
            <TimerScreen days={days} hours={hours} minutes={minutes} seconds={seconds} />
            <Grid container spacing={6} alignItems="center" justifyContent="center">
                {buttonDataList.map((buttonData, index) => (
                    <Grid item>
                        <TimerButton
                            func={buttonData.func}
                            buttonName={buttonData.buttonName}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}
export default PomodoroTimer;