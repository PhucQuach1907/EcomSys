# Generated by Django 4.1.13 on 2024-05-22 08:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comment', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='product_type',
            field=models.CharField(default='books', max_length=255),
            preserve_default=False,
        ),
    ]
