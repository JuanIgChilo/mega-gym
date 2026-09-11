from rest_framework import serializers
from .models import Descuento, Socio


class DescuentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Descuento
        fields = ["id", "nombre", "fecha_inicio", "fecha_fin", "codigo_descuento", "estado"]


class SocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Socio
        fields = [
            "id", "usuario", "nombre", "apellido", "dni",
            "fecha_inicio", "fecha_vencimiento", "estado", "descuento",
        ]
