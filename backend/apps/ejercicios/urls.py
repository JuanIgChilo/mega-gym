from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("accesorios", views.AccesorioViewSet, basename="accesorio")
router.register("pesos", views.PesoViewSet, basename="peso")
router.register("series", views.SerieViewSet, basename="serie")
router.register("repeticiones", views.RepeticionViewSet, basename="repeticion")
router.register("", views.EjercicioViewSet, basename="ejercicio")

urlpatterns = router.urls
