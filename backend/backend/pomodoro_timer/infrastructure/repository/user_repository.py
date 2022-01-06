from pomodoro_timer.domain.model.entity.user import User
from pomodoro_timer.domain.repository import IUserRepository


class UserRepository(IUserRepository):
    def is_exist(self, user: User) -> bool:
        return User.objects.filter(pk=user.id).exists()

    def get_user(self, id: str) -> User:
        return User.objects.get(id=id)

    def get_for_update(self, id: str) -> User:
        return User.objects.select_for_update().filter(id=id).first()

    def register_user(self, user: User) -> User:
        User.save(user)
        return user

    def update_user(self, user: User) -> User:
        User.save(user)
        return user
