from pomodoro_timer.presentation.controller.controller import Controller
from django.http import HttpResponse, HttpRequest, response
from pomodoro_timer.presentation.helper import get_id, create_response


class TaskListController(Controller):
    def do_get(self, request: HttpRequest) -> HttpResponse:
        id = get_id(request)

        task_list_list = self._google_usecase.get_task_list(id)
        response = [task_list.__dict__ for task_list in task_list_list]
        return create_response(response)
