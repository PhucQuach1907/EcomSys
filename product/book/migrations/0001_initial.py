# Generated by Django 4.1.13 on 2024-04-17 09:16

from django.db import migrations, models
import django.db.models.deletion
import djongo.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('address', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
            ],
            options={
                'db_table': 'book_authors',
            },
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'book_categories',
            },
        ),
        migrations.CreateModel(
            name='Publisher',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('address', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
            ],
            options={
                'db_table': 'book_publishers',
            },
        ),
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='images/')),
                ('name', models.CharField(max_length=50)),
                ('quantity', models.IntegerField(default=0)),
                ('price', models.BigIntegerField()),
                ('author', djongo.models.fields.ArrayReferenceField(on_delete=django.db.models.deletion.CASCADE, to='book.author')),
                ('categories', models.ManyToManyField(to='book.category')),
                ('publisher', djongo.models.fields.ArrayReferenceField(on_delete=django.db.models.deletion.CASCADE, to='book.publisher')),
            ],
            options={
                'db_table': 'books',
            },
        ),
    ]
