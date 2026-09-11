from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView
from . import views

router = DefaultRouter()
router.register("comentarios", views.ComentarioViewSet, basename="comentario")
router.register("", views.UsuarioViewSet, basename="usuario")

urlpatterns = [
    path("auth/login-alumno/", views.login_alumno, name="login_alumno"),
    path("auth/login-profesor/", TokenObtainPairView.as_view(), name="login_profesor"),
    path("me/", views.mi_perfil, name="mi_perfil"),
    path("", include(router.urls)),
]
