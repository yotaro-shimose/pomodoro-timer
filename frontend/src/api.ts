import { Task, TaskList, Calendar, UserConfig, Event } from "./interfaces";
import axios, { AxiosResponse } from "axios";
import { BackendURL } from "./constants";
export const fetchTask: (id: string) => Promise<Task[]> = async (id: string) => {
  const taskList = await axios
    .get(`${BackendURL}/task`, {
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

export const pushEvent: (id: string, event: Event) => void = async (id: string, event: Event) => {
  await axios
    .post(`${BackendURL}/event`,
      event
      , {
        headers: {
          "Content-Type": "application/json",
          id: id,
        },
      });
}


export const login: (code: string) => Promise<string> = async (code: string) => {
  const userId = await axios
    .post<string>(
      `${BackendURL}/login`,
      {
        authorizationCode: code,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res: AxiosResponse<string>) => {
      return res.data;
    });
  return userId;
};

export const fetchUserConfig: (id: string) => Promise<UserConfig> = async (id: string) => {
  return {
    taskListId: "id1",
    calendarId: "cid2",
  };
};
