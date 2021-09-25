import { FC } from 'react';
import { makeStyles, Theme, Toolbar, Typography, AppBar } from '@material-ui/core';
import { CssBaseline } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import { Task } from '../interfaces/interfaces';
import SideBar from './SideBar';
import LoginButton from './LoginButton';
// import { calendarIdState, isLoggedInState } from '../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { tokenState } from '../atoms';
import { TOKEN_KEY } from '../utils/constants';
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            flexGrow: 1,
            zIndex: theme.zIndex.drawer + 1,
        },
        barRight: {
            flexGrow: 1,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            marginLeft: 2 * drawerWidth,
        },
    }),
);



const tasks: Task[] = [{ name: "Task1" }, { name: "Task2" }, { name: "Task3" }, { name: "Task4" }];
const Main: FC = () => {
    const appTitle = 'PomodoroTimer(仮)';
    const classes = useStyles();
    const setToken = useSetRecoilState(tokenState);
    // const calendarId = useRecoilValue(calendarIdState);
    // const isLoggedIn = useRecoilValue(isLoggedInState);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        {appTitle}
                    </Typography>
                    <div className={classes.barRight} />
                    <LoginButton />
                </Toolbar>
            </AppBar>
            <SideBar drawerWidth={drawerWidth} tasks={tasks} />
            <main className={classes.content}>
                <Toolbar />

                {/* <TimerScreen name={taskName} duration={10} onDone={onDone} /> */}
            </main>
        </div >
    )
}

export default Main;