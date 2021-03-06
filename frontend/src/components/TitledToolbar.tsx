import { FC } from "react";
import { makeStyles, Theme, Toolbar, Typography, AppBar } from "@material-ui/core";
import { createStyles } from "@material-ui/core/styles";
import LoginButton from "./LoginButton";

interface TitledToolbarProps {
  appTitle: string;
  drawerWidth: number;
}

const TitledToolbar: FC<TitledToolbarProps> = (props) => {
  const appTitle = props.appTitle;
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      appBar: {
        flexGrow: 1,
        zIndex: theme.zIndex.drawer + 1,
      },
      barRight: {
        flexGrow: 1,
      },
    })
  );
  const classes = useStyles();

  return (
    <div className="TitledToolBar">
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            {appTitle}
          </Typography>
          <div className={classes.barRight} />
          <LoginButton />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TitledToolbar;
