from django.db import models
from django.conf import settings


class NivelRutina(models.TextChoices):
    """<<enum: Rutina>> Nivel = Adaptativo, Intermedio, Avanzado"""
    ADAPTATIVO = "adaptativo", "Adaptativo"
    INTERMEDIO = "intermedio", "Intermedio"
    AVANZADO = "avanzado", "Avanzado"


class EstadoRutina(models.TextChoices):
    """<<enum: Rutina>> estado = Activa, Inactiva"""
    ACTIVA = "activa", "Activa"
    INACTIVA = "inactiva", "Inactiva"


class TipoRutina(models.Model):
    """RF.14, RF.15: tipos de rutina (Incluye: nombre del tipo de rutina)."""
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Rutina(models.Model):
    """
    RF.12, RF.13: crear/modificar/visualizar rutina.
    Incluye: fecha de inicio, objetivo, nivel, estado.
    """
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="rutinas"
    )  # RF.19: asociar la rutina con un usuario
    tipo_rutina = models.ForeignKey(
        TipoRutina, on_delete=models.SET_NULL, null=True, related_name="rutinas"
    )
    fecha_inicio = models.DateField()
    objetivo = models.CharField(max_length=200)
    nivel = models.CharField(max_length=15, choices=NivelRutina.choices)
    estado = models.CharField(
        max_length=10, choices=EstadoRutina.choices, default=EstadoRutina.ACTIVA
    )
    ejercicios = models.ManyToManyField(
        "ejercicios.Ejercicio", blank=True, related_name="rutinas"
    )  # RF.18: asociar la rutina con ejercicios
    plan_seguimiento = models.ForeignKey(
        "seguimiento.Seguimiento",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="rutinas",
    )  # RF.20: asociar la rutina con un plan de seguimiento

    def __str__(self):
        return f"Rutina {self.id} - {self.usuario}"


class Cronograma(models.Model):
    """RF.16, RF.17: cronograma de la rutina (Incluye: dia, enfoque)."""
    rutina = models.ForeignKey(Rutina, on_delete=models.CASCADE, related_name="cronograma")
    dia = models.CharField(max_length=20)
    enfoque = models.CharField(max_length=100)  # ej: Espalda, Biceps, Triceps, Hombros

    def __str__(self):
        return f"{self.dia} - {self.enfoque}"
