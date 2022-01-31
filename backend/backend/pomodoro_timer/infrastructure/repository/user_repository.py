from pomodoro_timer.domain.model.entity.user import User
from pomodoro_timer.infrastructure.model import UserDjangoModel
from pomodoro_timer.domain.repository import IUserRepository


class UserRepository(IUserRepository):
    def is_exist(self, user: User) -> bool:
        return UserDjangoModel.from_entity(user).objects.filter(pk=user.id).exists()

    def get_user(self, id: str) -> User:
        user_model: UserDjangoModel = UserDjangoModel.objects.get(id=id)
        return user_model.to_entity()

    def get_for_update(self, id: str) -> User:
        return (
            UserDjangoModel.objects.select_for_update()
            .filter(id=id)
            .first()
            .to_entity()
        )

    def register_user(self, user: User) -> User:
        UserDjangoModel.save(user)
        return user

    def update_user(self, user: User) -> User:
        UserDjangoModel.save(user)
        return user
