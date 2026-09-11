from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.usuarios.permissions import EsProfesor
from .models import TipoRutina, Rutina
from .serializers import TipoRutinaSerializer, RutinaSerializer, RutinaWriteSerializer


class TipoRutinaViewSet(viewsets.ModelViewSet):
    """RF.14, RF.15: crear/modificar (profesor), visualizar (alumno y profesor)."""
    queryset = TipoRutina.objects.all()
    serializer_class = TipoRutinaSerializer

    def get_permissions(self):
        if self.request.method not in ("GET", "HEAD", "OPTIONS"):
            return [EsProfesor()]
        return [IsAuthenticated()]


class RutinaViewSet(viewsets.ModelViewSet):
    """
    RF.12, RF.13, RF.18, RF.19, RF.20.
    La lógica de create/update sigue el diagrama de secuencia "Crear rutina" /
    "Modificar rutina" del informe: validar datos -> aplicar reglas de negocio ->
    persistir -> confirmar. Los pasos 2 y 3 (validar/reglas) se resuelven acá;
    si la app crece, migrar a una capa de servicios (services.py) separada del view.
    """
    queryset = Rutina.objects.all().prefetch_related("ejercicios", "cronograma")

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return RutinaWriteSerializer
        return RutinaSerializer

    def get_queryset(self):
        user = self.request.user
        if user.es_profesor:
            return self.queryset
        return self.queryset.filter(usuario=user)  # RF.13: alumno ve solo su rutina

    def get_permissions(self):
        if self.request.method not in ("GET", "HEAD", "OPTIONS"):
            return [EsProfesor()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        # Paso "Validar datos de rutina" del diagrama de secuencia
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            # Rama [Datos inválidos] -> Mostrar error de validación
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # Rama [Datos válidos] -> Almacenar nueva rutina
        self.perform_create(serializer)
        return Response(
            RutinaSerializer(serializer.instance).data, status=status.HTTP_201_CREATED
        )
