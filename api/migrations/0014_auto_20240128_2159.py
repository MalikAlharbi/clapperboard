# Generated by Django 3.0.6 on 2024-01-28 18:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0013_alter_friendrequest_unique_together_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='usershow',
            name='favorite',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='usershow',
            name='watch_list',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='ShowsList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('showId', models.IntegerField(unique=True)),
                ('favorite', models.BooleanField(default=False)),
                ('watch_list', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
