# Generated by Django 4.1.13 on 2024-05-09 03:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_info', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_delivery_office',
            field=models.BooleanField(default=False),
        ),
    ]