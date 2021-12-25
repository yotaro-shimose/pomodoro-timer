// React
import { FC, useEffect } from "react";

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
  const ConditionedLoggedInScreen: FC = () => {
    if (isConfigured) {
      return <Content selectedTask={selectedTask} />;
    } else {
      return <ConfigScreen userConfig={userConfig} setUserConfig={setUserConfig} />;
    }
  };

  return (
    <div className="LoggedInScreen">
      <ConditionedSideBar />
      <Toolbar />
      <ConditionedLoggedInScreen />
    </div>
  );
};

export default LoggedInScreen;
