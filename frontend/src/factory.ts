import { pushEvent } from "./api";
import { Task } from "./interfaces";
import { getStringFromDate } from "./dateFormat";
export const confirmFinishFactory = (pause: () => void, handleOpen: () => void) => () => {
    handleOpen();
    pause();
}

export const timerFinishFactory = (id: string, task: Task, startTime: Date, onClose: () => void) => () => {
    const format = 'YYYY-MM-DD hh:mm:ss';
    onClose();
    pushEvent(id, { task: task, startTime: getStringFromDate(startTime, format), endTime: getStringFromDate(new Date(), format) })
}

export const cancelFinishFactory = (start: () => void, onClose: () => void) => () => {
    start();
    onClose();
}