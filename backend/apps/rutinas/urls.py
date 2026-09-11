from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("tipos", views.TipoRutinaViewSet, basename="tipo-rutina")
router.register("", views.RutinaViewSet, basename="rutina")

urlpatterns = router.urls
