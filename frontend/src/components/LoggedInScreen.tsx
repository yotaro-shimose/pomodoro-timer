// React
import { FC, useEffect } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

// Material UI
import { Typography } from "@material-ui/core";

// Components
import SideBar from "./SideBar";
import ConfigScreen from "./ConfigScreen";

// interfaces
import { Task, APIError } from "../interfaces";

// State
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { userProfileState, taskListState } from "../atoms";

// API
import { fetchTask } from "../api";
import { STATUS } from "../constants";

const drawerWidth = 240;

const needConfigState = atom<boolean>({
  key: "needConfig",
  default: false,
});

export const LoggedInScreen: FC = () => {
  const userProfile = useRecoilValue(userProfileState);
  const [needConfig, setNeedConfig] = useRecoilState(needConfigState);
  const [taskList, setTaskList] = useRecoilState(taskListState);
  let MainContent: FC = () => {
    return (
      <Typography>
        <h3>This is a main content</h3>
      </Typography>
    );
  };

  const ConditionedSideBar: FC = () => {
    if (taskList) {
      return <SideBar drawerWidth={drawerWidth} tasks={taskList} />;
    } else {
      return null;
    }
  };
  useEffect(() => {
    fetchTask(userProfile.id)
      .then((taskList: Task[]) => {
        setTaskList(taskList);
      })
      .catch((error: APIError) => {
        if (error.status === STATUS.ConfigNotCompleted) {
          setNeedConfig(true);
        }
      });
  }, [userProfile, setTaskList, setNeedConfig]);
  return (
    <div className="LoggedInScreen">
      <ConditionedSideBar />
      <Router>
        <Route path="/" render={() => (needConfig ? <Redirect to="/config" /> : <MainContent />)} />
        <Route exact path="/config">
          <ConfigScreen />
        </Route>
      </Router>
      {/* <TimerScreen name={taskName} duration={10} onDone={onDone} /> */}
    </div>
  );
};

export default LoggedInScreen;
