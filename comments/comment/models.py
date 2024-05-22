from django.db import models


# Create your models here.
class Comment(models.Model):
    user_id = models.PositiveBigIntegerField()
    product_id = models.PositiveBigIntegerField()
    product_type = models.CharField(max_length=255)
    rating = models.PositiveIntegerField()
    content = models.TextField()

    class Meta:
        db_table = 'comment'
