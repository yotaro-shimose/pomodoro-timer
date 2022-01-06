import os
from pathlib import Path

CLIENT_SECRET_PATH = Path(".").joinpath(".google_auth", "client_secret.json")
CLIENT_ID = "812434553636-fgbcvbb4utqo944hef5lrhnmbe93rkia.apps.googleusercontent.com"
CLIENT_SECRET = "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"
REDIRECT_URI = "postmessage"
SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/tasks",
]
