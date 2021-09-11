import json
from django.http import HttpResponse
from django.http.request import HttpRequest
from google.oauth2.credentials import Credentials


def get_task(request: HttpRequest):
    access_token = request.GET["access_token"]
    refresh_token = request.GET["refresh_token"]

    credentials = Credentials(
        access_token,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id="812434553636-nk0sd63psg9h3mjrqorf1jkvugglf7d8.apps.googleusercontent.com",
        client_secret="x6BHVdY60JkAt_1vyeeqPjpI",
    )
    return HttpResponse("success!")

