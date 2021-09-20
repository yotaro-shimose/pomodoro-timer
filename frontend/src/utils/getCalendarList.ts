import { getToken } from "./token";
import { BackendURL } from "./constants";
import axios, { AxiosResponse } from "axios";
import { CalendarList } from "../interfaces/interfaces";

const getCalendarList = async () => {
    const token = getToken();
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
}

export { getCalendarList };