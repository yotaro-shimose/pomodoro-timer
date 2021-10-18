import { Task, TaskList, Calendar, UserProfile } from "./interfaces";

export const fetchTask: () => Promise<Task[]> = async () => {
  return [
    { id: "t1", name: "Task1" },
    { id: "t2", name: "Task2" },
    { id: "t3", name: "Task3" },
    { id: "t4", name: "Task4" },
  ];
};

export const fetchTaskList: () => Promise<TaskList[]> = async () => {
  return [
    {
      summary: "MyTaskList1",
      id: "id1",
    },
    {
      summary: "MyTaskList2",
      id: "id2",
    },
    {
      summary: "MyTaskList3",
      id: "id3",
    },
  ];
};

export const fetchCalendar: () => Promise<Calendar[]> = async () => {
  return [
    {
      summary: "MyCalendar1",
      id: "cid1",
    },
    {
      summary: "MyCalendar2",
      id: "cid2",
    },
    {
      summary: "MyCalendar3",
      id: "cid3",
    },
    {
      summary: "MyCalendar4",
      id: "cid4",
    },
  ];
};

export const fetchUserProfile: () => Promise<UserProfile> = async () => {
  return {
    id: "myUserId",
    taskListId: "id1",
    calendarId: "cid2",
  };
};
