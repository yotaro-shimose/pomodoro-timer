// React
import { FC, useEffect } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

// Material UI
import { Typography, Toolbar } from "@material-ui/core";

// Components
import SideBar from "./SideBar";
import ConfigScreen from "./ConfigScreen";

// State
import { useRecoilValue, useRecoilState } from "recoil";
import { isConfiguredState, userConfigState, userIdState } from "../atoms";

// API
import { fetchUserConfig } from "../api";

// Interfaces
import { UserConfig } from "../interfaces";

const drawerWidth = 240;

export const LoggedInScreen: FC = () => {
  const userId = useRecoilValue(userIdState);
  const [userConfig, setUserConfig] = useRecoilState(userConfigState);
  useEffect(() => {
    fetchUserConfig(userId).then((userConfig: UserConfig) => {
      setUserConfig(userConfig);
    });
  }, []);
  const isConfigured = useRecoilValue(isConfiguredState);
  let MainContent: FC = () => {
    return (
      <Typography>
        <h3>This is a main content</h3>
      </Typography>
    );
  };

  const ConditionedSideBar: FC = () => {
    if (isConfigured) {
      return <SideBar drawerWidth={drawerWidth} />;
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
            render={() => (isConfigured ? <MainContent /> : <Redirect to="/config" />)}
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
