import { FC, useCallback, useEffect } from "react";

// Material UI
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";

// State
import { atom } from "recoil";
import { TaskList, Calendar, UserConfig } from "../interfaces";
import { useRecoilState, useRecoilValue } from "recoil";
import { userIdState } from "../atoms";

// axios
import axios from "axios";

// endpoint
import MsgScreen from "./MsgScreen";

// API
import { fetchTaskList, fetchCalendar } from "../api";

const BackendURL = process.env.REACT_APP_BACKEND_URL;

const taskListListState = atom<TaskList[]>({
  key: "taskList",
  default: [],
});

const calendarListState = atom<Calendar[]>({
  key: "calendar",
  default: [],
});

// Define Enum
const StepList = {
  TASKLIST: "TASKLIST",
  CALENDAR: "CALENDAR",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
} as const;
type Step = typeof StepList[keyof typeof StepList];

interface State {
  step: Step;
  taskListId: string | null;
  calendarId: string | null;
}

let configState = atom<State>({
  key: "configState",
  default: {
    step: StepList.TASKLIST,
    taskListId: "",
    calendarId: "",
  },
});

interface ConfigScreenProps {
  userConfig: UserConfig;
  setUserConfig(config: UserConfig): void;
}

const ConfigScreen: FC<ConfigScreenProps> = (props: ConfigScreenProps) => {
  const [taskListList, setTaskListList] = useRecoilState(taskListListState);
  const [calendarList, setCalendarList] = useRecoilState(calendarListState);
  const [state, setState] = useRecoilState(configState);
  const userId = useRecoilValue(userIdState);
  const sendConfig = async (config: UserConfig) => {
    console.log("config", config);
    axios
      .put<boolean>(`${BackendURL}/user`, config, {
        headers: {
          "Content-Type": "application/json",
          id: userId,
        },
      })
      .then(() => {
        setState({ ...state, step: StepList.SUCCESS });
        console.log("refreshing");
        props.setUserConfig(config);
      })
      .catch(() => {
        setState({ ...state, step: StepList.FAILURE });
      });
  };

  const initState = useCallback(() => {
    fetchTaskList(userId).then((taskListList: TaskList[]) => {
      setTaskListList(taskListList);
    });
    fetchCalendar(userId).then((calendarList: Calendar[]) => {
      setCalendarList(calendarList);
    });
    const initState = {
      ...state,
      taskListId: props.userConfig.taskListId,
      calendarId: props.userConfig.calendarId,
    };
    setState(initState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    initState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const nextStep = () => {
    if (state.step !== StepList.TASKLIST) {
      throw Error("Unexpected Step!");
    }
    const nextState = { ...state, step: StepList.CALENDAR };
    setState(nextState);
  };
  const handleChange: (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => void =
    (key) => (event) => {
      const target = event.target as HTMLInputElement;
      const nextState = {
        ...state,
        [key]: target.value,
      };
      setState(nextState);
    };
  const hundleSubmit: () => void = () => {
    const config: UserConfig = {
      taskListId: state.taskListId,
      calendarId: state.calendarId,
    };
    sendConfig(config);
  };

  const taskListForm = (
    <div className="taskListForm">
      <FormControl component="label">
        <FormLabel component="label">Select Task List</FormLabel>
        <RadioGroup name="TaskList" value={state.taskListId} onChange={handleChange("taskListId")}>
          {taskListList.map((taskList, idx) => {
            return (
              <FormControlLabel
                key={idx}
                value={taskList.id}
                control={<Radio />}
                label={taskList.summary}
                checked={taskList.id === state.taskListId}
              />
            );
          })}
        </RadioGroup>
        <Button onClick={nextStep}>Next</Button>
      </FormControl>
    </div>
  );
  const calendarForm = (
    <div className="calendarForm">
      <FormControl component="label">
        <FormLabel component="label">Select Calendar</FormLabel>
        <RadioGroup name="Calendar" value={state.calendarId} onChange={handleChange("calendarId")}>
          {calendarList.map((calendar, idx) => {
            return (
              <FormControlLabel
                key={idx}
                value={calendar.id}
                control={<Radio />}
                label={calendar.summary}
                checked={calendar.id === state.calendarId}
              />
            );
          })}
        </RadioGroup>
        <Button onClick={hundleSubmit}>Submit</Button>
      </FormControl>
    </div>
  );
  const successScreen = <MsgScreen msg="Successfully Configured Your Calendar and Task List!" />;
  const failureScreen = <MsgScreen msg="Configuration Failure. Please Contact Us." />;
  const content = (() => {
    switch (state.step) {
      case StepList.TASKLIST: {
        return taskListForm;
      }
      case StepList.CALENDAR: {
        return calendarForm;
      }
      case StepList.SUCCESS: {
        return successScreen;
      }
      case StepList.FAILURE: {
        return failureScreen;
      }
      default:
        throw Error("Unexpected Step");
    }
  })();

  return <div className="Config">{content}</div>;
};

export default ConfigScreen;
