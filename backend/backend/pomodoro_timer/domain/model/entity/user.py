from django.db import models

from pomodoro_timer.domain.model.entity.token import Token


class User(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    access_token = models.CharField(max_length=255)
    refresh_token = models.CharField(max_length=255)
    calendar_id = models.CharField(max_length=255)
    task_list_id = models.CharField(max_length=255)

    def set_token(self, token: Token):
        self.access_token = token.access_token
        self.refresh_token = token.refresh_token

    def set_user_data(self, user_dict: dict[str, str]):
        self.access_token = user_dict.get("accessToken", self.access_token)
        self.refresh_token = user_dict.get("refreshToken", self.refresh_token)
        self.calendar_id = user_dict.get("calendarId", self.calendar_id)
        self.task_list_id = user_dict.get("taskListId", self.task_list_id)
