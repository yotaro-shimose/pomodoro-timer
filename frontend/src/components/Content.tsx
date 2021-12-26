import { FC } from "react";
import { Task } from "../interfaces";

// State
import SelectTimer from "./timer/SelectTimer";
import { Toolbar, Typography } from "@material-ui/core";
import PomodoroTimer from "./timer/PomodoroTimer";
import PomodoroStopWatch from "./timer/PomodoroStopWatch";

interface ContentProps {
  userId: string;
  selectedTask: Task | null;
  timerConfig: number | null;
  setTimerConfig(timerConfig: number | null): void;
}
const Content: FC<ContentProps> = (props) => {
  let content;
  if (props.selectedTask) {
    if (props.timerConfig != null) {
      if (props.timerConfig) {
        content = (
          <PomodoroTimer
            userId={props.userId}
            timerConfig={props.timerConfig}
            task={props.selectedTask}
          ></PomodoroTimer>
        );
      } else {
        content = (
          <PomodoroStopWatch userId={props.userId} task={props.selectedTask}></PomodoroStopWatch>
        );
      }
    } else {
      content = <SelectTimer setTimerConfig={props.setTimerConfig} task={props.selectedTask} />;
    }
  } else {
    content = (
      <Typography>
        <h3>始めるタスクを選んでね！</h3>
      </Typography>
    );
  }
  return (
    <div className="Content">
      <Toolbar />
      {content}
    </div>
  );
};

export default Content;
