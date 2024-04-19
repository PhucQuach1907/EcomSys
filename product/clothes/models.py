from djongo import models


# Create your models here.
class Type(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        db_table = 'clothes_type'

    def __str__(self):
        return self.name


class Clothes(models.Model):
    image = models.CharField(max_length=255)
    name = models.CharField(max_length=50)
    brand_name = models.CharField(max_length=50)
    type = models.ForeignKey(to=Type, null=True, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    price = models.BigIntegerField()

    class Meta:
        db_table = 'clothes'

    def __str__(self):
        return self.name
