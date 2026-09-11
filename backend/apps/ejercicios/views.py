from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.usuarios.permissions import EsProfesor
from .models import Accesorio, Ejercicio, Peso, Serie, Repeticion
from .serializers import (
    AccesorioSerializer, EjercicioSerializer, PesoSerializer,
    SerieSerializer, RepeticionSerializer,
)


class SoloLecturaParaAlumno:
    """RF.8, RF.9, RF.11: profesor gestiona (CRUD); alumno solo visualiza."""
    def get_permissions(self):
        if self.request.method not in ("GET", "HEAD", "OPTIONS"):
            return [EsProfesor()]
        return [IsAuthenticated()]


class AccesorioViewSet(SoloLecturaParaAlumno, viewsets.ModelViewSet):
    queryset = Accesorio.objects.all()
    serializer_class = AccesorioSerializer


class EjercicioViewSet(SoloLecturaParaAlumno, viewsets.ModelViewSet):
    queryset = Ejercicio.objects.all().prefetch_related("accesorios", "series", "pesos")
    serializer_class = EjercicioSerializer


class PesoViewSet(SoloLecturaParaAlumno, viewsets.ModelViewSet):
    queryset = Peso.objects.all()
    serializer_class = PesoSerializer


class SerieViewSet(SoloLecturaParaAlumno, viewsets.ModelViewSet):
    queryset = Serie.objects.all()
    serializer_class = SerieSerializer


class RepeticionViewSet(SoloLecturaParaAlumno, viewsets.ModelViewSet):
    queryset = Repeticion.objects.all()
    serializer_class = RepeticionSerializer
