interface GlobalState {
    isLoggedIn: boolean,
    calendarId?: string,
}

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


export type { Task, Token, GlobalState, CalendarList };