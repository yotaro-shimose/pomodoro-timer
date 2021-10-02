import { FC } from 'react';
import { CalendarList } from "../interfaces/interfaces";


interface CalendarSelectionProps {
    calendarList: CalendarList,
};


const CalendarSelection: FC<CalendarSelectionProps> = (props: CalendarSelectionProps) => {
    return (
        <div className="CalendarSelection">
            {props.calendarList.items.map((item, key) => {
                <p key={key}>{item.summary}</p>
            })}
        </div>
    );
}

export default CalendarSelection;