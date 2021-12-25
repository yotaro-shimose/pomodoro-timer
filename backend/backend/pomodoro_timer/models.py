from typing import Dict
from django.db import models

# Create your models here.
class User(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    access_token = models.CharField(max_length=255)
    refresh_token = models.CharField(max_length=255)
    calendar_id = models.CharField(max_length=255)
    task_list_id = models.CharField(max_length=255)

