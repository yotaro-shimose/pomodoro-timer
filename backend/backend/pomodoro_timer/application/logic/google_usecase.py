import inject
from pomodoro_timer.domain.factory import Factory
from pomodoro_timer.domain.model.entity.calendar import Calendar
from pomodoro_timer.domain.model.entity.task import Task
from pomodoro_timer.domain.model.entity.task_list import TaskList
from pomodoro_timer.domain.repository import (
    IGoogleRepository,
    ITokenRepository,
    IUserRepository,
)


class GoogleUsecase:
    @inject.params(token_repository=ITokenRepository)
    @inject.params(google_repository=IGoogleRepository)
    @inject.params(user_repository=IUserRepository)
    def __init__(
        self,
        token_repository: ITokenRepository,
        google_repository: IGoogleRepository,
        user_repository: IUserRepository,
    ):
        self._token_repository = token_repository
        self._google_repository = google_repository
        self._user_repository = user_repository

    def get_task_list(self, id: str) -> list[TaskList]:
        return self._google_repository.get_task_list(id)

    def get_task(self, id: str) -> list[Task]:
        return self._google_repository.get_task(id)

    def get_calendar(self, id: str) -> list[Calendar]:
        return self._google_repository.get_calendar(id)

    def register_event(self, id: str, event_dict: dict):
        event = Factory().create_event(event_dict)
        self._google_repository.register_event(id, event)
