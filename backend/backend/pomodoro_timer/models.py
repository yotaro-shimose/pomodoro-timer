from typing import Dict
from django.db import models

# Create your models here.
class User(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    access_token = models.CharField(max_length=255)
    refresh_token = models.CharField(max_length=255)
    calender_id = models.CharField(max_length=255)
    task_list_id = models.CharField(max_length=255)

    def get_response(self) -> Dict[str, str]:
        return {
            "id": self.id,
            "calender_id": self.calender_id,
            "task_list_id": self.task_list_id,
        }
