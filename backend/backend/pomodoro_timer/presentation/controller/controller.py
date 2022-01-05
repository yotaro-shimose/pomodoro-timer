from abc import ABC

from django.http import HttpResponse
from django.http.request import HttpRequest
from pomodoro_timer.application.logic.google_usecase import GoogleUsecase
from pomodoro_timer.application.logic.user_usecase import UserUsecase


class Controller(ABC):
    def __init__(self):
        self._user_usecase = UserUsecase()
        self._google_usecase = GoogleUsecase()

    def do_get(self, request: HttpRequest) -> HttpResponse:
        raise NotImplementedError

    def do_post(self, request: HttpRequest) -> HttpResponse:
        raise NotImplementedError

    def do_put(self, request: HttpRequest) -> HttpResponse:
        raise NotImplementedError

    def __call__(self, request: HttpRequest) -> HttpResponse:
        http_method = request.method
        if http_method == "GET":
            return self.do_get(request)
        elif http_method == "POST":
            return self.do_post(request)
        elif http_method == "PUT":
            return self.do_put(request)
        else:
            raise ValueError
