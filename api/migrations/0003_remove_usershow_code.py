# Generated by Django 3.0.6 on 2023-06-20 20:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20230620_2259'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usershow',
            name='code',
        ),
    ]
