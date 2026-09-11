from rest_framework import serializers
from apps.ejercicios.serializers import EjercicioSerializer
from .models import TipoRutina, Rutina, Cronograma


class TipoRutinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoRutina
        fields = ["id", "nombre"]


class CronogramaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cronograma
        fields = ["id", "rutina", "dia", "enfoque"]


class RutinaSerializer(serializers.ModelSerializer):
    """
    Serializer de lectura: expone ejercicios completos (con series/pesos/accesorios)
    tal como lo necesita la pantalla de detalle de rutina de los mockups.
    """
    ejercicios = EjercicioSerializer(many=True, read_only=True)
    cronograma = CronogramaSerializer(many=True, read_only=True)
    tipo_rutina = TipoRutinaSerializer(read_only=True)

    class Meta:
        model = Rutina
        fields = [
            "id", "usuario", "tipo_rutina", "fecha_inicio", "objetivo",
            "nivel", "estado", "ejercicios", "cronograma", "plan_seguimiento",
        ]


class RutinaWriteSerializer(serializers.ModelSerializer):
    """Serializer de escritura: RF.12, RF.18, RF.19, RF.20 (crear/modificar/asociar)."""
    class Meta:
        model = Rutina
        fields = [
            "id", "usuario", "tipo_rutina", "fecha_inicio", "objetivo",
            "nivel", "estado", "ejercicios", "plan_seguimiento",
        ]
