from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from apps.usuarios.permissions import EsProfesor
from .models import Maquina
from .serializers import MaquinaSerializer


class MaquinaViewSet(viewsets.ModelViewSet):
    """RF.22, RF.23: crear y modificar máquinas y su estado (solo Profesor)."""
    queryset = Maquina.objects.all()
    serializer_class = MaquinaSerializer

    def get_permissions(self):
        if self.request.method not in ("GET", "HEAD", "OPTIONS"):
            return [EsProfesor()]
        return [IsAuthenticated()]
