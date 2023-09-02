# Generated by Django 4.1 on 2023-09-02 15:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_usershow_modified_at'),
    ]

    operations = [
        migrations.RenameField(
            model_name='usershow',
            old_name='show',
            new_name='showId',
        ),
        migrations.AddField(
            model_name='usershow',
            name='showName',
            field=models.TextField(default=''),
        ),
    ]
