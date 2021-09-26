import { atom, selector } from 'recoil';
import { CalendarList } from "./interfaces/interfaces";
import { Token } from './interfaces/interfaces';
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();


const tokenState = atom<Token | null>({
    key: 'token',
    default: null,
    effects_UNSTABLE: [persistAtom],
})


const isLoggedInState = selector<boolean>({
    key: 'isLoggedIn',
    get: ({ get }) => {
        if (get(tokenState)) {
            return true;
        } else {
            return false;
        }
    },
});

const calendarIdState = atom<string | null>({
    key: 'calendarId',
    default: null
});

const calendarListQuery = selector<CalendarList | null>({
    key: 'calendarIdQuery',
    get: async ({ get }) => {
        if (!get(isLoggedInState)) {
            return null;
        }
        const calendarId = get(calendarIdState);
        if (calendarId) {
            // TODO
            throw 'Not Implemented Error';
        } else {
            return null;
        }
    }
})

export { tokenState, isLoggedInState, calendarIdState };