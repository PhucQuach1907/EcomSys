# Generated by Django 4.1.13 on 2024-05-21 07:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Producer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'mobile_producer',
            },
        ),
        migrations.CreateModel(
            name='Type',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'mobile_type',
            },
        ),
        migrations.CreateModel(
            name='Mobile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='images/')),
                ('name', models.CharField(max_length=50)),
                ('quantity', models.IntegerField()),
                ('price', models.BigIntegerField()),
                ('producer', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='mobile.producer')),
                ('type', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='mobile.type')),
            ],
            options={
                'db_table': 'mobiles',
            },
        ),
    ]
