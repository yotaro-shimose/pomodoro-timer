from django.db import models

# Create your models here.
class Task:
    name = models.CharField(max_length=32)

