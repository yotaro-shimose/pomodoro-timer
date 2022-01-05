from pomodoro_timer.domain.repository import ITokenRepository

from pomodoro_timer.domain.model.entity.token import Token
from pomodoro_timer.constants import CLIENT_SECRET_PATH, SCOPES, REDIRECT_URI
from google_auth_oauthlib.flow import Flow


class TokenRepository(ITokenRepository):
    def fetch_token(self, code: str) -> Token:
        flow: Flow = Flow.from_client_secrets_file(
            str(CLIENT_SECRET_PATH), scopes=SCOPES, redirect_uri=REDIRECT_URI,
        )
        token = flow.fetch_token(code=code)
        return Token(token["access_token"], refresh_token=["refresh_token"])
