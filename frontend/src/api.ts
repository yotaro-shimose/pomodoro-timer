import { Task, TaskList, Calendar, UserProfile } from "./interfaces";
import axios, { AxiosResponse } from "axios";
import { BackendURL } from "./constants";
export const fetchTask: (id: string) => Promise<Task[]> = async (id: string) => {
  const taskList = await axios.get(`${BackendURL}/login`, {
    headers: {
      "Content-Type": "application/json",
      "id": id
    },
  })
    .then((res: AxiosResponse<Task[]>) => {
      return res.data
    });
  return taskList
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
