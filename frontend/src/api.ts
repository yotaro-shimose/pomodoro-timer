import { Task, TaskList, Calendar, UserConfig, Event } from "./interfaces";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import https from "https";
interface LoginResponse {
  id: string;
}

const BackendURL = "http://localhost:8000";
// const BackendURL = "https://54.238.9.74:8000";

const get_config: (id?: string) => AxiosRequestConfig = (id?: string) => {
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  let headers = {
    "Content-Type": "application/json",
    id: "",
  };
  if (id) {
    headers = {
      "Content-Type": "application/json",
      id: id,
    };
  }
  return {
    headers: headers,
    httpsAgent: agent,
  };
};

export const fetchTask: (id: string) => Promise<Task[]> = async (id: string) => {
  const taskList = await axios
    .get(`${BackendURL}/task`, get_config(id))
    .then((res: AxiosResponse<Task[]>) => {
      return res.data;
    });
  return taskList;
};

export const fetchTaskList: (id: string) => Promise<TaskList[]> = async (id: string) => {
  const taskListList = await axios
    .get(`${BackendURL}/taskList`, get_config(id))
    .then((res: AxiosResponse<TaskList[]>) => {
      return res.data;
    });
  return taskListList;
};

export const fetchCalendar: (id: string) => Promise<Calendar[]> = async (id: string) => {
  const calendarList = await axios
    .get(`${BackendURL}/calendar`, get_config(id))
    .then((res: AxiosResponse<Calendar[]>) => {
      return res.data;
    });
  return calendarList;
};

export const pushEvent: (id: string, event: Event) => void = async (id: string, event: Event) => {
  await axios.post(`${BackendURL}/event`, event, get_config(id));
};

export const login: (code: string) => Promise<string> = async (code: string) => {
  const userId = await axios
    .post<LoginResponse>(
      `${BackendURL}/login`,
      {
        authorizationCode: code,
      },
      get_config()
    )
    .then((res: AxiosResponse<LoginResponse>) => {
      return res.data.id;
    });
  return userId;
};

export const fetchUserConfig: (id: string) => Promise<UserConfig> = async (id: string) => {
  const calendarList = await axios
    .get(`${BackendURL}/userConfig`, get_config(id))
    .then((res: AxiosResponse<UserConfig>) => {
      return res.data;
    });
  return calendarList;
};