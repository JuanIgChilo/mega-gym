from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("lineas", views.LineaSeguimientoViewSet, basename="linea-seguimiento")
router.register("", views.SeguimientoViewSet, basename="seguimiento")

urlpatterns = router.urls
