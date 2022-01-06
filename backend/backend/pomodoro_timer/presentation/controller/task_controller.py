from django.http import HttpResponse, HttpRequest
from pomodoro_timer.presentation.controller.controller import Controller
from pomodoro_timer.presentation.helper import get_id, create_response


class TaskController(Controller):
    def do_get(self, request: HttpRequest) -> HttpResponse:
        id = get_id(request)
        task_list = self._google_usecase.get_task(id)
        response = [task.__dict__ for task in task_list]
        return create_response(response)
