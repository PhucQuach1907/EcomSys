from django.apps import apps
from django.db import models


# Create your models here.
class Shipment(models.Model):
    payment_status_id = models.PositiveSmallIntegerField()
    client_name = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'shipment_updates'
