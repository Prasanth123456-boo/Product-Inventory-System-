from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Product, Stock, SubVariant
from .serializers import ProductSerializer, StockSerializer, UserSerializer
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.decorators import action
from django.db.models import Sum
from .serializers import ProductImageUpdateSerializer   
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

    @action(detail=False, methods=['post'])
    def create_by_product_code(self, request, *args, **kwargs):
        data = request.data
        print("Received data:", data)
        
        product_code = data.get('product_code')
        quantity = data.get('quantity')

        if not product_code or quantity is None:
            return Response({'error': 'Product code and quantity are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity = int(quantity)
            print("Parsed quantity:", quantity)
        except ValueError:
            return Response({'error': 'Quantity must be an integer.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(ProductCode=product_code)
            subvariant = SubVariant.objects.filter(variant__product=product).first()
            if not subvariant:
                return Response({'error': 'Subvariant not found for the given product code.'}, status=status.HTTP_404_NOT_FOUND)

            print("Found subvariant:", subvariant)

            stock, created = Stock.objects.get_or_create(subvariant=subvariant, defaults={'quantity': 0})
            print("Stock object:", stock, "Created:", created)

            stock.quantity += quantity
            stock.save()
            print("Updated stock quantity:", stock.quantity)

            product.TotalStock = Stock.objects.filter(subvariant__variant__product=product).aggregate(total_quantity=Sum('quantity'))['total_quantity'] or 0
            product.save()

            return Response({'status': 'Stock updated'}, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("Exception:", str(e))
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def remove_by_product_code(self, request, *args, **kwargs):
        data = request.data
        print("Received data:", data)

        product_code = data.get('product_code')
        quantity = data.get('quantity')

        if not product_code or quantity is None:
            return Response({'error': 'Product code and quantity are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity = int(quantity)
            print("Parsed quantity:", quantity)
        except ValueError:
            return Response({'error': 'Quantity must be an integer.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(ProductCode=product_code)
            subvariant = SubVariant.objects.filter(variant__product=product).first()
            if not subvariant:
                return Response({'error': 'Subvariant not found for the given product code.'}, status=status.HTTP_404_NOT_FOUND)

            print("Found subvariant:", subvariant)

            stock = Stock.objects.get(subvariant=subvariant)
            stock.quantity -= quantity
            if stock.quantity < 0:
                return Response({'error': 'Quantity cannot be negative.'}, status=status.HTTP_400_BAD_REQUEST)
            stock.save()

            product.TotalStock = Stock.objects.filter(subvariant__variant__product=product).aggregate(total_quantity=Sum('quantity'))['total_quantity'] or 0
            product.save()

            return Response({'status': 'Stock removed'}, status=status.HTTP_200_OK)
        except Stock.DoesNotExist:
            return Response({'error': 'Stock not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("Exception:", str(e))
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProductImageUpdateAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductImageUpdateSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)