from __future__ import annotations

from django.db import models
from pomodoro_timer.domain.model.entity.user import User


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
            user.access_token,
            user.refresh_token,
            user.calendar_id,
            user.task_list_id,
        )

    def to_entity(self) -> User:
        return User(
            id=self.id,
            access_token=self.access_token,
            refresh_token=self.refresh_token,
            calendar_id=self.calendar_id,
            task_list_id=self.task_list_id,
        )
