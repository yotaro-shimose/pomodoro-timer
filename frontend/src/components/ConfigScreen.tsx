import { FC, useEffect } from "react";

// Material UI
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";

// State
import { atom } from "recoil";
import { TaskList, Calendar, Config as UserConfig } from "../interfaces";
import { useRecoilState, useRecoilValue } from "recoil";
import { userIdState } from "../atoms";

// axios
import axios from "axios";

// endpoint
import { BackendURL } from "../constants";
import MsgScreen from "./MsgScreen";

interface ConfigProps {
  taskListList: TaskList[];
  calendarList: Calendar[];
  taskListId: string;
  calendarId: string;
}

// Define Enum
const Step = {
  TASKLIST: "TASKLIST",
  CALENDAR: "CALENDAR",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
} as const;
type Step = typeof Step[keyof typeof Step];

interface State {
  step: Step;
  taskListId: string;
  calendarId: string;
}

let configState = atom<State>({
  key: "configState",
  default: {
    step: Step.TASKLIST,
    taskListId: "",
    calendarId: "",
  },
});

const ConfigScreen: FC<ConfigProps> = (props) => {
  const [state, setState] = useRecoilState(configState);
  const userId = useRecoilValue(userIdState);
  const sendConfig = async (config: UserConfig) => {
    axios
      .post<boolean>(`${BackendURL}/config`, config, {
        headers: {
          "Content-Type": "x-www-form-urlencoded",
          userId: userId,
        },
      })
      .then(() => {
        setState({ ...state, step: Step.SUCCESS });
      })
      .catch(() => {
        setState({ ...state, step: Step.FAILURE });
      });
  };
  useEffect(() => {
    const initState = { ...state, taskListId: props.taskListId, calendarId: props.calendarId };
    setState(initState);
  }, []);
  const nextStep = () => {
    if (state.step !== Step.TASKLIST) {
      throw "Unexpected Step!";
    }
    const nextState = { ...state, step: Step.CALENDAR };
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
          {props.taskListList.map((taskList, idx) => {
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
          {props.calendarList.map((calendar, idx) => {
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
      case Step.TASKLIST: {
        return taskListForm;
      }
      case Step.CALENDAR: {
        return calendarForm;
      }
      case Step.SUCCESS: {
        return successScreen;
      }
      case Step.FAILURE: {
        return failureScreen;
      }
      default:
        throw "Unexpected Step";
    }
  })();

  return <div className="Config">{content}</div>;
};

export default ConfigScreen;