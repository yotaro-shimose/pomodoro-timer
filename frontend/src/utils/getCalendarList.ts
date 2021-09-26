import { BackendURL } from "./constants";
import axios, { AxiosResponse } from "axios";
import { CalendarList } from "../interfaces/interfaces";
import { useRecoilValue } from 'recoil';
import { tokenState } from "../atoms";
const getCalendarList = async () => {
    const token = useRecoilValue(tokenState);
    if (token != null) {
        const calendarList = await axios
            .post(`${BackendURL}/list_calendar`,
                {
                    accessToken: token.accessToken,
                    refreshToken: token.refreshToken,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        accessToken: token.accessToken,
                        refreshToken: token.refreshToken,
                    }
                })
            .then((res: AxiosResponse<CalendarList>) => {
                return res.data;
            });
        return calendarList;
    } else {
        throw 'Must be logged in before getting calendar list';
    }
}

export { getCalendarList };