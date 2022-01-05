from django.http import HttpResponse, HttpRequest
from pomodoro_timer.presentation.controller.controller import Controller
from pomodoro_timer.presentation.helper import get_body, create_response


class LoginController(Controller):
    def do_post(self, request: HttpRequest) -> HttpResponse:
        body = get_body(request)
        code = body["authorizationCode"]

        user = self._user_usecase.login(code)
        response = {"id": user.id}
        return create_response(response)
