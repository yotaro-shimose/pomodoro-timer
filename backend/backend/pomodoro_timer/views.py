import json
import re
from django.http import HttpResponse
from django.http.request import HttpRequest
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import Flow
from pathlib import Path
import os
from pomodoro_timer.models import User
import hashlib

CLIENT_SECRET_PATH = Path(".").joinpath(".google_auth", "client_secret.json")
CLIENT_ID = "812434553636-nk0sd63psg9h3mjrqorf1jkvugglf7d8.apps.googleusercontent.com"
CLIENT_SECRET = "x6BHVdY60JkAt_1vyeeqPjpI"
REDIRECT_URI = "postmessage"
SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/tasks",
]
os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "1"


def parse_body(body: bytes) -> dict[str, str]:
    return json.loads(body.decode("utf-8"))


def get_task(request: HttpRequest) -> HttpResponse:
    access_token = request.META["access_token"]
    refresh_token = request.META["refresh_token"]
    credentials = Credentials(
        token=access_token,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        scopes=SCOPES,
    )
    if not credentials.valid:
        credentials.refresh(Request())

    service = build("tasks", "v1", credentials=credentials)
    results = service.tasklists().list().execute()
    items = results.get("items", [])
    task_list = [{"id": item["id"], "name": item["title"]} for item in items]
    return HttpResponse(json.dumps(task_list, ensure_ascii=False))


def list_calendar(request: HttpRequest) -> HttpResponse:
    body = parse_body(request.body)
    access_token = body["accessToken"]
    refresh_token = body["refreshToken"]
    credentials = Credentials(
        access_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        scopes=SCOPES,
        refresh_token=refresh_token,
    )
    if not credentials.valid:
        credentials.refresh(Request())
    service = build("calendar", "v3", credentials=credentials)
    google_response = service.calendarList().list(showHidden=True,).execute()
    calendar_list = google_response["items"]
    response = {
        "items": [
            {"summary": item["summary"], "id": item["id"]} for item in calendar_list
        ]
    }
    return HttpResponse(json.dumps(response))


def _create_hash_data(gmail_address: str) -> str:
    return hashlib.sha256(gmail_address.encode("utf-8")).hexdigest()


def _register_user(request: HttpRequest) -> HttpResponse:
    # body = parse_body(request.body)
    # code = body["authorizationCode"]
    code = "4/0AX4XfWhq8Nwzgb8o2akmRmtQKYrcXKP4zwiruFs8o0rbzFU3GnTm1Ov8Cs3pci56QA-VVw"
    flow: Flow = Flow.from_client_secrets_file(
        str(CLIENT_SECRET_PATH), scopes=SCOPES, redirect_uri=REDIRECT_URI,
    )
    token_response = flow.fetch_token(code=code)
    response = {
        "accessToken": token_response["access_token"],
        "refreshToken": token_response["refresh_token"],
    }
    credentials = Credentials(
        token=token_response["access_token"],
        refresh_token=token_response["refresh_token"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        scopes=SCOPES,
    )
    service = build("people", "v1", credentials=credentials)
    gmail_address = (
        service.people()
        .get(resourceName="people/me", personFields="emailAddresses")
        .execute()
    ).get("emailAddresses")[0]["value"]
    id = _create_hash_data(gmail_address)
    user = User(
        id=id,
        access_token=token_response["access_token"],
        refresh_token=token_response["refresh_token"],
    )
    User.save(user)
    # TODO レスポンス作成

def _update_user(request: HttpRequest) -> HttpResponse:
    raise NotImplementedError()


def collect_user(request: HttpRequest) -> HttpResponse:
    http_method = request["method"]
    if http_method == "POST":
        return _register_user(request)
    elif http_method == "PUT":
        return _update_user(request)
    else:
        return


def get_user(request: HttpRequest, id: str) -> HttpResponse:
    user = User.objects.get(id=id)
    return HttpResponse(json.dumps(user))


def get_task_list(request: HttpRequest) -> HttpResponse:
    raise NotImplementedError()


def get_task(request: HttpRequest) -> HttpResponse:
    raise NotImplementedError()


def get_calender(request: HttpRequest) -> HttpResponse:
    raise NotImplementedError()
