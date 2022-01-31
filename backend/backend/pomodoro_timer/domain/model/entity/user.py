from dataclasses import dataclass
from typing import Optional

from pomodoro_timer.domain.model.entity.token import Token


@dataclass
class User:
    id: str
    token: Token
    calendar_id: Optional[str] = None
    task_list_id: Optional[str] = None

    def set_token(self, token: Token):
        self.token = token

    def set_user_data(self, user_dict: dict[str, str]):
        access_token = user_dict.get("accessToken", self.token.access_token)
        refresh_token = user_dict.get("refreshToken", self.token.refresh_token)
        self.token = Token(access_token, refresh_token)
        self.calendar_id = user_dict.get("calendarId", self.calendar_id)
        self.task_list_id = user_dict.get("taskListId", self.task_list_id)
