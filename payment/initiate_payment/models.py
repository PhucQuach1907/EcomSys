from django.db import models
from django.apps import apps


# Create your models here.
class Payment(models.Model):
    user = models.ForeignKey(apps.get_model(app_label='user.user', model_name='User'), on_delete=models.CASCADE)
    cart_items = models.ManyToManyField(apps.get_model(app_label='cart.cart_item', model_name='CartItem'))
    total_price = models.BigIntegerField()
    payment_mode = models.CharField(max_length=50)

    def calculate_total_price(self):
        total_price = 0
        for item in self.cart_items.all():
            total_price += item.subtotal
        self.total_price = total_price
        self.save()

    def save(self, *args, **kwargs):
        self.calculate_total_price()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payment {self.pk} by {self.user}"
