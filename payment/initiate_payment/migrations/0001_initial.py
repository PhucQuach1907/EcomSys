# Generated by Django 4.1.13 on 2024-05-22 03:22

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.PositiveBigIntegerField(blank=True, null=True)),
                ('username', models.CharField(blank=True, max_length=255, null=True)),
                ('order_id', models.PositiveBigIntegerField(blank=True, null=True)),
                ('total_price', models.BigIntegerField()),
                ('payment_mode', models.CharField(max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'init_payment',
            },
        ),
    ]
