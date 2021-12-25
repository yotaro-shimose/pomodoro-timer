import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";
import { Task, Timer, UserConfig } from "./interfaces";

const { persistAtom } = recoilPersist();

export const userIdState = atom<string>({
  key: "userId",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const taskListState = atom<Task[]>({
  key: "task",
  default: [],
});

export const isLoggedInState = selector<boolean>({
  key: "isLoggedIn",
  get: ({ get }) => {
    if (get(userIdState)) {
      return true;
    } else {
      return false;
    }
  },
});

export const userConfigState = atom<UserConfig>({
  key: "userConfig",
  default: { calendarId: "", taskListId: "" },
});

export const isConfiguredState = selector<boolean>({
  key: "isConfigured",
  get: ({ get }) => {
    const userProfile = get(userConfigState);
    if (userProfile.calendarId !== "" && userProfile.taskListId !== "") {
      return true;
    } else {
      return false;
    }
  },
});

export const selectedTask = atom<Task | null>({
  key: "selectedTask",
  default: null,
});

export const timerState = atom<Timer | null>({
  key: "timer",
  default: null,
});
