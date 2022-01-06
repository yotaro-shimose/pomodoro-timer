import json

from django.http import HttpRequest
from django.http.response import HttpResponse
from typing import Union


def get_body(request: HttpRequest) -> dict[str, str]:
    return json.loads(request.body.decode("utf-8"))


def get_id(request: HttpRequest) -> str:
    return request.headers["id"]


def create_response(
    response: Union[dict[str, str], list[dict[str, str]]]
) -> HttpResponse:
    return HttpResponse(json.dumps(response, ensure_ascii=False))

