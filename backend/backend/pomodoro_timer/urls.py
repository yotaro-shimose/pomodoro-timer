from django.urls import path

from . import views

urlpatterns = [
    path("task", views.get_task),
    # path("schedule", views.schedule),
]
