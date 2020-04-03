# Generated by Django 2.2.3 on 2020-04-03 11:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('boe_screen', '0005_auto_20200329_1211'),
    ]

    operations = [
        migrations.CreateModel(
            name='Texture',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('texture_name', models.TextField(max_length=100)),
                ('image_size', models.PositiveIntegerField(default=0)),
                ('bad_count', models.PositiveIntegerField(default=0, null=True)),
                ('dirt_count', models.PositiveIntegerField(default=0, null=True)),
                ('sum_dirt_size', models.PositiveIntegerField(default=0)),
                ('min_dirt_size', models.PositiveIntegerField(default=0)),
                ('max_dirt_size', models.PositiveIntegerField(default=0)),
                ('sum_bad_size', models.PositiveIntegerField(default=0)),
                ('min_bad_size', models.PositiveIntegerField(default=0)),
                ('max_bad_size', models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.RemoveField(
            model_name='prodlineclass',
            name='prod_line',
        ),
        migrations.RemoveField(
            model_name='image',
            name='prod_line',
        ),
        migrations.DeleteModel(
            name='ImageClass',
        ),
        migrations.DeleteModel(
            name='ProdLine',
        ),
        migrations.DeleteModel(
            name='ProdLineClass',
        ),
        migrations.AddField(
            model_name='image',
            name='texture',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='boe_screen.Texture'),
        ),
    ]