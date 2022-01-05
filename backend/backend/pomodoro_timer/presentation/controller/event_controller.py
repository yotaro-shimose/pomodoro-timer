from django.http import HttpResponse, HttpRequest
from pomodoro_timer.presentation.controller.controller import Controller
from pomodoro_timer.presentation.helper import get_id, get_body, create_response


class EventController(Controller):
    def do_post(self, request: HttpRequest) -> HttpResponse:
        id = get_id(request)
        body = get_body(request)
        self._google_usecase.register_event(id, body)
        response = {"msg": "OK"}
        return create_response(response)
