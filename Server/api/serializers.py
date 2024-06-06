from rest_framework import serializers
from .models import Product, Variant, SubVariant, Stock
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class SubVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubVariant
        fields = ['id', 'option']

class VariantSerializer(serializers.ModelSerializer):
    subvariants = SubVariantSerializer(many=True)

    class Meta:
        model = Variant
        fields = ['id', 'name', 'subvariants']

class ProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True)

    class Meta:
        model = Product
        fields = [
            'id', 'ProductID', 'ProductCode', 'ProductName', 'ProductImage', 
            'CreatedDate', 'UpdatedDate', 'CreatedUser', 'IsFavourite', 
            'Active', 'HSNCode', 'TotalStock', 'variants'
        ]
        extra_kwargs = {'ProductID': {'required': False}}

    def create(self, validated_data):
        variants_data = validated_data.pop('variants')
        product = Product.objects.create(**validated_data)
        for variant_data in variants_data:
            subvariants_data = variant_data.pop('subvariants')
            variant = Variant.objects.create(product=product, **variant_data)
            for subvariant_data in subvariants_data:
                SubVariant.objects.create(variant=variant, **subvariant_data)
        return product

class StockSerializer(serializers.ModelSerializer):
    product_code = serializers.CharField(source='subvariant.variant.product.ProductCode', read_only=True)

    class Meta:
        model = Stock
        fields = ['id', 'product_code', 'quantity', 'updated_date']


class ProductImageUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['ProductImage']