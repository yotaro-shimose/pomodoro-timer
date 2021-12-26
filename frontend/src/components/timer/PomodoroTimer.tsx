// React
import { FC, useEffect, useState } from "react";
import { Typography, Toolbar, Grid } from "@material-ui/core";
import { useTimer } from "react-timer-hook";
import TimerButton from "./atoms/TimerButton";
import TimerScreen from "./atoms/TimerScreen";
import ConfirmDialog from "./ConfirmDialog";
import { startTimeState } from "../../atoms";
import { cancelFinishFactory, confirmFinishFactory, timerFinishFactory } from "../../factory";
import { Task } from "../../interfaces";
// State
import { useRecoilState } from "recoil";

interface PomodoroTimerProps {
    userId: string;
    timerConfig: number;
    task: Task;
}

const PomodoroTimer: FC<PomodoroTimerProps> = (props) => {
    // Modalの中身作成
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [startTime, setStartTime] = useRecoilState(startTimeState);
    useEffect(() => {
        setStartTime(new Date());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const time = new Date();
    time.setMinutes(time.getMinutes() + props.timerConfig);
    // eslint-disable-next-line
    const { seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
        autoStart: true,
        expiryTimestamp: time,
        onExpire: handleOpen,
    });
    const dispMinutes = ('00' + minutes).slice(-2);
    const dispSeconds = ('00' + seconds).slice(-2);

    const confirmFinish = confirmFinishFactory(pause, handleOpen);
    const finishName = "finish";

    const buttonDataList = [
        {
            func: confirmFinish,
            buttonName: finishName,
        },
    ];

    const finish = timerFinishFactory(props.userId, props.task, startTime, handleClose);
    const cancel = cancelFinishFactory(start, handleClose);

    return (
        <div className="PomodoroTimer">
            <Toolbar />
            <Typography variant="h3">{props.task.name}</Typography>
            <TimerScreen minutes={dispMinutes} seconds={dispSeconds} />
            <Grid container spacing={6} alignItems="center" justifyContent="center">
                {buttonDataList.map((buttonData, index) => (
                    <Grid item>
                        <TimerButton func={buttonData.func} buttonName={buttonData.buttonName} />
                    </Grid>
                ))}
            </Grid>
            <ConfirmDialog
                open={open}
                onClose={handleClose}
                finishFunc={finish}
                cancelFunc={cancel}
            ></ConfirmDialog>
        </div>
    );
};
export default PomodoroTimer;
