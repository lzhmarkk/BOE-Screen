# Generated by Django 2.2.3 on 2020-03-19 09:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('boe_screen', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Class',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=10)),
                ('value', models.PositiveIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='ProdLine',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('prod_line_name', models.TextField(max_length=100)),
                ('image_size', models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.AddField(
            model_name='image',
            name='mask',
            field=models.ImageField(null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='image',
            name='pred',
            field=models.PositiveIntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='image',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.CreateModel(
            name='ImageClass',
            fields=[
                ('class_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='boe_screen.Class')),
            ],
            bases=('boe_screen.class',),
        ),
        migrations.CreateModel(
            name='ProdLineClass',
            fields=[
                ('class_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='boe_screen.Class')),
                ('prod_line', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='boe_screen.ProdLine')),
            ],
            bases=('boe_screen.class',),
        ),
        migrations.DeleteModel(
            name='Mask',
        ),
        migrations.AddField(
            model_name='image',
            name='prod_line',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='boe_screen.ProdLine'),
        ),
        migrations.AddField(
            model_name='imageclass',
            name='image',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='boe_screen.Image'),
        ),
    ]
