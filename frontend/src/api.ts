import { Task, TaskList, Calendar, UserConfig, Event } from "./interfaces";
import axios, { AxiosResponse } from "axios";
import { BackendURL } from "./constants";

interface LoginResponse {
  id: string;
}

interface Headers {
  "Content-Type": string;
  id: string;
}

const get_headers: (id: string) => Headers = (id: string) => {
  return {
    "Content-Type": "application/json",
    id: id,
  };
};

export const fetchTask: (id: string) => Promise<Task[]> = async (id: string) => {
  const taskList = await axios
    .get(`${BackendURL}/task`, {
      headers: get_headers(id),
    })
    .then((res: AxiosResponse<Task[]>) => {
      return res.data;
    });
  return taskList;
};

export const fetchTaskList: (id: string) => Promise<TaskList[]> = async (id: string) => {
  const taskListList = await axios
    .get(`${BackendURL}/taskList`, {
      headers: get_headers(id),
    })
    .then((res: AxiosResponse<TaskList[]>) => {
      return res.data;
    });
  return taskListList;
};

export const fetchCalendar: (id: string) => Promise<Calendar[]> = async (id: string) => {
  const calendarList = await axios
    .get(`${BackendURL}/calendar`, {
      headers: get_headers(id),
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
    .post<LoginResponse>(
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
    .then((res: AxiosResponse<LoginResponse>) => {
      return res.data.id;
    });
  return userId;
};

export const fetchUserConfig: (id: string) => Promise<UserConfig> = async (id: string) => {
  const calendarList = await axios
    .get(`${BackendURL}/userConfig`, {
      headers: get_headers(id),
    })
    .then((res: AxiosResponse<UserConfig>) => {
      return res.data;
    });
  return calendarList;
};
