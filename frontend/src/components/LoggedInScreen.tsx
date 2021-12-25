// React
import { FC, useEffect } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

// Material UI
import { Toolbar } from "@material-ui/core";

// Components
import SideBar from "./SideBar";
import ConfigScreen from "./ConfigScreen";
import Content from "./Content";

// State
import { useRecoilValue, useRecoilState } from "recoil";
import { isConfiguredState, userConfigState, userIdState, selectedTaskState } from "../atoms";

// API
import { fetchUserConfig } from "../api";

// Interfaces
import { UserConfig } from "../interfaces";

const drawerWidth = 240;

export const LoggedInScreen: FC = () => {
  const userId = useRecoilValue(userIdState);
  const [userConfig, setUserConfig] = useRecoilState(userConfigState);
  const [selectedTask, setSelectedTask] = useRecoilState(selectedTaskState);

  useEffect(() => {
    fetchUserConfig(userId).then((userConfig: UserConfig) => {
      setUserConfig(userConfig);
    });
  }, []);
  const isConfigured = useRecoilValue(isConfiguredState);

  const ConditionedSideBar: FC = () => {
    if (isConfigured) {
      return (
        <SideBar
          drawerWidth={drawerWidth}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <div className="LoggedInScreen">
      <ConditionedSideBar />
      <Toolbar />
      <Router>
        <Switch>
          <Route
            path="/"
            render={() =>
              isConfigured ? <Content selectedTask={selectedTask} /> : <Redirect to="/config" />
            }
          />
          <Route exact path="/config">
            <ConfigScreen userConfig={userConfig} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default LoggedInScreen;
