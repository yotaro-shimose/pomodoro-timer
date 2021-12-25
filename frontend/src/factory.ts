export const confirmFinishFactory = (pause: () => void, handleOpen: () => void) => () => {
    handleOpen();
    pause();
}

export const timerFinishFactory = (startTime: Date | null) => () => {
    console.log(startTime);
    console.log(new Date());
}