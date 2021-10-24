import { Task, TaskList, Calendar, UserProfile } from "./interfaces";
import axios, { AxiosResponse } from "axios";
import { BackendURL } from "./constants";
export const fetchTask: (id: string) => Promise<Task[]> = async (id: string) => {
  const taskList = await axios
    .get(`${BackendURL}/login`, {
      headers: {
        "Content-Type": "application/json",
        id: id,
      },
    })
    .then((res: AxiosResponse<Task[]>) => {
      return res.data;
    });
  return taskList;
};

export const fetchTaskList: (id: string) => Promise<TaskList[]> = async (id: string) => {
  const taskListList = await axios
    .get(`${BackendURL}/taskList`, {
      headers: {
        "Content-Type": "application/json",
        id: id,
      },
    })
    .then((res: AxiosResponse<TaskList[]>) => {
      return res.data;
    });
  return taskListList;
};

export const fetchCalendar: (id: string) => Promise<Calendar[]> = async (id: string) => {
  const calendarList = await axios
    .get(`${BackendURL}/calendar`, {
      headers: {
        "Content-Type": "application/json",
        id: id,
      },
    })
    .then((res: AxiosResponse<Calendar[]>) => {
      return res.data;
    });
  return calendarList;
};

export const login: (code: string) => Promise<UserProfile> = async (code: string) => {
  const profile = await axios.post<UserProfile>(
    `${BackendURL}/login`,
    {
      authorizationCode: code,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return profile.data;
};

export const fetchUserProfile: (id: string) => Promise<UserProfile> = async (id: string) => {
  return {
    id: "myUserId",
    taskListId: "id1",
    calendarId: "cid2",
  };
};
