from django.urls import path

from . import views

urlpatterns = [
    path("task", views.get_task),
    path("fetch_token", views.fetch_token)
    # path("schedule", views.schedule),
]
