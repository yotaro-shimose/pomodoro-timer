from django.urls import path

from pomodoro_timer.domain.repository.iuser_repository import IUserRepository

from pomodoro_timer.presentation.controller import (
    LoginController,
    CalendarController,
    EventController,
    TaskController,
    TaskListController,
    UserController,
    UserConfigController,
)

from pomodoro_timer.domain.repository import (
    ITokenRepository,
    IGoogleRepository,
    IUserRepository,
)
from pomodoro_timer.infrastructure.repository import (
    TokenRepository,
    GoogleRepository,
    UserRepository,
)

from inject import Binder
import inject


def inject_config(binder: Binder):
    binder.bind(IUserRepository, UserRepository())
    binder.bind(ITokenRepository, TokenRepository())
    binder.bind(IGoogleRepository, GoogleRepository(UserRepository()))


inject.configure(inject_config)


urlpatterns = [
    path("task", TaskController()),
    path("user", UserController()),
    path("calendar", CalendarController()),
    path("login", LoginController()),
    path("taskList", TaskListController()),
    path("userConfig", UserConfigController()),
    path("event", EventController()),
]
