from abc import ABC, abstractmethod

from pomodoro_timer.domain.model.entity.token import Token


class ITokenRepository(ABC):
    @abstractmethod
    def fetch_token(self, code: str) -> Token:
        raise NotImplementedError
