import inject
from pomodoro_timer.domain.factory import Factory
from pomodoro_timer.domain.model.entity.user import User
from pomodoro_timer.domain.repository import (
    ITokenRepository,
    IGoogleRepository,
    IUserRepository,
)
from pomodoro_timer.domain.service.user_service import create_user_id


class UserUsecase:
    @inject.params(token_repository=ITokenRepository)
    @inject.params(google_repository=IGoogleRepository)
    @inject.params(user_repository=IUserRepository)
    def __init__(
        self,
        token_repository: ITokenRepository,
        google_repository: IGoogleRepository,
        user_repository: IUserRepository,
    ):
        self._token_repository = token_repository
        self._google_repository = google_repository
        self._user_repository = user_repository

    def login(self, code) -> User:
        token_response = self._token_repository.fetch_token(code)
        gmail_address = self._google_repository.get_gmail_address(token_response)
        id = create_user_id(gmail_address)
        user_factory = Factory()
        exists_user = self._user_repository.is_exist(id)
        if exists_user:
            user = self._user_repository.get_user(id)
            user.set_token(token_response)
            self._user_repository.update_user(user)
        else:
            user = user_factory.create_user(id, token_response)
            self._user_repository.register_user(user)
        return user

    def get_user_by_id(self, id: str) -> User:
        return self._user_repository.get_user(id)

    def update_user(self, id: str, user_dict: dict[str, str]) -> User:
        user = self._user_repository.get_for_update(id)
        user.set_user_data(user_dict)
        self._user_repository.update_user(user)
        return user
