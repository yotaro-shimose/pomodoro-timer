from __future__ import annotations

from django.db import models
from pomodoro_timer.domain.model.entity.user import User
from pomodoro_timer.domain.model.entity.token import Token


class UserDjangoModel(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    access_token = models.CharField(max_length=255)
    refresh_token = models.CharField(max_length=255)
    calendar_id = models.CharField(max_length=255)
    task_list_id = models.CharField(max_length=255)

    @classmethod
    def from_entity(cls, user: User) -> UserDjangoModel:
        return cls(
            user.id,
            user.token.access_token,
            user.token.refresh_token,
            user.calendar_id,
            user.task_list_id,
        )

    def to_entity(self) -> User:
        token = Token(self.access_token, self.refresh_token)
        return User(
            id=self.id,
            token=token,
            calendar_id=self.calendar_id,
            task_list_id=self.task_list_id,
        )
