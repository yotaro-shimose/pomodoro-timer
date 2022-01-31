from pomodoro_timer.domain.model.entity.user import User
from pomodoro_timer.infrastructure.model import UserDjangoModel
from pomodoro_timer.domain.repository import IUserRepository


class UserRepository(IUserRepository):
    def is_exist(self, id: str) -> bool:
        return UserDjangoModel.objects.filter(pk=id).exists()

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
        django_user = UserDjangoModel.from_entity(user)
        UserDjangoModel.save(django_user)
        return user

    def update_user(self, user: User) -> User:
        django_user = UserDjangoModel.from_entity(user)
        UserDjangoModel.save(django_user)
        return user
