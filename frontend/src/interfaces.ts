export interface Task {
  id: string;
  name: string;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface Calendar {
  summary: string;
  id: string;
}

export interface TaskList {
  summary: string;
  id: string;
}

export interface Config {
  calendarId: string;
  taskListId: string;
}

export interface APIError {
  status: number;
  reason: string;
}

export interface UserProfile {
  id: string;
  taskListId: string;
  calendarId: string;
}

export interface Timer {
  task: Task;
  start: number;
  end: number;
}
