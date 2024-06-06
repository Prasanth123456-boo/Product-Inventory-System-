# api/urls.py
from django.urls import path
from .views import UserCreateView, ProductViewSet, StockViewSet,ProductImageUpdateAPIView

# Define the view sets as individual endpoints
product_list = ProductViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

product_detail = ProductViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})

stock_list = StockViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

stock_detail = StockViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})

# Define custom actions
create_by_product_code = StockViewSet.as_view({
    'post': 'create_by_product_code'
})

remove_by_product_code = StockViewSet.as_view({
    'post': 'remove_by_product_code'
})

urlpatterns = [
    path('products/', product_list, name='product-list'),
     path('products/<uuid:pk>/', ProductViewSet.as_view({'get': 'retrieve'}), name='product-detail'),
    path('stock/', stock_list, name='stock-list'),
    path('stock/<int:pk>/', stock_detail, name='stock-detail'),
    path('stock/create-by-product-code/', create_by_product_code, name='create-by-product-code'),
    path('stock/remove-by-product-code/', remove_by_product_code, name='remove-by-product-code'),
    path('register/', UserCreateView.as_view(), name='user-register'),
    path('products/<uuid:pk>/update-image/', ProductImageUpdateAPIView.as_view(), name='product-image-update'),
]
