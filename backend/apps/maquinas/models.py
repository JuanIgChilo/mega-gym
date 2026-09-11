from django.db import models


class EstadoMaquina(models.TextChoices):
    """<<enum: EstadoMaquina>> Estado = Activo, Inactivo, En Reparacion"""
    ACTIVO = "activo", "Activo"
    INACTIVO = "inactivo", "Inactivo"
    EN_REPARACION = "en_reparacion", "En Reparación"


class Maquina(models.Model):
    """RF.22, RF.23: gestión de máquinas y su estado."""
    nombre_maquina = models.CharField(max_length=150)
    fecha_mantenimiento = models.DateField(null=True, blank=True)
    estado = models.CharField(
        max_length=15, choices=EstadoMaquina.choices, default=EstadoMaquina.ACTIVO
    )

    def __str__(self):
        return self.nombre_maquina
