from pomodoro_timer.presentation.controller.controller import Controller

from django.http import HttpResponse, HttpRequest
from pomodoro_timer.presentation.helper import get_id, get_body, create_response


class UserController(Controller):
    def do_get(self, request: HttpRequest) -> HttpResponse:
        id = get_id(request)
        user = self._user_usecase.get_user_by_id(id)
        response = {"id": user.id}
        return create_response(response)

    def do_put(self, request: HttpRequest) -> HttpResponse:
        id = get_id(request)
        body = get_body(request)
        user = self._user_usecase.update_user(id, body)
        response = {"id": user.id}
        return create_response(response)
