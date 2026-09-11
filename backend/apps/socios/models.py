from django.db import models
from django.conf import settings


class EstadoSocio(models.TextChoices):
    """<<enum: Socio>> estado = Activo, Inactivo"""
    ACTIVO = "activo", "Activo"
    INACTIVO = "inactivo", "Inactivo"


class EstadoDescuento(models.TextChoices):
    ACTIVO = "activo", "Activo"
    INACTIVO = "inactivo", "Inactivo"


class Descuento(models.Model):
    """RF.21: crear y modificar descuentos."""
    nombre = models.CharField(max_length=100)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    codigo_descuento = models.CharField(max_length=30, unique=True)
    estado = models.CharField(
        max_length=10, choices=EstadoDescuento.choices, default=EstadoDescuento.ACTIVO
    )

    def __str__(self):
        return f"{self.nombre} ({self.codigo_descuento})"


class Socio(models.Model):
    """
    RF.27: agregar/modificar/visualizar socios.
    Incluye: nombre, apellido, DNI, fecha de inicio, fecha de vencimiento, estado.
    """
    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="socio"
    )
    nombre = models.CharField(max_length=150)
    apellido = models.CharField(max_length=150)
    dni = models.CharField(max_length=10)
    fecha_inicio = models.DateField()
    fecha_vencimiento = models.DateField()
    estado = models.CharField(
        max_length=10, choices=EstadoSocio.choices, default=EstadoSocio.ACTIVO
    )
    descuento = models.ForeignKey(
        Descuento, null=True, blank=True, on_delete=models.SET_NULL, related_name="socios"
    )

    def __str__(self):
        return f"{self.nombre} {self.apellido} - {self.dni}"
