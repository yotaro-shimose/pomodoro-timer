from django.urls import path

from . import views

urlpatterns = [
    path("task", views.get_task),
    path("user", views.collect_user),
    path("list_calendar", views.list_calendar),
    path("login", views.login),
    # path("schedule", views.schedule),
]
