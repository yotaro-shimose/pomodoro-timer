import { FC, useEffect } from "react";
import Drawer from "@material-ui/core/Drawer";
import { Divider, List, makeStyles, Theme, Toolbar } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles } from "@material-ui/core/styles";

import { Task, APIError } from "../interfaces";

import { fetchTask } from "../api";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { needConfigState, taskListState, userProfileState } from "../atoms";

interface SideBarProps {
  drawerWidth: number;
}

const SideBar: FC<SideBarProps> = (props: SideBarProps) => {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      drawer: {
        width: props.drawerWidth,
        flexShrink: 0,
      },
      drawerPaper: {
        width: props.drawerWidth,
      },
      drawerContainer: {
        overflow: "auto",
      },
    })
  );
  const classes = useStyles();
  const setNeedConfig = useSetRecoilState(needConfigState);
  const userProfile = useRecoilValue(userProfileState);
  const [taskList, setTaskList] = useRecoilState(taskListState);
  // TODO タスクリストをステートレスに
  useEffect(() => {
    fetchTask(userProfile.id)
      .then((taskList: Task[]) => {
        setTaskList(taskList);
      })
      .catch((_error: APIError) => {
        setNeedConfig(true);
      });
  }, []);
  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          {taskList.map((task, index) => (
            <ListItem button key={index}>
              <ListItemText primary={task.name} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </div>
    </Drawer>
  );
};

export default SideBar;
export type { SideBarProps };
