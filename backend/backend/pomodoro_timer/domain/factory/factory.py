from typing import Optional
from pomodoro_timer.domain.model.entity.calendar import Calendar
from pomodoro_timer.domain.model.entity.task import Task
from pomodoro_timer.domain.model.entity.token import Token
from pomodoro_timer.domain.model.entity.user import User
from pomodoro_timer.domain.model.entity.event import Event
from pomodoro_timer.domain.model.entity.task_list import TaskList


class Factory:
    def create_user(self, id: str, token: Optional[Token] = None) -> User:
        if token:
            return User(
                id=id,
                access_token=token.access_token,
                refresh_token=token.refresh_token,
            )
        else:
            return User(id)

    def create_task_list(self, items: list[dict[str, str]]) -> list[TaskList]:
        return [TaskList(item.get("id"), item.get("title")) for item in items]

    def create_task(self, items: list[dict[str, str]]) -> list[Task]:
        return [Task(item.get("id"), item.get("title")) for item in items]

    def create_calendar(self, items: list[dict[str, str]]) -> list[Calendar]:
        return [Calendar(item.get("id"), item.get("summary")) for item in items]

    def create_event(self, event_dict: dict) -> Event:
        task = Task(event_dict["task"]["id"], event_dict["task"]["name"])
        return Event(event_dict["startTime"], event_dict["endTime"], task)

