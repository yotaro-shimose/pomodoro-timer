// React
import { FC } from "react";
import { Button } from "@material-ui/core";

interface TimerButtonProps {
    func(): void;
    buttonName: string;
}

const TimerButton: FC<TimerButtonProps> = (props) => {
    return (
        <Button variant="contained" color="primary" onClick={props.func}>{props.buttonName}
        </Button>
    )
}
export default TimerButton;