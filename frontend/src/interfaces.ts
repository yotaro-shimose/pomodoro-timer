export interface Task {
    name: string,
};

export interface Token {
    accessToken: string,
    refreshToken: string,
}

export interface Calendar {
    summary: string,
    id: string,
};

export interface TaskList {
    summary: string,
    id: string,
}

export interface Config {
    calendarId: string,
    taskListId: string,
}