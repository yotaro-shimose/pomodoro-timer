from django.http import HttpResponse, HttpRequest
from pomodoro_timer.presentation.controller.controller import Controller
from pomodoro_timer.presentation.helper import get_id, create_response


class CalendarController(Controller):
    def do_get(self, request: HttpRequest) -> HttpResponse:
        id = get_id(request)
        calendar_list = self._google_usecase.get_calendar(id)
        response = [calendar.__dict__ for calendar in calendar_list]
        return create_response(response)
