from django.contrib.auth.models import User
from django.db import models


# Create your models here.
from rest_framework.authtoken.models import Token


class Todo(models.Model):
    title = models.CharField(max_length=75)
    description = models.TextField(default=False)
    is_completed = models.BooleanField(default=False)
    user = models.ForeignKey(User)

    def __unicode__(self):
        return self.title


