# Generated by Django 4.1.13 on 2024-04-19 03:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('book', '0003_alter_book_author_alter_book_publisher'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='image',
            field=models.CharField(max_length=255),
        ),
    ]