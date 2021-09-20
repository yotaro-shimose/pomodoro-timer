interface GlobalState {
    isLoggedIn: boolean,
}

interface Task {
    name: string,
};

interface Token {
    accessToken: string,
    refreshToken: string,
}


export type { Task, Token, GlobalState };