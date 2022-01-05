from datetime import datetime

import inject
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from pomodoro_timer.constants import CLIENT_ID, CLIENT_SECRET, SCOPES
from pomodoro_timer.domain.factory.factory import Factory
from pomodoro_timer.domain.model.entity.calendar import Calendar
from pomodoro_timer.domain.model.entity.event import Event
from pomodoro_timer.domain.model.entity.task import Task
from pomodoro_timer.domain.model.entity.task_list import TaskList
from pomodoro_timer.domain.model.entity.token import Token
from pomodoro_timer.domain.model.entity.user import User
from pomodoro_timer.domain.repository import IGoogleRepository, IUserRepository
import os


class GoogleRepository(IGoogleRepository):
    def __init__(
        self, user_repository: IUserRepository,
    ):
        os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "1"
        self._user_repository = user_repository

    def _get_credentials(self, user: User) -> Credentials:
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

    def get_gmail_address(self, token: Token) -> str:
        credentials = Credentials(
            token=token.access_token,
            refresh_token=token.refresh_token,
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
        return gmail_address

    def get_task_list(self, id: str) -> list[TaskList]:
        user = self._user_repository.get_user(id)
        credentials = self._get_credentials(user)
        service = build("tasks", "v1", credentials=credentials)
        items = service.tasklists().list().execute().get("items")
        return Factory().create_task_list(items)

    def get_task(self, id: str) -> list[Task]:
        user = self._user_repository.get_user(id)
        credentials = self._get_credentials(user)

        task_list_id = user.task_list_id
        service = build("tasks", "v1", credentials=credentials)
        items = (
            service.tasks()
            .list(tasklist=task_list_id, showCompleted=False)
            .execute()
            .get("items")
        )
        return Factory().create_task(items)

    def get_calendar(self, id: str) -> list[Calendar]:
        user = self._user_repository.get_user(id)
        credentials = self._get_credentials(user)
        service = build("calendar", "v3", credentials=credentials)
        google_response = service.calendarList().list(showHidden=True).execute()
        calendar_list = google_response["items"]
        return Factory().create_calendar(calendar_list)

    def register_event(self, id: str, event: Event):
        user = self._user_repository.get_user(id)
        credentials = self._get_credentials(user)
        service = build("calendar", "v3", credentials=credentials)
        google_request = {
            "calendarId": user.calendar_id,
            "body": {
                "start": {
                    "dateTime": datetime.strptime(
                        event.start_time, r"%Y-%m-%d %H:%M:%S"
                    ).isoformat(),
                    "timeZone": "Asia/Tokyo",
                },
                "end": {
                    "dateTime": datetime.strptime(
                        event.end_time, r"%Y-%m-%d %H:%M:%S"
                    ).isoformat(),
                    "timeZone": "Asia/Tokyo",
                },
                "summary": event.task.name,
            },
        }
        try:
            _google_response = service.events().insert(**google_request).execute()
        except Exception as e:
            print(e)
