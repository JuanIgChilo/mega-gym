from django.db import models
from django.conf import settings


class TipoObjetivo(models.TextChoices):
    """<<enum: TipoObjetivo>>"""
    PERDIDA_PESO = "perdida_peso", "Pérdida de peso"
    INCREMENTO_MUSCULAR = "incremento_muscular", "Incremento muscular"
    RECOMPOSICION_CORPORAL = "recomposicion_corporal", "Recomposición corporal"
    MANTENIMIENTO = "mantenimiento", "Mantenimiento"


class Seguimiento(models.Model):
    """
    RF.5, RF.6, RF.7: plan de seguimiento del alumno.
    Incluye: objetivo, fecha de inicio, fecha de fin, peso actual, peso objetivo,
    fecha de actualización.
    """
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="planes_seguimiento"
    )
    objetivo = models.CharField(max_length=30, choices=TipoObjetivo.choices)
    fecha_inicio = models.DateField()
    fecha_objetivo = models.DateField()
    peso_actual = models.FloatField()
    peso_objetivo = models.FloatField()

    def __str__(self):
        return f"Seguimiento {self.id} - {self.usuario}"


class LineaSeguimiento(models.Model):
    """Historial de avances dentro de un plan de seguimiento."""
    seguimiento = models.ForeignKey(
        Seguimiento, on_delete=models.CASCADE, related_name="lineas"
    )
    fecha_actualizacion = models.DateField(auto_now_add=True)
    peso_actualizacion = models.FloatField()

    class Meta:
        ordering = ["-fecha_actualizacion"]
