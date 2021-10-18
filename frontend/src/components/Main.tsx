// React
import { FC, useEffect } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

// Material UI
import { makeStyles, Theme, Toolbar, Typography } from "@material-ui/core";
import { CssBaseline } from "@material-ui/core";
import { createStyles } from "@material-ui/core/styles";

// Components
import SideBar from "./SideBar";
import ConfigScreen from "./ConfigScreen";
import TitledToolbar from "./TitledToolbar";

// interfaces
import { Task, APIError } from "../interfaces";

// State
import { atom, useRecoilState, useSetRecoilState } from "recoil";
import { userProfileState } from "../atoms";

// API
import { fetchTask } from "../api";
import { STATUS } from "../constants";
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

// State Definition
const taskListState = atom<Task[] | null>({
  key: "task",
  default: [],
});

const needConfigState = atom<boolean>({
  key: "needConfig",
  default: false,
});

const Main: FC = () => {
  const appTitle = "PomodoroTimer(仮)";
  const classes = useStyles();
  const setUserProfile = useSetRecoilState(userProfileState);
  const [taskList, setTaskList] = useRecoilState(taskListState);
  const [needConfig, setNeedConfig] = useRecoilState(needConfigState);

  useEffect(() => {
    fetchTask()
      .then((taskList: Task[]) => {
        setTaskList(taskList);
      })
      .catch((error: APIError) => {
        if (error.status === STATUS.ConfigNotCompleted) {
          setNeedConfig(true);
        }
      });
  });

  let sideBar;
  if (taskList) {
    sideBar = <SideBar drawerWidth={drawerWidth} tasks={taskList} />;
  } else {
    sideBar = <></>;
  }

  let MainContent: FC = () => {
    return (
      <Typography>
        <h3>This is a main content</h3>
      </Typography>
    );
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <TitledToolbar appTitle={appTitle} drawerWidth={drawerWidth} setUserProfile={setUserProfile} />
      {sideBar}
      <main className={classes.content}>
        <Toolbar />
        <Router>
          <Route
            path="/"
            render={() => (needConfig ? <Redirect to="/config" /> : <MainContent />)}
          />
          <Route exact path="/config">
            <ConfigScreen />
          </Route>
        </Router>
        {/* <TimerScreen name={taskName} duration={10} onDone={onDone} /> */}
      </main>
    </div>
  );
};

export default Main;
