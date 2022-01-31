from dataclasses import dataclass

from pomodoro_timer.domain.model.entity.token import Token


@dataclass
class User:
    id: str
    access_token: str
    refresh_token: str
    calendar_id: str
    task_list_id: str

    def set_token(self, token: Token):
        self.access_token = token.access_token
        self.refresh_token = token.refresh_token

    def set_user_data(self, user_dict: dict[str, str]):
        self.access_token = user_dict.get("accessToken", self.access_token)
        self.refresh_token = user_dict.get("refreshToken", self.refresh_token)
        self.calendar_id = user_dict.get("calendarId", self.calendar_id)
        self.task_list_id = user_dict.get("taskListId", self.task_list_id)
