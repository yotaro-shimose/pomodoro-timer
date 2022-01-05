from django.http import HttpResponse, HttpRequest
from pomodoro_timer.presentation.controller.controller import Controller
from pomodoro_timer.presentation.helper import get_id, create_response


class UserConfigController(Controller):
    def do_get(self, request: HttpRequest) -> HttpResponse:
        id = get_id(request)
        user = self._user_usecase.get_user_by_id(id)
        response = {
            "taskListId": user.task_list_id,
            "calendarId": user.calendar_id,
        }
        return create_response(response)

