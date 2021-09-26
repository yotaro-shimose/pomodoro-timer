from django.urls import path

from . import views

urlpatterns = [
    path("task", views.get_task),
    path("fetch_token", views.fetch_token),
    path("list_calendar", views.list_calendar)
    # path("schedule", views.schedule),
]
