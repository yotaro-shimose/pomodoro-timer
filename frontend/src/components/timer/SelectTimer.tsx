import { FC } from "react";
import { Task } from "../../interfaces";
import { Grid } from "@material-ui/core";
import TimerButton from "./atoms/TimerButton";

interface SelectTimerProps {
  setTimerConfig(x: number): void;
  task: Task;
}

const SelectTimer: FC<SelectTimerProps> = (props) => {
  const setTimer = (x: number) => () => {
    props.setTimerConfig(x);
  };

  const buttonDataList = [
    {
      func: setTimer(5),
      buttonName: "5分",
    },
    {
      func: setTimer(15),
      buttonName: "15分",
    },
    {
      func: setTimer(30),
      buttonName: "30分",
    },
    {
      func: setTimer(0),
      buttonName: "∞",
    },
  ];

  return (
    <div className="SelectTimer">
      <Grid container alignItems="center" justifyContent="center">
        <Grid item>
          <h3>{props.task.name}</h3>
        </Grid>
      </Grid>
      <Grid container spacing={6} alignItems="center" justifyContent="center">
        {buttonDataList.map((buttonData, index) => (
          <Grid item>
            <TimerButton func={buttonData.func} buttonName={buttonData.buttonName} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default SelectTimer;
