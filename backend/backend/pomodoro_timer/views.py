import json
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
from datetime import datetime

CLIENT_SECRET_PATH = Path(".").joinpath(".google_auth", "client_secret.json")
CLIENT_ID = "812434553636-fgbcvbb4utqo944hef5lrhnmbe93rkia.apps.googleusercontent.com"
CLIENT_SECRET = "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"
REDIRECT_URI = "postmessage"
SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/tasks",
]
os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "1"

def get_credentials(user: User) -> Credentials:
    credentials = Credentials(
        token=user.access_token,
        refresh_token=user.refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        scopes=SCOPES,
    )
    if not credentials.valid:
        credentials.refresh(Request())
        access_token = credentials.token
        refresh_token = credentials.refresh_token
        user.access_token = access_token
        user.refresh_token = refresh_token
    return credentials

def parse_body(body: bytes) -> dict[str, str]:
    return json.loads(body.decode("utf-8"))


def _create_hash_data(gmail_address: str) -> str:
    return hashlib.sha256(gmail_address.encode("utf-8")).hexdigest()


def login(request: HttpRequest) -> HttpResponse:
    body = parse_body(request.body)
    code = body["authorizationCode"]
    flow: Flow = Flow.from_client_secrets_file(
        str(CLIENT_SECRET_PATH), scopes=SCOPES, redirect_uri=REDIRECT_URI,
    )
    token_response = flow.fetch_token(code=code)

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

    exists_user = User.objects.filter(id=id).count() == 1
    if exists_user:
        user: User = User.objects.get(id=id)
        user.access_token = token_response["access_token"]
        user.refresh_token = token_response["refresh_token"]
    else:
        user = User(
            id=id,
            access_token=token_response["access_token"],
            refresh_token=token_response["refresh_token"],
        )
    User.save(user)
    response = {"id": user.id}
    return HttpResponse(json.dumps(response, ensure_ascii=False))


def _get_user(request: HttpRequest) -> HttpResponse:
    id = request.headers["id"]
    user: User = User.objects.get(id=id)
    response = {"id": user.id}
    return HttpResponse(json.dumps(response, ensure_ascii=False))


def _update_user(request: HttpRequest) -> HttpResponse:
    id = request.headers["id"]
    body = parse_body(request.body)
    user: User = User.objects.select_for_update().filter(id=id).first()
    user.access_token = body.get("accessToken", user.access_token)
    user.refresh_token = body.get("refreshToken", user.refresh_token)
    user.calendar_id = body.get("calendarId", user.calendar_id)
    user.task_list_id = body.get("taskListId", user.task_list_id)
    User.save(user)
    response = {"id": user.id}
    return HttpResponse(json.dumps(response, ensure_ascii=False))


def collect_user(request: HttpRequest) -> HttpResponse:
    http_method = request.method
    if http_method == "GET":
        return _get_user(request)
    elif http_method == "PUT":
        return _update_user(request)
    else:
        return



def get_task_list(request: HttpRequest) -> HttpResponse:
    id = request.headers["id"]
    user: User = User.objects.get(id=id)
    credentials = get_credentials(user)

    service = build("tasks", "v1", credentials=credentials)
    items = service.tasklists().list().execute().get("items")
    response_list = [
        {"id": item.get("id"), "summary": item.get("title")} for item in items
    ]

    return HttpResponse(json.dumps(response_list, ensure_ascii=False))


def get_task(request: HttpRequest) -> HttpResponse:
    id = request.headers["id"]
    user: User = User.objects.get(id=id)
    credentials = get_credentials(user)

    task_list_id = user.task_list_id
    service = build("tasks", "v1", credentials=credentials)
    items = (
        service.tasks()
        .list(tasklist=task_list_id, showCompleted=False)
        .execute()
        .get("items")
    )
    response_list = [
        {"id": item.get("id"), "name": item.get("title")} for item in items
    ]

    return HttpResponse(json.dumps(response_list, ensure_ascii=False))


def get_calendar(request: HttpRequest) -> HttpResponse:
    id = request.headers["id"]
    user: User = User.objects.get(id=id)
    credentials = get_credentials(user)
    service = build("calendar", "v3", credentials=credentials)
    google_response = service.calendarList().list(showHidden=True).execute()
    calendar_list = google_response["items"]
    response = [
        {"summary": item["summary"], "id": item["id"]} for item in calendar_list
    ]
    return HttpResponse(json.dumps(response, ensure_ascii=False))


def get_user_config(request: HttpRequest) -> HttpResponse:
    id = request.headers["id"]
    user: User = User.objects.get(id=id)
    response = {
        "taskListId": user.task_list_id,
        "calendarId": user.calendar_id,
    }
    return HttpResponse(json.dumps(response, ensure_ascii=False))


def insert_event(request: HttpRequest) -> HttpResponse:
    id = request.headers["id"]
    body = parse_body(request.body)
    user: User = User.objects.get(id=id)
    credentials = get_credentials(user)
    service = build("calendar", "v3", credentials=credentials)
    google_request = {
        "calendarId": user.calendar_id,
        "body": {
            "start": {
                "dateTime": datetime.strptime(
                    body["startTime"], r"%Y-%m-%d %H:%M:%S"
                ).isoformat(),
                "timeZone": "Asia/Tokyo",
            },
            "end": {
                "dateTime": datetime.strptime(
                    body["endTime"], r"%Y-%m-%d %H:%M:%S"
                ).isoformat(),
                "timeZone": "Asia/Tokyo",
            },
            "summary": body["task"]["name"],
        },
    }
    try:
        _google_response = service.events().insert(**google_request).execute()
    except Exception as e:
        print(e)
    return HttpResponse("Ok")
