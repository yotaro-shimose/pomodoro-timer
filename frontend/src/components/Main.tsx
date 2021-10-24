// React
import { FC } from "react";

// Material UI
import { makeStyles, Theme } from "@material-ui/core";
import { CssBaseline } from "@material-ui/core";
import { createStyles } from "@material-ui/core/styles";

// Components
import TitledToolbar from "./TitledToolbar";

// State
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../atoms";

// API
import LoggedInScreen from "./LoggedInScreen";
import LoggedOutScreen from "./LoggedOutScreen";
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

const Main: FC = () => {
  const appTitle = "PomodoroTimer(仮)";
  const classes = useStyles();
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const MainScreen: FC = () => {
    if (isLoggedIn) {
      return <LoggedInScreen />;
    } else {
      return <LoggedOutScreen />;
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <TitledToolbar appTitle={appTitle} drawerWidth={drawerWidth} />

      <main className={classes.content}>
        <MainScreen />
      </main>
    </div>
  );
};

export default Main;
