from abc import ABC, abstractmethod
from pomodoro_timer.domain.model.entity.calendar import Calendar
from pomodoro_timer.domain.model.entity.event import Event
from pomodoro_timer.domain.model.entity.task_list import TaskList

from pomodoro_timer.domain.model.entity.token import Token
from pomodoro_timer.domain.model.entity.task import Task


class IGoogleRepository(ABC):
    @abstractmethod
    def get_gmail_address(self, token: Token) -> str:
        raise NotImplementedError

    @abstractmethod
    def get_task_list(self, id: str) -> list[TaskList]:
        raise NotImplementedError

    @abstractmethod
    def get_task(self, id: str) -> list[Task]:
        raise NotImplementedError

    @abstractmethod
    def get_calendar(self, id: str) -> list[Calendar]:
        raise NotImplementedError

    @abstractmethod
    def register_event(self, id: str, event: Event):
        raise NotImplementedError
