import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";
import { Task, Timer, UserProfile } from "./interfaces";

const { persistAtom } = recoilPersist();

export const userProfileState = atom<UserProfile>({
  key: "userId",
  default: { "id": "", "calendarId": "", "taskListId": "" },
  effects_UNSTABLE: [persistAtom],
});

export const isLoggedInState = selector<boolean>({
  key: "isLoggedIn",
  get: ({ get }) => {
    if (get(userProfileState).id) {
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
