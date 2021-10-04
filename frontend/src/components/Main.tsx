// React
import { FC } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Material UI
import { makeStyles, Theme, Toolbar } from '@material-ui/core';
import { CssBaseline } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';

// Components
import SideBar from './SideBar';
import Config from './Config';
import TitledToolbar from './TitledToolbar';

// interfaces
import { Task, TaskList, Calendar } from '../interfaces';

// State
import { useSetRecoilState } from 'recoil';
import { userIdState } from '../atoms';
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
    }),
);



const tasks: Task[] = [{ name: "Task1" }, { name: "Task2" }, { name: "Task3" }, { name: "Task4" }];
const taskListList: TaskList[] = [
    {
        summary: 'MyTaskList1',
        id: 'id1',
    },
    {
        summary: 'MyTaskList2',
        id: 'id2',
    },
    {
        summary: 'MyTaskList3',
        id: 'id3',
    },
]
const calendarList: Calendar[] = [
    {
        summary: 'MyCalendar1',
        id: 'cid1',
    },
    {
        summary: 'MyCalendar2',
        id: 'cid2',
    },
    {
        summary: 'MyCalendar3',
        id: 'cid3',
    },
    {
        summary: 'MyCalendar4',
        id: 'cid4',
    },
]
const calendarId = '';
const taskListId = 'id3';
const Main: FC = () => {
    const appTitle = 'PomodoroTimer(仮)';
    const classes = useStyles();
    const setUserId = useSetRecoilState(userIdState);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <TitledToolbar appTitle={appTitle} drawerWidth={drawerWidth} setUserId={setUserId} />
            <SideBar drawerWidth={drawerWidth} tasks={tasks} />


            <main className={classes.content}>
                <Toolbar />
                <Router>
                    <Route exact path="/config">
                        <Config taskListList={taskListList} calendarList={calendarList} taskListId={taskListId} calendarId={calendarId} />
                    </Route>
                </Router>
                {/* <TimerScreen name={taskName} duration={10} onDone={onDone} /> */}
            </main>
        </div >
    )
}

export default Main;