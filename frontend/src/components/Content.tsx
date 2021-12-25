import { FC } from "react";
import { Task } from "../interfaces";
import { timerConfigState } from "../atoms";
// State
import { useRecoilValue, useRecoilState } from "recoil";
import SelectTimer from "./timer/SelectTimer";
import { Toolbar, Typography } from "@material-ui/core";
import PomodoroTimer from "./timer/PomodoroTimer";
import PomodoroStopWatch from "./timer/PomodoroStopWatch";
interface ContentProps {
  selectedTask: Task | null;
}
const Content: FC<ContentProps> = (props) => {
  const [timerConfig, setTimerConfig] = useRecoilState(timerConfigState)
  let content;
  if (props.selectedTask) {
    if (timerConfig != null) {
      if (timerConfig) {
        content = <PomodoroTimer timerConfig={timerConfig} task={props.selectedTask}></PomodoroTimer>
      }
      else {
        content = <PomodoroStopWatch task={props.selectedTask}></PomodoroStopWatch>
      }
    }
    else {
      content = <SelectTimer setTimerConfig={setTimerConfig} task={props.selectedTask} />
    }
  }
  else {
    content =
      <Typography>
        <h3>始めるタスクを選んでね！</h3>
      </Typography>
  }
  return (
    <div className="Content">
      <Toolbar />
      {content}
    </div>
  );
};

export default Content;
