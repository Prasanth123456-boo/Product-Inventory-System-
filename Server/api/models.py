import uuid
from django.db import models
from versatileimagefield.fields import VersatileImageField
from django.contrib.auth.models import User

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ProductID = models.BigIntegerField(unique=True)
    ProductCode = models.CharField(max_length=255, unique=True)
    ProductName = models.CharField(max_length=255)
    ProductImage = VersatileImageField(upload_to="uploads/", blank=True, null=True)
    CreatedDate = models.DateTimeField(auto_now_add=True)
    UpdatedDate = models.DateTimeField(blank=True, null=True)
    CreatedUser = models.ForeignKey(User, related_name="user_products", on_delete=models.CASCADE)
    IsFavourite = models.BooleanField(default=False)
    Active = models.BooleanField(default=True)
    HSNCode = models.CharField(max_length=255, blank=True, null=True)
    TotalStock = models.DecimalField(default=0.00, max_digits=20, decimal_places=8, blank=True, null=True)

    class Meta:
        db_table = "products_product"
        unique_together = (("ProductCode", "ProductID"),)
        ordering = ("-CreatedDate", "ProductID")

    def update_total_stock(self, quantity_added):
        self.TotalStock += quantity_added
        self.save()

        
class Variant(models.Model):
    product = models.ForeignKey(Product, related_name="variants", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

class SubVariant(models.Model):
    variant = models.ForeignKey(Variant, related_name="subvariants", on_delete=models.CASCADE)
    option = models.CharField(max_length=255)

class Stock(models.Model):
    subvariant = models.ForeignKey(SubVariant, related_name="stocks", on_delete=models.CASCADE)
    quantity = models.IntegerField()
    updated_date = models.DateTimeField(auto_now=True)

