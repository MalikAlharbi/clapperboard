# Generated by Django 4.1 on 2023-09-03 15:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_rename_show_usershow_showid_usershow_showname'),
    ]

    operations = [
        migrations.AddField(
            model_name='usershow',
            name='modified_index',
            field=models.IntegerField(default=-1),
        ),
    ]
