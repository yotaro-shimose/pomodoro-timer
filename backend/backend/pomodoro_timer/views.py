import json
from django.http import HttpResponse
from django.http.request import HttpRequest
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import datetime
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import Flow
from pathlib import Path
import os

CLIENT_SECRET_PATH = Path(".").joinpath(".google_auth", "client_secret.json")
CLIENT_ID = "812434553636-nk0sd63psg9h3mjrqorf1jkvugglf7d8.apps.googleusercontent.com"
CLIENT_SECRET = "x6BHVdY60JkAt_1vyeeqPjpI"
REDIRECT_URI = "postmessage"
SCOPES = (
    [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/tasks",
    ],
)
os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "1"


def parse_body(body: bytes) -> dict[str, str]:
    return json.loads(body.decode("utf-8"))


def get_task(request: HttpRequest) -> HttpResponse:
    access_token = request.META["access_token"]
    # access_token = "ya29.a0ARrdaM8mfGsHFVX4neeo4DDPrJH5Xf4YtGw-dedYcFiuviU7O28QWDoKf6_m9HM0M-XutkeKRkLMNfvB5O0XA8KJ0YzNiNJELyNAvznie5MSGKj7l__WZ2WeNeK4FPJ3Fe4P9hYemCE2_QhRVQe4-c7nG4AB"
    refresh_token = request.META["refresh_token"]
    # refresh_token = "1//0e-ZbTmOOtRJ7CgYIARAAGA4SNwF-L9IrqMqXDU0T3nNKjJ8uJX5cBnAgeiEt4ioU9Lrdt1wMynFCzoTQBbkRiy3H3DQv7z9ul2Y"
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


def fetch_token(request: HttpRequest) -> HttpResponse:
    body = parse_body(request.body)
    code = body["authorizationCode"]
    flow: Flow = Flow.from_client_secrets_file(
        str(CLIENT_SECRET_PATH), scopes=SCOPES, redirect_uri=REDIRECT_URI,
    )
    token_response = flow.fetch_token(code=code)
    response = {
        "accessToken": token_response["access_token"],
        "refreshToken": token_response["refresh_token"],
    }
    return HttpResponse(json.dumps(response))


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
