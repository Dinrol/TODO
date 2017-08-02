
from django.shortcuts import render
from django.views.generic import FormView
from rest_framework import viewsets

from polls.forms import RegisterForm
from polls.models import Todo
from polls.permissions import IsOwnerOrReadOnly
from .serializers import TodoSerializer


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = (IsOwnerOrReadOnly,)

    def get_queryset(self):
        user = self.request.user
        return self.queryset.filter(user=user)

    def create(self, request, *args, **kwargs):
        request.data['user'] = request.user.id
        return super(TodoViewSet, self).create(request, *args, **kwargs)


def index(request):
    return render(request, 'core/index.html')


class RegisterFormView(FormView):
    form_class = RegisterForm

    # Ссылка, на которую будет перенаправляться пользователь в случае успешной регистрации.
    # В данном случае указана ссылка на страницу входа для зарегистрированных пользователей.
    success_url = "/login/"

    # Шаблон, который будет использоваться при отображении представления.
    template_name = "core/../static/templates/register.html"

    def form_valid(self, form):
        # Создаём пользователя, если данные в форму были введены корректно.
        form.save()

        # Вызываем метод базового класса
        return super(RegisterFormView, self).form_valid(form)



