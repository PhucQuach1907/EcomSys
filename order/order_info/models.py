from django.contrib.postgres.fields import ArrayField
from django.db import models


# Create your models here.
class Order(models.Model):
    user_id = models.PositiveBigIntegerField()
    username = models.CharField(max_length=255, blank=True, null=True)
    cart_items = ArrayField(models.PositiveBigIntegerField())
    total_price = models.BigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'order_info'
