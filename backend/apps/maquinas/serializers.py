from rest_framework import serializers
from .models import Maquina


class MaquinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maquina
        fields = ["id", "nombre_maquina", "fecha_mantenimiento", "estado"]
