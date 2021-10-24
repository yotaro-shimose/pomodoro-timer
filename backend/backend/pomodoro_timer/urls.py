from django.urls import path

from . import views

urlpatterns = [
    path("task", views.get_task),
    path("user", views.collect_user),
    path("calendar", views.get_calendar),
    path("login", views.login),
    path("taskList", views.get_task_list)
    # path("schedule", views.schedule),
]
