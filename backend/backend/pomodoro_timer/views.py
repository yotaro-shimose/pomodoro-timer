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
        scopes=["https://www.googleapis.com/auth/calendar"],
    )
    credentials.refresh(Request())

    now = datetime.datetime.utcnow().isoformat() + "Z"
    service = build("calendar", "v3", credentials=credentials)
    res = (
        service.events()
        .list(
            calendarId="primary",
            timeMin=now,
            maxResults=10,
            singleEvents=True,
            orderBy="startTime",
        )
        .execute()
    )
    return HttpResponse("success!")


def fetch_token(request: HttpRequest) -> HttpResponse:
    body = parse_body(request.body)
    code = body["authorizationCode"]
    flow: Flow = Flow.from_client_secrets_file(
        str(CLIENT_SECRET_PATH),
        scopes=["https://www.googleapis.com/auth/calendar"],
        redirect_uri=REDIRECT_URI,
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
        scopes=["https://www.googleapis.com/auth/calendar"],
        refresh_token=refresh_token,
    )
    if not credentials.valid:
        credentials.refresh(Request())
    service = build("calendar", "v3", credentials=credentials)
    google_response = (
        service.calendarList()
        .list(
            showHidden=True,
        )
        .execute()
    )
    calendar_list = google_response["items"]
    response = {
        "items": {"summary": item["summary"], "id": item["id"]}
        for item in calendar_list
    }
    return HttpResponse(json.dumps(response))
