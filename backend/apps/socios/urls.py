from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("descuentos", views.DescuentoViewSet, basename="descuento")
router.register("", views.SocioViewSet, basename="socio")

urlpatterns = [
    path("certificado/", views.certificado_socio_activo, name="certificado_socio"),
] + router.urls
