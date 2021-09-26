interface Task {
    name: string,
};

interface Token {
    accessToken: string,
    refreshToken: string,
}

interface CalendarInfo {
    summary: string,
    id: string,
};

interface CalendarList {
    items: CalendarInfo[],
};


export type { Task, Token, CalendarList };