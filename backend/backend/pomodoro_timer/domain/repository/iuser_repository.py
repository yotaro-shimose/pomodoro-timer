from abc import ABC, abstractmethod
from pomodoro_timer.domain.model.entity.user import User


class IUserRepository(ABC):
    @abstractmethod
    def is_exist(self, user: User) -> bool:
        raise NotImplementedError

    @abstractmethod
    def get_user(self, id: str) -> User:
        raise NotImplementedError

    @abstractmethod
    def get_for_update(self, id: str) -> User:
        raise NotImplementedError

    @abstractmethod
    def register_user(self, user: User) -> User:
        raise NotImplementedError

    @abstractmethod
    def update_user(self, user: User) -> User:
        raise NotImplementedError
