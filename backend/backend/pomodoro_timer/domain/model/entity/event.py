from dataclasses import dataclass

from pomodoro_timer.domain.model.entity.task import Task


@dataclass
class Event:
    start_time: str
    end_time: str
    task: Task

