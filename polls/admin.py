from django.contrib import admin

# Register your models here.
from polls.models import Todo

admin.site.register(Todo)