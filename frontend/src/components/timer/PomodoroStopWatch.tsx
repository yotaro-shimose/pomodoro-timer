// React
import { FC, useEffect, useState } from "react";
import { Typography, Toolbar, Grid } from "@material-ui/core";
import { useStopwatch } from "react-timer-hook";
import TimerButton from "./atoms/TimerButton";
import StopWatchScreen from "./atoms/StopWatchScreen";
import { startTimeState } from "../../atoms";
import ConfirmDialog from "./ConfirmDialog";
import { confirmFinishFactory, timerFinishFactory, cancelFinishFactory } from "../../factory";
import { Task } from "../../interfaces";
// State
import { useRecoilState } from "recoil";
interface PomodoroStopWatchProps {
  userId: string;
  task: Task;
}

const PomodoroStopWatch: FC<PomodoroStopWatchProps> = (props) => {
  // Modalの中身作成
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [startTime, setStartTime] = useRecoilState(startTimeState);
  useEffect(() => {
    setStartTime(new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // eslint-disable-next-line
  const { seconds, minutes, hours, days, isRunning, start, pause, reset } = useStopwatch({
    autoStart: true,
  });

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
    <div className="StopWatchScreen">
      <Toolbar />
      <Typography variant="h3">{props.task.name}</Typography>
      <StopWatchScreen days={days} hours={hours} minutes={minutes} seconds={seconds} />
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
export default PomodoroStopWatch;
