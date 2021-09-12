import json
from django.http import HttpResponse
from django.http.request import HttpRequest
from google.oauth2.credentials import Credentials

from googleapiclient.discovery import build
import datetime


from google.auth.transport.requests import Request


def get_task(request: HttpRequest):
    access_token = request.GET["access_token"]
    refresh_token = request.GET["refresh_token"]
    credentials = Credentials(
        access_token,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id="812434553636-nk0sd63psg9h3mjrqorf1jkvugglf7d8.apps.googleusercontent.com",
        client_secret="x6BHVdY60JkAt_1vyeeqPjpI",
        scopes=["https://www.googleapis.com/auth/calendar"],
    )
    # credentials.refresh(Request())

    now = datetime.datetime.utcnow().isoformat() + "Z"
    service = build("calendar", "v3", credentials=credentials)
    service.events().list(
        calendarId="primary",
        timeMin=now,
        maxResults=10,
        singleEvents=True,
        orderBy="startTime",
    ).execute()
    return HttpResponse("success!")

